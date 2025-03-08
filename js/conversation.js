import { theVillage } from "./main.js";
import { updateUI } from "./ui.js";
import { randInt, randChoice, getPortraitPath } from "./util.js";
import { refreshJobTable } from "./createVillagers.js";  // refreshJobTableをインポート

// 口調タイプごとのテンプレート
const SPEECH_PATTERNS = {
  // 男性用
  "普通Ｍ": {
    greet: [
      "嗨，你好。",
      "你好，今天天氣真好。",
      "嗨，狀況如何？"
    ],
    talk: [
      "今天真是好天氣。",
      "天空真美。",
      "這種天氣讓人想在外面工作。"
    ],
    work: [
      "工作進展順利。",
      "還算順利吧。",
      "我正慢慢努力著。"
    ]
  },
  "丁寧Ｍ": {
    greet: [
      "你好，能見到你真是我的榮幸。",
      "您心情如何？",
      "今天陽光明媚，真是一個美好的一天。"
    ],
    talk: [
      "今天的天氣真是太棒了。",
      "真讓人感受到春天的氣息。",
      "這樣的天氣讓人心情澄淨。"
    ],
    work: [
      "工作進展順利。",
      "多虧了大家，工作順利進行。",
      "在大家的協助下，我們正穩步向前。"
    ]
  },
  "強気Ｍ": {
    greet: [
      "喲！精神如何？",
      "喔！今天也充滿幹勁！",
      "喲！我等你很久了！"
    ],
    talk: [
      "這不是最棒的天氣嗎！",
      "這種天氣讓人熱血沸騰！",
      "在外工作正合適！"
    ],
    work: [
      "工作就交給我吧！絕對搞定！",
      "進展太順利了，簡直無聊！",
      "交給我吧！我會完美完成！"
    ]
  },
  "乱暴": {
    greet: [
      "嗨！",
      "喲！",
      "喔，來了！"
    ],
    talk: [
      "天氣真不錯！",
      "這不是最棒的天氣嗎！",
      "這種天氣正適合出來胡鬧！"
    ],
    work: [
      "工作？小意思！",
      "我正在拼命搞定！",
      "就讓你們去做吧！"
    ]
  },
  "お調子者": {
    greet: [
      "哈囉哈囉，你好啊！",
      "耶ー，你還好嗎？",
      "哦ー！見到你真高興！"
    ],
    talk: [
      "啊，今天的天氣真是太棒了！",
      "這種天氣只想出去玩！",
      "外面閃閃發光呢！"
    ],
    work: [
      "工作進展順利ー！",
      "全都都搞定了ー！",
      "交給我吧！"
    ]
  },
  "陰気": {
    greet: [
      "...你好。",
      "...嗨。",
      "...有什麼事嗎？"
    ],
    talk: [
      "嗯...天氣確實不錯...",
      "天空...真美呢...",
      "這種天氣...只想待在家裡..."
    ],
    work: [
      "工作...算是進行著...",
      "也算是...努力著...",
      "...沒有什麼問題..."
    ]
  },
  "クールＭ": {
    greet: [
      "安好。",
      "嗨。",
      "能見到你真榮幸。"
    ],
    talk: [
      "天氣真好。",
      "氣候宜人。",
      "天空真是壯觀。"
    ],
    work: [
      "工作沒問題。",
      "進展順利。",
      "完全不用擔心。"
    ]
  },

  // 女性用
  "普通Ｆ": {
    greet: [
      "你好。",
      "啊，你好。",
      "很高興見到你。"
    ],
    talk: [
      "今天的天氣真好。",
      "這是令人舒心的好天氣。",
      "天空真美。"
    ],
    work: [
      "工作進展順利。",
      "正在努力中。",
      "總算是能撐下來。"
    ]
  },
  "丁寧Ｆ": {
    greet: [
      "你好，能見到你真高興。",
      "一直承蒙關照。",
      "感謝今天這次美好的相遇。"
    ],
    talk: [
      "天氣真是太棒了。",
      "真是宛如春天般的好天氣。",
      "這藍天讓人心靈得到洗滌。"
    ],
    work: [
      "工作進展順利。",
      "多虧大家，進展順利。",
      "我正盡全力努力。"
    ]
  },
  "お嬢様": {
    greet: [
      "您好，祝安好跌絲襪。",
      "哎呀，能見到您真是榮幸跌絲襪。",
      "這真是一場美好的相遇跌絲襪。"
    ],
    talk: [
      "嗯，今天的天氣真美好。",
      "這種天氣讓人想在花園裡舉辦茶會呢。",
      "天空宛如一幅畫卷。"
    ],
    work: [
      "工作進展順利。",
      "我正在盡力而為。",
      "多虧了大家的幫助。"
    ]
  },
  "快活": {
    greet: [
      "嗨嗨！你好！",
      "耶！終於見到了！",
      "你還好嗎？我可是精力充沛！"
    ],
    talk: [
      "今天的天氣真是太棒了！",
      "一出門就覺得舒服極了！",
      "這樣的天氣讓人想要冒險！"
    ],
    work: [
      "工作我可是全力以赴！",
      "一切順利！超級順利！",
      "工作也充滿樂趣！"
    ]
  },
  "内気": {
    greet: [
      "啊、那个……你好……",
      "初、初次見面……",
      "啊……能見到您……真開心……"
    ],
    talk: [
      "天氣……真不錯……",
      "天空……真美……",
      "好、好溫暖……"
    ],
    work: [
      "工作……我正在努力……",
      "總、總算是……撐下來了……",
      "別、別緊張……慢慢來……"
    ]
  },
  "強気Ｆ": {
    greet: [
      "你好！",
      "喲！你還好嗎？",
      "我一直在等你呢！"
    ],
    talk: [
      "這天氣真是太棒了！",
      "這種天氣讓我全身躁動！",
      "這天氣讓人想要在外工作！"
    ],
    work: [
      "工作就交給我吧！",
      "我會完美完成！",
      "就交給我吧！"
    ]
  },
  "蓮っ葉": {
    greet: [
      "嗨嗨！",
      "啊！你來了！",
      "我一直在等你！"
    ],
    talk: [
      "天氣真好啊！",
      "這天氣超級舒服！",
      "讓人只想出去玩！"
    ],
    work: [
      "工作？小菜一碟！",
      "我正在全力以赴呢！",
      "放心交給我吧！"
    ]
  },
  "おっとり": {
    greet: [
      "哎呀，你好。",
      "真是很高興見到你呢。",
      "一直受到您的照顧呢。"
    ],
    talk: [
      "天氣真平靜宜人。",
      "這天氣令人心情平靜。",
      "這陽光真是寧靜宜人。"
    ],
    work: [
      "工作進展順利。",
      "進展得很慢很穩。",
      "我們正穩步前進。"
    ]
  },
  "クールＦ": {
    greet: [
      "安好。",
      "嗨。",
      "能見到你真榮幸。"
    ],
    talk: [
      "天氣真好。",
      "氣候十分舒適。",
      "天空真美。"
    ],
    work: [
      "工作進展順利。",
      "一切進展順利。",
      "完全不用擔心。"
    ]
  },
  "ぶりっこ": {
    greet: [
      "啊！你好～♪",
      "哇～！終於見到你了♪",
      "嘻嘻，哈囉～♪"
    ],
    talk: [
      "今天的天氣最棒了♪",
      "閃閃發光，真是美好的天氣♪",
      "天空好像在微笑呢～♪"
    ],
    work: [
      "我正在努力工作哦～♪",
      "一切順利哦～♪",
      "嘻嘻，我正在努力呢～♪"
    ]
  },
  "中性": {
    greet: [
      "你好。",
      "嗨，你好。",
      "見到你真高興。"
    ],
    talk: [
      "天氣真好。",
      "好舒服的天氣呢。",
      "天空真美。"
    ],
    work: [
      "工作進展順利。",
      "一切都很順利。",
      "沒有任何問題。"
    ]
  },
  "ギャル風": {
    greet: [
      "Ｈｉ～！",
      "耶～！你還好嗎？",
      "嗚～！"
    ],
    talk: [
      "天氣真的超棒的！",
      "這天氣超狂的！",
      "外面真是舒服到爆！"
    ],
    work: [
      "工作？超級順利吧！",
      "我正在全力以赴！",
      "完全搞定了！"
    ]
  }
};


