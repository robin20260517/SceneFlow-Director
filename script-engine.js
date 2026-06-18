// ============================================
// 导演台 — 剧本工坊引擎
// 一键生成微短剧剧本（海内 / 海外）
// API: poyo.ai（OpenAI 兼容），模型 claude-sonnet-4-6
// 方法论来源：github.com/0xsline/short-drama（micro-drama skill）
// ============================================

// 使用 poyo 的 Anthropic 原生 /v1/messages 端点（OpenAI 兼容端点会被 poyo 的
// agent/tool 外壳吞掉正文，原生端点可直接返回文本）
const POYO_CONFIG = {
    apiUrl: 'https://api.poyo.ai/v1/messages',
    apiKey: 'sk-62bui1RuWLtcbquQMzZx3OEKpMBaNrLCzLidrVEKnlVk3Jy8Chex3W8zwwa0XZ',
    model: 'claude-sonnet-4-6'
};

// === 题材库（海内 13 种）===
const SCRIPT_GENRES = [
    '都市情感', '霸道总裁', '甜宠', '重生穿越', '战神归来', '古装宫廷',
    '励志逆袭', '家庭伦理', '萌宝', '悬疑探案', '软科幻', '末日重生', '喜剧'
];
// === 出海爆款元素 ===
const SCRIPT_OVERSEAS = [
    'Billionaire Romance（亿万富翁）', 'Werewolf / Alpha（狼人）', 'Flash Marriage（闪婚）',
    'Secret Baby（隐藏继承人）', 'Revenge / Payback（复仇归来）', 'Hidden Identity（隐藏身份）',
    'Mafia / Dark Romance（黑帮暗黑）', 'Royal Romance（王室）', 'Fake Dating（假交往）',
    'Enemies to Lovers（仇人变爱人）', 'Second Chance（重逢旧爱）'
];
const SCRIPT_TONES = ['爽燃', '甜虐', '搞笑', '暗黑', '温情'];
const SCRIPT_ENDINGS = ['大团圆', '开放式', '反转式', '悲剧'];
const SCRIPT_AUDIENCES = ['男频', '女频', '全年龄'];
const SCRIPT_SCALES = [
    { v: '50', label: '50集（紧凑）' },
    { v: '60', label: '60集（标准）' },
    { v: '80', label: '80集（长线）' },
    { v: '100', label: '100集（超长）' }
];
const OVERSEAS_REGIONS = ['欧美', '东南亚', '中东'];

// === 短剧方法论知识库（自 short-drama/references 浓缩）===
const SCRIPT_KB = `
## 微短剧爆款方法论（必须严格遵守）

### 开篇黄金法则（前5秒定生死）
- 前5秒必须有画面冲击或悬念；前30秒完成"冲突/身份/困境"核心建立
- 首场出场角色不超过3个，几乎不用旁白，用画面叙事
- 6种开场模板：直接打脸型 / 身份反转型 / 极端困境型 / 倒叙悬念型 / 高甜钩子型 / 重生起始型

### 5大爽点类型（爽点是燃料，密度要高）
1. 身份碾压（军衔/证件/电话/财富/能力/关系碾压）
2. 打脸复仇（原话奉还/证据反杀/局中局/群众审判）
3. 逆袭翻盘（绝境翻盘/实力进阶/逆风翻盘/连环翻盘）
4. 情感爆发（告白/真相告白/误会冰释/久别重逢/牺牲揭露/爆发哭诉）
5. 悬念揭秘（身份/阴谋/关系/动机揭秘）

### 5种结尾钩子（每集结尾都是一道门，必带悬念）
- 悬念钩（身份/结果/选择/来者/发现）
- 反转钩（身份/局势/关系/时间/动机反转）
- 情绪钩（甜蜜中断/心碎中断/误会引爆/决绝中断/重逢中断）
- 信息钩（证据揭露/秘密泄露/记忆闪回/文件发现/线索串联）
- 危机钩（突袭/背刺/暴露/倒计时/绝境）

### 付费卡点规划（💰）
- 首个卡点 第8-12集（最强悬念）；第二卡点 第18-25集（身份揭露/反转）
- 第三卡点 第35-45集（感情线高潮）；终极卡点 倒数3-5集（终极对决前）
- 💰集结尾必须强悬念；🔥集=重大转折/高潮/揭秘

### 全剧节奏波形（四阶段）
- 起势段(前15%)：极快建立困境+第一个爽点
- 攀升段(15-45%)：冲突升级，甜虐/打脸交替
- 风暴段(45-80%)：连环反转，最高潮密集
- 决战段(最后20%)：终极对决+伏笔回收+收束

### 单集微结构（1-3分钟）
- 前30秒：钩子段（承接上集悬念+本集新冲突）
- 中间1-1.5分钟：冲突升级段
- 最后30秒：爽点或钩子段（结尾必留悬念）

### 海外（出海）特别规则
- 用好莱坞行业格式：INT./EXT. LOCATION - DAY/NIGHT；WIDE/MEDIUM/CLOSE-UP SHOT
- 英文台词地道：用缩写(I'm/don't)、口语语气词(Well/Look/Honestly?)、对话短快
- 避免中式陷阱：不用"孝道绑架/跪地道歉/重男轻女/扇耳光"，改为经济控制/情感操纵/资源碾压/语言打脸
- 文化本地化：慈善晚宴/法庭/圣诞聚会、黑卡/家族信托/律师函/私人飞机
- 欧美S级元素：Billionaire、Werewolf/Alpha、Flash Marriage、Secret Baby
`;

