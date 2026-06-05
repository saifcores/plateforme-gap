package com.uchk.gap.administration.service;

import com.uchk.gap.administration.dto.PersonnelDto;
import com.uchk.gap.administration.entity.Personnel;
import com.uchk.gap.administration.repository.PersonnelRepository;
import com.uchk.gap.common.BusinessException;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PersonnelService {

    private final PersonnelRepository repository;

    public PersonnelService(PersonnelRepository repository) {
        this.repository = repository;
    }

    public List<PersonnelDto> findAll() {
        return repository.findByOrderByNomAsc().stream().map(PersonnelDto::from).toList();
    }

    @Transactional
    public PersonnelDto create(PersonnelDto.Request request) {
        if (request.matricule() != null && repository.existsByMatricule(request.matricule())) {
            throw new BusinessException(HttpStatus.CONFLICT, "Matricule deja utilise");
        }
        Personnel p = new Personnel();
        apply(p, request);
        return PersonnelDto.from(repository.save(p));
    }

    public PersonnelDto findById(Long id) {
        return PersonnelDto.from(getOrThrow(id));
    }

    @Transactional
    public PersonnelDto update(Long id, PersonnelDto.Request request) {
        Personnel p = getOrThrow(id);
        apply(p, request);
        return PersonnelDto.from(repository.save(p));
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(getOrThrow(id));
    }

    private Personnel getOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Personnel introuvable"));
    }

    private void apply(Personnel p, PersonnelDto.Request r) {
        p.setNom(r.nom());
        p.setPrenom(r.prenom());
        p.setEmail(r.email());
        p.setMatricule(r.matricule());
        p.setType(r.type());
        p.setFonction(r.fonction());
        p.setDateEmbauche(r.dateEmbauche());
    }
}
