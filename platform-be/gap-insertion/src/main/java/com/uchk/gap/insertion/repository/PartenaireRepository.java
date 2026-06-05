package com.uchk.gap.insertion.repository;

import com.uchk.gap.insertion.entity.Partenaire;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PartenaireRepository extends JpaRepository<Partenaire, Long> {

    List<Partenaire> findByOrderByNomAsc();
}
