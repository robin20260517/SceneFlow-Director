// ============================================
// 导演台 — AI 引擎（Deepseek API）v4
// 两段式结构化输出：先 scene_analysis（剧情解析），再 shot_plan（分镜计划）
// 以 CINEMA_KB 运镜知识库为约束，输出可直接喂给视频模型的分镜
// ============================================

const AI_CONFIG = {
    apiUrl: 'https://api.deepseek.com/chat/completions',
    apiKey: 'sk-de9e408cc4304b619e09e42c1350ab58',
    model: 'deepseek-chat'
};

// 把 CINEMA_KB 压成紧凑的枚举/规则文本，注入系统提示词，让模型"按知识库选择"
function buildKbReference() {
    const kb = (typeof CINEMA_KB !== 'undefined') ? CINEMA_KB : null;
    if (!kb) return '';

    const shotLines = Object.entries(kb.shotSizes)
        .map(([cn, v]) => `  - ${cn}（${v.en}）→ 用途：${v.purpose}；${v.use}`).join('\n');
    const angleLines = Object.entries(kb.cameraAngles)
        .map(([cn, v]) => `  - ${cn}（${v.en}）→ ${v.feel}：${v.use}`).join('\n');
    const moveLines = Object.entries(kb.cameraMoves)
        .map(([cn, v]) => `  - ${cn}（${v.en}）→ 触发：${v.trigger}；效果：${v.effect}`).join('\n');
    const compLines = Object.entries(kb.compositionRules)
        .map(([k, v]) => {
            const parts = [];
            if (v.shotSize) parts.push(`景别=${v.shotSize.join('/')}`);
            if (v.angle) parts.push(`机位=${v.angle}`);
            if (v.move) parts.push(`运镜=${v.move}`);
            if (v.extra) parts.push(`附加=${v.extra}`);
            return `  - ${k}：${parts.join('，')}（${v.note}）`;
        }).join('\n');
    const emoLines = Object.entries(kb.emotionToCamera)
        .map(([k, v]) => `  - ${k}：景别=${v.shotSize}，机位=${v.angle}，运镜=${v.move}，灯光=${v.light}，声音=${v.sound}`).join('\n');
    const perfLines = Object.entries(kb.emotionPerformance)
        .map(([k, v]) => `  - ${k}：表情「${v.face}」；肢体「${v.body}」`).join('\n');
    const sceneLines = Object.entries(kb.sceneTypeToShotPlan)
        .map(([k, v]) => `  - ${v.label}：情绪曲线「${v.emotionCurve}」，建议 ${v.shots.length} 个镜头`).join('\n');

    return `
====== 运镜知识库 CINEMA_KB（必须据此选择，不得臆造术语）======

【景别 shotSizes（镜头目的）】
${shotLines}

【机位 cameraAngles（心理语义）】
${angleLines}

【运镜 cameraMoves（触发场景）】
${moveLines}

【构图/对峙规则 compositionRules】
${compLines}

【情绪 → 镜头映射 emotionToCamera】
${emoLines}

【情绪 → 表情/肢体 表演库】
${perfLines}

【剧情类型 → 分镜骨架 sceneTypeToShotPlan】
${sceneLines}
====== 知识库结束 ======
`;
}

