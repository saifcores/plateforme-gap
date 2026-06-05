package com.uchk.gap.administration.controller;

import com.uchk.gap.administration.dto.PersonnelDto;
import com.uchk.gap.administration.service.PersonnelService;
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
@RequestMapping("/api/personnels")
@PreAuthorize("hasAnyRole('ADMIN','ADMINISTRATIF')")
public class PersonnelController {

    private final PersonnelService service;

    public PersonnelController(PersonnelService service) {
        this.service = service;
    }

    @GetMapping
    public List<PersonnelDto> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public PersonnelDto findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PersonnelDto create(@Valid @RequestBody PersonnelDto.Request request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public PersonnelDto update(@PathVariable Long id, @Valid @RequestBody PersonnelDto.Request request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
