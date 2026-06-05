UPDATE etudiant e
SET utilisateur_id = u.id
FROM utilisateur u
WHERE u.email = 'etudiant@uchk.sn'
  AND e.ine = 'INE2024001'
  AND e.utilisateur_id IS NULL;
