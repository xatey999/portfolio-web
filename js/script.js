// Import Three.js as ES Module
import * as THREE from "three";

// SCENE SETUP
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x02060b, 0.02);

const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 15);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x02060b);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// LIGHTING
const ambientLight = new THREE.AmbientLight(0x3a4a5a, 0.5);
scene.add(ambientLight);

const moonLight = new THREE.DirectionalLight(0x9fcfff, 1.5);
moonLight.position.set(15, 25, 10);
moonLight.castShadow = true;
moonLight.shadow.mapSize.width = 2048;
moonLight.shadow.mapSize.height = 2048;
moonLight.shadow.camera.left = -50;
moonLight.shadow.camera.right = 50;
moonLight.shadow.camera.top = 50;
moonLight.shadow.camera.bottom = -50;
scene.add(moonLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
rimLight.position.set(-15, 15, -15);
scene.add(rimLight);

// MOON (using MeshStandardMaterial for emissive properties)
const moonGeometry = new THREE.SphereGeometry(3, 32, 32);
const moonMaterial = new THREE.MeshStandardMaterial({
  color: 0x9fcfff,
  emissive: 0x9fcfff,
  emissiveIntensity: 0.3,
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(25, 35, -30);
scene.add(moon);

// ENHANCED TERRAIN
function createTerrain() {
  const terrainGeometry = new THREE.PlaneGeometry(200, 200, 100, 100);
  const terrainMaterial = new THREE.MeshStandardMaterial({
    color: 0xbfd6e6,
    roughness: 0.9,
    metalness: 0.1,
  });

  const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
  terrain.rotation.x = -Math.PI / 2;
  terrain.position.y = -5;
  terrain.receiveShadow = true;

  // Add vertex displacement for mountain-like terrain
  const vertices = terrainGeometry.attributes.position.array;
  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const z = vertices[i + 2];
    vertices[i + 1] = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 5;

    // Add some random peaks
    if (Math.sqrt(x * x + z * z) < 50) {
      vertices[i + 1] += Math.random() * 2;
    }
  }

  terrainGeometry.computeVertexNormals();
  scene.add(terrain);

  // Add rock formations
  const rockGeometry = new THREE.DodecahedronGeometry(1, 0);
  const rockMaterial = new THREE.MeshStandardMaterial({
    color: 0x8a9ba8,
    roughness: 1,
  });

  for (let i = 0; i < 30; i++) {
    const rock = new THREE.Mesh(rockGeometry, rockMaterial);
    const angle = Math.random() * Math.PI * 2;
    const radius = 20 + Math.random() * 60;
    rock.position.set(
      Math.cos(angle) * radius,
      Math.random() * 3 - 4,
      Math.sin(angle) * radius
    );
    rock.scale.setScalar(0.5 + Math.random() * 2);
    rock.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    rock.castShadow = true;
    scene.add(rock);
  }
}

createTerrain();

// =========================
// ENHANCED REALISTIC YETI
// =========================
function createRealisticYeti() {
  const yeti = new THREE.Group();

  // FUR MATERIAL
  const furMaterial = new THREE.MeshStandardMaterial({
    color: 0xd1dce6,
    roughness: 0.9,
    metalness: 0.1,
  });

  // BODY WITH MUSCULAR STRUCTURE
  const torsoGeometry = new THREE.CylinderGeometry(2.2, 2.8, 5, 16);
  const torso = new THREE.Mesh(torsoGeometry, furMaterial);
  torso.position.y = 4;
  torso.castShadow = true;
  yeti.add(torso);

  // SHOULDER MUSCLES
  const shoulderGeometry = new THREE.SphereGeometry(1.2, 16, 16);
  const leftShoulder = new THREE.Mesh(shoulderGeometry, furMaterial);
  leftShoulder.position.set(-2.5, 5.5, 0);
  leftShoulder.castShadow = true;

  const rightShoulder = leftShoulder.clone();
  rightShoulder.position.x = 2.5;

  yeti.add(leftShoulder, rightShoulder);

  // CHEST MUSCLE
  const chestGeometry = new THREE.SphereGeometry(2.3, 24, 24);
  const chest = new THREE.Mesh(chestGeometry, furMaterial);
  chest.scale.z = 0.7;
  chest.position.set(0, 5.2, 1.5);
  chest.castShadow = true;
  yeti.add(chest);

  // HEAD WITH PREDATOR FEATURES
  const headGeometry = new THREE.SphereGeometry(1.8, 32, 32);
  const head = new THREE.Mesh(headGeometry, furMaterial);
  head.position.y = 7.5;
  head.castShadow = true;
  yeti.add(head);

  // JAW STRUCTURE
  const jawGeometry = new THREE.BoxGeometry(2, 0.8, 1.2);
  const jaw = new THREE.Mesh(jawGeometry, furMaterial);
  jaw.position.set(0, 6.2, 1);
  jaw.castShadow = true;
  yeti.add(jaw);

  // EYES - PREDATOR GLOW
  const eyeGeometry = new THREE.SphereGeometry(0.18, 16, 16);
  const eyeMaterial = new THREE.MeshStandardMaterial({
    color: 0x66ccff,
    emissive: 0x66ccff,
    emissiveIntensity: 2.5,
    roughness: 0.1,
  });

  const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  leftEye.position.set(-0.6, 7.6, 1.5);

  const rightEye = leftEye.clone();
  rightEye.position.x = 0.6;

  // Add eye glow effect using a separate mesh
  const eyeGlowGeometry = new THREE.SphereGeometry(0.25, 16, 16);
  const eyeGlowMaterial = new THREE.MeshBasicMaterial({
    color: 0x66ccff,
    transparent: true,
    opacity: 0.3,
  });

  const leftEyeGlow = new THREE.Mesh(eyeGlowGeometry, eyeGlowMaterial);
  leftEyeGlow.position.copy(leftEye.position);

  const rightEyeGlow = leftEyeGlow.clone();
  rightEyeGlow.position.copy(rightEye.position);

  yeti.add(leftEye, rightEye, leftEyeGlow, rightEyeGlow);

  // HORNS/BROWS
  const browGeometry = new THREE.ConeGeometry(0.2, 0.8, 8);
  const browMaterial = new THREE.MeshStandardMaterial({ color: 0x8a9ba8 });

  for (let i = -1; i <= 1; i += 2) {
    const brow = new THREE.Mesh(browGeometry, browMaterial);
    brow.position.set(i * 0.8, 8, 1);
    brow.rotation.z = i * 0.3;
    brow.rotation.x = -0.3;
    brow.castShadow = true;
    yeti.add(brow);
  }

  // MOUTH/SNARL
  const mouthGeometry = new THREE.BoxGeometry(1.2, 0.2, 0.4);
  const mouth = new THREE.Mesh(
    mouthGeometry,
    new THREE.MeshStandardMaterial({
      color: 0x330000,
    })
  );
  mouth.position.set(0, 6.8, 1.6);
  yeti.add(mouth);

  // ARMS WITH MUSCULAR DEFINITION
  function createArm(side) {
    const armGroup = new THREE.Group();

    // Upper arm
    const upperArmGeometry = new THREE.CapsuleGeometry(0.7, 3.5, 8, 16);
    const upperArm = new THREE.Mesh(upperArmGeometry, furMaterial);
    upperArm.rotation.z = side * 0.3;
    upperArm.castShadow = true;

    // Forearm
    const forearmGeometry = new THREE.CapsuleGeometry(0.6, 3, 8, 16);
    const forearm = new THREE.Mesh(forearmGeometry, furMaterial);
    forearm.position.y = -3.2;
    forearm.rotation.z = side * 0.4;
    forearm.castShadow = true;

    // Hand
    const handGeometry = new THREE.BoxGeometry(1, 1.2, 0.8);
    const hand = new THREE.Mesh(handGeometry, furMaterial);
    hand.position.y = -4.5;
    hand.rotation.z = side * 0.2;
    hand.castShadow = true;

    // Claws
    const clawGeometry = new THREE.ConeGeometry(0.1, 0.5, 6);
    const clawMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });

    for (let i = -1; i <= 1; i += 1) {
      const claw = new THREE.Mesh(clawGeometry, clawMaterial);
      claw.position.set(i * 0.2, -0.8, 0.4);
      claw.rotation.x = Math.PI / 6;
      hand.add(claw);
    }

    upperArm.add(forearm);
    forearm.add(hand);
    armGroup.add(upperArm);

    armGroup.position.set(side * 3, 5.5, 0);
    armGroup.rotation.x = -0.5;

    return { armGroup, hand };
  }

  const leftArm = createArm(-1);
  const rightArm = createArm(1);

  yeti.add(leftArm.armGroup, rightArm.armGroup);

  // LEGS
  function createLeg(side) {
    const legGeometry = new THREE.CapsuleGeometry(0.8, 3, 8, 16);
    const leg = new THREE.Mesh(legGeometry, furMaterial);
    leg.position.set(side * 1.5, 1.5, 0);
    leg.castShadow = true;
    return leg;
  }

  const leftLeg = createLeg(-1);
  const rightLeg = createLeg(1);
  yeti.add(leftLeg, rightLeg);

  // POSITION YETI
  yeti.position.set(0, -2, 8);
  yeti.rotation.y = Math.PI * 0.1;

  return { yeti, leftHand: leftArm.hand, rightHand: rightArm.hand };
}

