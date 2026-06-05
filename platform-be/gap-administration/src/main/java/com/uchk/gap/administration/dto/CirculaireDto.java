package com.uchk.gap.administration.dto;

import com.uchk.gap.administration.entity.Circulaire;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record CirculaireDto(
                Long id,
                String reference,
                String objet,
                String contenu,
                String documentUrl,
                LocalDate dateCirculaire,
                String niveau) {

        public static CirculaireDto from(Circulaire c) {
                return new CirculaireDto(
                                c.getId(), c.getReference(), c.getObjet(), c.getContenu(),
                                c.getDocumentUrl(), c.getDateCirculaire(), c.getNiveau());
        }

        public record Request(
                        String reference,
                        @NotBlank String objet,
                        String contenu,
                        String documentUrl,
                        @NotNull LocalDate dateCirculaire,
                        String niveau) {
        }
}
