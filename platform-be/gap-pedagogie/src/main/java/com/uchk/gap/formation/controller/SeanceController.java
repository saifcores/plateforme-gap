package com.uchk.gap.formation.controller;

import com.uchk.gap.formation.dto.SeanceDto;
import com.uchk.gap.formation.dto.SeanceRequest;
import com.uchk.gap.formation.service.SeanceService;
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
@RequestMapping("/api/formations/{formationId}/seances")
public class SeanceController {

    private final SeanceService service;

    public SeanceController(SeanceService service) {
        this.service = service;
    }

    @GetMapping
    public List<SeanceDto> findByFormation(@PathVariable Long formationId) {
        return service.findByFormation(formationId);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','ADMINISTRATIF','RESPONSABLE_FORMATION','ENSEIGNANT')")
    @ResponseStatus(HttpStatus.CREATED)
    public SeanceDto create(@PathVariable Long formationId, @Valid @RequestBody SeanceRequest request) {
        return service.create(formationId, request);
    }

    @PutMapping("/{seanceId}")
    @PreAuthorize("hasAnyRole('ADMIN','ADMINISTRATIF','RESPONSABLE_FORMATION','ENSEIGNANT')")
    public SeanceDto update(@PathVariable Long formationId,
            @PathVariable Long seanceId,
            @Valid @RequestBody SeanceRequest request) {
        return service.update(formationId, seanceId, request);
    }

    @DeleteMapping("/{seanceId}")
    @PreAuthorize("hasAnyRole('ADMIN','ADMINISTRATIF','RESPONSABLE_FORMATION','ENSEIGNANT')")
    public ResponseEntity<Void> delete(@PathVariable Long formationId, @PathVariable Long seanceId) {
        service.delete(seanceId);
        return ResponseEntity.noContent().build();
    }
}
