// createVillagers.js

import { Villager } from "./classes.js";
import { randInt, randChoice, randNormalInRange } from "./util.js";
import { theVillage } from "./main.js";

/**
 * 初期村人の人数設定
 */
const INITIAL_MALE_COUNT = 3;   // 初期男性の人数
const INITIAL_FEMALE_COUNT = 3; // 初期女性の人数

// 使用済みの名前を追跡する Set を追加
const usedNames = new Set();

// 使用済みの顔グラフィックを追跡するSetを追加
export const usedPortraits = {
  male: new Set(),
  female: new Set()
};

// 顔グラフィックのファイル名リストを上部に移動し、グループ分けを明確に
export const MALE_PORTRAIT_FILES = {
  // 肌肉發達・強壯グループ
  GROUP_A: [
    "MA1.png", "MA2.png", "MA3.png", "MA4.png", "MA5.png", "MA6.png", "MA7.png", "MA8.png", "MA9.png", "MA10.png", "MA11.png", "MA12.png", "MA13.png", "MA14.png", "MA15.png", "MA16.png"
  ],
  
  // 美形・俊俏グループ
  GROUP_B: [
    "MB1.png", "MB2.png", "MB3.png", "MB4.png", "MB5.png", "MB6.png", "MB7.png", "MB8.png", "MB9.png", "MB10.png", "MB11.png", "MB12.png", "MB13.png", "MB14.png", "MB15.png", "MB16.png", "MB17.png", "MB18.png", "MB19.png", "MB20.png", "MB21.png", "MB22.png", "MB23.png", "MB24.png"
  ],
  
  // 魅力高めグループ
  GROUP_C: [
    "MC1.png", "MC2.png", "MC3.png", "MC4.png", "MC5.png", "MC6.png", "MC7.png", "MC8.png", "MC9.png", "MC10.png", "MC11.png", "MC12.png", "MC13.png", "MC14.png", "MC15.png", "MC16.png", "MC17.png", "MC18.png", "MC19.png", "MC20.png", "MC21.png", "MC22.png", "MC23.png", "MC24.png", "MC25.png", "MC26.png", "MC27.png", "MC28.png", "MC29.png", "MC30.png", "MC31.png", "MC32.png", "MC33.png", "MC34.png", "MC35.png", "MC36.png", "MC37.png", "MC38.png", "MC39.png", "MC40.png", "MC41.png", "MC42.png", "MC43.png", "MC44.png", "MC45.png", "MC46.png", "MC47.png", "MC48.png", "MC49.png", "MC50.png", "MC51.png", "MC52.png", "MC53.png", "MC54.png", "MC55.png"
  ],
  
  // 堅實系グループ
  GROUP_D: [
    "MD1.png", "MD2.png", "MD3.png", "MD4.png", "MD5.png", "MD6.png", "MD7.png", "MD8.png", "MD9.png", "MD10.png", "MD11.png", "MD12.png", "MD13.png", "MD14.png", "MD15.png", "MD16.png", "MD17.png", "MD18.png", "MD19.png", "MD20.png", "MD21.png", "MD22.png", "MD23.png", "MD24.png", "MD25.png", "MD26.png", "MD27.png", "MD28.png", "MD29.png", "MD30.png"
  ],
  
  // 痩せ型・普通グループ
  GROUP_E: [
    "ME1.png", "ME2.png", "ME3.png", "ME4.png", "ME5.png", "ME6.png", "ME7.png", "ME8.png", "ME9.png", "ME10.png", "ME11.png", "ME12.png", "ME13.png", "ME14.png", "ME15.png", "ME16.png", "ME17.png", "ME18.png", "ME19.png", "ME20.png", "ME21.png", "ME22.png"
  ]
};

// 顔グラフィックのファイル名リストに女性用を追加
const FEMALE_PORTRAIT_FILES = {
  // 清楚・神秘グループ
  GROUP_A: [
"A1.png", "A2.png", "A3.png", "A4.png", "A5.png", "A6.png", "A7.png", "A8.png", "A9.png", "A10.png",
"A11.png", "A12.png", "A13.png", "A14.png", "A15.png", "A16.png", "A17.png", "A18.png", "A19.png", "A20.png",
"A21.png", "A22.png", "A23.png", "A24.png", "A25.png", "A26.png", "A27.png", "A28.png", "A29.png", "A30.png",
"A31.png", "A32.png", "A33.png", "A34.png", "A35.png", "A36.png", "A37.png", "A38.png", "A39.png", "A40.png",
"A41.png", "A42.png", "A43.png", "A44.png", "A45.png", "A46.png", "A47.png", "A48.png", "A49.png", "A50.png",
"A51.png", "A52.png", "A53.png", "A54.png", "A55.png", "A56.png", "A57.png", "A58.png"
  ],
  
  // 華麗・魅惑グループ
  GROUP_B: [
"BB1.png", "BB2.png", "BB3.png", "BB4.png", "BB5.png", "BB6.png", "BB7.png", "BB8.png", "BB9.png", "BB10.png",
"BB11.png", "BB12.png", "BB13.png", "BB14.png", "BB15.png", "BB16.png", "BB17.png", "BB18.png", "BB19.png", "BB20.png",
"BB21.png", "BB22.png", "BB23.png", "BB24.png", "BB25.png", "BB26.png", "BB27.png", "BB28.png", "BB29.png", "BB30.png",
"BB31.png", "BB32.png", "BB33.png", "BB34.png", "BB35.png", "BB36.png", "BB37.png", "BB38.png", "BB39.png", "BB40.png",
"BB41.png", "BB42.png", "BB43.png", "BB44.png", "BB45.png", "BB46.png"

  ],
  
  // 高冷・健康グループ
  GROUP_C: [
"C1.png", "C2.png", "C3.png", "C4.png", "C5.png", "C6.png", "C7.png", "C8.png", "C9.png", "C10.png",
"C11.png", "C12.png", "C13.png", "C14.png", "C15.png", "C16.png", "C17.png", "C18.png", "C19.png", "C20.png",
"C21.png", "C22.png", "C23.png", "C24.png", "C25.png", "C26.png", "C27.png", "C28.png", "C29.png", "C30.png",
"C31.png", "C32.png", "C33.png", "C34.png", "C35.png", "C36.png", "C37.png", "C38.png", "C39.png", "C40.png",
"C41.png", "C42.png", "C43.png", "C44.png", "C45.png", "C46.png", "C47.png", "C48.png", "C49.png", "C50.png",
"C51.png", "C52.png", "C53.png", "C54.png", "C55.png", "C56.png", "C57.png", "C58.png", "C59.png", "C60.png",
"C61.png", "C62.png", "C63.png", "C64.png", "C65.png", "C66.png", "C67.png", "C68.png", "C69.png", "C70.png",
"C71.png", "C72.png", "C73.png", "C74.png"
  ],
  
  // 普通・地味グループ
  GROUP_D: [
"D1.png", "D2.png", "D3.png", "D4.png", "D5.png", "D6.png", "D7.png", "D8.png", "D9.png", "D10.png",
"D11.png", "D12.png", "D13.png", "D14.png", "D15.png", "D16.png", "D17.png", "D18.png", "D19.png", "D20.png",
"D21.png", "D22.png", "D23.png", "D24.png", "D25.png", "D26.png", "D27.png", "D28.png", "D29.png", "D30.png",
"D31.png", "D32.png", "D33.png", "D34.png", "D35.png", "D36.png", "D37.png", "D38.png", "D39.png"
  ]
};

/**
 * 性別と能力値に応じて顔グラフィックを選択
 */
