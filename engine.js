// ============================================
// 导演台 — 分镜生成引擎 v2
// 核心改进：双人场景检测 + 对话镜头序列
// ============================================

class ShotEngine {
    constructor() {
        this.allMovements = [...BASIC_MOVEMENTS, ...ADVANCED_TECHNIQUES, ...SEEDANCE_MOVEMENTS, ...DIALOGUE_SHOTS];
        this.duoShots = DIALOGUE_CONFRONTATION_SHOTS;
        this.keywords = this.buildKeywordMap();
    }

    // 构建关键词映射
    buildKeywordMap() {
        return {
            // 场景关键词 → 情绪
            emotions: {
                // 紧张/悬疑
                '深夜': 'tension', '赌场': 'tension', '枪': 'tension', '刀': 'tension',
                '楼梯': 'tension', '走廊': 'tension', '小巷': 'tension', '沉默': 'tension',
                '威胁': 'tension', '跟踪': 'tension', '暗处': 'tension',
                // 恐惧
                '死': 'fear', '血': 'fear', '恐惧': 'fear', '阴暗': 'fear',
                '黑暗': 'fear', '噩梦': 'fear', '幻觉': 'fear', '鬼': 'fear',
                '尸': 'fear', '阴森': 'fear',
                // 混乱
                '追逐': 'chaos', '逃跑': 'chaos', '奔跑': 'chaos', '打斗': 'chaos',
                '街道': 'chaos', '速度': 'chaos', '火': 'chaos', '争吵': 'chaos',
                '爆炸': 'chaos', '撞': 'chaos',
                // 孤独
                '孤独': 'lonely', '离开': 'lonely', '分别': 'lonely', '背影': 'lonely',
                '雨': 'lonely', '独自': 'lonely', '一个人': 'lonely', '寂寞': 'lonely',
                // 亲密
                '爱': 'intimate', '亲吻': 'intimate', '拥抱': 'intimate', '温柔': 'intimate',
                '酒吧': 'intimate', '告白': 'intimate', '眼泪': 'intimate', '牵手': 'intimate',
                '依偎': 'intimate', '脸': 'intimate',
                // 宏大
                '战争': 'epic', '军队': 'epic', '宏大': 'epic', '宇宙': 'epic',
                '城市': 'epic', '风': 'epic', '飞': 'epic', '山': 'epic',
                '大海': 'epic', '天空': 'epic', '壮观': 'epic',
                // 揭示
                '真相': 'reveal', '发现': 'reveal', '门': 'reveal', '光': 'reveal',
                '秘密': 'reveal', '打开': 'reveal',
                // 平静/日常
                '平静': 'calm', '日出': 'calm', '田野': 'calm', '雪': 'calm',
                '安静': 'calm', '微笑': 'calm', '商量': 'calm', '散步': 'calm',
                '花': 'calm', '公园': 'calm', '早晨': 'calm', '阳光': 'calm',
                '午后': 'calm', '清晨': 'calm', '河边': 'calm', '湖': 'calm',
                // 权力
                '权力': 'power', '老板': 'power', '审讯': 'power', '对峙': 'power',
                '谈判': 'power', '质问': 'power', '命令': 'power',
                // 欢快/温馨（新增）
                '孩子': 'warm', '小孩': 'warm', '玩耍': 'warm', '笑': 'warm',
                '开心': 'warm', '快乐': 'warm', '生日': 'warm', '礼物': 'warm',
                '家': 'warm', '妈妈': 'warm', '爸爸': 'warm', '家人': 'warm',
                '做饭': 'warm', '厨房': 'warm', '客厅': 'warm', '一起': 'warm',
                '拍照': 'warm', '旅行': 'warm', '假期': 'warm', '野餐': 'warm',
                '宠物': 'warm', '狗': 'warm', '猫': 'warm', '学校': 'warm',
                '朋友': 'warm', '聚会': 'warm', '跳舞': 'warm', '唱歌': 'warm',
                '婚礼': 'warm', '庆祝': 'warm', '蛋糕': 'warm', '甜': 'warm',
                '房子': 'warm', '花园': 'warm', '院子': 'warm'
            },
            // 场景关键词 → 景别
            shotSizes: {
                '脸': '特写', '眼': '微距', '手': '特写', '嘴唇': '微距',
                '走': '中景', '跑': '中景', '站': '全景',
                '城市': '大远景', '天空': '大远景', '山': '大远景',
                '房间': '全景', '桌子': '中景', '门': '近景',
                '对话': '近景', '握手': '特写', '拥抱': '中景',
                '群': '全景', '人群': '大远景'
            },
            // 动作关键词 → 运镜
            movements: {
                '走进': 'behind_follow', '推开': 'smooth_push', '转身': 'orbit_360',
                '跑': 'side_follow', '追': 'fpv', '逃': 'handheld',
                '坐下': 'tilt_down', '站起': 'tilt_up', '回头': 'whip_pan',
                '看': 'pov_handheld', '凝视': 'smooth_push', '注视': 'crash_zoom',
                '倒下': 'dive_down', '升起': 'rise_up', '飞': 'drone',
                '开门': 'smooth_push', '关门': 'pull', '进入': 'behind_follow',
                '离开': 'pull', '远去': 'pull', '消失': 'fast_pull',
                '出现': 'fast_push_stop', '走出': 'lateral_right',
                '开车': 'side_follow', '骑行': 'low_orbit',
                '哭': 'smooth_push', '笑': 'lateral_left',
                '打': 'match_motion', '踢': 'match_motion',
                '射': 'crash_zoom', '举': 'tilt_up'
            },
            // 环境关键词 → 调色
            colorMoods: {
                '深夜': { id: 96, emotion: '压抑' },
                '赌场': { id: 48, emotion: '赛博' },
                '霓虹': { id: 48, emotion: '赛博' },
                '日落': { id: 9, emotion: '热烈' },
                '海': { id: 16, emotion: '秩序' },
                '森林': { id: 20, emotion: '野性' },
                '雪': { id: 7, emotion: '冷冽' },
                '火': { id: 9, emotion: '危险' },
                '黑暗': { id: 2, emotion: '压迫' },
                '白天': { id: 5, emotion: '温柔' },
                '雨': { id: 14, emotion: '忧郁' },
                '都市': { id: 75, emotion: '电影感' },
                '古典': { id: 11, emotion: '成熟' },
                '未来': { id: 17, emotion: '迷幻' },
                '战场': { id: 96, emotion: '暗黑' },
                '酒吧': { id: 100, emotion: '浓烈' },
                '医院': { id: 1, emotion: '冷静' },
                '教堂': { id: 30, emotion: '神圣' },
                '监狱': { id: 4, emotion: '工业' },
                '办公室': { id: 6, emotion: '权力' },
                '会议室': { id: 6, emotion: '权力' }
            }
        };
    }

