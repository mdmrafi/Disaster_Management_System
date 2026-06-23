package com.disaster.service;

import com.disaster.dto.DonationRequest;
import com.disaster.dto.DonationResponse;
import com.disaster.entity.Donation;
import com.disaster.entity.Disaster;
import com.disaster.entity.Resource;
import com.disaster.exception.ResourceNotFoundException;
import com.disaster.repository.DonationRepository;
import com.disaster.repository.DisasterRepository;
import com.disaster.repository.ResourceRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Donation flow — option (a) interaction with the DB trigger:
 *   1. Save the donation row.
 *   2. The trg_donation_update_stock trigger fires and increments
 *      total_quantity + available_quantity on the linked resource.
 *   3. We refresh the Resource entity so the in-memory copy matches
 *      the new stock values, then map to the response.
 *
 * If the trigger rejects the insert (e.g. CHECK violation), Spring
 * surfaces a DataIntegrityViolationException which the global handler
 * maps to 409.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class DonationService {

    private final DonationRepository donationRepository;
    private final ResourceRepository resourceRepository;
    private final DisasterRepository disasterRepository;
    private final EntityManager entityManager;

    public List<DonationResponse> findAll() {
        return donationRepository.findAll().stream()
                .map(DonationService::toResponse)
                .toList();
    }

    public DonationResponse findById(Long id) {
        return toResponse(getOrThrow(id));
    }

    public DonationResponse create(DonationRequest req) {
        Disaster disaster = disasterRepository.findById(req.getDisasterId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Disaster not found: " + req.getDisasterId()));
        Resource resource = resourceRepository.findById(req.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Resource not found: " + req.getResourceId()));

        Donation d = Donation.builder()
                .donorName(req.getDonorName())
                .donationDate(req.getDonationDate())
                .disaster(disaster)
                .resource(resource)
                .quantity(req.getQuantity())
                .build();
        Donation saved = donationRepository.save(d);

        // Trigger has updated the row. Pull the new totals into the
        // managed entity so any subsequent code (and the response mapping
        // helpers in this service) sees the post-trigger values.
        entityManager.refresh(resource);
        return toResponse(saved);
    }

    public void delete(Long id) {
        Donation d = getOrThrow(id);
        Resource resource = d.getResource();
        donationRepository.delete(d);
        // No trigger reverses the stock on delete in v1. We just refresh
        // so the cached state is consistent if the caller continues to
        // touch the entity.
        entityManager.refresh(resource);
    }

    private Donation getOrThrow(Long id) {
        return donationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found: " + id));
    }

    static DonationResponse toResponse(Donation d) {
        return DonationResponse.builder()
                .donationId(d.getDonationId())
                .donorName(d.getDonorName())
                .donationDate(d.getDonationDate())
                .disasterId(d.getDisaster().getDisasterId())
                .disasterName(d.getDisaster().getDisasterName())
                .resourceId(d.getResource().getResourceId())
                .resourceName(d.getResource().getResourceName())
                .quantity(d.getQuantity())
                .build();
    }
}
