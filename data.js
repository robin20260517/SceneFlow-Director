// ============================================
// 导演台 — 数据库
// 包含运镜库、色彩库、情绪映射、导演风格
// ============================================

// === 基础运镜 ===
const BASIC_MOVEMENTS = [
    { id: 'push', cn: '推', en: 'Dolly In / Push In', desc: '相机移近被摄物', effect: '拉近距离、营造紧张/亲密感', category: 'basic', seedance: '镜头沿Z轴平稳向前推进，从全景缓慢聚焦至主体细节，景深变浅，营造屏息期待感' },
    { id: 'pull', cn: '拉', en: 'Dolly Out / Pull Out', desc: '相机远离被摄物', effect: '揭示环境、营造孤立/解脱感', category: 'basic', seedance: '镜头向后匀速拉开，由局部特写扩展至宏大场景，人物逐渐缩小，突显孤寂与史诗感' },
    { id: 'pan', cn: '摇', en: 'Pan', desc: '机位不动，水平旋转', effect: '追随动作、揭示空间', category: 'basic', seedance: '极其缓慢平稳横摇，从容展示大环境的地理风貌与氛围，史诗感开篇' },
    { id: 'track', cn: '移', en: 'Track / Truck', desc: '机位横向移动', effect: '产生流动感、持续展现背景', category: 'basic', seedance: '镜头垂直于被摄体向左平滑横移，保持固定距离，连续展现空间宽度' },
    { id: 'follow', cn: '跟', en: 'Follow Shot', desc: '镜头跟随移动主体', effect: '沉浸感、与角色同行', category: 'basic', seedance: '镜头用稳定器平滑跟随主体移动，保持相对距离与角度不变，画面流畅如丝' },
    { id: 'up', cn: '升', en: 'Boom Up / Crane Up', desc: '镜头上升', effect: '削弱主体、创造宏大/疏离感', category: 'basic', seedance: '镜头从低处缓慢向上仰拍抬起，由脚底至头顶或由地面至苍穹，塑造伟岸与敬仰感' },
    { id: 'down', cn: '降', en: 'Boom Down / Crane Down', desc: '镜头下降', effect: '强化主体、创造压迫/亲密感', category: 'basic', seedance: '镜头从高空或顶部朝下挪移降落，视线压向地面，带来压抑或俯瞰众生的审视感' },
    { id: 'whip', cn: '甩', en: 'Whip Pan', desc: '快速水平旋转模糊转场', effect: '高能转场、制造迷失感', category: 'basic', seedance: '镜头朝一个方向急速甩动，产生动态模糊后衔接下一画面，形成无缝打击节奏' }
];

// === 进阶技法 ===
const ADVANCED_TECHNIQUES = [
    { id: 'dolly_zoom', cn: '滑动变焦', en: 'Dolly Zoom / Vertigo Effect', desc: '相机后退+镜头推近，背景透视变形', effect: '眩晕、恐惧、心理崩溃具象化', category: 'advanced', seedance: '镜头前推同时反向变焦，保持主体大小不变而背景剧烈压缩或拉伸，制造心理眩晕与不安' },
    { id: 'dutch', cn: '荷兰角', en: 'Dutch Angle', desc: '画面水平线倾斜', effect: '不安、混乱、心理失衡', category: 'advanced', seedance: '画面在倾斜的非水平角度下向前推进，制造不稳定与诡异心理' },
    { id: 'handheld', cn: '手持', en: 'Handheld', desc: '无稳定器，刻意晃动', effect: '纪实感、紧迫感、身临其境', category: 'advanced', seedance: '模拟手持摄影的轻微不规则浮动与微颤，仿跟随呼吸节律，增加真实临场与焦虑' },
    { id: 'steadicam', cn: '斯坦尼康', en: 'Steadicam', desc: '身体佩戴稳定器平滑移动', effect: '梦境般流畅空间漫游', category: 'advanced', seedance: '镜头用稳定器平滑跟随主体移动，保持相对距离与角度不变，画面流畅如丝' },
    { id: 'long_take', cn: '长镜头/一镜到底', en: 'Long Take', desc: '长时间无剪辑连续拍摄', effect: '沉浸式真实感、空间连续性', category: 'advanced', seedance: '镜头在长时间内进行空间跨度的移动，云朵飞速流动，车流成光带，浓缩时间流逝' },
    { id: 'crash_zoom', cn: '急推', en: 'Crash Zoom', desc: '快速从广角推到特写', effect: '突然强调、戏剧性揭示', category: 'advanced', seedance: '纯粹通过快速电动变焦从远景急速拉到长焦特写，无视差冲击，空间扁平' },
    { id: 'crane', cn: '摇臂', en: 'Crane / Jib', desc: '机械臂大幅升降+水平运动', effect: '宏大揭示、上帝视角', category: 'advanced', seedance: '模拟摇臂从地面向上抬高，越过前景障碍物揭示后方大场景，充满发现感和戏剧性' },
    { id: 'drone', cn: '航拍', en: 'Drone Shot', desc: '无人机俯视拍摄', effect: '规模感、宏大叙事', category: 'advanced', seedance: '沿固定缆线高空滑行视角，俯瞰森林或城市，轻微晃动，悠长旅行感' },
    { id: 'orbit', cn: '环绕', en: '360° Orbit', desc: '围绕主体旋转', effect: '展现空间关系与动态气势', category: 'advanced', seedance: '镜头环绕主体匀速旋转一周或数周，保持等距固定，展现空间关系与动态气势' }
];

// === Seedance 2.0 运镜库 (精选) ===
const SEEDANCE_MOVEMENTS = [
    { id: 'smooth_push', cn: '平滑推近', en: 'Smooth Push In', desc: '沿Z轴平稳向前推进', effect: '人物情绪递进、产品特写、悬念揭示', category: 'seedance', seedance: '镜头沿Z轴平稳向前推进，从全景缓慢聚焦至主体细节，景深变浅，营造屏息期待感，适配人物情绪递进、产品特写、悬念揭示' },
    { id: 'fast_push_stop', cn: '快速前推急停', en: 'Fast Push Stop', desc: '突然加速后急停产生视觉撞击', effect: '动作冲击、力量爆发', category: 'seedance', seedance: '镜头突然加速前冲，猛烈逼近主体后骤停，产生强烈视觉撞击，适配突发惊吓、动作冲击、力量爆发瞬间' },
    { id: 'fast_pull', cn: '极速后撤拉升', en: 'Fast Pull Back', desc: '极快速度向后弹开拉升', effect: '灾难扩散、真相大白、能量释放', category: 'seedance', seedance: '镜头以极快速度向后弹开拉升，瞬间将视野从微观拉扯至无限大场景，制造猝不及防的惊叹' },
    { id: 'lateral_left', cn: '向左横向平移', en: 'Lateral Left Track', desc: '垂直于被摄体向左平滑横移', effect: '画卷式场景展示、街道巡礼', category: 'seedance', seedance: '镜头垂直于被摄体向左平滑横移，保持固定距离，连续展现空间宽度，适配画卷式场景展示、跟拍行走、街道巡礼' },
    { id: 'lateral_right', cn: '向右横向平移', en: 'Lateral Right Track', desc: '向右匀速平移展开环境', effect: '追逐、游览、空间过渡', category: 'seedance', seedance: '镜头向右匀速平移，徐展开环境全貌或跟随主体动作，画面连贯而稳定，适配追逐、游览、空间过渡' },
    { id: 'tilt_up', cn: '向上仰摇', en: 'Tilt Up', desc: '从低处缓慢向上仰拍', effect: '角色登场、建筑高耸', category: 'seedance', seedance: '镜头从低处缓慢向上仰拍抬起，由脚底至头顶或由地面至苍穹，塑造伟岸与敬仰感，适配角色登场、建筑高耸、巨物凝视' },
    { id: 'tilt_down', cn: '向下俯摇', en: 'Tilt Down', desc: '从高空顶部朝下挪移', effect: '坠落、发现隐藏物', category: 'seedance', seedance: '镜头从高空或顶部朝下挪移降落，视线压向地面，带来压抑或俯瞰众生的审视感，适配坠落、发现隐藏物、俯瞰城市' },
    { id: 'vertigo', cn: '希区柯克滑动变焦', en: 'Vertigo / Dolly Zoom', desc: '前推同时反向变焦', effect: '恐惧、认知颠覆、空间扭曲', category: 'seedance', seedance: '镜头前推同时反向变焦，保持主体大小不变而背景剧烈压缩或拉伸，制造心理眩晕与不安，适配恐惧、认知颠覆、空间扭曲' },
    { id: 'reverse_vertigo', cn: '逆希区柯克变焦', en: 'Reverse Dolly Zoom', desc: '拉远同时推进变焦', effect: '禁锢、危机逼近、命运收束', category: 'seedance', seedance: '镜头拉远同时推进变焦，背景向主体围拢挤压，突显孤立被围困感，适配禁锢、危机逼近、命运收束' },
    { id: 'orbit_360', cn: '360度环绕旋转', en: '360° Orbit', desc: '环绕主体匀速旋转', effect: '英雄定格、战斗宣言', category: 'seedance', seedance: '镜头环绕主体匀速旋转一周或数周，保持等距固定，展现空间关系与动态气势，适配英雄定格、战斗宣言、唯美对视' },
    { id: 'low_orbit', cn: '低角度贴地环绕', en: 'Low Angle Orbit', desc: '接近地面仰角环绕主体旋转', effect: '汽车漂移、脚步特写', category: 'seedance', seedance: '接近地面以仰角环绕主体旋转，夸张腿部动态与速度感，适配汽车漂移、脚步特写、怪兽穿行' },
    { id: 'dive_down', cn: '高空俯冲下降', en: 'High Angle Dive', desc: '从云端俯角急速下坠冲入场景', effect: '空降、飞鸟捕食', category: 'seedance', seedance: '从云端或极高处以俯角急速下坠冲入场景，速度感极强，视角极具侵略性与沉浸感' },
    { id: 'rise_up', cn: '垂直拔地升空', en: 'Vertical Rise', desc: '从地面脚下笔直抬升', effect: '灵魂出窍、火箭发射', category: 'seedance', seedance: '镜头从地面或主体脚下笔直抬升，破空而起，视野急剧扩大，适配灵魂出窍、火箭发射、圣光飞升' },
    { id: 'spiral_up', cn: '螺旋形上升', en: 'Spiral Rise', desc: '以螺旋轨迹由下而上盘旋攀升', effect: '古老楼梯、DNA双螺旋', category: 'seedance', seedance: '镜头以螺旋轨迹由下而上盘旋攀升，多角度展现场景纵深，适配古老楼梯、DNA双螺旋、魔幻升级' },
    { id: 'pov_handheld', cn: '主观POV手持', en: 'POV Handheld', desc: '第一人称视角模仿双眼所见', effect: '记忆闪回、主角视点', category: 'seedance', seedance: '第一人称视角，模仿角色双眼所见，自然摆动、眨眼般明暗变化，完全沉浸代入' },
    { id: 'fpv', cn: 'FPV穿梭飞行', en: 'FPV Flight', desc: '高速第一视角穿越窄缝', effect: '无人机竞速、子弹时间', category: 'seedance', seedance: '高速第一视角飞行，穿越极窄缝隙或丛林，灵活翻滚，失重与刺激，适配无人机竞速、子弹时间穿行' },
    { id: 'behind_follow', cn: '背跟推进', en: 'Behind Follow', desc: '主角背后持续跟随前进', effect: '探险、恐怖走廊', category: 'seedance', seedance: '镜头在主角背后持续跟随前进，带领观者一同进入未知，增强代入感与神秘' },
    { id: 'over_shoulder', cn: '过肩正跟', en: 'Over Shoulder Follow', desc: '越过人物肩膀随其前行', effect: '对话行进、秘密跟踪', category: 'seedance', seedance: '镜头越过人物肩膀随其前行，同时带出部分肩部轮廓，半主观叙事，适配对话行进、秘密跟踪、即将遭遇' },
    { id: 'side_follow', cn: '侧向跟随平移', en: 'Side Track Follow', desc: '与被摄主体保持侧面平行移动', effect: '汽车行驶、侧面跑动', category: 'seedance', seedance: '镜头与被摄主体保持侧面平行移动，背景如卷轴流动，突出速度与节奏' },
    { id: 'whip_pan', cn: '甩镜转场', en: 'Whip Pan', desc: '朝一个方向急速甩动模糊', effect: '快节奏Vlog、动作切换', category: 'seedance', seedance: '镜头朝一个方向急速甩动，产生动态模糊后衔接下一画面，形成无缝打击节奏，适配快节奏Vlog、动作切换、舞台转场' },
    { id: 'time_freeze', cn: '时间冻结绕场', en: 'Bullet Time / Time Freeze', desc: '场景完全静止唯有镜头穿梭环绕', effect: '超能力觉醒、时空暂停', category: 'seedance', seedance: '场景完全静止不动，唯有镜头在其中自由穿梭环绕，超现实的控制感，适配超能力觉醒、时空暂停、意识空间' },
    { id: 'match_motion', cn: '匹配动势运镜', en: 'Match Motion', desc: '运动方向与被摄体动态一致', effect: '武打片、运动广告', category: 'seedance', seedance: '镜头运动方向与被摄体动态一致，如随拳头击出前冲，维持相同的速度感，增强打击力度' }
];

