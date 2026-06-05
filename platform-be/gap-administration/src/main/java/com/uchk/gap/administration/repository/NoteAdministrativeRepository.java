package com.uchk.gap.administration.repository;

import com.uchk.gap.administration.entity.NoteAdministrative;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoteAdministrativeRepository extends JpaRepository<NoteAdministrative, Long> {

    List<NoteAdministrative> findByOrderByDateNoteDesc();
}
