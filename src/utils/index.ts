import {Box, Vec3, Sphere, Cylinder, Plane, Trimesh, ConvexPolyhedron} from 'cannon-es'
import {Vector3, BufferGeometry, BufferAttribute, Mesh, MeshBasicMaterial} from 'three'

export const createCollisionShape = (geometry) => {
    let shape;
    if (geometry.isBoxGeometry) {
        const size = new Vector3();
        geometry.computeBoundingBox();
        geometry.boundingBox.getSize(size);
        const halfSize = size.clone().multiplyScalar(0.5);
        shape = new Box(new Vec3(halfSize.x, halfSize.y, halfSize.z));
    } else if (geometry.isSphereGeometry) {
        const radius = geometry.parameters.radius;
        shape = new Sphere(radius);
    } else if (geometry.isCylinderGeometry) {
        const radiusTop = geometry.parameters.radiusTop;
        const radiusBottom = geometry.parameters.radiusBottom;
        const height = geometry.parameters.height;
        shape = new Cylinder(radiusTop, radiusBottom, height, 16);
    } else if (geometry.isPlaneGeometry) {
        // 创建一个无限大的平面形状
        shape = new Plane();
    } else {
        // 默认情况下，使用包围盒作为碰撞形状
        const size = new Vector3();
        geometry.computeBoundingBox();
        geometry.boundingBox.getSize(size);
        const halfSize = size.clone();
        shape = new Box(new Vec3(halfSize.x / 2, halfSize.y / 2, halfSize.z / 2));
    }
    return shape
}

export const createBoundingBoxShape = (geometry, scale) => {
    geometry.scale(scale.x, scale.y, scale.z);
    geometry.computeBoundingBox();

    const {min, max} = geometry.boundingBox;
    const size = new Vec3(
        (max.x - min.x) * 0.5 * scale.x,
        (max.y - min.y) * 0.5 * scale.y,
        (max.z - min.z) * 0.5 * scale.z
    );

    const shape = new Box(size);
    return shape;
}

export const createConvexPolyhedron = (geometry) => {
    // 提取几何体的顶点和面数据

    const positionBuffer = geometry.getAttribute('position');
    const vertices = positionBuffer.array;
    const verticesVec3 = []

    // 遍历顶点数据
    for (let i = 0; i < positionBuffer.count; i++) {
        const x = vertices[i * positionBuffer.itemSize];         // x 坐标
        const y = vertices[i * positionBuffer.itemSize + 1];     // y 坐标
        const z = vertices[i * positionBuffer.itemSize + 2];     // z 坐标

        // 处理顶点数据
        verticesVec3.push(new Vec3(x, y, z))
    }

    // 获取面数据
    const indexAttribute = geometry.getIndex();
    const indices = indexAttribute.array;
    const faces = []

    // 遍历面数据
    for (let i = 0; i < indexAttribute.count; i += 3) {
        const vertexAIndex = indices[i];
        const vertexBIndex = indices[i + 1];
        const vertexCIndex = indices[i + 2];

        // 处理面数据
        faces.push([vertexAIndex, vertexBIndex, vertexCIndex])
    }

    // 输出调试信息
    console.log('顶点数据:', verticesVec3);
    console.log('面数据:', faces);

    // 创建近似形状的凸多面体
    const shape = new ConvexPolyhedron(verticesVec3, faces);
    return shape
}

export const test = (geometry) => {
    const positionAttribute = geometry.getAttribute('position');
    const vertices = positionAttribute.array;

    const indexAttribute = geometry.getIndex();
    const indices = indexAttribute.array;

    const verticesVec3 = [];
    const faces = [];

    for (let i = 0; i < indices.length; i += 3) {
        const vertexAIndex = indices[i];
        const vertexBIndex = indices[i + 1];
        const vertexCIndex = indices[i + 2];

        const vertexA = new Vec3(
            vertices[vertexAIndex * 3],
            vertices[vertexAIndex * 3 + 1],
            vertices[vertexAIndex * 3 + 2]
        );
        const vertexB = new Vec3(
            vertices[vertexBIndex * 3],
            vertices[vertexBIndex * 3 + 1],
            vertices[vertexBIndex * 3 + 2]
        );
        const vertexC = new Vec3(
            vertices[vertexCIndex * 3],
            vertices[vertexCIndex * 3 + 1],
            vertices[vertexCIndex * 3 + 2]
        );

        verticesVec3.push(vertexA, vertexC, vertexB); // 修改顶点的顺序

        faces.push([
            verticesVec3.length - 3,
            verticesVec3.length - 2,
            verticesVec3.length - 1
        ]);
    }

    // 创建凸多边形形状
    const convexShape = new ConvexPolyhedron({ vertices: verticesVec3, faces });
    return convexShape;
};


// 可行就是太卡
export const createShapeFromMesh = (geometry, scale) => {
    geometry.scale(scale.x, scale.y, scale.z);
    geometry.computeBoundingBox();

    const vertices = [];
    const indices = [];

    // 提取顶点数据
    const positions = geometry.getAttribute('position').array;
    for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i] * scale.x;
        const y = positions[i + 1] * scale.y;
        const z = positions[i + 2] * scale.z;
        vertices.push(x, y, z);
    }


    // 提取索引数据
    const indexAttribute = geometry.getIndex();
    if (indexAttribute) {
        const indicesArray = indexAttribute.array;
        for (let i = 0; i < indicesArray.length; i += 3) {
            const a = indicesArray[i];
            const b = indicesArray[i + 1];
            const c = indicesArray[i + 2];
            indices.push(a, b, c);
        }
    } else {
        for (let i = 0; i < positions.length / 3; i += 3) {
            indices.push(i, i + 1, i + 2);
        }
    }

    // 创建自定义形状
    const shape = new Trimesh(vertices, indices);
    // const shape = new CANNON.ConvexPolyhedron(vertices, indices);

    return shape;
}