// 訪問者タイプごとの勧誘成功率係数
const RECRUITMENT_COEFFICIENTS = {
  "流民": 0.8,    // 最も勧誘しやすい
  "冒險者": 0.4,  // やや勧誘しにくい
  "巡礼者": 0.2,  // 比較的勧誘しやすい
  "學者": 0.2,    // 勧誘しにくい
  "觀光客": 0.4,  // かなり勧誘しにくい
  "旅者": 0.4,    // 標準
  "行商人": 0.2   // 勧誘しにくい
};

/**
 * 会話モーダルを開く
 */
export function openConversationModal(character) {
  const overlay = document.getElementById("conversationOverlay");
  const modal = document.getElementById("conversationModal");
  const portrait = document.getElementById("conversationPortrait");
  const text = document.getElementById("conversationText");
  const actionButtons = document.getElementById("actionButtons");

  if (!overlay || !modal || !portrait || !text || !actionButtons) return;

  // 共通関数を使用して顔グラフィックのパスを取得
  const portraitPath = getPortraitPath(character);

  // 顔グラフィックを設定（エラーハンドリング付き）
  try {
    portrait.src = portraitPath;
    portrait.onerror = () => {
      console.error(`Portrait image not found: ${portraitPath}`);
      portrait.src = 'images/portraits/default.png';
    };
  } catch (error) {
    console.error('Error loading portrait:', error);
    portrait.src = 'images/portraits/default.png';
  }
  
  // キャラクターの状態を判定
  const isExhausted = character.hp <= 33 || character.mp <= 33;
  const isTired = (character.hp > 33 && character.hp <= 59) || (character.mp > 33 && character.mp <= 59);
  const isHealthy = character.hp > 59 && character.mp > 59;
  const isUnderRaid = theVillage.villageTraits.includes("襲擊中");
  const isVisitor = character.mindTraits && character.mindTraits.includes("訪問者");
  const hasFailedRecruitment = character.mindTraits && character.mindTraits.includes("招募失敗");

  // 口調タイプに応じた会話テキストを設定
  const speechPattern = SPEECH_PATTERNS[character.speechType] || 
                       SPEECH_PATTERNS[character.bodySex === "男" ? "普通Ｍ" : "普通Ｆ"];
  
  // 各カテゴリからランダムにセリフを選択
  const getRandomLine = (lines) => lines[Math.floor(Math.random() * lines.length)];

  // 状態に応じたセリフを生成
  let statusText = "";
  
  // 襲擊者の場合は専用のセリフを表示
  if (character.mindTraits && character.mindTraits.includes("襲擊者") && character.raiderDialogues) {
    const raiderLine = character.raiderDialogues[Math.floor(Math.random() * character.raiderDialogues.length)];
    statusText = `<p><strong></strong> ${raiderLine}</p>`;
  } else if (isUnderRaid) {
    statusText = `<p><strong></strong> ${getStatusLine(character, "raid")}</p>`;
  } else if (isExhausted) {
    statusText = `<p><strong></strong> ${getStatusLine(character, "exhausted")}</p>`;
  } else if (isTired) {
    statusText = `<p><strong></strong> ${getStatusLine(character, "tired")}</p>`;
  } else if (isHealthy) {
    statusText = `<p><strong></strong> ${getStatusLine(character, "healthy")}</p>`;
  }
  
  // 会話テキストを設定
  text.innerHTML = `
    ${statusText}
  `;

  // ボタンの表示制御
  actionButtons.innerHTML = "";
  
  if (isVisitor && !hasFailedRecruitment) {
    // 訪問者で、かつ勧誘失敗フラグがない場合は勧誘と誘惑ボタンを表示
    actionButtons.innerHTML = `
      <button id="recruitButton">勧誘する</button>
      <button id="seduceButton">誘惑する</button>
    `;
    actionButtons.style.display = "block";
    
    // 勧誘ボタンのイベントリスナーを設定
    document.getElementById("recruitButton").addEventListener("click", () => {
      openRecruitmentModal(character);
    });
    
    // 誘惑ボタンのイベントリスナーを設定
    document.getElementById("seduceButton").addEventListener("click", () => {
      openSeductionModal(character);
    });
  } else if (isUnderRaid && theVillage.villagers.includes(character)) {
    // 襲擊中の村人の場合は迎擊・罠作成ボタンを表示
    actionButtons.innerHTML = `
      <button id="assignDefender" class="${character.action === '迎擊' ? 'active-action' : ''}">迎擊任命</button>
      <button id="assignTrapMaker" class="${character.action === '製作陷阱' ? 'active-action' : ''}">製作陷阱任命</button>
    `;
    actionButtons.style.display = "block";
    
    document.getElementById("assignDefender").addEventListener("click", () => {
      changeCharacterAction(character, "迎擊");
    });
    
    document.getElementById("assignTrapMaker").addEventListener("click", () => {
      changeCharacterAction(character, "製作陷阱");
    });
  } else {
    actionButtons.style.display = "none";
  }

  overlay.style.display = "block";
  modal.style.display = "block";
}

/**
 * 会話モーダルを閉じる
 */
export function closeConversationModal() {
  const overlay = document.getElementById("conversationOverlay");
  const modal = document.getElementById("conversationModal");
  
  if (overlay) overlay.style.display = "none";
  if (modal) modal.style.display = "none";
}

/**
 * 状態に応じたセリフを返す
 */