    // ========== 双人场景检测 ==========
    detectDuoScene(input) {
        let duoScore = 0;
        let dialogueScore = 0;
        let confrontationScore = 0;
        const matchedKeywords = [];

        // 检测双人存在关键词
        for (const kw of DUO_SCENE_KEYWORDS.characters) {
            if (input.includes(kw)) {
                duoScore += 3;
                matchedKeywords.push(kw);
            }
        }

        // 检测对话关键词
        for (const kw of DUO_SCENE_KEYWORDS.dialogue) {
            if (input.includes(kw)) {
                dialogueScore += 2;
                matchedKeywords.push(kw);
            }
        }

        // 检测对峙/冲突关键词
        for (const kw of DUO_SCENE_KEYWORDS.confrontation) {
            if (input.includes(kw)) {
                confrontationScore += 3;
                matchedKeywords.push(kw);
            }
        }

        // 检测空间暗示
        for (const kw of DUO_SCENE_KEYWORDS.spatial) {
            if (input.includes(kw)) {
                duoScore += 1;
                matchedKeywords.push(kw);
            }
        }

        // 检测第二人称/第二个角色
        for (const kw of DUO_SCENE_KEYWORDS.secondPerson) {
            if (input.includes(kw)) {
                duoScore += 2;
                matchedKeywords.push(kw);
            }
        }

        // 检测引号（台词标志）
        const quoteCount = (input.match(/[""「」『』]/g) || []).length;
        if (quoteCount >= 2) {
            dialogueScore += 4;
        }

        // 检测冒号说话格式（A：xxx）
        const colonSpeech = (input.match(/[：:]/g) || []).length;
        if (colonSpeech >= 1) {
            dialogueScore += 3;
        }

        const isDuo = duoScore >= 2 || (dialogueScore >= 2 && duoScore >= 1);
        const hasDialogue = dialogueScore >= 2;
        const hasConfrontation = confrontationScore >= 2;

        return {
            isDuo,
            hasDialogue,
            hasConfrontation,
            duoScore,
            dialogueScore,
            confrontationScore,
            matchedKeywords: [...new Set(matchedKeywords)]
        };
    }

    // ========== 确定对话类型 ==========
    determineDialogueType(input, analysis) {
        // 权力/审讯
        if (input.includes('审讯') || input.includes('老板') || input.includes('命令') || 
            input.includes('权力') || input.includes('下属') || input.includes('压迫')) {
            return 'power_dynamic';
        }
        // 谈判
        if (input.includes('谈判') || input.includes('会议') || input.includes('商议') || 
            input.includes('桌') || input.includes('合同')) {
            return 'negotiation';
        }
        // 室外
        if (input.includes('街') || input.includes('路边') || input.includes('停车场') || 
            input.includes('加油站') || input.includes('门口') || input.includes('户外')) {
            return 'outdoor_standoff';
        }
        // 悬疑
        if (input.includes('监控') || input.includes('偷看') || input.includes('窥') || 
            input.includes('暗中') || input.includes('秘密')) {
            return 'suspense';
        }
        // 情感
        if (input.includes('爱') || input.includes('告白') || input.includes('分手') || 
            input.includes('想你') || input.includes('对不起') || input.includes('原谅')) {
            return 'emotional';
        }
        // 默认：对峙
        return 'confrontation';
    }

    // ========== 主入口：生成分镜方案 ==========
    generateShots(input, directorStyle = 'auto', options = {}) {
        const { videoModel = 'seedance', characterCount = 'auto', lockContinuity = true, lipSync = true, antiCollapse = true, mentions = {} } = options;
        
        // 1. 分析场景
        const analysis = this.analyzeScene(input);
        
        // 2. 检测是否为双人场景
        const duoDetection = this.detectDuoScene(input);
        analysis.duoDetection = duoDetection;
        
        // 3. 确定人物数量
        const resolvedCharCount = characterCount === 'auto' ? this.autoDetectCharCount(input, duoDetection) : characterCount;
        analysis.characterCount = resolvedCharCount;
        analysis.videoModel = videoModel;
        analysis.lockContinuity = lockContinuity;
        analysis.lipSync = lipSync;
        analysis.antiCollapse = antiCollapse;
        analysis.mentions = mentions;
        
        let shots;
        
        if (duoDetection.isDuo && duoDetection.hasDialogue) {
            const dialogueType = this.determineDialogueType(input, analysis);
            analysis.dialogueType = dialogueType;
            shots = this.generateDuoDialogueShots(input, analysis, dialogueType, directorStyle);
        } else {
            const segments = this.splitSegments(input, analysis);
            shots = segments.map((seg, idx) => this.buildShot(seg, idx, analysis, directorStyle));
        }

        // 4. 后处理：追加约束 + 用户 @ 覆盖
        shots = shots.map((shot, idx) => this.applyGlobalConstraints(shot, idx, shots.length, analysis));
        
        // 5. 如果用户 @ 指定了运镜或调色，覆盖到对应镜头
        if (mentions && mentions.movements && mentions.movements.length > 0) {
            shots.forEach((shot, idx) => {
                if (idx < mentions.movements.length) {
                    const m = mentions.movements[idx];
                    shot.movement = m;
                    // 重新构建 prompt 中的运镜部分
                    shot.prompt = shot.prompt.replace(/【运镜】.*?\n|【镜头指令】.*?\n/g, `【运镜】${m.cn}: ${m.seedance || m.prompt || m.desc}\n`);
                }
            });
        }
        if (mentions && mentions.colors && mentions.colors.length > 0) {
            const c = mentions.colors[0]; // 调色通常全场统一
            shots.forEach(shot => {
                shot.color = c;
                shot.prompt = shot.prompt.replace(/【调色】.*?\n/g, `【调色】${c.name}: ${c.prompt}\n`);
            });
        }
        
        return {
            input,
            director: directorStyle,
            videoModel,
            characterCount: resolvedCharCount,
            analysis,
            isDuoScene: duoDetection.isDuo,
            dialogueType: analysis.dialogueType || null,
            shots
        };
    }

