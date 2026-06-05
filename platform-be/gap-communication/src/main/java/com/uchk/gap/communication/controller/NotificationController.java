package com.uchk.gap.communication.controller;

import com.uchk.gap.communication.dto.NotificationDto;
import com.uchk.gap.communication.service.NotificationService;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    @GetMapping
    public List<NotificationDto> findMine(Principal principal) {
        return service.findMine(principal.getName());
    }

    @GetMapping("/unread-count")
    public Map<String, Long> unreadCount(Principal principal) {
        return Map.of("count", service.countUnread(principal.getName()));
    }

    @PostMapping("/{id}/lue")
    public ResponseEntity<Void> markRead(@PathVariable Long id, Principal principal) {
        service.markRead(id, principal.getName());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/toutes-lues")
    public ResponseEntity<Void> markAllRead(Principal principal) {
        service.markAllRead(principal.getName());
        return ResponseEntity.noContent().build();
    }
}