function getStatusLine(character, status) {
  const speechType = character.speechType;
  const pattern = SPEECH_PATTERNS[speechType];
  
  if (!pattern.status) {
    pattern.status = {
      raid: {
        "普通Ｍ": [
          "情況危險……得小心一點。",
          "大家一起守護村莊。"
        ],
        "丁寧Ｍ": [
          "這是非常狀態，請做好萬全的準備。",
          "村子的安全是第一位的。"
        ],
        "強気Ｍ": [
          "想來就來吧！看我怎麼幹！",
          "老子就不怕那些襲擊者！"
        ],
        "乱暴": [
          "老子要把他們徹底打垮！",
          "來啊，來啊，放馬過來！"
        ],
        "お調子者": [
          "這情況真是糟糕啊～",
          "總能搞定的！",
          "讓你看看我的厲害！"
        ],
        "陰気": [
          "好、好可怕...",
          "該、該怎麼辦才好..."
        ],
        "クールＭ": [
          "我已掌握情況。",
          "應該冷靜應對。"
        ],
    
        "普通Ｆ": [
          "雖然害怕……但我會努力的。",
          "大家一起合作吧。"
        ],
        "丁寧Ｆ": [
          "事態已經非常嚴重了呢。",
          "各位請務必小心。"
        ],
        "お嬢様": [
          "沒想到會變成這樣的情況……",
          "為了村子，讓我來做些什麼。"
        ],
        "快活": [
          "來吧，讓我們一起來幹！",
          "大家一起加油！"
        ],
        "内気": [
          "好、好可怕……",
          "該、該怎麼辦……"
        ],
        "強気Ｆ": [
          "想來就來吧！",
          "我們一定會守護好村莊！"
        ],
        "蓮っ葉": [
          "來吧，讓我來幹！",
          "放馬過來吧！"
        ],
        "おっとり": [
          "真令人擔心啊……",
          "但願大家都能平安無事……"
        ],
        "クールＦ": [
          "讓我們冷靜應對吧。",
          "不必驚慌。"
        ],
        "ぶりっこ": [
          "好可怕啊～",
          "大家～救命啊～"
        ],
        "中性": [
          "情況相當嚴重。",
          "讓我們做些力所能及的事吧。"
        ],
        "ギャル風": [
          "這情況真是太猛了吧？",
          "總能解決的吧！"
        ]
      },
      exhausted: {
        "普通Ｍ": [
          "可能已經到極限了……",
          "真想休息一下……"
        ],
        "丁寧Ｍ": [
          "非常抱歉……能讓我休息一下嗎……",
          "我的狀況不太好……"
        ],
        "強気Ｍ": [
          "呃……還能撐著……",
          "這點疲憊……根本不算什麼……"
        ],
        "乱暴": [
          "該死……身體根本不聽使喚……",
          "還……還能動……"
        ],
        "お調子者": [
          "真的……我不行了……",
          "稍微……讓我休息一下……"
        ],
        "陰気": [
          "已經...無法動彈了...",
          "感覺快要死了..."
        ],
        "クールＭ": [
          "狀況……真是糟透了……",
          "可能需要稍作休息……"
        ],
    
        "普通Ｆ": [
          "已經……到極限了……",
          "請讓我休息一下……"
        ],
        "丁寧Ｆ": [
          "非常抱歉……我的狀況……",
          "能讓我稍作休息嗎……"
        ],
        "お嬢様": [
          "非常抱歉……人家已經無法動彈了……",
          "人家希望能小憩一會兒……"
        ],
        "快活": [
          "抱歉……我可能真的撐不住了……",
          "稍微讓我休息一下……",
          "實在是累壞了……真想休息。"
        ],
        "内気": [
          "對、對不起……我……",
          "已經……無法動彈了……"
        ],
        "強気Ｆ": [
          "咕……還可以……",
          "才這點程度……怎麼能倒下……"
        ],
        "蓮っ葉": [
          "要……不行了……",
          "讓我休息一下……"
        ],
        "おっとり": [
          "非常抱歉……稍微……",
          "我的身體動不了了……"
        ],
        "クールＦ": [
          "休息是……必要的……",
          "身體的狀況不太理想……"
        ],
        "ぶりっこ": [
          "真的……不行了……",
          "想要休息……"
        ],
        "中性": [
          "已經……到極限了……",
          "能讓我休息一下嗎……"
        ],
        "ギャル風": [
          "真的……撐不住……",
          "稍稍休息一下……"
        ]
      },
      tired: {
        "普通Ｍ": [
          "有點累了吧。",
          "想稍微休息一下。"
        ],
        "丁寧Ｍ": [
          "有點疲倦了。",
          "能讓我休息一下嗎？"
        ],
        "強気Ｍ": [
          "還能撐得住！",
          "這點疲勞根本不算什麼！"
        ],
        "乱暴": [
          "哼，只是有點累而已。",
          "我還有餘力！"
        ],
        "お調子者": [
          "有點累了呢～",
          "真想休息一下～"
        ],
        "陰気": [
          "有點……開始累了……",
          "有點……想休息……"
        ],
        "クールＭ": [
          "確實有點疲倦了。",
          "可能需要休息一下。"
        ],
    
        "普通Ｆ": [
          "有點累了。",
          "我想休息一下。"
        ],
        "丁寧Ｆ": [
          "有點疲倦了。",
          "能讓我休息一下嗎？"
        ],
        "お嬢様": [
          "稍微有點累了跌絲襪。",
          "人家想用一杯溫暖的茶來消除疲勞跌絲襪。"
        ],
        "快活": [
          "有點累了！",
          "或許有點累了，但我還能撐住！"
        ],
        "内気": [
          "有、有點累了……",
          "休息……一下……"
        ],
        "強気Ｆ": [
          "這點疲勞算不了什麼！",
          "我還能繼續加油！"
        ],
        "蓮っ葉": [
          "啊——感覺好懶散…我真想結束回家了。",
          "能休息一下嗎？剩下的我待會再做。"
        ],
        "おっとり": [
          "稍微有點累了。",
          "能讓我休息一下嗎？"
        ],
        "クールＦ": [
          "感覺有點疲勞。",
          "我們應該考慮休息一下。"
        ],
        "ぶりっこ": [
          "有點累了～",
          "真想休息一下～♪",
          "唔……好像有點累了……"
        ],
        "中性": [
          "感覺有點累了。",
          "可能需要休息一下。"
        ],
        "ギャル風": [
          "超級累了！",
          "我真想休息一下！"
        ]
      },
      healthy: {
        "普通Ｍ": [
          "狀態超棒！",
          "充滿活力！",
          "今天真是好天氣。",
          "村子的情況如何？",
          "最近的收成進展順利。"
        ],
        "丁寧Ｍ": [
          "狀態極佳。",
          "心情極好。",
          "今天真是個美好的天氣。",
          "我很期待村子的發展。",
          "多虧各位，我度過了充實的一天。"
        ],
        "強気Ｍ": [
          "狀態完美！",
          "任何工作交給我都沒問題！",
          "這天氣讓我全身躁動！",
          "這天氣是不是超棒的！",
          "村子的發展就交給我吧！",
          "今天也要拼命幹活！"
        ],
        "乱暴": [
          "超級有勁！",
          "我要拼命幹到底！",
          "這天氣簡直太棒了！",
          "村裡的人看起來也都很有活力！",
          "今天也要大鬧一番！",
          "這天氣，正好喝點酒！",
          "工作？那鬼東西去他媽的！",
          "誰來跟我一決勝負！"
        ],
        "お調子者": [
          "狀態超級好！",
          "什麼都能搞定！",
          "哪裡沒有可愛的妹子呢～？",
          "今天的天氣真是太棒了～！",
          "村裡的流言蜚語真有趣～",
          "我今天只想去玩，勝過工作～"
        ],
        "陰気": [
          "狀況……不錯。",
          "看來還能撐下去……",
          "天氣……不錯呢……",
          "村子……和平真好……",
          "安靜的日子……最棒了……"
        ],
        "クールＭ": [
          "狀態最佳。",
          "運作無礙。",
          "天氣也相當不錯。",
          "村子的情況穩定。",
          "讓我們高效率地工作吧。"
        ],
        "普通Ｆ": [
          "充滿活力！",
          "狀態極佳！",
          "今天的天氣真好！",
          "村裡的人都看起來很有精神，真是太好了。",
          "這天氣讓人想在外面工作。"
        ],
        "丁寧Ｆ": [
          "狀態非常好。",
          "任何工作我都樂意承接。",
          "今天的天氣真是無可挑剔。",
          "村裡的各位還好嗎？",
          "感謝這樣平和的日子。"
        ],
        "お嬢様": [
          "絶好調跌絲襪！",
          "人家什麼都能自如應對跌絲襪。",
          "嗯，真是個美好的天氣跌絲襪。",
          "能與村裡的各位交談真是人家的榮幸跌絲襪。",
          "但願這樣平靜的日子能繼續下去跌絲襪。"
        ],
        "快活": [
          "超級有活力！",
          "感覺什麼都能做得到！",
          "今天的天氣太棒了！",
          "村裡的大家也都充滿活力！",
          "這天氣真讓人想冒險！"
        ],
        "内気": [
          "狀況……還不錯。",
          "我、我還能忍耐……",
          "嗯……工作進展順利，是的……",
          "天、天氣真好，讓我很開心……",
          "我想和大家永遠一起……努力下去……",
          "像這樣安靜的村子……我喜歡……"
        ],
        "強気Ｆ": [
          "完美無缺！",
          "任何工作就交給我！",
          "這天氣，簡直太棒了！",
          "村子的發展就交給我吧！",
          "今天我也要使出全力幹活！"
        ],
        "蓮っ葉": [
          "超級有活力！",
          "我會全力以赴搞定一切！",
          "這天氣真是太棒了！",
          "不想聽聽村裡的八卦嗎？",
          "我今天只想去玩～",
          "唉，有什麼好玩的事嗎……",
          "真的超無聊～",
          "你是不是也沒事幹？"
        ],
        "おっとり": [
          "狀態不錯呢。",
          "感覺能好好工作。",
          "這平靜的天氣真讓人心安。",
          "村裡的大家都還好嗎？",
          "但願這樣平和的日子能持續下去。"
        ],
        "クールＦ": [
          "狀態極佳。",
          "什麼工作我都能應對自如。",
          "天氣無可挑剔。",
          "我已掌握村子的情況。",
          "讓我們高效率地推進工作。"
        ],
        "ぶりっこ": [
          "充滿活力哦～♪",
          "感覺什麼都能做得到～♪",
          "天氣超棒～♪",
          "我超喜歡村裡的每個人～♪",
          "我要好好工作哦～♪"
        ],
        "中性": [
          "狀態很好。",
          "感覺能夠認真工作。",
          "天氣真好。",
          "村裡的情況和平，這最重要。",
          "這樣的天氣讓人感到充實。"
        ],
        "ギャル風": [
          "超級有活力！",
          "什麼都能搞定！",
          "這天氣真是太棒了！",
          "村裡的大家都超讚！",
          "今天也要玩得開心！"
        ]
      }
    };
    
  }

  // 訪問者の場合は専用のセリフを返す
  if (character.mindTraits && character.mindTraits.includes("訪問者")) {
    return getVisitorLine(character);
  }

  // 健康状態で勤勉度が低い場合の特別な会話
  if (status === "healthy" && character.ind <= 10) {
    const lazyLines = getLazyLines(character);
    if (lazyLines.length > 0) {
      // 通常の会話と勤勉度が低い場合の会話を組み合わせる
      const statusLines = pattern.status[status][speechType] || 
                         pattern.status[status][character.bodySex === "男" ? "普通Ｍ" : "普通Ｆ"];
      
      // 季節の会話も取得
      let seasonalLines = [];
      const seasonTraits = ["春", "夏", "秋", "冬"];
      let currentSeason = "";
      
      for (const trait of seasonTraits) {
        if (theVillage.villageTraits.includes(trait)) {
          currentSeason = trait;
          break;
        }
      }
      
      if (currentSeason) {
        seasonalLines = getSeasonalLines(character, currentSeason);
      }
      
      // 全ての会話を組み合わせる
      const allLines = [...statusLines, ...lazyLines];
      if (seasonalLines.length > 0) {
        allLines.push(...seasonalLines);
      }
      
      return allLines[Math.floor(Math.random() * allLines.length)];
    }
  }
  
  // 季節に応じた会話を取得
  if (status === "healthy") {
    // 村の特性から現在の季節を取得
    const seasonTraits = ["春", "夏", "秋", "冬"];
    let currentSeason = "";
    
    for (const trait of seasonTraits) {
      if (theVillage.villageTraits.includes(trait)) {
        currentSeason = trait;
        break;
      }
    }
    
    // 季節に応じた会話を追加
    if (currentSeason) {
      const seasonLines = getSeasonalLines(character, currentSeason);
      if (seasonLines.length > 0) {
        // 通常の会話と季節の会話を組み合わせる
        const statusLines = pattern.status[status][speechType] || 
                           pattern.status[status][character.bodySex === "男" ? "普通Ｍ" : "普通Ｆ"];
        
        // 季節の会話を追加
        return [...statusLines, ...seasonLines][Math.floor(Math.random() * (statusLines.length + seasonLines.length))];
      }
    }
  }

  const statusLines = pattern.status[status][speechType] || 
                     pattern.status[status][character.bodySex === "男" ? "普通Ｍ" : "普通Ｆ"];
  return statusLines[Math.floor(Math.random() * statusLines.length)];
}

