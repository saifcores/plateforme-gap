package com.uchk.gap.config;

import com.uchk.gap.administration.entity.Circulaire;
import com.uchk.gap.administration.entity.Courrier;
import com.uchk.gap.administration.entity.NoteAdministrative;
import com.uchk.gap.administration.repository.CirculaireRepository;
import com.uchk.gap.administration.repository.CourrierRepository;
import com.uchk.gap.administration.repository.NoteAdministrativeRepository;
import com.uchk.gap.communication.entity.CompteRendu;
import com.uchk.gap.communication.repository.CompteRenduRepository;
import com.uchk.gap.etudiant.entity.Etudiant;
import com.uchk.gap.etudiant.repository.EtudiantRepository;
import com.uchk.gap.formation.entity.Formateur;
import com.uchk.gap.formation.entity.Formation;
import com.uchk.gap.formation.entity.FormationFormateur;
import com.uchk.gap.formation.entity.Reunion;
import com.uchk.gap.formation.entity.Seance;
import com.uchk.gap.formation.repository.FormateurRepository;
import com.uchk.gap.formation.repository.FormationFormateurRepository;
import com.uchk.gap.formation.repository.FormationRepository;
import com.uchk.gap.formation.repository.ReunionRepository;
import com.uchk.gap.formation.repository.SeanceRepository;
import com.uchk.gap.insertion.entity.Insertion;
import com.uchk.gap.insertion.entity.Partenaire;
import com.uchk.gap.insertion.entity.RegistreContact;
import com.uchk.gap.insertion.entity.Stage;
import com.uchk.gap.insertion.repository.InsertionRepository;
import com.uchk.gap.insertion.repository.PartenaireRepository;
import com.uchk.gap.insertion.repository.RegistreContactRepository;
import com.uchk.gap.insertion.repository.StageRepository;
import com.uchk.gap.utilisateur.entity.Role;
import com.uchk.gap.utilisateur.entity.Utilisateur;
import com.uchk.gap.utilisateur.repository.RoleRepository;
import com.uchk.gap.utilisateur.repository.UtilisateurRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

@Configuration
public class DemoDataInitializer {

        private static final Logger log = LoggerFactory.getLogger(DemoDataInitializer.class);
        static final String DEMO_PASSWORD = "demo123";

        @Bean
        CommandLineRunner seedDemoData(
                        FormationRepository formationRepository,
                        FormateurRepository formateurRepository,
                        EtudiantRepository etudiantRepository,
                        PartenaireRepository partenaireRepository,
                        StageRepository stageRepository,
                        RegistreContactRepository registreContactRepository,
                        InsertionRepository insertionRepository,
                        CourrierRepository courrierRepository,
                        CirculaireRepository circulaireRepository,
                        CompteRenduRepository compteRenduRepository,
                        SeanceRepository seanceRepository,
                        ReunionRepository reunionRepository,
                        FormationFormateurRepository formationFormateurRepository,
                        NoteAdministrativeRepository noteAdministrativeRepository,
                        UtilisateurRepository utilisateurRepository,
                        RoleRepository roleRepository,
                        PasswordEncoder passwordEncoder) {
                return args -> seedIfEmpty(
                                formationRepository,
                                formateurRepository,
                                seanceRepository,
                                reunionRepository,
                                formationFormateurRepository,
                                noteAdministrativeRepository,
                                etudiantRepository,
                                partenaireRepository,
                                stageRepository,
                                registreContactRepository,
                                insertionRepository,
                                courrierRepository,
                                circulaireRepository,
                                compteRenduRepository,
                                utilisateurRepository,
                                roleRepository,
                                passwordEncoder);
        }