const { yeti, leftHand, rightHand } = createRealisticYeti();
scene.add(yeti);

// =========================
// ENHANCED BANNERS
// =========================
function createBanner(text, color = "#66ccff") {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  // Background with gradient
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, "#0b1d2a");
  gradient.addColorStop(1, "#112a3e");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Border with glowing effect
  ctx.strokeStyle = color;
  ctx.lineWidth = 12;
  ctx.shadowColor = color;
  ctx.shadowBlur = 20;
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

  // Text with outline
  ctx.font = "bold 80px 'Montserrat', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Text shadow
  ctx.shadowColor = color;
  ctx.shadowBlur = 15;
  ctx.fillStyle = color;
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  // Inner glow
  ctx.shadowColor = "transparent";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.strokeText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;

  const bannerGeometry = new THREE.PlaneGeometry(6, 3);
  const bannerMaterial = new THREE.MeshStandardMaterial({
    map: texture,
    side: THREE.DoubleSide,
    emissive: color,
    emissiveIntensity: 0.3,
    roughness: 0.3,
    metalness: 0.1,
    transparent: true,
    opacity: 0.95,
  });

  const banner = new THREE.Mesh(bannerGeometry, bannerMaterial);
  banner.castShadow = true;

  return banner;
}

// BANNERS WITH DIFFERENT COLORS
const bannerConfigs = [
  { text: "ABOUT ME", color: "#66ccff" },
  { text: "MY PROJECTS", color: "#4dffea" },
  { text: "MY SKILLS", color: "#ff66cc" },
  { text: "HIRE ME", color: "#ffcc66" },
];

