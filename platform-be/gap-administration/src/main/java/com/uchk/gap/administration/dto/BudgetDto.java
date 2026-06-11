package com.uchk.gap.administration.dto;

import com.uchk.gap.administration.entity.Budget;
import com.uchk.gap.administration.entity.LigneBudget;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

public record BudgetDto(
                Long id,
                Integer annee,
                String type,
                String noteOrientation,
                String documentUrl,
                BigDecimal totalPrevu,
                BigDecimal totalRealise,
                List<LigneDto> lignes) {

        public static BudgetDto summary(Budget b) {
                BigDecimal totalPrevu = b.getLignes().stream()
                                .map(l -> l.getMontantPrevu() == null ? BigDecimal.ZERO : l.getMontantPrevu())
                                .reduce(BigDecimal.ZERO, BigDecimal::add);
                BigDecimal totalRealise = b.getLignes().stream()
                                .map(l -> l.getMontantRealise() == null ? BigDecimal.ZERO : l.getMontantRealise())
                                .reduce(BigDecimal.ZERO, BigDecimal::add);
                return new BudgetDto(b.getId(), b.getAnnee(), b.getType(), b.getNoteOrientation(),
                                b.getDocumentUrl(), totalPrevu, totalRealise, List.of());
        }

        public static BudgetDto detail(Budget b) {
                BigDecimal totalPrevu = b.getLignes().stream()
                                .map(l -> l.getMontantPrevu() == null ? BigDecimal.ZERO : l.getMontantPrevu())
                                .reduce(BigDecimal.ZERO, BigDecimal::add);
                BigDecimal totalRealise = b.getLignes().stream()
                                .map(l -> l.getMontantRealise() == null ? BigDecimal.ZERO : l.getMontantRealise())
                                .reduce(BigDecimal.ZERO, BigDecimal::add);
                return new BudgetDto(b.getId(), b.getAnnee(), b.getType(), b.getNoteOrientation(),
                                b.getDocumentUrl(), totalPrevu, totalRealise,
                                b.getLignes().stream().map(LigneDto::from).toList());
        }

        public record LigneDto(Long id, String intitule, BigDecimal montantPrevu, BigDecimal montantRealise) {
                public static LigneDto from(LigneBudget l) {
                        return new LigneDto(l.getId(), l.getIntitule(), l.getMontantPrevu(), l.getMontantRealise());
                }
        }

        public record Request(
                        @NotNull Integer annee,
                        @NotBlank String type,
                        String noteOrientation,
                        String documentUrl,
                        @Valid List<LigneRequest> lignes) {
        }

        public record LigneRequest(
                        @NotBlank String intitule,
                        BigDecimal montantPrevu,
                        BigDecimal montantRealise) {
        }
}