    // 自动检测人物数量
    autoDetectCharCount(input, duoDetection) {
        if (duoDetection.isDuo && duoDetection.hasDialogue) return '2';
        if (input.includes('三人') || input.includes('三个人')) return '3';
        if (input.includes('会议') || input.includes('人群') || input.includes('众人')) return 'crowd';
        if (duoDetection.duoScore >= 2) return '2';
        return '1';
    }

    // 全局约束后处理（智能适配，避免规则冲突）
    applyGlobalConstraints(shot, index, totalShots, analysis) {
        const appendParts = [];
        const model = VIDEO_MODELS[analysis.videoModel];

        // --- 视频模型适配 ---
        appendParts.push(`\n【视频模型】${model.name} (最长 ${model.maxDuration})`);

        // --- 人物数量控制（智能：双人镜头时强制为2，不与双人镜头冲突）---
        let effectiveCharCount = analysis.characterCount;
        if (shot.isDuoShot) {
            effectiveCharCount = '2'; // 双人镜头强制双人规则
        }
        const charRule = CHARACTER_COUNT_RULES[effectiveCharCount];
        if (charRule) {
            appendParts.push(`【人物数量】${charRule.prompt_append}`);
        }

        // --- 台词/口型控制（仅在模型支持时追加）---
        if (analysis.lipSync && model.lipSync) {
            const lipState = this.determineLipState(shot.segment, shot, index);
            appendParts.push(`【口型控制】${lipState.prompt}`);
        }

        // --- 音效（精简版，只写关键音层）---
        const soundDesign = this.buildSoundDesign(shot.segment, shot.emotion, index, totalShots);
        shot.soundDesign = soundDesign;
        appendParts.push(`【音效库】${soundDesign}`);

        // --- 连续性锁定（按场景筛选相关项，不无脑全加）---
        if (analysis.lockContinuity) {
            const relevantLocks = this.getRelevantContinuityLocks(shot, index);
            if (relevantLocks.length > 0) {
                appendParts.push(`【连续性锁定】${relevantLocks.join(' ')}`);
            }
        }

        // --- 防崩约束（精简为与当前镜头相关的条目）---
        if (analysis.antiCollapse) {
            const relevantAntiCollapse = this.getRelevantAntiCollapse(shot, analysis);
            if (relevantAntiCollapse.length > 0) {
                appendParts.push(`【防崩约束】${relevantAntiCollapse.join(' ')}`);
            }
        }

        // 将约束追加到prompt
        shot.prompt = shot.prompt + '\n' + appendParts.join('\n');
        shot.videoModel = model.name;
        shot.characterCountRule = charRule?.label || '自动';

        return shot;
    }

    // 筛选与当前镜头相关的连续性锁定
    getRelevantContinuityLocks(shot, index) {
        const locks = [];
        const seg = shot.segment || '';

        // 角色/服装一致性：始终需要
        locks.push(CONTINUITY_LOCKS.find(l => l.id === 'character').prompt);
        locks.push(CONTINUITY_LOCKS.find(l => l.id === 'costume').prompt);

        // 车辆：仅当场景涉及车辆时
        if (seg.includes('车') || seg.includes('停车') || seg.includes('加油') || seg.includes('皮卡')) {
            locks.push(CONTINUITY_LOCKS.find(l => l.id === 'vehicle').prompt);
        }

        // 道具：仅当场景涉及物件时
        if (seg.includes('文件') || seg.includes('枪') || seg.includes('杯') || seg.includes('手机') || 
            seg.includes('桌') || seg.includes('钥匙') || shot.movement?.id === 'object_insert') {
            locks.push(CONTINUITY_LOCKS.find(l => l.id === 'props').prompt);
        }

        // 光线：始终需要
        locks.push(CONTINUITY_LOCKS.find(l => l.id === 'lighting').prompt);

        // 动作承接：第2镜开始
        if (index > 0) {
            locks.push(CONTINUITY_LOCKS.find(l => l.id === 'action_continuity').prompt);
        }

        return locks;
    }

    // 筛选与当前镜头相关的防崩约束
    getRelevantAntiCollapse(shot, analysis) {
        const rules = [];
        const charCount = analysis.characterCount;

        // 人物不消失：始终需要
        rules.push(ANTI_COLLAPSE_RULES.find(r => r.id === 'no_disappear').prompt);

        // 角色不替换：始终需要
        rules.push(ANTI_COLLAPSE_RULES.find(r => r.id === 'no_replacement').prompt);

        // 车辆不跳转：仅当涉及车辆
        if ((shot.segment || '').match(/车|停车|加油|皮卡|卡车/)) {
            rules.push(ANTI_COLLAPSE_RULES.find(r => r.id === 'no_vehicle_teleport').prompt);
        }

        // 无逻辑跳切：始终需要
        rules.push(ANTI_COLLAPSE_RULES.find(r => r.id === 'no_jump_cut').prompt);

        // 禁止照片感：除非是特意的静止对峙镜头（那种需要微动而非全静）
        rules.push(ANTI_COLLAPSE_RULES.find(r => r.id === 'no_static_photo').prompt);

        // 背景不能完全不动：但静止对峙镜头改为"微动即可"
        if (shot.movement?.id === 'static_confrontation') {
            rules.push('背景保持细微动态：呼吸起伏、布料微动、环境光闪烁。角色保持静止但有生命感。');
        } else {
            rules.push(ANTI_COLLAPSE_RULES.find(r => r.id === 'no_frozen_bg').prompt);
        }

        // 禁止多余人物：当人物数有明确限制时
        if (charCount === '1' || charCount === '2' || charCount === '3') {
            rules.push(ANTI_COLLAPSE_RULES.find(r => r.id === 'no_extra_people').prompt);
        }

        return rules;
    }

