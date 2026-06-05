package com.uchk.gap.administration.service;

import com.uchk.gap.administration.dto.NoteServiceDto;
import com.uchk.gap.administration.entity.NoteService;
import com.uchk.gap.administration.repository.NoteServiceRepository;
import com.uchk.gap.common.BusinessException;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NoteServiceService {

    private final NoteServiceRepository repository;

    public NoteServiceService(NoteServiceRepository repository) {
        this.repository = repository;
    }

    public List<NoteServiceDto> findAll() {
        return repository.findByOrderByDateNoteDesc().stream().map(NoteServiceDto::from).toList();
    }

    @Transactional
    public NoteServiceDto create(NoteServiceDto.Request request) {
        NoteService n = new NoteService();
        apply(n, request);
        return NoteServiceDto.from(repository.save(n));
    }

    public NoteServiceDto findById(Long id) {
        return NoteServiceDto.from(getOrThrow(id));
    }

    @Transactional
    public NoteServiceDto update(Long id, NoteServiceDto.Request request) {
        NoteService n = getOrThrow(id);
        apply(n, request);
        return NoteServiceDto.from(repository.save(n));
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(getOrThrow(id));
    }

    private NoteService getOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Note de service introuvable"));
    }

    private void apply(NoteService n, NoteServiceDto.Request r) {
        n.setType(r.type());
        n.setReference(r.reference());
        n.setObjet(r.objet());
        n.setContenu(r.contenu());
        n.setDocumentUrl(r.documentUrl());
        n.setDateNote(r.dateNote());
    }
}
