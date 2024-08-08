const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

// Camera and light setup
const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 4, 10, new BABYLON.Vector3(0, 1, 0), scene);
camera.attachControl(canvas, true);
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

// Ground plane
const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);

// State variables
let isDrawing = false;
let isMoving = false;
let isVertexEditing = false;
let shapePoints = [];
let currentShape = null;
let selectedVertex = null;
let selectedObject = null;

// Draw mode button
document.getElementById("drawMode").addEventListener("click", () => {
    resetModes();
    isDrawing = true;
    shapePoints = [];
    disposeCurrentShape();
    document.getElementById("extrudeButton").disabled = true;
});

// Extrude button
document.getElementById("extrudeButton").addEventListener("click", () => {
    resetModes();
    if (shapePoints.length < 3) return;
    const polygon = BABYLON.MeshBuilder.ExtrudePolygon("polygon", { shape: shapePoints, depth: 1 }, scene);
    polygon.position.y = 0.5;
    disposeCurrentShape();
    currentShape = polygon;
    document.getElementById("moveMode").disabled = false;
    document.getElementById("vertexEditMode").disabled = false;
});

// Move mode button
document.getElementById("moveMode").addEventListener("click", () => {
    resetModes();
    isMoving = true;
});

// Vertex edit mode button
document.getElementById("vertexEditMode").addEventListener("click", () => {
    resetModes();
    isVertexEditing = true;
    createVertexHandles();
});

// Scene interaction
scene.onPointerObservable.add((pointerInfo) => {
    switch (pointerInfo.type) {
        case BABYLON.PointerEventTypes.POINTERDOWN:
            if (isDrawing) {
                handleDrawing(pointerInfo);
            } else if (isMoving && selectedObject) {
                handleObjectMove(pointerInfo);
            } else if (isVertexEditing && selectedVertex) {
                handleVertexMove(pointerInfo);
            }
            break;
        case BABYLON.PointerEventTypes.POINTERPICK:
            if (isMoving) {
                selectedObject = pointerInfo.pickInfo.pickedMesh;
            } else if (isVertexEditing) {
                selectedVertex = pointerInfo.pickInfo.pickedMesh;
            }
            break;
    }
});

// Render loop
engine.runRenderLoop(() => {
    scene.render();
});

// Window resize
window.addEventListener('resize', () => {
    engine.resize();
});

// Function to reset modes
function resetModes() {
    isDrawing = false;
    isMoving = false;
    isVertexEditing = false;
    selectedVertex = null;
    selectedObject = null;
    clearVertexHandles();
}

// Dispose the current shape if it exists
function disposeCurrentShape() {
    if (currentShape) {
        currentShape.dispose();
        currentShape = null;
    }
}

// Handle drawing points on the ground
function handleDrawing(pointerInfo) {
    const pickResult = scene.pick(scene.pointerX, scene.pointerY);
    if (pointerInfo.event.button === 0 && pickResult.hit && pickResult.pickedMesh === ground) { // Left-click to add points
        shapePoints.push(pickResult.pickedPoint.clone());
        updateShapeLines();
    } else if (pointerInfo.event.button === 2) { // Right-click to complete shape
        isDrawing = false;
        document.getElementById("extrudeButton").disabled = false;
    }
}

// Update the lines representing the shape
function updateShapeLines() {
    disposeCurrentShape();
    if (shapePoints.length > 1) {
        currentShape = BABYLON.MeshBuilder.CreateLines("line", { points: shapePoints.concat([shapePoints[0]]) }, scene);
    }
}

// Handle moving the object on the ground
function handleObjectMove(pointerInfo) {
    const pickResult = scene.pick(scene.pointerX, scene.pointerY);
    if (pickResult.hit && pickResult.pickedMesh === ground) {
        selectedObject.position.x = pickResult.pickedPoint.x;
        selectedObject.position.z = pickResult.pickedPoint.z;
    }
}

// Handle moving the vertices of the shape
function handleVertexMove(pointerInfo) {
    const pickResult = scene.pick(scene.pointerX, scene.pointerY);
    if (pickResult.hit) {
        selectedVertex.position.copyFrom(pickResult.pickedPoint);
        updateShapeFromVertices();
    }
}

// Update shape geometry from vertices
function updateShapeFromVertices() {
    const vertices = currentShape.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    vertices[selectedVertex.index * 3] = selectedVertex.position.x;
    vertices[selectedVertex.index * 3 + 1] = selectedVertex.position.y;
    vertices[selectedVertex.index * 3 + 2] = selectedVertex.position.z;
    currentShape.updateVerticesData(BABYLON.VertexBuffer.PositionKind, vertices);
}

// Create vertex handles for editing
function createVertexHandles() {
    const positions = currentShape.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    for (let i = 0; i < positions.length; i += 3) {
        const vertexHandle = BABYLON.MeshBuilder.CreateSphere("vertexHandle", { diameter: 0.1 }, scene);
        vertexHandle.position = new BABYLON.Vector3(positions[i], positions[i + 1], positions[i + 2]);
        vertexHandle.material = new BABYLON.StandardMaterial("vertexMat", scene);
        vertexHandle.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
        vertexHandle.index = i / 3;
    }
}

// Clear all vertex handles
function clearVertexHandles() {
    scene.meshes.forEach(mesh => {
        if (mesh.name === "vertexHandle") {
            mesh.dispose();
        }
    });
}
