package com.uchk.gap.formation.controller;

import com.uchk.gap.formation.dto.ReunionDto;
import com.uchk.gap.formation.dto.ReunionRequest;
import com.uchk.gap.formation.service.ReunionService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/formations/{formationId}/reunions")
public class ReunionController {

    private final ReunionService service;

    public ReunionController(ReunionService service) {
        this.service = service;
    }

    @GetMapping
    public List<ReunionDto> findByFormation(@PathVariable Long formationId) {
        return service.findByFormation(formationId);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','ADMINISTRATIF','RESPONSABLE_FORMATION','ENSEIGNANT')")
    @ResponseStatus(HttpStatus.CREATED)
    public ReunionDto create(
            @PathVariable Long formationId,
            @Valid @RequestBody ReunionRequest request) {
        return service.create(formationId, request);
    }

    @PutMapping("/{reunionId}")
    @PreAuthorize("hasAnyRole('ADMIN','ADMINISTRATIF','RESPONSABLE_FORMATION','ENSEIGNANT')")
    public ReunionDto update(
            @PathVariable Long formationId,
            @PathVariable Long reunionId,
            @Valid @RequestBody ReunionRequest request) {
        return service.update(formationId, reunionId, request);
    }

    @DeleteMapping("/{reunionId}")
    @PreAuthorize("hasAnyRole('ADMIN','ADMINISTRATIF','RESPONSABLE_FORMATION')")
    public ResponseEntity<Void> delete(
            @PathVariable Long formationId,
            @PathVariable Long reunionId) {
        service.delete(reunionId);
        return ResponseEntity.noContent().build();
    }
}