// 构建结构化系统提示词：要求严格 JSON（scene_analysis + shot_plan）
function buildStructuredSystemPrompt(options) {
    const {
        videoModel = 'seedance', characterCount = 'auto', lipSync = true,
        lockContinuity = true, antiCollapse = true, directorStyle = 'auto', mentions = null
    } = options;

    const model = (typeof VIDEO_MODELS !== 'undefined' && VIDEO_MODELS[videoModel]) || { name: videoModel, maxDuration: '—', lipSync: false };

    let p = `你是一位资深电影分镜师 + 视频生成提示词专家。用户会给你一段剧情，你要分两步工作：

【第一步：剧情解析 scene_analysis】
从剧情中识别并输出：
- 剧情类型：从「动作 / 对话 / 悬疑 / 恐怖 / 情绪爆发 / 广告CTA / 世界杯冲突」中选最贴切的一个
- 场景地点：从「室内 / 室外 / 街道 / 球场 / 酒吧 / 飞机 / 仓库」等中识别，或据原文概括
- 人物数量：单人 / 双人 / 群像 / 主角+背景人群
- 情绪曲线：用「→」连接的情绪节点，如「平静 → 紧张 → 爆发 → 余韵」
- 动作节点：数组，从「进入 / 停顿 / 观察 / 冲突 / 反应 / 结果」等中按顺序列出
- 镜头目的：数组，从「建立环境 / 强化压迫 / 展示动作 / 放大情绪 / 制造反转」中列出本段需要的

【第二步：分镜计划 shot_plan】
基于第一步的解析 + 知识库规则，输出一组镜头（一般 5-6 个，依剧情复杂度增减）。
每个镜头必须且只能包含以下字段（中文键名，值用中文，英文提示词用英文）：
- 景别：从知识库景别中选
- 机位：从知识库机位中选
- 运镜：从知识库运镜中选
- 人物表情：面部肌肉/眼神/嘴唇的具体状态（参考表演库，可细化）
- 肢体动作：身体姿态/手部/重心的具体描述
- 灯光：光源方向、硬软、色温、明暗分布
- 声音：环境声 + 动作声 + 情绪声的具体组合（可听见的声音，非抽象概念）
- 英文视频提示词：一句可直接喂给 ${model.name} 的英文 prompt，需含 shot size / camera angle / camera move / subject action / lighting / mood
- 禁止项：本镜头要避免的崩坏点

【输出格式：严格 JSON，不要任何解释或 markdown 代码块包裹】
{
  "scene_analysis": {
    "剧情类型": "", "场景地点": "", "人物数量": "",
    "情绪曲线": "", "动作节点": [], "镜头目的": []
  },
  "shot_plan": [
    {
      "镜头": 1, "景别": "", "机位": "", "运镜": "",
      "人物表情": "", "肢体动作": "", "灯光": "", "声音": "",
      "英文视频提示词": "", "禁止项": ""
    }
  ]
}

## 核心规则：
1. 镜头顺序服从情绪曲线：建立环境→展示动作/关系→放大情绪→强化压迫/反转→余韵
2. 运镜必须服务叙事——平静别用急推/手持，混乱别用固定摇
3. 灯光/声音要具体可感，表情/肢体细到肌肉级
4. 英文提示词务必包含景别+机位+运镜+动作+光线+情绪关键词
5. 只输出 JSON，键名严格一致，不要多字段不要少字段`;

    p += `\n\n【视频模型】${model.name}（最长 ${model.maxDuration}）`;
    if (typeof CHARACTER_COUNT_RULES !== 'undefined' && CHARACTER_COUNT_RULES[characterCount]) {
        p += `\n【清晰人物数】${CHARACTER_COUNT_RULES[characterCount].prompt_append || ''}`;
    }

    // 防崩 / 连续性 / 口型 → 统一并入"禁止项"与提示词约束
    const globalForbid = [];
    if (antiCollapse) globalForbid.push('人物消失/角色替换/无逻辑跳切/静态照片感/背景完全不动/多余人物闯入');
    if (lockContinuity) globalForbid.push('角色外貌/服装/光线方向前后不一致');
    if (lipSync && model.lipSync) p += `\n【口型】有台词时按说话/倾听/停顿描述嘴部动作`;
    if (globalForbid.length) p += `\n【全局禁止项（每个镜头的"禁止项"都应涵盖）】${globalForbid.join('；')}`;

    // 导演风格注入
    if (directorStyle && directorStyle !== 'auto' && typeof DIRECTOR_STYLES !== 'undefined' && DIRECTOR_STYLES[directorStyle]) {
        const ds = DIRECTOR_STYLES[directorStyle];
        p += `\n\n## 导演风格约束：以「${ds.name}」的视觉语言重新诠释全部镜头
- 风格：${ds.signature}；调色：${ds.colorTone}
- 节奏：${ds.rhythm}；景别偏好：${ds.shotPreference}
- 构图：${ds.composition}；灯光：${ds.lighting}；声音：${ds.sound}；皮肤/面部：${ds.skin}
即使是日常/温馨场景，也要用 ${ds.name} 的方式呈现。`;
    }

    // 知识库注入
    p += '\n' + buildKbReference();

    // 用户 @ 手动指定 → 强制覆盖
    if (mentions) {
        const overrides = [];
        if (mentions.shotSizes && mentions.shotSizes.length) overrides.push(`景别优先用「${mentions.shotSizes[0].cn}」`);
        if (mentions.angles && mentions.angles.length) overrides.push(`机位优先用「${mentions.angles[0].cn}」`);
        if (mentions.movements && mentions.movements.length) overrides.push(`运镜优先用「${mentions.movements[0].cn}」`);
        if (mentions.expressions && mentions.expressions.length) overrides.push(`人物表情须含：${mentions.expressions.map(e => e.prompt).join(' ')}`);
        if (mentions.bodies && mentions.bodies.length) overrides.push(`肢体动作须含：${mentions.bodies.map(e => e.prompt).join(' ')}`);
        if (mentions.colors && mentions.colors.length) overrides.push(`灯光/调色倾向：${mentions.colors[0].prompt}`);
        if (overrides.length) p += `\n\n## 用户已手动指定（关键镜头必须采用，不可覆盖）：\n- ${overrides.join('\n- ')}`;
    }

    return p;
}