function selectPortraitByCharacter(character) {
  // グループから選択する前に、使用可能な顔グラフィックをフィルタリング
  const filterUnusedPortraits = (portraitList) => {
    return portraitList.filter(portrait => !usedPortraits[character.bodySex === "男" ? "male" : "female"].has(portrait));
  };

  if (character.bodySex === "男") {
    const bodyTraits = character.bodyTraits;
    let selectedGroup = null;
    
    // 1. まず特性による判定を行う
    if (bodyTraits.some(trait => [
      "巨漢", "怪力", "健壯", "肌肉結實",
      "肌肉發達", "巨人"
    ].includes(trait))) {
      selectedGroup = MALE_PORTRAIT_FILES.GROUP_A;
    } 
    else if (bodyTraits.some(trait => [
      "美形", "俊俏", "中性", "眉目秀麗", "帥哥",
      "男模", "謎團", "冷酷"
    ].includes(trait))) {
      selectedGroup = MALE_PORTRAIT_FILES.GROUP_B;
    }
    
    // 2. 特性がない場合はステータスで判定
    if (!selectedGroup) {
      if (character.chr >= 15) {
        selectedGroup = MALE_PORTRAIT_FILES.GROUP_C;
      }
      else if (character.chr <= 14 && character.vit >= 15) {
        selectedGroup = MALE_PORTRAIT_FILES.GROUP_D;
      }
      else if (character.chr <= 14 && character.vit <= 14) {
        selectedGroup = MALE_PORTRAIT_FILES.GROUP_E;
      }
      else {
        // どの条件にも当てはまらない場合
        selectedGroup = MALE_PORTRAIT_FILES.GROUP_E;
      }
    }

    // 3. 選択されたグループから使用可能な顔グラフィックを選択
    let availablePortraits = filterUnusedPortraits(selectedGroup);
    if (availablePortraits.length > 0) {
      const selected = randChoice(availablePortraits);
      usedPortraits.male.add(selected);
      return selected;
    }
    
    // 4. 使用可能な顔グラフィックがない場合は使用済みリストをクリアして再選択
    usedPortraits.male.clear();
    const selected = randChoice(selectedGroup);
    usedPortraits.male.add(selected);
    return selected;
  }
  
  // 女性の場合も同様の処理
  const bodyTraits = character.bodyTraits;
  
  // グループA: 清楚・神秘系
  if (bodyTraits.some(trait => [
    "療癒系", "清楚", "神秘的", "謎團",
    "奢華", "薄倖"
  ].includes(trait))) {
    const availablePortraits = filterUnusedPortraits(FEMALE_PORTRAIT_FILES.GROUP_A);
    if (availablePortraits.length > 0) {
      const selected = randChoice(availablePortraits);
      usedPortraits.female.add(selected);
      return selected;
    }
  }
  
  // グループB: 華麗・魅惑系
  if (bodyTraits.some(trait => [
    "華麗", "魔性", "豐滿", "體態優美", "絕世美女"
  ].includes(trait))) {
    const availablePortraits = filterUnusedPortraits(FEMALE_PORTRAIT_FILES.GROUP_B);
    if (availablePortraits.length > 0) {
      const selected = randChoice(availablePortraits);
      usedPortraits.female.add(selected);
      return selected;
    }
  }
  
  // グループC: 高冷・健康系
  if (bodyTraits.some(trait => [
    "高冷", "冷酷", "柔軟",
    "健康", "纖細", "肌肉發達", "巨大", "胖女人"
  ].includes(trait))) {
    const availablePortraits = filterUnusedPortraits(FEMALE_PORTRAIT_FILES.GROUP_C);
    if (availablePortraits.length > 0) {
      const selected = randChoice(availablePortraits);
      usedPortraits.female.add(selected);
      return selected;
    }
  }
  
  // グループD: 普通・地味系
  if (bodyTraits.some(trait => [
    "虛弱", "精瘦", "嬌小", "平凡",
    "地味", "不起眼", "質樸", "童顔"
  ].includes(trait))) {
    const availablePortraits = filterUnusedPortraits(FEMALE_PORTRAIT_FILES.GROUP_D);
    if (availablePortraits.length > 0) {
      const selected = randChoice(availablePortraits);
      usedPortraits.female.add(selected);
      return selected;
    }
  }
  
  // デフォルト: 特徴がない場合は普通グループから
  const availablePortraits = filterUnusedPortraits(FEMALE_PORTRAIT_FILES.GROUP_D);
  if (availablePortraits.length > 0) {
    const selected = randChoice(availablePortraits);
    usedPortraits.female.add(selected);
    return selected;
  }
  
  // 全ての顔グラフィックが使用済みの場合、使用済みリストをクリアして再選択
  usedPortraits.female.clear();
  const selected = randChoice(FEMALE_PORTRAIT_FILES.GROUP_D);
  usedPortraits.female.add(selected);
  return selected;
}

/**
 * 初期村人を生成して返す
 */
export function createInitialVillagers() {
  let villagers = [];
  const totalCount = INITIAL_MALE_COUNT + INITIAL_FEMALE_COUNT;
  let maleCount = 0;
  let femaleCount = 0;

  // 男女交互に生成
  for (let i = 0; i < totalCount; i++) {
    let isMale = i % 2 === 0;
    if (maleCount >= INITIAL_MALE_COUNT) isMale = false;
    if (femaleCount >= INITIAL_FEMALE_COUNT) isMale = true;

    if (isMale) {
      let male = new Villager(generateRandomName("男"), "男", randInt(18, 29));
      initRandomParams(male);
      assignBodyMindTraits(male);
      applyTraitParameterBonuses(male);
      assignHobby(male);
      refreshJobTable(male);
      male.portraitFile = selectPortraitByCharacter(male);
      male.SportraitFile = male.portraitFile;
      villagers.push(male);
      maleCount++;
    } else {
      let female = new Villager(generateRandomName("女"), "女", randInt(18, 25));
      initRandomParams(female);
      assignBodyMindTraits(female);
      applyTraitParameterBonuses(female);
      assignHobby(female);
      refreshJobTable(female);
      female.portraitFile = selectPortraitByCharacter(female);
      female.SportraitFile = female.portraitFile;
      villagers.push(female);
      femaleCount++;
    }
  }
  // villagers.forEach(v => refreshJobTable(v));
  // console.log(villagers);
  return villagers;
}

/**
 * ランダム村人を生成
 * @param {Object} options - 生成オプション
 * @param {string} [options.sex] - 性別 ("男"/"女")
 * @param {number} [options.minAge] - 最小年齢
 * @param {number} [options.maxAge] - 最大年齢
 * @param {Object} [options.params] - 固定パラメータ設定
 * @param {Object} [options.ranges] - パラメータ範囲設定 { param: [min, max] }
 */
export function createRandomVillager({ sex, minAge, maxAge, params = {}, ranges = {} }) {
  let age = randInt(minAge, maxAge);

  let nm = generateRandomName(sex);
  let vill = new Villager(nm, sex, age);
  
  if (params || ranges) {
    // デフォルトのランダム値で初期化
    initRandomParams(vill);

    // 固定値のパラメータを上書き
    if (params) {
      Object.assign(vill, params);
    }

    // 範囲指定のパラメータを生成して上書き
    if (ranges) {
      Object.entries(ranges).forEach(([param, [min, max]]) => {
        if (Array.isArray([min, max]) && min <= max) {
          vill[param] = randNormalInRange(min, max);
        }
      });
    }
  } else {
    // 通常のランダム初期化
    initRandomParams(vill);
  }

  assignBodyMindTraits(vill);
  applyTraitParameterBonuses(vill);
  assignHobby(vill);
  refreshJobTable(vill);
  
  // 顔グラフィックの設定
  // 襲擊者でない場合のみ顔グラフィックを設定
  if (!params.job || !["山賊", "哥布林", "狼", "獨眼巨魔", "哈比"].includes(params.job)) {
    if (sex === "男") {
      // 男性の場合の処理
      let selectedGroup = null;
      // ... 既存の顔グラフィック選択ロジック ...
    } else {
      // 女性の場合の処理
      // ... 既存の顔グラフィック選択ロジック ...
    }
  }

  return vill;
}

/**
 * ランダム名前生成(男/女)を修正
 */
