
const CYLINDER_POINT_COUNT = 20;

let gl;
let sphereArray = [];
let canvas = document.getElementById("webgl");
let program = 0;
let vertexShader = "precision mediump float;\n" +
    "attribute vec3 a_Position;\n" +
    "attribute vec4 a_Color;\n" +
    "attribute vec3 a_Normal;\n" +
    "varying vec4 v_Color;\n" +
    "varying vec4 v_Normal;\n" +
    "\n" +
    "uniform mat4 u_Model;\n" +
    "uniform mat4 u_WorldRotation;\n" +
    "uniform mat4 u_World;\n" +
    "uniform mat4 u_View;\n" +
    "uniform mat4 u_Camera;\n" +
    "uniform mat4 u_Projection;\n" +
    "\n" +
    "void main() {\n" +
    "\tvec4 temp_position = vec4(a_Position, 1.0);\n" +
    "\tgl_Position = u_Projection * u_Camera * u_View * u_World * u_Model * temp_position;\n" +
    "\tv_Color = a_Color;\n" +
    "\tv_Normal = u_WorldRotation * u_Model * vec4(a_Normal, 1);\n" +
    "}";
let fragmentShader = "precision mediump float;\n" +
    "\n" +
    "varying vec4 v_Color;\n" +
    "varying vec4 v_Normal;\n" +
    "\n" +
    "uniform vec3 u_LightDirection;\n" +
    "uniform vec3 u_LightColor;\n" +
    "uniform vec3 u_AmbientLight;\n" +
    "\n" +
    "void main() {\n" +
    "    vec3 light = normalize(u_LightDirection);\n" +
    "    vec3 normal = normalize(v_Normal.xyz);\n" +
    "    vec3 diffuse = (max(dot(light, normal), 0.0)) * u_LightColor;\n" +
    "    vec3 color = v_Color.xyz;\n" +
    "\tgl_FragColor = vec4((u_AmbientLight + diffuse) * color ,v_Color.w);\n" +
    "}\n";

let rightLeftAxis = 0;
let frontBackAxis = 0;
let rollSpeed = 0.1;
let moveSpeed = 0.005;

let lightDirection = [-1, 1, -1];
let lightColor = [1, 1, 1];
let ambientLight = [0.2, 0.2, 0.2];

let cameraYew = 0;
let cameraTilt = 0;
let cameraPos = [0, 0, 0];
let cameraDirection = [0, 0 ,-1];
let cameraRight = [1, 0, 0];
let upVector = [0, 1, 0];

let cameraMoveSpeed = 0.005;
let lastMouseX = canvas.width/2, lastMouseY = canvas.height/2;
let cameraForwardAxis = 0, cameraRightAxis = 0;

let cameraMatrix = new Matrix4();

let lastTick = Date.now();

document.addEventListener('keydown', function (event) {
    // console.log(event.key);
    switch (event.key) {
        case "k":
            frontBackAxis = 1;
            break;
        case "i":
            frontBackAxis = -1;
            break;
        case "j":
            rightLeftAxis = -1;
            break;
        case "l":
            rightLeftAxis = 1;
            break;
        case "a":
            cameraRightAxis = -1;
            break;
        case "d":
            cameraRightAxis = 1;
            break;
        case "s":
            cameraForwardAxis = -1;
            break;
        case "w":
            cameraForwardAxis = 1;
            break;
        default:
            return; // Quit when this doesn't handle the key event.
    }
});

document.addEventListener('keyup', function (event) {
    // console.log(event.key);
    switch (event.key) {
        case "k":
            frontBackAxis = 0;
            break;
        case "i":
            frontBackAxis = 0;
            break;
        case "j":
            rightLeftAxis = 0;
            break;
        case "l":
            rightLeftAxis = 0;
            break;
        case "a":
            cameraRightAxis = 0;
            break;
        case "d":
            cameraRightAxis = 0;
            break;
        case "s":
            cameraForwardAxis = 0;
            break;
        case "w":
            cameraForwardAxis = 0;
            break;
        default:
            return; // Quit when this doesn't handle the key event.
    }
});

canvas.addEventListener('mousemove', function (event) {
    cameraYew += -(event.clientX - lastMouseX) / canvas.width * 90;
    cameraTilt += -(event.clientY - lastMouseY) / canvas.height * 90;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
    console.log(cameraYew);
    console.log(cameraTilt);
});

