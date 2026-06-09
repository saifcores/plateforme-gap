package com.uchk.gap.etudiant.repository;

import com.uchk.gap.etudiant.entity.Etudiant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EtudiantRepository extends JpaRepository<Etudiant, Long> {

    List<Etudiant> findByDeletedFalseOrderByNomAsc();

    @EntityGraph(attributePaths = "formation")
    @Query("""
            SELECT e FROM Etudiant e
            LEFT JOIN e.formation f
            WHERE e.deleted = false
            AND (
                :q IS NULL OR :q = '' OR
                LOWER(e.nom) LIKE LOWER(CONCAT('%', :q, '%')) OR
                LOWER(e.prenom) LIKE LOWER(CONCAT('%', :q, '%')) OR
                LOWER(e.ine) LIKE LOWER(CONCAT('%', :q, '%')) OR
                LOWER(COALESCE(f.intitule, '')) LIKE LOWER(CONCAT('%', :q, '%'))
            )
            """)
    Page<Etudiant> search(@Param("q") String q, Pageable pageable);

    boolean existsByIne(String ine);

    @EntityGraph(attributePaths = { "diplomes", "formation" })
    Optional<Etudiant> findWithDetailsById(Long id);

    @EntityGraph(attributePaths = { "diplomes", "formation" })
    Optional<Etudiant> findByUtilisateurEmailAndDeletedFalse(String email);

    @Query("""
            SELECT COALESCE(e.genre, 'Non renseigne'), COUNT(e)
            FROM Etudiant e
            WHERE e.deleted = false AND e.formation.id = :formationId
            GROUP BY e.genre
            """)
    List<Object[]> countByFormationGroupByGenre(@Param("formationId") Long formationId);
}
