package com.uchk.gap.insertion.repository;

import com.uchk.gap.insertion.entity.Stage;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StageRepository extends JpaRepository<Stage, Long> {

    @EntityGraph(attributePaths = { "etudiant", "partenaire" })
    List<Stage> findByOrderByDateDebutDesc();
}