// === 对话镜头 ===
const DIALOGUE_SHOTS = [
    { id: 'high_descent', cn: '高位下降', en: 'High Angle Descent', desc: '从高位缓慢降至人物视线', effect: '增加情绪强度、权力展现', category: 'dialogue' },
    { id: 'over_shoulder_reverse', cn: '过肩反打', en: 'Over-Shoulder Reverse', desc: '越过A肩膀看B再反打', effect: '标准对话镜头、建立空间关系', category: 'dialogue' },
    { id: 'overhead_rise', cn: '俯拍抬升', en: 'Overhead Rise', desc: '从俯视角度缓慢抬升', effect: '情绪强度递增', category: 'dialogue' },
    { id: 'dutch_push', cn: '斜角推进', en: 'Dutch Angle Push', desc: '倾斜画面同时推进', effect: '视觉不适、精神错乱', category: 'dialogue' },
    { id: 'side_think', cn: '思考侧面', en: 'Profile / Side Shot', desc: '纯侧面拍摄人物思考', effect: '压抑、内省', category: 'dialogue' },
    { id: 'bird_eye', cn: '鸟瞰航拍', en: 'Bird\'s Eye View', desc: '完全垂直俯瞰', effect: '渺小无助感', category: 'dialogue' },
    { id: 'pov_fpv', cn: 'POV/FPV视角', en: 'POV / FPV', desc: '模拟角色第一人称视角', effect: '代入感极强', category: 'dialogue' },
    { id: 'worm_eye', cn: '虫眼/地面视角', en: 'Worm\'s Eye View', desc: '地面向上仰拍', effect: '窥视感、压迫感', category: 'dialogue' },
    { id: 'hip_height', cn: '臀高视角', en: 'Hip Height Shot', desc: '相机在腰部高度', effect: '特写背面、对峙', category: 'dialogue' }
];

// === 情绪驱动运镜 ===
const EMOTION_MOVEMENTS = [
    { id: 'tension', cn: '紧张/悬疑', en: 'Tension', techniques: '慢推+限制画面+浅景深+长镜头', example: '希区柯克浴室场景铺垫', category: 'emotion' },
    { id: 'fear', cn: '迷失/恐惧', en: 'Fear/Lost', techniques: '荷兰角+滑动变焦+手持+不对称构图', example: '《闪灵》树篱迷宫', category: 'emotion' },
    { id: 'lonely', cn: '孤独/疏离', en: 'Loneliness', techniques: '后拉/升镜+留白+深焦+大远景', example: '《巴里·林登》', category: 'emotion' },
    { id: 'intimate', cn: '亲密/连接', en: 'Intimacy', techniques: '缓慢推近+浅景深+手持呼吸感', example: '王家卫手持近景', category: 'emotion' },
    { id: 'epic', cn: '宏大/敬畏', en: 'Epic/Awe', techniques: '升镜+无人机拉远+广角+慢动作', example: '《2001》星门', category: 'emotion' },
    { id: 'chaos', cn: '混乱/紧迫', en: 'Chaos', techniques: '手持+急推+甩镜+快速剪辑+荷兰角', example: '《谍影重重3》', category: 'emotion' },
    { id: 'reveal', cn: '揭示/震惊', en: 'Reveal/Shock', techniques: '滑动变焦+快速推近+甩镜切静帧', example: '《七宗罪》', category: 'emotion' },
    { id: 'calm', cn: '安定/平稳', en: 'Calm/Stable', techniques: '固定机位+水平线+对称构图+缓慢平移', example: '小津安二郎', category: 'emotion' },
    { id: 'power', cn: '权力/压迫', en: 'Power', techniques: '低角度+缓慢升+深焦+对称', example: '库布里克单点透视', category: 'emotion' },
    { id: 'warm', cn: '温馨/欢快', en: 'Warm/Joyful', techniques: '平稳横移+暖色自然光+浅景深柔焦+微笑特写', example: '家庭场景、孩子玩耍、日常温馨', category: 'emotion' }
];

// === Seedance 2.0 色彩库 ===
const COLOR_PALETTES = [
    { id: 1, name: '极简无彩色', colors: ['#FFFFFF', '#F5F5DC', '#FAFAFA'], prompt: '纯白/浅灰/象牙白为主，极致干净，营造留白、疏离的高级感，适配极简空间、未来实验室', category: 'neutral', emotion: '冷静、高级' },
    { id: 2, name: '暗黑无彩色', colors: ['#000000', '#1A1A1A', '#2D2D2D'], prompt: '纯黑/炭黑/深灰渐变，深邃空洞，塑造压迫与神秘，适配悬疑、暗黑时尚、废空场景', category: 'neutral', emotion: '压迫、神秘' },
    { id: 3, name: '暖灰中性色', colors: ['#A69F95', '#C4B7A6', '#8B8178'], prompt: '暖调浅灰/燕麦灰/砂石灰为主，柔和中性，平静无情绪，适配现代家居、棉麻织物、日式冷淡风', category: 'neutral', emotion: '平静、中性' },
    { id: 4, name: '冷灰混凝土色', colors: ['#808080', '#696969', '#A9A9A9'], prompt: '冷调水泥灰/尘灰/板岩灰，粗粝厚重，工业未完成感，适配废墟、粗野主义建筑', category: 'neutral', emotion: '粗粝、工业' },
    { id: 5, name: '奶油白', colors: ['#FFFDD0', '#FFF8DC', '#FFFFF0'], prompt: '奶油白/香草色/乳白为主，温柔细腻，柔光质感，适配法式田园、婴儿房、治愈系画面', category: 'warm', emotion: '温柔、治愈' },
    { id: 6, name: '碳素黑金', colors: ['#0D0D0D', '#1C1C1C', '#B8860B'], prompt: '碳黑基底，局部哑光金/古铜点缀，低调奢华，坚硬沉静，适配高端器械、暗系珠宝、权力空间', category: 'special', emotion: '奢华、权力' },
    { id: 7, name: '铂金银', colors: ['#E5E4E2', '#C0C0C0', '#D4D4D4'], prompt: '铂金色/冷银/冰白高光，光滑镜面反射，锋利科技感，适配航天器、液态金属、极寒科幻', category: 'cool', emotion: '科技、锋利' },
    { id: 8, name: '暖姜黄', colors: ['#DAA520', '#CD853F', '#B8860B'], prompt: '姜黄/芥末黄/藓石为主，温暖怀旧，70年代复古感，适配针织面料、秋日市集、老照片', category: 'warm', emotion: '怀旧、温暖' },
    { id: 9, name: '落日橙', colors: ['#FF8C00', '#FF6347', '#FF4500'], prompt: '落日橙/赤陶/暖琥珀为主，浓烈温暖，高能量情绪，适配荒野日落、运动潮流、热带风情', category: 'warm', emotion: '热烈、能量' },
    { id: 10, name: '珊瑚粉', colors: ['#FF7F50', '#FF6B6B', '#FFB6C1'], prompt: '珊瑚粉/蜜瓜橙/肉粉为主，活泼生动，元气甜美，适配水底世界、元气少女、甜品动画', category: 'warm', emotion: '活泼、甜美' },
    { id: 11, name: '勃艮第酒红', colors: ['#722F37', '#800020', '#4A0000'], prompt: '勃艮第红/深酒红/黑樱桃色，浓郁成熟，丝绒质感，适配古典油画、红酒晚宴、成熟欲望', category: 'warm', emotion: '成熟、欲望' },
    { id: 12, name: '干枯玫瑰色', colors: ['#BC8F8F', '#C48B9F', '#D4A5A5'], prompt: '干枯玫瑰粉/豆沙红/烟粉，低饱和友邂，枯萎浪漫，适配复古胶片、情绪人像、衰败花园', category: 'warm', emotion: '浪漫、忧伤' },
    { id: 13, name: '克莱因蓝', colors: ['#002FA7', '#0033CC', '#003399'], prompt: '高饱和克莱因蓝/群青为主，纯粹深邃，理想与虚无并存，适配实验艺术、深海、无限空间', category: 'cool', emotion: '纯粹、深邃' },
    { id: 14, name: '静谧灰蓝', colors: ['#708090', '#778899', '#B0C4DE'], prompt: '灰蓝/雾蓝/婴儿蓝为主，低饱和宁静，空气感透明，适配梦境、晨雾湖泊、孤独症候', category: 'cool', emotion: '宁静、梦幻' },
    { id: 15, name: '蒂芙尼蓝', colors: ['#0ABAB5', '#81D8D0', '#7FFFD4'], prompt: '如更鸟蛋蓝/薄荷蓝/冰蓝，清新精致，珠宝光泽，适配奢华橱窗、早春轻奢、优雅婚典', category: 'cool', emotion: '清新、精致' },
    { id: 16, name: '海军蓝白', colors: ['#000080', '#FFFFFF', '#708090'], prompt: '海军蓝/漂白帆布白/烟灰为主，清爽利落，海洋秩序感，适配航海主题、水手风、海岸度假', category: 'cool', emotion: '秩序、清爽' },
    { id: 17, name: '电光紫', colors: ['#8B00FF', '#7B2FBE', '#9400D3'], prompt: '电光紫/亮紫罗兰/霓虹紫为主，迷幻跳跃，超现实能量，适配电子音乐节、赛博空间、潮玩艺术', category: 'special', emotion: '迷幻、能量' },
    { id: 18, name: '薰衣草灰紫', colors: ['#9B8EA8', '#C8A2C8', '#967BB6'], prompt: '薰衣草紫/烟灰紫/燕麦紫，低饱和温柔，朦胧梦幻，适配南法花田、梦境、治愈系插画', category: 'special', emotion: '温柔、梦幻' },
    { id: 19, name: '薄荷绿', colors: ['#98FB98', '#90EE90', '#3CB371'], prompt: '薄荷绿/海沫绿/浅湖水绿，清凉通透，氧气感十足，适配夏日冰饮、清爽科技、口腔护理视觉', category: 'cool', emotion: '清凉、清爽' },
    { id: 20, name: '橄榄绿', colors: ['#556B2F', '#6B8E23', '#808000'], prompt: '橄榄绿/苔绿/卡其绿为主，低彩度军旅感，克制硬朗，适配户外机能、探险装备、丛林隐蔽', category: 'cool', emotion: '克制、野性' },
    { id: 21, name: '牛油果绿', colors: ['#568203', '#87A96B', '#9DC183'], prompt: '牛油果绿/嫩芽绿/奶油绿，温和营养，健康生机，适配健康餐食、植物工作室、生活方式类画面', category: 'cool', emotion: '健康、自然' },
    { id: 22, name: '翡翠深绿', colors: ['#046307', '#004D00', '#013220'], prompt: '帝王绿/翠绿/孔雀绿，深邃宝石光泽，东方华贵感，适配高级珠宝、中式奢华、秘境雨林', category: 'special', emotion: '华贵、神秘' },
    { id: 30, name: '液态黄金色', colors: ['#FFD700', '#DAA520', '#B8860B'], prompt: '熔金/亮金黄/琥珀流光，高亮流动彭碧，极致奢华，适配黄金雨、炼金术、神圣图腾', category: 'special', emotion: '奢华、神圣' },
    { id: 48, name: '赛博朋克霓虹色', colors: ['#FF1493', '#00BFFF', '#191919'], prompt: '品红/青蓝/暗夜黑底，冷凝街道反光，冷峻雨夜都市，适配雨夜都市、全息广告、机械义体', category: 'special', emotion: '赛博、冷峻' },
    { id: 75, name: '蓝橙对比电影色', colors: ['#1E3A5F', '#FF8C00', '#2F4F4F'], prompt: '阴影青蓝，高光暖橙，经典互补，通透立体感，适配好莱坞动作片、追车、旅行大片', category: 'special', emotion: '电影感、立体' },
    { id: 96, name: '低调欠曝色', colors: ['#0A0A0A', '#1A1A2E', '#2B0000'], prompt: '暗部黑死，仅有微弱轮廓深蓝/暗红，阴晦压抑，适配犯罪现场、地下、失眠', category: 'neutral', emotion: '压抑、暗黑' },
    { id: 100, name: '霓虹暗调单色', colors: ['#8B0000', '#00008B', '#4B0082'], prompt: '单一高饱和色光（任选红/蓝/紫），笼罩暗背景，浓烈情绪，适配舞台、审讯、深情独白', category: 'special', emotion: '浓烈、聚焦' }
];

