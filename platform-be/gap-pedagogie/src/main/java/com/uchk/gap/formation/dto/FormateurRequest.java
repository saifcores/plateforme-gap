package com.uchk.gap.formation.dto;

import jakarta.validation.constraints.NotBlank;

public record FormateurRequest(
                @NotBlank String nom,
                @NotBlank String prenom,
                String email,
                @NotBlank String type,
                String specialite,
                String grade) {
}
