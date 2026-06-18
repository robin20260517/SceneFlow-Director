// ============================================
// 导演台 — 应用主逻辑 v3
// @ 调用 + 居中弹窗 + 精简输出 + 表情库页
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initDirectorOptions();
    initDirectorGallery();
    initTabs();
    initGenerate();
    initLibrary();
    initColors();
    initExpressions();
    initAtMention();
});

// 把 31 位导演（DIRECTOR_PROFILES）填进导演下拉框
function initDirectorOptions() {
    const sel = document.getElementById('director-style');
    if (!sel || typeof DIRECTOR_PROFILES === 'undefined') return;
    const group = document.createElement('optgroup');
    group.label = `导演智囊团 · ${Object.keys(DIRECTOR_PROFILES).length} 位（论文注入）`;
    Object.keys(DIRECTOR_PROFILES).forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        group.appendChild(opt);
    });
    sel.appendChild(group);
}

// ===== 导演库 ChromaGrid（聚光灯灰度网格，Vanilla 移植）=====
function initDirectorGallery() {
    const grid = document.getElementById('director-grid');
    const filters = document.querySelectorAll('#director-filters .filter-btn');
    if (!grid || typeof DIRECTOR_GALLERY === 'undefined') return;

    function render(filter) {
        const items = (filter === 'all') ? DIRECTOR_GALLERY : DIRECTOR_GALLERY.filter(d => d.region === filter);
        grid.innerHTML = items.map(d => {
            const grad = `linear-gradient(145deg, ${d.color}, #000)`;
            const key = encodeURIComponent(d.key);
            return `<article class="chroma-card" data-key="${key}" style="--card-border:${d.color};--card-gradient:${grad}">
                <div class="chroma-img-wrapper"><img src="${d.image}" alt="${escapeHtml(d.name)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.closest('.chroma-img-wrapper').classList.add('img-fail')"></div>
                <footer class="chroma-info">
                    <h3 class="name">${escapeHtml(d.name)}</h3>
                    <span class="handle" style="color:${d.color}">${escapeHtml(d.region)}</span>
                    <p class="role">${escapeHtml(d.subtitle)}</p>
                </footer>
            </article>`;
        }).join('') + '<div class="chroma-overlay"></div><div class="chroma-fade"></div>';

        grid.querySelectorAll('.chroma-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                card.style.setProperty('--mouse-x', (e.clientX - r.left) + 'px');
                card.style.setProperty('--mouse-y', (e.clientY - r.top) + 'px');
            });
            card.addEventListener('click', () => selectDirectorStyle(decodeURIComponent(card.dataset.key)));
        });
    }

    // 聚光灯位置 + 阻尼缓动
    const state = { x: 0, y: 0, tx: 0, ty: 0, raf: null };
    function tick() {
        state.x += (state.tx - state.x) * 0.18;
        state.y += (state.ty - state.y) * 0.18;
        grid.style.setProperty('--x', state.x + 'px');
        grid.style.setProperty('--y', state.y + 'px');
        if (Math.abs(state.tx - state.x) > 0.4 || Math.abs(state.ty - state.y) > 0.4) {
            state.raf = requestAnimationFrame(tick);
        } else { state.raf = null; }
    }
    grid.addEventListener('pointermove', e => {
        const r = grid.getBoundingClientRect();
        state.tx = e.clientX - r.left;
        state.ty = e.clientY - r.top;
        if (!state.raf) state.raf = requestAnimationFrame(tick);
        const fade = grid.querySelector('.chroma-fade');
        if (fade) fade.style.opacity = '0';
    });
    grid.addEventListener('pointerleave', () => {
        const fade = grid.querySelector('.chroma-fade');
        if (fade) fade.style.opacity = '1';
    });

    filters.forEach(b => b.addEventListener('click', () => {
        filters.forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        render(b.dataset.filter);
    }));
    render('all');
}

// 点击导演卡片 → 选中该导演风格并跳到智能分镜
function selectDirectorStyle(key) {
    const sel = document.getElementById('director-style');
    if (sel) sel.value = key;
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    const genTab = document.querySelector('.nav-tab[data-tab="generate"]');
    if (genTab) genTab.classList.add('active');
    document.getElementById('panel-generate').classList.add('active');
    const d = (typeof DIRECTOR_GALLERY !== 'undefined') && DIRECTOR_GALLERY.find(x => x.key === key);
    showToast(`已选导演风格：${d ? d.name : key} —— 输入剧情即按其风格生成`);
    const input = document.getElementById('scene-input');
    if (input) input.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Tab 切换 =====
function initTabs() {
    const tabs = document.querySelectorAll('.nav-tab');
    const panels = document.querySelectorAll('.tab-panel');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`panel-${tab.dataset.tab}`).classList.add('active');
        });
    });
}

