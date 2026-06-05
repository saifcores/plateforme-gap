package com.uchk.gap.insertion.repository;

import com.uchk.gap.insertion.entity.Insertion;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface InsertionRepository extends JpaRepository<Insertion, Long> {

    @EntityGraph(attributePaths = { "etudiant" })
    List<Insertion> findByOrderByDateInsertionDesc();

    @EntityGraph(attributePaths = { "etudiant" })
    Optional<Insertion> findFirstByEtudiantIdOrderByDateInsertionDesc(Long etudiantId);

    long countByType(String type);

    @Query("""
            SELECT COALESCE(i.secteur, 'Non renseigné'), COUNT(i)
            FROM Insertion i
            GROUP BY i.secteur
            ORDER BY COUNT(i) DESC
            """)
    List<Object[]> countBySecteur();
}