    // 确定口型状态
    determineLipState(segment, shot, index) {
        // 有引号/台词标记 → 说话中
        if (segment.match(/[""「」『』]/) || segment.includes('说') || segment.includes('问') || segment.includes('喊') || segment.includes('吼')) {
            return LIP_SYNC_RULES.speaking;
        }
        // 反应镜头 → 倾听
        if (shot.isDuoShot && (shot.movement?.id === 'reaction_mcu' || shot.movement?.id === 'reverse_over_shoulder')) {
            return LIP_SYNC_RULES.listening;
        }
        // 画外音
        if (segment.includes('画外') || segment.includes('旁白') || segment.includes('独白')) {
            return LIP_SYNC_RULES.offscreen;
        }
        // 沉默/停顿
        if (segment.includes('沉默') || segment.includes('停顿') || segment.includes('不说话')) {
            return LIP_SYNC_RULES.reaction;
        }
        // 默认根据位置
        if (index % 2 === 0) return LIP_SYNC_RULES.speaking;
        return LIP_SYNC_RULES.listening;
    }

    // 从音效库构建声音设计
    buildSoundDesign(segment, emotion, index, totalShots) {
        const layers = [];

        // 环境层
        const envSounds = SOUND_LIBRARY.environment.sounds;
        if (segment.includes('夜') || segment.includes('深夜')) layers.push(envSounds.find(s => s.id === 'night_quiet')?.name || '深夜寂静');
        else if (segment.includes('雨')) layers.push(segment.includes('暴') ? '暴雨' : '细雨');
        else if (segment.includes('城') || segment.includes('街')) layers.push('城市底噪');
        else if (segment.includes('室内') || segment.includes('办公') || segment.includes('会议')) layers.push('室内安静');
        else if (segment.includes('霓虹')) layers.push('霓虹灯电流');
        else layers.push('环境底噪');

        // 动作层
        if (segment.includes('门')) layers.push(segment.includes('摔') ? '摔门' : '开门');
        if (segment.includes('车')) layers.push('车门关闭');
        if (segment.includes('文件') || segment.includes('桌')) layers.push('文件夹落桌');
        if (segment.includes('枪')) layers.push('上膛');
        if (segment.includes('椅')) layers.push('椅子摩擦');
        if (segment.includes('脚步') || segment.includes('走')) layers.push('硬地脚步');
        if (segment.includes('手机')) layers.push('手机震动');
        if (segment.includes('打火')) layers.push('打火机');

        // 机械层
        if (segment.includes('飞机')) layers.push('飞机引擎');
        if (segment.includes('皮卡') || segment.includes('卡车')) layers.push('皮卡怠速');
        if (segment.includes('油泵') || segment.includes('加油')) layers.push('油泵启动');
        if (segment.includes('电梯')) layers.push('电梯');

        // 情绪层
        const emotionId = emotion?.id || 'tension';
        const emotionSoundMap = {
            'tension': '低频脉冲 + 心跳渐强',
            'fear': '弦乐紧张 + 耳鸣',
            'lonely': '单音钢琴 + 低音持续',
            'intimate': '呼吸声 + 绝对安静',
            'epic': '管弦冲击 + 低音持续',
            'chaos': '心跳加速 + 弦乐紧张',
            'reveal': '绝对安静→管弦冲击',
            'calm': '单根吉他弦',
            'power': '低频脉冲 + 时钟滴答',
            'warm': '轻快钢琴 + 孩子笑声 + 温暖环境音'
        };
        layers.push(emotionSoundMap[emotionId] || '环境自然音');

        // 静默层（收尾或特殊时刻）
        if (index === totalShots - 1) layers.push('声音被放大（收尾沉默）');
        if (segment.includes('沉默') || segment.includes('安静')) layers.push('绝对安静');

        return layers.join(' + ');
    }

    // ========== 双人对话分镜生成 ==========
    generateDuoDialogueShots(input, analysis, dialogueType, directorStyle) {
        const sequence = DIALOGUE_SEQUENCES[dialogueType];
        if (!sequence) return this.fallbackGenerate(input, analysis, directorStyle);

        // 使用智能分割保护台词完整性
        const rawSegments = this.smartSplit(input);
        
        // 确定要使用的镜头数（取序列长度和段落数的较小值，但至少4个）
        const shotCount = Math.max(4, Math.min(sequence.sequence.length, rawSegments.length + 2));
        const shotIds = sequence.sequence.slice(0, shotCount);

        const shots = [];

        for (let i = 0; i < shotCount; i++) {
            const shotId = shotIds[i];
            const duoShot = this.duoShots.find(s => s.id === shotId);
            
            if (!duoShot) continue;

            // 从原文中取对应段落，没有则生成描述
            const segment = rawSegments[i] || this.generateDuoSegmentDesc(duoShot, i, shotCount);
            
            // 确定情绪
            const emotion = this.determineEmotion(segment, analysis, i);
            
            // 确定调色
            const color = this.determineColor(segment, analysis, emotion);
            
            // 确定声音
            const sound = this.determineDuoSound(segment, emotion, i, shotCount);
            
            // 确定面部/皮肤
            const skin = this.determineDuoSkin(duoShot, emotion, i);

            // 确定景别（根据双人镜头类型）
            const shotSize = this.determineDuoShotSize(duoShot);

            // 确定人物朝向（双人特殊）
            const facing = this.determineDuoFacing(duoShot, i);

            // 构建双人专用Prompt
            const prompt = this.buildDuoPrompt(segment, duoShot, shotSize, emotion, color, sound, skin, facing, directorStyle);

            shots.push({
                index: i + 1,
                segment: segment.trim(),
                role: this.determineDuoShotRole(i, shotCount, duoShot),
                shotSize,
                movement: { cn: duoShot.cn, en: duoShot.en, desc: duoShot.desc, seedance: duoShot.prompt },
                facing,
                motionDirection: this.determineDuoMotionDirection(duoShot),
                emotion,
                color,
                sound,
                skin,
                prompt,
                isDuoShot: true,
                duoShotType: duoShot.cn
            });
        }

        return shots;
    }

    // 生成双人段落描述（当原文段落不够时）
    generateDuoSegmentDesc(duoShot, index, total) {
        if (index === 0) return '双人同框建立空间关系';
        if (index === total - 1) return '对话收束，沉默停顿';
        return duoShot.usage || duoShot.desc;
    }