// ===== @ 弹窗选择器（居中全屏可滚动）=====
function initAtMention() {
    const input = document.getElementById('scene-input');
    input.addEventListener('input', () => {
        const val = input.value;
        const cursorPos = input.selectionStart;
        const textBefore = val.substring(0, cursorPos);
        const atMatch = textBefore.match(/@([^\s@]*)$/);
        if (atMatch) {
            showAtPicker(atMatch[1], input);
        }
    });
}

function getAtItems() {
    const items = [];
    // 景别
    SHOT_SIZE_LIBRARY.forEach(s => {
        items.push({ type: '景别', name: s.cn, id: s.id });
    });
    // 机位角度
    CAMERA_ANGLE_LIBRARY.forEach(a => {
        items.push({ type: '机位', name: a.cn, id: a.id });
    });
    // 运镜
    [...BASIC_MOVEMENTS, ...ADVANCED_TECHNIQUES, ...SEEDANCE_MOVEMENTS, ...DIALOGUE_CONFRONTATION_SHOTS].forEach(m => {
        items.push({ type: '运镜', name: m.cn, id: m.id });
    });
    // 调色
    COLOR_PALETTES.forEach(c => {
        items.push({ type: '调色', name: c.name, id: 'color_' + c.id });
    });
    // 表情/肢体/血色
    EXPRESSION_LIBRARY.face.items.forEach(e => {
        items.push({ type: '表情', name: e.cn, id: e.id });
    });
    EXPRESSION_LIBRARY.body.items.forEach(e => {
        items.push({ type: '肢体', name: e.cn, id: e.id });
    });
    EXPRESSION_LIBRARY.bloodColor.items.forEach(e => {
        items.push({ type: '血色', name: e.cn, id: e.id });
    });
    return items;
}

function showAtPicker(query, input) {
    let old = document.querySelector('.at-picker-overlay');
    if (old) old.remove();

    const allItems = getAtItems();

    const overlay = document.createElement('div');
    overlay.className = 'at-picker-overlay';
    overlay.innerHTML = `
        <div class="at-picker">
            <div class="at-picker-header">
                <span class="at-picker-title">@ 素材库</span>
                <input class="at-picker-search" placeholder="搜索运镜、调色、表情、肢体、血色..." value="${query}">
                <button class="at-picker-close">\u2715</button>
            </div>
            <div class="at-picker-body"></div>
        </div>
    `;
    document.body.appendChild(overlay);

    const searchInput = overlay.querySelector('.at-picker-search');
    const body = overlay.querySelector('.at-picker-body');

    function render(q) {
        const filtered = q ? allItems.filter(item => item.name.includes(q) || item.type.includes(q)) : allItems;
        const groups = {};
        filtered.forEach(item => { if (!groups[item.type]) groups[item.type] = []; groups[item.type].push(item); });
        
        body.innerHTML = Object.entries(groups).map(([type, items]) => `
            <div class="at-group">
                <div class="at-group-title">${type}（${items.length}）</div>
                <div class="at-group-items">${items.map(item => {
                    // 获取对应的原始数据以生成预览
                    const previewHtml = getItemPreviewForAt(type, item.name);
                    return `<div class="at-chip-wrap"><div class="at-chip" data-name="${item.name}">${item.name}</div><div class="at-chip-preview">${previewHtml}</div></div>`;
                }).join('')}</div>
            </div>
        `).join('');

        body.querySelectorAll('.at-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const name = chip.dataset.name;
                const val = input.value;
                const cursorPos = input.selectionStart;
                const textBefore = val.substring(0, cursorPos);
                const textAfter = val.substring(cursorPos);
                const newBefore = textBefore.replace(/@[^\s@]*$/, `@${name} `);
                input.value = newBefore + textAfter;
                input.focus();
                input.selectionStart = input.selectionEnd = newBefore.length;
                overlay.remove();
            });
        });
    }

    render(query);
    searchInput.focus();
    searchInput.addEventListener('input', () => render(searchInput.value));
    overlay.querySelector('.at-picker-close').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}

// ===== 解析 @ 指定 =====
function parseAtMentions(text) {
    const mentions = { movements: [], colors: [], expressions: [], bodies: [], bloods: [], shotSizes: [], angles: [] };
    const atRegex = /@([\u4e00-\u9fa5A-Za-z0-9/\u00b7]+)/g;
    let match;
    while ((match = atRegex.exec(text)) !== null) {
        const name = match[1];
        // 景别
        const fs = SHOT_SIZE_LIBRARY.find(s => s.cn === name);
        if (fs) { mentions.shotSizes.push(fs); continue; }
        // 机位
        const fa = CAMERA_ANGLE_LIBRARY.find(a => a.cn === name);
        if (fa) { mentions.angles.push(fa); continue; }
        // 运镜
        const allMov = [...BASIC_MOVEMENTS, ...ADVANCED_TECHNIQUES, ...SEEDANCE_MOVEMENTS, ...DIALOGUE_CONFRONTATION_SHOTS];
        const fm = allMov.find(m => m.cn === name);
        if (fm) { mentions.movements.push(fm); continue; }
        // 调色
        const fc = COLOR_PALETTES.find(c => c.name === name);
        if (fc) { mentions.colors.push(fc); continue; }
        // 表情
        const ff = EXPRESSION_LIBRARY.face.items.find(e => e.cn === name);
        if (ff) { mentions.expressions.push(ff); continue; }
        // 肢体
        const fb = EXPRESSION_LIBRARY.body.items.find(e => e.cn === name);
        if (fb) { mentions.bodies.push(fb); continue; }
        // 血色
        const fbl = EXPRESSION_LIBRARY.bloodColor.items.find(e => e.cn === name);
        if (fbl) { mentions.bloods.push(fbl); continue; }
    }
    const cleanText = text.replace(/@[\u4e00-\u9fa5A-Za-z0-9/\u00b7]+/g, '').replace(/\s+/g, ' ').trim();
    const total = mentions.movements.length + mentions.colors.length + mentions.expressions.length + mentions.bodies.length + mentions.bloods.length + mentions.shotSizes.length + mentions.angles.length;
    return { mentions, cleanText, hasManualSelection: total > 0 };
}

