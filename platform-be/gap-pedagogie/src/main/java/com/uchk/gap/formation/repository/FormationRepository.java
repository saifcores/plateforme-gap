package com.uchk.gap.formation.repository;

import com.uchk.gap.formation.entity.Formation;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FormationRepository extends JpaRepository<Formation, Long> {

    List<Formation> findByDeletedFalseOrderByIntituleAsc();

    @Query("""
            SELECT f FROM Formation f
            WHERE f.deleted = false
            AND (
                :q IS NULL OR :q = '' OR
                LOWER(f.intitule) LIKE LOWER(CONCAT('%', :q, '%')) OR
                LOWER(f.type) LIKE LOWER(CONCAT('%', :q, '%')) OR
                LOWER(COALESCE(f.niveau, '')) LIKE LOWER(CONCAT('%', :q, '%'))
            )
            """)
    Page<Formation> search(@Param("q") String q, Pageable pageable);
}
