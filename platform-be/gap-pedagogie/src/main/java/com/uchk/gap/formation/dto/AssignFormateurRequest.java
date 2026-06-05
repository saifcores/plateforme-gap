package com.uchk.gap.formation.dto;

import jakarta.validation.constraints.NotNull;

public record AssignFormateurRequest(
                @NotNull Long formateurId,
                String roleDansFormation) {
}