// ===== 分镜生成 =====
function initGenerate() {
    const btn = document.getElementById('btn-generate');
    const input = document.getElementById('scene-input');
    const outputArea = document.getElementById('output-area');
    const shotsContainer = document.getElementById('shots-container');

    btn.addEventListener('click', () => {
        const text = input.value.trim();
        if (!text) { showToast('请输入剧情描述'); return; }
        const style = document.getElementById('director-style').value;
        const videoModel = document.getElementById('video-model').value;
        const characterCount = document.getElementById('character-count').value;
        const lockContinuity = document.getElementById('lock-continuity').checked;
        const lipSync = document.getElementById('lip-sync').checked;
        const antiCollapse = document.getElementById('anti-collapse').checked;
        const { mentions, cleanText, hasManualSelection } = parseAtMentions(text);

        if (!hasManualSelection) {
            showConfirmDialog(cleanText, style, videoModel, characterCount, lockContinuity, lipSync, antiCollapse, mentions, shotsContainer, outputArea, btn);
        } else {
            doGenerate(cleanText, style, videoModel, characterCount, lockContinuity, lipSync, antiCollapse, mentions, shotsContainer, outputArea, btn);
        }
    });

    document.getElementById('btn-copy-all').addEventListener('click', () => {
        const prompts = document.querySelectorAll('.shot-prompt-text');
        const allText = Array.from(prompts).map((p, i) => `=== 分镜 ${i+1} ===\n${p.textContent}`).join('\n\n');
        copyToClipboard(allText);
        showToast('已复制全部');
    });

    document.getElementById('btn-export').addEventListener('click', () => {
        const prompts = document.querySelectorAll('.shot-prompt-text');
        const data = Array.from(prompts).map((p, i) => ({ shot: i + 1, prompt: p.textContent }));
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `fengjing_${Date.now()}.json`; a.click();
        URL.revokeObjectURL(url);
        showToast('已导出');
    });

    input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); btn.click(); } });
}

function showConfirmDialog(cleanText, style, videoModel, characterCount, lockContinuity, lipSync, antiCollapse, mentions, container, outputArea, btn) {
    const preview = shotEngine.generateShots(cleanText, style, { videoModel, characterCount, lockContinuity, lipSync, antiCollapse, mentions });
    const summary = preview.shots.map((s, i) => `${i+1}. ${s.movement?.cn || '固定'} | ${s.color?.name || '自动'} | ${s.emotion?.cn || ''}`).join('\n');

    const dialog = document.createElement('div');
    dialog.className = 'confirm-dialog-overlay';
    dialog.innerHTML = `
        <div class="confirm-dialog">
            <div class="confirm-title">\ud83c\udfac 自动匹配确认</div>
            <div class="confirm-desc">未检测到 @ 指定，引擎将自动匹配：</div>
            <pre class="confirm-preview">${summary}</pre>
            <div class="confirm-hint">如需手动指定，返回在输入框中用 @名称 选取</div>
            <div class="confirm-actions">
                <button class="confirm-btn confirm-btn-cancel">返回修改</button>
                <button class="confirm-btn confirm-btn-ok">确认生成</button>
            </div>
        </div>
    `;
    document.body.appendChild(dialog);
    dialog.querySelector('.confirm-btn-cancel').addEventListener('click', () => dialog.remove());
    dialog.querySelector('.confirm-btn-ok').addEventListener('click', () => { dialog.remove(); doGenerate(cleanText, style, videoModel, characterCount, lockContinuity, lipSync, antiCollapse, mentions, container, outputArea, btn); });
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.remove(); });
}

