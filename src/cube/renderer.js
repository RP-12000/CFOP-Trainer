import * as THREE from 'three';

export const FACE_COLORS = {
  W: 0xffffff,
  R: 0xcc2200,
  B: 0x0044cc,
  O: 0xff6600,
  G: 0x00aa44,
  Y: 0xffcc00,
  X: 0x888888,
};

export const SOLVED_STATE = {
  U: 'WWWWWWWWW',
  D: 'YYYYYYYYY',
  F: 'RRRRRRRRR',
  B: 'OOOOOOOOO',
  L: 'BBBBBBBBB',
  R: 'GGGGGGGGG',
};

// ---------------------------------------------------------------------------
// CubeState — pure data model tracking all 54 stickers
// Supports U D F B L R moves (and primes, doubles)
// ---------------------------------------------------------------------------
export class CubeState {
  constructor(state) {
    // Each face: 9-char string index 0-8, row-major, looking at face head-on
    const s = state || SOLVED_STATE;
    this.U = s.U.split('');
    this.D = s.D.split('');
    this.F = s.F.split('');
    this.B = s.B.split('');
    this.L = s.L.split('');
    this.R = s.R.split('');
  }

  clone() {
    const c = new CubeState();
    for (const f of ['U','D','F','B','L','R']) c[f] = [...this[f]];
    return c;
  }

  // Rotate a face array 90deg clockwise (looking at it head-on)
  _rotateFaceCW(f) {
    const o = [...f];
    f[0]=o[6]; f[1]=o[3]; f[2]=o[0];
    f[3]=o[7]; f[4]=o[4]; f[5]=o[1];
    f[6]=o[8]; f[7]=o[5]; f[8]=o[2];
  }
  _rotateFaceCCW(f) { this._rotateFaceCW(f); this._rotateFaceCW(f); this._rotateFaceCW(f); }
  _rotateFace180(f) { this._rotateFaceCW(f); this._rotateFaceCW(f); }

  applyMove(move) {
    switch(move) {
      // Single-layer
      case 'U':  this._U(1);  break;
      case "U'": this._U(-1); break;
      case 'U2': this._U(2);  break;
      case "U2'": this._U(2); break;
      case 'D':  this._D(1);  break;
      case "D'": this._D(-1); break;
      case 'D2': this._D(2);  break;
      case "D2'": this._D(2); break;
      case 'F':  this._F(1);  break;
      case "F'": this._F(-1); break;
      case 'F2': this._F(2);  break;
      case "F2'": this._F(2); break;
      case 'B':  this._B(1);  break;
      case "B'": this._B(-1); break;
      case 'B2': this._B(2);  break;
      case "B2'": this._B(2); break;
      case 'L':  this._L(1);  break;
      case "L'": this._L(-1); break;
      case 'L2': this._L(2);  break;
      case "L2'": this._L(2); break;
      case 'R':  this._R(1);  break;
      case "R'": this._R(-1); break;
      case 'R2': this._R(2);  break;
      case "R2'": this._R(2); break;
      // Wide moves (two layers)
      case 'u':  this._U(1);  this._E(-1); break;
      case "u'": this._U(-1); this._E(1);  break;
      case 'u2': this._U(2);  this._E(2);  break;
      case "u2'": this._U(2); this._E(2);  break;
      case 'd':  this._D(1);  this._E(1);  break;
      case "d'": this._D(-1); this._E(-1); break;
      case 'd2': this._D(2);  this._E(2);  break;
      case "d2'": this._D(2); this._E(2);  break;
      case 'f':  this._F(1);  this._S(1);  break;
      case "f'": this._F(-1); this._S(-1); break;
      case 'f2': this._F(2);  this._S(2);  break;
      case "f2'": this._F(2); this._S(2);  break;
      case 'b':  this._B(1);  this._S(-1); break;
      case "b'": this._B(-1); this._S(1);  break;
      case 'b2': this._B(2);  this._S(2);  break;
      case "b2'": this._B(2); this._S(2);  break;
      case 'l':  this._L(1);  this._M(1);  break;
      case "l'": this._L(-1); this._M(-1); break;
      case 'l2': this._L(2);  this._M(2);  break;
      case "l2'": this._L(2); this._M(2);  break;
      case 'r':  this._R(1);  this._M(-1); break;
      case "r'": this._R(-1); this._M(1);  break;
      case 'r2': this._R(2);  this._M(2);  break;
      case "r2'": this._R(2); this._M(2);  break;
      // Slice moves
      case 'M':  this._M(1);  break;
      case "M'": this._M(-1); break;
      case 'M2': this._M(2);  break;
      case "M2'": this._M(2); break;
      case 'E':  this._E(1);  break;
      case "E'": this._E(-1); break;
      case 'E2': this._E(2);  break;
      case "E2'": this._E(2); break;
      case 'S':  this._S(1);  break;
      case "S'": this._S(-1); break;
      case 'S2': this._S(2);  break;
      case "S2'": this._S(2); break;
      // Whole-cube rotations
      case 'x':  this._x(1);  break;
      case "x'": this._x(-1); break;
      case 'x2': this._x(2);  break;
      case "x2'": this._x(2); break;
      case 'y':  this._y(1);  break;
      case "y'": this._y(-1); break;
      case 'y2': this._y(2);  break;
      case "y2'": this._y(2); break;
      case 'z':  this._z(1);  break;
      case "z'": this._z(-1); break;
      case 'z2': this._z(2);  break;
      case "z2'": this._z(2); break;
      default: break;
    }
  }