// canvas.addEventListener('mouseenter', function (event) {
//     lastMouseX = event.clientX;
//     lastMouseY = event.clientY;
// });

function drawTest() {
    gl = getWebGLContext(canvas, true);
    if (!gl) {
        alert("Failed at getWebGLContext");
        return;
    }
    // tree = new FractalTree([0.164, 0.349, 0.149], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0], 1.0, 0, 4, 5, 60 ,0.75, 0.035);
    sphereArray.push(new Sphere([2, 2, 0], 90, 100, 49, [1, 0, 0], [0, 1, 0]));
    sphereArray.push(new Sphere([2, 0, 0], 0, 100, 49, [0.482, 0.176, 0.705], [0.945, 0.964, 0.137]));
    // let view = new Matrix4();
    // view.setTranslate(0, 0, -5);
    // view.rotate(-90, 1, 0, 0);
    // let projection = new Matrix4();
    // projection.setPerspective(45, canvas.width / canvas.height, 0.1, 100);
    //
    // gl.clearColor(0.8, 0.8, 0.8, 1.0);
    // gl.clear(gl.COLOR_BUFFER_BIT);
    //
    // draw(view, projection);
    drawLoop();
    let a = new Matrix4().setLookAt()
}

function drawLoop() {
    let view = new Matrix4();
    view.setTranslate(0, -0.5, -10);
    view.rotate(-90, 1, 0, 0);
    let projection = new Matrix4();
    projection.setPerspective(45, canvas.width / canvas.height, 0.1, 100);

    let currTime = Date.now();
    let deltaTime = currTime - lastTick;
    lastTick = currTime;

    let directionVec = new Vector4([cameraDirection[0], cameraDirection[1], cameraDirection[2], 0]);
    let rightVec = new Vector4([cameraRight[0], cameraRight[1], cameraRight[2], 0]);
    let upVec = new Vector4([upVector[0], upVector[1], upVector[2], 0]);
    let cameraRotationMatrix = new Matrix4().setRotate(cameraYew, 0, 1, 0);
    cameraRotationMatrix.rotate(cameraTilt, 1, 0, 0);
    directionVec = cameraRotationMatrix.multiplyVector4(directionVec);
    rightVec = cameraRotationMatrix.multiplyVector4(rightVec);
    upVec = cameraRotationMatrix.multiplyVector4(upVec);


    let cameraTranslationMatrix = new Matrix4().setTranslate(
        cameraForwardAxis * cameraMoveSpeed * deltaTime * directionVec.elements[0],
        cameraForwardAxis * cameraMoveSpeed * deltaTime * directionVec.elements[1],
        cameraForwardAxis * cameraMoveSpeed * deltaTime * directionVec.elements[2]);
    cameraTranslationMatrix.translate(
        cameraRightAxis * cameraMoveSpeed * deltaTime * rightVec.elements[0],
        cameraRightAxis * cameraMoveSpeed * deltaTime * rightVec.elements[1],
        cameraRightAxis * cameraMoveSpeed * deltaTime * rightVec.elements[2]);
    let cameraPosVector = new Vector4([cameraPos[0], cameraPos[1], cameraPos[2], 1]);
    cameraPosVector = cameraTranslationMatrix.multiplyVector4(cameraPosVector);
    cameraPos = [cameraPosVector.elements[0], cameraPosVector.elements[1], cameraPosVector.elements[2]];
    console.log(cameraPos);
    console.log(directionVec.elements);

    cameraMatrix.setLookAt(cameraPos[0], cameraPos[1], cameraPos[2], cameraPos[0] + directionVec.elements[0],
        cameraPos[1] + directionVec.elements[1], cameraPos[2] + directionVec.elements[2],
        upVec.elements[0], upVec.elements[1], upVec.elements[2]);

    gl.clearColor(0.8, 0.8, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (let i = 0; i < sphereArray.length; i++) {
        let sphere = sphereArray[i];
        sphere.worldMatrix.translate(0, -moveSpeed * deltaTime * frontBackAxis, 0);
        sphere.worldMatrix.translate( moveSpeed * deltaTime * rightLeftAxis, 0, 0);
        // if (i === 0)
        //     console.log(sphere.worldMatrix.elements);
        let invertRotation = new Matrix4().setInverseOf(sphere.modelMatrix);
        let frontBackRot = invertRotation.multiplyVector4(new Vector4([1, 0, 0, 1]));
        sphere.modelMatrix.rotate(rollSpeed * deltaTime * frontBackAxis, frontBackRot.elements[0], frontBackRot.elements[1], frontBackRot.elements[2]);
        invertRotation = new Matrix4().setInverseOf(sphere.modelMatrix);
        let rightLeftRot = invertRotation.multiplyVector4(new Vector4([0, 1, 0, 1]));
        sphere.modelMatrix.rotate(rollSpeed * deltaTime * rightLeftAxis, rightLeftRot.elements[0], rightLeftRot.elements[1], rightLeftRot.elements[2]);



        draw(sphere, view, projection);
    }

    requestAnimationFrame(drawLoop);
}

function draw(sphere, viewMatrix , projectionMatrix){
    // this.drawProgram = createProgram(gl, this.vertexShader, this.fragmentShader);
    program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);
    gl.enable(gl.DEPTH_TEST);
    let vertices = new Float32Array(sphere.triangleDataArray);
    let FSIZE = vertices.BYTES_PER_ELEMENT;
    let verticesBuffer = gl.createBuffer();


    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    let a_Position = gl.getAttribLocation(program, 'a_Position');
    let a_Color = gl.getAttribLocation(program, 'a_Color');
    let a_Normal = gl.getAttribLocation(program, 'a_Normal');

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 10 * FSIZE, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 10 * FSIZE, 3 * FSIZE);
    gl.enableVertexAttribArray(a_Color);
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 10 * FSIZE, 7 * FSIZE);
    gl.enableVertexAttribArray(a_Normal);

    let u_Model = gl.getUniformLocation(program, 'u_Model');
    let u_World = gl.getUniformLocation(program, 'u_World');
    let u_WorldRotation = gl.getUniformLocation(program, 'u_WorldRotation');
    let u_View = gl.getUniformLocation(program, 'u_View');
    let u_Camera = gl.getUniformLocation(program, 'u_Camera');
    let u_Projection = gl.getUniformLocation(program, 'u_Projection');
    let u_AmbientLight = gl.getUniformLocation(program, 'u_AmbientLight');
    let u_LightColor = gl.getUniformLocation(program, 'u_LightColor');
    let u_LightDirection = gl.getUniformLocation(program, 'u_LightDirection');

    let worldRotation = new Matrix4(sphere.worldMatrix);
    worldRotation.elements[12] = 0;
    worldRotation.elements[13] = 0;
    worldRotation.elements[14] = 0;
    worldRotation.elements[15] = 1;
    // console.log(worldRotation.elements);

    gl.uniformMatrix4fv(u_Model, false, sphere.modelMatrix.elements);
    gl.uniformMatrix4fv(u_World, false, sphere.worldMatrix.elements);
    gl.uniformMatrix4fv(u_WorldRotation, false, worldRotation.elements);
    gl.uniformMatrix4fv(u_View, false, viewMatrix.elements);
    gl.uniformMatrix4fv(u_Camera, false, cameraMatrix.elements);
    gl.uniformMatrix4fv(u_Projection, false, projectionMatrix.elements);
    gl.uniform3fv(u_AmbientLight, new Float32Array(ambientLight));
    gl.uniform3fv(u_LightColor, new Float32Array(lightColor));
    gl.uniform3fv(u_LightDirection, new Float32Array(lightDirection));
    // console.log(vertices.length);
    gl.drawArrays(gl.TRIANGLES, 0, 3 * sphere.triangleCount);


    gl.disableVertexAttribArray(a_Position);
    gl.disableVertexAttribArray(a_Color);
    gl.disableVertexAttribArray(a_Normal);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.deleteBuffer(verticesBuffer);
    // console.log(vertices);
}