function doGenerate(cleanText, style, videoModel, characterCount, lockContinuity, lipSync, antiCollapse, mentions, container, outputArea, btn) {
    btn.classList.add('loading');
    btn.querySelector('.btn-text').textContent = 'AI 分析中';

    // 一次性结构化分镜（先剧情解析，再输出分镜计划）

    const options = { videoModel, characterCount, lipSync, lockContinuity, antiCollapse, directorStyle: style };

    generateShotPlan(cleanText, mentions, options).then(res => {
        container.innerHTML = '';
        if (res.local) {
            container.innerHTML += `<div class="duo-notice"><span class="duo-notice-icon">⚠️</span><span class="duo-notice-text">AI 连接失败（${res.fallbackReason || ''}），已用本地运镜知识库生成结构化分镜</span></div>`;
        }
        container.innerHTML += renderSceneAnalysis(res.analysis || {}, cleanText);
        container.innerHTML += `<div class="shot-plan-title">🎬 分镜计划 · 共 ${res.shots.length} 个镜头</div>`;
        container.innerHTML += res.shots.map((s, i) => renderShotCard(s, i)).join('');
        outputArea.style.display = 'block';
        btn.classList.remove('loading');
        btn.querySelector('.btn-text').textContent = '生成分镜';
        outputArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

function escapeHtml(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function asList(v) {
    if (Array.isArray(v)) return v.join(' · ');
    return v || '';
}

// 第一段：剧情解析面板
function renderSceneAnalysis(a, cleanText) {
    const rows = [
        ['剧情类型', a['剧情类型']],
        ['场景地点', a['场景地点']],
        ['人物数量', a['人物数量']],
        ['镜头目的', asList(a['镜头目的'])],
        ['动作节点', asList(a['动作节点'])]
    ];
    const rowHtml = rows.filter(r => r[1]).map(r =>
        `<div class="sa-row"><span class="sa-key">${r[0]}</span><span class="sa-val">${escapeHtml(r[1])}</span></div>`).join('');
    const curve = a['情绪曲线'] ? `<div class="sa-curve">${escapeHtml(a['情绪曲线']).split(/\s*[→>]\s*/).filter(Boolean).map(nd => `<span class="sa-node">${nd}</span>`).join('<span class="sa-arrow">→</span>')}</div>` : '';
    return `
        <div class="scene-analysis">
            <div class="sa-head"><span class="sa-badge">剧情解析</span><span class="sa-src">${escapeHtml((cleanText || '').slice(0, 48))}${cleanText && cleanText.length > 48 ? '…' : ''}</span></div>
            <div class="sa-grid">${rowHtml}</div>
            ${curve ? `<div class="sa-row sa-curve-row"><span class="sa-key">情绪曲线</span>${curve}</div>` : ''}
        </div>`;
}

// 第二段：单个分镜卡片（九字段 + 分层示意图）
function renderShotCard(s, i) {
    const n = s['镜头'] || (i + 1);
    const size = s['景别'] || '', angle = s['机位'] || '', move = s['运镜'] || '';
    const diagram = getMotionIconByName(move);
    const fields = [
        ['人物表情', s['人物表情']],
        ['肢体动作', s['肢体动作']],
        ['灯光', s['灯光']],
        ['声音', s['声音']],
        ['禁止项', s['禁止项']]
    ];
    const fieldHtml = fields.filter(f => f[1]).map(f =>
        `<div class="sf-row ${f[0] === '禁止项' ? 'sf-forbid' : ''}"><span class="sf-key">${f[0]}</span><span class="sf-val">${escapeHtml(f[1])}</span></div>`).join('');
    const en = s['英文视频提示词'] || '';

    const fullText = [
        `镜头 ${n}`,
        `【景别】${size}　【机位】${angle}　【运镜】${move}`,
        s['人物表情'] ? `【人物表情】${s['人物表情']}` : '',
        s['肢体动作'] ? `【肢体动作】${s['肢体动作']}` : '',
        s['灯光'] ? `【灯光】${s['灯光']}` : '',
        s['声音'] ? `【声音】${s['声音']}` : '',
        en ? `【英文视频提示词】${en}` : '',
        s['禁止项'] ? `【禁止项】${s['禁止项']}` : ''
    ].filter(Boolean).join('\n');

    return `
        <div class="shot-card shot-card-v2">
            <div class="shot-header">
                <div class="shot-number">${n}</div>
                <div class="shot-badges">
                    <span class="shot-badge sb-size">${escapeHtml(size)}</span>
                    <span class="shot-badge sb-angle">${escapeHtml(angle)}</span>
                    <span class="shot-badge sb-move">${escapeHtml(move)}</span>
                    ${s['目的'] ? `<span class="shot-badge sb-purpose">${escapeHtml(s['目的'])}</span>` : ''}
                </div>
            </div>
            <div class="shot-body">
                <div class="shot-diagram">${diagram}<div class="shot-diagram-cap">${escapeHtml(move)}</div></div>
                <div class="shot-fields">${fieldHtml}</div>
            </div>
            ${en ? `<div class="shot-en"><span class="shot-en-tag">EN</span><span class="shot-en-text">${escapeHtml(en)}</span></div>` : ''}
            <div class="shot-prompt">
                <div class="shot-prompt-text" style="display:none">${escapeHtml(fullText)}</div>
                <button class="shot-prompt-copy" onclick="copyShotPrompt(this)">📋 复制此镜头</button>
            </div>
        </div>`;
}

// ===== 表情/肢体/血色库页（SVG动画版）=====
function initExpressions() {
    const grid = document.getElementById('expressions-grid');
    const filters = document.querySelectorAll('#panel-expressions .filter-btn');

    function render(filter) {
        let items = [];
        if (filter === 'all' || filter === 'face') {
            EXPRESSION_LIBRARY.face.items.forEach(e => items.push({ ...e, category: 'face', categoryLabel: '表情' }));
        }
        if (filter === 'all' || filter === 'body') {
            EXPRESSION_LIBRARY.body.items.forEach(e => items.push({ ...e, category: 'body', categoryLabel: '肢体' }));
        }
        if (filter === 'all' || filter === 'blood') {
            EXPRESSION_LIBRARY.bloodColor.items.forEach(e => items.push({ ...e, category: 'blood', categoryLabel: '血色' }));
        }

        grid.innerHTML = items.map(item => `
            <div class="exp-card" onclick="copyToClipboard('${item.prompt.replace(/'/g, "\\'")}'); showToast('已复制「${item.cn}」');">
                <span class="exp-card-tag">${item.categoryLabel}</span>
                <div class="exp-card-icon ${getAnimClass(item.id)}">
                    ${getSvgIcon(item.id, item.category)}
                </div>
                <div class="exp-card-name">${item.cn}</div>
                <div class="exp-card-desc">${item.prompt.slice(0, 40)}...</div>
            </div>
        `).join('');
    }

    render('all');
    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            render(btn.dataset.filter);
        });
    });
}

