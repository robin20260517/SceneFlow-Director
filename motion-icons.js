// ============================================
// 分层镜头示意图系统（替代抽象图标）
// 画面框 = 摄影机取景框
// 绿色点  = 人物
// 蓝色箭头 = 摄影机运动
// 黄色箭头 = 人物运动
// 虚线     = 运动轨迹
// 前景遮挡块 = 遮挡转场
// 焦点圆环 = 对焦目标
// 全部用 SVG（viewBox 0 0 100 64）绘制，动画由 motion-icons.css 驱动
// ============================================

// ---------- SVG 基础元件 ----------
function sdFrame() {
    return `<rect class="sd-frame" x="3" y="3" width="94" height="58" rx="6"/>
            <line class="sd-frame-tick" x1="50" y1="3" x2="50" y2="9"/>
            <line class="sd-frame-tick" x1="50" y1="55" x2="50" y2="61"/>`;
}
function sdPerson(x, y, r, cls = '') {
    return `<circle class="sd-person ${cls}" cx="${x}" cy="${y}" r="${r}"/>`;
}
function sdPersonBack(x, y, r, cls = '') {
    // 背影：空心绿点
    return `<circle class="sd-person-back ${cls}" cx="${x}" cy="${y}" r="${r}"/>`;
}
function sdFocus(x, y, r, cls = '') {
    return `<circle class="sd-focus ${cls}" cx="${x}" cy="${y}" r="${r}"/>`;
}
function sdCamera(x, y, rot = 0, cls = '') {
    // 摄影机：蓝色小机身 + 镜头方向缺口
    return `<g class="sd-cambody ${cls}" transform="translate(${x},${y}) rotate(${rot})">
              <rect x="-5" y="-4" width="9" height="8" rx="1.5"/>
              <polygon points="4,-3 9,-5 9,5 4,3"/>
            </g>`;
}
function sdTrack(d, cls = '') {
    return `<path class="sd-track ${cls}" d="${d}"/>`;
}
function sdOccluder(x, cls = '') {
    return `<rect class="sd-occluder ${cls}" x="${x}" y="3" width="22" height="58" rx="2"/>`;
}
// 箭头（line + 手绘三角头），colorKind: 'cam'(蓝) | 'person'(黄)
function sdArrow(x1, y1, x2, y2, colorKind, cls = '') {
    const ang = Math.atan2(y2 - y1, x2 - x1);
    const s = 4.5;
    const a1 = ang + Math.PI * 0.82, a2 = ang - Math.PI * 0.82;
    const p1x = (x2 + s * Math.cos(a1)).toFixed(1), p1y = (y2 + s * Math.sin(a1)).toFixed(1);
    const p2x = (x2 + s * Math.cos(a2)).toFixed(1), p2y = (y2 + s * Math.sin(a2)).toFixed(1);
    return `<g class="sd-arrow sd-arrow-${colorKind} ${cls}">
              <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>
              <polygon points="${x2},${y2} ${p1x},${p1y} ${p2x},${p2y}"/>
            </g>`;
}
function sdWrap(arch, inner) {
    return `<svg class="sd sd-${arch}" viewBox="0 0 100 64" preserveAspectRatio="xMidYMid meet">${inner}</svg>`;
}

// ---------- 景别：人物在取景框中所占比例 ----------
function diagShotSize(id) {
    const cx = 50, cy = 38;
    const conf = {
        els:   { r: 2.5,  ground: true,  label: '环境' },
        ls:    { r: 4,    ground: true },
        fs:    { r: 7 },
        mfs:   { r: 9 },
        ms:    { r: 12 },
        mcu:   { r: 15 },
        cu:    { r: 19,  face: true },
        bcu:   { r: 24,  face: true, focus: true },
        ecu:   { r: 30,  face: true, focus: true },
        macro: { r: 3,   focus: true, detail: true }
    };
    const c = conf[id] || conf.fs;
    let inner = sdFrame();
    if (c.ground) inner += `<line class="sd-ground" x1="8" y1="50" x2="92" y2="50"/>`;
    if (c.detail) {
        // 微距：放大的细节纹理 + 焦点圈
        inner += `<circle class="sd-person" cx="${cx}" cy="${cy}" r="${c.r}"/>`;
        inner += `<line class="sd-detail" x1="38" y1="30" x2="62" y2="30"/><line class="sd-detail" x1="36" y1="40" x2="64" y2="40"/>`;
        inner += sdFocus(cx, cy, 12);
    } else {
        const py = c.r > 16 ? 34 : cy;
        inner += `<circle class="sd-person" cx="${cx}" cy="${py}" r="${c.r}"/>`;
        if (c.face) {
            // 简单五官示意
            inner += `<circle class="sd-face-eye" cx="${cx - c.r * 0.35}" cy="${py - c.r * 0.2}" r="1.6"/>
                      <circle class="sd-face-eye" cx="${cx + c.r * 0.35}" cy="${py - c.r * 0.2}" r="1.6"/>`;
        }
        if (c.focus) inner += sdFocus(cx, py, c.r + 3);
    }
    return sdWrap('size', inner);
}

