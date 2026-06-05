package com.uchk.gap.administration.repository;

import com.uchk.gap.administration.entity.Personnel;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonnelRepository extends JpaRepository<Personnel, Long> {

    List<Personnel> findByOrderByNomAsc();

    boolean existsByMatricule(String matricule);
}