    // 双人镜头景别
    determineDuoShotSize(duoShot) {
        const sizeMap = {
            'duo_medium': { cn: '中景', en: 'Medium Shot (MS)', desc: '双人同框', rule: '双人空间关系' },
            'table_axis': { cn: '中景', en: 'Medium Shot (MS)', desc: '长桌轴线', rule: '双人对坐空间' },
            'over_shoulder_talk': { cn: '近景', en: 'Medium Close-Up (MCU)', desc: '过肩', rule: '说话者面部+肩膀前景' },
            'reverse_over_shoulder': { cn: '近景', en: 'Medium Close-Up (MCU)', desc: '反打', rule: '听话者反应' },
            'reaction_mcu': { cn: '近景', en: 'Medium Close-Up (MCU)', desc: '反应', rule: '纯听者面部' },
            'object_insert': { cn: '特写', en: 'Close-Up (CU)', desc: '物件', rule: '物件承载情绪' },
            'side_confrontation': { cn: '全景', en: 'Full Shot (FS)', desc: '侧面对峙', rule: '完整空间关系' },
            'foreground_compress': { cn: '中景', en: 'Medium Shot (MS)', desc: '前后景压缩', rule: '长焦空间' },
            'low_angle_duo': { cn: '中景', en: 'Medium Shot (MS)', desc: '低角度', rule: '仰拍双人' },
            'slight_overhead_duo': { cn: '全景', en: 'Full Shot (FS)', desc: '俯拍', rule: '监控视角' },
            'duo_slow_push': { cn: '中景', en: 'Medium Shot (MS)', desc: '慢推', rule: '递进压迫' },
            'push_to_silent': { cn: '近景', en: 'Medium Close-Up (MCU)', desc: '推向沉默者', rule: '权力转移' },
            'half_orbit_duo': { cn: '中景', en: 'Medium Shot (MS)', desc: '半环绕', rule: '权力变化' },
            'peep_duo': { cn: '中景', en: 'Medium Shot (MS)', desc: '窥视', rule: '遮挡观察' },
            'static_confrontation': { cn: '全景', en: 'Full Shot (FS)', desc: '静止对峙', rule: '等待与沉默' },
            'whip_reaction': { cn: '近景', en: 'Medium Close-Up (MCU)', desc: '甩镜反应', rule: '突然反应' },
            'doorframe_dialogue': { cn: '中景', en: 'Medium Shot (MS)', desc: '门框', rule: '困住空间' },
            'glass_reflection_duo': { cn: '中景', en: 'Medium Shot (MS)', desc: '反射', rule: '双重影像' },
            'back_pressure_duo': { cn: '中景', en: 'Medium Shot (MS)', desc: '背影压迫', rule: '前景背影' },
            'silence_hold': { cn: '中景', en: 'Medium Shot (MS)', desc: '沉默停顿', rule: '台词留白' },
            'empty_seat_pressure': { cn: '全景', en: 'Full Shot (FS)', desc: '空位', rule: '登场压力' },
            'single_side_pressure': { cn: '中景', en: 'Medium Shot (MS)', desc: '单侧压迫', rule: '权力差距' },
            'power_reverse': { cn: '中景', en: 'Medium Shot (MS)', desc: '权力反转', rule: '动态转移' },
            'eye_line_dialogue': { cn: '近景', en: 'Medium Close-Up (MCU)', desc: '眼神线', rule: '视线对应' },
            'foreground_pressure': { cn: '中景', en: 'Medium Shot (MS)', desc: '前景压迫', rule: '层次感' },
            'table_low_duo': { cn: '中景', en: 'Medium Shot (MS)', desc: '桌面低机位', rule: '压迫线' },
            'car_confrontation': { cn: '全景', en: 'Full Shot (FS)', desc: '车旁', rule: '现实锚点' },
            'railing_split': { cn: '中景', en: 'Medium Shot (MS)', desc: '栏杆分割', rule: '隔阂' },
            'follow_enter_duo': { cn: '中景', en: 'Medium Shot (MS)', desc: '跟入', rule: '自然形成关系' },
            'confrontation_end': { cn: '中景', en: 'Medium Shot (MS)', desc: '收尾', rule: '冷静结束' }
        };

        return sizeMap[duoShot.id] || { cn: '中景', en: 'Medium Shot (MS)', desc: '双人', rule: '空间关系' };
    }

    // 双人朝向
    determineDuoFacing(duoShot, index) {
        const facingMap = {
            'over_shoulder_talk': { direction: '过肩A→B', effect: '说话者正面对镜，听者肩膀前景', angle: '过肩' },
            'reverse_over_shoulder': { direction: '过肩B→A', effect: '反打听者反应，说者肩膀前景', angle: '过肩反打' },
            'side_confrontation': { direction: '侧面对视', effect: '两人分居左右互相面对', angle: '90°对视' },
            'back_pressure_duo': { direction: '背对+正面', effect: '强势者背对镜头，弱势者正面承压', angle: '180°+0°' },
            'reaction_mcu': { direction: '正面微侧', effect: '听者45度面对镜头承接压力', angle: '45°' },
            'duo_medium': { direction: '双人45度', effect: '两人各45度面对镜头', angle: '双45°' },
            'static_confrontation': { direction: '正面对视', effect: '两人面对面，镜头侧面观察', angle: '侧面拍摄' }
        };

        return facingMap[duoShot.id] || { direction: '双人同框', effect: '两人在画面内保持清晰视线关系', angle: '双人' };
    }

    // 双人运动方向
    determineDuoMotionDirection(duoShot) {
        if (duoShot.id.includes('push') || duoShot.id.includes('compress')) {
            return { type: '径向（慢推）', effect: '逐步压迫递进', desc: '极缓向对话核心推进' };
        }
        if (duoShot.id.includes('orbit') || duoShot.id.includes('half_orbit')) {
            return { type: '弧形环绕', effect: '权力位置变化', desc: '半环绕不超过90度' };
        }
        if (duoShot.id === 'whip_reaction') {
            return { type: '横向甩镜', effect: '突然反应', desc: '短促甩到听话者' };
        }
        // 大部分对话镜头是固定的
        return { type: '固定/极微动', effect: '稳定压迫，不分散注意力', desc: '镜头几乎不动，让表演和空间说话' };
    }