// 解析模型返回的 JSON（容错：去除 ```json 包裹、截取首尾大括号）
function parseStructuredOutput(content) {
    if (!content) return null;
    let txt = content.trim();
    // 去掉 markdown 代码块
    txt = txt.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    // 截取第一个 { 到最后一个 }
    const first = txt.indexOf('{');
    const last = txt.lastIndexOf('}');
    if (first === -1 || last === -1) return null;
    const slice = txt.slice(first, last + 1);
    try {
        const obj = JSON.parse(slice);
        if (!obj.shot_plan || !Array.isArray(obj.shot_plan)) return null;
        return obj;
    } catch (e) {
        console.error('JSON 解析失败:', e, slice);
        return null;
    }
}

// 主调用：返回 { success, analysis, shots, raw }
async function callDeepseekStructured(userInput, mentions, options) {
    const systemPrompt = buildStructuredSystemPrompt({ ...options, mentions });

    const requestBody = {
        model: AI_CONFIG.model,
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `剧情：\n${userInput}` }
        ],
        temperature: 0.7,
        max_tokens: 3000,
        response_format: { type: 'json_object' }
    };

    try {
        const response = await fetch(AI_CONFIG.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AI_CONFIG.apiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`API ${response.status}: ${errText}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        const parsed = parseStructuredOutput(content);
        if (!parsed) return { success: false, error: '返回格式无法解析', raw: content };
        return { success: true, analysis: parsed.scene_analysis || {}, shots: parsed.shot_plan || [], raw: content };
    } catch (error) {
        console.error('Deepseek API error:', error);
        return { success: false, error: error.message };
    }
}

// ====== 本地兜底：AI 不可用时，用 CINEMA_KB 直接拼出结构化分镜 ======

// 极简关键词识别剧情类型（仅兜底用）
function detectSceneType(text) {
    const t = text || '';
    const rules = [
        ['世界杯冲突', /世界杯|球场|球员|比分|进球|裁判|球迷|点球/],
        ['恐怖', /恐怖|鬼|尸|血腥|诡异|阴森|颤抖|惊悚/],
        ['悬疑', /悬疑|线索|真相|谜|侦探|跟踪|秘密|证据/],
        ['情绪爆发', /崩溃|痛哭|嘶吼|爆发|绝望|失控|质问/],
        ['广告CTA', /产品|品牌|立即|购买|下单|优惠|广告|限时/],
        ['动作', /追逐|打斗|奔跑|枪|爆炸|逃|搏斗|冲撞/],
        ['对话', /说|问|答|谈|对视|沉默|开口|交谈/]
    ];
    for (const [type, re] of rules) if (re.test(t)) return type;
    return '对话';
}

function buildLocalStructured(userInput, mentions, options) {
    const kb = CINEMA_KB;
    const type = detectSceneType(userInput);
    const plan = kb.sceneTypeToShotPlan[type] || kb.sceneTypeToShotPlan['对话'];
    const model = (typeof VIDEO_MODELS !== 'undefined' && VIDEO_MODELS[options.videoModel]) || { name: options.videoModel };

    const forbid = [];
    if (options.antiCollapse) forbid.push('禁止人物消失/角色替换/跳切/照片感/背景静止');
    if (options.lockContinuity) forbid.push('角色外貌/服装/光线全程一致');
    const forbidText = forbid.join('；') || '保持画面逻辑连贯';

    const shots = plan.shots.map((s, i) => {
        const emo = kb.emotionToCamera[s.情绪] || {};
        const exprId = emo.expr;
        const bodyId = emo.body;
        const exprObj = exprId && findExprById(exprId);
        const bodyObj = bodyId && findBodyById(bodyId);
        const moveObj = kb.cameraMoves[s.运镜] || {};
        const sizeObj = kb.shotSizes[s.景别] || {};
        const angleObj = kb.cameraAngles[s.机位] || {};
        // 英文提示词拼装
        const en = [
            sizeObj.en || s.景别,
            angleObj.en || s.机位,
            moveObj.en || s.运镜,
            'cinematic', 'detailed face', 'film lighting'
        ].join(', ');
        return {
            镜头: i + 1,
            景别: s.景别,
            机位: s.机位,
            运镜: s.运镜,
            目的: s.目的,
            人物表情: exprObj ? exprObj.prompt : (emo.expr || '随情绪自然变化'),
            肢体动作: bodyObj ? bodyObj.prompt : '随动作节点自然变化',
            灯光: emo.light || '自然光，柔和过渡',
            声音: emo.sound || '环境声为主',
            英文视频提示词: en,
            禁止项: forbidText
        };
    });

    const analysis = {
        剧情类型: plan.label,
        场景地点: '据原文',
        人物数量: options.characterCount === 'crowd' ? '主角+背景人群' : (options.characterCount === '1' ? '单人' : (options.characterCount === '2' ? '双人' : '据原文')),
        情绪曲线: plan.emotionCurve,
        动作节点: ['进入', '观察', '冲突', '反应', '结果'],
        镜头目的: [...new Set(shots.map(s => mapPurposeLabel(s.目的)))]
    };

    return { success: true, analysis, shots, local: true };
}

function mapPurposeLabel(purpose) {
    const map = {
        '建立环境': '建立环境', '人物动作关系': '展示动作', '展示动作': '展示动作',
        '情绪变化': '放大情绪', '心理压迫': '强化压迫', '强化压迫': '强化压迫',
        '震撼登场': '展示动作', '对峙': '强化压迫', '混乱': '展示动作',
        '关键物件': '放大情绪', '信息揭露': '制造反转', '神圣感': '放大情绪',
        '恐惧感': '强化压迫'
    };
    return map[purpose] || purpose;
}

function findExprById(id) {
    if (typeof EXPRESSION_LIBRARY === 'undefined') return null;
    return EXPRESSION_LIBRARY.face.items.find(e => e.id === id) || null;
}
function findBodyById(id) {
    if (typeof EXPRESSION_LIBRARY === 'undefined') return null;
    return EXPRESSION_LIBRARY.body.items.find(e => e.id === id) || null;
}

// 统一入口：先试 AI，失败回退本地知识库
async function generateShotPlan(userInput, mentions, options) {
    const ai = await callDeepseekStructured(userInput, mentions, options);
    if (ai.success && ai.shots.length) return ai;
    const local = buildLocalStructured(userInput, mentions, options);
    local.fallbackReason = ai.error || '返回为空';
    return local;
}
