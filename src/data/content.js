import { Sun, Utensils, Activity, Moon, Pill, Sparkles, ChevronDown, ArrowUp, Calendar } from 'lucide-react';

export const dailySchedule = [
  {
    period: 'morning',
    label: '早晨唤醒',
    icon: Sun,
    color: 'text-amber-400',
    tasks: [
      { id: 'm1', title: '起床：鼻腔冲洗', desc: '双侧各120-200ml温盐水', tag: '鼻炎' },
      { id: 'm2', title: '服药：艾司奥美拉唑 1片', desc: '⚠️ 必须空腹，服完后等30分钟再吃饭', tag: '胃部', important: true },
      { id: 'm3', title: '等待30分钟后吃早餐', desc: '', tag: '行为' },
      { id: 'm4', title: '服药：莫沙必利 1片', desc: '早餐前10-15分钟服用', tag: '胃部' },
    ],
  },
  {
    period: 'noon',
    label: '午间能量',
    icon: Utensils,
    color: 'text-orange-400',
    tasks: [
      { id: 'n1', title: '服药：莫沙必利 1片', desc: '午餐前10-15分钟服用', tag: '胃部' },
      { id: 'n2', title: '午餐行为控制', desc: '细嚼慢咽 (15-20次)，腹式呼吸，少说话', tag: '行为' },
    ],
  },
  {
    period: 'evening',
    label: '晚间修护',
    icon: Activity,
    color: 'text-indigo-400',
    tasks: [
      { id: 'e1', title: '服药：莫沙必利 1片', desc: '晚餐前10-15分钟服用', tag: '胃部' },
      { id: 'e2', title: '晚餐后保持直立', desc: '至少2-3小时，不要马上躺下', tag: '行为' },
      { id: 'e3', title: '鼻腔冲洗', desc: '温盐水冲洗，清理一天的分泌物', tag: '鼻炎' },
    ],
  },
  {
    period: 'bedtime',
    label: '深睡准备',
    icon: Moon,
    color: 'text-purple-400',
    tasks: [
      { id: 'b1', title: '用药：鼻喷激素', desc: '内舒拿/辅舒良/雷诺考特，每侧1-2喷', tag: '鼻炎', important: true },
      { id: 'b2', title: '环境：抬高床头', desc: '15-20cm，或使用楔形枕', tag: '行为' },
      { id: 'b3', title: 'SOS：铝碳酸镁 (按需)', desc: '仅在反酸明显时服用，与艾司奥美拉唑间隔>1小时', tag: '按需' },
      { id: 'b4', title: 'SOS：羟甲唑啉 (按需)', desc: '仅在非常鼻塞时用，最多连用5-7天', tag: '按需' },
    ],
  },
];

export const medicineInfo = [
  {
    category: '胃部 + 反流治疗',
    items: [
      { name: '艾司奥美拉唑 (20mg)', use: '1片/日 早上空腹', effect: '抑酸、修复食管炎', note: '服后30分钟内禁食' },
      { name: '莫沙必利 (5mg)', use: '1片/次 三餐前10分', effect: '促胃排空、减嗳气', note: '必须按时吃' },
      { name: '铝碳酸镁', use: '1片 (按需)', effect: '中和胃酸、护胃', note: '睡前或夜间反酸时' },
    ],
  },
  {
    category: '鼻炎 + 鼻塞治疗',
    items: [
      { name: '生理盐水冲洗', use: '早晚各一次', effect: '清炎、通鼻', note: '水温36–38℃' },
      { name: '鼻喷激素', use: '每侧1-2喷 睡前', effect: '抗炎、长期改善', note: '坚持2-4周见效' },
      { name: '羟甲唑啉', use: '每侧1喷 (SOS)', effect: '快速通鼻', note: '最多用5-7天' },
    ],
  },
];

export const behaviorRules = [
  { title: '呼吸方式', content: '改用腹式呼吸（吸气鼓肚子），减少吞气根源。' },
  { title: '饮食习惯', content: '细嚼15-20次，小口喝水，不吃口香糖/吸管/碳酸饮料。' },
  { title: '睡眠环境', content: '抬高床头15-20cm，减少夜间反流和口呼吸。' },
  { title: '忌口', content: '睡前3小时不进食，避开高脂、辛辣、咖啡。' },
];

export const tabIcons = {
  plan: Pill,
  insight: Activity,
  behavior: Sparkles,
  timeline: Calendar,
  chevron: ChevronDown,
  arrow: ArrowUp,
};
