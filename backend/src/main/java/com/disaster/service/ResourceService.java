package com.disaster.service;

import com.disaster.dto.ResourceRequest;
import com.disaster.dto.ResourceResponse;
import com.disaster.entity.Resource;
import com.disaster.exception.ResourceNotFoundException;
import com.disaster.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * CRUD for Resource. availableQuantity is NEVER written directly by
 * this service (or by DonationService / ResourceAllocationService) —
 * the DB trigger does the arithmetic, and we refresh the entity after
 * inserts to keep Hibernate's view in sync. See the header comment
 * on Resource.java for the full pattern.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public List<ResourceResponse> findAll() {
        return resourceRepository.findAll().stream()
                .map(ResourceService::toResponse)
                .toList();
    }

    public ResourceResponse findById(Long id) {
        return toResponse(getOrThrow(id));
    }

    public ResourceResponse create(ResourceRequest req) {
        Resource r = Resource.builder()
                .resourceName(req.getResourceName())
                .category(req.getCategory())
                .totalQuantity(req.getInitialQuantity())
                .availableQuantity(req.getInitialQuantity())
                .build();
        return toResponse(resourceRepository.save(r));
    }

    public ResourceResponse update(Long id, ResourceRequest req) {
        Resource r = getOrThrow(id);
        r.setResourceName(req.getResourceName());
        r.setCategory(req.getCategory());
        // The DB has a CHECK constraint that available_quantity <= total_quantity.
        // We do not adjust totals here on update; quantity is mutated by
        // donation / allocation flows, not by direct edits.
        return toResponse(r);
    }

    public void delete(Long id) {
        if (!resourceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Resource not found: " + id);
        }
        resourceRepository.deleteById(id);
    }

    private Resource getOrThrow(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found: " + id));
    }

    static ResourceResponse toResponse(Resource r) {
        return ResourceResponse.builder()
                .resourceId(r.getResourceId())
                .resourceName(r.getResourceName())
                .category(r.getCategory())
                .totalQuantity(r.getTotalQuantity())
                .availableQuantity(r.getAvailableQuantity())
                .build();
    }
}
