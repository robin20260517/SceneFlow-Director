// ============================================
// 导演台 — AI 引擎（Deepseek API）
// 真正的语义理解，替代硬编码关键词匹配
// ============================================

const AI_CONFIG = {
    apiUrl: 'https://api.deepseek.com/chat/completions',
    apiKey: 'sk-de9e408cc4304b619e09e42c1350ab58',
    model: 'deepseek-chat'
};

// 构建系统提示词
function buildSystemPrompt(mentions, videoModel, characterCount, lipSync, lockContinuity, antiCollapse, directorStyle) {
    const model = VIDEO_MODELS[videoModel];
    
    let systemPrompt = `你是一位资深电影分镜师和视频生成提示词专家。用户会给你一段剧情描述，你需要分析场景氛围，输出一条精准的视频生成提示词。

## 输出格式（严格按此格式，每行一个标签，中文输出）：

【场景】用户原文内容（保留台词原文）
【运镜】运镜名称: 具体的运镜描述指令（描述镜头如何运动）
【调色】色调名称: 具体调色描述（色彩倾向、饱和度、明度、氛围）
【面部表情】面部肌肉、眼神、嘴唇的具体状态描述
【肢体动作】身体姿态、手部动作、重心方向的具体描述
【面部血色】皮肤颜色变化、血色状态、汗液光泽等
【景别】从以下选一个：大远景/远景/全景/中全景/中景/中近景/近景/特写/大特写/微距
【机位】从以下选一个：俯拍/仰拍/平视/侧面/背影/过肩/主观视角
【运动方向】径向/横向/对角线/固定，加具体说明
【音效】环境声 + 动作声 + 情绪声的组合描述
【视频模型】${model.name} (最长 ${model.maxDuration})
【人物数量】${CHARACTER_COUNT_RULES[characterCount]?.prompt_append || '根据场景自动判断'}`;

    if (lipSync && model.lipSync) {
        systemPrompt += `\n【口型】根据场景判断角色是说话/倾听/停顿状态，描述嘴部动作`;
    }
    if (lockContinuity) {
        systemPrompt += `\n【连续性】角色外貌/服装/光线方向全程一致，动作从上一镜头自然承接。`;
    }
    if (antiCollapse) {
        systemPrompt += `\n【防崩】禁止人物消失/角色替换/无逻辑跳切/静态照片感/背景完全不动/多余人物进入。`;
    }

    // ===== 导演风格模板注入 =====
    if (directorStyle && directorStyle !== 'auto' && DIRECTOR_STYLES[directorStyle]) {
        const ds = DIRECTOR_STYLES[directorStyle];
        systemPrompt += `\n\n## 导演风格约束（必须遵守）：
你必须以「${ds.name}」的视觉风格来生成这条分镜。以下是该导演的完整风格模板，所有输出必须符合：
- 风格标签：${ds.signature}
- 调色倾向：${ds.colorTone}
- 节奏：${ds.rhythm}
- 景别偏好：${ds.shotPreference}
- 构图规则：${ds.composition}
- 灯光风格：${ds.lighting}
- 声音设计：${ds.sound}
- 皮肤/面部风格：${ds.skin}

注意：即使用户的场景是日常/温馨内容，你也必须用${ds.name}的视觉语言来重新诠释它。${ds.name}拍温馨场景也有独特方式。`;
    }

    systemPrompt += `

## 核心规则：
1. 调色必须符合场景氛围——温馨场景用暖色，紧张用冷暗色，不要乱配
2. 运镜必须服务于叙事——平静场景不要用急推，紧张场景不要用固定摇
3. 音效要具体到可以听见的声音，不要写抽象概念
4. 面部/肢体/血色要具体到肌肉级别的描述，视频模型需要精确指令
5. 所有输出用中文
6. 不要添加任何解释、开场白、结尾语，只输出格式化的提示词`;

    // 如果用户 @ 指定了内容，告诉 AI 必须使用
    const overrides = [];
    if (mentions.shotSizes && mentions.shotSizes.length > 0) {
        const s = mentions.shotSizes[0];
        overrides.push(`用户已指定景别「${s.cn}」，【景别】必须使用：${s.cn}，${s.prompt}`);
    }
    if (mentions.angles && mentions.angles.length > 0) {
        const a = mentions.angles[0];
        overrides.push(`用户已指定机位「${a.cn}」，请在运镜/构图中体现：${a.prompt}`);
    }
    if (mentions.movements.length > 0) {
        const m = mentions.movements[0];
        overrides.push(`用户已指定运镜「${m.cn}」，【运镜】必须使用：${m.cn}: ${m.seedance || m.prompt || m.desc}`);
    }
    if (mentions.colors.length > 0) {
        const c = mentions.colors[0];
        overrides.push(`用户已指定调色「${c.name}」，【调色】必须使用：${c.name}: ${c.prompt}`);
    }
    if (mentions.expressions.length > 0) {
        overrides.push(`用户已指定面部表情「${mentions.expressions.map(e=>e.cn).join('+')}」，【面部表情】必须使用：${mentions.expressions.map(e=>e.prompt).join(' ')}`);
    }
    if (mentions.bodies.length > 0) {
        overrides.push(`用户已指定肢体动作「${mentions.bodies.map(e=>e.cn).join('+')}」，【肢体动作】必须使用：${mentions.bodies.map(e=>e.prompt).join(' ')}`);
    }
    if (mentions.bloods.length > 0) {
        overrides.push(`用户已指定面部血色「${mentions.bloods.map(e=>e.cn).join('+')}」，【面部血色】必须使用：${mentions.bloods.map(e=>e.prompt).join(' ')}`);
    }

    if (overrides.length > 0) {
        systemPrompt += `\n\n## 用户已指定（必须使用，不可覆盖）：\n${overrides.join('\n')}`;
    }

    return systemPrompt;
}

// 调用 Deepseek API
async function callDeepseekAPI(userInput, mentions, options) {
    const { videoModel = 'seedance', characterCount = '1', lipSync = true, lockContinuity = true, antiCollapse = true, directorStyle = 'auto' } = options;

    const systemPrompt = buildSystemPrompt(mentions, videoModel, characterCount, lipSync, lockContinuity, antiCollapse, directorStyle);

    const requestBody = {
        model: AI_CONFIG.model,
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userInput }
        ],
        temperature: 0.7,
        max_tokens: 1500
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
        return { success: true, prompt: content.trim() };
    } catch (error) {
        console.error('Deepseek API error:', error);
        return { success: false, error: error.message };
    }
}

// 多分镜版本：对每个段落调用 AI
async function callDeepseekMultiShot(segments, mentions, options) {
    const results = [];
    for (let i = 0; i < segments.length; i++) {
        const segInput = `第${i + 1}个分镜：${segments[i]}`;
        const result = await callDeepseekAPI(segInput, mentions, options);
        results.push(result);
    }
    return results;
}
