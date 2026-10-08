import * as THREE from 'three';

// Stylized ISS assembled from geometry: no model downloads or texture assets.
export function buildStation() {
  const station = new THREE.Group();
  const materials = {
    hull: new THREE.MeshStandardMaterial({
      color: 0xd3d7db,
      metalness: 0.55,
      roughness: 0.38,
    }),
    seam: new THREE.MeshStandardMaterial({
      color: 0x59636e,
      metalness: 0.7,
      roughness: 0.4,
    }),
    truss: new THREE.MeshStandardMaterial({
      color: 0xabb2b8,
      metalness: 0.72,
      roughness: 0.33,
    }),
    foil: new THREE.MeshStandardMaterial({
      color: 0xa48a50,
      metalness: 0.65,
      roughness: 0.42,
    }),
    panel: new THREE.MeshStandardMaterial({
      color: 0x292733,
      metalness: 0.6,
      roughness: 0.32,
    }),
    cell: new THREE.MeshStandardMaterial({
      color: 0x655333,
      metalness: 0.72,
      roughness: 0.3,
    }),
    radiator: new THREE.MeshStandardMaterial({
      color: 0xe7e6dc,
      metalness: 0.25,
      roughness: 0.65,
    }),
    glass: new THREE.MeshStandardMaterial({
      color: 0x192c3b,
      metalness: 0.75,
      roughness: 0.16,
    }),
  };
  const add = (geometry, material, x = 0, y = 0, z = 0) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    station.add(mesh);
    return mesh;
  };
  const box = (w, h, d, mat, x, y, z) =>
    add(new THREE.BoxGeometry(w, h, d), mat, x, y, z);
  const rod = (a, b, radius = 0.025, material = materials.truss) => {
    const start = new THREE.Vector3(...a),
      end = new THREE.Vector3(...b);
    const direction = end.clone().sub(start);
    const mesh = add(
      new THREE.CylinderGeometry(radius, radius, direction.length(), 6),
      material
    );
    mesh.position.copy(start.add(end).multiplyScalar(0.5));
    mesh.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.normalize()
    );
    return mesh;
  };

  // Four longitudinal rails and alternating diagonal braces form the main truss.
  for (const y of [-0.17, 0.17])
    for (const z of [-0.17, 0.17]) rod([-7.8, y, z], [7.8, y, z]);
  for (let x = -7.8, index = 0; x < 7.7; x += 0.6, index++) {
    for (const z of [-0.17, 0.17]) {
      rod([x, -0.17, z], [x, 0.17, z]);
      rod(
        [x, index % 2 ? -0.17 : 0.17, z],
        [x + 0.6, index % 2 ? 0.17 : -0.17, z]
      );
    }
    rod([x, -0.17, -0.17], [x, -0.17, 0.17]);
  }

  // Eight solar wings. Instancing keeps hundreds of individual cells inexpensive.
  const cells = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.73, 0.19, 0.014),
    materials.cell,
    8 * 2 * 15
  );
  const matrix = new THREE.Matrix4();
  let cellIndex = 0;
  for (const x of [-6.8, -4.65, 4.65, 6.8]) {
    rod([x, -4.25, 0], [x, 4.25, 0], 0.045, materials.foil);
    add(
      new THREE.CylinderGeometry(0.18, 0.18, 0.44, 12),
      materials.hull,
      x,
      0,
      0
    ).rotation.z = Math.PI / 2;
    for (const side of [-1, 1]) {
      const y = side * 2.65;
      box(1.65, 3.3, 0.045, materials.panel, x, y, 0);
      for (const edge of [-1, 1]) {
        box(0.035, 3.34, 0.065, materials.foil, x + edge * 0.825, y, 0);
        box(1.68, 0.035, 0.065, materials.foil, x, y + edge * 1.65, 0);
      }
      box(0.035, 3.3, 0.07, materials.foil, x, y, 0);
      for (let row = 0; row < 15; row++)
        for (const col of [-1, 1]) {
          matrix.makeTranslation(
            x + col * 0.405,
            y - 1.52 + row * 0.217,
            0.035
          );
          cells.setMatrixAt(cellIndex++, matrix);
        }
    }
  }
  station.add(cells);

  const module = (x, y, z, length, radius, horizontal = false) => {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    if (horizontal) group.rotation.z = Math.PI / 2;
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, length, 24),
      materials.hull
    );
    group.add(body);
    for (const side of [-1, 1]) {
      const cap = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 20, 12),
        materials.hull
      );
      cap.scale.y = 0.3;
      cap.position.y = (side * length) / 2;
      group.add(cap);
      const hatch = new THREE.Mesh(
        new THREE.CylinderGeometry(radius * 0.52, radius * 0.52, 0.12, 16),
        materials.seam
      );
      hatch.position.y = side * (length / 2 + radius * 0.25);
      group.add(hatch);
    }
    for (const pos of [-0.4, 0, 0.4]) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius + 0.008, 0.025, 6, 24),
        materials.seam
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = pos * length;
      group.add(ring);
    }
    for (const side of [-1, 1]) {
      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(0.045, length * 0.72, 0.035),
        materials.foil
      );
      rail.position.set(side * radius * 0.55, 0, radius * 0.87);
      group.add(rail);
    }
    station.add(group);
  };
  module(0, 0.1, 0.48, 1.4, 0.47);
  module(0, 1.7, 0.48, 1.4, 0.4);
  module(0, -1.4, 0.48, 1.25, 0.42);
  module(0, -2.85, 0.48, 1.1, 0.31);
  module(-1.12, 1.15, 0.48, 1.35, 0.32, true);
  module(1.13, 1.15, 0.48, 1.25, 0.34, true);
  box(0.8, 0.55, 0.65, materials.foil, -1.3, 1.9, 0.45);

  // Cupola with six dark windows, a docking vehicle and communications antennas.
  const cupola = add(
    new THREE.CylinderGeometry(0.2, 0.31, 0.23, 6),
    materials.hull,
    0,
    -0.65,
    1.0
  );
  cupola.rotation.x = Math.PI / 2;
  add(new THREE.CircleGeometry(0.17, 6), materials.glass, 0, -0.65, 1.125);
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const window = box(
      0.12,
      0.12,
      0.025,
      materials.glass,
      Math.cos(angle) * 0.21,
      -0.65 + Math.sin(angle) * 0.21,
      1.095
    );
    window.rotation.z = angle;
  }
  add(
    new THREE.CylinderGeometry(0.18, 0.32, 0.65, 16),
    materials.hull,
    0,
    -3.95,
    0.48
  );
  add(new THREE.SphereGeometry(0.2, 16, 10), materials.seam, 0, -4.35, 0.48);
  for (const side of [-1, 1]) {
    rod([0, -2.9, 0.48], [side * 1.65, -2.9, 0.48], 0.035);
    box(0.9, 0.65, 0.04, materials.panel, side * 1.25, -2.9, 0.48);
    for (let i = -2; i <= 2; i++)
      box(
        0.018,
        0.65,
        0.02,
        materials.foil,
        side * 1.25 + i * 0.16,
        -2.9,
        0.51
      );
  }
  for (const x of [-2.7, 2.7])
    for (const side of [-1, 1]) {
      const y = side * 1.25;
      box(1.15, 1.6, 0.055, materials.radiator, x, y, -0.12);
      for (let row = 0; row < 7; row++)
        box(
          1.15,
          0.015,
          0.012,
          materials.seam,
          x,
          y - 0.68 + row * 0.22,
          -0.085
        );
      rod([x, 0, 0], [x, y, -0.12], 0.045);
    }
  const arm = [
    [1, 0.25, 0.6],
    [1.6, 0.6, 1.2],
    [2.4, 1.5, 1.3],
    [1.9, 2.2, 1.5],
    [1.45, 2.35, 1.4],
  ];
  arm.forEach((point, i) => {
    add(new THREE.SphereGeometry(0.095, 10, 8), materials.seam, ...point);
    if (i) rod(arm[i - 1], point, 0.065, materials.hull);
  });
  for (const x of [-1, 1]) {
    rod([x * 1.5, 0, 0.2], [x * 1.9, -0.7, 1.1], 0.035);
    const dish = add(
      new THREE.SphereGeometry(0.23, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      materials.radiator,
      x * 1.9,
      -0.7,
      1.1
    );
    dish.rotation.x = Math.PI / 2;
    rod([x * 1.9, -0.7, 1.1], [x * 1.9, -0.7, 1.45], 0.02);
  }
  return station;
}
