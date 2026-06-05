package com.uchk.gap.formation.controller;

import com.uchk.gap.common.PageResponse;
import com.uchk.gap.formation.dto.AssignFormateurRequest;
import com.uchk.gap.formation.dto.FormationDto;
import com.uchk.gap.formation.dto.FormationFormateurDto;
import com.uchk.gap.formation.dto.FormationRequest;
import com.uchk.gap.formation.dto.StatGenreDto;
import com.uchk.gap.formation.service.FormationFormateurService;
import com.uchk.gap.formation.service.FormationService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/formations")
public class FormationController {

    private final FormationService service;
    private final FormationFormateurService formationFormateurService;

    public FormationController(
            FormationService service,
            FormationFormateurService formationFormateurService) {
        this.service = service;
        this.formationFormateurService = formationFormateurService;
    }


    @GetMapping("/options")
    public List<FormationDto> options() {
        return service.findAll();
    }

    @GetMapping
    public PageResponse<FormationDto> search(
            @RequestParam(required = false) String q,
            @PageableDefault(size = 10, sort = "intitule") Pageable pageable) {
        return service.search(q, pageable);
    }

    @GetMapping("/{id}")
    public FormationDto findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping("/{id}/stats-genre")
    public List<StatGenreDto> statsGenre(@PathVariable Long id) {
        return formationFormateurService.statsGenre(id);
    }

    @GetMapping("/{id}/formateurs")
    public List<FormationFormateurDto> formateursAffectes(@PathVariable Long id) {
        return formationFormateurService.findByFormation(id);
    }

    @PostMapping("/{id}/formateurs")
    @PreAuthorize("hasAnyRole('ADMIN','ADMINISTRATIF','RESPONSABLE_FORMATION')")
    @ResponseStatus(HttpStatus.CREATED)
    public FormationFormateurDto affecterFormateur(
            @PathVariable Long id,
            @Valid @RequestBody AssignFormateurRequest request) {
        return formationFormateurService.assign(
                id, request.formateurId(), request.roleDansFormation());
    }

    @DeleteMapping("/{id}/formateurs/{formateurId}")
    @PreAuthorize("hasAnyRole('ADMIN','ADMINISTRATIF','RESPONSABLE_FORMATION')")
    public ResponseEntity<Void> retirerFormateur(
            @PathVariable Long id,
            @PathVariable Long formateurId) {
        formationFormateurService.unassign(id, formateurId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','ADMINISTRATIF','RESPONSABLE_FORMATION')")
    @ResponseStatus(HttpStatus.CREATED)
    public FormationDto create(@Valid @RequestBody FormationRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ADMINISTRATIF','RESPONSABLE_FORMATION')")
    public FormationDto update(@PathVariable Long id, @Valid @RequestBody FormationRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ADMINISTRATIF','RESPONSABLE_FORMATION')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
