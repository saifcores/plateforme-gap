package com.uchk.gap.communication.repository;

import com.uchk.gap.communication.entity.CompteRendu;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CompteRenduRepository extends JpaRepository<CompteRendu, Long> {

    List<CompteRendu> findByDeletedFalseOrderByDateEventDesc();

    @Query("""
            SELECT DISTINCT cr FROM CompteRendu cr
            LEFT JOIN FETCH cr.auteur a
            LEFT JOIN FETCH cr.rolesAutorises
            WHERE cr.deleted = false
            AND (:q IS NULL OR :q = '' OR
                 LOWER(cr.titre) LIKE LOWER(CONCAT('%', :q, '%')) OR
                 LOWER(cr.type) LIKE LOWER(CONCAT('%', :q, '%')))
            AND (:type IS NULL OR :type = '' OR cr.type = :type)
            AND (:auteur IS NULL OR :auteur = '' OR
                 LOWER(CONCAT(COALESCE(a.prenom, ''), ' ', COALESCE(a.nom, '')))
                    LIKE LOWER(CONCAT('%', :auteur, '%')))
            AND (:dateFrom IS NULL OR cr.dateEvent >= :dateFrom)
            AND (:dateTo IS NULL OR cr.dateEvent <= :dateTo)
            ORDER BY cr.dateEvent DESC
            """)
    List<CompteRendu> searchFiltered(
            @Param("q") String q,
            @Param("type") String type,
            @Param("auteur") String auteur,
            @Param("dateFrom") LocalDate dateFrom,
            @Param("dateTo") LocalDate dateTo);
}
