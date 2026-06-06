// ============================================
// 运镜动画图标系统
// 用纯 CSS 动画方块演示镜头运动原理
// ============================================

// 为每种运镜生成一个动画 HTML 小组件
function getMotionIcon(id) {
    const icons = {
        // === 景别 ===
        els: `<div class="mi mi-els"><div class="mi-scene"><div class="mi-landscape"></div><div class="mi-tiny-person"></div></div></div>`,
        ls: `<div class="mi mi-ls"><div class="mi-scene"><div class="mi-ground-line"></div><div class="mi-small-person"></div></div></div>`,
        fs: `<div class="mi mi-fs"><div class="mi-scene"><div class="mi-full-person"></div></div></div>`,
        mfs: `<div class="mi mi-mfs"><div class="mi-scene"><div class="mi-mfs-person"></div></div></div>`,
        ms: `<div class="mi mi-ms"><div class="mi-scene"><div class="mi-ms-person"></div></div></div>`,
        mcu: `<div class="mi mi-mcu"><div class="mi-scene"><div class="mi-mcu-person"></div></div></div>`,
        cu: `<div class="mi mi-cu"><div class="mi-scene"><div class="mi-cu-face"></div></div></div>`,
        bcu: `<div class="mi mi-bcu"><div class="mi-scene"><div class="mi-bcu-eye"></div></div></div>`,
        ecu: `<div class="mi mi-ecu"><div class="mi-scene"><div class="mi-ecu-detail"></div></div></div>`,
        macro: `<div class="mi mi-macro"><div class="mi-scene"><div class="mi-macro-dot"></div><div class="mi-macro-ring"></div></div></div>`,
        
        // === 机位角度 ===
        overhead: `<div class="mi mi-overhead"><div class="mi-scene"><div class="mi-angle-person"></div><div class="mi-angle-cam"></div></div></div>`,
        low_angle: `<div class="mi mi-lowangle"><div class="mi-scene"><div class="mi-angle-person"></div><div class="mi-angle-cam"></div></div></div>`,
        eye_level: `<div class="mi mi-eyelevel"><div class="mi-scene"><div class="mi-angle-person"></div><div class="mi-angle-cam"></div></div></div>`,
        side_view: `<div class="mi mi-sideview"><div class="mi-scene"><div class="mi-side-person"></div></div></div>`,
        back_view: `<div class="mi mi-backview"><div class="mi-scene"><div class="mi-back-person"></div></div></div>`,
        ots: `<div class="mi mi-overshoulder"><div class="mi-scene"><div class="mi-subject"></div><div class="mi-shoulder"></div></div></div>`,
        pov: `<div class="mi mi-pov"><div class="mi-scene"><div class="mi-eye"></div></div></div>`,
        
        // === 基础运镜 ===
        push: `<div class="mi mi-push"><div class="mi-scene"><div class="mi-subject"></div></div><div class="mi-cam"></div></div>`,
        pull: `<div class="mi mi-pull"><div class="mi-scene"><div class="mi-subject"></div></div><div class="mi-cam"></div></div>`,
        pan: `<div class="mi mi-pan"><div class="mi-scene"><div class="mi-subject"></div><div class="mi-subject s2"></div></div><div class="mi-cam"></div></div>`,
        track: `<div class="mi mi-track"><div class="mi-scene"><div class="mi-subject"></div></div><div class="mi-cam"></div></div>`,
        follow: `<div class="mi mi-follow"><div class="mi-scene"><div class="mi-subject"></div></div><div class="mi-cam"></div></div>`,
        up: `<div class="mi mi-up"><div class="mi-scene"><div class="mi-subject"></div></div><div class="mi-cam"></div></div>`,
        down: `<div class="mi mi-down"><div class="mi-scene"><div class="mi-subject"></div></div><div class="mi-cam"></div></div>`,
        whip: `<div class="mi mi-whip"><div class="mi-scene"><div class="mi-subject"></div><div class="mi-blur"></div></div><div class="mi-cam"></div></div>`,
        
        // === 进阶 ===
        dolly_zoom: `<div class="mi mi-dollyzoom"><div class="mi-scene"><div class="mi-subject"></div><div class="mi-bg"></div></div></div>`,
        dutch: `<div class="mi mi-dutch"><div class="mi-scene"><div class="mi-frame"></div></div></div>`,
        handheld: `<div class="mi mi-handheld"><div class="mi-scene"><div class="mi-frame"></div></div></div>`,
        steadicam: `<div class="mi mi-steadicam"><div class="mi-scene"><div class="mi-path"></div><div class="mi-cam"></div></div></div>`,
        long_take: `<div class="mi mi-longtake"><div class="mi-scene"><div class="mi-timeline"></div><div class="mi-dot"></div></div></div>`,
        crash_zoom: `<div class="mi mi-crashzoom"><div class="mi-scene"><div class="mi-subject"></div><div class="mi-ring"></div></div></div>`,
        crane: `<div class="mi mi-crane"><div class="mi-scene"><div class="mi-arm"></div><div class="mi-cam"></div></div></div>`,
        drone: `<div class="mi mi-drone"><div class="mi-scene"><div class="mi-ground"></div><div class="mi-cam"></div></div></div>`,
        orbit: `<div class="mi mi-orbit"><div class="mi-scene"><div class="mi-subject"></div><div class="mi-cam"></div></div></div>`,
        
        // === Seedance ===
        smooth_push: `<div class="mi mi-push"><div class="mi-scene"><div class="mi-subject"></div></div><div class="mi-cam"></div></div>`,
        fast_push_stop: `<div class="mi mi-fastpush"><div class="mi-scene"><div class="mi-subject"></div></div><div class="mi-cam"></div></div>`,
        fast_pull: `<div class="mi mi-pull"><div class="mi-scene"><div class="mi-subject"></div></div><div class="mi-cam"></div></div>`,
        lateral_left: `<div class="mi mi-lateral-l"><div class="mi-scene"><div class="mi-subject"></div></div><div class="mi-cam"></div></div>`,
        lateral_right: `<div class="mi mi-lateral-r"><div class="mi-scene"><div class="mi-subject"></div></div><div class="mi-cam"></div></div>`,
        tilt_up: `<div class="mi mi-up"><div class="mi-scene"><div class="mi-subject"></div></div><div class="mi-cam"></div></div>`,
        tilt_down: `<div class="mi mi-down"><div class="mi-scene"><div class="mi-subject"></div></div><div class="mi-cam"></div></div>`,
        vertigo: `<div class="mi mi-dollyzoom"><div class="mi-scene"><div class="mi-subject"></div><div class="mi-bg"></div></div></div>`,
        reverse_vertigo: `<div class="mi mi-dollyzoom rev"><div class="mi-scene"><div class="mi-subject"></div><div class="mi-bg"></div></div></div>`,
        orbit_360: `<div class="mi mi-orbit"><div class="mi-scene"><div class="mi-subject"></div><div class="mi-cam"></div></div></div>`,
        low_orbit: `<div class="mi mi-orbit low"><div class="mi-scene"><div class="mi-subject"></div><div class="mi-cam"></div></div></div>`,
        dive_down: `<div class="mi mi-dive"><div class="mi-scene"><div class="mi-ground"></div><div class="mi-cam"></div></div></div>`,
        rise_up: `<div class="mi mi-rise"><div class="mi-scene"><div class="mi-ground"></div><div class="mi-cam"></div></div></div>`,
        spiral_up: `<div class="mi mi-spiral"><div class="mi-scene"><div class="mi-subject"></div><div class="mi-cam"></div></div></div>`,
        pov_handheld: `<div class="mi mi-pov"><div class="mi-scene"><div class="mi-eye"></div></div></div>`,
        fpv: `<div class="mi mi-fpv"><div class="mi-scene"><div class="mi-tunnel"></div><div class="mi-cam"></div></div></div>`,
        behind_follow: `<div class="mi mi-behind"><div class="mi-scene"><div class="mi-subject"></div><div class="mi-cam"></div></div></div>`,
        over_shoulder: `<div class="mi mi-overshoulder"><div class="mi-scene"><div class="mi-subject"></div><div class="mi-shoulder"></div></div></div>`,
        side_follow: `<div class="mi mi-lateral-r"><div class="mi-scene"><div class="mi-subject"></div></div><div class="mi-cam"></div></div>`,
        whip_pan: `<div class="mi mi-whip"><div class="mi-scene"><div class="mi-subject"></div><div class="mi-blur"></div></div><div class="mi-cam"></div></div>`,
        time_freeze: `<div class="mi mi-freeze"><div class="mi-scene"><div class="mi-subject"></div><div class="mi-cam"></div></div></div>`,
        match_motion: `<div class="mi mi-match"><div class="mi-scene"><div class="mi-subject"></div><div class="mi-cam"></div></div></div>`,
    };
    return icons[id] || `<div class="mi mi-default"><div class="mi-scene"><div class="mi-cam"></div></div></div>`;
}

// 为调色生成颜色预览动画
function getColorPreview(palette) {
    if (!palette || !palette.colors) return '<div class="mi mi-color"><div class="mi-color-swatch"></div></div>';
    const gradient = palette.colors.join(', ');
    return `<div class="mi mi-color"><div class="mi-color-swatch" style="background:linear-gradient(135deg,${gradient});"></div></div>`;
}

// 获取任意库item的预览动画
function getItemPreview(type, item) {
    if (type === '运镜') return getMotionIcon(item.id || '');
    if (type === '调色') return getColorPreview(item);
    if (type === '表情') return `<div class="mi mi-expr">${getSvgIcon(item.id, 'face')}</div>`;
    if (type === '肢体') return `<div class="mi mi-expr">${getSvgIcon(item.id, 'body')}</div>`;
    if (type === '血色') return `<div class="mi mi-expr">${getSvgIcon(item.id, 'blood')}</div>`;
    return '';
}
