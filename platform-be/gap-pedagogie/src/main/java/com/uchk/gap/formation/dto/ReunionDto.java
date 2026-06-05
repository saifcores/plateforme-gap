package com.uchk.gap.formation.dto;

import com.uchk.gap.formation.entity.Reunion;
import java.time.OffsetDateTime;

public record ReunionDto(
                Long id,
                Long formationId,
                String type,
                String objet,
                OffsetDateTime dateReunion,
                String lieu,
                String compteRendu) {

        public static ReunionDto from(Reunion reunion) {
                Long formationId = reunion.getFormation() != null
                                ? reunion.getFormation().getId()
                                : null;
                return new ReunionDto(
                                reunion.getId(),
                                formationId,
                                reunion.getType(),
                                reunion.getObjet(),
                                reunion.getDateReunion(),
                                reunion.getLieu(),
                                reunion.getCompteRendu());
        }
}