// === 构建系统提示词 ===
function buildScriptSystemPrompt(opts) {
    const { mode, genre, tone, ending, audience, scale, region, firstN } = opts;
    const overseas = mode === 'overseas';

    let p = `你是一位顶级微短剧编剧，精通爆款短剧创作方法论。用户给你一个故事灵感，你要一键产出一份可直接投入制作的完整短剧剧本包。\n`;
    p += SCRIPT_KB;

    p += `\n## 本次创作配置\n`;
    p += `- 模式：${overseas ? '海外出海（English，好莱坞格式）' : '海内（中文，国内标准剧本格式）'}\n`;
    if (overseas && region) p += `- 目标市场：${region}（参考 ReelShort / DramaBox）\n`;
    p += `- 题材：${genre || '由你根据灵感判断最合适的题材（可叠加2-3种）'}\n`;
    p += `- 故事基调：${tone}\n- 结局类型：${ending}\n- 目标受众：${audience}\n- 集数规模：${scale}集\n`;
    p += `- 本次完整写出前 ${firstN} 集剧本\n`;

    p += `\n## 输出要求：一次性输出一份 Markdown 文档，严格按以下结构（${overseas ? '全英文' : '全中文'}），不要任何额外解释：\n`;

    if (!overseas) {
        p += `
# 📺 {剧名}

## 一、创作方案
- **剧名备选**：3个，各附一句话说明
- **时空背景**：时代/地点/社会环境/阶层关系
- **一句话故事线** + **核心冲突**
- **三幕结构**：第一幕(建置,集数范围) / 第二幕(对抗) / 第三幕(高潮结局)，各注明核心事件
- **付费卡点规划**：列出 4 个卡点的集数+类型+悬念
- **爽点分布**：全剧主要爽点节奏

## 二、主要角色
为每个主要角色（3-5个，含至少一个反派）输出：姓名/年龄/外貌(2句)/性格关键词/公开身份vs真实身份/核心动机/最大冲突/承担的爽点/口头禅。反派按"小反派→中反派→大反派→隐藏反派"层次设计。

## 三、分集目录（共 ${scale} 集，每集一行）
格式：第N集：{集标题} —— {核心冲突或爽点一句话} {🔥关键集/💰付费卡点/无标记}
要求：前10集至少3个🔥+2个💰；🔥占25-35%，💰占10-15%；体现三幕节奏。

## 四、前 ${firstN} 集完整剧本
每集严格按此格式：
# 第{N}集：{集标题}
> 本集关键词：{3个}  ｜ 本集爽点：{类型} ｜ 前情提要：{1-2句}
## 场次一
**场景：** 内景/外景 · {地点} · 日/夜
**出场人物：** {列表}
△ （全景）{环境描写}
△ （中景）{动作描写}
**{角色}**（{语气/动作}）："{台词}"
△ （特写）{关键细节}
♪ 音乐提示：{氛围}
...（每集3-5个场次，≥800字，至少用全景/中景/近景/特写中3种景别）
> 🎣 本集钩子：{悬念} ｜ 📺 下集预告：{1句}
`;
    } else {
        p += `
# 📺 {TITLE}

## 1. Creative Plan
- **Title options**: 3, each with a one-line note
- **Setting**: era / location / social world / class dynamics
- **Logline** + **Central Conflict**
- **Three-Act Structure**: Act 1 (setup, episode range) / Act 2 (confrontation) / Act 3 (climax & ending)
- **Paywall Points**: 4 points with episode number + type + cliffhanger
- **Satisfaction Beats**: overall payoff rhythm

## 2. Main Characters
For each main character (3-5, incl. at least one villain): Name / Age / Appearance (2 lines) / Personality keywords / Public vs True identity / Core motivation / Biggest conflict / Satisfaction role / Catchphrase. Villains layered: minor → mid → big boss → hidden.

## 3. Episode Directory ({scale} episodes, one line each)
Format: Episode N: {Title} —— {core conflict / payoff in one line} {🔥key / 💰paywall / none}
Rules: first 10 eps ≥3 🔥 + 2 💰; 🔥 = 25-35%, 💰 = 10-15%; reflect 3-act rhythm.

## 4. First ${firstN} Full Episodes
Each episode strictly:
# Episode {N}: {Title}
> Key Words: {3} | Hook Type: {type} | Previously: {1-2 sentences}
## Scene 1
**INT./EXT. {LOCATION} - DAY/NIGHT**
**Characters: {list}**
WIDE SHOT - {scene description}
MEDIUM SHOT - {action}
**{CHARACTER}** ({tone/action}): "{dialogue}"
CLOSE-UP - {key detail}
♪ Music cue: {atmosphere}
...(3-5 scenes per episode, 600+ words, use ≥3 of WIDE/MEDIUM/CLOSE-UP)
> 🎣 End Hook: {cliffhanger} | 📺 Next: {1 line}
`;
    }
    if (!overseas) {
        p += `\n\n【硬性要求 · 必须遵守】
1. 文档必须且只能包含四个部分，二级标题严格用：「## 一、创作方案」「## 二、主要角色」「## 三、分集目录」「## 四、前 ${firstN} 集完整剧本」。不得自创"项目总览/剧情大纲/人物设定表"等替代结构。
2. 第四部分必须是逐场次的【完整剧本】——含场景头、△景别动作、角色台词、♪音乐、🎣钩子，严禁用大纲/概述/省略号代替。每集 ≥3 个场次、≥800字。
3. 第1集前3段必须立刻抓住观众。把篇幅重点放在第四部分的完整剧本上。`;
    } else {
        p += `\n\n【HARD REQUIREMENTS】
1. The doc must contain EXACTLY four sections with these H2 headers: "## 1. Creative Plan", "## 2. Main Characters", "## 3. Episode Directory", "## 4. First ${firstN} Full Episodes". Do NOT invent alternative structures.
2. Section 4 must be FULL screenplay (scene headings, WIDE/MEDIUM/CLOSE-UP, dialogue, music cue, end hook) — never an outline or summary. Each episode ≥3 scenes, ≥600 words.
3. Episode 1 must hook viewers in the first 3 beats. Put most of your length into Section 4.`;
    }
    return p;
}