// === 情绪-调色映射 ===
const EMOTION_COLOR_MAP = {
    '温馨': { colors: '橙黄色系', desc: '暖色调营造安全感和归属感' },
    '危险': { colors: '暗沉橙色 / 红色 / 高饱和低明度', desc: '不安和警觉' },
    '悲伤': { colors: '低沉蓝色 / 低饱和低明度', desc: '情感压抑、冷清' },
    '宁和': { colors: '明亮蓝色', desc: '开阔和平静' },
    '欲望': { colors: '红色', desc: '强烈的情感驱动' },
    '有力': { colors: '澄青色调饱满', desc: '力量感和能量' },
    '恐怖': { colors: '红绿色 / 高饱和低明度', desc: '视觉冲突引发不适' },
    '梦幻': { colors: '黄紫色', desc: '超现实和神秘感' },
    '欢快': { colors: '高饱和高明度', desc: '明亮活泼' },
    '可爱': { colors: '低饱和高明度', desc: '柔和安全' },
    '压抑': { colors: '低饱和低明度', desc: '沉闷窒息' }
};

// === 景别系统（完整版）===
const SHOT_SIZES = {
    '微距': { en: 'Extreme Close-Up (ECU)', desc: '放大细节', rule: '景别小，主体大，动势大' },
    '特写': { en: 'Close-Up (CU)', desc: '放大情绪', rule: '面部精细控制' },
    '近景': { en: 'Medium Close-Up (MCU)', desc: '主角情绪、角色间关系', rule: '情绪张力控制' },
    '中景': { en: 'Medium Shot (MS)', desc: '人物动作', rule: '动作配合肢体动作' },
    '全景': { en: 'Full Shot (FS)', desc: '人物与环境关系', rule: '视觉冲击' },
    '大远景': { en: 'Extreme Long Shot (ELS)', desc: '交代背景、地点', rule: '景别大，主体小，动势小（航拍）' }
};

// === 景别库（用于库页面展示和 @ 调用）===
const SHOT_SIZE_LIBRARY = [
    { id: 'els', cn: '大远景', en: 'Extreme Long Shot', category: 'shotsize', desc: '人物极小，环境主导', prompt: '大远景，人物在画面中极小如蚁，环境占据绝大部分画面。用于交代故事发生的地理环境、世界观、季节氛围。天地苍茫感。' },
    { id: 'ls', cn: '远景', en: 'Long Shot', category: 'shotsize', desc: '可辨认人物轮廓', prompt: '远景，人物完整呈现但较小，可辨认身形和动作方向，环境仍占主导。表现人与环境的关系、孤独感、行进方向。' },
    { id: 'fs', cn: '全景', en: 'Full Shot', category: 'shotsize', desc: '完整人物从头到脚', prompt: '全景，人物从头到脚完整呈现，可清晰看到站姿、服装、肢体语言。交代人物整体状态与所处空间的关系。' },
    { id: 'mfs', cn: '中全景', en: 'Medium Full Shot', category: 'shotsize', desc: '膝盖以上', prompt: '中全景，画面裁切到人物膝盖以上，能看到大部分肢体动作和手部位置。适合表现人物走动、互动、站位关系。' },
    { id: 'ms', cn: '中景', en: 'Medium Shot', category: 'shotsize', desc: '腰部以上', prompt: '中景，画面裁切到人物腰部以上，重点展示上半身动作、手势、道具互动。最常用的叙事景别。' },
    { id: 'mcu', cn: '中近景', en: 'Medium Close-Up', category: 'shotsize', desc: '胸部以上', prompt: '中近景，画面裁切到人物胸部以上，面部表情清晰可读，同时保留少量肩部和环境信息。对话场景主力景别。' },
    { id: 'cu', cn: '近景', en: 'Close-Up', category: 'shotsize', desc: '面部为主', prompt: '近景，面部占据画面主体，能清晰看到眼神、嘴唇、皱纹、汗珠等微表情细节。情绪表达核心景别。' },
    { id: 'bcu', cn: '特写', en: 'Big Close-Up', category: 'shotsize', desc: '面部局部', prompt: '特写，面部局部放大——眼睛、嘴唇、手指、或关键道具。用于强调情绪爆发点或叙事关键物件。' },
    { id: 'ecu', cn: '大特写', en: 'Extreme Close-Up', category: 'shotsize', desc: '眼珠/嘴唇/细节', prompt: '大特写，极度放大单一细节——瞳孔、指甲、戒指、扳机、嘴角抽动。微观世界，情绪或信息的极致聚焦。' },
    { id: 'macro', cn: '微距', en: 'Macro Shot', category: 'shotsize', desc: '超微观', prompt: '微距，超微观拍摄——汗珠折射、皮肤毛孔、布料纤维、金属划痕。放大到肉眼无法察觉的世界。' }
];

// === 机位/角度库（用于库页面展示和 @ 调用）===
const CAMERA_ANGLE_LIBRARY = [
    { id: 'overhead', cn: '俯拍', en: 'Overhead / High Angle', category: 'angle', desc: '从上方向下拍摄', prompt: '俯拍视角，摄影机位于人物上方向下拍摄。人物被压缩在地面，显得渺小、无助或被监控。角度越陡压迫感越强。' },
    { id: 'low_angle', cn: '仰拍', en: 'Low Angle', category: 'angle', desc: '从下方向上拍摄', prompt: '仰拍视角，摄影机位于人物下方向上拍摄。人物显得高大、威严、有压迫力。用于表现权力、英雄感、威胁感。' },
    { id: 'eye_level', cn: '平视', en: 'Eye Level', category: 'angle', desc: '与人物视线平齐', prompt: '平视视角，摄影机与人物眼睛同高。最中性客观的角度，让观众与角色平等对话。无特殊情绪暗示。' },
    { id: 'side_view', cn: '侧面', en: 'Profile / Side View', category: 'angle', desc: '纯侧面90度', prompt: '纯侧面视角，摄影机位于人物正侧方90度位置。展现轮廓线条、侧脸、思考状态。适合表现内省、旁观、平行世界感。' },
    { id: 'back_view', cn: '背影', en: 'Back View', category: 'angle', desc: '从背后拍摄', prompt: '背影视角，摄影机对准人物后背。观众跟随角色视线进入未知空间。表现孤独、离去、神秘、决心。不暴露表情让想象空间更大。' },
    { id: 'ots', cn: '过肩', en: 'Over-the-Shoulder', category: 'angle', desc: '越过一人肩膀拍另一人', prompt: '过肩视角，前景保留一人的肩膀/后脑轮廓，焦点对准画面深处的另一人物。建立对话空间关系，制造前景压迫感。' },
    { id: 'pov', cn: '主观视角', en: 'POV (Point of View)', category: 'angle', desc: '模拟角色第一人称所见', prompt: '主观视角，摄影机完全模拟角色双眼所见。观众变成角色本人，看到角色看到的一切。最强代入感。轻微自然摆动增加真实性。' }
];

// === 人物朝向系统 ===
const FACING_DIRECTIONS = {
    '正面': { effect: '直面观众，最大情感连接', angle: '0°' },
    '45度': { effect: '兼具表情和轮廓，最常用', angle: '45°' },
    '侧面': { effect: '旁观者、思考、压抑', angle: '90°' },
    '背对': { effect: '孤独、远去、神秘', angle: '180°' }
};

// === 运动方向系统 ===
const MOTION_DIRECTIONS = {
    '径向': { effect: '冲击力、紧张压迫感', desc: '正对镜头前后移动' },
    '横向': { effect: '表现角色和环境关系', desc: '平行画面左右移动' },
    '对角线': { effect: '立体感', desc: '斜向运动增加层次' },
    '摇镜头': { effect: '空间感', desc: '固定机位旋转' }
};

// === 导演风格预设（完整模板版）===
const DIRECTOR_STYLES = {
    hitchcock: {
        name: '希区柯克',
        signature: '悬疑大师',
        defaultMovements: ['dolly_zoom', 'smooth_push', 'pov_handheld'],
        colorTone: '低饱和冷绿，阴影浓重，高光克制，暗部占画面60%以上',
        rhythm: '缓慢递进突然爆发',
        shotPreference: '近景为主，特写强调恐惧；限制信息量让观众焦虑',
        composition: '前景遮挡制造窥视感；对称构图突然打破；画面留出"危险区"空白',
        lighting: '单一硬光源制造浓重阴影，面部半明半暗，背光轮廓',
        sound: '低频持续嗡鸣+突然静默+尖锐弦乐刺入',
        skin: '苍白偏冷，额头微汗光泽，瞳孔收缩，嘴唇紧抿',
        keywords: ['悬疑', '恐惧', '偷窥', '秘密', '楼梯', '门', '阴影', '跟踪', '紧张', '窥视']
    },
    kubrick: {
        name: '库布里克',
        signature: '精确控制',
        defaultMovements: ['smooth_push', 'orbit_360', 'steadicam'],
        colorTone: '极度对称冷色基调，单一红色点缀打破平衡，画面如油画般精确',
        rhythm: '极缓慢、机器般精确，镜头移动几乎不可察觉',
        shotPreference: '单点透视中景/全景为主，偶尔面部特写制造不安',
        composition: '完美单点透视对称，消失点在画面正中，所有线条汇聚',
        lighting: '均匀冷光或极端自然光，无人工感，空间自带宿命色彩',
        sound: '古典管弦乐+机械嗡鸣+绝对静默交替，空间回声感强',
        skin: '苍白匀称无血色，面部如大理石，眼窝阴影深重',
        keywords: ['对称', '宿命', '疯狂', '空间', '走廊', '酒店', '冷', '机器', '控制', '精确']
    },
    wong: {
        name: '王家卫',
        signature: '都市情绪',
        defaultMovements: ['handheld', 'side_follow', 'lateral_left'],
        colorTone: '绿色=孤独，红色=欲望，蓝色=思念；低速快门抽帧产生运动拖影',
        rhythm: '凝滞的时间碎片，慢动作与正常速度交织',
        shotPreference: '手持近景为主，面部特写捕捉微表情，从不完全静止',
        composition: '前景遮挡+镜面反射+雨夜霓虹倒影，画面永远有层次重叠',
        lighting: '霓虹灯色温混合，暖橙冷绿交织，雨后湿漉漉的反光',
        sound: '华语流行旋律+雨声+高跟鞋远去+布料摩擦+呼吸声',
        skin: '湿润光泽，霓虹色温映在皮肤上，嘴唇微润深色',
        keywords: ['孤独', '都市', '雨', '霓虹', '思念', '时间', '爱', '香烟', '酒吧', '夜']
    },
    fincher: {
        name: '大卫·芬奇',
        signature: '暗黑精密',
        defaultMovements: ['smooth_push', 'lateral_right', 'tilt_down'],
        colorTone: '绿色阴影覆盖暗部，肤色低饱和偏黄，画面永远像黄昏最后一刻',
        rhythm: '不可察觉的机械精确，50条重复拍摄只取最完美一条',
        shotPreference: '腰/胸高度横向跟移为主，偶尔鸟瞰俯视',
        composition: '严格三分法，人物偏离中心，大量负空间制造压迫',
        lighting: '双面灯光——面部一侧暖一侧冷，永远处于道德灰色地带',
        sound: '电子合成低频+金属质感+极度克制的环境音+静默',
        skin: '低饱和偏黄绿，毛孔可见但不脏，病态精致',
        keywords: ['犯罪', '黑暗', '精密', '城市', '连环', '地下', '社交', '强迫', '完美', '变态']
    },
    anderson: {
        name: '韦斯·安德森',
        signature: '对称童话',
        defaultMovements: ['lateral_left', 'whip_pan', 'track'],
        colorTone: '高饱和糖果色配粉彩，每帧像精心设计的糖果盒',
        rhythm: '整齐的节拍感，甩镜如翻页，对称如立体书',
        shotPreference: '完美居中构图，侧面横移如翻立体书页',
        composition: '绝对对称，人物永远居中，画面像精心布置的微缩模型',
        lighting: '均匀柔光无阴影，如同明亮的室内摄影棚，童话感',
        sound: '60-70年代英伦流行乐+唱片针落+古典弦乐小品',
        skin: '干净无瑕、粉白匀称、如瓷娃娃',
        keywords: ['对称', '色彩', '童话', '酒店', '旅行', '家族', '复古', '甜', '模型', '书']
    },
    scorsese: {
        name: '斯科塞斯',
        signature: '街头史诗',
        defaultMovements: ['steadicam', 'crash_zoom', 'follow'],
        colorTone: '暖色高对比，霓虹灯+汗水+烟雾的光影混合，街头粗粝',
        rhythm: '流行音乐驱动节奏，镜头跟着beat走',
        shotPreference: '斯坦尼康长跟拍+突然急推面部特写',
        composition: '跟随角色进入空间，环境包裹人物，有呼吸感的手持',
        lighting: '夜店霓虹+汽车远光+烟雾扩散光束，对比强烈',
        sound: '经典摇滚/爵士+玻璃碎裂+脚步声+画外音独白',
        skin: '汗水光泽，面部血色饱满，毛孔真实，充满生命力的粗粝',
        keywords: ['街头', '帮派', '赌场', '暴力', '音乐', '纽约', '意大利', '酒', '枪', '兄弟']
    },
    to: {
        name: '杜琪峰',
        signature: '几何枪战',
        defaultMovements: ['lateral_left', 'orbit_360', 'pan'],
        colorTone: '高对比蓝黑夜景，点光源从侧面打入，城市如棋盘',
        rhythm: '长时间静止酝酿→瞬间爆发→再次静止',
        shotPreference: '宽幅构图多人站位，几何感极强，人物如棋子',
        composition: '多人在宽幅画面中几乎不动，站位即叙事，空间即权力',
        lighting: '侧面硬光切割面部，黑暗中只有轮廓和枪管反光',
        sound: '绝对静默+枪声回响+子弹壳落地+远处警笛',
        skin: '深沉冷调，面部线条硬朗，眼神如石头',
        keywords: ['枪', '对峙', '兄弟', '沉默', '夜', '街道', '棋', '等待', '命运', '义气']
    },
    cuaron: {
        name: '卡隆/卢贝兹基',
        signature: '极致长镜头',
        defaultMovements: ['steadicam', 'long_take', 'behind_follow'],
        colorTone: '纯自然光，低饱和如纪录片，天空的颜色决定一切',
        rhythm: '不间断的时间流动，一镜到底让观众无法逃离',
        shotPreference: '长镜头跟随，背后视角，不剪辑让真实感压垮观众',
        composition: '相机困在角色身边，与角色一起被困在混乱中',
        lighting: '100%自然光源，窗户/火焰/天光，无人工补光',
        sound: '360度环境音包围，远近层次分明，声音即空间',
        skin: '自然无修饰，汗水灰尘血迹真实附着，阳光直射的高光',
        keywords: ['长镜头', '战争', '太空', '水', '追逐', '真实', '一镜到底', '逃亡', '自然', '混乱']
    }
};