// ---------- 机位/角度：相机相对人物的位置 ----------
function diagAngle(id) {
    const px = 50, py = 38;
    let inner = sdFrame();
    switch (id) {
        case 'overhead':
        case 'bird':
            inner += sdPerson(px, py, 6);
            inner += sdCamera(px, 14, 90);
            inner += sdArrow(px, 20, px, 30, 'cam');
            break;
        case 'low_angle':
            inner += sdPerson(px, py - 4, 6);
            inner += sdCamera(px, 56, -90);
            inner += sdArrow(px, 50, px, 40, 'cam');
            break;
        case 'eye_level':
            inner += sdPerson(px + 8, py, 6);
            inner += sdCamera(20, py, 0);
            inner += sdArrow(28, py, 40, py, 'cam');
            break;
        case 'side_view':
            inner += sdPerson(px, py, 6);
            inner += `<line class="sd-axis" x1="${px}" y1="14" x2="${px}" y2="58"/>`;
            inner += sdCamera(18, py, 0);
            inner += sdArrow(26, py, 41, py, 'cam');
            break;
        case 'back_view':
            inner += sdPersonBack(px, py - 2, 7);
            inner += sdCamera(px, 56, -90);
            inner += sdArrow(px, 50, px, 46, 'cam');
            inner += sdArrow(px, 28, px, 16, 'person');
            break;
        case 'pov':
            inner += `<path class="sd-eye" d="M30 32 Q50 18 70 32 Q50 46 30 32 Z"/><circle class="sd-person" cx="50" cy="32" r="5"/>`;
            break;
        case 'ots':
        default:
            // 过肩：前景肩膀遮挡块 + 远景人物 + 焦点圈
            inner += `<path class="sd-shoulder" d="M6 64 Q18 40 14 64 Z M6 64 L34 64 L34 48 Q20 44 14 64 Z"/>`;
            inner += sdPerson(66, 36, 9);
            inner += sdFocus(66, 36, 13);
            inner += sdCamera(14, 54, -20);
            break;
    }
    return sdWrap('angle', inner);
}

