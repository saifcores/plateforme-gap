package com.uchk.gap.communication.repository;

import com.uchk.gap.communication.entity.Notification;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUtilisateurEmailOrderByCreatedAtDesc(String email);

    long countByUtilisateurEmailAndLuFalse(String email);
}