    // 双人镜头角色
    determineDuoShotRole(index, total, duoShot) {
        if (index === 0) return { type: 'auxiliary', label: '建立', desc: '建立双人空间关系' };
        if (index === total - 1) return { type: 'style', label: '收束', desc: '对话收尾' };
        if (duoShot.id === 'object_insert') return { type: 'support', label: '支撑', desc: '物件细节补充' };
        if (duoShot.id === 'reaction_mcu') return { type: 'support', label: '支撑', desc: '反应承接' };
        return { type: 'narrative', label: '叙事', desc: '对话推进' };
    }

    // 双人声音设计
    determineDuoSound(segment, emotion, index, total) {
        const baseSounds = {
            'tension': '低频嗡鸣 + 呼吸可闻 + 衣物微动',
            'power': '空调白噪 + 皮鞋移动 + 文件翻动',
            'fear': '心跳加速 + 吞咽声 + 金属共振',
            'intimate': '呼吸交错 + 布料摩擦 + 环境音降低',
            'chaos': '声音重叠 + 桌面击打 + 椅子摩擦',
            'calm': '远处环境音 + 时钟滴答 + 轻声交谈',
            'reveal': '突然静默 + 单一重音 + 耳鸣'
        };

        let sound = baseSounds[emotion?.id] || '环境白噪 + 对话声压降低';

        // 开场建立
        if (index === 0) sound = '环境建立音 + 脚步声接近 + ' + sound;
        // 收尾
        if (index === total - 1) sound = sound + ' + 最后一句话回声消散 + 沉默2秒';
        // 有台词的镜头
        if (segment.includes('说') || segment.includes('"') || segment.includes('"')) {
            sound = '对话声压清晰 + ' + sound;
        }

        return sound;
    }

    // 双人皮肤细节
    determineDuoSkin(duoShot, emotion, index) {
        const skinBase = {
            'tension': '微汗光泽、下颌线紧绷、嘴唇微抿',
            'power': '深沉无表情、锐利下颌线、冷光轮廓、手指稳定',
            'fear': '眼白轻微放大、喉结吞咽、指尖发白',
            'intimate': '柔光暖色、瞳孔放大、嘴角微变',
            'chaos': '面红、颈部血管浮现、呼吸急促可见',
            'calm': '放松面部肌肉、自然呼吸、柔和阴影',
            'reveal': '瞳孔骤缩、面部僵硬、血色一瞬退去'
        };

        let skin = skinBase[emotion?.id] || '自然肤色、柔和光影';

        // 过肩镜头特殊：前景人物只有轮廓
        if (duoShot.id === 'over_shoulder_talk' || duoShot.id === 'reverse_over_shoulder') {
            skin = '焦点人物：' + skin + '；前景肩膀：仅保留轮廓和发丝边缘光';
        }
        // 反应镜头强调微表情
        if (duoShot.id === 'reaction_mcu' || duoShot.id === 'push_to_silent') {
            skin = skin + '、眼神停顿、手指微动变化、呼吸节奏可见';
        }

        return skin;
    }

    // 构建双人专用Prompt
    buildDuoPrompt(segment, duoShot, shotSize, emotion, color, sound, skin, facing, directorStyle) {
        const parts = [];

        parts.push(`【场景】${segment.trim()}`);
        parts.push(`【镜头类型】双人对话镜头 — ${duoShot.cn} (${duoShot.en})`);
        parts.push(`【景别】${shotSize.cn} (${shotSize.en})`);
        parts.push(`【镜头指令】${duoShot.prompt}`);
        parts.push(`【人物站位】${facing.direction} — ${facing.effect}`);
        parts.push(`【运动方向】${this.determineDuoMotionDirection(duoShot).type}: ${this.determineDuoMotionDirection(duoShot).desc}`);
        parts.push(`【情绪】${emotion.cn} — ${emotion.techniques || ''}`);

        if (color) {
            parts.push(`【调色】${color.name}: ${color.prompt}`);
        }

        parts.push(`【声音设计】${sound}`);
        parts.push(`【皮肤/面部】${skin}`);

        // 30度法则提醒
        parts.push(`【轴线规则】保持轴线：摄像机在角色同侧拍摄，使用三角形机位。若需跨轴，中间插入无关镜头过渡。`);

        if (directorStyle !== 'auto' && DIRECTOR_STYLES[directorStyle]) {
            const style = DIRECTOR_STYLES[directorStyle];
            parts.push(`【导演风格】${style.name} — ${style.colorTone}, ${style.rhythm}`);
        }

        return parts.join('\n');
    }

    // ========== 原有普通场景逻辑 ==========

    // 分析整体场景
    analyzeScene(input) {
        const emotions = [];
        const colors = [];
        const movements = [];

        for (const [keyword, emotion] of Object.entries(this.keywords.emotions)) {
            if (input.includes(keyword)) emotions.push(emotion);
        }
        for (const [keyword, color] of Object.entries(this.keywords.colorMoods)) {
            if (input.includes(keyword)) colors.push(color);
        }
        for (const [keyword, movement] of Object.entries(this.keywords.movements)) {
            if (input.includes(keyword)) movements.push(movement);
        }

        const uniqueEmotions = [...new Set(emotions)];
        const primaryEmotion = uniqueEmotions[0] || 'calm';
        const primaryColor = colors[0] || { id: 75, emotion: '电影感' };

        return {
            emotions: uniqueEmotions,
            primaryEmotion,
            colors,
            primaryColor,
            movements: [...new Set(movements)],
            hasDialogue: input.includes('说') || input.includes('对话') || input.includes('问') || input.includes('答'),
            hasAction: input.includes('跑') || input.includes('追') || input.includes('打') || input.includes('逃'),
            isNight: input.includes('夜') || input.includes('深夜') || input.includes('黑暗'),
            hasCharacter: true
        };
    }

    // 拆分镜头段落（保护引号中的台词不被拆分）
    splitSegments(input, analysis) {
        const rawSegments = this.smartSplit(input);
        if (rawSegments.length <= 1) return this.autoSplit(input, analysis);
        return rawSegments.slice(0, 8);
    }