function getAnimClass(id) {
    const map = {
        cold_stare: 'anim-cold-stare', suppressed_anger: 'anim-suppressed-anger',
        fake_smile: 'anim-fake-smile', micro_fear: 'anim-micro-fear',
        contempt: 'anim-contempt', grief: 'anim-grief',
        shock: 'anim-shock', disgust: 'anim-disgust',
        determination: 'anim-determination', vulnerability: 'anim-vulnerability',
        calculating: 'anim-calculating', relief: 'anim-relief',
        power_lean: 'anim-power-lean', defensive_cross: 'anim-defensive-cross',
        nervous_hands: 'anim-nervous-hands', controlled_still: 'anim-controlled-still',
        collapse_lean: 'anim-relief', threat_stand: 'anim-threat-stand',
        exit_turn: 'anim-exit-turn', finger_point: 'anim-power-lean',
        fist_clench: 'anim-fist-clench', head_drop: 'anim-head-drop',
        smoke_exhale: 'anim-relief', glass_swirl: 'anim-nervous-hands',
        flush_anger: 'anim-flush-anger', pale_shock: 'anim-pale-shock',
        cold_sweat: 'anim-cold-sweat', drunk_flush: 'anim-drunk-flush',
        exhaustion_gray: 'anim-exhaustion-gray', arousal_glow: 'anim-arousal-glow',
        dying_ashen: 'anim-dying-ashen', power_composure: 'anim-power-composure'
    };
    return map[id] || '';
}

function getSvgIcon(id, category) {
    if (category === 'face') return getFaceSvg(id);
    if (category === 'body') return getBodySvg(id);
    if (category === 'blood') return getBloodSvg(id);
    return '';
}