  _U(n) {
    const times = ((n % 4) + 4) % 4;
    for (let t = 0; t < times; t++) {
      this._rotateFaceCW(this.U);
      // U CW (from top): F-top -> R-top -> B-top -> L-top -> F-top
      const tmp = [this.F[0],this.F[1],this.F[2]];
      [this.F[0],this.F[1],this.F[2]] = [this.R[0],this.R[1],this.R[2]];
      [this.R[0],this.R[1],this.R[2]] = [this.B[0],this.B[1],this.B[2]];
      [this.B[0],this.B[1],this.B[2]] = [this.L[0],this.L[1],this.L[2]];
      [this.L[0],this.L[1],this.L[2]] = tmp;
    }
  }
  _D(n) {
    const times = ((n % 4) + 4) % 4;
    for (let t = 0; t < times; t++) {
      this._rotateFaceCW(this.D);
      // D CW (from bottom): F-bot -> L-bot -> B-bot -> R-bot -> F-bot
      const tmp = [this.F[6],this.F[7],this.F[8]];
      [this.F[6],this.F[7],this.F[8]] = [this.L[6],this.L[7],this.L[8]];
      [this.L[6],this.L[7],this.L[8]] = [this.B[6],this.B[7],this.B[8]];
      [this.B[6],this.B[7],this.B[8]] = [this.R[6],this.R[7],this.R[8]];
      [this.R[6],this.R[7],this.R[8]] = tmp;
    }
  }
  _F(n) {
    const times = ((n % 4) + 4) % 4;
    for (let t = 0; t < times; t++) {
      this._rotateFaceCW(this.F);
      // F CW: U-bot -> R-left -> D-top -> L-right -> U-bot
      const tmp = [this.U[6],this.U[7],this.U[8]];
      [this.U[6],this.U[7],this.U[8]] = [this.L[8],this.L[5],this.L[2]];
      [this.L[8],this.L[5],this.L[2]] = [this.D[2],this.D[1],this.D[0]];
      [this.D[2],this.D[1],this.D[0]] = [this.R[0],this.R[3],this.R[6]];
      [this.R[0],this.R[3],this.R[6]] = tmp;
    }
  }
  _B(n) {
    const times = ((n % 4) + 4) % 4;
    for (let t = 0; t < times; t++) {
      this._rotateFaceCW(this.B);
      // B CW (looking at back face): U-top -> L-left -> D-bot -> R-right -> U-top
      const tmp = [this.U[0],this.U[1],this.U[2]];
      [this.U[0],this.U[1],this.U[2]] = [this.R[2],this.R[5],this.R[8]];
      [this.R[2],this.R[5],this.R[8]] = [this.D[8],this.D[7],this.D[6]];
      [this.D[8],this.D[7],this.D[6]] = [this.L[6],this.L[3],this.L[0]];
      [this.L[6],this.L[3],this.L[0]] = tmp;
    }
  }
  _L(n) {
    const times = ((n % 4) + 4) % 4;
    for (let t = 0; t < times; t++) {
      this._rotateFaceCW(this.L);
      // L CW (looking at left face): U-left -> F-left -> D-left -> B-right -> U-left
      const tmp = [this.U[0],this.U[3],this.U[6]];
      [this.U[0],this.U[3],this.U[6]] = [this.B[8],this.B[5],this.B[2]];
      [this.B[8],this.B[5],this.B[2]] = [this.D[0],this.D[3],this.D[6]];
      [this.D[0],this.D[3],this.D[6]] = [this.F[0],this.F[3],this.F[6]];
      [this.F[0],this.F[3],this.F[6]] = tmp;
    }
  }
  _R(n) {
    const times = ((n % 4) + 4) % 4;
    for (let t = 0; t < times; t++) {
      this._rotateFaceCW(this.R);
      // R CW (looking at right face): U-right -> B-left -> D-right -> F-right -> U-right
      const tmp = [this.U[2],this.U[5],this.U[8]];
      [this.U[2],this.U[5],this.U[8]] = [this.F[2],this.F[5],this.F[8]];
      [this.F[2],this.F[5],this.F[8]] = [this.D[2],this.D[5],this.D[8]];
      [this.D[2],this.D[5],this.D[8]] = [this.B[6],this.B[3],this.B[0]];
      [this.B[6],this.B[3],this.B[0]] = tmp;
    }
  }

  // M slice: middle layer between L and R, same direction as L
  _M(n) {
    const times = ((n % 4) + 4) % 4;
    for (let t = 0; t < times; t++) {
      // M CW (like L): U-mid -> F-mid -> D-mid -> B-mid(reversed) -> U-mid
      const tmp = [this.U[1],this.U[4],this.U[7]];
      [this.U[1],this.U[4],this.U[7]] = [this.B[7],this.B[4],this.B[1]];
      [this.B[7],this.B[4],this.B[1]] = [this.D[1],this.D[4],this.D[7]];
      [this.D[1],this.D[4],this.D[7]] = [this.F[1],this.F[4],this.F[7]];
      [this.F[1],this.F[4],this.F[7]] = tmp;
    }
  }

