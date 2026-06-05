package com.uchk.gap.insertion.service;

import com.uchk.gap.common.BusinessException;
import com.uchk.gap.etudiant.entity.Etudiant;
import com.uchk.gap.etudiant.repository.EtudiantRepository;
import com.uchk.gap.insertion.dto.RegistreContactDto;
import com.uchk.gap.insertion.entity.RegistreContact;
import com.uchk.gap.insertion.repository.RegistreContactRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RegistreContactService {

    private final RegistreContactRepository repository;
    private final EtudiantRepository etudiantRepository;

    public RegistreContactService(RegistreContactRepository repository, EtudiantRepository etudiantRepository) {
        this.repository = repository;
        this.etudiantRepository = etudiantRepository;
    }

    public List<RegistreContactDto> findAll() {
        return repository.findByOrderByDateContactDesc().stream().map(RegistreContactDto::from).toList();
    }

    @Transactional
    public RegistreContactDto create(RegistreContactDto.Request request) {
        RegistreContact r = new RegistreContact();
        apply(r, request);
        return RegistreContactDto.from(repository.save(r));
    }

    public RegistreContactDto findById(Long id) {
        return RegistreContactDto.from(getOrThrow(id));
    }

    @Transactional
    public RegistreContactDto update(Long id, RegistreContactDto.Request request) {
        RegistreContact r = getOrThrow(id);
        apply(r, request);
        return RegistreContactDto.from(repository.save(r));
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(getOrThrow(id));
    }

    private RegistreContact getOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Contact introuvable"));
    }

    private void apply(RegistreContact entity, RegistreContactDto.Request r) {
        Etudiant etudiant = etudiantRepository.findById(r.etudiantId())
                .orElseThrow(() -> new BusinessException(HttpStatus.BAD_REQUEST, "Étudiant introuvable"));
        entity.setEtudiant(etudiant);
        entity.setDateContact(r.dateContact());
        entity.setCanal(r.canal());
        entity.setObjet(r.objet());
        entity.setCompteRendu(r.compteRendu());
    }
}
