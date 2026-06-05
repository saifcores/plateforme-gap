package com.uchk.gap.insertion.dto;

import com.uchk.gap.insertion.entity.Partenaire;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record PartenaireDto(
                Long id,
                String nom,
                String type,
                String secteur,
                String contactNom,
                String contactEmail,
                String telephone,
                String adresse,
                LocalDate datePartenariat,
                String statut) {

        public static PartenaireDto from(Partenaire p) {
                return new PartenaireDto(
                                p.getId(), p.getNom(), p.getType(), p.getSecteur(),
                                p.getContactNom(), p.getContactEmail(), p.getTelephone(),
                                p.getAdresse(), p.getDatePartenariat(), p.getStatut());
        }

        public record Request(
                        @NotBlank String nom,
                        String type,
                        String secteur,
                        String contactNom,
                        String contactEmail,
                        String telephone,
                        String adresse,
                        LocalDate datePartenariat,
                        String statut) {
        }
}
