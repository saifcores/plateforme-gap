package com.uchk.gap.formation.entity;

import java.io.Serializable;
import java.util.Objects;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class FormationFormateurId implements Serializable {

    private Long formationId;
    private Long formateurId;

    public FormationFormateurId(Long formationId, Long formateurId) {
        this.formationId = formationId;
        this.formateurId = formateurId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FormationFormateurId that)) {
            return false;
        }
        return Objects.equals(formationId, that.formationId)
                && Objects.equals(formateurId, that.formateurId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(formationId, formateurId);
    }
}