/**
 * 訪問者タイプごとの専用セリフを返す
 */
function getVisitorLine(character) {
  // 訪問者の名前から訪問者タイプを抽出
  const visitorTypes = ["流民", "冒險者", "巡礼者", "學者", "觀光客", "旅者", "行商人"];
  let visitorType = "";
  
  for (const type of visitorTypes) {
    if (character.name.includes(type)) {
      visitorType = type;
      break;
    }
  }
  
  // 訪問者タイプごとのセリフ
  const VISITOR_LINES = {
    "流民": [
      "求求你們，請幫幫我……我已經失去了家園。",
      "能讓我住在這個村子裡嗎？",
      "只要有食物和能遮風避雨的地方，我願意做任何工作。",
      "長途跋涉讓我疲憊不堪……請允許我在此稍作歇息。",
      "其他村子都趕走了我們……這裡會願意收留我們嗎？"
    ],
    "冒險者": [
      "這附近有什麼異常嗎？",
      "我在冒險途中順路過來了，要不要交換一下情報？",
      "有沒有聽到危險魔物的傳聞？報酬夠高的話，我可以去討伐。",
      "我在旅途中需要補給，能不能分點物資給我？",
      "這個村子看起來很平和，能讓我休息一下嗎？"
    ],
    "巡礼者": [
      "願神的加護與你同在。",
      "我正踏上前往聖地的旅程，懇請賜予祝福。",
      "我來這裡獻上祈禱，祈求這個村莊永享和平。",
      "我正在尋找神聖的所在，這個村子裡有什麼值得參拜的地方嗎？",
      "我踏上旅程，只為尋求心靈的安寧。"
    ],
    "學者": [
      "我正在研究這個地區的歷史，您知道些什麼嗎？",
      "您有見過稀有的植物或動物嗎？",
      "能告訴我關於古老遺跡或傳說的事情嗎？",
      "我正在為研究收集資料，能請您協助嗎？",
      "我想詳細了解這個村莊的起源。"
    ],
    "觀光客": [
      "這個村莊有什麼特產？我很想體驗看看！",
      "真是個迷人的村莊！有什麼推薦的景點嗎？",
      "我想買些紀念品帶回家，這裡有商店嗎？",
      "這裡的景色真美！我想多待一會兒。",
      "我想嘗試當地的美食，有什麼推薦的料理嗎？"
    ],
    "旅者": [
      "我在旅途中順道來到這裡，這村子真不錯呢。",
      "交換一下路上的消息吧？",
      "能借宿一晚嗎？",
      "長途跋涉讓我十分疲憊，請讓我休息一下。",
      "我遊歷各地，但這村子卻有著獨特的氛圍呢。"
    ],
    "行商人": [
      "我這裡有不少好貨哦！要不要來瞧瞧？",
      "我有些罕見的商品，您有興趣嗎？",
      "這些商品在其他村子可是買不到的哦，現在還有特別優惠價。",
      "要不要做個買賣？我可以跟您交換您村裡的特產。",
      "不只生意，我還能告訴您其他村子的情報哦。"
    ]
  };
  
  // 訪問者タイプに合わせたセリフを返す
  if (visitorType && VISITOR_LINES[visitorType]) {
    return VISITOR_LINES[visitorType][Math.floor(Math.random() * VISITOR_LINES[visitorType].length)];
  }
  
  // タイプが不明な場合は汎用的なセリフを返す
  const genericLines = [
    "你好，這個村莊真不錯。",
    "我會在這裡待一會兒。",
    "我想更多了解這個村子。",
    "我在旅途中順道來到了這裡。",
    "這裡的村民真是很親切呢。"
  ];
  
  return genericLines[Math.floor(Math.random() * genericLines.length)];
}