// ---------- 运镜：相机/人物运动 ----------
function diagMove(arch) {
    const px = 50, py = 34;
    let inner = sdFrame();
    switch (arch) {
        case 'static':
            inner += sdPerson(px, py, 8);
            inner += `<rect class="sd-lock" x="34" y="18" width="32" height="32" rx="2"/>`;
            break;
        case 'push':
        case 'crash':
            inner += sdPerson(px, py, 7);
            inner += sdFocus(px, py, 11, 'sd-focus-shrink');
            inner += `<g class="sd-cam sd-cam-pushz">${sdCamera(px, 56, -90)}</g>`;
            inner += sdArrow(px, 50, px, 44, 'cam', 'sd-cam-pushz');
            break;
        case 'pull':
            inner += sdPerson(px, py, 7);
            inner += `<g class="sd-cam sd-cam-pullz">${sdCamera(px, 50, -90)}</g>`;
            inner += sdArrow(px, 46, px, 56, 'cam', 'sd-cam-pullz');
            break;
        case 'lateral':
            inner += sdTrack('M14 52 L86 52');
            inner += sdPerson(px, py, 7);
            inner += `<g class="sd-cam sd-cam-lat">${sdCamera(24, 52, 0)}</g>`;
            inner += sdArrow(20, 52, 86, 52, 'cam');
            break;
        case 'pan':
            inner += sdPerson(28, 30, 5);
            inner += sdPerson(72, 30, 5);
            inner += sdCamera(px, 54, -90);
            inner += `<path class="sd-track sd-arrow-cam-stroke" d="M30 44 Q50 30 70 44"/>`;
            inner += sdArrow(66, 40, 72, 43, 'cam');
            break;
        case 'follow':
            inner += sdTrack('M20 50 L80 30');
            inner += `<g class="sd-person-move">${sdPerson(66, 34, 7)}</g>`;
            inner += sdArrow(60, 38, 78, 28, 'person');
            inner += `<g class="sd-cam sd-cam-follow">${sdCamera(28, 48, -25)}</g>`;
            inner += sdArrow(34, 46, 50, 38, 'cam');
            break;
        case 'handheld_follow':
            inner += `<g class="sd-shake">${sdTrack('M20 50 L80 32')}${sdPerson(64, 36, 7)}${sdArrow(58, 40, 78, 30, 'person')}${sdCamera(28, 50, -25)}${sdArrow(34, 48, 50, 40, 'cam')}</g>`;
            break;
        case 'handheld':
            inner += `<g class="sd-shake">${sdPerson(px, py, 8)}${sdFocus(px, py, 12)}</g>`;
            break;
        case 'low_push':
            inner += sdPerson(px, py - 2, 8);
            inner += sdArrow(px, 16, px, 24, 'person');
            inner += `<g class="sd-cam sd-cam-pushz">${sdCamera(px, 57, -90)}</g>`;
            inner += sdArrow(px, 52, px, 46, 'cam', 'sd-cam-pushz');
            break;
        case 'tilt_up':
        case 'crane_up':
            inner += sdPerson(px, py, 7);
            inner += `<g class="sd-cam sd-cam-up">${sdCamera(80, 50, -90)}</g>`;
            inner += sdArrow(80, 50, 80, 16, 'cam');
            break;
        case 'tilt_down':
        case 'crane_down':
            inner += sdPerson(px, py, 7);
            inner += `<g class="sd-cam sd-cam-down">${sdCamera(80, 16, 90)}</g>`;
            inner += sdArrow(80, 16, 80, 50, 'cam');
            break;
        case 'orbit':
            inner += sdPerson(px, py, 7);
            inner += `<ellipse class="sd-track" cx="${px}" cy="${py}" rx="30" ry="16"/>`;
            inner += `<g class="sd-cam sd-cam-orbit" style="transform-origin:50px 34px">${sdCamera(80, py, 180)}</g>`;
            break;
        case 'dolly_zoom':
            inner += `<g class="sd-warp"><line class="sd-warp-line" x1="50" y1="34" x2="14" y2="10"/><line class="sd-warp-line" x1="50" y1="34" x2="86" y2="10"/><line class="sd-warp-line" x1="50" y1="34" x2="14" y2="58"/><line class="sd-warp-line" x1="50" y1="34" x2="86" y2="58"/></g>`;
            inner += sdPerson(px, py, 8);
            inner += `<g class="sd-cam sd-cam-pullz">${sdCamera(px, 54, -90)}</g>`;
            break;
        case 'dutch':
            inner = `<g class="sd-tilt">${sdFrame()}${sdPerson(px, py, 8)}</g>`;
            break;
        case 'whip':
            inner += `<g class="sd-whip-streak"><line x1="14" y1="26" x2="86" y2="26"/><line x1="14" y1="34" x2="86" y2="34"/><line x1="14" y1="42" x2="86" y2="42"/></g>`;
            inner += `<g class="sd-whip-person">${sdPerson(px, py, 6)}</g>`;
            break;
        case 'rack_focus':
            inner += sdPerson(28, 44, 8);
            inner += sdPerson(72, 26, 6);
            inner += `<g class="sd-rack-front">${sdFocus(28, 44, 12)}</g>`;
            inner += `<g class="sd-rack-back">${sdFocus(72, 26, 10)}</g>`;
            break;
        case 'occlusion':
            inner += sdPerson(px, py, 7);
            inner += `<g class="sd-occ-move">${sdOccluder(-22)}</g>`;
            break;
        default:
            inner += sdPerson(px, py, 8);
            inner += sdCamera(px, 54, -90);
            inner += sdArrow(px, 50, px, 44, 'cam');
    }
    return sdWrap('move', inner);
}

