package com.uchk.gap.administration.dto;

import com.uchk.gap.administration.entity.NoteService;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record NoteServiceDto(
                Long id,
                String type,
                String reference,
                String objet,
                String contenu,
                String documentUrl,
                LocalDate dateNote) {

        public static NoteServiceDto from(NoteService n) {
                return new NoteServiceDto(
                                n.getId(), n.getType(), n.getReference(), n.getObjet(),
                                n.getContenu(), n.getDocumentUrl(), n.getDateNote());
        }

        public record Request(
                        @NotBlank String type,
                        String reference,
                        @NotBlank String objet,
                        String contenu,
                        String documentUrl,
                        @NotNull LocalDate dateNote) {
        }
}
