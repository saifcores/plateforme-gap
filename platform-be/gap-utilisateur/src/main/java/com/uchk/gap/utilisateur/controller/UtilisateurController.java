package com.uchk.gap.utilisateur.controller;

import com.uchk.gap.common.PageResponse;
import com.uchk.gap.utilisateur.dto.RegisterRequest;
import com.uchk.gap.utilisateur.dto.UpdateUtilisateurRequest;
import com.uchk.gap.utilisateur.dto.UtilisateurDto;
import com.uchk.gap.utilisateur.service.UtilisateurService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
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
@RequestMapping("/api/utilisateurs")
@PreAuthorize("hasRole('ADMIN')")
public class UtilisateurController {

    private final UtilisateurService service;

    public UtilisateurController(UtilisateurService service) {
        this.service = service;
    }

    @GetMapping
    public PageResponse<UtilisateurDto> search(
            @RequestParam(required = false) String q,
            @PageableDefault(size = 10, sort = "nom") Pageable pageable) {
        return service.search(q, pageable);
    }

    @GetMapping("/{id}")
    public UtilisateurDto findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UtilisateurDto create(@Valid @RequestBody RegisterRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public UtilisateurDto update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUtilisateurRequest request) {
        return service.update(id, request);
    }
}