  // E slice: middle layer between U and D, same direction as D
  _E(n) {
    const times = ((n % 4) + 4) % 4;
    for (let t = 0; t < times; t++) {
      // E CW (from bottom): F-mid -> R-mid -> B-mid -> L-mid -> F-mid
      const tmp = [this.F[3],this.F[4],this.F[5]];
      [this.F[3],this.F[4],this.F[5]] = [this.L[3],this.L[4],this.L[5]];
      [this.L[3],this.L[4],this.L[5]] = [this.B[3],this.B[4],this.B[5]];
      [this.B[3],this.B[4],this.B[5]] = [this.R[3],this.R[4],this.R[5]];
      [this.R[3],this.R[4],this.R[5]] = tmp;
    }
  }

  // S slice: middle layer between F and B, same direction as F
  _S(n) {
    const times = ((n % 4) + 4) % 4;
    for (let t = 0; t < times; t++) {
      // S CW (like F): U-mid -> R-mid -> D-mid -> L-mid -> U-mid
      const tmp = [this.U[3],this.U[4],this.U[5]];
      [this.U[3],this.U[4],this.U[5]] = [this.L[7],this.L[4],this.L[1]];
      [this.L[7],this.L[4],this.L[1]] = [this.D[5],this.D[4],this.D[3]];
      [this.D[5],this.D[4],this.D[3]] = [this.R[1],this.R[4],this.R[7]];
      [this.R[1],this.R[4],this.R[7]] = tmp;
    }
  }

  // x rotation: whole cube like R (R + M' + L')
  _x(n) {
    const times = ((n % 4) + 4) % 4;
    for (let t = 0; t < times; t++) {
      this._R(1); this._M(-1); this._L(-1);
    }
  }

  // y rotation: whole cube like U (U + E' + D')
  _y(n) {
    const times = ((n % 4) + 4) % 4;
    for (let t = 0; t < times; t++) {
      this._U(1); this._E(-1); this._D(-1);
    }
  }

  // z rotation: whole cube like F (F + S + B')
  _z(n) {
    const times = ((n % 4) + 4) % 4;
    for (let t = 0; t < times; t++) {
      this._F(1); this._S(1); this._B(-1);
    }
  }

  toFaceStrings() {
    const r = {};
    for (const f of ['U','D','F','B','L','R']) r[f] = this[f].join('');
    return r;
  }
}

// ---------------------------------------------------------------------------
// CubeRenderer — Three.js 3D cube with drag-orbit + layer turn buttons
// ---------------------------------------------------------------------------
export class CubeRenderer {
  constructor(container, size = 400, state = null) {
    this.container = container;
    this.size = size;
    this.cubeState = new CubeState(state);

    this._drag = { active: false, lastX: 0, lastY: 0, velX: 0, velY: 0 };
    this._layerAnim = null; // active layer animation

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    this.camera.position.set(4, 4, 6);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(size, size);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.domElement.style.cursor = 'grab';
    container.appendChild(this.renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.75);
    this.scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 10, 7);
    this.scene.add(dir);

    // Pivot group — all cubies live here so we can rotate the whole cube
    this.pivot = new THREE.Group();
    this.scene.add(this.pivot);

