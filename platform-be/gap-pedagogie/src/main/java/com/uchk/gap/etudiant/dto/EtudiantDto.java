package com.uchk.gap.etudiant.dto;

import com.uchk.gap.etudiant.entity.Etudiant;
import java.time.LocalDate;
import java.util.List;

public record EtudiantDto(
        Long id,
        String ine,
        String nom,
        String prenom,
        LocalDate dateNaissance,
        String genre,
        String email,
        String telephone,
        Long formationId,
        String formationIntitule,
        String promo,
        Integer anneeDebut,
        Integer anneeSortie,
        List<DiplomeDto> diplomes,
        List<AutreFormationDto> autresFormations) {

    public static EtudiantDto summary(Etudiant e) {
        return new EtudiantDto(
                e.getId(),
                e.getIne(),
                e.getNom(),
                e.getPrenom(),
                e.getDateNaissance(),
                e.getGenre(),
                e.getEmail(),
                e.getTelephone(),
                e.getFormation() != null ? e.getFormation().getId() : null,
                e.getFormation() != null ? e.getFormation().getIntitule() : null,
                e.getPromo(),
                e.getAnneeDebut(),
                e.getAnneeSortie(),
                List.of(),
                List.of());
    }

    public static EtudiantDto detail(Etudiant e) {
        return new EtudiantDto(
                e.getId(),
                e.getIne(),
                e.getNom(),
                e.getPrenom(),
                e.getDateNaissance(),
                e.getGenre(),
                e.getEmail(),
                e.getTelephone(),
                e.getFormation() != null ? e.getFormation().getId() : null,
                e.getFormation() != null ? e.getFormation().getIntitule() : null,
                e.getPromo(),
                e.getAnneeDebut(),
                e.getAnneeSortie(),
                e.getDiplomes().stream().map(DiplomeDto::from).toList(),
                e.getAutresFormations().stream().map(AutreFormationDto::from).toList());
    }
}