/**
 * 勤勉度が低い場合の会話を返す
 */
function getLazyLines(character) {
  const speechType = character.speechType;
  
  // 勤勉度が低い場合の会話パターン
  const LAZY_LINES = {
    "普通Ｍ": ["工作什麼的真是不想做啊…", "今天真想放鬆一下。", "好想休息。"],
    "丁寧Ｍ": ["今天有點想休息一下呢。", "工作…稍微擱置一下吧。", "我覺得休息也很重要。"],
    "強気Ｍ": ["工作？今天就算了！", "比起工作，今天更想玩！", "好想休息啊！"],
    "乱暴": ["工作什麼的，去死吧！", "我才不想工作呢！", "今天什麼也不想做！"],
    "お調子者": ["比起工作，更想去玩耍啊～", "今天真適合偷懶啊～", "工作搞得我累壞了啊～"],
    "陰気": ["工作...不想...做...", "休息...好想...", "什麼都...不想做..."],
    "クールＭ": ["今天休息放在工作之前。", "今天只做最基本的工作。", "有時候我會選擇休息，而不是追求效率。"],
    
    "普通Ｆ": ["我才不想工作呢", "今天只想輕鬆一下。", "真想休息一下。"],
    "丁寧Ｆ": ["今天我想稍微休息一下。", "工作嘛…想稍微推後一點。", "休息也是非常重要的。"],
    "お嬢様": ["今天我就暫且不勞動了跌絲襪。", "休息時間也是必需的呢跌絲襪。", "今天只想靜靜地度過跌絲襪。"],
    "快活": ["我只想玩，不想工作！", "今天真～什麼都不想做～", "真想放假呀～"],
    "内気": ["工作...不想...做...", "休息...好想...", "什麼都...不想做..."],
    "強気Ｆ": ["工作？今天我就不幹！", "我今天更想玩！", "我就想休息啊！"],
    "蓮っ葉": ["工作這種事我只想偷懶～", "工作真是麻煩～", "今天真什麼都不想做～"],
    "おっとり": ["今天想稍微休息一下。", "工作嘛…想稍微推後一點。", "我覺得休息也是很重要的。"],
    "クールＦ": ["今天我想把休息放在工作之前。", "工作只做最基本的。", "有時候我會選擇休息，而不是追求效率。"],
    "ぶりっこ": ["我才不想工作呢～", "今天只想輕鬆一下～♪", "真想休息一下～"],
    "中性": ["不想工作…", "今天只想輕鬆一下。", "真想休息一下。"],
    "ギャル風": ["工作什麼的，真的是不行～", "今天想偷懶的說～", "工作真的超累的啦～"]
  };
  
  // 該当する口調タイプの会話を返す
  if (LAZY_LINES[speechType]) {
    return LAZY_LINES[speechType];
  }
  
  // 該当するものがない場合は性別に応じたデフォルトを返す
  const defaultType = character.bodySex === "男" ? "普通Ｍ" : "普通Ｆ";
  return LAZY_LINES[defaultType] || [];
}

/**
 * 季節に応じた会話を返す
 */