export function generateRandomName(sex) {
  const maleNames = [
    "阿爾夫", "加爾德", "雷昂", "艾爾內斯特", "約翰", "海因", "葛倫", "迪爾克", "羅貝爾托", "施特凡",
    "奧斯卡", "芬恩", "路卡斯", "維克托", "貝爾特朗", "萊諾爾", "加百列", "塞爾吉奧", "米哈伊爾", "里茲",
    "克萊德", "阿道夫", "達里奧", "弗里德", "漢茲", "菲利克斯", "馬克西姆", "歐文", "巴恩", "泰勒",
    "威廉", "英格拉姆", "賈斯帕", "雷薩爾德", "加斯頓", "赫爾曼", "特里斯坦", "法比安", "赫利俄斯", "阿爾多爾",
    "洛恩", "卡羅爾", "馬可", "阿基爾", "波里斯", "以利亞斯", "參孫", "布萊德", "西蒙", "艾瑞克",
    "基爾伯特", "埃德蒙", "洛塔爾", "巴爾薩澤", "西奧多", "萊因哈特", "沃爾夫岡", "亞瑟", "蘭斯洛特", "高文",
    "帕西瓦爾", "貝迪維爾", "凱", "特里斯特拉姆",
    "阿斯特拉", "法伊亞爾", "索拉里斯", "魯米納斯", "塞萊斯特", "德拉戈", "艾俄斯", "獵戶", "克洛諾斯",
    "艾奧洛斯", "特拉斯", "布拉吉",
    // 日式名字
    "拓真", "翔太", "健一", "悠人", "直樹", "涼介", "誠", "晴広", "隆之介", 
    "大輝", "陽翔", "蓮", "悠斗", "龍馬", "武藏",
    // 中式名字
    "志遠", "子謙", "承翰", "俊熙", "青龍", "白虎", "朱雀", "玄武", "龍傲天",
    // 現代歐美名字
    "傑森", "亞當", "凱文", "丹尼爾", "賽斯", "萊恩", "亞歷山大", "卡特", "班傑明",
    "尼克", "朱利安", "萊昂納多", "賽巴斯汀", "伊森"
  ];
  
  const femaleNames = [
    "露娜", "艾瑪", "艾莉", "莉莎", "芙蘿蕾", "凪紗", "米蕾", "菲麗西亞", "尤莉亞", "艾莉西亞",
    "瑪爾蕾娜", "阿黛爾", "克拉麗絲", "奧莉加", "西爾薇", "羅莎", "弗蘭卡", "羅賽塔", "葛蕾絲", "莎拉",
    "蒂娜", "瑪麗", "內莉亞", "迪安娜", "蕾緹西亞", "克蘿艾", "伊琳娜", "米莉亞", "鈴鈴", "法娜",
    "艾絲緹拉", "塞爾菲", "貝亞特麗絲", "菲奧娜", "芙蘿拉", "安娜", "奧黛特", "阿梅莉亞", "由奈", "露伊內",
    "雪莉露", "卡特蕾雅", "艾爾迪亞", "拉米亞", "米斯緹", "莎莉娜", "貝爾特", "克勞蒂亞", "卡蓮", "尤莉艾",
    "阿黛爾海特", "伊索爾德", "齊格琳德",
    "摩根娜", "維維安", "艾蕾因", "伊格雷恩", "莉諾雅", "艾德麗特",
    "海倫娜", "塞西莉亞",
    "露米艾爾", "塞萊斯緹雅", "阿斯托莉亞", "艾特莉亞", "奧羅拉", "諾瓦", "艾莉絲", "莉莉絲", "雅典娜",
    "阿爾特彌西亞", "芙蕾雅", "伊敦", "絲卡蒂", "艾爾", "楠楠", "希格莉德", "赫爾", "芙莉嘉", "塞勒涅", "艾歐溫",
    // 日式名字
    "櫻", "花音", "美咲", "楓", "玲奈", "若葉", "琴音",
    "莉奈", "紗雪", "葵", "綾音", "桃香",
    "結衣", "奈緒", "美空", "雫",
    // 中式名字
    "欣怡", "婉婷", "詩涵", "雅婷", "沁瑤", "靜宜", "思妍",
    // 現代歐美名字
    "艾莉婕", "貝拉", "克洛伊", "娜塔莉", "伊莎貝拉", "艾米莉", "薩曼莎", "凱特琳", "瑪德琳", "奧莉維亞",
    "夏洛特", "蘿拉", "蘇菲亞", "潔西卡", "艾薇"
  ];
  

  // 性別に応じた名前リストを選択
  const nameList = sex === "男" ? maleNames : femaleNames;
  
  // 使用可能な名前をフィルタリング
  const availableNames = nameList.filter(name => !usedNames.has(name));
  
  // 使用可能な名前がない場合、全ての名前を再利用可能にする
  if (availableNames.length === 0) {
    usedNames.clear();
    return randChoice(nameList);
  }
  
  // ランダムに名前を選択して使用済みとしてマーク
  const chosenName = randChoice(availableNames);
  usedNames.add(chosenName);
  return chosenName;
}

/**
 * パラメータ初期化
 */
export function initRandomParams(v) {
  // 性別別にある程度初期値の振れ幅を設定
  if (v.bodySex === "男") {
    v.vit = randNormalInRange(8, 30);
    let mx = Math.min(30, v.vit * 1.5);
    if (mx < 12) mx = 12;
    v.str = randNormalInRange(12, Math.floor(mx));
    v.dex = randNormalInRange(5, 25);
    v.mag = randNormalInRange(5, 25);
    v.chr = randNormalInRange(6, 25);
    v.int = randNormalInRange(5, 25);
    v.ind = randNormalInRange(5, 25);
    let me = Math.min(25, Math.floor(v.ind * 1.5));
    if (me < 5) me = 5;
    v.eth = randNormalInRange(5, me);
    v.cou = randNormalInRange(8, 30);
    v.sexdr = randNormalInRange(8, 35);
  } else {
    v.vit = randNormalInRange(5, 25);
    let mx = Math.min(25, v.vit * 1.5);
    if (mx < 5) mx = 5;
    v.str = randNormalInRange(5, Math.floor(mx));
    v.dex = randNormalInRange(5, 25);
    v.mag = randNormalInRange(14, 30);
    v.chr = randNormalInRange(14, 30);
    v.int = randNormalInRange(5, 25);
    v.ind = randNormalInRange(5, 25);
    let me = Math.min(30, Math.floor(v.ind * 1.8));
    if (me < 8) me = 8;
    v.eth = randNormalInRange(8, me);
    v.cou = randNormalInRange(3, 25);
    v.sexdr = randNormalInRange(3, 25);
  }

}