// ---------- id → 示意图 映射 ----------
const SHOT_SIZE_IDS = { els:1, ls:1, fs:1, mfs:1, ms:1, mcu:1, cu:1, bcu:1, ecu:1, macro:1 };
const ANGLE_IDS = { overhead:1, low_angle:1, eye_level:1, side_view:1, back_view:1, ots:1, pov:1, bird:1 };

// 把各种运镜 id 归到运动原型
const MOVE_ARCH = {
    // 基础
    push: 'push', pull: 'pull', pan: 'pan', track: 'lateral', follow: 'follow',
    up: 'tilt_up', down: 'tilt_down', whip: 'whip',
    // 进阶
    dolly_zoom: 'dolly_zoom', dutch: 'dutch', handheld: 'handheld', steadicam: 'follow',
    long_take: 'lateral', crash_zoom: 'crash', crane: 'crane_up', drone: 'tilt_down', orbit: 'orbit',
    // seedance
    smooth_push: 'push', fast_push_stop: 'crash', fast_pull: 'pull',
    lateral_left: 'lateral', lateral_right: 'lateral', tilt_up: 'tilt_up', tilt_down: 'tilt_down',
    vertigo: 'dolly_zoom', reverse_vertigo: 'dolly_zoom', orbit_360: 'orbit', low_orbit: 'orbit',
    dive_down: 'tilt_down', rise_up: 'crane_up', spiral_up: 'crane_up', pov_handheld: 'handheld',
    fpv: 'handheld', behind_follow: 'follow', over_shoulder: 'follow', side_follow: 'lateral',
    whip_pan: 'whip', time_freeze: 'orbit', match_motion: 'follow',
    // KB 知识库新增
    static: 'static', lateral: 'lateral', low_push: 'low_push', crane_up: 'crane_up',
    crane_down: 'crane_down', handheld_follow: 'handheld_follow', rack_focus: 'rack_focus',
    occlusion: 'occlusion',
    // 对话/对峙类 → 过肩
    over_shoulder_reverse: 'ots', duo_medium: 'static'
};

// 主入口：根据 id 返回分层示意 SVG
function getMotionIcon(id) {
    if (!id) return diagMove('default');
    if (SHOT_SIZE_IDS[id]) return `<div class="sd-box">${diagShotSize(id)}</div>`;
    if (ANGLE_IDS[id]) {
        if (id === 'ots') return `<div class="sd-box">${diagAngle('ots')}</div>`;
        return `<div class="sd-box">${diagAngle(id)}</div>`;
    }
    const arch = MOVE_ARCH[id];
    if (arch === 'ots') return `<div class="sd-box">${diagAngle('ots')}</div>`;
    return `<div class="sd-box">${diagMove(arch || 'default')}</div>`;
}

// 按中文名取图（供分镜卡片用 KB 的 diagram 字段）
function getMotionIconByName(name) {
    const kb = (typeof CINEMA_KB !== 'undefined') ? CINEMA_KB : null;
    if (kb) {
        if (kb.cameraMoves[name]) return getMotionIcon(kb.cameraMoves[name].diagram);
        if (kb.shotSizes[name]) return getMotionIcon(kb.shotSizes[name].diagram);
        if (kb.cameraAngles[name]) return getMotionIcon(kb.cameraAngles[name].diagram);
    }
    return getMotionIcon('default');
}

// ---------- 调色预览（保留）----------
function getColorPreview(palette) {
    if (!palette || !palette.colors) return '<div class="mi mi-color"><div class="mi-color-swatch"></div></div>';
    const gradient = palette.colors.join(', ');
    return `<div class="mi mi-color"><div class="mi-color-swatch" style="background:linear-gradient(135deg,${gradient});"></div></div>`;
}

// 任意库 item 预览
function getItemPreview(type, item) {
    if (type === '运镜') return getMotionIcon(item.id || '');
    if (type === '调色') return getColorPreview(item);
    if (type === '表情') return `<div class="mi mi-expr">${getSvgIcon(item.id, 'face')}</div>`;
    if (type === '肢体') return `<div class="mi mi-expr">${getSvgIcon(item.id, 'body')}</div>`;
    if (type === '血色') return `<div class="mi mi-expr">${getSvgIcon(item.id, 'blood')}</div>`;
    return '';
}
