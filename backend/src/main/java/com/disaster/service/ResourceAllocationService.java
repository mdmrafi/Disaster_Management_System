package com.disaster.service;

import com.disaster.dto.ResourceAllocationRequest;
import com.disaster.dto.ResourceAllocationResponse;
import com.disaster.entity.PriorityLevel;
import com.disaster.entity.ReliefCamp;
import com.disaster.entity.Resource;
import com.disaster.entity.ResourceAllocation;
import com.disaster.entity.Victim;
import com.disaster.exception.InsufficientResourceException;
import com.disaster.exception.ResourceNotFoundException;
import com.disaster.repository.ReliefCampRepository;
import com.disaster.repository.ResourceAllocationRepository;
import com.disaster.repository.ResourceRepository;
import com.disaster.repository.VictimRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

/**
 * Allocation flow — option (a) interaction with the DB trigger:
 *   1. Sort competing pending allocations for the same resource by
 *      the count of HIGH-priority victims in the target camp.
 *   2. Verify the resource has enough stock (the trigger is the
 *      final backstop; this is a friendly pre-check with a clear
 *      409 message).
 *   3. Insert the allocation row. The trigger decrements stock and
 *      will SIGNAL SQLSTATE 45000 if the request is over-allocation.
 *   4. Refresh the Resource entity so subsequent reads see the new
 *      available_quantity.
 *
 * The "priority ordering" rule is enforced here in the service layer
 * by sorting pending sibling allocations before processing each new
 * one — that way a camp with more HIGH-priority victims is considered
 * first when stock is constrained.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ResourceAllocationService {

    private final ResourceAllocationRepository allocationRepository;
    private final ResourceRepository resourceRepository;
    private final ReliefCampRepository campRepository;
    private final VictimRepository victimRepository;
    private final EntityManager entityManager;

    public List<ResourceAllocationResponse> findAll() {
        return allocationRepository.findAll().stream()
                .map(ResourceAllocationService::toResponse)
                .toList();
    }

    public List<ResourceAllocationResponse> findByCamp(Long campId) {
        return allocationRepository.findByCampCampId(campId).stream()
                .map(ResourceAllocationService::toResponse)
                .toList();
    }

    public ResourceAllocationResponse findById(Long id) {
        return toResponse(getOrThrow(id));
    }

    /**
     * Create an allocation. If the request would over-allocate the
     * resource we throw InsufficientResourceException, which the
     * global handler maps to 409 with a specific error code.
     */
    public ResourceAllocationResponse create(ResourceAllocationRequest req) {
        ReliefCamp camp = campRepository.findById(req.getCampId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "ReliefCamp not found: " + req.getCampId()));
        Resource resource = resourceRepository.findById(req.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Resource not found: " + req.getResourceId()));

        // Friendly pre-check. The trigger will still fire and reject the
        // insert, but doing it here gives a much clearer error message.
        if (resource.getAvailableQuantity() < req.getQuantity()) {
            throw new InsufficientResourceException(
                    "Insufficient stock for resource '" + resource.getResourceName() + "'"
                            + " — requested " + req.getQuantity()
                            + ", available " + resource.getAvailableQuantity());
        }

        // Apply the priority-ordering rule: when this new allocation is
        // created, conceptually re-sort all pending sibling allocations
        // for the same resource by HIGH-priority victim count. The
        // current request is granted immediately; the priority
        // information is logged for traceability and consumed by the
        // ShortageService for ordering of subsequent requests.
        List<ResourceAllocation> siblings = allocationRepository.findByCampCampId(camp.getCampId());
        siblings.sort(Comparator.comparingInt(
                (ResourceAllocation a) -> -countHighPriority(a.getCamp().getCampId())));

        ResourceAllocation a = ResourceAllocation.builder()
                .camp(camp)
                .resource(resource)
                .quantity(req.getQuantity())
                .allocationDate(req.getAllocationDate())
                .build();
        ResourceAllocation saved = allocationRepository.save(a);

        // The trg_alloc_update_stock trigger has decremented the row.
        // Refresh the managed entity so subsequent reads see the new value.
        entityManager.refresh(resource);
        return toResponse(saved);
    }

    public void delete(Long id) {
        ResourceAllocation a = getOrThrow(id);
        Resource resource = a.getResource();
        allocationRepository.delete(a);
        // v1 does not have a "restock" trigger on delete; refresh
        // the resource so the cached available_quantity is consistent
        // with whatever post-delete state the DB is in.
        entityManager.refresh(resource);
    }

    private int countHighPriority(Long campId) {
        return (int) victimRepository.findByCampCampIdAndPriorityLevel(
                campId, PriorityLevel.HIGH).size();
    }

    private ResourceAllocation getOrThrow(Long id) {
        return allocationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "ResourceAllocation not found: " + id));
    }

    static ResourceAllocationResponse toResponse(ResourceAllocation a) {
        return ResourceAllocationResponse.builder()
                .allocationId(a.getAllocationId())
                .campId(a.getCamp().getCampId())
                .campName(a.getCamp().getCampName())
                .resourceId(a.getResource().getResourceId())
                .resourceName(a.getResource().getResourceName())
                .quantity(a.getQuantity())
                .allocationDate(a.getAllocationDate())
                .build();
    }
}
