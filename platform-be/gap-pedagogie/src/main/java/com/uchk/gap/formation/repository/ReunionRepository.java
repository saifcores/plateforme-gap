package com.uchk.gap.formation.repository;

import com.uchk.gap.formation.entity.Reunion;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReunionRepository extends JpaRepository<Reunion, Long> {

    List<Reunion> findByFormationIdOrderByDateReunionDesc(Long formationId);
}