// 单次调用 poyo 原生 messages 端点，返回拼接后的文本（可能为空）
async function _callPoyoMessages(systemPrompt, userMsg) {
    const body = {
        model: POYO_CONFIG.model,
        max_tokens: 8000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMsg }],
        // poyo 默认注入一套 agent 工具，会让模型走 tool_use 而不返回正文；
        // 空 tools + tool_choice:none 强制纯文本（偶尔仍会触发，外层用重试兜底）
        tools: [],
        tool_choice: { type: 'none' }
    };
    const resp = await fetch(POYO_CONFIG.apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': POYO_CONFIG.apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify(body)
    });
    if (!resp.ok) {
        const t = await resp.text();
        throw new Error(`API ${resp.status}: ${t.slice(0, 300)}`);
    }
    const data = await resp.json();
    const blocks = Array.isArray(data.content) ? data.content : [];
    const text = blocks.filter(b => b.type === 'text').map(b => b.text).join('').trim();
    return { text, stop: data.stop_reason, usage: data.usage, error: data.error };
}

// === 一键生成（带重试，应对 poyo 偶发 tool_use 空返回）===
async function generateDramaScript(idea, opts, onProgress) {
    const systemPrompt = buildScriptSystemPrompt(opts);
    const userMsg = (opts.mode === 'overseas')
        ? `Story idea / premise:\n${idea}\n\nOutput ONLY the markdown script document. Do not call any tools.`
        : `故事灵感 / 设定：\n${idea}\n\n现在一键生成完整短剧剧本包。只输出 Markdown 正文，不要调用任何工具。`;

    let lastErr = '返回为空';
    for (let attempt = 1; attempt <= 4; attempt++) {
        try {
            if (onProgress) onProgress(attempt);
            const r = await _callPoyoMessages(systemPrompt, userMsg);
            if (r.text) return { success: true, markdown: r.text, usage: r.usage };
            lastErr = r.error?.message || `模型未返回正文（stop=${r.stop}）`;
        } catch (e) {
            lastErr = e.message;
            console.error(`poyo attempt ${attempt} error:`, e);
            if (/API 4\d\d/.test(e.message)) break; // 鉴权/请求错误不重试
        }
    }
    return { success: false, error: lastErr };
}
