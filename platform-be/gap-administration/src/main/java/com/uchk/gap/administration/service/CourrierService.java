package com.uchk.gap.administration.service;

import com.uchk.gap.administration.dto.CourrierDto;
import com.uchk.gap.administration.entity.Courrier;
import com.uchk.gap.administration.repository.CourrierRepository;
import com.uchk.gap.common.BusinessException;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CourrierService {

    private final CourrierRepository repository;

    public CourrierService(CourrierRepository repository) {
        this.repository = repository;
    }

    public List<CourrierDto> findAll() {
        return repository.findByOrderByDateCourrierDesc().stream().map(CourrierDto::from).toList();
    }

    @Transactional
    public CourrierDto create(CourrierDto.Request request) {
        Courrier c = new Courrier();
        apply(c, request);
        return CourrierDto.from(repository.save(c));
    }

    public CourrierDto findById(Long id) {
        return CourrierDto.from(getOrThrow(id));
    }

    @Transactional
    public CourrierDto update(Long id, CourrierDto.Request request) {
        Courrier c = getOrThrow(id);
        apply(c, request);
        return CourrierDto.from(repository.save(c));
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(getOrThrow(id));
    }

    private Courrier getOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Courrier introuvable"));
    }

    private void apply(Courrier c, CourrierDto.Request r) {
        c.setType(r.type());
        c.setReference(r.reference());
        c.setObjet(r.objet());
        c.setExpediteur(r.expediteur());
        c.setDestinataire(r.destinataire());
        c.setDateCourrier(r.dateCourrier());
        c.setDocumentUrl(r.documentUrl());
        if (r.statut() != null) {
            c.setStatut(r.statut());
        }
    }
}
