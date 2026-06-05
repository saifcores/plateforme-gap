package com.uchk.gap.administration.service;

import com.uchk.gap.administration.dto.CirculaireDto;
import com.uchk.gap.administration.entity.Circulaire;
import com.uchk.gap.administration.repository.CirculaireRepository;
import com.uchk.gap.common.BusinessException;
import com.uchk.gap.communication.service.NotificationService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CirculaireService {

    private final CirculaireRepository repository;
    private final NotificationService notificationService;

    public CirculaireService(CirculaireRepository repository,
            NotificationService notificationService) {
        this.repository = repository;
        this.notificationService = notificationService;
    }

    public List<CirculaireDto> findAll() {
        return repository.findByOrderByDateCirculaireDesc().stream().map(CirculaireDto::from).toList();
    }

    @Transactional
    public CirculaireDto create(CirculaireDto.Request request) {
        Circulaire c = new Circulaire();
        apply(c, request);
        Circulaire saved = repository.save(c);
        notificationService.broadcast(
                "Nouvelle circulaire",
                "Circulaire : " + saved.getObjet(),
                "CIRCULAIRE",
                "/administration?tab=circulaires");
        return CirculaireDto.from(saved);
    }

    public CirculaireDto findById(Long id) {
        return CirculaireDto.from(getOrThrow(id));
    }

    @Transactional
    public CirculaireDto update(Long id, CirculaireDto.Request request) {
        Circulaire c = getOrThrow(id);
        apply(c, request);
        return CirculaireDto.from(repository.save(c));
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(getOrThrow(id));
    }

    private Circulaire getOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Circulaire introuvable"));
    }

    private void apply(Circulaire c, CirculaireDto.Request r) {
        c.setReference(r.reference());
        c.setObjet(r.objet());
        c.setContenu(r.contenu());
        c.setDocumentUrl(r.documentUrl());
        c.setDateCirculaire(r.dateCirculaire());
        if (r.niveau() != null) {
            c.setNiveau(r.niveau());
        }
    }
}