// 精神特性と口調タイプのマッピング
const SPEECH_TYPE_MAPPING = {
  "孤傲": { male: "クールＭ", female: "クールＦ" },
  "喜愛閱讀 ": { male: "丁寧Ｍ", female: "丁寧Ｆ" },
  "小市民": { male: "普通Ｍ", female: "普通Ｆ" },
  "善人": { male: "丁寧Ｍ", female: "丁寧Ｆ" },
  "強気": { male: "強気Ｍ", female: "強気Ｆ" },
  "莽撞 ": { male: "乱暴", female: "蓮っ葉" },
  "理性派": { male: "丁寧Ｍ", female: "中性" },
  "努力工作": { male: "普通Ｍ", female: "普通Ｆ" },
  "普通": { male: "普通Ｍ", female: "普通Ｆ" },
  "庶民": { male: "普通Ｍ", female: "普通Ｆ" },
  "内向": { male: "陰気", female: "内気" },
  "書蟲": { male: "陰気", female: "内気" },
  "不擅學習": { male: "普通Ｍ", female: "普通Ｆ" },
  "天才": { male: "クールＭ", female: "中性" },
  "天生學者": { male: "丁寧Ｍ", female: "丁寧Ｆ" },
  "擅長忍耐": { male: "普通Ｍ", female: "普通Ｆ" },
  "老實人": { male: "普通Ｍ", female: "普通Ｆ" },
  "天然": { male: "お調子者", female: "おっとり" },
  "長舌": { male: "お調子者", female: "ギャル風" },
  "易怒": { male: "乱暴", female: "蓮っ葉" },
  "殘忍": { male: "乱暴", female: "蓮っ葉" },
  "殘酷": { male: "クールＭ", female: "クールＦ" },
  "糊塗": { male: "普通Ｍ", female: "普通Ｆ" },
  "戰鬥狂": { male: "乱暴", female: "強気Ｆ" },
  "陰沉": { male: "陰気", female: "内気" },
  "無力": { male: "陰気", female: "内気" },
  "認真": { male: "丁寧Ｍ", female: "丁寧Ｆ" },
  "懶散": { male: "陰気", female: "内気" },
  "無賴": { male: "乱暴", female: "蓮っ葉" },
  "惡棍": { male: "乱暴", female: "蓮っ葉" },
  "黑道": { male: "クールＭ", female: "クールＦ" },
  "守財奴": { male: "クールＭ", female: "クールＦ" },
  "優等生": { male: "丁寧Ｍ", female: "丁寧Ｆ" },
  "謀略家": { male: "クールＭ", female: "クールＦ" },
  "神經質": { male: "陰気", female: "内気" },
  "喜愛女性": { male: "お調子者", female: "快活" },
  "輕浮": { male: "お調子者", female: "ギャル風" },
  "熱情": { male: "強気Ｍ", female: "強気Ｆ" },
  "厭惡男性": { male: "陰気", female: "丁寧Ｆ" },
  "白日夢": { male: "陰気", female: "ぶりっこ" },
  "好奇心旺盛 ": { male: "お調子者", female: "快活" },
  "喜愛冒險": { male: "強気Ｍ", female: "強気Ｆ" },
  "陰角": { male: "陰気", female: "内気" },
  "吝嗇": { male: "クールＭ", female: "クールＦ" },
  "大姐姐": { male: "強気Ｍ", female: "強気Ｆ" },
  "古風": { male: "丁寧Ｍ", female: "丁寧Ｆ" },
  "隨便": { male: "乱暴", female: "蓮っ葉" },
  "膽小": { male: "陰気", female: "内気" },
  "寡言": { male: "陰気", female: "内気" },
  "笨拙": { male: "陰気", female: "内気" },
  "粗魯": { male: "乱暴", female: "蓮っ葉" },
  "偏執": { male: "陰気", female: "内気" },
  "聰明": { male: "丁寧Ｍ", female: "丁寧Ｆ" },
  "精明": { male: "クールＭ", female: "ぶりっこ" },
  "職人精神": { male: "普通Ｍ", female: "普通Ｆ" },
  "狡猾": { male: "クールＭ", female: "クールＦ" },
  "耍小聰明": { male: "お調子者", female: "ぶりっこ" },
  "遲鈍": { male: "普通Ｍ", female: "普通Ｆ" },
  "愛哭鬼": { male: "陰気", female: "内気" },
  "時髦": { male: "お調子者", female: "ギャル風" },
  "粗暴": { male: "乱暴", female: "蓮っ葉" },
  "女強人": { male: "強気Ｍ", female: "強気Ｆ" },
  "潔癖": { male: "丁寧Ｍ", female: "丁寧Ｆ" },
  "喜歡乾淨": { male: "丁寧Ｍ", female: "丁寧Ｆ" },
  "暴力": { male: "乱暴", female: "蓮っ葉" },
  "好戰": { male: "乱暴", female: "強気Ｆ" },
  "問題兒童": { male: "お調子者", female: "快活" },
  "草食系": { male: "陰気", female: "内気" },
  "色鬼": { male: "お調子者", female: "ギャル風" },
  "遊人": { male: "お調子者", female: "ギャル風" },
  "沉默": { male: "陰気", female: "内気" },
  "勇敢": { male: "強気Ｍ", female: "強気Ｆ" },
  "果斷": { male: "強気Ｍ", female: "強気Ｆ" },
  "豪傑": { male: "乱暴", female: "強気Ｆ" },
  "箱入り": { male: "丁寧Ｍ", female: "お嬢様" },
  "迷戀": { male: "お調子者", female: "ぶりっこ" },
  "愚直": { male: "普通Ｍ", female: "普通Ｆ" },
  "夢想家": { male: "お調子者", female: "ぶりっこ" },
  "耿直": { male: "丁寧Ｍ", female: "丁寧Ｆ" },
  "沉穩": { male: "丁寧Ｍ", female: "丁寧Ｆ" },
  "喜愛工作": { male: "普通Ｍ", female: "普通Ｆ" },
  "工作狂": { male: "強気Ｍ", female: "強気Ｆ" },
  "頭腦派": { male: "クールＭ", female: "クールＦ" },
  "睿智": { male: "丁寧Ｍ", female: "中性" },
  "才氣煥發": { male: "丁寧Ｍ", female: "中性" },
  "瘋狂": { male: "クールＭ", female: "中性" },
  "享樂主義": { male: "お調子者", female: "ギャル風" },
  "悪女": { male: "乱暴", female: "お嬢様" },
  "肌肉笨蛋": { male: "乱暴", female: "強気Ｆ" },
  "熱血": { male: "強気Ｍ", female: "強気Ｆ" },
  "圓融": { male: "お調子者", female: "ギャル風" },
  "文武雙全": { male: "丁寧Ｍ", female: "丁寧Ｆ" },
  "愚鈍": { male: "陰気", female: "内気" },
  "強欲": { male: "クールＭ", female: "クールＦ" },
  "現實主義": { male: "丁寧Ｍ", female: "丁寧Ｆ" },
  "才女": { male: "丁寧Ｍ", female: "お嬢様" },
  "才色兼備": { male: "丁寧Ｍ", female: "お嬢様" },
  "肉食系": { male: "強気Ｍ", female: "ギャル風" }
};

/**
 * 精神特性から口調タイプを決定
 */
function determineSpeechType(character) {
  // デフォルトの口調
  const defaultSpeechType = character.bodySex === "男" ? "普通Ｍ" : "普通Ｆ";
  
  // 精神特性がない場合はデフォルトを返す
  if (!character.mindTraits || character.mindTraits.length === 0) {
    return defaultSpeechType;
  }

  // 最初の精神特性を使用して口調を決定
  const trait = character.mindTraits[0];
  const speechTypes = SPEECH_TYPE_MAPPING[trait];
  
  if (!speechTypes) {
    return defaultSpeechType;
  }

  return character.bodySex === "男" ? speechTypes.male : speechTypes.female;
}

/**
 * 肉体/精神特性を判定して付与
 */
