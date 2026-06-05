package com.uchk.gap.communication.service;

import com.uchk.gap.common.BusinessException;
import com.uchk.gap.communication.dto.NotificationDto;
import com.uchk.gap.communication.entity.Notification;
import com.uchk.gap.communication.repository.NotificationRepository;
import com.uchk.gap.utilisateur.entity.Utilisateur;
import com.uchk.gap.utilisateur.repository.UtilisateurRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificationService {

    private final NotificationRepository repository;
    private final UtilisateurRepository utilisateurRepository;

    public NotificationService(NotificationRepository repository,
            UtilisateurRepository utilisateurRepository) {
        this.repository = repository;
        this.utilisateurRepository = utilisateurRepository;
    }

    public List<NotificationDto> findMine(String email) {
        return repository.findByUtilisateurEmailOrderByCreatedAtDesc(email).stream()
                .map(NotificationDto::from)
                .toList();
    }

    public long countUnread(String email) {
        return repository.countByUtilisateurEmailAndLuFalse(email);
    }

    @Transactional
    public void markRead(Long id, String email) {
        Notification notif = repository.findById(id)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Notification introuvable"));
        if (!notif.getUtilisateur().getEmail().equals(email)) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "Acces refuse");
        }
        notif.setLu(true);
        repository.save(notif);
    }

    @Transactional
    public void markAllRead(String email) {
        List<Notification> notifs = repository.findByUtilisateurEmailOrderByCreatedAtDesc(email);
        notifs.forEach(n -> n.setLu(true));
        repository.saveAll(notifs);
    }

    /** Diffuse une notification a tous les utilisateurs actifs. */
    @Transactional
    public void broadcast(String titre, String message, String type, String lien) {
        List<Utilisateur> users = utilisateurRepository.findAll();
        for (Utilisateur user : users) {
            if (!user.isActif()) {
                continue;
            }
            Notification notif = new Notification();
            notif.setUtilisateur(user);
            notif.setTitre(titre);
            notif.setMessage(message);
            notif.setType(type);
            notif.setLien(lien);
            repository.save(notif);
        }
    }
}
