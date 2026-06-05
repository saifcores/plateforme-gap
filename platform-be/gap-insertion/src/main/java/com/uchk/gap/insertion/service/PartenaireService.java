package com.uchk.gap.insertion.service;

import com.uchk.gap.common.BusinessException;
import com.uchk.gap.insertion.dto.PartenaireDto;
import com.uchk.gap.insertion.entity.Partenaire;
import com.uchk.gap.insertion.repository.PartenaireRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PartenaireService {

    private final PartenaireRepository repository;

    public PartenaireService(PartenaireRepository repository) {
        this.repository = repository;
    }

    public List<PartenaireDto> findAll() {
        return repository.findByOrderByNomAsc().stream().map(PartenaireDto::from).toList();
    }

    @Transactional
    public PartenaireDto create(PartenaireDto.Request request) {
        Partenaire p = new Partenaire();
        apply(p, request);
        return PartenaireDto.from(repository.save(p));
    }

    public PartenaireDto findById(Long id) {
        return PartenaireDto.from(getOrThrow(id));
    }

    @Transactional
    public PartenaireDto update(Long id, PartenaireDto.Request request) {
        Partenaire p = getOrThrow(id);
        apply(p, request);
        return PartenaireDto.from(repository.save(p));
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(getOrThrow(id));
    }

    private Partenaire getOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Partenaire introuvable"));
    }

    private void apply(Partenaire p, PartenaireDto.Request r) {
        p.setNom(r.nom());
        p.setType(r.type());
        p.setSecteur(r.secteur());
        p.setContactNom(r.contactNom());
        p.setContactEmail(r.contactEmail());
        p.setTelephone(r.telephone());
        p.setAdresse(r.adresse());
        p.setDatePartenariat(r.datePartenariat());
        if (r.statut() != null) {
            p.setStatut(r.statut());
        }
    }
}
