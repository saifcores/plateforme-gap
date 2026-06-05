package com.uchk.gap.insertion.repository;

import com.uchk.gap.insertion.entity.RegistreContact;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistreContactRepository extends JpaRepository<RegistreContact, Long> {

    @EntityGraph(attributePaths = { "etudiant" })
    List<RegistreContact> findByOrderByDateContactDesc();
}
