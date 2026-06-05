package com.uchk.gap.formation.repository;

import com.uchk.gap.formation.entity.Seance;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SeanceRepository extends JpaRepository<Seance, Long> {

    List<Seance> findByFormationIdOrderByDateSeanceAscHeureDebutAsc(Long formationId);
}
