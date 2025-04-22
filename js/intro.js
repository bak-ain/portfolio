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

// 텍스처 로드
const loader = new THREE.TextureLoader();
const earthTexture = loader.load('./img/visual7.jpg');

// 지구 만들기
const earthMaterial = new THREE.MeshStandardMaterial({
  map: earthTexture,
  roughness: 0.4,
  metalness: 0.3,
});
const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), earthMaterial);
sphere.scale.set(1.5, 1.5, 1.5);
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
glowSphere.scale.set(1.8, 1.8, 1.8);
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

// 리사이즈 대응
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 버튼 텍스처/레이블/링크
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

// 텍스트 스프라이트 생성 함수
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

// ✅ 폰트가 완전히 로드된 후 버튼 및 텍스트 생성
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
}).catch(() => {
  console.warn("Russo One 폰트 로딩 실패 — 기본 폰트로 출력됩니다.");
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
      if (index == 1 || index == 2) {
        const currentScroll = $(target).offset().top + 3;
        setTimeout(() => {
          window.scrollBy({
            top: currentScroll,
            left: 0,
            behavior: 'auto'
          });
        }, 50);
      }
      if (index == 0) {
        const st = ScrollTrigger.getById('horizontalScroll');
        if (st) {
          const scrollTarget = st.start + 3;
          setTimeout(() => {
            window.scrollTo({
              top: scrollTarget,
              left: 0,
              behavior: 'smooth'
            });
          }, 50);
        }
      }
    }
  }
});

// 마우스 호버 체크
const radius = 3;
let baseAngle = 0;
let isHoveringButton = false;

window.addEventListener('pointermove', (e) => {
  const x = (e.clientX / window.innerWidth) * 2 - 1;
  const y = -(e.clientY / window.innerHeight) * 2 + 1;
  mouse.set(x, y);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(buttons);
  isHoveringButton = intersects.length > 0;
});

// 애니메이션 루프
const autoRotateSpeed = 0.005;
let bounceSpeed = 0;

function animate() {
  requestAnimationFrame(animate);

  if (!isUserDragging && !isHoveringButton) {
    sphere.rotation.y += autoRotateSpeed;
    glowSphere.rotation.y += autoRotateSpeed;
    baseAngle += 0.003;

    bounceSpeed += 0.02;
    sphere.position.y = Math.sin(bounceSpeed) * 0.05;
    glowSphere.position.y = sphere.position.y;
  }

  buttons.forEach((btn, i) => {
    const angle = baseAngle + (i * (Math.PI * 2 / buttons.length));
    btn.position.x = radius * Math.cos(angle);
    btn.position.z = radius * Math.sin(angle) - 0.5;
    btn.lookAt(camera.position);
  });

  controls.update();
  renderer.render(scene, camera);
}

animate();