class Sphere{

    constructor(position, rotationDegree, pointsInRow, pointsInCol, bottomColor, topColor) {
        this.position = position;
        this.rotationDegree = rotationDegree;
        this.pointsInRow = pointsInRow;
        this.pointsInCol = pointsInCol;
        this.bottomColor = bottomColor;
        this.topColor = topColor;
        this.triangleDataArray = [];
        this.pointDataArray = [];
        this.modelMatrix = new Matrix4();
        this.worldMatrix = new Matrix4();
        this.triangleCount = 0;
        this.initialize();
    }

    initialize(){
        console.log("started initializing");
        this.modelMatrix = new Matrix4();
        this.worldMatrix = new Matrix4();
        this.worldMatrix.setRotate(this.rotationDegree, 0, 0, 1);
        this.worldMatrix.translate(this.position[0], this.position[1], this.position[2]);
        // console.log(this.worldMatrix.elements);
        this.triangleDataArray = [];
        this.pointDataArray = [];
        this.triangleCount = 0;
        let alphaDisplacement = 2 * Math.PI / this.pointsInRow;
        let betaDisplacement = Math.PI / this.pointsInCol;
        let beta = -Math.PI/2;
        let alpha = 0;
        let cosBeta = 0;
        for (let i = 0; i < this.pointsInCol + 1; i++) {
            // console.log(i);
            this.pointDataArray.push([]);
            cosBeta = Math.cos(beta);
            alpha = 0;
            let currentRowColor = [this.bottomColor[0] * (1 -  i/this.pointsInCol) + this.topColor[0] * i/this.pointsInCol,
                this.bottomColor[1] * (1 -  i/this.pointsInCol) + this.topColor[1] * i/this.pointsInCol,
                this.bottomColor[2] * (1 -  i/this.pointsInCol) + this.topColor[2] * i/this.pointsInCol];
            // console.log(currentRowColor);
            for (let j = 0; j < this.pointsInRow; j++) {
                let vertexData = [Math.sin(alpha) * cosBeta, Math.cos(alpha) * cosBeta, Math.sin(beta),
                    currentRowColor[0], currentRowColor[1], currentRowColor[2], 1];
                // if (i === 0) {
                //     vertexData = vertexData.concat([0, 0, -1])
                // } else if (i === this.pointsInCol) {
                //     vertexData = vertexData.concat([0, 0, 1])
                // } else {
                //     if (j === 0) {
                //
                //     }
                // }
                let normalVector = Sphere.findNormalVector([vertexData[0], vertexData[1], vertexData[2]],
                    [Math.sin(alpha) * Math.cos(beta + betaDisplacement), Math.cos(alpha) * Math.cos(beta + betaDisplacement), Math.sin(beta + betaDisplacement)],
                    [Math.sin(alpha) * Math.cos(beta - betaDisplacement), Math.cos(alpha) * Math.cos(beta - betaDisplacement), Math.sin(beta - betaDisplacement)],
                    [Math.sin(alpha - alphaDisplacement) * Math.cos(beta), Math.cos(alpha - alphaDisplacement) * Math.cos(beta), Math.sin(beta)],
                    [Math.sin(alpha + alphaDisplacement) * Math.cos(beta), Math.cos(alpha + alphaDisplacement) * Math.cos(beta), Math.sin(beta)]
                );
                // if (i === this.pointsInCol)
                //     console.log(normalVector);
                vertexData.push(normalVector[0], normalVector[1], normalVector[2]);
                this.pointDataArray[i].push(vertexData);
                alpha = alpha + alphaDisplacement;
            }
            beta = beta + betaDisplacement
        }
        let topSidedTriangle = [];
        let botSidedTriangle = [];

        for (let col = 0; col < this.pointsInCol; col++){
            // console.log(col);
            let row = 0;
            for (row = 0; row < this.pointsInRow - 1; row++){
                topSidedTriangle = [];
                Array.prototype.push.apply(topSidedTriangle, this.pointDataArray[col][row]);
                Array.prototype.push.apply(topSidedTriangle, this.pointDataArray[col + 1][row]);
                Array.prototype.push.apply(topSidedTriangle, this.pointDataArray[col][row + 1]);
                botSidedTriangle = [];
                Array.prototype.push.apply(botSidedTriangle, this.pointDataArray[col][row + 1]);
                Array.prototype.push.apply(botSidedTriangle, this.pointDataArray[col + 1][row]);
                Array.prototype.push.apply(botSidedTriangle, this.pointDataArray[col + 1][row + 1]);
                this.triangleCount = this.triangleCount + 2;
                Array.prototype.push.apply(this.triangleDataArray, topSidedTriangle);
                Array.prototype.push.apply(this.triangleDataArray, botSidedTriangle);
            }
            topSidedTriangle = [];
            Array.prototype.push.apply(topSidedTriangle, this.pointDataArray[col][row]);
            Array.prototype.push.apply(topSidedTriangle, this.pointDataArray[col + 1][row]);
            Array.prototype.push.apply(topSidedTriangle, this.pointDataArray[col][0]);
            botSidedTriangle = [];
            Array.prototype.push.apply(botSidedTriangle, this.pointDataArray[col][0]);
            Array.prototype.push.apply(botSidedTriangle, this.pointDataArray[col + 1][row]);
            Array.prototype.push.apply(botSidedTriangle, this.pointDataArray[col + 1][0]);
            this.triangleCount = this.triangleCount + 2;
            Array.prototype.push.apply(this.triangleDataArray, topSidedTriangle);
            Array.prototype.push.apply(this.triangleDataArray, botSidedTriangle);
        }
        // console.log(this.triangleDataArray.slice(29900, 30000));
        console.log("initialized");
    }

