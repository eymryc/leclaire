# Essayage virtuel — Option B (build maison)

Pipeline pour un VTO optique correct : **modèles 3D GLB** + **occluder tête** + **MediaPipe Face Landmarker** + **Three.js**.

Sans assets 3D (étapes 1–2), aucun code ne donnera un rendu « oreilles / branches / matière ».

---

## Prérequis

- Next.js (projet actuel)
- Blender (ou studio 3D) pour les montures
- Caméra navigateur (HTTPS / localhost)
- Dépendances déjà en place : `three`, `@mediapipe/tasks-vision`

### Fichiers techniques déjà préparés

| Élément | Chemin |
|--------|--------|
| Dossier assets | `/public/models/` |
| Moteur 3D | `src/lib/vto/createVtoEngine.ts` |
| Catalogue (champs GLB) | `src/lib/catalog/products.ts` → `modelGlb`, `occluderGlb` |
| Aperçu 2D actuel | `src/components/product/VirtualTryOnModal.tsx` |

---

## Étape 0 — Socle (fait)

- [x] Installer `three`
- [x] Ajouter `modelGlb` / `occluderGlb` au type produit
- [x] Créer `createVtoEngine.ts`
- [x] Créer `/public/models/`

Tant qu’aucun `.glb` n’est présent, le site reste en **aperçu 2D**.

---

## Étape 1 — Modéliser 1 monture pilote (Aura Eclipse)

**Responsable :** designer 3D / Blender **ou outil en ligne**  
**Livrable :** `public/models/aura-eclipse.glb`

### Outils en ligne (étape 1)