    this.cubies = []; // { mesh, gx, gy, gz }
    this._buildCube();
    this._bindDrag();
    this._animate();
  }

  // ── Sticker color lookup ─────────────────────────────────────────────────
  // Face index (Three.js BoxGeometry): 0=+x(R), 1=-x(L), 2=+y(U), 3=-y(D), 4=+z(F), 5=-z(B)
  // Grid coords: gx/gy/gz each in {-1, 0, 1}
  // Face sticker layout (looking at face head-on, row 0 = top, col 0 = left):
  //   U (looking down):  row = gz+1 (back=0,front=2), col = gx+1
  //   D (looking up):    row = 1-gz (front=0,back=2), col = gx+1
  //   F (looking in):    row = 1-gy (top=0,bot=2),    col = gx+1
  //   B (looking in):    row = 1-gy,                  col = 1-gx
  //   R (looking left):  row = 1-gy,                  col = 1-gz
  //   L (looking right): row = 1-gy,                  col = gz+1
  _stickerColor(gx, gy, gz, faceIdx) {
    const s = this.cubeState.toFaceStrings();
    const idx = (r, c) => r * 3 + c;
    switch (faceIdx) {
      case 0: // +x = R face
        if (gx !== 1)  return FACE_COLORS.X;
        return FACE_COLORS[s.R[idx(1 - gy, 1 - gz)] ] || FACE_COLORS.X;
      case 1: // -x = L face
        if (gx !== -1) return FACE_COLORS.X;
        return FACE_COLORS[s.L[idx(1 - gy, gz + 1)] ] || FACE_COLORS.X;
      case 2: // +y = U face
        if (gy !== 1)  return FACE_COLORS.X;
        return FACE_COLORS[s.U[idx(gz + 1, gx + 1)] ] || FACE_COLORS.X;
      case 3: // -y = D face
        if (gy !== -1) return FACE_COLORS.X;
        return FACE_COLORS[s.D[idx(1 - gz, gx + 1)] ] || FACE_COLORS.X;
      case 4: // +z = F face
        if (gz !== 1)  return FACE_COLORS.X;
        return FACE_COLORS[s.F[idx(1 - gy, gx + 1)] ] || FACE_COLORS.X;
      case 5: // -z = B face
        if (gz !== -1) return FACE_COLORS.X;
        return FACE_COLORS[s.B[idx(1 - gy, 1 - gx)] ] || FACE_COLORS.X;
      default: return FACE_COLORS.X;
    }
  }

  _buildCube() {
    this.cubies.forEach(c => this.pivot.remove(c.mesh));
    this.cubies = [];
    // Remove old labels
    if (this._labels) this._labels.forEach(l => this.pivot.remove(l));
    this._labels = [];

    const gap = 1.05;
    for (let gx = -1; gx <= 1; gx++) {
      for (let gy = -1; gy <= 1; gy++) {
        for (let gz = -1; gz <= 1; gz++) {
          const geo = new THREE.BoxGeometry(0.95, 0.95, 0.95);
          const mats = Array.from({length:6}, (_,fi) =>
            new THREE.MeshLambertMaterial({ color: this._stickerColor(gx,gy,gz,fi) })
          );
          const mesh = new THREE.Mesh(geo, mats);
          mesh.position.set(gx*gap, gy*gap, gz*gap);
          this.pivot.add(mesh);
          this.cubies.push({ mesh, gx, gy, gz });
        }
      }
    }

    // Face labels — canvas sprites floating just outside each face
    const labelDefs = [
      { text:'U', pos:[0,  2.8, 0],   rot:[0,0,0]                    },
      { text:'D', pos:[0, -2.8, 0],   rot:[Math.PI,0,0]              },
      { text:'F', pos:[0,  0,  2.8],  rot:[0,0,0]                    },
      { text:'B', pos:[0,  0, -2.8],  rot:[0,Math.PI,0]              },
      { text:'L', pos:[-2.8, 0, 0],   rot:[0,-Math.PI/2,0]           },
      { text:'R', pos:[ 2.8, 0, 0],   rot:[0, Math.PI/2,0]           },
    ];
    labelDefs.forEach(({ text, pos, rot }) => {
      const sprite = this._makeLabel(text);
      sprite.position.set(...pos);
      sprite.rotation.set(...rot);
      this.pivot.add(sprite);
      this._labels.push(sprite);
    });
  }

  _makeLabel(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 128, 128);
    ctx.font = 'bold 80px monospace';
    const isLight = document.documentElement.classList.contains('light-mode');
    ctx.fillStyle = isLight ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.85)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 64, 64);
    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(0.9, 0.9, 1);
    return sprite;
  }

  // ── Layer turn ───────────────────────────────────────────────────────────
  doMove(move, onDone) {
    if (this._layerAnim) return;

    const base = move.replace("2'","").replace("'","").replace("2","");
    const prime = move.endsWith("'") && !move.endsWith("2'");
    const doublePrime = move.endsWith("2'");
    const double = move.endsWith("2") && !doublePrime;

    // For wide moves and rotations we animate the pivot itself or multiple layers
    // MOVE_DEF: axis, layers to animate (array of grid coord values), direction
    const MOVE_DEF = {
      // Single layer
      U:  { axis:'y', layers:[1],       dir:-1  },
      D:  { axis:'y', layers:[-1],      dir: 1  },
      F:  { axis:'z', layers:[1],       dir:-1  },
      B:  { axis:'z', layers:[-1],      dir: 1  },
      R:  { axis:'x', layers:[1],       dir:-1  },
      L:  { axis:'x', layers:[-1],      dir: 1  },
      // Wide (two layers)
      u:  { axis:'y', layers:[1,0],     dir:-1  },
      d:  { axis:'y', layers:[-1,0],    dir: 1  },
      f:  { axis:'z', layers:[1,0],     dir:-1  },
      b:  { axis:'z', layers:[-1,0],    dir: 1  },
      r:  { axis:'x', layers:[1,0],     dir:-1  },
      l:  { axis:'x', layers:[-1,0],    dir: 1  },
      // Slices
      M:  { axis:'x', layers:[0],       dir: 1  },
      E:  { axis:'y', layers:[0],       dir: 1  },
      S:  { axis:'z', layers:[0],       dir:-1  },
      // Whole-cube rotations — animate all layers
      x:  { axis:'x', layers:[-1,0,1],  dir:-1  },
      y:  { axis:'y', layers:[-1,0,1],  dir:-1  },
      z:  { axis:'z', layers:[-1,0,1],  dir:-1  },
    };

    const def = MOVE_DEF[base];
    if (!def) { if (onDone) onDone(); return; }

    const totalAngle = (Math.PI / 2) * (double || doublePrime ? 2 : 1) * (prime || doublePrime ? -1 : 1) * def.dir;
    const duration = (double || doublePrime) ? 400 : 220;

    const axisKey = def.axis === 'x' ? 'gx' : def.axis === 'y' ? 'gy' : 'gz';
    const layerCubies = this.cubies.filter(c => def.layers.includes(c[axisKey]));

    const group = new THREE.Group();
    this.pivot.add(group);
    layerCubies.forEach(c => { this.pivot.remove(c.mesh); group.add(c.mesh); });

    const start = performance.now();
    this._layerAnim = { group, layerCubies, def, totalAngle, duration, start, move, onDone };
  }

  _finishLayerAnim() {
    const { group, layerCubies, def, totalAngle, move, onDone } = this._layerAnim;

    // Remove the temp group and put cubies back (positions don't matter,
    // we're about to rebuild everything from the state model)
    layerCubies.forEach(c => {
      group.remove(c.mesh);
      this.pivot.add(c.mesh);
    });
    this.pivot.remove(group);

    // Update the logical state model
    this.cubeState.applyMove(move);

    // Rebuild all 27 cubies cleanly from the updated state — this avoids
    // any floating-point matrix accumulation that causes black stickers
    this._buildCube();

    this._layerAnim = null;
    if (onDone) onDone();
  }

  _rebuildColors() {
    this.cubies.forEach(({ mesh, gx, gy, gz }) => {
      for (let fi = 0; fi < 6; fi++) {
        mesh.material[fi].color.setHex(this._stickerColor(gx, gy, gz, fi));
      }
    });
  }

  setState(state) {
    this.cubeState = new CubeState(state);
    this._buildCube();
  }

  resetCube(originalState) {
    this._layerAnim = null;
    this.cubeState = new CubeState(originalState || null);
    this._buildCube();
  }

  // ── Drag to orbit ────────────────────────────────────────────────────────
  _bindDrag() {
    const el = this.renderer.domElement;
    const d = this._drag;

    const onDown = (x, y) => { d.active=true; d.lastX=x; d.lastY=y; d.velX=0; d.velY=0; el.style.cursor='grabbing'; };
    const onMove = (x, y) => {
      if (!d.active) return;
      const dx = x-d.lastX, dy = y-d.lastY;
      d.velX=dx; d.velY=dy;
      this.pivot.rotation.y += dx*0.012;
      this.pivot.rotation.x += dy*0.012;
      this.pivot.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.pivot.rotation.x));
      d.lastX=x; d.lastY=y;
    };
    const onUp = () => { d.active=false; el.style.cursor='grab'; };

    el.addEventListener('mousedown',  e => { e.preventDefault(); onDown(e.clientX, e.clientY); });
    window.addEventListener('mousemove', e => onMove(e.clientX, e.clientY));
    window.addEventListener('mouseup',   () => onUp());
    el.addEventListener('touchstart', e => { e.preventDefault(); onDown(e.touches[0].clientX, e.touches[0].clientY); }, {passive:false});
    el.addEventListener('touchmove',  e => { e.preventDefault(); onMove(e.touches[0].clientX, e.touches[0].clientY); }, {passive:false});
    el.addEventListener('touchend',   () => onUp());
  }

  // ── Render loop ──────────────────────────────────────────────────────────
  _animate() {
    this._rafId = requestAnimationFrame(() => this._animate());
    const d = this._drag;

    if (this._layerAnim) {
      const { group, def, totalAngle, duration, start } = this._layerAnim;
      const t = Math.min((performance.now() - start) / duration, 1);
      const ease = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
      group.rotation[def.axis] = totalAngle * ease;
      if (t >= 1) this._finishLayerAnim();
    }

    // Inertia only — no idle spin
    if (!d.active) {
      d.velX *= 0.88; d.velY *= 0.88;
      this.pivot.rotation.y += d.velX * 0.012;
      this.pivot.rotation.x += d.velY * 0.012;
      this.pivot.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.pivot.rotation.x));
    }

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    cancelAnimationFrame(this._rafId);
    this.renderer.dispose();
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}