export function assignBodyMindTraits(v) {
  // 例: "病弱","奢華" など
  const bodyTraitDefinitions = [
    { name: "虛弱", condition: (v) => v.vit <= 10 && v.chr <= 16 },
    { name: "華麗", condition: (v) => v.bodySex === "女" && v.dex >= 20 && v.chr >= 20 },
    { name: "精瘦", condition: (v) => v.vit <= 12 && v.vit >= 10 && v.chr <= 16 },
    { name: "纖細", condition: (v) => v.bodySex === "女" && v.vit <= 15 && v.vit >= 11 && v.chr >= 17 && v.chr <= 23},
    { name: "微胖", condition: (v) => v.vit >= 18 && v.chr <= 12 },
    { name: "肌肉發達", condition: (v) => v.str >= 20 && v.str <= 23 && v.chr <= 20},
    { name: "平凡", condition: (v) => ["vit","str","chr"].every(param => v[param] >= 15 && v[param] <= 18) },
    { name: "巨人", condition: (v) => v.vit >= 28 },
    { name: "巨漢", condition: (v) => v.bodySex === "男" && v.vit >= 24 && v.chr <= 17 },
    { name: "美形", condition: (v) => v.bodySex === "男" && v.chr >= 24 },
    { name: "肥胖", condition: (v) => v.bodySex === "男" && v.vit >= 26 && v.chr <= 10 },
    { name: "美男子", condition: (v) => v.bodySex === "男" && v.vit >= 21 && v.chr >= 20 },
    { name: "強壯", condition: (v) => v.bodySex === "男" && v.str >= 18 && v.chr >= 18 },
    { name: "高個", condition: (v) => v.bodySex === "男" && v.vit >= 18 && v.chr >= 18 },
    { name: "堅實", condition: (v) => v.bodySex === "男" && v.vit >= 19  && v.vit <= 23 && v.chr <= 19 && v.chr >= 11 },
    { name: "不胖不瘦", condition: (v) => v.bodySex === "男" && v.vit <= 18 && v.vit >= 15 && v.chr <= 19 && v.chr >= 11 },
    { name: "瘦身", condition: (v) => v.bodySex === "男" && v.vit <= 14 && v.chr <= 17 && v.chr >= 13 },
    { name: "乾癟", condition: (v) => v.bodySex === "男" && v.vit <= 14 && v.chr <= 12 },
    { name: "精細", condition: (v) => v.bodySex === "男" && v.vit <= 16 && v.chr >= 15 &&v.chr <= 19 },
    { name: "俊俏", condition: (v) => v.bodySex === "男" && v.vit <= 16 && v.chr >= 19 && v.vit >= 11 },
    { name: "中性", condition: (v) => v.bodySex === "男" && v.vit <= 15 &&v.chr >= 23 },
    { name: "眉目秀麗", condition: (v) => v.bodySex === "男" && v.int >= 20 &&v.chr >= 20 },
    { name: "強面", condition: (v) => v.bodySex === "男" && v.str >= 20 && v.cou >= 20 },
    { name: "嬌小", condition: (v) => v.vit >= 9 && v.vit <= 11  && v.chr <= 16},
    { name: "療癒系", condition: (v) => v.bodySex === "女" && v.chr >= 20 && v.eth >= 20 },
    { name: "骨感", condition: (v) => v.bodySex === "男" && v.vit <= 10 && v.chr <= 10 },
    { name: "巨大", condition: (v) => v.vit >= 20 && v.str >= 18 && v.vit <= 22  && v.chr <= 20},
    { name: "體態優美", condition: (v) => v.bodySex === "女" && v.vit >= 13 && v.chr >= 24 },
    { name: "豐滿", condition: (v) => v.bodySex === "女" && v.vit >= 16 && v.chr >= 22 },
    { name: "帥哥", condition: (v) => v.bodySex === "男" && v.chr >= 20 && v.sexdr >= 18 && v.vit <= 18 },
    { name: "地味", condition: (v) => v.vit <= 17 && v.chr <= 15 },
    { name: "魔性", condition: (v) => v.bodySex === "女" && v.chr >= 24 && v.sexdr >= 18 && v.int >= 16 },
    { name: "薄倖", condition: (v) => v.bodySex === "女" && v.vit <= 11 && v.chr >= 20 },
    { name: "健康", condition: (v) => v.bodySex === "女" && v.vit >= 16 && v.chr >= 16  && v.chr <= 22 },
    { name: "神秘的", condition: (v) => v.bodySex === "女" && v.mag >= 20 && v.chr >= 23 && v.sexdr <= 17 },
    { name: "絕世美女", condition: (v) => v.bodySex === "女" && v.chr >= 28 },
    { name: "謎團", condition: (v) => v.mag >= 20 && v.chr >= 21 && v.chr <= 27},
    { name: "冷酷", condition: (v) => v.sexdr <= 10 && v.chr >= 20},
    { name: "可疑", condition: (v) => v.bodySex === "男" && v.mag >= 22 && v.chr <= 15 },
    { name: "男模", condition: (v) => v.bodySex === "男" && v.mag >= 20 && v.chr >= 20 },
    { name: "怪力", condition: (v) => v.bodySex === "男" && v.str >= 27 },
    { name: "狡詐", condition: (v) => v.bodySex === "男" && v.dex >= 20 && v.eth <= 15 && v.chr <= 12 },
    { name: "悪人顔", condition: (v) => v.bodySex === "男" && v.eth <= 12 && v.chr <= 15 },
    { name: "健壯", condition: (v) => v.bodySex === "男" && v.str >= 24 && v.chr <= 18 },
    { name: "肌肉結實", condition: (v) => v.bodySex === "男" && v.str >= 24 && v.chr >= 19 },
    { name: "莊嚴", condition: (v) => v.bodySex === "男" && v.eth <= 12 && v.cou >= 20 && v.str >= 20 },
    { name: "精悍", condition: (v) => v.bodySex === "男" && v.str >= 20 && v.cou >= 18 && v.chr >= 18 },
    { name: "高冷", condition: (v) => v.bodySex === "女" && v.str >= 16 && v.cou >= 18 && v.chr >= 17 && v.chr <= 22},
    { name: "質樸", condition: (v) => v.eth >= 16 && v.chr <= 18 && v.chr >= 16 },
    { name: "清楚", condition: (v) => v.bodySex === "女" && v.chr >= 18 && v.eth >= 20 },
    { name: "柔軟", condition: (v) => v.bodySex === "女" && v.vit <= 17 && v.vit >= 14 && v.chr <= 20 && v.chr >= 16 },
    { name: "童顔", condition: (v) => v.chr >= 18 && v.sexdr <= 16 && v.vit <= 13 && v.chr <= 27 },
    { name: "奢華", condition: (v) => v.bodySex === "女" && v.vit <= 12 && v.chr >= 17 },
    { name: "胖女人", condition: (v) => v.bodySex === "女" && v.vit >= 18 && v.chr <= 15},
    { name: "不起眼", condition: (v) => v.bodySex === "女" && v.vit <= 17 && v.chr <= 16},
    { name: "不起眼", condition: (v) => v.bodySex === "男" && v.vit <= 19 && v.chr <= 15},
    { name: "小汚", condition: (v) => v.bodySex === "男" && v.int <=3 && v.chr <= 11 },
    { name: "無趣", condition: (v) => v.bodySex === "男" && v.int <= 14 && v.chr <= 13 },
  ];
  let bodyTraitCandidates = [];
  bodyTraitDefinitions.forEach(def => {
    if (def.condition(v)) {
      bodyTraitCandidates.push(def.name);
    }
  });
  if (bodyTraitCandidates.length>0) {
    let chosen = randChoice(bodyTraitCandidates);
    v.bodyTraits.push(chosen);
  }

  // 精神特性例: "孤傲","才女"など
  const mindTraitDefinitions = [
    { name: "孤傲", condition: (v) => v.chr <= 13 && v.eth >= 22 },
    { name: "喜愛閱讀 ", condition: (v) => v.int >= 20 && v.ind >= 18 },
    { name: "小市民", condition: (v) => v.cou <= 16 && v.ind >= 17 && v.eth >= 17  && v.eth <= 22 },
    { name: "善人", condition: (v) => v.eth >= 20 && v.eth <= 21},
    { name: "強気", condition: (v) => v.cou >= 20 && v.cou <= 21},
    { name: "莽撞 ", condition: (v) => v.cou >= 22 && v.int <= 16},
    { name: "理性派", condition: (v) => v.int >= 20 && v.int <= 21},
    { name: "努力工作", condition: (v) => v.ind >= 20 && v.ind <= 22},
    { name: "普通", condition: (v) => ["int","ind","eth","cou","sexdr"].every(param => v[param] <= 17) },
    { name: "庶民", condition: (v) => ["int","ind","eth","cou","sexdr"].every(param => v[param] <= 19) },
    { name: "内向", condition: (v) => ["int","ind","eth","cou","sexdr"].every(param => v[param] <= 17) },
    { name: "書蟲", condition: (v) => ["int","ind","eth","cou","sexdr"].every(param => v[param] <= 17) },
    { name: "不擅學習", condition: (v) => ["cou","eth","ind","sexdr"].every(param => v[param] <= 18) && v.int <= 10 },
    { name: "天才", condition: (v) => v.int >= 24 && v.ind <= 16 },
    { name: "天生學者", condition: (v) => v.int >= 22 && v.ind >= 18 && v.eth >= 18 },
    { name: "擅長忍耐", condition: (v) => v.vit >= 18 && v.ind >= 16 && v.eth >= 16 },
    { name: "老實人", condition: (v) => v.int <= 16 && v.eth >= 20 },
    { name: "天然", condition: (v) => v.chr >= 22 && v.int <= 16 && v.eth >= 16 },
    { name: "長舌", condition: (v) => v.chr >= 16 && v.ind <= 18 && v.sexdr >= 16 && v.dex >= 18 },
    { name: "易怒", condition: (v) => v.eth <= 12 && v.cou >= 18 },
    { name: "殘忍", condition: (v) => v.eth <= 4 && v.cou >= 18 },
    { name: "殘酷", condition: (v) => v.eth <= 4 && v.int >= 16 },
    { name: "糊塗", condition: (v) => v.int >= 20 && v.ind <= 14 && v.cou >= 20 },
    { name: "戰鬥狂", condition: (v) => v.str >= 20 && v.ind <= 12 && v.cou >= 22 },
    { name: "陰沉", condition: (v) => v.chr <= 14 && v.sexdr <= 14 && v.cou <= 15 },
    { name: "無力", condition: (v) => v.int <= 14 && v.ind <= 14 && v.eth <= 14 && v.cou <= 14 && v.sexdr <= 14 },
    { name: "認真", condition: (v) => v.ind >= 20 && v.eth >= 16 && v.sexdr <= 16 },
    { name: "懶散", condition: (v) => ["int","eth","cou","sexdr"].every(param => v[param] <= 18) && v.ind <= 11 },
    { name: "無賴", condition: (v) => v.bodySex === "男" && v.ind <= 12 && v.eth <= 12 },
    { name: "惡棍", condition: (v) => v.bodySex === "男" && v.eth <= 9 && v.cou >= 16 },
    { name: "黑道", condition: (v) => v.bodySex === "男" && v.eth <= 9 && v.ind >= 20 },
    { name: "守財奴", condition: (v) => v.eth <= 9 && v.ind >= 20 },
    { name: "優等生", condition: (v) => v.int >= 18 && v.ind >= 18 && v.eth >= 18 },
    { name: "謀略家", condition: (v) => v.int >= 20 && v.cou >= 20 },
    { name: "神經質", condition: (v) => v.vit <= 14 && v.chr <= 12 },
    { name: "喜愛女性", condition: (v) => v.bodySex === "男" && v.sexdr >= 25 },
    { name: "輕浮", condition: (v) => v.bodySex === "男" && v.sexdr >= 18 && v.chr >=18 },
    { name: "熱情", condition: (v) => v.sexdr >= 19 && v.cou >= 19},
    { name: "厭惡男性", condition: (v) => v.bodySex === "女" && v.sexdr <= 7 },
    { name: "白日夢", condition: (v) => v.bodySex === "女" && v.sexdr >= 18 && v.int <= 15 },
    { name: "好奇心旺盛 ", condition: (v) => v.int >= 18 && v.sexdr >= 20 && v.dex >= 18 },
    { name: "喜愛冒險", condition: (v) => v.int >= 18 && v.cou >= 20 },
    { name: "陰角", condition: (v) => v.chr <= 17 && v.cou <= 15 && v.str <= 16 },
    { name: "吝嗇", condition: (v) => v.int >= 22 && v.eth <= 14 },
    { name: "大姐姐", condition: (v) => v.bodySex === "女" && v.str >= 17 && v.eth >= 16 && v.cou >= 18 },
    { name: "古風", condition: (v) => v.bodySex === "女" && v.ind >= 18 && v.eth >= 18 && v.sexdr <= 14 },
    { name: "隨便", condition: (v) => v.vit >= 20 && v.dex <= 12 },
    { name: "膽小", condition: (v) => ["int","eth","ind","sexdr"].every(param => v[param] <= 19) && v.cou <= 10 },
    { name: "寡言", condition: (v) => v.dex <= 15 && v.chr <= 15 && v.sexdr <= 17 },
    { name: "笨拙", condition: (v) => ["int","eth","ind","sexdr","cou"].every(param => v[param] <= 19) && v.dex <= 10 },
    { name: "粗魯", condition: (v) => v.dex <= 12 && v.chr <= 16 && v.sexdr <= 12 },
    { name: "偏執", condition: (v) => v.dex <= 15 && v.chr <= 12 && v.int >= 18 },
    { name: "聰明", condition: (v) => v.dex >= 18 && v.int >= 20 && v.eth >= 18 },
    { name: "精明", condition: (v) => v.dex >= 20 && v.chr >= 16 && v.int >= 18 && v.eth <= 16 },
    { name: "職人精神", condition: (v) => v.dex >= 20 && v.ind >= 20 },
    { name: "狡猾", condition: (v) => v.int >= 20 && v.eth <= 9 },
    { name: "耍小聰明", condition: (v) => v.bodySex === "女" && v.dex >= 16 && v.chr >= 20 && v.int >= 16 && v.sexdr >= 17 },
    { name: "遲鈍", condition: (v) => v.vit >= 18 && v.mag <= 12 && v.chr <= 16 },
    { name: "愛哭鬼", condition: (v) => v.bodySex === "女" && v.vit <= 16 && v.cou <= 9 },
    { name: "時髦", condition: (v) => v.bodySex === "女" && v.chr >= 20 && v.sexdr >= 16 },
    { name: "粗暴", condition: (v) => v.str >= 26 && v.eth <= 10 },
    { name: "女強人", condition: (v) => v.bodySex === "女" && v.str >= 16 && v.cou >= 20 },
    { name: "潔癖", condition: (v) => v.eth >= 22 && v.sexdr <= 10 },
    { name: "喜歡乾淨", condition: (v) => v.eth >= 18 && v.sexdr <= 16 },
    { name: "暴力", condition: (v) => v.bodySex === "男" && v.str >= 20 && v.eth <= 12 && v.cou >= 20 },
    { name: "好戰", condition: (v) => v.str >= 20 && v.eth <= 16 && v.cou >= 20 },
    { name: "問題兒童", condition: (v) => v.bodySex === "男" && v.ind <= 12 && v.eth <= 12 },
    { name: "草食系", condition: (v) => v.bodySex === "男" && v.sexdr <= 12 },
    { name: "色鬼", condition: (v) => v.bodySex === "男" && v.int <= 18 && v.eth <= 16 && v.sexdr >= 20 },
    { name: "遊人", condition: (v) => v.bodySex === "男" && v.chr >= 18 && v.eth <= 12 && v.sexdr >= 20 },
    { name: "沉默", condition: (v) => v.eth >= 20 && v.sexdr >= 22 },
    { name: "勇敢", condition: (v) => v.str >= 20 && v.cou >= 22 },
    { name: "果斷", condition: (v) => v.cou >= 28 },
    { name: "豪傑", condition: (v) => v.str >= 24 && v.cou >= 24 },
    { name: "箱入り", condition: (v) => v.bodySex === "女" && v.str <= 16 && v.eth >= 20 && v.sexdr <= 12 },
    { name: "迷戀", condition: (v) => v.bodySex === "女" && v.int <= 18 && v.chr <= 23 && v.sexdr >= 19 },
    { name: "迷戀", condition: (v) => v.bodySex === "男" && v.sexdr <= 24 && v.sexdr >= 19 },
    { name: "愚直", condition: (v) => v.int <= 10 && v.ind >= 20 },
    { name: "夢想家", condition: (v) => v.int >= 18 && v.chr >= 16 && v.ind <= 12 },
    { name: "耿直", condition: (v) => v.ind >= 18 && v.eth >= 20 && v.sexdr <= 15 },
    { name: "沉穩", condition: (v) => v.ind >= 20 && v.eth >= 16 && v.sexdr <= 15 },
    { name: "喜愛工作", condition: (v) => v.ind >= 23},
    { name: "工作狂", condition: (v) => v.ind >= 24},
    { name: "頭腦派", condition: (v) => v.int >= 20 && v.dex >= 18 },
    { name: "睿智", condition: (v) => v.int >= 20 && v.chr >= 16 && v.dex >= 16 },
    { name: "才氣煥發", condition: (v) => v.int >= 24 && v.dex >= 18 },
    { name: "瘋狂", condition: (v) => v.int >= 24 && v.eth <= 9 },
    { name: "享樂主義", condition: (v) => v.ind <= 16 && v.eth <= 16 && v.sexdr >= 18 && v.int <= 19 },
    { name: "悪女", condition: (v) => v.bodySex === "女" && v.chr >= 20 && v.eth <= 9 },
    { name: "肌肉笨蛋", condition: (v) => v.int <= 12 && v.str >= 24 },
    { name: "熱血", condition: (v) => v.int <= 14 && v.cou >= 24 },
    { name: "圓融", condition: (v) => v.chr >= 18 && v.dex >= 18 && v.int >= 18 },
    { name: "文武雙全", condition: (v) => v.str >= 20 && v.int >= 20 },
    { name: "愚鈍", condition: (v) => v.eth <= 4 && v.int <= 11 },
    { name: "強欲", condition: (v) => v.eth <= 4 && v.ind >= 10 },
    { name: "現實主義", condition: (v) => v.mag <= 10 && v.ind >= 20 },
    { name: "才女", condition: (v) => v.bodySex === "女" && v.int >= 20 && v.ind >= 18 && v.eth >= 16 },
    { name: "才色兼備", condition: (v) => v.bodySex === "女" && v.int >= 20 && v.chr >= 22 },
    { name: "肉食系", condition: (v) => v.bodySex === "女" && v.chr <= 23 && v.sexdr >= 20},
  ];
  let mindTraitCandidates = [];
  mindTraitDefinitions.forEach(def => {
    if (def.condition(v)) {
      mindTraitCandidates.push(def.name);
    }
  });
  if (mindTraitCandidates.length>0) {
    let chosen = randChoice(mindTraitCandidates);
    v.mindTraits.push(chosen);
  }

  // 非排他特性
  const nonExclusiveTraits = [
    { name: "尼特", condition: (v)=>(v.ind<=10), chance:0.3, target:"mind" },
    { name: "工作中毒", condition: (v)=>(v.ind>=23), chance:0.2, target:"mind" },
    { name: "清澈的聲", condition: (v)=>(v.bodySex==="女" && v.chr>=25), chance:0.1, target:"body" },
    { name: "嘹亮的聲", condition: (v)=>(v.chr>=20 && v.cou>=20 && v.eth>=20), chance:0.3, target:"body" },
    { name: "不戰主義", condition: (v)=>(v.eth>=25), chance:0.5, target:"mind" },
    { name: "聖女的光輝", condition: (v)=>(v.bodySex==="女" && v.eth>=23 && v.sexdr<=12), chance:0.5, target:"body" },
    { name: "酒豪", condition: (v)=>(v.vit>=25 && v.chr>=16 && v.sexdr>=18), chance:0.1, target:"body" },
    { name: "細指", condition: (v)=>(v.dex>=22 && v.chr>=22), chance:0.1, target:"body" },
    { name: "白皙", condition: (v)=>(v.vit<=12 && v.chr>=25), chance:0.1, target:"body" },
    { name: "怕冷", condition: (v)=>(v.str<=12 && v.vit<=12), chance:0.1, target:"mind" },
    { name: "大食", condition: (v) =>(v.vit >= 22 && v.chr<=16), chance:0.1, target:"mind" },
    { name: "小食", condition: (v) =>(v.vit <= 12), chance:0.1, target:"mind" },
    { name: "大汗", condition: (v)=>(v.vit>=24 && v.chr<=12), chance:0.2, target:"mind" },
  ];
  nonExclusiveTraits.forEach(def => {
    if (def.condition(v)) {
      if (Math.random() < def.chance) {
        if (def.target==="body") {
          v.bodyTraits.push(def.name);
        } else {
          v.mindTraits.push(def.name);
        }
      }
    }
  });

  // 年齢由来
  if (v.bodyAge >= 60) {
    v.bodyTraits.push("老人");
  } else if (v.bodyAge >= 40) {
    v.bodyTraits.push("中年");
  }

  // 精神特性が決定した後に口調タイプを設定
  v.speechType = determineSpeechType(v);
}