// ============================================
// === 双人对峙/对话镜头库（完整版） ===
// ============================================
const DIALOGUE_CONFRONTATION_SHOTS = [
    {
        id: 'duo_medium',
        cn: '双人同框中景',
        en: 'Two-Shot Medium',
        desc: '两个人同时出现在画面里，交代空间关系',
        category: 'dialogue_duo',
        usage: '最稳，交代两个人的空间关系',
        prompt: '双人中景，两个人同时出现在画面里，保持清晰的站位和视线关系。中间用长桌、油泵、铁栅栏、文件夹或空白距离形成压迫区。镜头固定不动，重点表现两人之间的沉默、距离和对峙感。'
    },
    {
        id: 'table_axis',
        cn: '长桌轴线双人镜头',
        en: 'Table Axis Two-Shot',
        desc: '沿长桌轴线构图，适合会议/谈判',
        category: 'dialogue_duo',
        usage: '适合战情室、会议室、谈判桌',
        prompt: '沿长桌轴线构图，一人坐在长桌首位，另一人坐在长桌侧边或对面。桌面形成压迫距离，文件夹位于两人之间，像一颗未爆炸的炸弹。两人必须同时在画面内，镜头稳定、冷静、对称。'
    },
    {
        id: 'over_shoulder_talk',
        cn: '过肩镜头',
        en: 'Over-the-Shoulder Shot',
        desc: '一方说话，另一方前景压迫',
        category: 'dialogue_duo',
        usage: '一方说话，另一方作为前景压迫',
        prompt: '过肩镜头，前景保留一方的肩膀和后脑轮廓，焦点落在对方脸上。说话者清晰，听话者压在前景形成威胁感。背景保持真实空间连续，不要切成孤立单人镜头。'
    },
    {
        id: 'reverse_over_shoulder',
        cn: '反打过肩镜头',
        en: 'Reverse Over-the-Shoulder',
        desc: '接住上一句台词，拍反应',
        category: 'dialogue_duo',
        usage: '接住上一句台词，拍反应',
        prompt: '反打过肩镜头，镜头越过说话者肩膀拍听话者反应。听话者少动，主要用眼神、呼吸、下颌线和手指变化承接压力。镜头不夸张，不煽情。'
    },
    {
        id: 'side_confrontation',
        cn: '侧面对峙镜头',
        en: 'Side Confrontation',
        desc: '两人分居画面左右，中间留白',
        category: 'dialogue_duo',
        usage: '像西部片决斗，适合加油站、农场门口',
        prompt: '侧面对峙构图，两人分别占据画面左右两侧，中间留出明显空白距离。镜头固定，让这段空白成为压力区。两人目光相对，谁也不主动靠近。'
    },
    {
        id: 'foreground_compress',
        cn: '前后景压缩镜头',
        en: 'Foreground-Background Compression',
        desc: '长焦压缩，一人静止一人逼近',
        category: 'dialogue_duo',
        usage: '一人静止，一人逼近',
        prompt: '长焦压缩双人构图，一人在前景保持静止，另一人在背景慢慢靠近。空间被压扁，两人之间的距离看起来越来越危险。镜头基本固定，不要广角变形，不要人物漂移。'
    },
    {
        id: 'low_angle_duo',
        cn: '低角度仰拍双人镜头',
        en: 'Low Angle Two-Shot',
        desc: '表现虚张声势、权力感',
        category: 'dialogue_duo',
        usage: '表现虚张声势、权力感、压迫感',
        prompt: '低角度双人镜头，摄影机位置低于人物胸口，让人物身体压住画面。强势一方占据更高位置，弱势一方被压在边缘或背景。注意不要夸张变形，不要漫画感。'
    },
    {
        id: 'slight_overhead_duo',
        cn: '轻微俯拍双人镜头',
        en: 'Slight Overhead Two-Shot',
        desc: '表现两人都被权力系统控制',
        category: 'dialogue_duo',
        usage: '表现两个人都被更大的权力系统控制',
        prompt: '轻微俯拍双人构图，从桌面上方或空间高处观察两人。人物被房间、长桌、屏幕、权力结构压住。镜头像监控一样冷静，不主动煽情。'
    },
    {
        id: 'duo_slow_push',
        cn: '双人同框慢推',
        en: 'Two-Shot Slow Push',
        desc: '逐渐增加压迫感',
        category: 'dialogue_duo',
        usage: '逐渐增加压迫',
        prompt: '双人同框开始，摄影机极慢向前推进。两人始终保持在画面内，不要让任何一方突然消失。推进过程中，桌面、文件夹、油泵或前景遮挡逐渐放大，压迫感慢慢增强。'
    },
    {
        id: 'push_to_silent',
        cn: '推向沉默的一方',
        en: 'Push to Silent One',
        desc: '主导权从说话者转向沉默者',
        category: 'dialogue_duo',
        usage: '让主导权从说话者转向沉默者',
        prompt: '镜头从双人同框开始，极慢推向更沉默、更有控制权的一方。另一人逐渐被画面边缘压缩，但不能消失。压迫感来自沉默者不动，而不是表情夸张。'
    },
    {
        id: 'half_orbit_duo',
        cn: '半环绕双人镜头',
        en: 'Half-Orbit Two-Shot',
        desc: '表现权力变化，不超过90度',
        category: 'dialogue_duo',
        usage: '表现心理权力变化，少量使用',
        prompt: '半环绕对峙镜头，摄影机围绕两人缓慢移动，不超过90度。两个人始终在画面内。随着镜头移动，人物在画面中的主导位置发生变化，表现权力关系正在转移。不要360度大环绕，不要炫技。'
    },
    {
        id: 'peep_duo',
        cn: '遮挡式窥视双人镜头',
        en: 'Voyeur Two-Shot',
        desc: '通过门框/栏杆缝隙偷看对话',
        category: 'dialogue_duo',
        usage: '制造悬疑感、监控感、偷看感',
        prompt: '窥视式双人对话镜头，通过门框、油泵、车窗、栏杆缝隙、屏幕边缘或座椅缝隙拍两人对话。前景遮挡占据画面一部分，让观众像在旁边偷看。两人空间关系必须清楚。'
    },
    {
        id: 'reaction_mcu',
        cn: '反应中近景',
        en: 'Reaction Medium Close-Up',
        desc: '不拍说话者，只拍听话者承压',
        category: 'dialogue_duo',
        usage: '不拍说话者，只拍听话者接住压力',
        prompt: '反应中近景，说话者声音在画外，镜头只拍听话者的眼神、下颌、手指、呼吸变化。人物不夸张反应，越静越有压力。适合表现被一句话压住的瞬间。'
    },
    {
        id: 'object_insert',
        cn: '物件插入特写',
        en: 'Object Insert Close-Up',
        desc: '用物件代替情绪表达',
        category: 'dialogue_duo',
        usage: '用物件代替情绪',
        prompt: '物件插入特写，镜头固定拍两人之间的关键物件：桌面文件夹、加油枪、手机、戒指、铁栅栏锁、屏幕数据。人物对话继续在画外，物件承担紧张感。'
    },
    {
        id: 'single_side_pressure',
        cn: '单侧压迫构图',
        en: 'Single-Side Pressure Composition',
        desc: '强势人物占画面三分之二',
        category: 'dialogue_duo',
        usage: '表现权力不平等',
        prompt: '单侧压迫构图，强势人物占据画面三分之二，另一人被挤在边缘、后景或阴影中。画面比例本身表达双方权力差距。人物不要突然换位，空间保持连续。'
    },
    {
        id: 'power_reverse',
        cn: '权力反转构图',
        en: 'Power Reversal Composition',
        desc: '同一镜头内主导权自然转移',
        category: 'dialogue_duo',
        usage: '前半段A强，后半段B强',
        prompt: '权力反转双人构图，镜头开始时挑衅者占据画面主位，随着对话推进，沉默者不移动，挑衅者反而后退或被画面边缘压缩。主导权在同一镜头内自然转移。'
    },
    {
        id: 'eye_line_dialogue',
        cn: '眼神线对话镜头',
        en: 'Eye-Line Dialogue Shot',
        desc: '确保视线互相对应',
        category: 'dialogue_duo',
        usage: '确保两人真的在对话，不像各拍各的',
        prompt: '保持清晰眼神线，两个人的视线必须互相对应。说话者看向对方，听话者接住视线。不要让人物看向错误方向，不要让两人像不在同一空间。'
    },
    {
        id: 'foreground_pressure',
        cn: '前景压迫双人镜头',
        en: 'Foreground Pressure Two-Shot',
        desc: '使用前景物件制造层次',
        category: 'dialogue_duo',
        usage: '让画面有层次，也更电影感',
        prompt: '使用桌角、椅背、油泵、车门、栏杆、屏幕边缘作为前景压住画面，两个人在中后景对话。前景不抢戏，只制造空间压迫和真实摄影感。'
    },
    {
        id: 'static_confrontation',
        cn: '静止对峙镜头',
        en: 'Static Confrontation',
        desc: '谁都不动的压迫戏',
        category: 'dialogue_duo',
        usage: '适合"谁都不动"的压迫戏',
        prompt: '两人同时在画面内，镜头固定，人物动作极少。只保留呼吸、眼神停顿、手指微动、衣物轻动。对峙感来自等待和沉默，不来自夸张动作。'
    },
    {
        id: 'whip_reaction',
        cn: '轻微甩镜反应',
        en: 'Whip-Pan Reaction',
        desc: '突然反应，一场最多用一次',
        category: 'dialogue_duo',
        usage: '只适合突然反应，一场戏最多一次',
        prompt: '在对方一句话击中人物时，镜头从说话者短促甩到听话者反应，动作干净利落，不加花哨转场。甩镜之后立刻稳定下来。禁止连续乱甩，禁止手持失控感。'
    },
    {
        id: 'doorframe_dialogue',
        cn: '门框对话镜头',
        en: 'Doorframe Dialogue',
        desc: '通过门框困住人物空间',
        category: 'dialogue_duo',
        usage: '室内对峙、权力空间',
        prompt: '通过门框拍两人对话，门框压住画面边缘，像把人物困在空间里。两人不要站得太近，中间留出压迫距离。适合办公室、出租屋、会议室。'
    },
    {
        id: 'glass_reflection_duo',
        cn: '玻璃反射双人镜头',
        en: 'Glass Reflection Two-Shot',
        desc: '通过玻璃反射同时看到两人',
        category: 'dialogue_duo',
        usage: '适合战情室、总统、权力人物',
        prompt: '通过玻璃反射同时看到两个人，一个是真实身体，一个是反射影像。屏幕光、城市光或窗外黑暗叠在脸上，制造权力和监控感。反射不能太乱，人物关系要清楚。'
    },
    {
        id: 'back_pressure_duo',
        cn: '背影压迫双人镜头',
        en: 'Back Pressure Two-Shot',
        desc: '一人背对镜头另一人正面承压',
        category: 'dialogue_duo',
        usage: '一人背对镜头，另一人正面承压',
        prompt: '一方背对摄影机占据前景，另一方在远处正面面对他。前景背影像一堵墙，后景人物承受压力。适合总统、管家、反派、长辈压迫年轻角色。'
    },
    {
        id: 'silence_hold',
        cn: '同框沉默停顿镜头',
        en: 'Silence Hold Shot',
        desc: '台词之间的空白停留',
        category: 'dialogue_duo',
        usage: '台词之间的空白',
        prompt: '两人同框，台词结束后不立刻切走，停留半秒到两秒。人物不说话，只听到环境声。这个停顿让上一句台词变重。'
    },
    {
        id: 'empty_seat_pressure',
        cn: '空位压迫镜头',
        en: 'Empty Seat Pressure',
        desc: '权力人物未完全出场时的登场压力',
        category: 'dialogue_duo',
        usage: '总统、老板、权力人物未完全出场时',
        prompt: '画面里保留一把空椅子或桌首位置，其他人坐着等待。文件夹或物件被放在空位前，所有人的视线落向那里。权力人物可以只露出手、背影或声音，制造登场压力。'
    },
    {
        id: 'table_low_duo',
        cn: '桌面低机位双人镜头',
        en: 'Table-Level Two-Shot',
        desc: '摄影机贴近桌面高度',
        category: 'dialogue_duo',
        usage: '战情室、谈判桌',
        prompt: '摄影机贴近桌面高度，桌面在前景形成压迫线。文件夹位于前景或中央，两个人分坐长桌两侧或远近两端。冷蓝屏幕光从后方打来，人物声音压低，空间紧张。'
    },
    {
        id: 'car_confrontation',
        cn: '车旁双人对峙镜头',
        en: 'Car-Side Confrontation',
        desc: '加油站、路边、停车场对峙',
        category: 'dialogue_duo',
        usage: '加油站、路边、停车场',
        prompt: '两人同时出现在车旁，车子和油泵保持在画面内，空间关系清楚。一人靠近，一人留在车边不动。车身作为现实锚点，防止人物和场景跳切。'
    },
    {
        id: 'railing_split',
        cn: '栏杆分割双人镜头',
        en: 'Railing Split Two-Shot',
        desc: '栏杆分割画面表现隔阂',
        category: 'dialogue_duo',
        usage: '农场、监狱、门口对峙',
        prompt: '铁栅栏或栏杆在前景分割画面，两个人隔着栏杆或栏杆阴影对话。栏杆线条压在人物脸上或胸前，表现无法进入、无法信任、被困住的关系。'
    },
    {
        id: 'follow_enter_duo',
        cn: '背后跟入双人镜头',
        en: 'Follow-Enter Two-Shot',
        desc: '跟随一人进入对话现场',
        category: 'dialogue_duo',
        usage: '人物走进对话现场',
        prompt: '摄影机从一人背后跟随进入空间，随着人物靠近，另一个人逐渐出现在画面中。不要切走，让两人的对话关系在同一镜头里自然形成。'
    },
    {
        id: 'confrontation_end',
        cn: '双人对峙收尾镜头',
        en: 'Confrontation Closing Shot',
        desc: '一句狠话后的冷静收束',
        category: 'dialogue_duo',
        usage: '一句狠话后结束',
        prompt: '两人同框保持不动，说完最后一句后不要马上切，停半拍。听话者的反应很小，比如后退半步、眼神闪避、手指收紧。说话者不追，不解释，镜头保持冷静。'
    }
];