// ---------------------------------------------------------------------------
// renderFacePreview — dispatches to the right 2D SVG preview based on section
// ---------------------------------------------------------------------------
export function renderFacePreview(state, faceKey = 'U', cellSize = 14, arrows = null) {
  // faceKey is repurposed as section hint: 'F2L', 'OLL', 'PLL', or a face letter
  if (faceKey === 'F2L') return renderF2LPreview(state, cellSize);
  if (faceKey === 'OLL' || faceKey === 'PLL') return renderOLLPLLPreview(state, cellSize, arrows);
  // Legacy: plain face grid
  const s = (state || SOLVED_STATE)[faceKey] || 'XXXXXXXXX';
  const size = cellSize * 3 + 4;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  for (let i = 0; i < 9; i++) {
    const r = Math.floor(i/3), c = i%3;
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', c*cellSize+2);
    rect.setAttribute('y', r*cellSize+2);
    rect.setAttribute('width', cellSize-1);
    rect.setAttribute('height', cellSize-1);
    rect.setAttribute('rx', '2');
    rect.setAttribute('fill', '#'+(FACE_COLORS[s[i]]||FACE_COLORS.X).toString(16).padStart(6,'0'));
    svg.appendChild(rect);
  }
  return svg;
}

// ---------------------------------------------------------------------------
// renderF2LPreview — isometric 3D SVG: U top, F front-left, R front-right
// Standard isometric view from front-right-top corner.
// ---------------------------------------------------------------------------
function renderF2LPreview(state, cellSize = 14) {
  const st = state || SOLVED_STATE;
  const U = st.U || 'XXXXXXXXX';
  const F = st.F || 'XXXXXXXXX';
  const R = st.R || 'XXXXXXXXX';

  const cs = cellSize;
  // Isometric 2D basis vectors for the three visible axes:
  //   right (+X): goes right and slightly down
  //   depth (+Z): goes left and slightly down  (into screen = back)
  //   down  (+Y): goes straight down
  const rx = cs * 0.866, ry = cs * 0.5;   // right axis
  const dx = -cs * 0.866, dy = cs * 0.5;  // depth axis (left+down)
  const vy = cs;                            // vertical axis (down only)

  // SVG canvas: wide enough for 3 cols right + 3 cols depth, tall enough for top + 3 rows down
  const svgW = Math.ceil((3 * rx - 3 * dx) + cs);
  const svgH = Math.ceil(3 * dy + 3 * dy + 3 * vy + cs * 0.5);

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', svgW);
  svg.setAttribute('height', svgH);
  svg.setAttribute('viewBox', `0 0 ${svgW} ${svgH}`);

  const toHex = (ch) => '#' + (FACE_COLORS[ch] || FACE_COLORS.X).toString(16).padStart(6, '0');

  // Origin: top-left corner of the top face (back-left corner of U)
  // Place it so the whole cube fits: x offset = 3*|dx|, y offset = small pad
  const ox = Math.ceil(3 * (-dx)) + 2;
  const oy = 4;

  function poly(points, fill, stroke = '#111', sw = 1.2) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    el.setAttribute('points', points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' '));
    el.setAttribute('fill', fill);
    el.setAttribute('stroke', stroke);
    el.setAttribute('stroke-width', sw);
    svg.appendChild(el);
  }

  // Convert grid coords to SVG coords
  // col = right axis (0=left, 2=right), row = depth axis (0=back, 2=front)
  function topPt(col, row) {
    return [ox + col * rx + row * dx, oy + col * ry + row * dy];
  }
  // For front face (F): col = left-right, vrow = vertical row (0=top, 2=bottom)
  // Front face starts at depth row=3 (front edge of U)
  function frontPt(col, vrow) {
    const [bx, by] = topPt(col, 3);
    return [bx, by + vrow * vy];
  }
  // For right face (R): depth = depth axis, vrow = vertical row
  // Right face starts at col=3 (right edge of U)
  function rightPt(depth, vrow) {
    const [bx, by] = topPt(3, depth);
    return [bx, by + vrow * vy];
  }

  // Draw U face (top) — draw back rows first so front rows overlap correctly
  // U face: index = row*3+col, row 0=back(depth=0), row 2=front(depth=2), col 0=left, col 2=right
  for (let row = 2; row >= 0; row--) {
    for (let ci = 0; ci < 3; ci++) {
      const idx = row * 3 + ci;
      const [x0, y0] = topPt(ci,     row);
      const [x1, y1] = topPt(ci + 1, row);
      const [x2, y2] = topPt(ci + 1, row + 1);
      const [x3, y3] = topPt(ci,     row + 1);
      poly([[x0,y0],[x1,y1],[x2,y2],[x3,y3]], toHex(U[idx]));
    }
  }

  // Draw F face (front-left) — bottom-left face
  // F face: index = vrow*3+ci, vrow 0=top, ci 0=left, ci 2=right
  for (let vrow = 0; vrow < 3; vrow++) {
    for (let ci = 0; ci < 3; ci++) {
      const idx = vrow * 3 + ci;
      const [x0, y0] = frontPt(ci,     vrow);
      const [x1, y1] = frontPt(ci + 1, vrow);
      const [x2, y2] = frontPt(ci + 1, vrow + 1);
      const [x3, y3] = frontPt(ci,     vrow + 1);
      poly([[x0,y0],[x1,y1],[x2,y2],[x3,y3]], toHex(F[idx]), '#0a0a0a');
    }
  }

  // Draw R face (front-right) — bottom-right face
  // R face: index = vrow*3+ci, vrow 0=top, ci 0=front(depth=0), ci 2=back(depth=2)
  // Looking at R face head-on: col 0=front, col 2=back → depth goes 0..2
  for (let vrow = 0; vrow < 3; vrow++) {
    for (let di = 0; di < 3; di++) {
      // R face sticker layout (looking at R head-on): row=vrow, col=1-gz → front=col0
      const idx = vrow * 3 + (2 - di);
      const [x0, y0] = rightPt(di,     vrow);
      const [x1, y1] = rightPt(di + 1, vrow);
      const [x2, y2] = rightPt(di + 1, vrow + 1);
      const [x3, y3] = rightPt(di,     vrow + 1);
      poly([[x0,y0],[x1,y1],[x2,y2],[x3,y3]], toHex(R[idx]), '#0a0a0a');
    }
  }

  return svg;
}

