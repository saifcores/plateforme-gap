package com.uchk.gap.formation.repository;

import com.uchk.gap.formation.entity.Formateur;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FormateurRepository extends JpaRepository<Formateur, Long> {

    List<Formateur> findAllByOrderByNomAsc();

    @Query("""
            SELECT f FROM Formateur f
            WHERE :q IS NULL OR :q = '' OR
                LOWER(f.nom) LIKE LOWER(CONCAT('%', :q, '%')) OR
                LOWER(f.prenom) LIKE LOWER(CONCAT('%', :q, '%')) OR
                LOWER(COALESCE(f.email, '')) LIKE LOWER(CONCAT('%', :q, '%')) OR
                LOWER(f.type) LIKE LOWER(CONCAT('%', :q, '%')) OR
                LOWER(COALESCE(f.specialite, '')) LIKE LOWER(CONCAT('%', :q, '%'))
            """)
    Page<Formateur> search(@Param("q") String q, Pageable pageable);
}