// === 双人对话镜头序列模板 ===
// 不同对话类型使用不同的镜头组合顺序
const DIALOGUE_SEQUENCES = {
    // 标准对峙对话（紧张、权力斗争）
    confrontation: {
        name: '对峙对话',
        desc: '两人权力对抗、谈判、审讯',
        sequence: ['duo_medium', 'over_shoulder_talk', 'reverse_over_shoulder', 'reaction_mcu', 'duo_slow_push', 'push_to_silent', 'confrontation_end']
    },
    // 谈判/会议
    negotiation: {
        name: '谈判会议',
        desc: '正式场合、长桌对坐',
        sequence: ['table_axis', 'over_shoulder_talk', 'reverse_over_shoulder', 'object_insert', 'slight_overhead_duo', 'power_reverse', 'silence_hold']
    },
    // 街头/室外对峙
    outdoor_standoff: {
        name: '室外对峙',
        desc: '街头、停车场、户外',
        sequence: ['side_confrontation', 'foreground_compress', 'over_shoulder_talk', 'reverse_over_shoulder', 'static_confrontation', 'whip_reaction', 'confrontation_end']
    },
    // 权力压迫
    power_dynamic: {
        name: '权力压迫',
        desc: '老板与下属、审讯、长辈压迫',
        sequence: ['empty_seat_pressure', 'low_angle_duo', 'single_side_pressure', 'back_pressure_duo', 'reaction_mcu', 'push_to_silent', 'silence_hold']
    },
    // 悬疑/窥视
    suspense: {
        name: '悬疑对话',
        desc: '监控感、不信任',
        sequence: ['peep_duo', 'doorframe_dialogue', 'glass_reflection_duo', 'over_shoulder_talk', 'foreground_pressure', 'object_insert', 'static_confrontation']
    },
    // 情感对话
    emotional: {
        name: '情感对话',
        desc: '情侣、朋友、亲人间的深度交流',
        sequence: ['duo_medium', 'half_orbit_duo', 'over_shoulder_talk', 'reaction_mcu', 'duo_slow_push', 'eye_line_dialogue', 'silence_hold']
    }
};

// === 双人场景检测关键词 ===
const DUO_SCENE_KEYWORDS = {
    // 表示双人存在
    characters: ['两人', '二人', '双方', '他们', '对方', '彼此', '互相', '面对面', '相对而坐', '对视', '对坐'],
    // 对话动作
    dialogue: ['说', '问', '答', '回答', '质问', '命令', '请求', '威胁', '劝', '骂', '吼', '低声', '耳语', '开口', '台词', '对话', '谈', '聊', '交谈', '争吵', '辩论', '商量', '商议', '谈判'],
    // 对峙/冲突
    confrontation: ['对峙', '对抗', '摊牌', '决裂', '翻脸', '冷战', '沉默', '僵持', '威胁', '逼迫', '审讯', '质问', '拷问', '盘问'],
    // 空间暗示双人
    spatial: ['桌', '对面', '隔着', '之间', '中间', '相隔', '面前', '跟前'],
    // 第二人称出现
    secondPerson: ['你', '他', '她', '对方', '老板', '手下', '同伴', '敌人', '朋友', '妻子', '丈夫', '父亲', '母亲', '儿子', '女儿', '兄弟', '搭档', '警察', '嫌疑人']
};


// ============================================
// === 视频模型配置 ===
// ============================================
const VIDEO_MODELS = {
    seedance: {
        name: 'Seedance 2.0',
        maxDuration: '5s',
        strengths: '运镜精准、色彩控制强、单人特写优秀',
        promptStyle: 'seedance',
        lipSync: false,
        audioSupport: false,
        bestFor: ['单人特写', '运镜展示', '色彩氛围']
    },
    kling: {
        name: 'Kling 3.0 Audio',
        maxDuration: '10s',
        strengths: '口型同步、音频内嵌、多人场景稳定',
        promptStyle: 'kling',
        lipSync: true,
        audioSupport: true,
        bestFor: ['对话场景', '台词口型', '音效同步']
    },
    veo: {
        name: 'Veo 3.1',
        maxDuration: '8s',
        strengths: '画质顶级、光影真实、长镜头连贯',
        promptStyle: 'veo',
        lipSync: true,
        audioSupport: true,
        bestFor: ['电影质感', '光影', '长镜头']
    },
    happyhorse: {
        name: 'Happy Horse',
        maxDuration: '6s',
        strengths: '快速出图、风格化、动作戏稳定',
        promptStyle: 'happyhorse',
        lipSync: false,
        audioSupport: false,
        bestFor: ['快速迭代', '风格化', '动作场景']
    }
};

// ============================================
// === 人物数量控制规则 ===
// ============================================
const CHARACTER_COUNT_RULES = {
    '1': {
        label: '1人（最稳）',
        rule: '画面中只有一个清晰主角，背景无其他人物或仅有极度模糊的路人剪影。',
        prompt_append: '画面中仅有一个清晰人物，不允许出现其他人，或仅允许远景极度模糊的路人剪影。',
        focus: '单人面部、肢体、情绪完全清晰'
    },
    '2': {
        label: '2人对话',
        rule: '画面中两个人物清晰可辨，保持空间关系和视线连续。不允许第三人出现。',
        prompt_append: '画面中恰好两个人物清晰可辨，保持空间关系和视线连续，禁止第三人出现。',
        focus: '双人空间关系、过肩反打、视线对应'
    },
    '3': {
        label: '3人对峙',
        rule: '最多三个人物清晰，形成三角构图。其余为背景模糊处理。',
        prompt_append: '最多三个人物清晰，形成三角构图。其余人物必须极度模糊处理。',
        focus: '三角构图、权力关系、站位叙事'
    },
    'crowd': {
        label: '群演背景',
        rule: '只保留一个主说话者清晰，其余人物全部模糊或虚焦处理。',
        prompt_append: '仅主说话者清晰对焦，其他所有人物刻意虚焦模糊或仅显示为剪影。会议场景只保留一个主说话者清晰。',
        focus: '浅景深、焦点锁定、背景虚化'
    }
};

// ============================================
// === 连续性锁定约束 ===
// ============================================
const CONTINUITY_LOCKS = [
    { id: 'character', label: '角色不变', prompt: '角色外貌绝对一致：相同脸型、发型、发色、身体比例。镜头之间禁止角色变形或替换。' },
    { id: 'costume', label: '服装不变', prompt: '服装完全不变：相同颜色、花纹、质地、褶皱、配饰。场景内禁止换装。' },
    { id: 'vehicle', label: '车辆位置不变', prompt: '车辆位置、颜色、型号、损坏状态保持一致。车辆不能瞬移或无故改变朝向。' },
    { id: 'props', label: '道具位置不变', prompt: '所有道具（文件夹、枪、杯子、手机、家具）保持位置不变，除非被角色明确移动。禁止物品凭空出现或消失。' },
    { id: 'lighting', label: '光线方向不变', prompt: '光源方向全场一致，阴影始终落在相同方向。禁止无动机的光线变化。' },
    { id: 'action_continuity', label: '动作承接', prompt: '动作从上一镜头自然承接。如果角色正在伸手推门，下一镜头手必须已在门把上。禁止动作重置或跳跃。' }
];

// ============================================
// === 台词/口型控制 ===
// ============================================
const LIP_SYNC_RULES = {
    speaking: {
        label: '说话中',
        prompt: '角色正在说话，嘴部动作匹配自然语速节奏。下颌、嘴唇、面部肌肉呈现真实发音状态，伴随轻微头部动作。'
    },
    listening: {
        label: '倾听中',
        prompt: '角色安静倾听，嘴巴闭合或微张。通过眉毛、眼神、下颌微紧来表现反应，无嘴部动作。'
    },
    reaction: {
        label: '反应/停顿',
        prompt: '角色在说话前或说完后短暂停顿。可见轻微吸气，嘴唇微张欲言或说完后紧闭。自然呼吸可见。'
    },
    offscreen: {
        label: '画外音',
        prompt: '声音来自画外。画面中人物呈倾听姿态，无嘴部运动。音频叠加在反应镜头上。'
    }
};