function getSeasonalLines(character, season) {
  const speechType = character.speechType;
  
  // 季節ごとの会話パターン
  const SEASONAL_LINES = {
    "春": {
      "普通Ｍ": ["春天的陽光真舒服啊。", "花兒開始綻放了，真美。", "能感受到春天的到來呢。"],
      "丁寧Ｍ": ["能感受到春天的氣息呢。", "花兒盛開，真是美麗的季節呢。", "春天的暖陽讓人心情舒暢。"],
      "強気Ｍ": ["春天到了！正是大展身手的好時節！", "要不要去賞花？看來能喝上好酒！", "春天的氣息讓我全身都熱血沸騰！"],
      "乱暴": ["春天時啥，能吃嗎？", "比起那些花，我只要酒！", "春天讓我肚子更餓了，快給我飯吃！"],
      "お調子者": ["春天啊！可是戀愛的季節喔！", "要不要一起去賞花？我這兒有好酒～", "春天就是充滿邂逅的季節喔～"],
      "陰気": ["春天...花粉...受不了...", "春天...讓人...好想睡...", "春天...總覺得...有點憂鬱..."],
      "クールＭ": ["春天來了。", "看來花兒開始綻放了。", "春天的暖陽並不討厭。"],
      
      "普通Ｆ": ["春天的陽光真令人舒服呢。", "花兒開始綻放了，真美。", "我能感受到春天的到來。"],
      "丁寧Ｆ": ["能感受到春天的氣息呢。", "花兒盛開，真是美麗的季節呢。", "春天的暖陽讓人心靈平和。"],
      "お嬢様": ["春天的到來真讓人心動跌絲襪。", "花兒盛開的景象真是令人讚嘆跌絲襪。", "春天的暖陽能使身心療癒跌絲襪。"],
      "快活": ["春天來了！一起去賞花吧！", "春天的暖陽真是太棒了！", "春天是充滿新邂逅的季節！"],
      "内気": ["春天...花...真漂亮呢...", "春天...陽光...特別舒適...", "春天...覺得...愉快..."],
      "強気Ｆ": ["春天到了！正是活動的時機！", "要不要去賞花？看來能喝到好酒呢！」", "春天的暖陽讓我全身躁動起來了！"],
      "蓮っ葉": ["春天啊～讓人也想戀愛呢～", "要不要去賞花？我會帶酒喔～", "春天是邂逅的季節呢～有沒有好帥哥呢？"],
      "おっとり": ["春天的到來使人心情平靜。", "這是花朵綻放的美好季節。", "春天的天氣讓人身心舒暢。"],
      "クールＦ": ["春天來了呢。", "看來花兒開始綻放了呢。", "春天的暖陽不錯呢。"],
      "ぶりっこ": ["春天來了～一起去賞花吧～♪", "春天的陽光真是太棒了～♪", "春天可是戀愛的季節呢～♪"],
      "中性": ["春天的陽光真令人舒服。", "花兒開始綻放了，真美。", "我能感受到春天的到來。"],
      "ギャル風": ["春天超讚der！快去賞花吧！", "春天可是戀愛的季節！有沒有好對象？", "春天的陽光超舒服～！"]
    },
    "夏": {
      "普通Ｍ": ["夏天雖然炎熱，但充滿活力。", "這是讓人想跳進河水裡游泳的季節。", "我很期待夏祭。"],
      "丁寧Ｍ": ["夏天的炎熱也有它的魅力呢。", "真想找個涼爽的地方好好度過這段時間。", "真期待夏祭的到來呢。"],
      "強気Ｍ": ["夏天到了！這可是火熱的季節！", "要不要去河裡游泳？感覺超爽的！", "讓我們在夏祭上好好狂歡一番！"],
      "乱暴": ["真他媽熱啊！", "滿身大汗，難道就不能洗個澡嗎！", "夏祭？只要有酒，我就去！"],
      "お調子者": ["夏天啊～要不要去海邊玩？", "好熱啊～來喝點冰涼的飲料吧～", "一起去夏祭約會如何？"],
      "陰気": ["夏天...好熱...受不了...", "汗...渾身...不舒服...", "夏祭...人太多...不喜歡..."],
      "クールＭ": ["夏日炎炎。", "最好先找個涼爽的地方。", "夏祭，不錯呢。"],
      
      "普通Ｆ": ["夏天雖然炎熱，但充滿活力呢。", "這是讓人想在河邊乘涼的季節。", "我很期待夏祭。"],
      "丁寧Ｆ": ["夏天的炎熱也別有風味呢。", "真想找個涼爽的地方度過。", "我很期待夏祭的到來呢。"],
      "お嬢様": ["夏天的炎熱也別有一番風情跌絲襪吶。", "真想找個涼爽的地方品茗跌絲襪。", "夏祭典既熱鬧又優雅，真是美好跌絲襪吶。"],
      "快活": ["夏天來了！一起去海邊吧！", "雖然炎熱，但夏天真有趣！", "我好期待夏祭呢！"],
      "内気": ["夏天...雖然熱...還是喜歡...", "河川...潺潺...平靜...", "夏祭...稍微...有點期待..."],
      "強気Ｆ": ["夏天來了！這真是一個火熱的季節！", "去河裡游泳如何？感覺超棒！", "讓我們在夏祭上一起狂歡！"],
      "蓮っ葉": ["夏天啊～要不要去海邊？", "真熱啊～來喝點冰涼的飲料吧！", "夏祭？要不要穿浴衣來場約會啊？"],
      "おっとり": ["夏天的炎熱也充滿情調呢。", "真想找個涼爽的地方度過這段時光。", "夏祭既熱鬧又美麗呢。"],
      "クールＦ": ["夏日炎炎。", "最好先找個涼爽的地方。", "夏祭，不錯呢。"],
      "ぶりっこ": ["夏天來了～想去海邊～♪", "雖然熱，但夏天真有趣～♪", "一起去參加夏祭吧～♪"],
      "中性": ["夏天的炎熱也不算太糟呢。", "真想找個涼爽的地方度過夏天。", "好期待夏祭啊。"],
      "ギャル風": ["夏天超讚！快去海邊吧！", "雖然熱，但夏天真的超有趣！", "在夏祭上一定要嗨起來！"]
    },
    "秋": {
      "普通Ｍ": ["秋天的收穫真豐富。", "紅葉的季節真美。", "漫長的秋夜正適合讀書。"],
      "丁寧Ｍ": ["對秋天的豐收心存感謝呢。", "紅葉的美麗令人陶醉。", "漫長的秋夜真適合閱讀。"],
      "強気Ｍ": ["秋天到了！這是收穫的季節！", "要不要去賞紅葉？", "漫長的秋夜真讓人想痛快地喝酒！"],
      "乱暴": ["秋天？真讓我餓壞了！", "紅葉？還不如酒來得實在！", "夜變長了，真悶！"],
      "お調子者": ["秋天啊～收穫祭真讓人期待！", "要不要一起去賞紅葉約會？", "漫長的秋夜你打算怎麼過？"],
      "陰気": ["秋天...有些...寂寞...", "紅葉...好美...有點哀愁...", "夜晚...好長...難以入眠..."],
      "クールＭ": ["秋天是豐收的季節。", "看來紅葉已開始了。", "漫長的秋夜也不錯。"],
      
      "普通Ｆ": ["秋天的收穫真豐富呢。", "紅葉的季節真美。", "漫長的秋夜最適合閱讀。"],
      "丁寧Ｆ": ["我們應該對秋天的豐收心存感謝。", "紅葉之美令人陶醉。", "漫長的秋夜最適合沉浸在閱讀中。"],
      "お嬢様": ["秋天的豐收正是大自然的恩賜跌絲襪。", "紅葉的美麗真是無與倫比跌絲襪。", "漫長的秋夜正適合閱讀或欣賞音樂跌絲襪。"],
      "快活": ["秋天來了！期待收穫祭吧！", "一起去賞紅葉吧！", "漫長的秋夜你打算怎麼過？"],
      "内気": ["秋天是...收穫...的季節...", "紅葉...漂亮得...讓人愉快...", "秋夜...漫長...讀書..."],
      "強気Ｆ": ["秋天！這正是收穫的季節！", "要不要去賞紅葉？", "在漫長的秋夜喝酒更帶勁！"],
      "蓮っ葉": ["秋天啊～真想在收穫祭上跳舞～", "紅葉？正適合約會，不是嗎？", "夜變長了呢～你打算怎麼過呢？"],
      "おっとり": ["秋天的豐收真是大自然的恩賜呢。", "紅葉的美麗真是無與倫比。", "漫長的秋夜最適合閱讀或聆聽音樂。"],
      "クールＦ": ["秋天是豐收的季節。", "看來紅葉已開始了。", "漫長的秋夜也不錯。"],
      "ぶりっこ": ["秋天來了～好期待收穫祭呢～♪", "好想去賞紅葉呢～♪", "漫長的秋夜該怎麼過呢～♪"],
      "中性": ["秋天的收穫真豐富呢。", "紅葉的季節真美呢。", "漫長的秋夜最適合閱讀呢。"],
      "ギャル風": ["秋天超棒der！一起去收穫祭吧！", "賞紅葉拍照超適合打卡呢！", "夜這麼長，有沒有什麼好活動嗎？"]
    },
    "冬": {
      "普通Ｍ": ["冬天雖然寒冷，但靜謐宜人。", "雪景真是美不勝收。", "我想待在溫暖的房間裡。"],
      "丁寧Ｍ": ["冬天的嚴寒也有一番風情呢。", "雪景讓人心靈得到洗滌。", "真想找個溫暖的地方度過"],
      "強気Ｍ": ["冬天到了！別被寒冷擊倒啊！", "來場雪仗如何？", "在暖爐前喝酒最過癮！"],
      "乱暴": ["真他媽冷啊！", "雪？只會添麻煩！", "快拿溫暖的酒來！"],
      "お調子者": ["冬天啊～要不要來場雪仗？", "真冷啊～來喝點熱飲吧！", "冬天跟戀人一起過最棒了！"],
      "陰気": ["冬天...寒冷...難受...", "雪...好美...好冷...", "溫暖的...地方...不想離開..."],
      "クールＭ": ["這就是冬天的寒冷。", "雪景也不令人討厭。", "先找個溫暖的地方吧。"],
      
      "普通Ｆ": ["冬天雖然寒冷，但靜謐宜人呢。", "雪景真是美不勝收。", "我想待在溫暖的房間裡。"],
      "丁寧Ｆ": ["冬天的嚴寒也別有風情呢。", "雪景讓人心靈得到洗滌。", "真想找個溫暖的地方度過這段時光。"],
      "お嬢様": ["冬天的嚴寒也頗有情調呢跌絲襪。", "雪景有種神秘的美麗跌絲襪。", "想在暖爐前品茗跌絲襪。"],
      "快活": ["冬天來了！來場雪仗吧！", "雖然寒冷，但冬天真有趣！", "冬天是熱飲最美味的季節！"],
      "内気": ["冬天...寒冷，...但我喜歡...", "雪...美麗...愉悅...", "房間...溫暖...讀書..."],
      "強気Ｆ": ["冬天來了！別向寒冷屈服啊！", "來場雪仗吧？", "在暖爐前喝酒最過癮！"],
      "蓮っ葉": ["冬天啊～好冷，快有人陪我暖和暖和！", "雪雖然美，但太冷就不行了～", "去個溫暖的地方喝酒吧！"],
      "おっとり": ["冬天的嚴寒也頗有情趣呢。", "雪景神秘又美麗呢。", "我真想找個溫暖的地方度過這段時光。"],
      "クールＦ": ["這就是冬天的寒冷。", "雪景也不令人討厭。", "先找個溫暖的地方吧。"],
      "ぶりっこ": ["冬天來了～來場雪仗吧～♪", "雖然冷，但冬天真有趣～♪", "冬天真是喝熱飲的好季節呢～♪"],
      "中性": ["寒冷的冬天也不算太糟呢。", "雪景真是美不勝收呢。", "我想待在溫暖的房間裡呢。"],
      "ギャル風": ["冬天真的超冷！但雪仗超好玩的啦！", "雪景拍起來超適合上打卡的～", "想在溫暖的咖啡廳裡悠閒一下"]
    }
  };
  
  // 該当する季節と口調タイプの会話を返す
  if (SEASONAL_LINES[season] && SEASONAL_LINES[season][speechType]) {
    return SEASONAL_LINES[season][speechType];
  }
  
  // 該当するものがない場合は性別に応じたデフォルトを返す
  const defaultType = character.bodySex === "男" ? "普通Ｍ" : "普通Ｆ";
  return SEASONAL_LINES[season][defaultType] || [];
} 

