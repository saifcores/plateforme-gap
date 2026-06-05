package com.uchk.gap.etudiant.controller;

import com.uchk.gap.common.PageResponse;
import com.uchk.gap.etudiant.dto.EtudiantDto;
import com.uchk.gap.etudiant.dto.EtudiantRequest;
import com.uchk.gap.etudiant.service.EtudiantService;
import com.uchk.gap.formation.dto.SeanceDto;
import jakarta.validation.Valid;
import java.security.Principal;
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
@RequestMapping("/api/etudiants")
public class EtudiantController {

    private final EtudiantService service;

    public EtudiantController(EtudiantService service) {
        this.service = service;
    }

    @GetMapping("/moi")
    @PreAuthorize("hasRole('ETUDIANT')")
    public EtudiantDto findMine(Principal principal) {
        return service.findMine(principal.getName());
    }

    @GetMapping("/moi/emploi-du-temps")
    @PreAuthorize("hasRole('ETUDIANT')")
    public List<SeanceDto> monEmploiDuTemps(Principal principal) {
        return service.findMonEmploiDuTemps(principal.getName());
    }

    @GetMapping("/options")
    @PreAuthorize("hasAnyRole('ADMIN','ADMINISTRATIF','RESPONSABLE_FORMATION',"
            + "'ENSEIGNANT','TUTEUR','APPUI_INSERTION')")
    public List<EtudiantDto> options() {
        return service.findAll();
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','ADMINISTRATIF','RESPONSABLE_FORMATION',"
            + "'ENSEIGNANT','TUTEUR','APPUI_INSERTION')")
    public PageResponse<EtudiantDto> search(
            @RequestParam(required = false) String q,
            @PageableDefault(size = 10, sort = "nom") Pageable pageable) {
        return service.search(q, pageable);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ADMINISTRATIF','RESPONSABLE_FORMATION',"
            + "'ENSEIGNANT','TUTEUR','APPUI_INSERTION')")
    public EtudiantDto findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','ADMINISTRATIF')")
    @ResponseStatus(HttpStatus.CREATED)
    public EtudiantDto create(@Valid @RequestBody EtudiantRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ADMINISTRATIF')")
    public EtudiantDto update(@PathVariable Long id, @Valid @RequestBody EtudiantRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ADMINISTRATIF')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