// ============================================
// === 音效库（分类完整版） ===
// ============================================
const SOUND_LIBRARY = {
    environment: {
        label: '环境声',
        sounds: [
            { id: 'server_hum', name: '服务器低鸣', desc: '数据中心持续低频嗡嗡', intensity: 'low' },
            { id: 'wind', name: '风声', desc: '户外自然风，可从微风到狂风', intensity: 'variable' },
            { id: 'insects', name: '虫鸣', desc: '夏夜蟋蟀、蝉鸣', intensity: 'low' },
            { id: 'distant_dog', name: '远处狗叫', desc: '远景犬吠，营造荒凉', intensity: 'low' },
            { id: 'rain_light', name: '细雨', desc: '轻柔雨声滴落在屋顶或窗户', intensity: 'low' },
            { id: 'rain_heavy', name: '暴雨', desc: '密集雨点击打、积水溅射', intensity: 'high' },
            { id: 'thunder', name: '远雷', desc: '远处沉闷雷声', intensity: 'medium' },
            { id: 'city_ambient', name: '城市底噪', desc: '远处车流、空调外机、人声混杂', intensity: 'low' },
            { id: 'night_quiet', name: '深夜寂静', desc: '极度安静，偶尔一声远处汽笛', intensity: 'minimal' },
            { id: 'ocean', name: '海浪', desc: '规律海浪拍岸', intensity: 'medium' },
            { id: 'forest', name: '森林', desc: '鸟鸣、树叶沙沙、偶尔动物声', intensity: 'low' },
            { id: 'indoor_quiet', name: '室内安静', desc: '空调嗡嗡、时钟滴答', intensity: 'minimal' },
            { id: 'crowd_murmur', name: '人群低语', desc: '餐厅或会议前的嘈杂人声', intensity: 'medium' },
            { id: 'neon_buzz', name: '霓虹灯电流', desc: '老旧霓虹招牌的电流嗞嗞声', intensity: 'low' }
        ]
    },
    action: {
        label: '动作声',
        sounds: [
            { id: 'folder_drop', name: '文件夹落桌', desc: '纸张和硬壳撞击桌面', intensity: 'medium' },
            { id: 'fuel_nozzle', name: '油枪插入', desc: '金属卡入+微弱汽油流动', intensity: 'medium' },
            { id: 'car_door', name: '车门关闭', desc: '沉闷的金属关合声', intensity: 'medium' },
            { id: 'footsteps_hard', name: '硬地脚步', desc: '皮鞋在瓷砖或水泥上', intensity: 'medium' },
            { id: 'footsteps_carpet', name: '地毯脚步', desc: '闷声踩踏', intensity: 'low' },
            { id: 'door_open', name: '开门', desc: '门轴转动+空气流动', intensity: 'medium' },
            { id: 'door_slam', name: '摔门', desc: '用力关门产生冲击', intensity: 'high' },
            { id: 'glass_set', name: '玻璃杯放下', desc: '玻璃碰触桌面', intensity: 'low' },
            { id: 'chair_scrape', name: '椅子摩擦', desc: '椅腿在地面拖动', intensity: 'medium' },
            { id: 'paper_flip', name: '翻纸', desc: '纸张翻动', intensity: 'low' },
            { id: 'phone_vibrate', name: '手机震动', desc: '桌面手机震动', intensity: 'low' },
            { id: 'lighter_click', name: '打火机', desc: '金属打火机翻盖点燃', intensity: 'low' },
            { id: 'gun_cock', name: '上膛', desc: '枪械上膛清脆金属声', intensity: 'high' },
            { id: 'key_turn', name: '钥匙转动', desc: '锁芯内钥匙旋转', intensity: 'low' }
        ]
    },
    mechanical: {
        label: '机械声',
        sounds: [
            { id: 'airplane_engine', name: '飞机引擎', desc: '涡轮持续轰鸣', intensity: 'high' },
            { id: 'truck_idle', name: '皮卡怠速', desc: '柴油引擎低频抖动', intensity: 'medium' },
            { id: 'fuel_pump', name: '油泵启动', desc: '机械启动声+液体流动', intensity: 'medium' },
            { id: 'elevator', name: '电梯', desc: '电梯钢缆运行+层数提示音', intensity: 'low' },
            { id: 'server_fan', name: '散热风扇', desc: '高速旋转风扇持续声', intensity: 'low' },
            { id: 'printer', name: '打印机', desc: '机械打印声', intensity: 'medium' },
            { id: 'engine_start', name: '引擎启动', desc: '汽车点火到启动', intensity: 'high' },
            { id: 'hydraulic', name: '液压装置', desc: '液压泵加压释放', intensity: 'medium' }
        ]
    },
    emotional: {
        label: '情绪声',
        sounds: [
            { id: 'low_pulse', name: '低频脉冲', desc: '次低频心跳式脉冲，压迫感', intensity: 'medium' },
            { id: 'single_guitar', name: '单根吉他弦', desc: '一声孤独的吉他拨弦', intensity: 'low' },
            { id: 'orchestral_hit', name: '管弦冲击', desc: '交响乐全奏一击', intensity: 'high' },
            { id: 'breath', name: '呼吸声', desc: '紧张或亲密的呼吸特写', intensity: 'low' },
            { id: 'heartbeat', name: '心跳', desc: '逐渐加速的心跳', intensity: 'medium' },
            { id: 'tinnitus', name: '耳鸣', desc: '高频耳鸣，创伤后', intensity: 'medium' },
            { id: 'drone_low', name: '低音持续', desc: '大提琴或合成器持续低音', intensity: 'medium' },
            { id: 'clock_tick', name: '时钟滴答', desc: '放大的钟表声，暗示时间压迫', intensity: 'low' },
            { id: 'piano_single', name: '单音钢琴', desc: '一个孤立的钢琴音符', intensity: 'low' },
            { id: 'string_tension', name: '弦乐紧张', desc: '小提琴持续高音颤音', intensity: 'high' }
        ]
    },
    silence: {
        label: '静默',
        sounds: [
            { id: 'absolute_silence', name: '绝对安静', desc: '完全无声，让前一个声音的消失产生冲击', intensity: 'zero' },
            { id: 'amplified_silence', name: '声音被放大', desc: '极度安静中微小声音被放大——呼吸、布料、吞咽', intensity: 'minimal' },
            { id: 'muffled', name: '闷声隔绝', desc: '像隔着墙壁或水下，外部声音被屏蔽', intensity: 'low' },
            { id: 'ringing_silence', name: '寂静中的耳鸣', desc: '安静到产生生理耳鸣', intensity: 'minimal' }
        ]
    }
};

// ============================================
// === 防崩约束规则 ===
// ============================================
const ANTI_COLLAPSE_RULES = [
    { id: 'no_disappear', label: '禁止人物消失', prompt: '【关键】角色不能无故从画面中消失，必须有明确的离场动作（走开、转角消失）。禁止突然凭空消失。' },
    { id: 'no_replacement', label: '禁止角色替换', prompt: '【关键】角色面部、身体、身份必须全程一致。禁止变形为另一个人。同一角色同一演员。' },
    { id: 'no_vehicle_teleport', label: '禁止车辆位置变化', prompt: '【关键】车辆位置只能通过可见的驾驶改变。车辆不能瞬移或在镜头间改变停放位置。' },
    { id: 'no_jump_cut', label: '禁止无逻辑跳切', prompt: '【关键】禁止无动机跳切。每次转场必须有空间或时间逻辑。遵守30度法则最小角度变化。' },
    { id: 'no_static_photo', label: '禁止静态照片感', prompt: '【关键】场景必须有生命力——细微呼吸、发丝飘动、布料微动、环境光闪烁。绝不能像一张静态照片。' },
    { id: 'no_frozen_bg', label: '禁止背景完全不动', prompt: '【关键】背景必须有微动——树叶、烟雾、远处车流、云层移动、灯光闪烁。完全静止的背景会破坏真实感。' },
    { id: 'no_extra_people', label: '禁止多余人物进入', prompt: '【关键】禁止随机多余角色进入场景。维持指定的角色数量。禁止画面边缘出现幽灵肢体或半身人影。' }
];


// ============================================
// === 面部表情/肢体动作/血色变化库 ===
// ============================================
const EXPRESSION_LIBRARY = {
    face: {
        label: '面部微表情',
        items: [
            { id: 'cold_stare', cn: '冷漠凝视', prompt: '面部肌肉完全放松，眼神空洞锐利，无任何表情变化，嘴唇紧闭成一条线。' },
            { id: 'suppressed_anger', cn: '压抑怒意', prompt: '下颌线收紧，太阳穴微微鼓动，鼻翼轻微翕动，眼神凝固不闪烁，嘴角向下绷紧。' },
            { id: 'fake_smile', cn: '假笑', prompt: '嘴角上扬但眼睛不笑，眼周无鱼尾纹，笑容不到达眼部，透出冷意。' },
            { id: 'micro_fear', cn: '微恐惧', prompt: '瞳孔轻微放大，眼白增多，嘴唇不自觉微张，喉结轻微吞咽动作。' },
            { id: 'contempt', cn: '轻蔑', prompt: '一侧嘴角不对称上扬，眼睛微眯，下巴微抬，从鼻梁上方向下看对方。' },
            { id: 'grief', cn: '悲痛', prompt: '眉头中央紧皱上提，嘴角极力下压，下唇颤抖，眼眶泛红但强忍不落泪。' },
            { id: 'shock', cn: '震惊', prompt: '眉毛高抬，眼睛骤然睁大，嘴巴微张，面部所有肌肉瞬间僵住不动。' },
            { id: 'disgust', cn: '厌恶', prompt: '鼻子皱起，上唇上提露出牙龈，眉头下压，头部轻微后仰远离。' },
            { id: 'determination', cn: '坚定', prompt: '下颌前推收紧，眼神聚焦不移，嘴唇抿成直线，颈部肌肉绷紧。' },
            { id: 'vulnerability', cn: '脆弱', prompt: '眼角下垂，瞳孔放大湿润，嘴唇微颤，面部肌肉失去所有防备的张力。' },
            { id: 'calculating', cn: '算计', prompt: '眼神左右微动思索，嘴角一侧轻微上挑，手指无意识轻敲，呼吸变浅。' },
            { id: 'relief', cn: '释然', prompt: '紧绷的面部突然松弛，长呼一口气，肩膀下沉，眼神从锐利变为柔和。' }
        ]
    },
    body: {
        label: '肢体动作',
        items: [
            { id: 'power_lean', cn: '权力前倾', prompt: '上身微微前倾侵入对方空间，双手撑桌或扶膝，肩膀展开占据更多空间。' },
            { id: 'defensive_cross', cn: '防御交叉', prompt: '双臂交叉抱胸，身体微微后靠，下巴微收，形成自我保护姿态。' },
            { id: 'nervous_hands', cn: '紧张搓手', prompt: '手指无意识交错摩擦，或反复触碰戒指、袖口、衣角，手指关节微微发白。' },
            { id: 'controlled_still', cn: '控制静止', prompt: '身体完全不动如雕塑，只有极缓慢的呼吸起伏，手放在固定位置纹丝不动，展现绝对控制。' },
            { id: 'collapse_lean', cn: '颓废后靠', prompt: '整个身体深深陷入椅背，头微微后仰，手臂无力垂落，展现精力耗尽的疲惫。' },
            { id: 'threat_stand', cn: '威胁站立', prompt: '缓慢从椅子站起，双手撑桌面，上半身前压，形成从上往下的压迫姿态。' },
            { id: 'exit_turn', cn: '决然转身', prompt: '一个干脆利落的转身，脚步坚定不犹豫，不回头看，肩膀线条笔直。' },
            { id: 'finger_point', cn: '指向', prompt: '食指精准指向对方，手臂完全伸直，手指稳定不颤，配合前倾上身。' },
            { id: 'fist_clench', cn: '握拳', prompt: '手指缓慢收紧成拳，指节发白，前臂肌肉绷紧，但拳头按在桌面或身侧不举起。' },
            { id: 'head_drop', cn: '垂头', prompt: '头缓慢低下，视线从对方脸上滑落到地面，颈部线条暴露，表现认输或极度疲惫。' },
            { id: 'smoke_exhale', cn: '吐烟', prompt: '嘴唇微张缓慢吐出一缕烟，烟雾从脸部升起形成半遮挡，眼神透过烟雾看向对方。' },
            { id: 'glass_swirl', cn: '晃杯', prompt: '手指轻握酒杯底部缓慢旋转，液面打旋，视线不在杯子上而在对方身上。' }
        ]
    },
    bloodColor: {
        label: '面部血色变化',
        items: [
            { id: 'flush_anger', cn: '怒意上涌', prompt: '血色从颈部向面部上升，耳尖发红，面颊呈现不均匀的深粉，太阳穴血管微微鼓动。' },
            { id: 'pale_shock', cn: '失血苍白', prompt: '面部血色瞬间退去，呈灰白或蜡黄色，嘴唇失去血色变为淡粉近白，瞳孔放大。' },
            { id: 'cold_sweat', cn: '冷汗', prompt: '额头、鼻尖、上唇出现细密汗珠，面色苍灰带微绿，皮肤失去光泽变为哑光。' },
            { id: 'drunk_flush', cn: '酒后潮红', prompt: '面颊均匀泛红，延伸至耳朵和颈部，皮肤呈现温暖粉色光泽，眼神微散。' },
            { id: 'exhaustion_gray', cn: '疲惫灰暗', prompt: '皮肤整体灰暗无光，眼下深青紫色黑眼圈，嘴唇干裂缺水色，面部轮廓因疲劳而下垂。' },
            { id: 'arousal_glow', cn: '情动泛红', prompt: '面颊轻微泛粉，耳尖微红，瞳孔放大，唇色加深变为深粉，皮肤呈现柔和光泽。' },
            { id: 'dying_ashen', cn: '濒死灰败', prompt: '皮肤完全失去血色呈蜡黄或青灰，嘴唇发紫，眼周凹陷发青，面部肌肉松弛无力。' },
            { id: 'power_composure', cn: '权力沉着', prompt: '面色平稳深沉，血色均匀但克制，无任何情绪引起的血色变化，皮肤呈现健康但冷调的质感。' }
        ]
    }
};


