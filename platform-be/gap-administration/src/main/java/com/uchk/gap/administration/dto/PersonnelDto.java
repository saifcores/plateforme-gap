package com.uchk.gap.administration.dto;

import com.uchk.gap.administration.entity.Personnel;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record PersonnelDto(
                Long id,
                String nom,
                String prenom,
                String email,
                String matricule,
                String type,
                String fonction,
                LocalDate dateEmbauche) {

        public static PersonnelDto from(Personnel p) {
                return new PersonnelDto(
                                p.getId(), p.getNom(), p.getPrenom(), p.getEmail(),
                                p.getMatricule(), p.getType(), p.getFonction(), p.getDateEmbauche());
        }

        public record Request(
                        @NotBlank String nom,
                        @NotBlank String prenom,
                        String email,
                        String matricule,
                        @NotBlank String type,
                        String fonction,
                        LocalDate dateEmbauche) {
        }
}
