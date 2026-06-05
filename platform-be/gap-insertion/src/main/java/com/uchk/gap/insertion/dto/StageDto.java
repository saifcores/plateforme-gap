package com.uchk.gap.insertion.dto;

import com.uchk.gap.insertion.entity.Stage;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public record StageDto(
                Long id,
                Long etudiantId,
                String etudiantNom,
                Long partenaireId,
                String partenaireNom,
                String sujet,
                LocalDate dateDebut,
                LocalDate dateFin,
                String bilan,
                BigDecimal note) {

        public static StageDto from(Stage s) {
                String etu = s.getEtudiant() != null
                                ? s.getEtudiant().getPrenom() + " " + s.getEtudiant().getNom()
                                : null;
                Long partId = s.getPartenaire() != null ? s.getPartenaire().getId() : null;
                String partNom = s.getPartenaire() != null ? s.getPartenaire().getNom() : null;
                return new StageDto(
                                s.getId(),
                                s.getEtudiant() != null ? s.getEtudiant().getId() : null,
                                etu, partId, partNom, s.getSujet(),
                                s.getDateDebut(), s.getDateFin(), s.getBilan(), s.getNote());
        }

        public record Request(
                        @NotNull Long etudiantId,
                        Long partenaireId,
                        String sujet,
                        LocalDate dateDebut,
                        LocalDate dateFin,
                        String bilan,
                        BigDecimal note) {
        }
}
