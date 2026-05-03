# AGENTS.md - make-your-game

A vanilla JavaScript browser game using ES modules. No build system, no npm deps,
runs via a local server.

---

## Commands

### Running the Game

ES modules require a local server (opening `index.html` directly fails due to CORS):

```bash
npx serve .                    # Option 1: npx serve
python -m http.server 8000     # Option 2: Python
# Or use VS Code Live Server extension
```

### Build/Lint/Test

**No build commands** - vanilla JS with no build system.

**No lint** - no ESLint or code analysis tools.

**No tests** - no test framework exists. If needed:
```bash
npm init -y && npm install --save-dev vitest
npx vitest run path/to/test.spec.js
```

---

## Code Style

### General
- Keep code simple and readable
- No external dependencies unless necessary
- Use ES modules (`import`/`export`)
- Follow existing codebase patterns

### Naming
- **Classes**: PascalCase (`Player`, `MyGame`)
- **Functions/variables**: camelCase (`isKeyPressed`)
- **File names**: PascalCase for classes (`Player.js`), camelCase for utilities
- **CSS classes**: kebab-case (`.left-eye`, `.right-eye`)

### Formatting
- **Indentation**: 2 spaces
- **Semicolons**: Optional - be consistent within files
- **Line length**: Keep under 100 chars when reasonable
- Use single blank lines between logical sections

### Types
This project uses **JSDoc** (not TypeScript):

```javascript
/** @param {Player} player - The player object */
/** @param {number} deltaTime - Time since last frame in seconds */
export const update = (player, deltaTime) => { };
```

### Functions
- Arrow functions for callbacks/short utilities
- Function declarations for main game logic
- Keep functions small, single responsibility
- Use early returns

```javascript
export const isKeyPressed = (key) => keys[key];
export function update(player, deltaTime) { /* ... */ }
```

### Classes
- `constructor()` for initialization
- `init()` method for DOM element creation
- Store DOM elements with `$` prefix (`this.$element`)

```javascript
export class Player {
  constructor() {
    this.x = 100;
    this.speed = 300;
    this.init();
  }
  init() {
    this.$element = document.createElement("div");
    this.$element.id = "player";
  }
}
```

### Error Handling
- Use `try/catch` for async operations
- Log errors with descriptive messages

```javascript
try { loadLevel(id); }
catch (error) { console.error(`Failed to load ${id}:`, error); }
```

### DOM
- Use `document.createElement()`
- Store element references
- Use `classList.add()`/`remove()` for toggling
- Avoid direct style manipulation when possible

### CSS
- CSS custom properties for colors/sizes
- BEM-ish naming (`player__element`, `player--active`)
- `box-sizing: border-box` reset
- `position: relative` on game entities

```css
:root { --bg: rgb(0, 0, 0); --color: rgb(251, 251, 251); }
#player { position: relative; }
.left-eye { }
```

---

## Project Structure

```
make-your-game/
├── main.js       # Entry point, game loop
├── Player.js     # Player class with DOM element
├── MyGame.js     # Game state constants
├── controls.js   # Keyboard input handling
├── collision.js  # Collision detection
├── render.js     # Rendering logic
├── update.js     # Game state updates
├── index.html    # HTML entry point
├── style.css     # Styles
└── AGENTS.md     # This file
```

---

## Common Tasks

### Add New Game Entity
1. Create new file (e.g., `Enemy.js`)
2. Export class with `constructor()` + `init()`
3. Add to game loop in `main.js` or `update.js`

### Add New Controls
1. Edit `controls.js` - add key handler
2. Use in `update.js`

### Modify Player
1. Edit `Player.js` for DOM structure
2. Edit `style.css` for styling