# Gungeon-like Arena (Option A) — Design Spec

Date: 2026-09-19
Status: approved
Scope: v1 nouveau projet séparé `gungeon/`, pilier combat + roulade. Donjon multi-salles, armes variées, boss → v2/v3 hors scope.

## 1. Goal
Top-down arena shooter clavier-seul inspiré Enter the Gungeon : 1 salle, 3 vagues, dodge roll à i-frames. 60+ FPS à 60Hz et 165Hz. Plain JS/DOM/HTML, sans frameworks ni canvas.

## 2. Architecture
- Nouveau dossier `gungeon/` indépendant (patterns repris du moteur actuel, zéro dépendance).
- `index.html` — arène 800x600, HUD, overlays menu/pause/gameover/win.
- `style.css` — 3 couches : `#game-layer`, `#hud-layer`, `#overlay-layer`.
- `js/input.js` — Set clavier + actions move/aim/roulade/pause/confirm.
- `js/entities.js` — pools : joueur x1, ennemis max 10, balles joueur 40, balles ennemies 100.
- `js/physics.js` — pas fixe 120Hz (STEP=1/120), AABB murs + entités, dt en secondes.
- `js/room.js` — 1 salle rectangulaire + 2 obstacles rectangulaires + spawner de vagues (3/5/7).
- `js/main.js` — boucle rAF + machine d'états + compteur FPS.
- `js/ui.js` — HUD throttlé + overlays.
- Mouvements uniquement `transform: translate3d` + `opacity`. Zéro lecture layout en boucle. Bornes cachées.

## 3. Combat & roulade
- Joueur : vitesse 260 px/s 8-dir, hitbox 10px (sprite 24px), 3 cœurs, 1 dégât par touche.
- Roulade (Shift) : dash 520 px/s pendant 0.35s, i-frames incluses, traverse les balles mais pas les murs, cooldown 0.9s + barre HUD.
- Tir (Espace hold) : 6/s, vitesse 550 px/s, direction = flèches de visée sinon dernière direction de déplacement.
- Ennemis : blob (contact, 70 px/s), tireur (garde distance ~250px, tir visé 140 px/s toutes les 1.6s), tourelle (fixe, spiral léger 3 branches toutes les 2.2s).
- Vagues 3/5/7, victoire après vague 3 nettoyée. Score : +100 kill, +10/s survie. Timer : temps écoulé affiché (pas de countdown).

## 4. Contrôles, états, UI
- Bouger : ZQSD/WASD. Viser : Flèches. Tirer : Espace (hold). Roulade : Shift. Pause : P/Esc. Confirmer : Entrée.
- États `menu / playing / paused / gameover / win`. Pause : rAF continue, update gelé (zéro drop). Boutons : Start, Continue, Restart (+ mêmes touches).
- HUD : cœurs, vague (1/2/3), score, temps, FPS, barre cooldown roulade. Menus avec aide contrôles.
- Blur / visibilitychange → auto-pause. Resize : arène fixe 800x600, pas de handler (centrée).

## 5. Performance (60 FPS + 165Hz-safe)
- Pas fixe découplé du rAF : même vitesse à 60/120/165Hz. `dt = min(raw, 33ms)`, accumulateur 120Hz, max 5 steps/frame.
- Pools pré-allouées, `display` gardé, HUD texte à 4Hz, FPS à 2Hz, `will-change: transform` sur balles actives.
- Compteur FPS : moyenne glissante + pire frame sur 1s. Cible : moyenne >= 60 (lit ~165 sur 165Hz), zéro long-task > 8ms.
- Vérification : profile DevTools Performance 30s + paint flashing, test 60Hz et 165Hz, pause/resume sans gap.

## 6. Data flow
input Set → physics step (move, roulade, murs, balles, collisions) → room spawner → pools update transforms → ui throttlé → rAF.

## 7. Hors scope (v2+)
Multi-salles procédurales, coffres, 3-4 armes, boss bullet-hell, souris, sons, particules.

## Self-review
- Pas de TBD. Cohérent : vitesses px/s, STEP 1/120, pools 1/10/40/100, 3 cœurs, roulade 0.35s/0.9s, vagues 3/5/7. Scope v1 unique, pas de contradiction. Clavier-seul explicite (audit-safe).