// ---------------------------------------------------------------------------
// renderOLLPLLPreview — top-down U face + trapezoid side strips
// Layout (counterclockwise from bottom): F bottom, R right, B top, L left.
// F[0..2] = bottom strip left→right, R[0..2] = right strip top→bottom,
// B[0..2] = top strip right→left, L[0..2] = left strip bottom→top.
// arrows: optional array of {from,to} objects from PLL_arrows
// ---------------------------------------------------------------------------
function renderOLLPLLPreview(state, cellSize = 14, arrows = null) {
  const st = state || SOLVED_STATE;
  const U = st.U || 'XXXXXXXXX';
  const Ftop = (st.F || 'XXXXXXXXX').slice(0, 3);
  const Rtop = (st.R || 'XXXXXXXXX').slice(0, 3);
  const Btop = (st.B || 'XXXXXXXXX').slice(0, 3);
  const Ltop = (st.L || 'XXXXXXXXX').slice(0, 3);

  const cs = cellSize;
  const trap = Math.round(cs * 0.6);
  const pad = trap + 3;
  const faceW = cs * 3;
  const svgW = faceW + pad * 2 + 4;
  const svgH = faceW + pad * 2 + 4;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', svgW);
  svg.setAttribute('height', svgH);
  svg.setAttribute('viewBox', `0 0 ${svgW} ${svgH}`);

  const toHex = (ch) => '#' + (FACE_COLORS[ch] || FACE_COLORS.X).toString(16).padStart(6, '0');

  // Face grid origin (top-left of U face)
  const fx = pad + 2;
  const fy = pad + 2;
  const fw = cs * 3;  // face width/height

  // Draw U face (center 3x3 grid)
  for (let i = 0; i < 9; i++) {
    const r = Math.floor(i / 3), c = i % 3;
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', fx + c * cs);
    rect.setAttribute('y', fy + r * cs);
    rect.setAttribute('width', cs - 1);
    rect.setAttribute('height', cs - 1);
    rect.setAttribute('rx', '2');
    rect.setAttribute('fill', toHex(U[i]));
    svg.appendChild(rect);
  }

  // inset: corner cells of trapezoid strips are inset to create the tapered look
  const inset = trap * 0.5;

  function trapPoly(pts, fill) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    el.setAttribute('points', pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' '));
    el.setAttribute('fill', fill);
    el.setAttribute('stroke', '#111');
    el.setAttribute('stroke-width', '1');
    svg.appendChild(el);
  }

  // Bottom strip — F face: F[0]=left, F[1]=center, F[2]=right
  // Inner edge = bottom of U face, outer edge = further down (tapered)
  for (let ci = 0; ci < 3; ci++) {
    const x0 = fx + ci * cs;
    const x1 = fx + (ci + 1) * cs - 1;
    const y_inner = fy + fw - 1;
    const y_outer = fy + fw - 1 + trap;
    const ox0 = x0 + (ci === 0 ? inset : 0);
    const ox1 = x1 - (ci === 2 ? inset : 0);
    trapPoly([[x0, y_inner], [x1, y_inner], [ox1, y_outer], [ox0, y_outer]], toHex(Ftop[ci]));
  }

  // Top strip — B face: B[0]=right, B[1]=center, B[2]=left (from front view, B is mirrored)
  // Inner edge = top of U face, outer edge = further up
  for (let ci = 0; ci < 3; ci++) {
    const x0 = fx + ci * cs;
    const x1 = fx + (ci + 1) * cs - 1;
    const y_inner = fy;
    const y_outer = fy - trap;
    const ox0 = x0 + (ci === 0 ? inset : 0);
    const ox1 = x1 - (ci === 2 ? inset : 0);
    // B[0]=right side, B[2]=left side → index = 2-ci
    trapPoly([[x0, y_inner], [x1, y_inner], [ox1, y_outer], [ox0, y_outer]], toHex(Btop[2 - ci]));
  }

  // Right strip — R face: R[0]=top, R[1]=center, R[2]=bottom
  // Inner edge = right of U face, outer edge = further right
  for (let ri = 0; ri < 3; ri++) {
    const y0 = fy + ri * cs;
    const y1 = fy + (ri + 1) * cs - 1;
    const x_inner = fx + fw - 1;
    const x_outer = fx + fw - 1 + trap;
    const oy0 = y0 + (ri === 0 ? inset : 0);
    const oy1 = y1 - (ri === 2 ? inset : 0);
    trapPoly([[x_inner, y0], [x_outer, oy0], [x_outer, oy1], [x_inner, y1]], toHex(Rtop[ri]));
  }

  // Left strip — L face: L[0]=top, L[1]=center, L[2]=bottom
  // Inner edge = left of U face, outer edge = further left
  for (let ri = 0; ri < 3; ri++) {
    const y0 = fy + ri * cs;
    const y1 = fy + (ri + 1) * cs - 1;
    const x_inner = fx;
    const x_outer = fx - trap;
    const oy0 = y0 + (ri === 0 ? inset : 0);
    const oy1 = y1 - (ri === 2 ? inset : 0);
    trapPoly([[x_inner, y0], [x_outer, oy0], [x_outer, oy1], [x_inner, y1]], toHex(Ltop[ri]));
  }

  // Draw arrows if provided
  if (arrows && arrows.length) {
    // Map a side+pos to SVG center coordinates on the trapezoid strip
    // pos: 0=left/top, 1=center, 2=right/bottom
    function sideCenter(side, pos) {
      const half = cs / 2;
      const trapMid = trap / 2;
      switch (side) {
        case 'F': return [fx + pos * cs + half, fy + fw - 1 + trapMid];
        case 'B': return [fx + (2 - pos) * cs + half, fy - trapMid];
        case 'R': return [fx + fw - 1 + trapMid, fy + pos * cs + half];
        case 'L': return [fx - trapMid, fy + pos * cs + half];
        default:  return [fx + fw / 2, fy + fw / 2];
      }
    }

    arrows.forEach(({ from, to }) => {
      const [x1, y1] = sideCenter(from.side, from.pos);
      const [x2, y2] = sideCenter(to.side, to.pos);

      // Arrow line
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1.toFixed(1));
      line.setAttribute('y1', y1.toFixed(1));
      line.setAttribute('x2', x2.toFixed(1));
      line.setAttribute('y2', y2.toFixed(1));
      line.setAttribute('stroke', 'rgba(180,180,180,0.9)');
      line.setAttribute('stroke-width', '1.5');
      line.setAttribute('marker-end', 'url(#arrowhead)');
      svg.appendChild(line);
    });

    // Define arrowhead marker (add once)
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('markerWidth', '6');
    marker.setAttribute('markerHeight', '6');
    marker.setAttribute('refX', '5');
    marker.setAttribute('refY', '3');
    marker.setAttribute('orient', 'auto');
    const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    arrowPath.setAttribute('d', 'M0,0 L0,6 L6,3 z');
    arrowPath.setAttribute('fill', 'rgba(180,180,180,0.9)');
    marker.appendChild(arrowPath);
    defs.appendChild(marker);
    svg.insertBefore(defs, svg.firstChild);
  }

  return svg;
}

