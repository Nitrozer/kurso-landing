// Scène 3D unique de Gribou : un seul canvas fixe, le personnage est placé en pixels écran.
//
// REPRIS de la maquette (site/gribou-stage.js), à une chose près : three.js
// n'est plus chargé depuis un CDN à l'exécution mais empaqueté avec le site.
// Trois raisons : le site ne dépend plus d'un domaine tiers pour s'afficher,
// la version est figée, et le navigateur n'a pas deux allers-retours à faire
// avant de voir la mascotte. Le reste du fichier est inchangé.
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// Le modèle est compressé (meshopt) : 3,98 Mo → 876 Ko. L'écran de
// chargement attend après lui, donc c'est lui qui fixait le temps
// d'affichage de la page.
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'

export async function createStage(canvas, src, onProgress) {
  const gl = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
  gl.setClearColor(0x000000, 0);
  gl.outputColorSpace = THREE.SRGBColorSpace;
  gl.toneMapping = THREE.NoToneMapping;
  const scene = new THREE.Scene();
  const FOV = 20, CZ = 14;
  const cam = new THREE.PerspectiveCamera(FOV, 1, 0.5, 60);
  cam.position.set(0, 0, CZ);

  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
  const gltf = await loader.loadAsync(src, (e) => { if (onProgress && e.total) onProgress(e.loaded / e.total); });
  const model = gltf.scene;
  model.traverse((o) => { if (o.isMesh) o.frustumCulled = false; });
  model.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(model, true);
  const size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
  model.position.set(-c.x, -box.min.y, -c.z);
  const norm = new THREE.Group(); norm.scale.setScalar(1 / (size.y || 1)); norm.add(model);
  const lean = new THREE.Group(); lean.add(norm);
  const spin = new THREE.Group(); spin.add(lean);
  const root = new THREE.Group(); root.add(spin);

  const sc = document.createElement('canvas'); sc.width = sc.height = 64;
  const g2 = sc.getContext('2d'), grd = g2.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(5,9,28,0.5)'); grd.addColorStop(0.6, 'rgba(5,9,28,0.18)'); grd.addColorStop(1, 'rgba(5,9,28,0)');
  g2.fillStyle = grd; g2.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(sc); tex.colorSpace = THREE.SRGBColorSpace;
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false }));
  shadow.scale.set(0.6, 0.12, 1); shadow.position.set(0, 0.012, -0.35); shadow.renderOrder = -1;
  root.add(shadow); scene.add(root);

  // Visages pilotés ici : les expressions exportées dans les clips sont ignorées.
  const faces = []; let dict = null;
  model.traverse((o) => { if (o.morphTargetDictionary && o.morphTargetDictionary.sourire != null) { faces.push(o); if (!dict) dict = o.morphTargetDictionary; } });
  const nT = dict ? Object.keys(dict).length : 0;
  if (nT) for (const clip of gltf.animations) clip.tracks = clip.tracks.filter((tr) => !(/morphTargetInfluences$/.test(tr.name) && tr.values.length === tr.times.length * nT));
  const SM = { sourire: 1 }, HAPPY = { sourire: 1, 'yeux_fermés': 1, 'joues_gonflées': 1 };
  const FACES = { idle: SM, ecrire: SM, 'concentré': SM, sautiller: SM, coucou: { sourire: 1, 'joues_gonflées': 0.6 }, saut_apparition: { sourire: 1, yeux_grands: 0.3 }, pointer: { sourire: 1, yeux_grands: 0.4 }, fier: HAPPY, applaudir: HAPPY, taille_crayon: HAPPY, victoire: { 'yeux_fermés': 1, 'joues_gonflées': 1, bouche_grande: 1 }, surpris: { yeux_grands: 0.8, bouche_ouverte: 0.6, sourire: 0.3 }, inquiet: { yeux_grands: 0.5, sourire: 0.4 }, endormi: { yeux_dodo: 1, bouche_ouverte: 0.5 } };
  const fNow = new Float32Array(nT), fTo = new Float32Array(nT);
  function setFace(name) { if (!nT) return; fTo.fill(0); const F = FACES[name] || SM; for (const key in F) if (dict[key] != null) fTo[dict[key]] = F[key]; }
  function applyFace(dt) { if (!nT) return; const kf = 1 - Math.exp(-dt * 12); for (let i = 0; i < nT; i++) fNow[i] += (fTo[i] - fNow[i]) * kf; for (const o of faces) { const inf = o.morphTargetInfluences; for (let i = 0; i < nT && i < inf.length; i++) inf[i] = fNow[i]; } }
  setFace('idle'); fNow.set(fTo); applyFace(1);

  const mixer = new THREE.AnimationMixer(model);
  const acts = {};
  for (const clip of gltf.animations) acts[clip.name] = mixer.clipAction(clip);
  let cur = null, next = null;
  mixer.addEventListener('finished', (e) => { if (e.action === cur && next) { const q = next; next = null; play(q.n, q); } });

  function play(name, o = {}) {
    const a = acts[name] || acts.idle;
    if (!a) return;
    setFace(acts[name] ? name : 'idle');
    if (a === cur && !o.once) { a.paused = false; next = o.then || null; return; }
    a.reset(); a.enabled = true; a.paused = false; a.timeScale = o.speed || 1;
    a.setLoop(o.once ? THREE.LoopOnce : THREE.LoopRepeat, Infinity);
    a.clampWhenFinished = !!o.once;
    a.setEffectiveWeight(1);
    if (cur && cur !== a) a.crossFadeFrom(cur, o.fade == null ? 0.35 : o.fade, false);
    a.play(); cur = a; next = o.then || null;
  }
  function scrub(name, p) {
    const a = acts[name]; if (!a) return;
    if (a !== cur) play(name, { fade: 0.2 });
    a.paused = true;
    a.time = Math.min(0.999, Math.max(0, p)) * a.getClip().duration;
  }

  let vw = 1, vh = 1, wpp = 0.01;
  function resize(w, h, dpr) {
    vw = Math.max(1, w); vh = Math.max(1, h);
    gl.setPixelRatio(Math.min(dpr || 1, 1.75)); gl.setSize(vw, vh, false);
    cam.aspect = vw / vh; cam.updateProjectionMatrix();
    wpp = (2 * CZ * Math.tan((FOV * Math.PI) / 360)) / vh;
  }
  // p.x / p.y = pieds en px écran, p.h = hauteur en px
  function pose(p) {
    root.position.set((p.x - vw / 2) * wpp, (vh / 2 - p.y) * wpp, 0);
    root.scale.setScalar(Math.max(1e-4, p.h * wpp));
    spin.rotation.set(p.pitch || 0, p.yaw || 0, 0);
    lean.rotation.z = p.roll || 0;
    shadow.material.opacity = p.shadow == null ? 1 : p.shadow;
  }

  return {
    clips: Object.keys(acts),
    play, scrub, pose, resize,
    render(dt) { mixer.update(dt); applyFace(dt); gl.render(scene, cam); },
    clear() { gl.clear(); },
    duration: (n) => (acts[n] ? acts[n].getClip().duration : 1),
    dispose() { gl.dispose(); },
  };
}
