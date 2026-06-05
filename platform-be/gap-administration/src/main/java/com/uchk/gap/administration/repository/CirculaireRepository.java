package com.uchk.gap.administration.repository;

import com.uchk.gap.administration.entity.Circulaire;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CirculaireRepository extends JpaRepository<Circulaire, Long> {

    List<Circulaire> findByOrderByDateCirculaireDesc();
}