        @Transactional
        void seedIfEmpty(
                        FormationRepository formationRepository,
                        FormateurRepository formateurRepository,
                        SeanceRepository seanceRepository,
                        ReunionRepository reunionRepository,
                        FormationFormateurRepository formationFormateurRepository,
                        NoteAdministrativeRepository noteAdministrativeRepository,
                        EtudiantRepository etudiantRepository,
                        PartenaireRepository partenaireRepository,
                        StageRepository stageRepository,
                        RegistreContactRepository registreContactRepository,
                        InsertionRepository insertionRepository,
                        CourrierRepository courrierRepository,
                        CirculaireRepository circulaireRepository,
                        CompteRenduRepository compteRenduRepository,
                        UtilisateurRepository utilisateurRepository,
                        RoleRepository roleRepository,
                        PasswordEncoder passwordEncoder) {
                if (formationRepository.count() > 0) {
                        return;
                }

                Utilisateur admin = utilisateurRepository.findByEmail("admin@uchk.sn").orElse(null);
                seedDemoUsers(utilisateurRepository, roleRepository, passwordEncoder);

                Formation masterIl = new Formation();
                masterIl.setIntitule("Master Ingénierie Logicielle");
                masterIl.setType("DIPLOMANTE");
                masterIl.setNiveau("M2");
                masterIl.setDateDebut(LocalDate.of(2024, 9, 1));
                masterIl.setDateFin(LocalDate.of(2026, 6, 30));
                masterIl.setTypeFinancement("ETAT");
                masterIl.setMontantFinancement(new BigDecimal("15000000"));
                masterIl = formationRepository.save(masterIl);

                Formation certifWeb = new Formation();
                certifWeb.setIntitule("Certification Développement Web");
                certifWeb.setType("CERTIFIANTE");
                certifWeb.setNiveau("PRO");
                certifWeb.setDateDebut(LocalDate.of(2025, 3, 1));
                certifWeb.setDateFin(LocalDate.of(2025, 8, 31));
                certifWeb.setTypeFinancement("PARTENAIRE");
                certifWeb = formationRepository.save(certifWeb);

                Formateur formateur = new Formateur();
                formateur.setNom("Diop");
                formateur.setPrenom("Amadou");
                formateur.setEmail("a.diop@uchk.sn");
                formateur.setType("PERMANENT");
                formateur = formateurRepository.save(formateur);

                final Etudiant etu1 = etudiantRepository.save(
                                createEtudiant("INE2024001", "Ndiaye", "Fatou", "F", masterIl));
                Etudiant etu2 = etudiantRepository.save(
                                createEtudiant("INE2024002", "Sarr", "Moussa", "M", masterIl));
                Etudiant etu3 = etudiantRepository.save(
                                createEtudiant("INE2024003", "Ba", "Aissatou", "F", certifWeb));

                utilisateurRepository.findByEmail("etudiant@uchk.sn").ifPresent(user -> {
                        etu1.setUtilisateur(user);
                        etudiantRepository.save(etu1);
                });

                Seance seance1 = new Seance();
                seance1.setFormation(masterIl);
                seance1.setFormateur(formateur);
                seance1.setMatiere("Architecture logicielle");
                seance1.setType("COURS");
                seance1.setDateSeance(LocalDate.of(2026, 3, 10));
                seance1.setHeureDebut(LocalTime.of(9, 0));
                seance1.setHeureFin(LocalTime.of(11, 0));
                seance1.setSalle("Amphi A");
                seanceRepository.save(seance1);

                Seance seance2 = new Seance();
                seance2.setFormation(masterIl);
                seance2.setFormateur(formateur);
                seance2.setMatiere("Gestion de projet");
                seance2.setType("COURS");
                seance2.setDateSeance(LocalDate.of(2026, 3, 12));
                seance2.setHeureDebut(LocalTime.of(14, 0));
                seance2.setHeureFin(LocalTime.of(16, 0));
                seance2.setSalle("Salle 204");
                seanceRepository.save(seance2);

                Reunion reunionTutorat = new Reunion();
                reunionTutorat.setFormation(masterIl);
                reunionTutorat.setType("TUTORAT");
                reunionTutorat.setObjet("Suivi tutorat — Master IL");
                reunionTutorat.setDateReunion(
                                OffsetDateTime.of(2026, 3, 5, 10, 0, 0, 0, ZoneOffset.UTC));
                reunionTutorat.setLieu("Salle conseil");
                reunionTutorat.setCompteRendu("Points d'attention sur les mémoires en cours.");
                reunionRepository.save(reunionTutorat);

                Reunion reunionCours = new Reunion();
                reunionCours.setFormation(masterIl);
                reunionCours.setType("PREPARATION_COURS");
                reunionCours.setObjet("Préparation module Architecture");
                reunionCours.setDateReunion(
                                OffsetDateTime.of(2026, 3, 8, 14, 0, 0, 0, ZoneOffset.UTC));
                reunionCours.setLieu("Bureau pédagogique");
                reunionRepository.save(reunionCours);

                FormationFormateur affectation = new FormationFormateur();
                affectation.setFormationId(masterIl.getId());
                affectation.setFormateurId(formateur.getId());
                affectation.setRoleDansFormation("RESPONSABLE_MODULE");
                formationFormateurRepository.save(affectation);

                NoteAdministrative noteAdmin = new NoteAdministrative();
                noteAdmin.setObjet("Organisation des examens de fin de semestre");
                noteAdmin.setContenu("Planning validé par la direction des études.");
                noteAdmin.setDateNote(LocalDate.of(2026, 2, 20));
                noteAdministrativeRepository.save(noteAdmin);

                Partenaire orange = new Partenaire();
                orange.setNom("Orange Digital Center");
                orange.setType("ENTREPRISE");
                orange.setSecteur("Télécoms / Numérique");
                orange.setContactNom("M. Fall");
                orange.setContactEmail("contact@orange.sn");
                orange.setStatut("ACTIF");
                orange.setDatePartenariat(LocalDate.of(2023, 1, 15));
                orange = partenaireRepository.save(orange);

                Partenaire ong = new Partenaire();
                ong.setNom("Force-N");
                ong.setType("ONG");
                ong.setSecteur("Entrepreneuriat");
                ong.setStatut("ACTIF");
                partenaireRepository.save(ong);

                Stage stage = new Stage();
                stage.setEtudiant(etu1);
                stage.setPartenaire(orange);
                stage.setSujet("Plateforme e-learning UCHK");
                stage.setDateDebut(LocalDate.of(2025, 6, 1));
                stage.setDateFin(LocalDate.of(2025, 8, 31));
                stage.setBilan("Stage réussi, bonne maîtrise Spring Boot et Angular.");
                stage.setNote(new BigDecimal("16.50"));
                stageRepository.save(stage);

                RegistreContact contact = new RegistreContact();
                contact.setEtudiant(etu2);
                contact.setDateContact(LocalDate.of(2025, 9, 10));
                contact.setCanal("ENTRETIEN");
                contact.setObjet("Orientation insertion professionnelle");
                contact.setCompteRendu("Souhaite travailler en développement backend.");
                registreContactRepository.save(contact);

                Insertion ins1 = new Insertion();
                ins1.setEtudiant(etu1);
                ins1.setType("SALARIE");
                ins1.setEntreprise("Sonatel");
                ins1.setPoste("Développeur Java");
                ins1.setSecteur("Télécoms");
                ins1.setDateInsertion(LocalDate.of(2025, 10, 1));
                insertionRepository.save(ins1);

                Insertion ins2 = new Insertion();
                ins2.setEtudiant(etu3);
                ins2.setType("AUTO_EMPLOI");
                ins2.setEntreprise("Freelance Web");
                ins2.setPoste("Consultante front-end");
                ins2.setSecteur("Services numériques");
                ins2.setDateInsertion(LocalDate.of(2025, 11, 15));
                insertionRepository.save(ins2);

                Courrier courrier = new Courrier();
                courrier.setType("ARRIVE");
                courrier.setReference("COUR-2025-042");
                courrier.setObjet("Convention de partenariat Orange");
                courrier.setExpediteur("Orange Sénégal");
                courrier.setDestinataire("Direction UCHK");
                courrier.setDateCourrier(LocalDate.of(2025, 5, 20));
                courrier.setStatut("TRAITE");
                courrierRepository.save(courrier);

                Circulaire circulaire = new Circulaire();
                circulaire.setReference("CIR-2025-010");
                circulaire.setObjet("Calendrier des soutenances Master IL");
                circulaire.setContenu("Les soutenances auront lieu du 15 au 30 juin 2026.");
                circulaire.setDateCirculaire(LocalDate.of(2026, 3, 1));
                circulaire.setNiveau("CENTRAL");
                circulaireRepository.save(circulaire);

                if (admin != null) {
                        CompteRendu cr = new CompteRendu();
                        cr.setTitre("Réunion pédagogique — Semestre 2");
                        cr.setType("REUNION");
                        cr.setDateEvent(LocalDate.of(2026, 2, 15));
                        cr.setContenu("Validation du programme et des évaluations.");
                        cr.setAuteur(admin);
                        compteRenduRepository.save(cr);
                }

                log.info("Donnees de demo chargees (formations, etudiants, insertion, admin)");
                log.info("Comptes demo : *@uchk.sn / {} (admin : admin@uchk.sn / admin123)", DEMO_PASSWORD);
        }

