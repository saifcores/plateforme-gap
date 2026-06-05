package com.uchk.gap.utilisateur.repository;

import com.uchk.gap.utilisateur.entity.Utilisateur;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    Optional<Utilisateur> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query(value = """
            SELECT DISTINCT u FROM Utilisateur u
            LEFT JOIN u.roles r
            WHERE :q IS NULL OR :q = '' OR
                LOWER(u.nom) LIKE LOWER(CONCAT('%', :q, '%')) OR
                LOWER(u.prenom) LIKE LOWER(CONCAT('%', :q, '%')) OR
                LOWER(u.email) LIKE LOWER(CONCAT('%', :q, '%')) OR
                LOWER(r.code) LIKE LOWER(CONCAT('%', :q, '%'))
            """, countQuery = """
            SELECT COUNT(DISTINCT u) FROM Utilisateur u
            LEFT JOIN u.roles r
            WHERE :q IS NULL OR :q = '' OR
                LOWER(u.nom) LIKE LOWER(CONCAT('%', :q, '%')) OR
                LOWER(u.prenom) LIKE LOWER(CONCAT('%', :q, '%')) OR
                LOWER(u.email) LIKE LOWER(CONCAT('%', :q, '%')) OR
                LOWER(r.code) LIKE LOWER(CONCAT('%', :q, '%'))
            """)
    Page<Utilisateur> search(@Param("q") String q, Pageable pageable);
}