    // 智能分割：保护引号/台词完整性
    smartSplit(input) {
        // 把所有类型的引号对中的内容保护起来
        const quotes = [];
        
        // 统一保护所有引号对：""  ""  「」  『』  ''
        let protected_input = input;
        
        // 中文弯双引号 "" （最常用）
        protected_input = protected_input.replace(/\u201C[^\u201D]*\u201D/g, (match) => {
            quotes.push(match);
            return `__Q${quotes.length - 1}__`;
        });
        
        // 中文方括号引号 「」
        protected_input = protected_input.replace(/\u300C[^\u300D]*\u300D/g, (match) => {
            quotes.push(match);
            return `__Q${quotes.length - 1}__`;
        });
        
        // 中文双方括号引号 『』
        protected_input = protected_input.replace(/\u300E[^\u300F]*\u300F/g, (match) => {
            quotes.push(match);
            return `__Q${quotes.length - 1}__`;
        });
        
        // ASCII 双引号 "..."
        protected_input = protected_input.replace(/"[^"]*"/g, (match) => {
            quotes.push(match);
            return `__Q${quotes.length - 1}__`;
        });

        // 按句号、感叹号、换行分割（不按问号分——问号常在台词中）
        let segments = protected_input.split(/[。\n]+/).filter(s => s.trim().length > 0);
        
        // 如果段落太少，再用感叹号分
        if (segments.length <= 2) {
            segments = protected_input.split(/[。！\n]+/).filter(s => s.trim().length > 0);
        }
        
        // 如果还是太少，用逗号分
        if (segments.length <= 2) {
            segments = protected_input.split(/[，；\n]+/).filter(s => s.trim().length > 0);
        }

        // 恢复引号内容
        segments = segments.map(seg => {
            return seg.replace(/__Q(\d+)__/g, (_, idx) => quotes[parseInt(idx)] || '');
        });

        return segments.filter(s => s.trim().length > 0);
    }

    // 自动拆分短剧情
    autoSplit(input, analysis) {
        const shots = [];
        shots.push(`环境：${input}的场景全貌`);
        shots.push(`主体：人物进入画面`);
        shots.push(`动作：${input}`);
        shots.push(`情绪：人物面部表情反应`);
        if (analysis.hasAction) shots.push(`高潮：动作的关键瞬间`);
        return shots;
    }

    // 备用生成（序列未找到时）
    fallbackGenerate(input, analysis, directorStyle) {
        const segments = this.splitSegments(input, analysis);
        return segments.map((seg, idx) => this.buildShot(seg, idx, analysis, directorStyle));
    }

    // 构建单个镜头（普通场景）
    buildShot(segment, index, analysis, directorStyle) {
        const totalShots = analysis.emotions.length > 3 ? 6 : 4;
        const shotRole = this.determineShotRole(index, totalShots);
        const shotSize = this.determineShotSize(segment, index, totalShots);
        const movement = this.determineMovement(segment, index, analysis, directorStyle);
        const facing = this.determineFacing(segment, index);
        const motionDir = this.determineMotionDirection(segment, movement);
        const emotion = this.determineEmotion(segment, analysis, index);
        const color = this.determineColor(segment, analysis, emotion);
        const sound = this.determineSound(segment, emotion);
        const skin = this.determineSkin(emotion, shotSize);
        const prompt = this.buildPrompt(segment, shotSize, movement, facing, motionDir, emotion, color, sound, skin, directorStyle);

        return {
            index: index + 1,
            segment: segment.trim(),
            role: shotRole,
            shotSize,
            movement,
            facing,
            motionDirection: motionDir,
            emotion,
            color,
            sound,
            skin,
            prompt
        };
    }

    determineShotRole(index, total) {
        if (index === 0) return { type: 'auxiliary', label: '辅助', desc: '交代背景环境' };
        if (index === total - 1) return { type: 'style', label: '风格', desc: '个人标志性收束' };
        if (index % 3 === 1) return { type: 'narrative', label: '叙事', desc: '推动故事进程' };
        return { type: 'support', label: '支撑', desc: '细节补充强化' };
    }

    determineShotSize(segment, index, total) {
        const sizeProgression = ['大远景', '全景', '中景', '近景', '特写', '微距'];
        for (const [keyword, size] of Object.entries(this.keywords.shotSizes)) {
            if (segment.includes(keyword)) return { cn: size, ...SHOT_SIZES[size] };
        }
        const progressIndex = Math.min(Math.floor(index / total * sizeProgression.length), sizeProgression.length - 1);
        const size = sizeProgression[progressIndex] || '中景';
        return { cn: size, ...SHOT_SIZES[size] };
    }

    determineMovement(segment, index, analysis, directorStyle) {
        for (const [keyword, movementId] of Object.entries(this.keywords.movements)) {
            if (segment.includes(keyword)) {
                const found = this.allMovements.find(m => m.id === movementId);
                if (found) return found;
            }
        }
        if (directorStyle !== 'auto' && DIRECTOR_STYLES[directorStyle]) {
            const style = DIRECTOR_STYLES[directorStyle];
            const defaultId = style.defaultMovements[index % style.defaultMovements.length];
            const found = this.allMovements.find(m => m.id === defaultId);
            if (found) return found;
        }
        const emotionMovements = {
            'tension': SEEDANCE_MOVEMENTS.find(m => m.id === 'smooth_push'),
            'fear': ADVANCED_TECHNIQUES.find(m => m.id === 'dolly_zoom'),
            'lonely': BASIC_MOVEMENTS.find(m => m.id === 'pull'),
            'intimate': SEEDANCE_MOVEMENTS.find(m => m.id === 'smooth_push'),
            'epic': SEEDANCE_MOVEMENTS.find(m => m.id === 'rise_up'),
            'chaos': SEEDANCE_MOVEMENTS.find(m => m.id === 'fpv'),
            'reveal': SEEDANCE_MOVEMENTS.find(m => m.id === 'fast_push_stop'),
            'calm': BASIC_MOVEMENTS.find(m => m.id === 'pan'),
            'power': SEEDANCE_MOVEMENTS.find(m => m.id === 'low_orbit'),
            'warm': SEEDANCE_MOVEMENTS.find(m => m.id === 'lateral_right') || BASIC_MOVEMENTS.find(m => m.id === 'track')
        };
        return emotionMovements[analysis.primaryEmotion] || BASIC_MOVEMENTS.find(m => m.id === 'pan');
    }

    determineFacing(segment, index) {
        if (segment.includes('背') || segment.includes('离开') || segment.includes('远去')) {
            return { direction: '背对', ...FACING_DIRECTIONS['背对'] };
        }
        if (segment.includes('侧') || segment.includes('思考') || segment.includes('沉默')) {
            return { direction: '侧面', ...FACING_DIRECTIONS['侧面'] };
        }
        if (segment.includes('看镜头') || segment.includes('直视') || segment.includes('面对')) {
            return { direction: '正面', ...FACING_DIRECTIONS['正面'] };
        }
        return { direction: '45度', ...FACING_DIRECTIONS['45度'] };
    }

    determineMotionDirection(segment, movement) {
        if (segment.includes('冲') || segment.includes('迎面') || segment.includes('走近')) {
            return { type: '径向', ...MOTION_DIRECTIONS['径向'] };
        }
        if (segment.includes('穿过') || segment.includes('经过') || segment.includes('路过')) {
            return { type: '横向', ...MOTION_DIRECTIONS['横向'] };
        }
        if (movement && (movement.id === 'lateral_left' || movement.id === 'lateral_right' || movement.id === 'side_follow')) {
            return { type: '横向', ...MOTION_DIRECTIONS['横向'] };
        }
        if (movement && (movement.id === 'smooth_push' || movement.id === 'pull' || movement.id === 'behind_follow')) {
            return { type: '径向', ...MOTION_DIRECTIONS['径向'] };
        }
        return { type: '对角线', ...MOTION_DIRECTIONS['对角线'] };
    }

    determineEmotion(segment, analysis, index) {
        for (const [keyword, emotion] of Object.entries(this.keywords.emotions)) {
            if (segment.includes(keyword)) {
                const emotionData = EMOTION_MOVEMENTS.find(e => e.id === emotion);
                if (emotionData) return emotionData;
            }
        }
        const defaultEmotion = EMOTION_MOVEMENTS.find(e => e.id === analysis.primaryEmotion);
        return defaultEmotion || EMOTION_MOVEMENTS[0];
    }

    determineColor(segment, analysis, emotion) {
        for (const [keyword, colorInfo] of Object.entries(this.keywords.colorMoods)) {
            if (segment.includes(keyword)) {
                const palette = COLOR_PALETTES.find(c => c.id === colorInfo.id);
                if (palette) return palette;
            }
        }
        const emotionColorMap = {
            'tension': 96, 'fear': 2, 'lonely': 14, 'intimate': 12,
            'epic': 75, 'chaos': 48, 'reveal': 100, 'calm': 5, 'power': 6, 'warm': 8
        };
        const colorId = emotionColorMap[emotion?.id || analysis.primaryEmotion] || 75;
        return COLOR_PALETTES.find(c => c.id === colorId) || COLOR_PALETTES[0];
    }

    determineSound(segment, emotion) {
        const soundMap = {
            'tension': '低频嗡鸣渐强 + 心跳节奏 + 环境白噪降低',
            'fear': '尖锐弦乐刺入 + 呼吸加速 + 金属摩擦',
            'lonely': '空旷回声 + 单音钢琴 + 远处风声',
            'intimate': '呼吸声特写 + 柔和弦乐 + 布料摩擦',
            'epic': '管弦乐渐强 + 低音鼓 + 风声呼啸',
            'chaos': '快节奏打击 + 玻璃碎裂 + 急促脚步',
            'reveal': '突然静默后重击 + 耳鸣音效',
            'calm': '自然环境音 + 鸟鸣 + 水流',
            'power': '低沉大鼓 + 回声空间 + 脚步声'
        };
        if (segment.includes('门')) return '门轴吱呀 + ' + (soundMap[emotion?.id] || '环境音');
        if (segment.includes('雨')) return '雨滴敲击 + 远处雷声 + ' + (soundMap[emotion?.id] || '');
        if (segment.includes('枪')) return '枪声回响 + 弹壳落地 + 瞬间静默';
        if (segment.includes('车')) return '引擎轰鸣 + 轮胎摩擦 + 风声';
        return soundMap[emotion?.id] || '环境白噪 + 脚步声';
    }

    determineSkin(emotion, shotSize) {
        const skinBase = {
            'tension': '微汗光泽、瞳孔收缩、嘴唇紧抿',
            'fear': '苍白失血色、冷汗、眼白放大',
            'lonely': '暗沉无光、黑眼圈、干燥唇纹',
            'intimate': '柔光暖色、微红面颊、瞳孔放大',
            'epic': '血色饱满、坚毅线条、风吹发丝',
            'chaos': '擦伤、汗水混合灰尘、充血',
            'reveal': '瞳孔骤缩、面部肌肉僵硬、血色退去',
            'calm': '自然润泽、柔和阴影、放松肌肉',
            'power': '深沉肤色、锐利下颌线、冷光轮廓',
            'warm': '健康红润、自然暖光、柔和笑纹、眼神明亮'
        };
        const detail = skinBase[emotion?.id] || '自然肤色、柔和光影';
        if (shotSize.cn === '微距') return detail + '、毛孔可见、汗珠折射光线、细微血管脉动';
        if (shotSize.cn === '特写') return detail + '、皮肤纹理清晰、光影过渡自然';
        return detail;
    }

    buildPrompt(segment, shotSize, movement, facing, motionDir, emotion, color, sound, skin, directorStyle) {
        const parts = [];
        parts.push(`【场景】${segment.trim()}`);
        parts.push(`【景别】${shotSize.cn} (${shotSize.en || ''})`);
        if (movement) {
            const seedancePrompt = movement.seedance || `${movement.cn} - ${movement.desc}`;
            parts.push(`【运镜】${movement.cn} / ${movement.en}: ${seedancePrompt}`);
        }
        parts.push(`【人物朝向】${facing.direction} (${facing.effect})`);
        parts.push(`【运动方向】${motionDir.type}: ${motionDir.effect}`);
        parts.push(`【情绪】${emotion.cn} — ${emotion.techniques || ''}`);
        if (color) parts.push(`【调色】${color.name}: ${color.prompt}`);
        parts.push(`【声音设计】${sound}`);
        parts.push(`【皮肤/面部】${skin}`);
        if (directorStyle !== 'auto' && DIRECTOR_STYLES[directorStyle]) {
            const style = DIRECTOR_STYLES[directorStyle];
            parts.push(`【导演风格】${style.name} — ${style.colorTone}, ${style.rhythm}`);
        }
        return parts.join('\n');
    }
}

// 全局实例
const shotEngine = new ShotEngine();