// ---------------------------------------------------------------------------
// FloatingCubesBackground
// ---------------------------------------------------------------------------
export class FloatingCubesBackground {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    const w = window.innerWidth, h = window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(60, w/h, 0.1, 200);
    this.camera.position.z = 30;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    Object.assign(this.renderer.domElement.style, { position:'fixed', top:'0', left:'0', zIndex:'0', pointerEvents:'none' });
    container.appendChild(this.renderer.domElement);

    this.cubes = [];
    this._spawnCubes(18);

    this._onResize = () => {
      const w=window.innerWidth, h=window.innerHeight;
      this.camera.aspect=w/h; this.camera.updateProjectionMatrix();
      this.renderer.setSize(w,h);
    };
    window.addEventListener('resize', this._onResize);
    this._animate();
  }

  _spawnCubes(n) {
    const colors = Object.values(FACE_COLORS).filter(c => c !== 0x1a1a1a);
    for (let i=0; i<n; i++) {
      const geo = new THREE.BoxGeometry(1.5,1.5,1.5);
      const mats = Array.from({length:6}, () => new THREE.MeshLambertMaterial({ color: colors[Math.floor(Math.random()*colors.length)], transparent:true, opacity:0.18 }));
      const mesh = new THREE.Mesh(geo, mats);
      this._randomize(mesh);
      this.scene.add(mesh);
      this.cubes.push(mesh);
    }
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
    dir.position.set(10,20,10);
    this.scene.add(dir);
  }

  _randomize(mesh) {
    mesh.position.set((Math.random()-0.5)*60, (Math.random()-0.5)*40, (Math.random()-0.5)*20-5);
    mesh.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
    mesh.userData.vx = (Math.random()-0.5)*0.02;
    mesh.userData.vy = (Math.random()-0.5)*0.015;
    mesh.userData.rx = (Math.random()-0.5)*0.008;
    mesh.userData.ry = (Math.random()-0.5)*0.008;
  }

  _animate() {
    this._rafId = requestAnimationFrame(() => this._animate());
    this.cubes.forEach(c => {
      c.position.x += c.userData.vx; c.position.y += c.userData.vy;
      c.rotation.x += c.userData.rx; c.rotation.y += c.userData.ry;
      if (Math.abs(c.position.x) > 35) c.userData.vx *= -1;
      if (Math.abs(c.position.y) > 25) c.userData.vy *= -1;
    });
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    cancelAnimationFrame(this._rafId);
    window.removeEventListener('resize', this._onResize);
    this.renderer.dispose();
    if (this.renderer.domElement.parentNode) this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
  }
}