        private void seedDemoUsers(
                        UtilisateurRepository utilisateurRepository,
                        RoleRepository roleRepository,
                        PasswordEncoder passwordEncoder) {
                createUserIfAbsent(utilisateurRepository, roleRepository, passwordEncoder,
                                "administratif@uchk.sn", "Sow", "Mariama", "ADMINISTRATIF");
                createUserIfAbsent(utilisateurRepository, roleRepository, passwordEncoder,
                                "enseignant@uchk.sn", "Diop", "Amadou", "ENSEIGNANT");
                createUserIfAbsent(utilisateurRepository, roleRepository, passwordEncoder,
                                "resp.formation@uchk.sn", "Gueye", "Ibrahima", "RESPONSABLE_FORMATION");
                createUserIfAbsent(utilisateurRepository, roleRepository, passwordEncoder,
                                "tuteur@uchk.sn", "Cisse", "Oumar", "TUTEUR");
                createUserIfAbsent(utilisateurRepository, roleRepository, passwordEncoder,
                                "insertion@uchk.sn", "Thiam", "Awa", "APPUI_INSERTION");
                createUserIfAbsent(utilisateurRepository, roleRepository, passwordEncoder,
                                "etudiant@uchk.sn", "Ndiaye", "Fatou", "ETUDIANT");
        }