/**
 * キャラクターの行動を変更する
 */
function changeCharacterAction(character, newAction) {
  if (character.actionTable.includes(newAction)) {
    character.action = newAction;
    
    // テキスト部分を更新して行動変更を反映
    const text = document.getElementById("conversationText");
    if (text) {
      const currentText = text.innerHTML;
      const updatedText = currentText.replace(
        `<strong>現在的行動:</strong> ${character.action !== newAction ? character.action : newAction}`,
        `<strong>現在的行動:</strong> ${newAction}`
      );
      text.innerHTML = updatedText;
    }
    
    // ボタンのアクティブ状態を更新
    const defenderButton = document.getElementById("assignDefender");
    const trapMakerButton = document.getElementById("assignTrapMaker");
    
    if (defenderButton && trapMakerButton) {
      defenderButton.className = newAction === "迎擊" ? "active-action" : "";
      trapMakerButton.className = newAction === "製作陷阱" ? "active-action" : "";
    }
    
    // 村のUIを更新
    updateUI(theVillage);
  } else {
    console.error(`Action ${newAction} is not available for this character`);
  }
}

// 勧誘モーダルを開く
function openRecruitmentModal(visitor) {
  const overlay = document.createElement("div");
  overlay.id = "recruitmentOverlay";
  overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:3000;";
  
  const modal = document.createElement("div");
  modal.id = "recruitmentModal";
  modal.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:20px;z-index:3001;min-width:300px;border-radius:5px;box-shadow:0 2px 10px rgba(0,0,0,0.1);";
  
  // 訪問者タイプを取得
  const visitorType = getVisitorType(visitor);
  const coefficient = RECRUITMENT_COEFFICIENTS[visitorType] || 1.0;
  
  modal.innerHTML = `
    <h3 style="margin-top:0;">選擇要進行招募的村民</h3>
    <p style="margin-bottom:15px;">召募${visitor.name}。</p>
    <select id="recruiterSelect" style="width:100%;padding:5px;margin-bottom:15px;">
      <option value="">選擇要進行招募的村民</option>
      ${theVillage.villagers.map(v => `
        <option value="${v.name}">${v.name} (魅力:${Math.floor(v.chr)} 智力:${Math.floor(v.int)})</option>
      `).join('')}
    </select>
    <div style="display:flex;justify-content:flex-end;gap:10px;">
      <button id="cancelRecruitment" style="padding:5px 15px;">取消</button>
      <button id="doRecruitment" style="padding:5px 15px;">招募</button>
    </div>
  `;
  
  document.body.appendChild(overlay);
  document.body.appendChild(modal);
  
  // イベントリスナーを設定
  document.getElementById("doRecruitment").addEventListener("click", () => {
    const recruiterName = document.getElementById("recruiterSelect").value;
    if (!recruiterName) {
      alert("請選擇要進行招募的村民");
      return;
    }
    
    // 人口上限チェックを追加
    if (theVillage.villagers.length >= theVillage.popLimit) {
      alert("已達到村莊的人口上限。 若要招募新的村民，請建造民宅並增加人口上限。");
      theVillage.log(`招募失敗: 到達人口上限(${theVillage.popLimit}人)`);
      return;
    }
    
    const recruiter = theVillage.villagers.find(v => v.name === recruiterName);
    if (!recruiter) return;
    
    // 勧誘成功率を計算
    const successRate = Math.min(100, Math.max(0, 
      coefficient * (recruiter.chr / 20) * (recruiter.int / 20) * 100
    ));
    
    // 勧誘判定
    if (Math.random() * 100 < successRate) {
      // 成功
      visitor.mindTraits = visitor.mindTraits.filter(t => t !== "訪問者");
      visitor.job = "無";
      visitor.action = "休養";
      visitor.jobTable = ["無", "休養"];
      visitor.actionTable = ["休養"];
      
      // 名前から「〜の」を削除
      const visitorType = getVisitorType(visitor);
      if (visitor.name.includes(`${visitorType}`)) {
        visitor.name = visitor.name.replace(`${visitorType}–`, "");
      }
      
      // 訪問者リストから削除し、村人リストに追加
      theVillage.visitors = theVillage.visitors.filter(v => v.name !== visitor.name);
      theVillage.villagers.push(visitor);
      
      // 仕事テーブルを更新
      refreshJobTable(visitor);
      
      theVillage.log(`透過${recruiter.name}的招募，${visitor.name}成為了村民。(成功率: ${Math.floor(successRate)}%)`);
      alert(`招募成功！${visitor.name}成為了村民。`);
    } else {
      // 失敗
      visitor.mindTraits.push("招募失敗");
      theVillage.log(`$對{recruiter.name}的招募失敗了。(成功率: ${Math.floor(successRate)}%)`);
      alert("招募失敗了。");
    }
    
    closeRecruitmentModal();
    closeConversationModal();
    updateUI(theVillage);
  });
  
  // キャンセルボタンのイベントリスナーを設定
  const cancelButton = document.getElementById("cancelRecruitment");
  if (cancelButton) {
    cancelButton.addEventListener("click", () => {
      closeRecruitmentModal();
    });
  }
  
  // オーバーレイクリックでもモーダルを閉じる
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeRecruitmentModal();
    }
  });
}

