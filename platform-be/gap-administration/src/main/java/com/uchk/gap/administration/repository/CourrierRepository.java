package com.uchk.gap.administration.repository;

import com.uchk.gap.administration.entity.Courrier;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourrierRepository extends JpaRepository<Courrier, Long> {

    List<Courrier> findByOrderByDateCourrierDesc();
}
