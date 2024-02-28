precision lowp float;

varying vec2 vUv;

uniform float uTime;

#define PI 3.14

// 随机函数
float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

// 旋转函数
vec2 rotate(vec2 uv, float rotation, vec2 mid) {
    return vec2(
    cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
    cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

// 噪声函数
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
    (c - a)* u.y * (1.0 - u.x) +
    (d - b) * u.x * u.y;
}


vec4 permute(vec4 x) {
    return mod(((x * 34.0) + 1.0) * x, 289.0);
}

vec2 fade(vec2 t) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}


// 经典柏林噪声函数
// https://blog.csdn.net/qq_28299311/article/details/103654190
float cnoise(vec2 P){
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0);// To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0;// 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x, gy.x);
    vec2 g10 = vec2(gx.y, gy.y);
    vec2 g01 = vec2(gx.z, gy.z);
    vec2 g11 = vec2(gx.w, gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

// tips 重复：mod，波浪：sin

void main() {
    // 1通过顶点对应的uv，决定每一个元素在uv图像的位置，通过这个位置x,y决定颜色
    // gl_FragColor = vec4(vUv, 0.0, 1.0);

    // 2对第一种变形
    // gl_FragColor = vec4(vUv, 1.0, 1.0);

    // 3利于uv实现渐变效果，从左到右
    // float stregth = vUv.x;
    // gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 4利于uv实现渐变效果，从下到上
    // float stregth = vUv.y;
    // gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 5利于uv实现渐变效果，从上到下
    // float stregth = 1.0 - vUv.y;
    // gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 6利于uv实现短范围渐变
    // float stregth = vUv.y * 10.0;
    // gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 7通过取模达到反复效果
    // float stregth = mod(vUv.y * 10.0, 1.0);
    // gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 8利用step(edge, x) 如果x < edge，返回0.0，否则返回1.0
    //   float stregth = mod(vUv.y * 10.0, 1.0);
    //   stregth = step(0.5, stregth);
    //   gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 9利用step(edge, x) 如果x < edge，返回0.0，否则返回1.0
    //   float stregth = mod(vUv.y * 10.0, 1.0);
    //   stregth = step(0.8, stregth);
    //   gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 10利用step(edge, x)，绘制水平条纹 如果x < edge，返回0.0，否则返回1.0
    //   float stregth = mod(vUv.y * 5.0, 1.0);
    //   stregth = step(0.5, stregth);
    //   gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 11利用step(edge, x)，条纹相加 如果x < edge，返回0.0，否则返回1.0
    //   float stregthX = step(0.8, mod(vUv.x * 10.0, 1.0));
    //   float stregthY = step(0.8, mod(vUv.y * 10.0, 1.0));
    //   float stregth = stregthX + stregthY;
    //   gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 12利用step(edge, x)，条纹相加 如果x < edge，返回0.0，否则返回1.0
    //   float stregthX = step(0.8, mod(vUv.x * 10.0, 1.0));
    //   float stregthY = step(0.8, mod(vUv.y * 10.0, 1.0));
    //   float stregth = stregthX + stregthY;
    //   gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 13利用step(edge, x)，条纹相乘 如果x < edge，返回0.0，否则返回1.0
    //   float stregthX = step(0.8, mod(vUv.x * 10.0, 1.0));
    //   float stregthY = step(0.8, mod(vUv.y * 10.0, 1.0));
    //   float stregth = stregthX * stregthY;
    //   gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 14利用step(edge, x)，条纹相减 如果x < edge，返回0.0，否则返回1.0
    //   float stregthX = step(0.8, mod(vUv.x * 10.0, 1.0));
    //   float stregthY = step(0.8, mod(vUv.y * 10.0, 1.0));
    //   float stregth = stregthX - stregthY;
    //   gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 15利用step(edge, x)，条纹相除 如果x < edge，返回0.0，否则返回1.0
    //   float stregthX = step(0.8, mod(vUv.x * 10.0, 1.0));
    //   float stregthY = step(0.8, mod(vUv.y * 10.0, 1.0));
    //   float stregth = stregthX / stregthY;
    //   gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 15利用step(edge, x)，方块 如果x < edge，返回0.0，否则返回1.0
    //   float stregthX = step(0.2, mod(vUv.x * 10.0, 1.0));
    //   float stregthY = step(0.2, mod(vUv.y * 10.0, 1.0));
    //   float stregth = stregthX * stregthY;
    //   gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 15利用step(edge, x)，7形状 如果x < edge，返回0.0，否则返回1.0
    //   float stregthX = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
    //   float stregthY = step(0.4, mod(vUv.y * 10.0, 1.0)) * step(0.8, mod(vUv.x * 10.0, 1.0));
    //   float stregth = stregthX + stregthY;
    //   gl_FragColor = vec4(stregth, stregth, stregth, 1.0);
    //   gl_FragColor = vec4(vUv, 1.0, stregth);

    // 16利用step(edge, x)，T形 如果x < edge，返回0.0，否则返回1.0
    //   float stregthX = step(0.4, mod(vUv.x * 10.0 - 0.2, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
    //   float stregthY = step(0.4, mod(vUv.y * 10.0, 1.0)) * step(0.8, mod(vUv.x * 10.0, 1.0));
    //   float stregth = stregthX + stregthY;
    //   gl_FragColor = vec4(stregth, stregth, stregth, 1.0);
    //   gl_FragColor = vec4(vUv, 1.0, stregth);

    // 17利用绝对值 abs
    //   float stregth = abs(vUv.x - 0.5);
    //   gl_FragColor = vec4(stregth, stregth, stregth, 1.0);


    // 18利用 min 最小值取2个值的最小值
    //   float stregth = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
    //   gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 19利用 min 最大值取2个值的最大值
    //   float stregth = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
    //   gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 20 step
    //   float stregth = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    //   gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 21 小正方形
    //   float stregth = 1.0 - step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    //   gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 22 利用取整，实现条纹渐变
    //   float stregth = floor(vUv.x * 10.0) / 10.0;
    //   gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    //   float stregth = floor(vUv.y * 10.0) / 10.0;
    //   gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 23 利用条纹相乘，实现渐变格子
    //    float stregth = floor(vUv.x * 10.0) / 10.0 * floor(vUv.y * 10.0) / 10.0;
    //    gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 24 利用向上取整
    //      float stregth = ceil(vUv.x * 10.0) / 10.0;
    //      gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 26随机效果
    //      float stregth = random(vUv);
    //      gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 27随机效果 + 随机格子
    //    float stregth = ceil(vUv.x * 10.0) / 10.0 * ceil(vUv.y * 10.0) / 10.0;
    //    stregth = random(vec2(stregth, stregth));
    //    gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 28依据length返回向量长度
    //    float stregth = length(vUv);
    //    gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 29依据distance计算2个向量的距离
    //    float stregth = distance(vUv, vec2(0.5, 0.5));
    //    gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 30根据相除，依据distance实现星星效果
    //    float stregth = 0.15 / distance(vUv, vec2(0.5, 0.5));
    //    gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 31根据相除，依据distance实现星星透明效果
    //    float stregth = 0.15 / distance(vUv, vec2(0.5, 0.5)) - 1.0;
    //    gl_FragColor = vec4(stregth, stregth, stregth, stregth);

    // 32设置vUv水平或者竖直变量
    //    float stregth = 0.15 / distance(vec2(vUv.x, vUv.y * 5.0), vec2(0.5, 0.5)) - 1.0;
    //    gl_FragColor = vec4(stregth, stregth, stregth, stregth);

    //33十字交叉星星
    //    float stregth = 0.15 / distance(vec2(vUv.x, (vUv.y - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 1.0;
    //    stregth += 0.15 / distance(vec2(vUv.y, (vUv.x - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 1.0;
    //    gl_FragColor = vec4(stregth, stregth, stregth, 1.0);


    // 34旋转星星，旋转uv
    //    vec2 rotateUv = rotate(vUv, -uTime * 5.0, vec2(0.5));
    //    float stregth = 0.15 / distance(vec2(rotateUv.x, (rotateUv.y - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 1.0;
    //    stregth += 0.15 / distance(vec2(rotateUv.y, (rotateUv.x - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 1.0;
    //    gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 35绘制圆
    //    float stregth = 1.0 - step(0.5, distance(vUv, vec2(0.5)) + 0.25);
    //    gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 36绘制圆环
    //    float stregth = step(0.5, distance(vUv, vec2(0.5)) + 0.35);
    //    stregth *= 1.0 - step(0.5, distance(vUv, vec2(0.5)) + 0.25);
    //    gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 37渐变环
    //    float stregth = abs(distance(vUv, vec2(0.5)) - 0.25);
    //    gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 38打靶
    //    float stregth = step(0.1, abs(distance(vUv, vec2(0.5)) - 0.25));
    //    gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 39圆环
    //    float stregth = 1.0 - step(0.1, abs(distance(vUv, vec2(0.5)) - 0.25));
    //    gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 40波浪环
    //    vec2 waveUv = vec2(
    //        vUv.x,
    //        vUv.y + sin(vUv.x * 30.0) * 0.1
    //    );
    //    float stregth = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));
    //    gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 41水洼
    //    vec2 waveUv = vec2(
    //    vUv.x + sin(vUv.y * 30.0) * 0.1,
    //    vUv.y + sin(vUv.x * 30.0) * 0.1
    //    );
    //    float stregth = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));
    //    gl_FragColor = vec4(stregth, stregth, stregth, 1.0);


    // 42
    //    vec2 waveUv = vec2(
    //    vUv.x + sin(vUv.y * 100.0) * 0.1,
    //    vUv.y + sin(vUv.x * 100.0) * 0.1
    //    );
    //    float stregth = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));
    //    gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 43 根据角度显示视图
    //    float angle = atan(vUv.x, vUv.y);
    //    float stregth = angle;
    //    gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 44 根据角度实现螺旋渐变
    //    float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    //    float stregth = (angle + 3.14) / 6.28;
    //    gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 45 根据角度实现雷达扫射 6.28 = 2Math.PI
    //    float alpha = 1.0 - step(0.5, distance(vUv, vec2(0.5)));
    //    float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    //    float stregth = (angle + 3.14) / 6.28;
    //    gl_FragColor = vec4(stregth, stregth, stregth, alpha);

    // 45 根据角度实现雷达扫射旋转 6.28 = 2Math.PI
    //    vec2 rotateUv = rotate(vUv, -uTime * 5.0, vec2(0.5));
    //    float alpha = 1.0 - step(0.5, distance(rotateUv, vec2(0.5)));
    //    float angle = atan(rotateUv.x - 0.5, rotateUv.y - 0.5);
    //    float stregth = (angle + 3.14) / 6.28;
    //    gl_FragColor = vec4(stregth, stregth, stregth, alpha);

    // 46 万花筒
    //    float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (2.0 * PI);
    //    float stregth = mod(angle * 10.0, 1.0);
    //    gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 47 光芒四射
    //    float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (2.0 * PI);
    //    float stregth = sin(angle * 100.0);
    //    gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 48 使用噪声实现烟雾、波纹效果
    //    float stregth = noise(vUv * 10.0);
    //    gl_FragColor = vec4(stregth, stregth, stregth, 1.0);
    //
    //    float stregth = step(0.5, noise(vUv * 10.0));
    //    gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 49 通过时间使用噪声实现烟雾、波纹效果
    //    float stregth = step(0.5, noise(vUv * 10.0 + uTime));
    //    gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    //    float stregth = step(0.5, cnoise(vUv * 10.0 + uTime));
    //    gl_FragColor = vec4(stregth, stregth, stregth, 1.0);
    //
    //    float stregth = abs(cnoise(vUv * 10.0 + uTime));
    //    gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 50 发光路径
    //    float stregth = 1.0 - abs(cnoise(vUv * 10.0));
    //    gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 51 波纹效果
    //    float stregth = sin(cnoise(vUv * 10.0) * 20.0 + uTime);
    //    gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    //    float stregth = step(0.9, sin(cnoise(vUv * 10.0) * 20.0));
    //    gl_FragColor = vec4(stregth, stregth, stregth, 1.0);

    // 52 使用混合函数混颜色
    vec3 purpleColor = vec3(1.0, 0.0, 1.0);
    vec3 greenColor = vec3(0.0, 1.0, 0.0);
    vec3 uvColor = vec3(vUv, 1.0);

    float stregth = step(0.9, sin(cnoise(vUv * 10.0) * 20.0));

    vec3 mixColor = mix(uvColor, greenColor, stregth);
//    gl_FragColor = vec4(mixColor, 1.0);
    gl_FragColor = vec4(mixColor, 1.0);

}