/**
 * 特性によるパラメーター修正
 */
export function applyTraitParameterBonuses(v) {
  if (v.bodyTraits.includes("聖女的光輝")) {
    v.chr += 10; 
    v.mag += 10;
  }
  if (v.bodyTraits.includes("巨人")) {
    v.str += 10;
  }
  if (v.mindTraits.includes("工作中毒")) {
    v.ind += 3;
  }
  if (v.mindTraits.includes("尼特")) {
    v.ind -= 2;
  }
  if (v.mindTraits.includes("箱入り")) {
    v.chr += 5;
  }
  if (v.mindTraits.includes("内向")) {
    v.int += 4; 
    v.ind += 6; 
    v.eth += 4;
  }
  if (v.mindTraits.includes("書蟲")) {
    v.int += 8;
  }

  // 加齢
  if (v.bodyAge >= 60) {
    if (!v.bodyTraits.includes("老人")) v.bodyTraits.push("老人");
    v.str = Math.floor(v.str * 0.5);
    v.vit = Math.floor(v.vit * 0.5);
    v.chr = Math.floor(v.chr * 0.5);
  } else if (v.bodyAge >= 40) {
    if (!v.bodyTraits.includes("中年")) v.bodyTraits.push("中年");
    v.str = Math.floor(v.str * 0.75);
    v.vit = Math.floor(v.vit * 0.75);
    v.chr = Math.floor(v.chr * 0.75);
  }
}

