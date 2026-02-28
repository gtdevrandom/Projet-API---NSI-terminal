# KaliFit — PWA Fitness & Nutrition Intelligence

**KaliFit** est une Progressive Web App (PWA) dédiée à la **nutrition, la performance sportive et l’optimisation intelligente**.

**KaliFit** vient de **Kalos Fitness**, qui signifie “beauté et perfection” en grec, combiné avec **Fit** pour le fitness et la performance.

## 📂 Fichiers du projet

| Fichier         | Description                           |
|-----------------|---------------------------------------|
| `manifest.json` | Configuration PWA                     |
| `sw.js`         | Service Worker                        |
| `index.html`    | Structure principale                  |
| `style.css`     | Styles                                |
| `script.js`     | Logique front-end                     |
| `api.js`        | Gestion des APIs                      |
| `favicon.ico`   | Icône                                 |
| `README.md`     | Résumé du projet                        |
| `LICENSE`       | License MIT                               |

---

## 💡 Idées d'APIs pour l'application

| Statut | API / Fonctionnalité                                               |
|--------|--------------------------------------------------------------------|
| 🔴 Refusé | Site météo + qualité de l'air + autres informations             |
| 🔴 Refusé | API de trading                                                  |
| 🟢 Validé | Intégration Spotify, Deezer, Soundcharts, YouTube mp3           |
| 🟡 Potentiel | YouTube, Twitch                                              |
| 🔴 Refusé | IA ? (Explorer des fonctionnalités d'intelligence artificielle) |
| 🟡 Potentiel | SMS                                                          |
| 🏆 Gagnant | Sports, alimentation (+IA ?)                                   |
| 🔴 Refusé | Plaque d'immatriculation/véhicule                               |
| 🔴 Refusé | Images                                                          |
| 🔴 Refusé | Cybersécurité                                                   |

**Légende :**  
- 🟢 Validé  
- 🟡 Potentiel  
- 🔴 Refusé
- 🏆 Gagnant

---

## ⚠️ APIs improbables

- API génératrice d'insulte : [Insult Generator](https://rapidapi.com/Lakerolmaker/api/insult-generator/playground/5a6a1c60e4b0424ac2c3e298)  
- API génératrice de contenu à caractère sexuel

---

## 🗑️ APIs inutiles

- Recherche d'utilisateur GitHub  
- Affichage aléatoire d'animaux (Shibe Online)

---

## 🌐 Sites de référence

- Liste d'APIs gratuites sur RapidAPI : [RapidAPI Free APIs](https://rapidapi.com/collection/list-of-free-apis)
## API et Services Utilisés

KaliFit repose sur une architecture robuste, privilégiant la sécurité des données et l'absence d'exposition de clés secrètes côté client.

---

### Résumé des services

1. OpenFoodFacts
   - Rôle : Recherche & Données nutritionnelles
   - Authentification : Publique (Sans clé)

2. WGER
   - Rôle : Exercices & Routines fitness
   - Authentification : OAuth2 (Session utilisateur)

3. Google Gemini
   - Rôle : Coach IA & Analyse prédictive
   - Authentification : Firebase Auth (Proxy Serverless)

---

### Détails techniques

#### 1. OpenFoodFacts (Nutrition)
Base de données mondiale et collaborative sur les produits alimentaires.
- Usage : Recherche par nom ou scan de code-barres pour récupérer les macros (protéines, glucides, lipides).
- Pourquoi : Accès libre, aucune gestion de clé requise, idéal pour une intégration rapide et légère en PWA.

#### 2. WGER (Sport)
API communautaire dédiée au fitness et à la musculation.
- Usage : Accès à une vaste bibliothèque d'exercices, création de programmes et suivi des performances.
- Authentification : Utilise le flux OAuth2. L'utilisateur se connecte directement via son compte WGER, garantissant que les données de progression restent privées et liées à son profil sans que KaliFit ne stocke de jetons sensibles.

#### 3. Google Gemini (Intelligence Artificielle)
Moteur de génération de texte et d'analyse de données pour le coaching.
- Usage : Génération de conseils nutritionnels, ajustements de programmes et analyse de stagnation.
- Architecture sécurisée : Pour éviter d'exposer les clés API dans le navigateur, KaliFit utilise Firebase Cloud Functions.
  - Le front-end envoie la requête à la fonction Firebase.
  - La fonction vérifie l'identité de l'utilisateur (Firebase Auth).
  - La fonction appelle l'API Gemini via une variable d'environnement sécurisée.
  - Seule la réponse est renvoyée au front-end.

---

Note sur la sécurité : Aucune clé API sensible n'est présente dans le code source de l'application (côté client). KaliFit respecte les bonnes pratiques de développement en déportant la logique sécurisée sur des fonctions serveur (Serverless).

## 🚀 Fonctionnalités de KaliFit

### 1️⃣ Profil biométrique intelligent
- Poids, taille, âge, sexe  
- Objectif (prise de masse, sèche, performance, santé)  
- Calcul automatique BMR / TDEE  
- Ajustement dynamique selon progression  

### 2️⃣ Tracker nutrition automatique
- Scan ou recherche d’aliments  
- Calcul macros (protéines, lipides, glucides)  
- Analyse micronutriments  
- Score qualité alimentaire journalier  

### 3️⃣ Recommandations repas personnalisées (IA)
- Basées sur : objectif, entraînement du jour, déficit/surplus calorique  
- Adaptation en temps réel  

### 4️⃣ Planification hebdomadaire intelligente
- Planning repas + entraînements synchronisés  
- Ajustement automatique si séance manquée  
- Génération liste de courses optimisée  

### 5️⃣ Corrélation sport ↔ nutrition ↔ récupération
- Analyse performance sportive, apport calorique, sommeil  
- Détection de sous-alimentation ou surentraînement  

### 6️⃣ Coach IA conversationnel
- Exemples : “Que dois-je manger après cette séance ?”, “Pourquoi je stagne ?”  
- Réponses contextualisées selon données utilisateur  

### 7️⃣ Score de récupération
- Basé sur charge d’entraînement, apport nutritionnel, hydratation, sommeil  
- Indice simple 0–100  

### 8️⃣ Suggestions d’optimisation
- Exemples : “Augmente tes protéines de 15g”, “Ton déficit est trop agressif”  

### 9️⃣ Objectifs dynamiques
- Ajustement automatique des calories  
- Révision des macros selon progression réelle  
- Adaptation après stagnation  

### 🔟 Dashboard analytics avancé
- Évolution poids  
- Ratio performance/calories  
- Heatmap entraînements  
- Graphiques macro-nutriments

---

## 📜 Licence

Ce projet est sous licence [MIT](LICENSE). Consultez le fichier `LICENSE` pour plus de détails.
