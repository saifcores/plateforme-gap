package com.uchk.gap.administration.dto;

import com.uchk.gap.administration.entity.NoteAdministrative;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record NoteAdministrativeDto(
                Long id,
                String objet,
                String contenu,
                String documentUrl,
                LocalDate dateNote) {

        public static NoteAdministrativeDto from(NoteAdministrative note) {
                return new NoteAdministrativeDto(
                                note.getId(),
                                note.getObjet(),
                                note.getContenu(),
                                note.getDocumentUrl(),
                                note.getDateNote());
        }

        public record Request(
                        @NotBlank String objet,
                        String contenu,
                        String documentUrl,
                        @NotNull LocalDate dateNote) {
        }
}