// 勧誘モーダルを閉じる
function closeRecruitmentModal() {
  const overlay = document.getElementById("recruitmentOverlay");
  const modal = document.getElementById("recruitmentModal");
  if (overlay) overlay.remove();
  if (modal) modal.remove();
}

// 訪問者タイプを取得する関数
function getVisitorType(visitor) {
  const visitorTypes = ["流民", "冒險者", "巡礼者", "學者", "觀光客", "旅者", "行商人"];
  for (const type of visitorTypes) {
    if (visitor.name.includes(type)) {
      return type;
    }
  }
  return "旅者"; // デフォルト
}

// 誘惑モーダルを開く
function openSeductionModal(visitor) {
  const overlay = document.createElement("div");
  overlay.id = "seductionOverlay";
  overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:3000;";
  
  const modal = document.createElement("div");
  modal.id = "seductionModal";
  modal.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:20px;z-index:3001;min-width:300px;border-radius:5px;box-shadow:0 2px 10px rgba(0,0,0,0.1);";
  
  // 訪問者タイプを取得
  const visitorType = getVisitorType(visitor);
  const coefficient = RECRUITMENT_COEFFICIENTS[visitorType] || 1.0;
  
  modal.innerHTML = `
    <h3 style="margin-top:0;">選擇要進行誘惑的村民</h3>
    <p style="margin-bottom:15px;">$誘惑{visitor.name}。</p>
    <select id="seducerSelect" style="width:100%;padding:5px;margin-bottom:15px;">
      <option value="">請選擇要進行誘惑的村民</option>
      ${theVillage.villagers.map(v => `
        <option value="${v.name}">${v.name} (魅力:${Math.floor(v.chr)} 好色:${Math.floor(v.sexdr)})</option>
      `).join('')}
    </select>
    <div style="display:flex;justify-content:flex-end;gap:10px;">
      <button id="cancelSeduction" style="padding:5px 15px;">取消</button>
      <button id="doSeduction" style="padding:5px 15px;">誘惑</button>
    </div>
  `;
  
  document.body.appendChild(overlay);
  document.body.appendChild(modal);
  
  // イベントリスナーを設定
  document.getElementById("doSeduction").addEventListener("click", () => {
    const seducerName = document.getElementById("seducerSelect").value;
    if (!seducerName) {
      alert("選擇要進行誘惑的村民。");
      return;
    }
    
    // 人口上限チェックを追加
    if (theVillage.villagers.length >= theVillage.popLimit) {
      alert("已達到村莊的人口上限。 若要招募新的村民，請建造民宅並增加人口上限。");
      theVillage.log(`誘惑失敗: 到達人口上限(${theVillage.popLimit}人)`);
      return;
    }
    
    const seducer = theVillage.villagers.find(v => v.name === seducerName);
    if (!seducer) return;
    
    // 条件チェック
    // 1. 精神性別と肉体性別が異なるか
    // 2. 誘惑者の好色が21以上か
    if (visitor.spiritSex === seducer.bodySex) {
      alert("誘惑者的身體性別和訪問者的精神性別相同。無法誘惑。");
      theVillage.log(`對${seducer.name}的誘惑失敗。(理由: 性別不一致)`);
      return;
    }
    
    if (seducer.sexdr < 21) {
      alert("誘惑者的好色不足。無法誘惑。");
      theVillage.log(`對${seducer.name}的誘惑失敗。(理由: 誘惑者的好色不足)`);
      return;
    }
    
    // 誘惑成功率を計算
    const successRate = Math.min(100, Math.max(0, 
      coefficient * (seducer.chr / 20) * (seducer.sexdr / 20) * 100
    ));
    
    // 誘惑判定
    if (Math.random() * 100 < successRate) {
      // 成功
      visitor.mindTraits = visitor.mindTraits.filter(t => t !== "訪問者");
      visitor.job = "無";
      visitor.action = "休養";
      visitor.jobTable = ["無", "休養"];
      visitor.actionTable = ["休養"];
      
      // 名前から「〜の」を削除
      const visitorType = getVisitorType(visitor);
      if (visitor.name.includes(`${visitorType}–`)) {
        visitor.name = visitor.name.replace(`${visitorType}–`, "");
      }
      
      // 訪問者リストから削除し、村人リストに追加
      theVillage.visitors = theVillage.visitors.filter(v => v.name !== visitor.name);
      theVillage.villagers.push(visitor);
      
      // 仕事テーブルを更新
      refreshJobTable(visitor);
      
      theVillage.log(`因為${seducer.name}的誘惑，${visitor.name}成為了村民。(成功率: ${Math.floor(successRate)}%)`);
      alert(`誘惑成功！${visitor.name}成為了村民。`);
    } else {
      // 失敗
      visitor.mindTraits.push("招募失敗");
      theVillage.log(`對${seducer.name}的誘惑失敗了。(成功率: ${Math.floor(successRate)}%)`);
      alert("誘惑失敗了。");
    }
    
    closeSeductionModal();
    closeConversationModal();
    updateUI(theVillage);
  });
  
  // キャンセルボタンのイベントリスナーを設定
  const cancelButton = document.getElementById("cancelSeduction");
  if (cancelButton) {
    cancelButton.addEventListener("click", () => {
      closeSeductionModal();
    });
  }
  
  // オーバーレイクリックでもモーダルを閉じる
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeSeductionModal();
    }
  });
}

// 誘惑モーダルを閉じる
function closeSeductionModal() {
  const overlay = document.getElementById("seductionOverlay");
  const modal = document.getElementById("seductionModal");
  if (overlay) overlay.remove();
  if (modal) modal.remove();
}