// ---------------------------------------------------------------------------
// TitleCubeRenderer — small solved cube that spins on its body diagonal
// dir: 1 = clockwise (right cube), -1 = counterclockwise (left cube)
// ---------------------------------------------------------------------------
export class TitleCubeRenderer {
  constructor(container, size = 80, dir = 1) {
    this.container = container;
    this.size = size;
    this.dir = dir;
    this._running = true;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    this.camera.position.set(5, 5, 5);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(size, size);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.domElement.style.display = 'block';
    container.appendChild(this.renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambient);
    const dir2 = new THREE.DirectionalLight(0xffffff, 0.6);
    dir2.position.set(5, 8, 6);
    this.scene.add(dir2);

    this.pivot = new THREE.Group();
    this.scene.add(this.pivot);

    this.pivot.rotation.x = Math.atan(1 / Math.sqrt(2));
    this.pivot.rotation.y = Math.PI / 4;

    this._buildSolvedCube();
    this._animate();
  }

  _buildSolvedCube() {
    const FACE_MAP = {
      0: 0x00aa44, // +x = R = Green
      1: 0x0044cc, // -x = L = Blue
      2: 0xffffff, // +y = U = White
      3: 0xffcc00, // -y = D = Yellow
      4: 0xcc2200, // +z = F = Red
      5: 0xff6600, // -z = B = Orange
    };
    const gap = 1.05;
    for (let gx = -1; gx <= 1; gx++) {
      for (let gy = -1; gy <= 1; gy++) {
        for (let gz = -1; gz <= 1; gz++) {
          const geo = new THREE.BoxGeometry(0.93, 0.93, 0.93);
          const mats = Array.from({ length: 6 }, (_, fi) => {
            const isOuter = (fi === 0 && gx === 1) || (fi === 1 && gx === -1) ||
                            (fi === 2 && gy === 1) || (fi === 3 && gy === -1) ||
                            (fi === 4 && gz === 1) || (fi === 5 && gz === -1);
            return new THREE.MeshLambertMaterial({ color: isOuter ? FACE_MAP[fi] : 0x111111 });
          });
          const mesh = new THREE.Mesh(geo, mats);
          mesh.position.set(gx * gap, gy * gap, gz * gap);
          this.pivot.add(mesh);
        }
      }
    }
  }

  setRunning(val) { this._running = val; }

  _animate() {
    this._rafId = requestAnimationFrame(() => this._animate());
    if (this._running) {
      this.pivot.rotation.y += 0.012 * this.dir;
    }
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    cancelAnimationFrame(this._rafId);
    this.renderer.dispose();
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
