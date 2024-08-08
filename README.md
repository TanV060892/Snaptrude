# 2D Shape Extrusion using Babylon.js Assignment

## Overview
The user can draw a shape, extrude it into a 3D object, move the object, and edit its vertices.This project demonstrates the creation, extrusion, and manipulation of 2D shapes on a 3D ground plane using Babylon.js. 

## Features
- **Draw Mode**: Left-click to add points on the ground plane. Right-click to complete the shape.
- **Extrude Shape**: Extrude the drawn shape into a 3D object with a fixed height.
- **Move Mode**: Click and drag the extruded object to move it on the ground plane.
- **Vertex Edit Mode**: Edit the vertices of the extruded object by clicking and dragging them in 3D space.

## Installation
No installation is required. Just open `index.html` in your web browser.

## Controls
- **Draw Mode**: Click the "Draw" button, left-click to add points, and right-click to complete the shape.
- **Extrude Shape**: Click the "Extrude" button to extrude the shape.
- **Move Mode**: Click the "Move" button, then click and drag the object to move it.
- **Vertex Edit Mode**: Click the "Edit Vertices" button, then click and drag vertices to move them.

## Requirements
- Babylon.js (loaded via CDN)
- Basic HTML, CSS, and JavaScript knowledge.

## Notes
- The extrusion height is hard-coded to 1 unit.
- The project is structured to allow easy addition of new features or modifications.

## How the Code Works
- Draw Mode: When you click the "Draw" button, the application enters drawing mode. Left-clicking on the ground adds points to the shape, and right-clicking completes the shape.

- Extrude Shape: Once the shape is completed, you can click the "Extrude" button to extrude the shape into a 3D object. The extrusion height is fixed.

- Move Mode: After extrusion, you can click the "Move" button to move the extruded object around the ground plane by clicking and dragging.

- Vertex Edit Mode: By clicking the "Vertex Edit" button, you can edit the vertices of the extruded shape. Each vertex can be moved freely in 3D space by clicking and dragging the vertex handles.

- Visual Cues: The application provides visual cues by enabling/disabling buttons based on the current mode and interaction state.

## How to Run the code
- You can now test the code by opening index.html in a web browser.

## Author
- Tanvi Shah    
