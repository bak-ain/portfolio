import * as THREE from './three/three.module.js';
import { OrbitControls } from './three/OrbitControls.js';

// Scene & Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 4;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.querySelector('.fix_intro').appendChild(renderer.domElement);

// 반응형 스케일 계산
function calculateBaseScale() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const isLandscape = w > h;

  if (w < 360) return 0.85;
  else if (w < 480) return 0.95;
  else if (w < 768) return 1.05;
  else if (w < 1024) return isLandscape ? 1.3 : 1.15;
  else if (w < 1440) return 1.3;
  else return 1.5;
}

let baseScale = calculateBaseScale();

// 지구 생성
const loader = new THREE.TextureLoader();
const earthTexture = loader.load('./img/visual7.jpg');
const earthMaterial = new THREE.MeshStandardMaterial({
  map: earthTexture,
  roughness: 0.4,
  metalness: 0.3,
});
const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), earthMaterial);
sphere.scale.set(baseScale, baseScale, baseScale);
scene.add(sphere);

// Glow Sphere
const glowMaterial = new THREE.ShaderMaterial({
  uniforms: {
    glowColor: { value: new THREE.Color(0x9955ff) },
  },
  vertexShader: `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 glowColor;
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.2 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
      gl_FragColor = vec4(glowColor, intensity * 0.8);
    }
  `,
  side: THREE.BackSide,
  blending: THREE.AdditiveBlending,
  transparent: true,
});
const glowSphere = new THREE.Mesh(new THREE.SphereGeometry(1.25, 64, 64), glowMaterial);
glowSphere.scale.set(baseScale * 1.2, baseScale * 1.2, baseScale * 1.2);
scene.add(glowSphere);

// 조명
scene.add(new THREE.AmbientLight(0xffffff, 1.8));
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.mouseButtons = {
  LEFT: THREE.MOUSE.ROTATE,
  MIDDLE: null,
  RIGHT: null,
};
controls.touches = {
  ONE: THREE.TOUCH.ROTATE,
  TWO: null,
};

// 드래그 감지
let isUserDragging = false;
controls.addEventListener('start', () => { isUserDragging = true; });
controls.addEventListener('end', () => { isUserDragging = false; });

// 버튼 관련 변수
const buttonTextures = [
  loader.load('./img/Misson_Log.png'),
  loader.load('./img/my_planets.png'),
  loader.load('./img/portals.png'),
  loader.load('./img/signal.png'),
];
const buttonLabels = ['Mission Log', 'My Planets', 'Hidden Portals', 'Send Signal'];
const buttonLinks = ['#mission_log', '#my_planets', '#hidden_portals', '#send_signal'];
const labelColors = ["#D3FF75", "#9370DB", "#E3FFCE", "#B2FDFD"];
const buttons = [];

// 텍스트 스프라이트 생성
function createTextSprite(message, parameters = {}) {
  const fontface = parameters.fontface || "Russo One";
  const fontsize = parameters.fontsize || 40;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 400;
  canvas.height = 100;

  context.font = `${fontsize}px ${fontface}`;
  context.fillStyle = parameters.color || "white";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(message, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(1.5, 0.4, 1);
  return sprite;
}

// 버튼 표시 토글
function toggleButtonsVisibility() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const minSide = Math.min(w, h);
  const maxSide = Math.max(w, h);

  // 모바일 or 태블릿: 짧은 변이 768 미만이거나, 긴 변이 1366 이하일 때 (모두 포함)
  const isMobileOrTablet = minSide < 768 || maxSide <= 1366;

  // 버튼 숨김 처리
  buttons.forEach((btn) => {
    btn.visible = !isMobileOrTablet;
  });
}



// 버튼 위치 업데이트
function updateButtonPositions() {
  buttons.forEach((btn, i) => {
    const angle = baseAngle + (i * (Math.PI * 2 / buttons.length));
    btn.position.x = radius * Math.cos(angle);
    btn.position.z = radius * Math.sin(angle) - 0.5;
    btn.lookAt(camera.position);
  });
}

// 폰트 로딩 후 버튼 생성
const font = new FontFaceObserver('Russo One');
font.load().then(() => {
  buttonTextures.forEach((texture, i) => {
    const mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), mat);
    scene.add(plane);
    buttons.push(plane);

    const label = createTextSprite(buttonLabels[i], {
      fontsize: 20,
      color: labelColors[i],
    });
    label.position.set(0, -0.3, 0);
    plane.add(label);
  });

  toggleButtonsVisibility(); // ✅ 생성 후 한 번만 호출
}).catch(() => {
  console.warn("Russo One 폰트 로딩 실패 — 기본 폰트로 출력됩니다.");
});

// 리사이즈
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

  baseScale = calculateBaseScale();
  sphere.scale.set(baseScale, baseScale, baseScale);
  glowSphere.scale.set(baseScale * 1.2, baseScale * 1.2, baseScale * 1.2);

  toggleButtonsVisibility();
});

// 클릭 시 링크 이동
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(buttons);
  if (intersects.length > 0) {
    const index = buttons.indexOf(intersects[0].object);
    if (index !== -1) {
      const target = buttonLinks[index];
      window.location.href = target;

      // 스크롤 이동 보정
      setTimeout(() => {
        if (index == 1 || index == 2) {
          const currentScroll = $(target).offset().top + 3;
          window.scrollBy({ top: currentScroll, left: 0, behavior: 'auto' });
        }
        if (index == 0 && typeof ScrollTrigger !== 'undefined') {
          const st = ScrollTrigger.getById('horizontalScroll');
          if (st) {
            window.scrollTo({ top: st.start + 3, left: 0, behavior: 'smooth' });
          }
        }
      }, 50);
    }
  }
});

// 마우스 호버 감지
let isHoveringButton = false;
window.addEventListener('pointermove', (e) => {
  const x = (e.clientX / window.innerWidth) * 2 - 1;
  const y = -(e.clientY / window.innerHeight) * 2 + 1;
  mouse.set(x, y);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(buttons);
  isHoveringButton = intersects.length > 0;
});

// 애니메이션
const radius = 3;
let baseAngle = 0;
let bounceSpeed = 0;

function animate() {
  requestAnimationFrame(animate);

  if (!isUserDragging && !isHoveringButton) {
    sphere.rotation.y += 0.005;
    glowSphere.rotation.y += 0.005;
    baseAngle += 0.003;

    bounceSpeed += 0.02;
    sphere.position.y = Math.sin(bounceSpeed) * 0.05;
    glowSphere.position.y = sphere.position.y;
  }

  updateButtonPositions();
  controls.update();
  renderer.render(scene, camera);
}

animate();
