package com.uchk.gap.formation.dto;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.time.LocalDate;

public record FormationRequest(
                @NotBlank String intitule,
                @NotBlank String type,
                String niveau,
                LocalDate dateDebut,
                LocalDate dateFin,
                String typeFinancement,
                BigDecimal montantFinancement,
                String description) {
}