const banners = bannerConfigs.map((config) =>
  createBanner(config.text, config.color)
);

// Position banners in hands
banners[0].position.set(0, -4.5, 1);
banners[0].rotation.x = -0.3;
leftHand.add(banners[0]);

banners[1].position.set(0, -4.5, -1);
banners[1].rotation.x = -0.3;
leftHand.add(banners[1]);

banners[2].position.set(0, -4.5, 1);
banners[2].rotation.x = -0.3;
rightHand.add(banners[2]);

banners[3].position.set(0, -4.5, -1);
banners[3].rotation.x = -0.3;
rightHand.add(banners[3]);

// =========================
// ENHANCED SNOWSTORM
// =========================
const snowflakeCount = 5000;
const snowflakeGeometry = new THREE.BufferGeometry();
const snowflakePositions = new Float32Array(snowflakeCount * 3);
const snowflakeSpeeds = new Float32Array(snowflakeCount);
const snowflakeSizes = new Float32Array(snowflakeCount);

for (let i = 0; i < snowflakeCount; i++) {
  const i3 = i * 3;
  snowflakePositions[i3] = (Math.random() - 0.5) * 200;
  snowflakePositions[i3 + 1] = Math.random() * 100 + 10;
  snowflakePositions[i3 + 2] = (Math.random() - 0.5) * 200;
  snowflakeSpeeds[i] = 0.05 + Math.random() * 0.15;
  snowflakeSizes[i] = Math.random() * 0.3 + 0.1;
}

snowflakeGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(snowflakePositions, 3)
);

const snowflakeMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.2,
  transparent: true,
  opacity: 0.8,
  sizeAttenuation: true,
});

const snowstorm = new THREE.Points(snowflakeGeometry, snowflakeMaterial);
scene.add(snowstorm);

