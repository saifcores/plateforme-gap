package com.uchk.gap.administration.repository;

import com.uchk.gap.administration.entity.NoteService;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoteServiceRepository extends JpaRepository<NoteService, Long> {

    List<NoteService> findByOrderByDateNoteDesc();
}
