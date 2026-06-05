package com.uchk.gap.formation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.OffsetDateTime;

public record ReunionRequest(
                @NotBlank String type,
                @NotBlank String objet,
                @NotNull OffsetDateTime dateReunion,
                String lieu,
                String compteRendu) {
}