function getFaceSvg(id) {
    // 基础面部轮廓 + 针对每个表情的差异部分
    const base = `<ellipse cx="32" cy="34" rx="18" ry="20" class="face-outline"/>`;
    const icons = {
        cold_stare: `${base}<line x1="24" y1="30" x2="30" y2="30" class="eye-line"/><line x1="34" y1="30" x2="40" y2="30" class="eye-line"/><line x1="27" y1="40" x2="37" y2="40" class="mouth"/>`,
        suppressed_anger: `${base}<line x1="23" y1="26" x2="29" y2="28" class="brow"/><line x1="35" y1="28" x2="41" y2="26" class="brow"/><circle cx="27" cy="32" r="2"/><circle cx="37" cy="32" r="2"/><path d="M28 42 Q32 40 36 42" class="mouth"/>`,
        fake_smile: `${base}<circle cx="27" cy="30" r="2"/><circle cx="37" cy="30" r="2"/><path d="M25 39 Q32 44 39 39" class="mouth"/>`,
        micro_fear: `${base}<circle cx="27" cy="30" r="2.5" class="pupil"/><circle cx="37" cy="30" r="2.5" class="pupil"/><ellipse cx="32" cy="42" rx="3" ry="2" class="mouth"/>`,
        contempt: `${base}<circle cx="27" cy="30" r="2"/><circle cx="37" cy="30" r="1.8"/><path d="M28 40 Q32 40 36 38" class="mouth-corner"/>`,
        grief: `${base}<path d="M23 26 Q26 29 30 27" class="brow"/><path d="M34 27 Q38 29 41 26" class="brow"/><circle cx="27" cy="32" r="2"/><circle cx="37" cy="32" r="2"/><path d="M28 43 Q32 45 36 43" class="mouth"/>`,
        shock: `${base}<circle cx="27" cy="30" r="3"/><circle cx="37" cy="30" r="3"/><ellipse cx="32" cy="43" rx="4" ry="3"/>`,
        disgust: `${base}<path d="M26 28 Q28 26 30 28" class="brow"/><path d="M34 28 Q36 26 38 28" class="brow"/><path d="M30 36 Q32 34 34 36" class="nose"/><path d="M27 42 Q32 44 37 42"/>`,
        determination: `${base}<line x1="23" y1="28" x2="30" y2="28" class="brow"/><line x1="34" y1="28" x2="41" y2="28" class="brow"/><circle cx="27" cy="32" r="2"/><circle cx="37" cy="32" r="2"/><line x1="28" y1="42" x2="36" y2="42" class="jaw"/>`,
        vulnerability: `${base}<path d="M24 27 Q27 29 30 28"/><path d="M34 28 Q37 29 40 27"/><circle cx="27" cy="32" r="2.5"/><circle cx="37" cy="32" r="2.5"/><path d="M29 42 Q32 43 35 42"/>`,
        calculating: `${base}<circle cx="27" cy="30" r="2" class="pupil"/><circle cx="37" cy="30" r="2" class="pupil"/><path d="M29 41 Q32 40 35 41 Q33 42 29 41"/>`,
        relief: `${base}<path d="M24 29 Q27 30 30 29"/><path d="M34 29 Q37 30 40 29"/><circle cx="27" cy="32" r="1.5"/><circle cx="37" cy="32" r="1.5"/><path d="M28 41 Q32 43 36 41"/>`
    };
    return `<svg viewBox="0 0 64 64">${icons[id] || icons.cold_stare}</svg>`;
}

function getBodySvg(id) {
    const icons = {
        power_lean: `<circle cx="32" cy="14" r="6"/><line x1="32" y1="20" x2="32" y2="38" class="body"/><line x1="32" y1="38" x2="26" y2="54"/><line x1="32" y1="38" x2="38" y2="54"/><line x1="32" y1="26" x2="22" y2="34"/><line x1="32" y1="26" x2="42" y2="34"/>`,
        defensive_cross: `<circle cx="32" cy="14" r="6"/><line x1="32" y1="20" x2="32" y2="40"/><line x1="32" y1="40" x2="26" y2="56"/><line x1="32" y1="40" x2="38" y2="56"/><path d="M24 30 Q32 34 40 30" class="arms"/>`,
        nervous_hands: `<circle cx="32" cy="16" r="5"/><line x1="32" y1="21" x2="32" y2="38"/><line x1="32" y1="38" x2="27" y2="52"/><line x1="32" y1="38" x2="37" y2="52"/><path d="M28 34 L32 36 L36 34" class="hand"/><path d="M29 36 L32 38 L35 36" class="hand"/>`,
        controlled_still: `<circle cx="32" cy="14" r="6"/><line x1="32" y1="20" x2="32" y2="40"/><line x1="32" y1="40" x2="27" y2="56"/><line x1="32" y1="40" x2="37" y2="56"/><line x1="32" y1="26" x2="24" y2="36"/><line x1="32" y1="26" x2="40" y2="36"/><ellipse cx="32" cy="32" rx="6" ry="8" opacity="0.15" class="chest"/>`,
        collapse_lean: `<circle cx="34" cy="16" r="5"/><path d="M34 21 Q36 30 34 40" class="body"/><line x1="34" y1="40" x2="28" y2="54"/><line x1="34" y1="40" x2="40" y2="54"/><path d="M34 26 Q28 32 24 38"/><path d="M34 26 Q40 30 44 28"/>`,
        threat_stand: `<circle cx="32" cy="12" r="6"/><line x1="32" y1="18" x2="32" y2="36" class="body"/><line x1="32" y1="36" x2="26" y2="54"/><line x1="32" y1="36" x2="38" y2="54"/><line x1="32" y1="24" x2="20" y2="32"/><line x1="32" y1="24" x2="44" y2="32"/><line x1="18" y1="32" x2="20" y2="32"/><line x1="44" y1="32" x2="46" y2="32"/>`,
        exit_turn: `<circle cx="32" cy="14" r="6"/><line x1="32" y1="20" x2="32" y2="38" class="body"/><line x1="32" y1="38" x2="28" y2="54"/><line x1="32" y1="38" x2="36" y2="54"/><line x1="32" y1="26" x2="24" y2="20"/><line x1="32" y1="26" x2="40" y2="32"/>`,
        finger_point: `<circle cx="28" cy="14" r="6"/><line x1="28" y1="20" x2="28" y2="38" class="body"/><line x1="28" y1="38" x2="24" y2="54"/><line x1="28" y1="38" x2="32" y2="54"/><line x1="28" y1="26" x2="50" y2="22"/><circle cx="52" cy="22" r="1.5"/>`,
        fist_clench: `<circle cx="32" cy="14" r="6"/><line x1="32" y1="20" x2="32" y2="38"/><line x1="32" y1="38" x2="27" y2="54"/><line x1="32" y1="38" x2="37" y2="54"/><line x1="32" y1="26" x2="24" y2="34"/><rect x="20" y="33" width="6" height="5" rx="2" class="fist"/>`,
        head_drop: `<circle cx="32" cy="18" r="6" class="head"/><line x1="32" y1="24" x2="32" y2="40"/><line x1="32" y1="40" x2="27" y2="54"/><line x1="32" y1="40" x2="37" y2="54"/><line x1="32" y1="28" x2="24" y2="36"/><line x1="32" y1="28" x2="40" y2="36"/>`,
        smoke_exhale: `<circle cx="28" cy="14" r="6"/><line x1="28" y1="20" x2="28" y2="38"/><line x1="28" y1="38" x2="24" y2="54"/><line x1="28" y1="38" x2="32" y2="54"/><line x1="28" y1="26" x2="38" y2="22"/><path d="M40 18 Q42 14 40 10 Q44 8 42 4" stroke-dasharray="2 2" opacity="0.5"/>`,
        glass_swirl: `<circle cx="28" cy="14" r="6"/><line x1="28" y1="20" x2="28" y2="38"/><line x1="28" y1="38" x2="24" y2="54"/><line x1="28" y1="38" x2="32" y2="54"/><line x1="28" y1="28" x2="40" y2="32"/><path d="M38 32 L38 44 L44 44 L44 32 Z" fill="none"/><ellipse cx="41" cy="38" rx="2" ry="1" opacity="0.4" class="hand"/>`
    };
    return `<svg viewBox="0 0 64 64">${icons[id] || icons.power_lean}</svg>`;
}