    static findNormalVector(center, up, down, left, right){
        let upVec = [up[0] - center[0], up[1] - center[1], up[2] - center[2]];
        let downVec = [down[0] - center[0], down[1] - center[1], down[2] - center[2]];
        let leftVec = [left[0] - center[0], left[1] - center[1], left[2] - center[2]];
        let rightVec = [right[0] - center[0], right[1] - center[1], right[2] - center[2]];
        let rightUpNormal = Sphere.cross(rightVec, upVec);
        let upLeftNormal = Sphere.cross(upVec, leftVec);
        let leftDownNormal = Sphere.cross(leftVec, downVec);
        let downRightNormal = Sphere.cross(downVec, rightVec);
        return new Vector3([(rightUpNormal[0] + upLeftNormal[0] + leftDownNormal[0] + downRightNormal[0]) / 4,
            (rightUpNormal[1] + upLeftNormal[1] + leftDownNormal[1] + downRightNormal[1]) / 4,
            (rightUpNormal[2] + upLeftNormal[2] + leftDownNormal[2] + downRightNormal[2]) / 4]).normalize().elements;
    }

    static cross(A, B){
        return [A[1]*B[2] - A[2]*B[1], A[2]*B[0] - A[0]*B[2], A[0]*B[1] - A[1]*B[0]];
    }
}
//
//
// class FractalTree{
//     constructor(treeColor, startPosition, direction, length, currentIndex, maxIndex, branchCount, outDegree, lengthShrinkMultiplicand, thickness) {
//         this.vertexShader =
//             'precision mediump float;\n' +
//             'attribute vec3 a_Position;\n' +
//             'uniform float u_PointSize;\n' +
//             '\n' +
//             'uniform mat4 u_Model;\n' +
//             'uniform mat4 u_View;\n' +
//             'uniform mat4 u_Projection;\n' +
//             '        \n' +
//             'varying vec2 v_TexCoord;\n' +
//             '        \n' +
//             'void main() {\n' +
//             '    gl_Position = u_Projection * u_View * u_Model * vec4(a_Position, 1.0);\n' +
//             '    gl_PointSize = u_PointSize;\n' +
//             '}';
//         this.fragmentShader =
//             'precision mediump float;\n' +
//             'uniform vec4 u_Color;\n' +
//             '\n' +
//             'void main() {\n' +
//             '    gl_FragColor = u_Color;\n' +
//             '}\n';
//         this.treeColor = treeColor;
//         this.startPosition = new Vector3(startPosition);
//         this.direction = new Vector3(direction).normalize();
//         this.length = length;
//         this.currentIndex = currentIndex;
//         this.maxIndex = maxIndex;
//         this.branchCount = branchCount;
//         this.outDegree = outDegree;
//         this.thickness = thickness;
//         this.drawProgram = 0;
//         this.childBranches = [];
//         this.perpendicularVector = null;
//         this.otherPrependicularVector = null;
//         if(direction[1] !== direction[2] || direction[2] !== direction[3] || direction[1] !== direction[3]) {
//             this.perpendicularVector = new Vector3([direction[1] - direction[2], direction[2] - direction[0], direction[0] - direction[1]]).normalize();
//         }
//         else {
//             this.perpendicularVector = new Vector3([direction[1] + direction[2], direction[2] - direction[0], -direction[0] - direction[1]]).normalize();
//         }
//         let a = [0, direction[0], direction[1], direction[2]];
//         let b = [0, this.perpendicularVector.elements[0], this.perpendicularVector.elements[1], this.perpendicularVector.elements[2]];
//         this.otherPrependicularVector = new Vector3([ a[2] * b[3] - a[3] * b[2], a[3] * b[1] - a[1] * b[3], a[1] * b[2] - a[2] * b[1]]).normalize();
//         let perpendicularRotationMatrix = new Matrix4().setRotate(outDegree, this.perpendicularVector.elements[0], this.perpendicularVector.elements[1], this.perpendicularVector.elements[2]);
//         let parallelRotationMatrix = new Matrix4().setRotate(360.0 / branchCount, this.direction.elements[0], this.direction.elements[1], this.direction.elements[2]);
//         if(currentIndex < maxIndex){
//             let finalPoint = [startPosition[0] + this.direction.elements[0] * length, startPosition[1] + this.direction.elements[1] * length, startPosition[2] + this.direction.elements[2] * length];
//             let bentDirection = perpendicularRotationMatrix.multiplyVector4(new Vector4([this.direction.elements[0], this.direction.elements[1], this.direction.elements[2], 1.0]));
//             for (let i = 0; i < branchCount; i++){
//                 bentDirection = parallelRotationMatrix.multiplyVector4(bentDirection);
//                 let tempArray = new Vector3([bentDirection.elements[0], bentDirection.elements[1], bentDirection.elements[2]]).normalize().elements;
//                 bentDirection = new Vector4([tempArray[0], tempArray[1], tempArray[2], 1.0]);
//                 let elements = new Float32Array(bentDirection.elements);
//                 this.childBranches[i] = new FractalTree(treeColor, finalPoint, elements, length * lengthShrinkMultiplicand, currentIndex + 1, maxIndex, branchCount, outDegree, lengthShrinkMultiplicand, thickness);
//             }
//         }
//     }
//
//     getVertexData(){
//         let finalPoint = [this.startPosition.elements[0] + this.direction.elements[0] * this.length,
//             this.startPosition.elements[1] + this.direction.elements[1] * this.length,
//             this.startPosition.elements[2] + this.direction.elements[2] * this.length];
//         let startPoint = [this.startPosition.elements[0], this.startPosition.elements[1], this.startPosition.elements[2]];
//         let thickHorizontalVector = [this.perpendicularVector.elements[0], this.perpendicularVector.elements[1], this.perpendicularVector.elements[2]];
//         let thickVerticalVector = [this.otherPrependicularVector.elements[0], this.otherPrependicularVector.elements[1], this.otherPrependicularVector.elements[2]];
//         // let vertices =[
//         //     startPoint[0] + (thickHorizontalVector[0] + thickVerticalVector[0]) * this.thickness * (1 - (this.currentIndex * 2) / (2 * this.maxIndex + 1)),
//         //     startPoint[1] + (thickHorizontalVector[1] + thickVerticalVector[1]) * this.thickness * (1 - (this.currentIndex * 2) / (2 * this.maxIndex + 1)),
//         //     startPoint[2] + (thickHorizontalVector[2] + thickVerticalVector[2]) * this.thickness * (1 - (this.currentIndex * 2) / (2 * this.maxIndex + 1)),
//         //
//         //     finalPoint[0] + this.thickness * (1 - (this.currentIndex * 2 + 1) / (2 * this.maxIndex + 1)) * (thickHorizontalVector[0] + thickVerticalVector[0]),
//         //     finalPoint[1] + this.thickness * (1 - (this.currentIndex * 2 + 1) / (2 * this.maxIndex + 1)) * (thickHorizontalVector[1] + thickVerticalVector[1]),
//         //     finalPoint[2] + this.thickness * (1 - (this.currentIndex * 2 + 1) / (2 * this.maxIndex + 1)) * (thickHorizontalVector[2] + thickVerticalVector[2]),
//         //
//         //     startPoint[0] + (thickHorizontalVector[0] - thickVerticalVector[0]) * this.thickness * (1 - (this.currentIndex * 2) / (2 * this.maxIndex + 1)),
//         //     startPoint[1] + (thickHorizontalVector[1] - thickVerticalVector[1]) * this.thickness * (1 - (this.currentIndex * 2) / (2 * this.maxIndex + 1)),
//         //     startPoint[2] + (thickHorizontalVector[2] - thickVerticalVector[2]) * this.thickness * (1 - (this.currentIndex * 2) / (2 * this.maxIndex + 1)),
//         //
//         //     finalPoint[0] + this.thickness * (1 - (this.currentIndex * 2 + 1) / (2 * this.maxIndex + 1)) * (thickHorizontalVector[0] - thickVerticalVector[0]),
//         //     finalPoint[1] + this.thickness * (1 - (this.currentIndex * 2 + 1) / (2 * this.maxIndex + 1)) * (thickHorizontalVector[1] - thickVerticalVector[1]),
//         //     finalPoint[2] + this.thickness * (1 - (this.currentIndex * 2 + 1) / (2 * this.maxIndex + 1)) * (thickHorizontalVector[2] - thickVerticalVector[2]),
//         //
//         //     startPoint[0] + (- thickHorizontalVector[0] - thickVerticalVector[0]) * this.thickness * (1 - (this.currentIndex * 2) / (2 * this.maxIndex + 1)),
//         //     startPoint[1] + (- thickHorizontalVector[1] - thickVerticalVector[1]) * this.thickness * (1 - (this.currentIndex * 2) / (2 * this.maxIndex + 1)),
//         //     startPoint[2] + (- thickHorizontalVector[2] - thickVerticalVector[2]) * this.thickness * (1 - (this.currentIndex * 2) / (2 * this.maxIndex + 1)),
//         //
//         //     finalPoint[0] + this.thickness * (1 - (this.currentIndex * 2 + 1) / (2 * this.maxIndex + 1)) * (- thickHorizontalVector[0] - thickVerticalVector[0]),
//         //     finalPoint[1] + this.thickness * (1 - (this.currentIndex * 2 + 1) / (2 * this.maxIndex + 1)) * (- thickHorizontalVector[1] - thickVerticalVector[1]),
//         //     finalPoint[2] + this.thickness * (1 - (this.currentIndex * 2 + 1) / (2 * this.maxIndex + 1)) * (- thickHorizontalVector[2] - thickVerticalVector[2]),
//         //
//         //     startPoint[0] + (- thickHorizontalVector[0] + thickVerticalVector[0]) * this.thickness * (1 - (this.currentIndex * 2) / (2 * this.maxIndex + 1)),
//         //     startPoint[1] + (- thickHorizontalVector[1] + thickVerticalVector[1]) * this.thickness * (1 - (this.currentIndex * 2) / (2 * this.maxIndex + 1)),
//         //     startPoint[2] + (- thickHorizontalVector[2] + thickVerticalVector[2]) * this.thickness * (1 - (this.currentIndex * 2) / (2 * this.maxIndex + 1)),
//         //
//         //     finalPoint[0] + this.thickness * (1 - (this.currentIndex * 2 + 1) / (2 * this.maxIndex + 1)) * (- thickHorizontalVector[0] + thickVerticalVector[0]),
//         //     finalPoint[1] + this.thickness * (1 - (this.currentIndex * 2 + 1) / (2 * this.maxIndex + 1)) * (- thickHorizontalVector[1] + thickVerticalVector[1]),
//         //     finalPoint[2] + this.thickness * (1 - (this.currentIndex * 2 + 1) / (2 * this.maxIndex + 1)) * (- thickHorizontalVector[2] + thickVerticalVector[2]),
//         //
//         //     startPoint[0] + (thickHorizontalVector[0] + thickVerticalVector[0]) * this.thickness * (1 - (this.currentIndex * 2) / (2 * this.maxIndex + 1)),
//         //     startPoint[1] + (thickHorizontalVector[1] + thickVerticalVector[1]) * this.thickness * (1 - (this.currentIndex * 2) / (2 * this.maxIndex + 1)),
//         //     startPoint[2] + (thickHorizontalVector[2] + thickVerticalVector[2]) * this.thickness * (1 - (this.currentIndex * 2) / (2 * this.maxIndex + 1)),
//         //
//         //     finalPoint[0] + this.thickness * (1 - (this.currentIndex * 2 + 1) / (2 * this.maxIndex + 1)) * (thickHorizontalVector[0] + thickVerticalVector[0]),
//         //     finalPoint[1] + this.thickness * (1 - (this.currentIndex * 2 + 1) / (2 * this.maxIndex + 1)) * (thickHorizontalVector[1] + thickVerticalVector[1]),
//         //     finalPoint[2] + this.thickness * (1 - (this.currentIndex * 2 + 1) / (2 * this.maxIndex + 1)) * (thickHorizontalVector[2] + thickVerticalVector[2]),
//         //
//         // ];
//         let vertices = [];
//         for(let i = 0; i <= CYLINDER_POINT_COUNT; i++){
//             vertices[i * 6] = startPoint[0] + (Math.sin(i * Math.PI / CYLINDER_POINT_COUNT * 2) * thickHorizontalVector[0] + Math.cos(i * Math.PI / CYLINDER_POINT_COUNT * 2) * thickVerticalVector[0]) * this.thickness * (1 - (this.currentIndex * 2) / (2 * this.maxIndex + 1));
//             vertices[i * 6 + 1] = startPoint[1] + (Math.sin(i * Math.PI / CYLINDER_POINT_COUNT * 2) * thickHorizontalVector[1] + Math.cos(i * Math.PI / CYLINDER_POINT_COUNT * 2) * thickVerticalVector[1]) * this.thickness * (1 - (this.currentIndex * 2) / (2 * this.maxIndex + 1));
//             vertices[i * 6 + 2] = startPoint[2] + (Math.sin(i * Math.PI / CYLINDER_POINT_COUNT * 2) * thickHorizontalVector[2] + Math.cos(i * Math.PI / CYLINDER_POINT_COUNT * 2) * thickVerticalVector[2]) * this.thickness * (1 - (this.currentIndex * 2) / (2 * this.maxIndex + 1));
//
//             vertices[i * 6 + 3] = finalPoint[0] + this.thickness * (1 - (this.currentIndex * 2 + 1) / (2 * this.maxIndex + 1)) * (Math.sin(i * Math.PI / CYLINDER_POINT_COUNT * 2) * thickHorizontalVector[0] + Math.cos(i * Math.PI / CYLINDER_POINT_COUNT * 2) * thickVerticalVector[0]);
//             vertices[i * 6 + 4] = finalPoint[1] + this.thickness * (1 - (this.currentIndex * 2 + 1) / (2 * this.maxIndex + 1)) * (Math.sin(i * Math.PI / CYLINDER_POINT_COUNT * 2) * thickHorizontalVector[1] + Math.cos(i * Math.PI / CYLINDER_POINT_COUNT * 2) * thickVerticalVector[1]);
//             vertices[i * 6 + 5] = finalPoint[2] + this.thickness * (1 - (this.currentIndex * 2 + 1) / (2 * this.maxIndex + 1)) * (Math.sin(i * Math.PI / CYLINDER_POINT_COUNT * 2) * thickHorizontalVector[2] + Math.cos(i * Math.PI / CYLINDER_POINT_COUNT * 2) * thickVerticalVector[2]);
//         }
//         if(this.currentIndex < this.maxIndex){
//             for (let i = 0; i < this.branchCount; i++){
//                 let data = this.childBranches[i].getVertexData();
//                 for(let j = 0; j < data.length; j++) {
//                     vertices.push(data[j]);
//                 }
//             }
//         }
//         return new Float32Array(vertices);
//     }
//
//     draw(gl, modelMatrix, viewMatrix, projectionMatrix){
//         this.drawProgram = createProgram(gl, this.vertexShader, this.fragmentShader);
//         gl.useProgram(this.drawProgram);
//         gl.enable(gl.DEPTH_TEST);
//         let vertices = this.getVertexData();
//         let FSIZE = vertices.BYTES_PER_ELEMENT;
//         let verticesBuffer = gl.createBuffer();
//
//
//         gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
//         gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
//
//         let a_Position = gl.getAttribLocation(this.drawProgram, 'a_Position');
//         let u_PointSize = gl.getUniformLocation(this.drawProgram, 'u_PointSize');
//         let u_Color = gl.getUniformLocation(this.drawProgram, 'u_Color');
//
//         gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
//         gl.enableVertexAttribArray(a_Position);
//         gl.uniform1f(u_PointSize, 5);
//         gl.uniform4f(u_Color, this.treeColor[0], this.treeColor[1], this.treeColor[2], 1.0); //Dark Green
//
//         let u_Model = gl.getUniformLocation(this.drawProgram, 'u_Model');
//         let u_View = gl.getUniformLocation(this.drawProgram, 'u_View');
//         let u_Projection = gl.getUniformLocation(this.drawProgram, 'u_Projection');
//
//         gl.uniformMatrix4fv(u_Model, false, modelMatrix.elements);
//         gl.uniformMatrix4fv(u_View, false, viewMatrix.elements);
//         gl.uniformMatrix4fv(u_Projection, false, projectionMatrix.elements);
//         // console.log(vertices.length);
//         for(let i = 0 ; i < vertices.length / (6 * (CYLINDER_POINT_COUNT + 1)) ; i++) {
//             gl.drawArrays(gl.TRIANGLE_STRIP, i * 2 * (CYLINDER_POINT_COUNT + 1), 2 * (CYLINDER_POINT_COUNT + 1));
//         }
//
//         gl.disableVertexAttribArray(a_Position);
//         gl.bindBuffer(gl.ARRAY_BUFFER, null);
//         gl.deleteBuffer(verticesBuffer);
//         // console.log(vertices);
//     }
// }
