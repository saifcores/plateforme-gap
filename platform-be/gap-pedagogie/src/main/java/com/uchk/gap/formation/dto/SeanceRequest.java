package com.uchk.gap.formation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

public record SeanceRequest(
                Long formateurId,
                @NotBlank String matiere,
                @NotBlank String type,
                @NotNull LocalDate dateSeance,
                @NotNull LocalTime heureDebut,
                @NotNull LocalTime heureFin,
                String salle) {
}