// =========================
// ANIMATION LOOP
// =========================
const clock = new THREE.Clock();
let time = 0;

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  time += delta;

  // YETI ANIMATIONS
  // Breathing motion
  const breath = Math.sin(time * 1.5) * 0.05;
  yeti.position.y = -2 + breath;

  // Head movement
  yeti.rotation.y = Math.PI * 0.1 + Math.sin(time * 0.5) * 0.1;

  // Eye glow pulse - only affect eye materials
  const eyePulse = Math.sin(time * 3) * 0.5 + 0.5;

  // Update eye materials
  const eyeMeshes = [
    yeti.children.find((c) => c.material && c.material.emissive !== undefined),
  ];
  eyeMeshes.forEach((eye) => {
    if (eye && eye.material) {
      eye.material.emissiveIntensity = 2 + eyePulse;
    }
  });

  // ARM SWAY ANIMATION
  const armSway = Math.sin(time * 0.8) * 0.2;
  yeti.children.forEach((child) => {
    if (child.position && Math.abs(child.position.x) > 2) {
      child.rotation.x = -0.5 + armSway;
    }
  });

  // BANNER ANIMATIONS
  banners.forEach((banner, i) => {
    const bannerSway = Math.sin(time * 1 + i) * 0.15;
    banner.rotation.y = bannerSway;
    banner.rotation.z = Math.sin(time * 0.7 + i) * 0.05;

    // Subtle floating effect
    banner.position.y = -4.5 + Math.sin(time * 0.5 + i) * 0.1;
  });

  // SNOW ANIMATION
  const positions = snowflakeGeometry.attributes.position.array;
  for (let i = 0; i < snowflakeCount; i++) {
    const i3 = i * 3;
    positions[i3 + 1] -= snowflakeSpeeds[i];

    // Add wind effect
    positions[i3] += Math.sin(time * 0.5 + i) * 0.02;
    positions[i3 + 2] += Math.cos(time * 0.3 + i) * 0.01;

    // Reset snowflake when it falls below ground
    if (positions[i3 + 1] < -5) {
      positions[i3 + 1] = 100 + Math.random() * 20;
      positions[i3] = (Math.random() - 0.5) * 200;
      positions[i3 + 2] = (Math.random() - 0.5) * 200;
    }
  }
  snowflakeGeometry.attributes.position.needsUpdate = true;

  // CAMERA MOVEMENT
  const cameraOrbit = time * 0.05;
  camera.position.x = Math.sin(cameraOrbit) * 10;
  camera.position.z = 15 + Math.cos(cameraOrbit) * 5;
  camera.lookAt(0, 3, 0);

  // MOON GLOW
  moon.material.emissiveIntensity = 0.3 + Math.sin(time * 0.2) * 0.1;

  renderer.render(scene, camera);
}

// MOUSE INTERACTION
let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// =========================
// INITIALIZATION
// =========================
window.addEventListener("load", () => {
  setTimeout(() => {
    const loadingElement = document.getElementById("loading");
    if (loadingElement) {
      loadingElement.style.opacity = "0";
      setTimeout(() => {
        loadingElement.style.display = "none";
        animate();
      }, 500);
    } else {
      animate();
    }
  }, 1500);
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// TOUCH INTERACTION FOR MOBILE
document.addEventListener("touchstart", (e) => {
  mouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
  mouseY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
});

document.addEventListener(
  "touchmove",
  (e) => {
    mouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
    e.preventDefault();
  },
  { passive: false }
);

// INITIAL BANNER GLOW
if (banners[0]) {
  banners[0].material.emissiveIntensity = 1;
}

// Make functions globally available for debugging if needed
window.debugScene = scene;
window.debugCamera = camera;
window.debugYeti = yeti;

// Navigation Toggle functionality:

document.addEventListener("DOMContentLoaded", function () {
  const desktopNavButtons = document.querySelectorAll(
    "#desktopNav .desktop-nav-btn"
  );
  const mobileNavButtons = document.querySelectorAll("#mobileNav .nav-btn");

  const date = new Date();
  const year = date.getFullYear();

  document.getElementById("currentYear").textContent = year;

  const panels = document.querySelectorAll(".panel-content");
  const panelTitle = document.getElementById("panelTitle");

  const titles = {
    about: "ABOUT ME",
    projects: "MY PROJECTS",
    skills: "MY SKILLS",
    contact: "CONTACT / HIRE ME",
  };

  // Function to handle navigation
  function handleNavigation(section) {
    // Toggle panels
    panels.forEach((panel) => {
      panel.classList.toggle("active", panel.id === section);
    });

    // Update title
    panelTitle.textContent = titles[section];

    // Desktop nav active state
    desktopNavButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.section === section);
      btn.classList.toggle("glow", btn.dataset.section === section);
    });

    // Mobile nav active state
    mobileNavButtons.forEach((btn) => {
      const isActive = btn.dataset.section === section;
      btn.classList.toggle("glow", isActive);
      btn.style.borderColor = isActive ? "#66ccff" : "rgba(102, 204, 255, 0.4)";
      btn.style.background = isActive
        ? "rgba(102, 204, 255, 0.15)"
        : "rgba(11, 29, 42, 0.9)";
    });
  }

  desktopNavButtons.forEach((btn) =>
    btn.addEventListener("click", () => handleNavigation(btn.dataset.section))
  );

  mobileNavButtons.forEach((btn) =>
    btn.addEventListener("click", () => handleNavigation(btn.dataset.section))
  );

  handleNavigation('about');
});
