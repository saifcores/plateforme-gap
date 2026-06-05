package com.uchk.gap.insertion.dto;

import com.uchk.gap.insertion.entity.Insertion;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record InsertionDto(
                Long id,
                Long etudiantId,
                String etudiantNom,
                String type,
                String entreprise,
                String poste,
                String secteur,
                LocalDate dateInsertion) {

        public static InsertionDto from(Insertion i) {
                String etu = i.getEtudiant() != null
                                ? i.getEtudiant().getPrenom() + " " + i.getEtudiant().getNom()
                                : null;
                return new InsertionDto(
                                i.getId(),
                                i.getEtudiant() != null ? i.getEtudiant().getId() : null,
                                etu, i.getType(), i.getEntreprise(), i.getPoste(),
                                i.getSecteur(), i.getDateInsertion());
        }

        public record Request(
                        @NotNull Long etudiantId,
                        @NotBlank String type,
                        String entreprise,
                        String poste,
                        String secteur,
                        LocalDate dateInsertion) {
        }
}
