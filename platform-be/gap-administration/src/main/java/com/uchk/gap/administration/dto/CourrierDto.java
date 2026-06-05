package com.uchk.gap.administration.dto;

import com.uchk.gap.administration.entity.Courrier;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record CourrierDto(
                Long id,
                String type,
                String reference,
                String objet,
                String expediteur,
                String destinataire,
                LocalDate dateCourrier,
                String documentUrl,
                String statut) {

        public static CourrierDto from(Courrier c) {
                return new CourrierDto(
                                c.getId(), c.getType(), c.getReference(), c.getObjet(),
                                c.getExpediteur(), c.getDestinataire(), c.getDateCourrier(),
                                c.getDocumentUrl(), c.getStatut());
        }

        public record Request(
                        @NotBlank String type,
                        String reference,
                        @NotBlank String objet,
                        String expediteur,
                        String destinataire,
                        @NotNull LocalDate dateCourrier,
                        String documentUrl,
                        String statut) {
        }
}