| Outil | Pour quoi | Export GLB | Niveau |
|-------|-----------|------------|--------|
| **[Fittingbox — 3D from Photo](https://fittingbox.com/en/digital-frames/3d-digitization/3d-from-photo)** | Spécialisé lunettes : 2 photos (face + profil) → 3D | Oui (souvent en option / sur devis) | Meilleur pour optique |
| **[Meshy AI](https://www.meshy.ai/)** | Image ou texte → modèle 3D générique | Oui (GLB) | Rapide, qualité variable |
| **[Luma Genie](https://lumalabs.ai/genie) / Tripo / Rodin** | Image → mesh 3D généraliste | Souvent GLB | Prototypage |
| **Blender (local)** | Modélisation / retouche précise | Oui | Contrôle total |

**Recommandation étape 1 :**  
1. Prototypage rapide → **Meshy** (photo catalogue → GLB)  
2. Qualité optique boutique → **Fittingbox 3D from Photo** (face + profil)  
3. Finitions / origine pont de nez → ouvrir le GLB dans **Blender** et corriger

Photos Fittingbox : fond uni, face + profil ~90°, nommage type `SKU_1.jpg` / `SKU_2.jpg`.

### Règles d’export Blender

1. Origine au **pont de nez** (entre les deux verres)
2. Unités en **mètres**, scale appliqué (`Ctrl+A` → Scale)
3. Matériaux **Principled BSDF** → metal/roughness glTF
4. Export **glTF Binary (.glb)**
5. (Optionnel) Face -Z vers la caméra, ou appliquer rotation X −90° à l’export

### Convention runtime (moteur)

Le moteur applique par défaut :

- `scale ≈ 0.1` (à calibrer par SKU)
- `rotation.x = -π/2` si l’export Blender l’exige

---

## Étape 2 — Occluder tête

**Responsable :** designer 3D / outil en ligne  
**Livrable :** `public/models/face-occluder.glb`

### Outils en ligne / gratuits (étape 2)

Il n’existe **pas** vraiment d’outil “1 clic → occluder lunettes parfait”. En pratique :

| Approche | Lien / outil | Commentaire |
|----------|--------------|-------------|
| **Guide Face Tryon + Three.js Editor** | [facetryon.com/docs/preparing-3d-model](https://facetryon.com/docs/preparing-3d-model) | Alignement sur face standard + création occluder oreilles dans l’éditeur Three.js (navigateur) |
| **Occluder oreilles réutilisable** | Doc Face Tryon (export séparé) | Souvent 1 occluder pour **toutes** les montures |
| **Canonical Face MediaPipe** | Modèle face Google (FBX/OBJ) | Base pour aligner ; mesh partiel (pas d’oreilles complètes) |
| **Blender** | Local | Cubes / plans “proxy” oreilles + front = occluder simple et efficace |

**Recommandation étape 2 :**  
1. Suivre le tuto **Face Tryon** (éditeur Three.js en ligne) pour créer un **ear occluder**  
2. Ou dans Blender : 2 plans/cubes derrière les oreilles + éventuellement un masque front  
3. Exporter `face-occluder.glb` une seule fois, le réutiliser sur tout le catalogue

En runtime : `colorWrite: false`, `depthWrite: true` (déjà prévu dans `createVtoEngine.ts`).

- Masque 3D du visage / crâne
- Effet : les **branches passent derrière** les oreilles / la tête
- Souvent **un seul occluder global** pour toutes les montures

Référencé côté catalogue (pilote) :

```ts
occluderGlb: "/models/face-occluder.glb"
```

---

## Étape 3 — Brancher le moteur 3D dans l’UI

**Responsable :** dev  
**Quand :** dès que `aura-eclipse.glb` est dans `/public/models/`

1. À l’ouverture de l’essayage, lire `product.modelGlb`
2. Vérifier que le fichier existe (`HEAD` / fetch)
3. Si oui → `createVtoEngine({ canvas, video, modelUrl, occluderUrl })`
4. Si non → garder l’aperçu 2D + message « modèle 3D en préparation »
5. Calibrer par SKU : `scale`, rotation, offset Y

### Stack runtime

```
Webcam (getUserMedia)
  → MediaPipe FaceLandmarker (VIDEO + facialTransformationMatrixes)
  → Matrice 4×4 → pose Three.js (position + quaternion)
  → Scene : occluder (depth) + monture GLB
  → Canvas WebGL par-dessus la vidéo
```

---

## Étape 4 — Dérouler le catalogue

Pour chaque produit :

| Action | Détail |
|--------|--------|
| Fichier | `/public/models/{slug}.glb` |
| Catalogue | `modelGlb: "/models/{slug}.glb"` dans `products.ts` |
| Priorité | Bestsellers / SKU les plus vendus d’abord |

Exemple :

```
/public/models/aura-eclipse.glb
/public/models/titanium-x1.glb
/public/models/nordic-line-42.glb
…
/public/models/face-occluder.glb
```

---

## Étape 5 — QA

Tester sur plusieurs conditions :

- [ ] Face caméra
- [ ] Angle ¾
- [ ] Léger profil
- [ ] Lumière faible / forte
- [ ] Peaux claires / foncées
- [ ] Personne qui porte déjà des lunettes
- [ ] Desktop Chrome
- [ ] Mobile Safari / Chrome
- [ ] Branches visibles derrière les oreilles (occluder OK)
- [ ] Pas de jitter excessif (éventuel lissage / EWMA)

---

## Qui fait quoi (immédiat)

| Rôle | Action |
|------|--------|
| **3D** | Produire `aura-eclipse.glb` + `face-occluder.glb` |
| **Dev** | Dès le drop des GLB → activer l’étape 3 dans `VirtualTryOnModal` |
| **Produit** | Valider le rendu sur 5–10 visages |

---

## Prochaine action

1. Déposer `aura-eclipse.glb` dans `/public/models/`
2. (Idéalement) déposer aussi `face-occluder.glb`
3. Demander au dev d’**activer l’étape 3** (remplacer le collage 2D par Three.js)

---

## Hors scope (plus tard)

- Variantes couleur via matériaux / textures swap
- Mesure PD (écart pupillaire) pour taille réelle
- SDK commercial (Fittingbox, Banuba) si volume / realism PBR boutique