        private Etudiant createEtudiant(
                        String ine, String nom, String prenom, String genre, Formation formation) {
                Etudiant e = new Etudiant();
                e.setIne(ine);
                e.setNom(nom);
                e.setPrenom(prenom);
                e.setGenre(genre);
                e.setEmail(prenom.toLowerCase() + "." + nom.toLowerCase() + "@uchk.sn");
                e.setFormation(formation);
                e.setPromo("2024-2026");
                e.setAnneeDebut(2024);
                return e;
        }

        private void createUserIfAbsent(
                        UtilisateurRepository utilisateurRepository,
                        RoleRepository roleRepository,
                        PasswordEncoder passwordEncoder,
                        String email,
                        String nom,
                        String prenom,
                        String roleCode) {
                if (utilisateurRepository.existsByEmail(email)) {
                        return;
                }
                Role role = roleRepository.findByCode(roleCode)
                                .orElseThrow(() -> new IllegalStateException("Role absent: " + roleCode));
                Utilisateur user = new Utilisateur();
                user.setEmail(email);
                user.setMotDePasse(passwordEncoder.encode(DEMO_PASSWORD));
                user.setNom(nom);
                user.setPrenom(prenom);
                user.setRoles(Set.of(role));
                utilisateurRepository.save(user);
        }
}