// ============================================================================
// === 结构化运镜知识库 CINEMA_KB ===
// 源自 film-cinematography-master skill，拆成结构化数据供 AI 引擎检索
// 七大结构：shotSizes / cameraAngles / cameraMoves / compositionRules
//          directorStyles / emotionToCamera / sceneTypeToShotPlan
// ============================================================================

// 1) 景别 — 每个景别绑定「用途」，对应剧情解析的镜头目的
const KB_SHOT_SIZES = {
    '大远景': { en: 'Extreme Long Shot (ELS)', purpose: '建立环境', use: '交代地点/世界观/季节氛围，人物极小如蚁', diagram: 'els', prompt: '大远景，人物在画面中极小，环境占据绝大部分，天地苍茫，建立地理与世界观' },
    '远景':   { en: 'Long Shot (LS)', purpose: '建立环境', use: '可辨认人物轮廓与行进方向，人与环境的关系', diagram: 'ls', prompt: '远景，人物完整但较小，环境主导，表现人与空间的关系、孤独感、方向' },
    '全景':   { en: 'Full Shot (FS)', purpose: '展示动作', use: '人物从头到脚，交代整体状态与肢体语言', diagram: 'fs', prompt: '全景，人物从头到脚完整呈现，看清站姿、服装、肢体语言' },
    '中全景': { en: 'Medium Full Shot (MFS)', purpose: '展示动作', use: '膝盖以上，走动、互动、站位关系', diagram: 'mfs', prompt: '中全景，膝盖以上，看清大部分肢体动作与站位关系' },
    '中景':   { en: 'Medium Shot (MS)', purpose: '展示动作', use: '腰部以上，上半身动作、手势、道具互动，最常用叙事景别', diagram: 'ms', prompt: '中景，腰部以上，重点上半身动作、手势、道具互动' },
    '中近景': { en: 'Medium Close-Up (MCU)', purpose: '放大情绪', use: '胸部以上，面部表情清晰兼留少量环境，对话主力景别', diagram: 'mcu', prompt: '中近景，胸部以上，面部表情清晰，保留少量肩部与环境信息' },
    '近景':   { en: 'Close-Up (CU)', purpose: '放大情绪', use: '面部为主，眼神/嘴唇/汗珠等微表情，情绪变化核心', diagram: 'cu', prompt: '近景，面部占据主体，清晰可见眼神、嘴唇、汗珠等微表情' },
    '特写':   { en: 'Big Close-Up (BCU)', purpose: '强化压迫', use: '面部局部放大，强调情绪爆发点与心理压迫', diagram: 'bcu', prompt: '特写，面部局部放大（眼/唇/手），强调情绪爆发点与心理压迫' },
    '大特写': { en: 'Extreme Close-Up (ECU)', purpose: '强化压迫', use: '瞳孔/指尖/扳机等单一细节极致聚焦', diagram: 'ecu', prompt: '大特写，极度放大单一细节（瞳孔/指尖/扳机），心理压迫到顶点' },
    '微距':   { en: 'Macro Shot', purpose: '关键物件', use: '汗珠折射/毛孔/划痕等超微观，强调关键物件', diagram: 'macro', prompt: '微距，超微观（汗珠折射/毛孔/金属划痕），放大关键物件细节' }
};

// 2) 机位/角度 — 绑定「权力感/脆弱感/对峙」等心理语义
const KB_CAMERA_ANGLES = {
    '平视':   { en: 'Eye Level', feel: '中性客观', use: '与角色平等对话，无情绪暗示', diagram: 'eye_level', prompt: '平视，摄影机与人物眼睛同高，中性客观' },
    '仰拍':   { en: 'Low Angle', feel: '权力感', use: '人物高大威严有压迫力，表现权力/英雄/威胁', diagram: 'low_angle', prompt: '低角度仰拍，摄影机在人物下方向上，人物高大威严，强化权力与压迫' },
    '俯拍':   { en: 'High Angle', feel: '脆弱感', use: '人物渺小无助被监控，表现脆弱/失势', diagram: 'overhead', prompt: '高角度俯拍，摄影机在人物上方向下，人物渺小无助，强化脆弱与被压制' },
    '过肩':   { en: 'Over-the-Shoulder', feel: '对峙', use: '前景留肩，焦点对准对方，建立对话/对峙空间', diagram: 'ots', prompt: '过肩，前景保留一人肩膀轮廓，焦点对准画面深处的另一人，建立对峙空间' },
    '侧面':   { en: 'Profile', feel: '内省/旁观', use: '纯侧面90度，思考、压抑、平行感', diagram: 'side_view', prompt: '纯侧面90度，展现轮廓与思考状态，内省压抑' },
    '背影':   { en: 'Back View', feel: '神秘/离去', use: '不暴露表情，孤独、决心、进入未知', diagram: 'back_view', prompt: '背影，摄影机对准后背，跟随视线进入未知，孤独与决心' },
    '主观视角': { en: 'POV', feel: '极致代入', use: '完全模拟角色双眼所见', diagram: 'pov', prompt: '主观视角，完全模拟角色双眼所见，最强代入，轻微自然摆动' },
    '鸟瞰':   { en: "Bird's Eye View", feel: '渺小无助', use: '完全垂直俯瞰，命运感', diagram: 'overhead', prompt: '鸟瞰，完全垂直向下俯瞰，人物如棋子般渺小无助' }
};

// 3) 运镜 — 统一表，每条带 diagram(分层示意id) + 触发场景 + 英文
const KB_CAMERA_MOVES = {
    '固定镜头':   { en: 'Static Shot', diagram: 'static', trigger: '情绪崩溃定镜、对称稳定', effect: '安定、聚焦、让表演说话', prompt: '机位完全固定，构图稳定，让人物表演主导画面' },
    '缓慢推镜':   { en: 'Slow Push In', diagram: 'push', trigger: '紧张靠近、神圣感、情绪递进', effect: '不可阻挡地逼近，累积压迫与神圣', prompt: '镜头以几乎不可察觉的速度沿Z轴缓慢推进，景深渐浅，累积压迫感' },
    '快速推近':   { en: 'Crash Push', diagram: 'push', trigger: '震撼登场、突发冲击', effect: '猛烈逼近的视觉撞击', prompt: '镜头快速前冲逼近主体，强烈视觉撞击' },
    '拉镜':       { en: 'Pull Out', diagram: 'pull', trigger: '信息揭露、孤立/解脱', effect: '揭示环境、人物渐小', prompt: '镜头向后拉开，由局部扩展到大场景，揭示环境、突显孤立' },
    '横移':       { en: 'Lateral Track', diagram: 'lateral', trigger: '进入场景、画卷式展示', effect: '流动感、持续展现背景', prompt: '镜头垂直于主体平滑横移，保持固定距离，画卷式展开空间' },
    '摇镜':       { en: 'Pan', diagram: 'pan', trigger: '揭示空间、追随动作', effect: '从容展示大环境', prompt: '机位不动水平旋转，从容揭示空间地理' },
    '跟拍':       { en: 'Follow Shot', diagram: 'follow', trigger: '进入场景、与角色同行', effect: '沉浸感、并肩前行', prompt: '稳定器平滑跟随主体移动，保持相对距离，沉浸代入' },
    '手持跟拍':   { en: 'Handheld Follow', diagram: 'handheld_follow', trigger: '逃跑追逐、混乱失控', effect: '纪实感、紧迫、失控', prompt: '手持跟随主体奔跑，刻意不规则晃动与呼吸感，制造失控紧迫' },
    '手持呼吸感': { en: 'Handheld Breathing', diagram: 'handheld', trigger: '情绪崩溃、亲密连接', effect: '微颤临场，脆弱真实', prompt: '轻微手持浮动如呼吸节律，贴近人物的脆弱与真实' },
    '低角度仰推': { en: 'Low Angle Push', diagram: 'low_push', trigger: '震撼登场、英雄气场', effect: '伟岸登场+逼近气场', prompt: '低角度仰拍同时缓慢推近，人物伟岸登场，气场逼人' },
    '升镜':       { en: 'Crane Up', diagram: 'crane_up', trigger: '宏大揭示、疏离', effect: '削弱主体、上帝视角', prompt: '镜头从低处缓慢升起，越过前景揭示后方大场景，宏大疏离' },
    '降镜':       { en: 'Crane Down', diagram: 'crane_down', trigger: '俯瞰压制、发现', effect: '强化主体、压迫', prompt: '镜头从高处朝下降落，视线压向地面，俯瞰压制' },
    '环绕':       { en: '360° Orbit', diagram: 'orbit', trigger: '震撼登场、英雄定格', effect: '展现空间关系与气势', prompt: '镜头环绕主体匀速旋转，等距固定，展现空间关系与动态气势' },
    '滑动变焦':   { en: 'Dolly Zoom', diagram: 'dolly_zoom', trigger: '恐惧、认知颠覆、揭示震惊', effect: '眩晕、心理崩溃具象化', prompt: '镜头前推同时反向变焦，主体大小不变而背景剧烈变形，制造眩晕不安' },
    '荷兰角':     { en: 'Dutch Angle', diagram: 'dutch', trigger: '不安、精神失衡', effect: '混乱、心理失衡', prompt: '画面水平线倾斜，制造不稳定与诡异心理' },
    '甩镜转场':   { en: 'Whip Pan', diagram: 'whip', trigger: '信息揭露、高能转场', effect: '动态模糊衔接、迷失', prompt: '镜头朝一个方向急速甩动，动态模糊后衔接下一画面' },
    '焦点转移':   { en: 'Rack Focus', diagram: 'rack_focus', trigger: '信息揭露、视线引导', effect: '从前景拉到后景，揭示关键', prompt: '焦点从前景目标转移到后景目标，引导视线、揭示信息' },
    '遮挡转场':   { en: 'Wipe-by Transition', diagram: 'occlusion', trigger: '信息揭露、场景切换', effect: '前景遮挡瞬间切换时空', prompt: '前景物体划过完全遮挡画面，借遮挡瞬间切换场景或时空' },
    '过肩正反打': { en: 'Shot-Reverse-Shot', diagram: 'ots', trigger: '双人对话、对峙', effect: '标准对话镜头、轴线规则', prompt: '越过A肩看B、再反打越过B肩看A，保持180度轴线，建立对话空间' }
};

