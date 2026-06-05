package com.uchk.gap.document.repository;

import com.uchk.gap.document.entity.JournalAccesDocument;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JournalAccesDocumentRepository extends JpaRepository<JournalAccesDocument, Long> {

    @EntityGraph(attributePaths = { "document", "utilisateur" })
    List<JournalAccesDocument> findTop100ByOrderByAccedeLeDesc();

    @EntityGraph(attributePaths = { "document", "utilisateur" })
    List<JournalAccesDocument> findAllByOrderByAccedeLeDesc();
}
