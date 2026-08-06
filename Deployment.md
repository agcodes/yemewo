# 🚀 Procédures de Déploiement - Yemewo

Ce document décrit les **procédures de déploiement** du projet **Yemewo**, une application **SPA (Single Page Application)** déployée automatiquement sur **OVH** via **GitHub Actions**. Il inclut les étapes pour le déploiement automatique, manuel, ainsi que les procédures de rollback et de gestion des incidents.

## 📌 **Prérequis**

### Environnement
- Un **dépôt GitHub** avec le code source de Yemewo.
- Un **compte OVH** avec un hébergement web configuré (FTP/SSH).
- **Node.js 24+** (recommandé) et **npm** installés localement pour le développement.
- **Docker** (optionnel, pour les tests locaux).

### Secrets GitHub
Les variables suivantes doivent être configurées dans **GitHub Secrets** (`Settings` → `Secrets and variables` → `Actions`) :
   **Nom du secret**       | **Description**                          | **Exemple**                     |
 |-------------------------|------------------------------------------|---------------------------------|
 | `FTP_SERVER`            | Adresse du serveur FTP OVH               | `ftp.yemewo.ovh`               |
 | `FTP_USERNAME`          | Nom d'utilisateur FTP OVH                | `yemewo-user`                  |
 | `FTP_PASSWORD`          | Mot de passe FTP OVH                     | `********`                      |

---

## 🔄 **Déploiement Automatique (CI/CD)**

Le projet utilise **GitHub Actions** pour automatiser le **build, les tests, l'audit de sécurité et le déploiement** sur OVH.
Le workflow est déclenché à chaque **`push`** sur les branches `main` ou `dev`.

### ⚙️ **Workflow GitHub Actions**
- **Fichier** : [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)
- **Étapes** :
  1. **Checkout** : Récupération du code source.
  2. **Setup Node.js** : Configuration de Node.js 24 avec cache npm.
  3. **Installation des dépendances** : `npm ci` pour une installation déterministe.
  4. **Audit de sécurité** : `npm audit --audit-level=critical` pour bloquer les vulnérabilités critiques.
  5. **Build** : `npm run build` pour générer les fichiers statiques.
  6. **Tests** : `npm run test` pour valider le code.
  7. **Déploiement sur OVH** : Uniquement sur la branche `main`, via FTP.

### 1️⃣ **Build Local**
Pour builder le projet localement :
```bash
# Installe les dépendances
npm install

# Lance le build
npm run build