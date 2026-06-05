package com.uchk.gap.formation.repository;

import com.uchk.gap.formation.entity.FormationFormateur;
import com.uchk.gap.formation.entity.FormationFormateurId;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FormationFormateurRepository
        extends JpaRepository<FormationFormateur, FormationFormateurId> {

    @EntityGraph(attributePaths = "formateur")
    List<FormationFormateur> findByFormationId(Long formationId);

    boolean existsByFormationIdAndFormateurId(Long formationId, Long formateurId);
}