function getBloodSvg(id) {
    const base = `<ellipse cx="32" cy="32" rx="18" ry="22" class="face-outline"/>`;
    const icons = {
        flush_anger: `<defs><linearGradient id="flush_g_${id}" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="var(--text-secondary)"/><stop offset="100%" stop-color="var(--text-secondary)" class="face-fill"/></linearGradient></defs>${base}<rect x="14" y="28" width="36" height="20" rx="10" fill="rgba(231,76,60,0.2)" class="flush-overlay"/>`,
        pale_shock: `${base}<circle cx="26" cy="28" r="3"/><circle cx="38" cy="28" r="3"/><ellipse cx="32" cy="40" rx="3" ry="2"/>`,
        cold_sweat: `${base}<circle cx="26" cy="28" r="2"/><circle cx="38" cy="28" r="2"/><line x1="28" y1="38" x2="36" y2="38"/><circle cx="42" cy="24" r="1.5" fill="currentColor" class="sweat-drop"/><circle cx="22" cy="26" r="1" fill="currentColor" class="sweat-drop" style="animation-delay:0.5s"/>`,
        drunk_flush: `${base}<circle cx="26" cy="28" r="2"/><circle cx="38" cy="28" r="2"/><path d="M26 38 Q32 42 38 38"/><ellipse cx="24" cy="34" rx="4" ry="3" fill="rgba(255,107,107,0.3)" class="face-area"/><ellipse cx="40" cy="34" rx="4" ry="3" fill="rgba(255,107,107,0.3)" class="face-area"/>`,
        exhaustion_gray: `${base}<path d="M23 26 Q26 28 29 26"/><path d="M35 26 Q38 28 41 26"/><circle cx="26" cy="30" r="2"/><circle cx="38" cy="30" r="2"/><path d="M22 32 Q24 34 22 36" opacity="0.4"/><path d="M42 32 Q40 34 42 36" opacity="0.4"/><line x1="28" y1="40" x2="36" y2="40"/>`,
        arousal_glow: `${base}<circle cx="26" cy="28" r="2.5"/><circle cx="38" cy="28" r="2.5"/><path d="M28 39 Q32 42 36 39"/><ellipse cx="25" cy="34" rx="5" ry="3" fill="rgba(255,134,208,0.25)" class="cheek"/><ellipse cx="39" cy="34" rx="5" ry="3" fill="rgba(255,134,208,0.25)" class="cheek"/>`,
        dying_ashen: `${base}<line x1="24" y1="28" x2="28" y2="30"/><line x1="36" y1="30" x2="40" y2="28"/><circle cx="26" cy="32" r="1.5"/><circle cx="38" cy="32" r="1.5"/><line x1="28" y1="42" x2="36" y2="42"/>`,
        power_composure: `${base}<line x1="24" y1="28" x2="30" y2="28"/><line x1="34" y1="28" x2="40" y2="28"/><circle cx="27" cy="30" r="2"/><circle cx="37" cy="30" r="2"/><line x1="28" y1="40" x2="36" y2="40"/><line x1="22" y1="20" x2="26" y2="22" opacity="0.2" class="highlight"/>`
    };
    return `<svg viewBox="0 0 64 64">${icons[id] || icons.flush_anger}</svg>`;
}

