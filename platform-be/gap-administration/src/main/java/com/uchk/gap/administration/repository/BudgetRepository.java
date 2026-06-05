package com.uchk.gap.administration.repository;

import com.uchk.gap.administration.entity.Budget;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    List<Budget> findByOrderByAnneeDescTypeAsc();

    @EntityGraph(attributePaths = "lignes")
    Optional<Budget> findWithLignesById(Long id);
}
