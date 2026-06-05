package com.uchk.gap.insertion.dto;

import java.util.List;

public record InsertionStatsDto(
        long totalInsertions,
        long autoEmploi,
        long salarie,
        long totalStages,
        long totalContacts,
        long totalPartenaires,
        List<SecteurStat> parSecteur) {

    public record SecteurStat(String secteur, long count) {
    }
}