// 4) 构图/对峙规则 — 叙事情境 → 镜头语言
const KB_COMPOSITION_RULES = {
    '建立环境': { shotSize: ['大远景', '远景'], move: '摇镜', note: '大景别交代地点与世界观' },
    '人物动作关系': { shotSize: ['全景', '中景'], move: '横移', note: '中大景别展示动作与人物站位' },
    '情绪变化': { shotSize: ['近景'], move: '缓慢推镜', note: '近景捕捉表情变化' },
    '心理压迫': { shotSize: ['特写', '大特写'], move: '缓慢推镜', note: '特写+逼近制造压迫' },
    '关键物件': { shotSize: ['微距', '大特写'], move: '焦点转移', note: '微距放大关键道具' },
    '权力感': { angle: '仰拍', move: '低角度仰推', note: '低角度抬升人物气场' },
    '脆弱感': { angle: '俯拍', move: '降镜', note: '高角度俯压人物' },
    '对峙': { angle: '过肩', move: '过肩正反打', note: '过肩/正反打+轴线规则' },
    '混乱': { move: '手持跟拍', note: '手持跟拍制造失控' },
    '神圣感': { move: '缓慢推镜', note: '缓慢推镜累积神圣' },
    '恐惧感': { move: '缓慢推镜', extra: '浅景深 + 缓慢靠近', note: '缓慢靠近+浅景深逼出恐惧' }
};

// 5) 导演风格库 — 直接复用上方完整模板 DIRECTOR_STYLES
const KB_DIRECTOR_STYLES = DIRECTOR_STYLES;

// 6) 情绪 → 镜头/表演 映射（剧情解析的核心查表）
const KB_EMOTION_TO_CAMERA = {
    '平静': { shotSize: '中景', angle: '平视', move: '固定镜头', light: '均匀柔光、暖调自然光', sound: '低弱环境声、轻呼吸', expr: 'cold_stare', body: 'controlled_still' },
    '紧张': { shotSize: '近景', angle: '平视', move: '缓慢推镜', light: '单侧硬光、阴影渐重', sound: '低频嗡鸣渐强、心跳隐现', expr: 'micro_fear', body: 'nervous_hands' },
    '压迫': { shotSize: '特写', angle: '仰拍', move: '低角度仰推', light: '顶光下压、面部半明半暗', sound: '低频持续、脚步逼近', expr: 'power_composure', body: 'power_lean' },
    '恐惧': { shotSize: '特写', angle: '俯拍', move: '滑动变焦', light: '低照度、浅景深虚化背景', sound: '尖锐弦乐刺入、骤然静默', expr: 'micro_fear', body: 'defensive_cross' },
    '愤怒': { shotSize: '近景', angle: '平视', move: '快速推近', light: '高对比硬光、暖红溢出', sound: '低吼、桌面重击', expr: 'suppressed_anger', body: 'fist_clench' },
    '爆发': { shotSize: '特写', angle: '平视', move: '手持呼吸感', light: '强光骤变、血色泛红', sound: '情绪声爆裂、玻璃碎裂', expr: 'shock', body: 'threat_stand' },
    '崩溃': { shotSize: '近景', angle: '俯拍', move: '固定镜头', light: '冷调低饱和、面部失光', sound: '抽泣、环境抽离静默', expr: 'grief', body: 'collapse_lean' },
    '疲惫': { shotSize: '近景', angle: '平视', move: '固定镜头', light: '灰暗无光、眼下阴影', sound: '缓慢呼吸、远处嘈杂模糊', expr: 'vulnerability', body: 'head_drop' },
    '伪装冷静': { shotSize: '中近景', angle: '平视', move: '缓慢推镜', light: '均匀光下藏微汗光泽', sound: '克制呼吸、手指轻敲', expr: 'fake_smile', body: 'controlled_still' },
    '余韵': { shotSize: '远景', angle: '平视', move: '拉镜', light: '渐暗或晨光、留白', sound: '环境声回归、余音渐远', expr: 'relief', body: 'exit_turn' },
    '亲密': { shotSize: '近景', angle: '平视', move: '手持呼吸感', light: '柔焦暖光、浅景深', sound: '细微呼吸、布料摩擦', expr: 'vulnerability', body: 'nervous_hands' },
    '宏大': { shotSize: '大远景', angle: '仰拍', move: '升镜', light: '广角自然光、天光主导', sound: '宏大低频、风声空间感', expr: 'determination', body: 'power_lean' },
    '神圣': { shotSize: '中景', angle: '仰拍', move: '缓慢推镜', light: '逆光圣光、轮廓发光', sound: '圣咏式延音、空间回响', expr: 'determination', body: 'controlled_still' },
    '混乱': { shotSize: '中景', angle: '平视', move: '手持跟拍', light: '频闪/晃动光、忽明忽暗', sound: '嘈杂叠加、急促脚步', expr: 'shock', body: 'threat_stand' }
};

// 7) 剧情类型 + 场景 → 分镜计划模板（先分析后输出的"骨架"）
//    每个 shot = { 景别, 机位, 运镜, 目的, 情绪 }
const KB_SCENE_TYPE_TO_SHOT_PLAN = {
    '动作': {
        label: '动作', emotionCurve: '平静 → 紧张 → 爆发 → 余韵',
        shots: [
            { 景别: '大远景', 机位: '平视', 运镜: '摇镜', 目的: '建立环境', 情绪: '平静' },
            { 景别: '全景', 机位: '平视', 运镜: '跟拍', 目的: '人物动作关系', 情绪: '紧张' },
            { 景别: '中景', 机位: '低角度仰拍', 运镜: '低角度仰推', 目的: '震撼登场', 情绪: '压迫' },
            { 景别: '近景', 机位: '平视', 运镜: '快速推近', 目的: '情绪变化', 情绪: '愤怒' },
            { 景别: '中景', 机位: '平视', 运镜: '手持跟拍', 目的: '混乱', 情绪: '混乱' },
            { 景别: '特写', 机位: '平视', 运镜: '固定镜头', 目的: '强化压迫', 情绪: '爆发' }
        ]
    },
    '对话': {
        label: '对话', emotionCurve: '平静 → 紧张 → 对峙 → 余韵',
        shots: [
            { 景别: '全景', 机位: '平视', 运镜: '横移', 目的: '建立环境', 情绪: '平静' },
            { 景别: '中景', 机位: '平视', 运镜: '跟拍', 目的: '人物动作关系', 情绪: '平静' },
            { 景别: '中近景', 机位: '过肩', 运镜: '过肩正反打', 目的: '对峙', 情绪: '紧张' },
            { 景别: '近景', 机位: '平视', 运镜: '缓慢推镜', 目的: '情绪变化', 情绪: '伪装冷静' },
            { 景别: '特写', 机位: '平视', 运镜: '固定镜头', 目的: '强化压迫', 情绪: '爆发' }
        ]
    },
    '悬疑': {
        label: '悬疑', emotionCurve: '平静 → 紧张 → 揭示 → 余韵',
        shots: [
            { 景别: '远景', 机位: '俯拍', 运镜: '缓慢推镜', 目的: '建立环境', 情绪: '平静' },
            { 景别: '中景', 机位: '侧面', 运镜: '横移', 目的: '人物动作关系', 情绪: '紧张' },
            { 景别: '近景', 机位: '平视', 运镜: '缓慢推镜', 目的: '心理压迫', 情绪: '紧张' },
            { 景别: '微距', 机位: '平视', 运镜: '焦点转移', 目的: '关键物件', 情绪: '紧张' },
            { 景别: '中景', 机位: '平视', 运镜: '遮挡转场', 目的: '信息揭露', 情绪: '爆发' }
        ]
    },
    '恐怖': {
        label: '恐怖', emotionCurve: '平静 → 不安 → 恐惧 → 惊吓',
        shots: [
            { 景别: '大远景', 机位: '平视', 运镜: '缓慢推镜', 目的: '建立环境', 情绪: '平静' },
            { 景别: '中景', 机位: '背影', 运镜: '跟拍', 目的: '神圣感', 情绪: '紧张' },
            { 景别: '近景', 机位: '平视', 运镜: '滑动变焦', 目的: '恐惧感', 情绪: '恐惧' },
            { 景别: '特写', 机位: '俯拍', 运镜: '缓慢推镜', 目的: '心理压迫', 情绪: '恐惧' },
            { 景别: '大特写', 机位: '平视', 运镜: '快速推近', 目的: '强化压迫', 情绪: '爆发' }
        ]
    },
    '情绪爆发': {
        label: '情绪爆发', emotionCurve: '压抑 → 临界 → 爆发 → 崩溃',
        shots: [
            { 景别: '中近景', 机位: '平视', 运镜: '缓慢推镜', 目的: '情绪变化', 情绪: '伪装冷静' },
            { 景别: '近景', 机位: '平视', 运镜: '缓慢推镜', 目的: '心理压迫', 情绪: '紧张' },
            { 景别: '特写', 机位: '平视', 运镜: '手持呼吸感', 目的: '强化压迫', 情绪: '爆发' },
            { 景别: '近景', 机位: '俯拍', 运镜: '固定镜头', 目的: '情绪变化', 情绪: '崩溃' },
            { 景别: '远景', 机位: '平视', 运镜: '拉镜', 目的: '信息揭露', 情绪: '余韵' }
        ]
    },
    '广告CTA': {
        label: '广告 CTA', emotionCurve: '吸引 → 痛点 → 产品 → 行动号召',
        shots: [
            { 景别: '中景', 机位: '平视', 运镜: '横移', 目的: '建立环境', 情绪: '平静' },
            { 景别: '近景', 机位: '平视', 运镜: '缓慢推镜', 目的: '情绪变化', 情绪: '紧张' },
            { 景别: '微距', 机位: '平视', 运镜: '焦点转移', 目的: '关键物件', 情绪: '亲密' },
            { 景别: '全景', 机位: '仰拍', 运镜: '环绕', 目的: '震撼登场', 情绪: '宏大' },
            { 景别: '特写', 机位: '平视', 运镜: '快速推近', 目的: '强化压迫', 情绪: '爆发' }
        ]
    },
    '世界杯冲突': {
        label: '世界杯冲突', emotionCurve: '蓄势 → 对峙 → 爆发 → 沸腾',
        shots: [
            { 景别: '大远景', 机位: '鸟瞰', 运镜: '升镜', 目的: '建立环境', 情绪: '宏大' },
            { 景别: '全景', 机位: '低角度仰拍', 运镜: '跟拍', 目的: '人物动作关系', 情绪: '紧张' },
            { 景别: '中近景', 机位: '过肩', 运镜: '过肩正反打', 目的: '对峙', 情绪: '愤怒' },
            { 景别: '特写', 机位: '平视', 运镜: '快速推近', 目的: '情绪变化', 情绪: '爆发' },
            { 景别: '中景', 机位: '平视', 运镜: '手持跟拍', 目的: '混乱', 情绪: '混乱' },
            { 景别: '微距', 机位: '平视', 运镜: '焦点转移', 目的: '关键物件', 情绪: '爆发' }
        ]
    }
};

// 表情/肢体库映射（情绪 → 微表情 + 肢体），供 AI 与本地引擎查表
const KB_EMOTION_PERFORMANCE = {
    '愤怒': { face: '下颌绷紧、鼻翼扩张、眼神锁定', body: '握拳、上身前压、肩膀展开', exprId: 'suppressed_anger', bodyId: 'fist_clench' },
    '恐惧': { face: '瞳孔放大、嘴唇微张、喉结吞咽', body: '肩膀内收、双臂防御交叉、身体后撤', exprId: 'micro_fear', bodyId: 'defensive_cross' },
    '压迫': { face: '身体前倾、下巴微低、眼神不眨', body: '撑桌前压、占据空间、纹丝不动', exprId: 'power_composure', bodyId: 'power_lean' },
    '疲惫': { face: '眼袋明显、眨眼缓慢、目光涣散', body: '肩膀下沉、深陷椅背、垂头', exprId: 'vulnerability', bodyId: 'head_drop' },
    '伪装冷静': { face: '嘴角僵硬、呼吸浅、笑不到眼底', body: '手指轻敲、身体克制静止', exprId: 'fake_smile', bodyId: 'controlled_still' }
};

// 统一导出对象，供 ai-engine.js / app.js 引用
const CINEMA_KB = {
    shotSizes: KB_SHOT_SIZES,
    cameraAngles: KB_CAMERA_ANGLES,
    cameraMoves: KB_CAMERA_MOVES,
    compositionRules: KB_COMPOSITION_RULES,
    directorStyles: KB_DIRECTOR_STYLES,
    emotionToCamera: KB_EMOTION_TO_CAMERA,
    sceneTypeToShotPlan: KB_SCENE_TYPE_TO_SHOT_PLAN,
    emotionPerformance: KB_EMOTION_PERFORMANCE
};
if (typeof window !== 'undefined') window.CINEMA_KB = CINEMA_KB;
