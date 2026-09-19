# Gungeon Tile Maps (vagues = 3 maps) — Design Spec

Date: 2026-09-19
Status: approved
Scope: moteur tilemap maison + tileset single-image + 3 maps (une par vague gungeon). Grille fixe, pas de scrolling (v2 éventuelle).

## 1. Goal
Remplacer la salle unique (2 murs rect) du gungeon par 3 tile maps différentes, une par vague, rendues depuis un tileset single-image, avec un moteur de génération maison (pas d'éditeur). Mêmes contraintes : plain JS/DOM, 60+ FPS à 60/165Hz, clavier seul.

## 2. Architecture
- Nouveau `gungeon/js/tiles.js` : enum `TILE` (0 vide, 1 sol, 2 mur, 3 obstacle, 4 spawn), atlas SVG injecté une fois, données `MAPS[3]`, `buildMap(layer, index)` → `{ columns, rows, size, tiles, getTile(col,row), isSolid(col,row), spawnPoints }`, `clearMap()`.
- Modifié `gungeon/js/room.js` : charge `MAPS[wave]` via `buildMap` au lieu de `freeSpot` aléatoire + murs fixes ; spawns sur tuiles 4 ; compteurs 3/5/7 et cadences inchangés.
- Modifié `gungeon/js/physics.js` : collisions solides via lookup grille `isSolid` + résolution par coins (remplace les 2 rects + push-out rect).
- Modifié `gungeon/js/entities.js` : suppression des `walls` rect (rendus par tiles.js) ; `reset()` recentre le joueur au spawn de la map.
- Tuiles créées une fois par vague (jamais dans la boucle), `transform: translate3d` fixe, zéro écriture style par frame.

## 3. Tileset & maps
- Atlas : un seul `<svg style="display:none">` avec 5 symboles 32×32 (sol-a, sol-b damier, mur, obstacle, spawn). Tuile = `<div class="tile"><svg><use href="#t-x"/></svg></div>`. Une seule source d'image, sections par référence.
- Grille : `columns: 25, rows: 19, size: 32` (800×608), `tiles[]` 475 entiers, `getTile: (col,row) => tiles[row*columns+col]`, `isSolid: t===2||t===3`, bordures toujours mur.
- Données en chaînes 25×19 (`#` mur, `.` sol, `o` obstacle, `S` spawn), parsées au chargement. Map 1 « Cour » ouverte + 4 plots ; Map 2 « Piliers » 2 rangées de piliers + spawns latéraux ; Map 3 « Labyrinthe » chicanes + spawns fond. Chaque map ≥ 2 tuiles spawn, toutes deux-à-deux différentes.
- HUD : vague affiche `N/3 — Nom` (ex. `2/3 — Piliers`). États/menus/score/cœurs/roulade inchangés. Rebuild map pendant l'inter-vague existant (1s), sans nouvel état.

## 4. Performance
- Tuiles statiques : coût nul en boucle. Entités/HUD inchangés (translate3d, HUD 4Hz, pools). Collisions grille = index array, moins cher que les AABB rect actuels.
- Cible : moyenne ≥ 60 FPS (lit ~165 sur 165Hz), zéro long-task > 8ms. Vérif : profile DevTools 30s + paint flashing par vague.

## 5. Tests
- Nouveau `gungeon/tests/tiles.test.mjs` : parse 25×19, bordures solides, ≥2 spawns/map, maps deux-à-deux différentes, `getTile`/`isSolid` conformes.
- Régressions : input/entities/room/physics + `node --check` main/ui. Manuel : visuel des 3 maps, spawns jamais bloqués, collisions murs ressenties.

## 6. Hors scope (v2+)
Scrolling + camera + culling, maps > écran, éditeur visuel, nouvelles tuiles (eau/lave), multi-salles connectées.

## Self-review
- Pas de TBD. Cohérent : 25×19×32 = 800×608, enum 0-4, compteurs 3/5/7 repris, `getTile`/`isSolid` utilisés par room+physics, rebuild sur inter-vague existant. Scope v1 unique. Clavier-seul et 60 FPS explicites.
