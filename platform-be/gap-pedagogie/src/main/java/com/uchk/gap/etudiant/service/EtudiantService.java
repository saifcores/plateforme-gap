package com.uchk.gap.etudiant.service;

import com.uchk.gap.common.BusinessException;
import com.uchk.gap.common.PageResponse;
import com.uchk.gap.etudiant.dto.EtudiantDto;
import com.uchk.gap.etudiant.dto.EtudiantRequest;
import com.uchk.gap.etudiant.entity.AutreFormation;
import com.uchk.gap.etudiant.entity.Diplome;
import com.uchk.gap.etudiant.entity.Etudiant;
import com.uchk.gap.etudiant.repository.EtudiantRepository;
import com.uchk.gap.formation.dto.SeanceDto;
import com.uchk.gap.formation.entity.Formation;
import com.uchk.gap.formation.service.FormationService;
import com.uchk.gap.formation.service.SeanceService;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EtudiantService {

    private final EtudiantRepository repository;
    private final FormationService formationService;
    private final SeanceService seanceService;

    public EtudiantService(
            EtudiantRepository repository,
            FormationService formationService,
            SeanceService seanceService) {
        this.repository = repository;
        this.formationService = formationService;
        this.seanceService = seanceService;
    }

    public List<EtudiantDto> findAll() {
        return repository.findByDeletedFalseOrderByNomAsc().stream()
                .map(EtudiantDto::summary)
                .toList();
    }

    @Transactional(readOnly = true)
    public PageResponse<EtudiantDto> search(String q, Pageable pageable) {
        return PageResponse.from(
                repository.search(q, pageable).map(EtudiantDto::summary));
    }

    @Transactional(readOnly = true)
    public EtudiantDto findById(Long id) {
        return EtudiantDto.detail(getDetailOrThrow(id));
    }

    @Transactional(readOnly = true)
    public EtudiantDto findMine(String email) {
        Etudiant etudiant = repository.findByUtilisateurEmailAndDeletedFalse(email)
                .orElseThrow(() -> new BusinessException(
                        HttpStatus.NOT_FOUND, "Aucun dossier etudiant lie a ce compte"));
        return EtudiantDto.detail(etudiant);
    }

    @Transactional(readOnly = true)
    public List<SeanceDto> findMonEmploiDuTemps(String email) {
        Etudiant etudiant = repository.findByUtilisateurEmailAndDeletedFalse(email)
                .orElseThrow(() -> new BusinessException(
                        HttpStatus.NOT_FOUND, "Aucun dossier etudiant lie a ce compte"));
        if (etudiant.getFormation() == null) {
            return List.of();
        }
        return seanceService.findByFormation(etudiant.getFormation().getId());
    }

    @Transactional
    public EtudiantDto create(EtudiantRequest request) {
        if (repository.existsByIne(request.ine())) {
            throw new BusinessException(HttpStatus.CONFLICT, "INE deja utilise");
        }
        Etudiant etudiant = new Etudiant();
        applyScalars(etudiant, request);
        applyChildren(etudiant, request);
        return EtudiantDto.detail(repository.save(etudiant));
    }

    @Transactional
    public EtudiantDto update(Long id, EtudiantRequest request) {
        Etudiant etudiant = getDetailOrThrow(id);
        applyScalars(etudiant, request);
        etudiant.getDiplomes().clear();
        etudiant.getAutresFormations().clear();
        applyChildren(etudiant, request);
        return EtudiantDto.detail(repository.save(etudiant));
    }

    @Transactional
    public void delete(Long id) {
        Etudiant etudiant = getDetailOrThrow(id);
        etudiant.setDeleted(true);
        repository.save(etudiant);
    }

    private Etudiant getDetailOrThrow(Long id) {
        Etudiant etudiant = repository.findWithDetailsById(id)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Etudiant introuvable"));
        if (etudiant.isDeleted()) {
            throw new BusinessException(HttpStatus.NOT_FOUND, "Etudiant introuvable");
        }
        return etudiant;
    }

    private void applyScalars(Etudiant etudiant, EtudiantRequest request) {
        etudiant.setIne(request.ine());
        etudiant.setNom(request.nom());
        etudiant.setPrenom(request.prenom());
        etudiant.setDateNaissance(request.dateNaissance());
        etudiant.setGenre(request.genre());
        etudiant.setEmail(request.email());
        etudiant.setTelephone(request.telephone());
        etudiant.setPromo(request.promo());
        etudiant.setAnneeDebut(request.anneeDebut());
        etudiant.setAnneeSortie(request.anneeSortie());
        if (request.formationId() != null) {
            Formation formation = formationService.getOrThrow(request.formationId());
            etudiant.setFormation(formation);
        } else {
            etudiant.setFormation(null);
        }
    }

    private void applyChildren(Etudiant etudiant, EtudiantRequest request) {
        if (request.diplomes() != null) {
            for (EtudiantRequest.DiplomeRequest d : request.diplomes()) {
                Diplome diplome = new Diplome();
                diplome.setIntitule(d.intitule());
                diplome.setType(d.type());
                diplome.setEtablissement(d.etablissement());
                diplome.setAnnee(d.annee());
                etudiant.addDiplome(diplome);
            }
        }
        if (request.autresFormations() != null) {
            for (EtudiantRequest.AutreFormationRequest a : request.autresFormations()) {
                AutreFormation af = new AutreFormation();
                af.setIntitule(a.intitule());
                af.setOrganisme(a.organisme());
                af.setAnnee(a.annee());
                etudiant.addAutreFormation(af);
            }
        }
    }
}