// ===== 运镜库 =====
function initLibrary() {
    const grid = document.getElementById('library-grid');
    const filters = document.querySelectorAll('#panel-library .filter-btn');
    const allItems = [
        ...SHOT_SIZE_LIBRARY,
        ...CAMERA_ANGLE_LIBRARY,
        ...BASIC_MOVEMENTS, ...ADVANCED_TECHNIQUES, ...SEEDANCE_MOVEMENTS, ...DIALOGUE_SHOTS,
        ...DIALOGUE_CONFRONTATION_SHOTS.map(d => ({ ...d, effect: d.usage, seedance: d.prompt, category: 'dialogue_duo' })),
        ...EMOTION_MOVEMENTS.map(e => ({ ...e, desc: e.techniques, effect: e.example }))
    ];
    renderLibrary(allItems, grid);
    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const f = btn.dataset.filter;
            renderLibrary(f === 'all' ? allItems : allItems.filter(i => i.category === f), grid);
        });
    });
}

function renderLibrary(items, container) {
    container.innerHTML = items.map(item => `
        <div class="library-card" onclick="copyToClipboard('${(item.seedance || item.techniques || item.cn).replace(/'/g, "\\'")}'); showToast('已复制「${item.cn}」');">
            <div class="library-card-icon">${getMotionIcon(item.id)}</div>
            <div class="library-card-title">${item.cn}</div>
            <div class="library-card-en">${item.en || ''}</div>
            <div class="library-card-desc">${item.desc || ''}</div>
            ${item.effect ? `<div class="library-card-desc" style="margin-top:4px;color:var(--duo-green);">\u2192 ${item.effect}</div>` : ''}
        </div>
    `).join('');
}

function getCategoryEmoji(cat) {
    return '';
}

// ===== 调色盘 =====
function initColors() {
    const grid = document.getElementById('colors-grid');
    const filters = document.querySelectorAll('#panel-colors .filter-btn');
    renderColors(COLOR_PALETTES, grid);
    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const f = btn.dataset.filter;
            renderColors(f === 'all' ? COLOR_PALETTES : COLOR_PALETTES.filter(c => c.category === f), grid);
        });
    });
}

function renderColors(palettes, container) {
    container.innerHTML = palettes.map(p => `
        <div class="color-card" onclick="copyToClipboard('${p.prompt.replace(/'/g, "\\'")}'); showToast('已复制「${p.name}」');">
            <div class="color-card-swatch" style="background:linear-gradient(135deg,${p.colors.join(',')});"></div>
            <div class="color-card-name">${p.name}</div>
            <div class="color-card-prompt">${p.prompt}</div>
        </div>
    `).join('');
}

// ===== 工具 =====
function getItemPreviewForAt(type, name) {
    if (type === '景别') {
        const found = SHOT_SIZE_LIBRARY.find(s => s.cn === name);
        return found ? getMotionIcon(found.id) : '';
    }
    if (type === '机位') {
        const found = CAMERA_ANGLE_LIBRARY.find(a => a.cn === name);
        return found ? getMotionIcon(found.id) : '';
    }
    if (type === '运镜') {
        const allMov = [...BASIC_MOVEMENTS, ...ADVANCED_TECHNIQUES, ...SEEDANCE_MOVEMENTS, ...DIALOGUE_CONFRONTATION_SHOTS];
        const found = allMov.find(m => m.cn === name);
        return found ? getMotionIcon(found.id) : '';
    }
    if (type === '调色') {
        const found = COLOR_PALETTES.find(c => c.name === name);
        return found ? getColorPreview(found) : '';
    }
    if (type === '表情') {
        const found = EXPRESSION_LIBRARY.face.items.find(e => e.cn === name);
        return found ? `<div class="mi mi-expr">${getSvgIcon(found.id, 'face')}</div>` : '';
    }
    if (type === '肢体') {
        const found = EXPRESSION_LIBRARY.body.items.find(e => e.cn === name);
        return found ? `<div class="mi mi-expr">${getSvgIcon(found.id, 'body')}</div>` : '';
    }
    if (type === '血色') {
        const found = EXPRESSION_LIBRARY.bloodColor.items.find(e => e.cn === name);
        return found ? `<div class="mi mi-expr">${getSvgIcon(found.id, 'blood')}</div>` : '';
    }
    return '';
}

function copyShotPrompt(btn) { copyToClipboard(btn.previousElementSibling.textContent); showToast('已复制'); }
function copyToClipboard(text) { if (navigator.clipboard) { navigator.clipboard.writeText(text); } else { const t = document.createElement('textarea'); t.value = text; t.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t); } }
function showToast(msg) { let t = document.querySelector('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); } t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2000); }