/**
 * 趣味をランダム付与
 */
export function assignHobby(v) {
  const specialHobbyDefs = [
    { name: "賭博",  condition: (v)=>(v.cou>=20 && v.eth<=15), chance:0.15 },
    { name: "打架",        condition: (v)=>(v.str>=20 && v.cou>=20 && v.eth<=10), chance:0.15 },
    { name: "肌肉鍛鍊",      condition: (v)=>(v.str>=24), chance:0.15 },
    { name: "暴食",    condition: (v)=>(v.vit>=25), chance:0.1 },
    { name: "吊女人",      condition: (v)=>(v.bodySex==="男" && v.eth<=15 && v.sexdr>=25), chance:0.15 },
    { name: "吊男人",      condition: (v)=>(v.bodySex==="女" && v.eth<=12 && v.sexdr>=20), chance:0.1 },
    { name: "滝行",        condition: (v)=>(v.vit>=25), chance:0.15 },
    { name: "祈禱",        condition: (v)=>(v.eth>=25), chance:0.25 },
    { name: "手工",        condition: (v)=>(v.dex>=20), chance:0.1 },
    { name: "自由研究",    condition: (v)=>(v.int>=20), chance:0.15 },
    { name: "瞑想",        condition: (v)=>(v.mag>=25), chance:0.15 },
    { name: "自家発電",    condition: (v)=>(v.sexdr>=27), chance:0.1 },
    { name: "露出",        condition: (v)=>(v.bodySex==="男" && v.eth<=10 && v.sexdr>=25), chance:0.2 },
  ];
  let cands = [];
  specialHobbyDefs.forEach(def => {
    if (def.condition(v)) {
      if (Math.random()<def.chance) {
        cands.push(def.name);
      }
    }
  });
  if (cands.length>0) {
    v.hobby = randChoice(cands);
    return;
  }

  // 上記に該当しない場合、汎用リストからランダム
  if (v.bodySex==="男") {
    let maleH = [
      "大食","美食","肌肉鍛鍊","滝行","自由研究","垂釣","自家発電","讀書",
      "祈禱","吊女人","購物","散步","八卦","園藝","作詩","追星",
      "瞑想","飲酒","賭博","投資","天体観測","狩獵"
    ];
    v.hobby = randChoice(maleH);
  } else {
    let femaleH = [
      "自由研究","垂釣","讀書","祈禱","購物","散步","八卦","園藝",
      "茶會","時尚","作詩","追星","手工","瞑想","飲酒","美食",
      "占卜","投資","天体観測","跳舞"
    ];
    v.hobby = randChoice(femaleH);
  }
}

/**
 * 精神年齢に応じて jobTable を組み立てる
 */
export function refreshJobTable(v) {
  let sa = v.spiritAge;
  if (sa <= 9) {
    v.jobTable = ["無"];
    v.actionTable = ["無"];
    if (!v.jobTable.includes(v.job)) {
      v.job = "無";
    }
    if (!v.actionTable.includes(v.action)) {
      v.action = v.job;
    }
    return;
  } else if (sa <= 15) {
    v.jobTable = ["學習","鍛鍊","無"];
    v.actionTable = ["學習","鍛鍊","休養","休閒"];
    if (!v.jobTable.includes(v.job)) {
      v.job = "無";
    }
    if (!v.actionTable.includes(v.action)) {
      v.action = v.job;
    }
    return;
  } else {
    // 基本の仕事テーブル（共通）
    let commonJobs = [
      "無",
      "耕作", "狩獵", "捕魚",
      "伐木",
      "採集", "家政", "行商",
      "研究", "警備", "看護"
    ];

    // 建築物によって解放される仕事
    // const village = import("./main.js").then(m => m.theVillage);
    // const buildingFlags = village.buildingFlags || {};

    // 同步修正 buildingFlagsLoad Fix
    const buildingFlags = theVillage.buildingFlags || {};
 

    // 建築物によって解放される共通の仕事
    if (buildingFlags.hasClinic) {
      commonJobs.push("按摩");
    }
    if (buildingFlags.hasLibrary) {
      commonJobs.push("寫書");
    }
    if (buildingFlags.hasBrewery) {
      commonJobs.push("醸造");
    }
    if (buildingFlags.hasAlchemy) {
      commonJobs.push("錬金術");
    }
    if (buildingFlags.hasWeaving) {
      commonJobs.push("紡織");
    }

    // 性別に応じた仕事テーブル
    if (v.bodySex === "男") {
      v.jobTable = [
        ...commonJobs,
        "詩人", "神官"
      ];
    } else {
      v.jobTable = [
        ...commonJobs,
        "舞者", "修女"
      ];

      // 女性限定の建築物依存の仕事
      if (buildingFlags.hasTavern) {
        v.jobTable.push("兔女郎");
      }
      if (buildingFlags.hasChurch) {
        v.jobTable.push("巫女");
      }
    }

    // 性別に応じた行動テーブル
    if (v.bodySex === "男") {
      v.actionTable = [
        "休養", "休閒",
        "耕作", "狩獵", "捕魚",
        "伐木",
        "採集", "家政", "行商",
        "研究", "警備", "看護",
        "詩人", "神官"
      ];

      // 建築物によって解放される共通の仕事を行動テーブルにも追加
      if (buildingFlags.hasClinic) {
        v.actionTable.push("按摩");
      }
      if (buildingFlags.hasLibrary) {
        v.actionTable.push("寫書");
      }
      if (buildingFlags.hasBrewery) {
        v.actionTable.push("醸造");
      }
      if (buildingFlags.hasAlchemy) {
        v.actionTable.push("錬金術");
      }
      if (buildingFlags.hasWeaving) {
        v.actionTable.push("紡織");
      }
    } else {
      v.actionTable = [
        "休養", "休閒",
        "耕作", "狩獵", "捕魚",
        "伐木",
        "採集", "家政", "行商",
        "研究", "警備", "看護",
        "舞者", "修女"
      ];

      // 建築物によって解放される共通の仕事を行動テーブルにも追加
      if (buildingFlags.hasClinic) {
        v.actionTable.push("按摩");
      }
      if (buildingFlags.hasLibrary) {
        v.actionTable.push("寫書");
      }
      if (buildingFlags.hasBrewery) {
        v.actionTable.push("醸造");
      }
      if (buildingFlags.hasAlchemy) {
        v.actionTable.push("錬金術");
      }
      if (buildingFlags.hasWeaving) {
        v.actionTable.push("紡織");
      }

      // 女性限定の建築物依存の仕事を行動テーブルにも追加
      if (buildingFlags.hasTavern) {
        v.actionTable.push("兔女郎");
      }
      if (buildingFlags.hasChurch) {
        v.actionTable.push("巫女");
      }

    }

    if (!v.jobTable.includes(v.job)) {
      v.job = "無";
    }
    if (!v.actionTable.includes(v.action)) {
      v.action = v.job;
    }
  }

  // 襲擊関連の行動追加（状態異常がない場合のみ）
  if (theVillage.villageTraits.includes("襲擊中")) {
    v.actionTable.unshift("迎擊", "製作陷阱");
  }

  // console.log(buildingFlags);
  // console.log(v.jobTable);

}


