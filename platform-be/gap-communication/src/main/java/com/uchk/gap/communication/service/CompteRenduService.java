package com.uchk.gap.communication.service;

import com.uchk.gap.common.BusinessException;
import com.uchk.gap.common.PageResponse;
import com.uchk.gap.communication.dto.CompteRenduDto;
import com.uchk.gap.communication.dto.CompteRenduRequest;
import com.uchk.gap.communication.entity.CompteRendu;
import com.uchk.gap.communication.repository.CompteRenduRepository;
import com.uchk.gap.utilisateur.entity.Role;
import com.uchk.gap.utilisateur.entity.Utilisateur;
import com.uchk.gap.utilisateur.repository.RoleRepository;
import com.uchk.gap.utilisateur.repository.UtilisateurRepository;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CompteRenduService {

    private final CompteRenduRepository repository;
    private final RoleRepository roleRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final NotificationService notificationService;

    public CompteRenduService(CompteRenduRepository repository,
            RoleRepository roleRepository,
            UtilisateurRepository utilisateurRepository,
            NotificationService notificationService) {
        this.repository = repository;
        this.roleRepository = roleRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.notificationService = notificationService;
    }

    public List<CompteRenduDto> findVisibleFor(String email) {
        return searchVisible(email, null, null, null, null, null, Pageable.unpaged())
                .content();
    }

    @Transactional(readOnly = true)
    public PageResponse<CompteRenduDto> searchVisible(
            String email,
            String q,
            String type,
            String auteur,
            LocalDate dateFrom,
            LocalDate dateTo,
            Pageable pageable) {
        Set<String> userRoles = userRoleCodes(email);
        List<CompteRenduDto> visible = repository
                .searchFiltered(q, type, auteur, dateFrom, dateTo)
                .stream()
                .filter(cr -> isVisible(cr.getRolesAutorises(), userRoles))
                .map(CompteRenduDto::from)
                .sorted(comparatorFrom(pageable))
                .toList();
        int page = pageable.isPaged() ? pageable.getPageNumber() : 0;
        int size = pageable.isPaged() ? pageable.getPageSize() : visible.size();
        String sort = pageable.getSort().isSorted()
                ? pageable.getSort().toString()
                : "dateEvent: DESC";
        return PageResponse.slice(visible, page, size, sort);
    }

    @Transactional(readOnly = true)
    public CompteRenduDto findById(Long id, String email) {
        CompteRendu cr = getOrThrow(id);
        if (!isVisible(cr.getRolesAutorises(), userRoleCodes(email))) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "Acces refuse a ce compte rendu");
        }
        return CompteRenduDto.from(cr);
    }

    @Transactional
    public CompteRenduDto create(CompteRenduRequest request, String email) {
        CompteRendu cr = new CompteRendu();
        apply(cr, request);
        utilisateurRepository.findByEmail(email).ifPresent(cr::setAuteur);
        CompteRendu saved = repository.save(cr);

        notificationService.broadcast(
                "Nouveau compte rendu",
                "Compte rendu : " + saved.getTitre(),
                "COMPTE_RENDU",
                "/communication/" + saved.getId());

        return CompteRenduDto.from(saved);
    }

    @Transactional
    public CompteRenduDto update(Long id, CompteRenduRequest request) {
        CompteRendu cr = getOrThrow(id);
        apply(cr, request);
        return CompteRenduDto.from(repository.save(cr));
    }

    @Transactional
    public void delete(Long id) {
        CompteRendu cr = getOrThrow(id);
        cr.setDeleted(true);
        repository.save(cr);
    }

    private CompteRendu getOrThrow(Long id) {
        CompteRendu cr = repository.findDetailById(id)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Compte rendu introuvable"));
        return cr;
    }

    private void apply(CompteRendu cr, CompteRenduRequest request) {
        cr.setTitre(request.titre());
        cr.setType(request.type());
        cr.setDateEvent(request.dateEvent());
        cr.setContenu(request.contenu());
        cr.setDocumentUrl(request.documentUrl());
        Set<Role> roles = new HashSet<>();
        if (request.rolesAutorises() != null) {
            for (String code : request.rolesAutorises()) {
                roleRepository.findByCode(code).ifPresent(roles::add);
            }
        }
        cr.setRolesAutorises(roles);
    }

    private boolean isVisible(Set<Role> rolesAutorises, Set<String> userRoles) {
        if (rolesAutorises == null || rolesAutorises.isEmpty()) {
            return true;
        }
        if (userRoles.contains("ADMIN")) {
            return true;
        }
        return rolesAutorises.stream().anyMatch(r -> userRoles.contains(r.getCode()));
    }

    private Set<String> userRoleCodes(String email) {
        return utilisateurRepository.findByEmail(email)
                .map(Utilisateur::getRoles)
                .orElseGet(Set::of)
                .stream()
                .map(Role::getCode)
                .collect(java.util.stream.Collectors.toSet());
    }

    private Comparator<CompteRenduDto> comparatorFrom(Pageable pageable) {
        if (!pageable.getSort().isSorted()) {
            return Comparator
                    .comparing(
                            CompteRenduDto::dateEvent,
                            Comparator.nullsLast(LocalDate::compareTo))
                    .reversed();
        }
        Comparator<CompteRenduDto> result = (a, b) -> 0;
        for (Sort.Order order : pageable.getSort()) {
            Comparator<CompteRenduDto> next = fieldComparator(order.getProperty());
            if (order.isDescending()) {
                next = next.reversed();
            }
            result = result.thenComparing(next);
        }
        return result;
    }

    private Comparator<CompteRenduDto> fieldComparator(String property) {
        return switch (property) {
            case "titre" -> Comparator.comparing(
                    CompteRenduDto::titre,
                    Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER));
            case "type" -> Comparator.comparing(
                    CompteRenduDto::type,
                    Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER));
            case "auteur" -> Comparator.comparing(
                    CompteRenduDto::auteur,
                    Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER));
            case "date", "dateEvent" -> Comparator.comparing(
                    CompteRenduDto::dateEvent,
                    Comparator.nullsLast(LocalDate::compareTo));
            default -> Comparator.comparing(
                    CompteRenduDto::dateEvent,
                    Comparator.nullsLast(LocalDate::compareTo));
        };
    }
}
