package com.uchk.gap.administration.service;

import com.uchk.gap.administration.dto.NoteAdministrativeDto;
import com.uchk.gap.administration.entity.NoteAdministrative;
import com.uchk.gap.administration.repository.NoteAdministrativeRepository;
import com.uchk.gap.common.BusinessException;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NoteAdministrativeService {

    private final NoteAdministrativeRepository repository;

    public NoteAdministrativeService(NoteAdministrativeRepository repository) {
        this.repository = repository;
    }

    public List<NoteAdministrativeDto> findAll() {
        return repository.findByOrderByDateNoteDesc().stream()
                .map(NoteAdministrativeDto::from)
                .toList();
    }

    @Transactional
    public NoteAdministrativeDto create(NoteAdministrativeDto.Request request) {
        NoteAdministrative note = new NoteAdministrative();
        apply(note, request);
        return NoteAdministrativeDto.from(repository.save(note));
    }

    public NoteAdministrativeDto findById(Long id) {
        return NoteAdministrativeDto.from(getOrThrow(id));
    }

    @Transactional
    public NoteAdministrativeDto update(Long id, NoteAdministrativeDto.Request request) {
        NoteAdministrative note = getOrThrow(id);
        apply(note, request);
        return NoteAdministrativeDto.from(repository.save(note));
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(getOrThrow(id));
    }

    private NoteAdministrative getOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new BusinessException(
                        HttpStatus.NOT_FOUND, "Note administrative introuvable"));
    }

    private void apply(NoteAdministrative note, NoteAdministrativeDto.Request request) {
        note.setObjet(request.objet());
        note.setContenu(request.contenu());
        note.setDocumentUrl(request.documentUrl());
        note.setDateNote(request.dateNote());
    }
}
