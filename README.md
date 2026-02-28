KaliFit — PWA Fitness & Nutrition Intelligence
==============================================

KaliFit est une Progressive Web App (PWA) dediee a la nutrition, la performance sportive et l'optimisation intelligente.
Le nom KaliFit provient de Kalos Fitness (beaute et perfection en grec) combine avec Fit (fitness et performance).

---

Table des matieres
-----------------
1. [Fichiers du projet](#fichiers-du-projet)
2. [Idees d'APIs et Strategie](#idees-dapis-et-strategie)
3. [APIs et Services utilises](#apis-et-services-utilises)
4. [Fonctionnalites de KaliFit](#fonctionnalites-de-kalifit)
5. [APIs improbables et inutiles](#apis-improbables-et-inutiles)
6. [Maquette et Logo](#maquette-et-logo)
7. [References et Licence](#references-et-licence)

---

Fichiers du projet
------------------

Fichier                | Description
---------------------- | ----------------
manifest.json          | Configuration PWA
sw.js                  | Service Worker
index.html             | Structure principale
style.css              | Styles
script.js              | Logique front-end
api.js                 | Gestion des APIs
favicon.ico            | Icone
README.md              | Resume du projet
LICENSE                | Licence MIT

---

Idees d'APIs et Strategie
-------------------------

Statut  | API / Fonctionnalite
------- | --------------------
Refuse  | Site meteo + qualite de l'air + autres informations
Refuse  | API de trading
Valide  | Integration Spotify, Deezer, Soundcharts, YouTube mp3
Potentiel | YouTube, Twitch
Refuse  | IA ? (Explorer des fonctionnalites d'intelligence artificielle)
Potentiel | SMS
Gagnant  | Sports, alimentation (+IA ?)
Refuse  | Plaque d'immatriculation / vehicule
Refuse  | Images
Refuse  | Cybersecurite

Legende : Valide | Potentiel | Refuse | Gagnant

---

APIs et Services utilises
------------------------

KaliFit repose sur une architecture robuste, privilegiant la securite des donnees et l'absence d'exposition de cles secretes cote client.

Resume des services
1. OpenFoodFacts : Recherche & Donnees nutritionnelles (publique, sans cle)
2. WGER : Exercices & Routines fitness (OAuth2, session utilisateur)
3. Google Gemini : Coach IA & Analyse predictive (Firebase Auth, via Proxy Serverless)

Details techniques
- OpenFoodFacts (Nutrition)
  Base de donnees mondiale.
  Usage : Recherche par nom ou scan code-barres.
  Acces libre.

- WGER (Sport)
  Acces a une bibliotheque d'exercices et suivi des performances.
  Authentification via OAuth2 pour preserver la vie privee.

- Google Gemini (IA)
  Generation de conseils et analyse de stagnation.
  
  Architecture securisee :
  - Le front-end envoie la requete a une Firebase Cloud Function
  - Verification d'identite via Firebase Auth
  - Appel de l'API Gemini via variable d'environnement securisee
  - Retour uniquement de la reponse traitee

Note de securite : Aucune cle API sensible n'est presente cote client.

---

Fonctionnalites de KaliFit
--------------------------

1. Profil biometrque intelligent : Poids, taille, age, sexe, objectif, calcul BMR/TDEE
2. Tracker nutrition automatique : Scan, macros, micronutriments et score qualite
3. Recommandations repas (IA) : Adaptees a l'entrainement du jour et aux objectifs
4. Planification hebdomadaire intelligente : Planning repas/entrainement avec ajustement automatique
5. Correlation globale : Analyse sport/nutrition/sommeil pour eviter le surentrainement
6. Coach IA conversationnel : Reponses contextualisees aux questions utilisateur
7. Score de recuperation : Indice 0-100 base sur la charge et le repos
8. Suggestions d’optimisation : Conseils precis (ex : +15g proteines)
9. Objectifs dynamiques : Ajustement automatique des calories selon la progression
10. Dashboard analytics avance : Evolution poids, ratio performance/calories, heatmap

---

APIs improbables et inutiles
---------------------------

Improbables :
- API generatrice d'insulte
- API generatrice de contenu a caractere sexuel

Inutiles :
- Recherche d'utilisateur GitHub
- Affichage aleatoire d'animaux

---

Maquette et Logo
----------------

- Une maquette fonctionnelle de l'application a ete realisee sur Figma.
- Le logo de KaliFit a ete genere avec une intelligence artificielle.
- Aperçu de la maquette : ![Maquette KaliFit](maquette_figma/app.png)

---

References et Licence
--------------------

- Liste d'APIs gratuites : RapidAPI
- Licence : Ce projet est sous [license](LICENSE) MIT