// async await 替換
// export async function refreshJobTable(v) {
//   let sa = v.spiritAge;
//   if (sa <= 9) {
//     v.jobTable = ["無"];
//     v.actionTable = ["無"];
//     if (!v.jobTable.includes(v.job)) v.job = "無";
//     if (!v.actionTable.includes(v.action)) v.action = v.job;
//     return;
//   } else if (sa <= 15) {
//     v.jobTable = ["無", "學習", "鍛鍊"];
//     v.actionTable = ["學習", "鍛鍊", "休養", "休閒"];
//     if (!v.jobTable.includes(v.job)) v.job = "無";
//     if (!v.actionTable.includes(v.action)) v.action = v.job;
//     return;
//   }

//   // ✅ 使用 `await` 確保 `theVillage` 被正確解析
//   const { theVillage } = await import("./main.js");
//   const buildingFlags = theVillage.buildingFlags || {}; // ✅ 確保 `buildingFlags` 不是 undefined

//   // 基本的工作清單
//   let commonJobs = [
//     "無",
//     "耕作", "狩獵", "捕魚",
//     "伐木",
//     "採集", "家政", "行商", 
//     "研究", "警備", "看護"
//   ];

//   // 建築物解鎖工作
//   if (buildingFlags.hasClinic) commonJobs.push("按摩");
//   if (buildingFlags.hasLibrary) commonJobs.push("寫書");
//   if (buildingFlags.hasBrewery) commonJobs.push("醸造");
//   if (buildingFlags.hasAlchemy) commonJobs.push("錬金術");
//   if (buildingFlags.hasWeaving) commonJobs.push("紡織");

//   // **處理性別**
//   if (v.bodySex === "男") {
//     v.jobTable = [...commonJobs, "詩人", "神官"];
//     v.actionTable = [
//       "休養", "休閒",
//       "耕作", "狩獵", "捕魚",
//       "伐木",
//       "採集", "家政", "行商", 
//       "研究", "警備", "看護",
//       "詩人", "神官"
//     ];
//   } else {
//     v.jobTable = [...commonJobs, "舞者", "修女"];
//     v.actionTable =    v.actionTable = [
//       "休養", "休閒",
//       "耕作", "狩獵", "捕魚",
//       "伐木",
//       "採集", "家政", "行商", 
//       "研究", "警備", "看護",
//       , "舞者", "修女"
//     ];

//     // 女性限定職業
//     if (buildingFlags.hasTavern) v.jobTable.push("兔女郎");
//     if (buildingFlags.hasChurch) v.jobTable.push("巫女");

//     if (buildingFlags.hasTavern) v.actionTable.push("兔女郎");
//     if (buildingFlags.hasChurch) v.actionTable.push("巫女");
//   }

//   // **檢查當前職業是否合法**
//   if (!v.jobTable.includes(v.job)) v.job = "無";
//   if (!v.actionTable.includes(v.action)) v.action = v.job;

//   // **處理襲擊事件**
//   if (theVillage.villageTraits.includes("襲擊中")) {
//     v.actionTable.unshift("迎擊", "製作陷阱");
//   }
// }


/**
 * 訪問者タイプの定義
 */
const VISITOR_TYPES = [
  {
    type: "流民",
    weight: 35,
    ageRange: { min: 16, max: 30 },  // 幅広い年齢層
    params: {
      job: "流民",
      action: "訪問"
    },
    status: "normal",
  },
  {
    type: "冒險者",
    weight: 10,
    ageRange: { min: 18, max: 35 },
    params: {
      job: "冒險者",
      action: "訪問"
    },
    ranges: {
      str: [18, 25],  // 高い筋力
      vit: [18, 25],  // 高い体力
      cou: [20, 25]   // 高い勇気
    }
  },
  {
    type: "巡礼者",
    weight: 10,
    ageRange: { min: 16, max: 30 },
    params: {
      job: "巡礼者",
      action: "訪問"
    },
    ranges: {
      mag: [18, 25],  // 高い魔力
      eth: [20, 25],  // 高い倫理
      sexdr: [5, 15]  // 低い好色
    }
  },
  {
    type: "學者",
    weight: 10,
    ageRange: { min: 20, max: 65 },
    params: {
      job: "學者",
      action: "訪問"
    },
    ranges: {
      int: [20, 27],  // 高い知力
      ind: [20, 24],  // やや高い勤勉
      str: [5, 15],   // 低い筋力
     }
  },
  {
    type: "觀光客",
    weight: 15,
    ageRange: { min: 16, max: 25 },  // 幅広い年齢層
    params: {
      job: "觀光客",
      action: "訪問"
    },
  },
  {
    type: "旅者",
    weight: 10,
    ageRange: { min: 18, max: 30 },  // 青年～中年
    params: {
      job: "旅者",
      action: "訪問"
    },
  },
  {
    type: "旅行商人",
    weight: 10,
    ageRange: { min: 20, max: 35 },
    params: {
      job: "行商人",
      action: "訪問"
    },
    ranges: {
      chr: [16, 22],  // 高い魅力
      dex: [12, 20],  // やや高い器用
      int: [12, 20],  // やや高い知力
      ind: [18, 25]   // やや高い勤勉
    }
  }
];

/**
 * 重み付き抽選で訪問者タイプを選択
 */
function selectVisitorType() {
  const totalWeight = VISITOR_TYPES.reduce((sum, type) => sum + type.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const visitorType of VISITOR_TYPES) {
    random -= visitorType.weight;
    if (random <= 0) {
      return visitorType;
    }
  }
  return VISITOR_TYPES[0]; // フォールバック
}

/**
 * 訪問者を生成する関数
 */
export function createRandomVisitor() {
  const visitorType = selectVisitorType();
  
  // 性別を明示的に設定（visitorTypeに指定がなければランダム）
  const bodySex = visitorType.forcedSex || (Math.random() < 0.5 ? "男" : "女");
  
  const visitor = createRandomVillager({
    sex: bodySex,  // 肉体性別を明示的に設定
    minAge: visitorType.ageRange.min,
    maxAge: visitorType.ageRange.max,
    params: {
      ...visitorType.params
    },
    ranges: visitorType.ranges
  });

  // 訪問者の名前を修正
  visitor.name = `${visitorType.type}–${visitor.name}`;
  
  // 行動テーブルを訪問のみに制限
  visitor.actionTable = ["訪問"];
  
  // 精神特性に訪問者を追加（1回のみ）
  visitor.mindTraits.push("訪問者");

  // 顔グラフィックを設定
  visitor.portraitFile = selectPortraitByCharacter(visitor);
  visitor.SportraitFile = visitor.portraitFile;
  
  // 精神性別が設定されていない場合は肉体性別と同じに設定
  if (!visitor.spiritSex) {
    visitor.spiritSex = visitor.bodySex;
  }

  return visitor;
}
