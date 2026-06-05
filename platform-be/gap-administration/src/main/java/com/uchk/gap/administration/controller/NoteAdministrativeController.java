package com.uchk.gap.administration.controller;

import com.uchk.gap.administration.dto.NoteAdministrativeDto;
import com.uchk.gap.administration.service.NoteAdministrativeService;
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
@RequestMapping("/api/notes-administratives")
@PreAuthorize("hasAnyRole('ADMIN','ADMINISTRATIF')")
public class NoteAdministrativeController {

    private final NoteAdministrativeService service;

    public NoteAdministrativeController(NoteAdministrativeService service) {
        this.service = service;
    }

    @GetMapping
    public List<NoteAdministrativeDto> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public NoteAdministrativeDto findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public NoteAdministrativeDto create(@Valid @RequestBody NoteAdministrativeDto.Request request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public NoteAdministrativeDto update(
            @PathVariable Long id,
            @Valid @RequestBody NoteAdministrativeDto.Request request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
