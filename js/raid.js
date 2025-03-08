// raid.js

import { createRandomVillager } from "./createVillagers.js";
import { randInt, randChoice, clampValue, shuffleArray } from "./util.js";
import { endOfMonthProcess, doFixedEventPre, doFixedEventPost, doRandomEventPre, doRandomEventPost, doMonthStartProcess, doAgingProcess, updateSeason } from "./events.js";
import { handleAllVillagerJobs } from "./jobs.js";
import { updateUI } from "./ui.js";
import { MALE_PORTRAIT_FILES, usedPortraits } from "./createVillagers.js";

/**
 * 襲擊者タイプの定義
 */
const RAIDER_TYPES = [
  {
    type: "山賊",
    weight: 30,  // 出現率30%
    minCount: 2,
    maxCount: 3,
    race: "人類",
    forcedSex: "男",  // 性別を男に固定
    ageRange: { min: 18, max: 45 },  // 青年～中年
    params: {
      job: "山賊",
      action: "襲擊"
    },
    portraits: [
      "BAN1.png", "BAN2.png", "BAN3.png", "BAN4.png", "BAN5.png",
      "BAN6.png", "BAN7.png", "BAN8.png", "BAN9.png", "BAN10.png",
      "BAN11.png", "BAN12.png", "BAN13.png", "BAN14.png", "BAN15.png",
      "BAN16.png", "BAN17.png", "BAN18.png", "BAN19.png", "BAN20.png", "BAN20.png"
    ],
    ranges: {
      hp: [80, 100],
      str: [15, 25],
      vit: [8, 30],
      dex: [10, 20],
      mag: [5, 15],
      chr: [3, 19],
      int: [5, 18],
      ind: [3, 16],
      eth: [1, 9],
      cou: [12, 25],
      sexdr: [10, 20]
    },
    dialogues: [
      "把金子和食物都交出來！不然就拿你們的命來換！",
      "立刻把全部財產奉上！敢反抗的話，我就宰了你！",
      "從現在開始，這個村莊歸我們了！抵抗是沒有用的！",
      "把女人都交出來！不然就把你們全都殺了！",
      "叫村長滾出來！我有事要談。",
      "我們已經餓壞了，快分點食物給我們！要是不答應，就等著被襲擊吧！"
    ]
  },
  {
    type: "哥布林",
    weight: 25,
    minCount: 4,
    maxCount: 5,
    race: "哥布林",
    forcedSex: "男",
    ageRange: { min: 15, max: 30 },  // 若い哥布林
    params: {
      job: "哥布林",
      action: "襲擊"
    },
    portraits: [
      "GOB1.png", "GOB2.png", "GOB3.png", "GOB4.png", "GOB5.png",
      "GOB6.png", "GOB7.png", "GOB8.png", "GOB9.png", "GOB10.png", "GOB11.png", "GOB12.png", "GOB13.png"
    ],
    ranges: {
      hp: [30, 50],
      str: [10, 18],
      vit: [5, 15],
      dex: [18, 25],
      mag: [5, 15],
      chr: [3, 12],
      int: [5, 12],
      ind: [5, 12],
      eth: [1, 5],
      cou: [5, 12],
      sexdr: [18, 25]
    },
    dialogues: [
      "嘻嘻嘻！把村子的寶物交出來！",
      "咕布咕布！人類太弱了，殺了吃掉！",
      "嘎嘎嘎！把女人帶回去！",
      "讓你們見識哥布林族的力量！",
      "奪下人類的村子！這裡是哥布林的新巢穴了！",
      "把食物交出來！不然就把你們全都殺光！"
    ]
  },
  {
    type: "狼",
    weight: 20,
    minCount: 2,
    maxCount: 3,
    race: "狼",
    ageRange: { min: 3, max: 8 },  // 若い～成熟した狼
    params: {
      job: "狼",
      action: "襲擊"
    },
    ranges: {
      hp: [40, 60],
      str: [20, 30],
      vit: [5, 15],
      dex: [3, 8],
      mag: [3, 12],
      chr: [3, 12],
      int: [1, 5],
      ind: [1, 5],
      eth: [5, 15],
      cou: [20, 25],
      sexdr: [10, 20]
    },
    bodyTraits: ["肌肉發達", "毛亮", "精悍", "乾癟", "精細", "強面"],
    forcedBodyTraits: ["蓬鬆"],
    hobbies: ["散步", "狩獵", "打理毛髮", "繁殖", "養育子女", "打架", "日光浴"],
    dialogues: [
      "嗷嗚嗚……（好像發現獵物了）",
      "ウゥゥ...「嗚嗚……汪！ （飢餓讓它變得兇暴）",
      "嗷嗷……（似乎在召喚同伴）",
      "嗅嗅……（正在嗅探村子的氣味）",
      "哈啊哈啊……（看到獵物興奮起來了）",
      "嗚嗚嗚——！（發出襲擊的信號！）"
    ],
    portraits: [
      "WOLF1.png", "WOLF2.png", "WOLF3.png", "WOLF4.png", "WOLF5.png",
      "WOLF6.png"
    ],
  },
  {
    type: "獨眼巨魔",
    weight: 10,
    minCount: 1,
    maxCount: 1,
    race: "巨人",
    forcedSex: "男",
    ageRange: { min: 30, max: 60 },  // 成熟～老齢の巨人
    params: {
      job: "獨眼巨魔",
      action: "襲擊"
    },
    ranges: {
      hp: [90, 120],
      str: [25, 35],
      vit: [25, 35],
      dex: [5, 15],
      mag: [5, 15],
      chr: [3, 12],
      int: [3, 8],
      ind: [5, 15],
      eth: [5, 15],
      cou: [20, 25],
      sexdr: [10, 20]
    },
    forcedBodyTraits: ["巨人", "獨眼"],
    dialogues: [
      "喔嗚嗚！渺小的人類，老子要把你們碾碎！",
      "肚子餓了……就拿你們人類來填飽肚子吧……！",
      "我要把這個村莊夷為平地！別妄想逃跑！",
      "把你們的牲畜交出來！敢反抗的話，就把你們一起踩成肉泥！",
      "讓你們見識獨眼巨魔的憤怒！",
      "人類太弱了……一腳就能踩扁……"
    ],
    portraits: [
      "CYCLOPS1.png", "CYCLOPS2.png", "CYCLOPS3.png", "CYCLOPS4.png"
    ],
  },
  {
    type: "哈比",
    weight: 15,
    minCount: 2,
    maxCount: 3,
    race: "哈比",
    forcedSex: "女",
    ageRange: { min: 16, max: 25 },  // 若い～成熟した哈比
    params: {
      job: "哈比",
      action: "襲擊"
    },
    portraits: [
      "HARPY1.png", "HARPY2.png", "HARPY3.png", "HARPY4.png", 
      "HARPY5.png", "HARPY6.png", "HARPY7.png", "HARPY8.png",
      "HARPY9.png", "HARPY10.png", "HARPY11.png", "HARPY12.png"
      
    ],
    ranges: {
      hp: [70, 90],
      str: [16, 22],
      vit: [8, 18],
      dex: [1, 5],
      mag: [15, 20],
      chr: [18, 25],
      int: [5, 12],
      ind: [5, 12],
      eth: [5, 12],
      cou: [15, 22],
      sexdr: [10, 20]
    },
    forcedBodyTraits: ["飛行", "清澈的聲"],
    hobbies: ["遠遊", "狩獵", "打理羽毛", "繁殖", "養育子女", "打架", "日光浴", "歌唱"],
    dialogues: [
      "嘻嘻嘻！找到好東西了呢！",
      "啊啦～多麼可愛的村莊♡ 就讓我收下吧♪",
      "來吧，讓我們的歌聲把你迷住吧♪",
      "從天上襲擊的話，你們可是逃不掉的哦！",
      "寶物全部都是人家的！快點交出來！",
      "我最喜歡美麗的東西了♪ 把你身上閃閃發光的東西全都給我吧！"
    ]
  }

];

/**
 * 重み付き抽選で襲擊者タイプを選択
 */
function selectRaiderType() {
  const totalWeight = RAIDER_TYPES.reduce((sum, type) => sum + type.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const raiderType of RAIDER_TYPES) {
    random -= raiderType.weight;
    if (random <= 0) {
      return raiderType;
    }
  }
  return RAIDER_TYPES[0]; // フォールバック
}

/**
 * 襲擊イベント開始を修正
 */
export function startRaidEvent(village) {
  village.log("【襲擊事件發生】20%根據判定發生");
  if (!village.villageTraits.includes("襲擊中")) {
    village.villageTraits.push("襲擊中");
  }

  const raiderType = selectRaiderType();
  const enemyCount = randInt(raiderType.minCount, raiderType.maxCount);
  village.raidEnemies = [];

  for (let i = 0; i < enemyCount; i++) {
    let e = createRandomVillager({
      sex: raiderType.forcedSex || (Math.random() < 0.5 ? "男" : "女"),
      minAge: raiderType.ageRange.min,
      maxAge: raiderType.ageRange.max,
      params: {
        ...raiderType.params,
        race: raiderType.race
      },
      ranges: raiderType.ranges
    });

    // 襲擊者の特性とダイアログを設定
    e.mindTraits.push("襲擊者");
    e.raiderDialogues = raiderType.dialogues || [];

    // 顔グラフィックの設定（直接portraitFileを設定）
    if (raiderType.portraits) {
      e.portraitFile = randChoice(raiderType.portraits);
      console.log('Set portrait for raider:', {
        name: e.name,
        type: raiderType.type,
        portrait: e.portraitFile,
        mindTraits: e.mindTraits
      });
    }

    // 狼の場合は肉体特性を上書き
    if (raiderType.type === "狼") {
      e.bodyTraits = [
        ...raiderType.forcedBodyTraits,
        randChoice(raiderType.bodyTraits)
      ];
      // 狼の趣味を設定
      e.hobby = randChoice(raiderType.hobbies);
    }
    // その他の種族の場合は従来通りの処理
    else {
      // 強制的な肉体特性を追加
      if (raiderType.forcedBodyTraits) {
        // 獨眼巨魔の場合は強制的な特性のみを持つ
        if (raiderType.type === "獨眼巨魔") {
          e.bodyTraits = [...raiderType.forcedBodyTraits];
        } else {
          raiderType.forcedBodyTraits.forEach(trait => {
            if (!e.bodyTraits.includes(trait)) {
              e.bodyTraits.push(trait);
            }
          });
        }
      }

      // 特定の種族用のランダム肉体特性
      if (raiderType.bodyTraits) {
        const randomTrait = randChoice(raiderType.bodyTraits);
        if (!e.bodyTraits.includes(randomTrait)) {
          e.bodyTraits.push(randomTrait);
        }
      }

      // 特定の種族用の趣味
      if (raiderType.hobbies) {
        e.hobby = randChoice(raiderType.hobbies);
      }
    }

    e.jobTable = [raiderType.params.job];
    e.actionTable = ["襲擊"];
    e.job = raiderType.params.job;
    e.action = "襲擊";
    e.name = `${raiderType.type}–${e.name}`;

    // ニート特性は不要なので削除
    if (e.mindTraits.includes("尼特")) {
      e.mindTraits = e.mindTraits.filter(trait => trait !== "尼特");
    }

    village.raidEnemies.push(e);
  }

  // 生成された敵全体の確認ログ
  console.log('Created raiders:', village.raidEnemies.map(e => ({
    name: e.name,
    type: e.job,
    portrait: e.portraitFile
  })));

  village.isRaidProcessDone = false;
  village.raidTurnCount = 0;
  village.currentActionIndex = 0;
  village.raidActionQueue = [];

  // 襲擊者の数に応じてメッセージを変更
  if (enemyCount === 1) {
    village.log(`1體${raiderType.type}襲擊！`);
  } else {
    village.log(`${raiderType.type}(${enemyCount}體)襲擊！`);
  }

  let nextBtn = document.getElementById("nextTurnButton");
  if (nextBtn) {
    nextBtn.innerHTML = `<b style="color:red;">迎擊開始</b>`;
  }

  // アラートメッセージも数に応じて変更
  if (enemyCount === 1) {
    alert(`【襲擊發生】${raiderType.type}正在接近村莊。請進行迎擊！`);
  } else {
    alert(`【襲擊發生】${raiderType.type}的集團正接近村莊。請進行迎擊！`);
  }

  const raidSection = document.getElementById("raidEnemiesSection");
  if (raidSection) raidSection.style.display = "block";
}

/**
 * 迎擊モーダルを開く (nextTurnから呼ばれる)
 */
export function openRaidModal(village) {
  document.getElementById("raidOverlay").style.display="block";
  document.getElementById("raidModal").style.display="block";

  updateRaidTables(village);
  const rlog=document.getElementById("raidLogArea");
  rlog.innerHTML="襲擊開始。<br>請按「下一步」。";

  let trapMakers = village.villagers.filter(p=> p.action==="製作陷阱");
  let defenders  = village.villagers.filter(p=> p.action==="迎擊");

  if (trapMakers.length===0 && defenders.length===0) {
    rlog.innerHTML+=`<br>沒有人可以迎擊！ → 襲擊成功(敵方)。`;
    village.raidActionQueue=[ {type:"AUTO_FAIL"} ];
    village.currentActionIndex=0;
  } else {
    village.raidTurnCount=1;
    createTrapActionQueue(village);
  }
}

/**
 * 罠作成(最初の行動)のキューを作成
 */
function createTrapActionQueue(village) {
  let trapMakers = village.villagers.filter(p=>p.action==="製作陷阱" && p.hp>0);
  trapMakers = shuffleArray(trapMakers);

  village.raidActionQueue=[];
  trapMakers.forEach(p=>{
    village.raidActionQueue.push({
      type:"TRAP",
      actor:p
    });
  });
  village.currentActionIndex=0;
}

/**
 * 「次のステップ」ボタン
 */
export function proceedRaidAction(village) {
  const logDiv = document.getElementById("raidLogArea");
  let action = village.raidActionQueue[village.currentActionIndex];

  if (!action) {
    finalizeCombatTurn(village);
    return;
  }
  switch(action.type) {
    case "TRAP":
      doOneTrapAction(action, village);
      break;
    case "COMBAT":
      doOneCombatAction(action, village);
      break;
    case "AUTO_FAIL":
      finalizeRaid(false, "迎擊部隊0", village);
      return;
  }
  village.currentActionIndex++;
  checkCombatEndOfActions(village);
}

/** 1件のTRAP行動 */
function doOneTrapAction(action, village) {
  let p=action.actor;
  let logDiv=document.getElementById("raidLogArea");
  if (!p||p.hp<=0) {
    logDiv.innerHTML+=`<br>【製作陷阱】${p?p.name:"??"} 失去行動能力`;
    updateRaidTables(village);
    return;
  }
  if (village.raidEnemies.length===0) {
    logDiv.innerHTML+=`<br>【製作陷阱】敵人已經全滅`;
    updateRaidTables(village);
    return;
  }
  let e=randChoice(village.raidEnemies);
  let dmg = Math.floor((p.dex*p.int/400)*30);
  e.hp-=dmg;
  logDiv.innerHTML+=`<br>【製作陷阱】${p.name}→對${e.name}造成${dmg}點傷害`;
  if (e.hp<=0) {
    logDiv.innerHTML+=`<br>　　→ ${e.name}被擊倒了！`;
    village.raidEnemies=village.raidEnemies.filter(x=> x!==e);
  }
  updateRaidTables(village);
}

/** 罠作成後 -> 迎擊フェーズ(3ターン) */
export function setupCombatPhase(village) {
  const logDiv=document.getElementById("raidLogArea");

  let defenders = village.villagers.filter(p=> p.action==="迎擊" && p.hp>0);
  let enemies   = village.raidEnemies.filter(e=> e.hp>0);

  if (enemies.length===0) {
    finalizeRaid(true, "只製作陷阱達成撃退", village);
    return;
  }
  if (defenders.length===0) {
    finalizeRaid(false, "沒有迎擊部隊(行動不能)", village);
    return;
  }
  if (village.raidTurnCount>3) {
    finalizeRaidPartSuccess(village);
    return;
  }

  logDiv.innerHTML+=`<hr><br>【迎擊階段】第 ${village.raidTurnCount} 回合開始`;

  village.raidActionQueue=createCombatActions(defenders, village.raidEnemies);
  village.currentActionIndex=0;
  updateRaidTables(village);
}

/** 行動順(勇気降順) */
function createCombatActions(defenders, enemies) {
  let allUnits = defenders.concat(enemies);
  allUnits.sort((a,b)=>{
    if (b.cou===a.cou) return Math.random()<0.5 ? -1:1;
    return b.cou - a.cou;
  });
  let arr=[];
  allUnits.forEach(u=>{
    arr.push({type:"COMBAT", actor:u});
  });
  return arr;
}

/** 1件のCOMBAT行動 */
function doOneCombatAction(action, village) {
  let actor=action.actor;
  let logDiv=document.getElementById("raidLogArea");
  if (!actor||actor.hp<=0) {
    logDiv.innerHTML+=`<br>【迎擊】${actor?actor.name:"??"}失去行動能力`;
    updateRaidTables(village);
    return;
  }
  let isEnemy = village.raidEnemies.includes(actor);

  let defenders = village.villagers.filter(p=> p.action==="迎擊" && p.hp>0);
  let enemies   = village.raidEnemies.filter(e=> e.hp>0);

  if (isEnemy) {
    // 敵の攻撃
    if (defenders.length===0) {
      logDiv.innerHTML+=`<br>【敵人的攻撃】迎擊方全滅...`;
      updateRaidTables(village);
      return;
    }
    let target=randChoice(defenders);
    let result=calcAttackDamage(actor,target,false);
    let dmg=result.damage;
    let atkTypeText = result.isMagic? "魔法攻撃":"物理攻撃";
    target.hp-=dmg;
    logDiv.innerHTML+=`<br>【敵人的攻撃】${actor.name}的${atkTypeText}→對${target.name}造成 ${dmg}點傷害`;
    if (target.hp<=0) {
      logDiv.innerHTML+=`<br>　　→ ${target.name}は受傷離脱(HP0)`;
      if (!target.bodyTraits.includes("受傷")) target.bodyTraits.push("受傷");
    } else {
      // 反撃
      let ret=calcAttackDamage(target, actor, true);
      let rdmg=Math.floor(ret.damage*0.5);
      let retTypeText=ret.isMagic? "魔法攻撃":"物理攻撃";
      actor.hp-=rdmg;
      logDiv.innerHTML+=`<br>　　→ 反撃(${retTypeText}):${target.name}→對${actor.name}造成 ${rdmg}點傷害`;
      if (actor.hp<=0) {
        logDiv.innerHTML+=`<br>　　→ ${actor.name}被擊倒了！`;
        village.raidEnemies=village.raidEnemies.filter(e=> e!==actor);
      }
    }
  } else {
    // 村人の攻撃
    if (village.raidEnemies.length===0) {
      logDiv.innerHTML+=`<br>【村民的攻撃】敵人已全滅`;
      updateRaidTables(village);
      return;
    }
    let target=randChoice(village.raidEnemies);
    let result=calcAttackDamage(actor,target,false);
    let dmg=result.damage;
    let atkTypeText=result.isMagic? "魔法攻撃":"物理攻撃";
    target.hp-=dmg;
    logDiv.innerHTML+=`<br>【迎擊】${actor.name}的${atkTypeText}→對${target.name}造成 ${dmg}點傷害`;
    if (target.hp<=0) {
      logDiv.innerHTML+=`<br>　　→ ${target.name}被擊倒了！`;
      village.raidEnemies=village.raidEnemies.filter(e=> e!==target);
    } else {
      // 敵の反撃
      let ret=calcAttackDamage(target, actor, true);
      let rdmg=Math.floor(ret.damage*0.5);
      let retTypeText=ret.isMagic? "魔法攻撃":"物理攻撃";
      actor.hp-=rdmg;
      logDiv.innerHTML+=`<br>　　→ 反撃(${retTypeText}):對${target.name}→${actor.name}造成${rdmg}點傷害`;
      if (actor.hp<=0) {
        logDiv.innerHTML+=`<br>　　→ ${actor.name}受傷離開(HP0)`;
        if (!actor.bodyTraits.includes("受傷")) actor.bodyTraits.push("受傷");
      }
    }
  }
  updateRaidTables(village);
}

function calcAttackDamage(atk, def, isCounter) {
  let phys = ((atk.str*atk.cou)/400)*50 - def.vit;
  let mag  = ((atk.mag*atk.cou)/400)*25;
  phys=Math.floor(phys);
  mag=Math.floor(mag);
  if (phys<0) phys=0;
  if (mag<0) mag=0;

  let finalDamage=0;
  let usedMagic=false;
  if (phys>=mag) {
    finalDamage=phys;
  } else {
    finalDamage=mag;
    usedMagic=true;
  }
  return {damage:Math.floor(finalDamage), isMagic:usedMagic};
}

/** 全アクション完了後にターン終了 */
function finalizeCombatTurn(village) {
  let logDiv=document.getElementById("raidLogArea");

  let defenders = village.villagers.filter(p=> p.action==="迎擊" && p.hp>0);
  let enemies   = village.raidEnemies.filter(e=> e.hp>0);

  if (defenders.length===0) {
    finalizeRaid(false, "迎擊部隊全滅", village);
    return;
  }
  if (enemies.length===0) {
    finalizeRaid(true, "敵全滅", village);
    return;
  }

  village.raidTurnCount++;
  if (village.raidTurnCount>3) {
    finalizeRaidPartSuccess(village);
  } else {
    setupCombatPhase(village);
  }
}

/** 全員の行動終了時に敵 or 迎擊側が全滅したかどうか確認 */
function checkCombatEndOfActions(village) {
  let defenders = village.villagers.filter(p=> p.action==="迎擊" && p.hp>0);
  let enemies   = village.raidEnemies.filter(e=> e.hp>0);

  if (defenders.length===0) {
    finalizeRaid(false, "迎擊部隊全滅", village);
    return;
  }
  if (enemies.length===0) {
    finalizeRaid(true, "敵全滅", village);
    return;
  }

  if (village.currentActionIndex < village.raidActionQueue.length) {
    return; // まだ行動が残ってる
  }
  finalizeCombatTurn(village);
}

/** (完全)成功 or 失敗 */
function finalizeRaid(isSuccess, reason, village) {
  village.log(`【襲擊結果】${isSuccess?"防衛成功":"防衛失敗"} : ${reason}`);
  let rlog=document.getElementById("raidLogArea");
  rlog.innerHTML+=`<br>→ 襲擊結果: ${isSuccess?"防衛成功":"失敗"} (${reason})<br>モーダルを閉じます...`;

  endRaidProcess(isSuccess, false, village);
}

/** 3ターン粘って撤退(部分成功) */
function finalizeRaidPartSuccess(village) {
  village.log("【襲擊結果】3回合後敵人撤退→部分成功");
  let rlog=document.getElementById("raidLogArea");
  rlog.innerHTML+=`<br>→ 襲擊結果: 敵撤退(部分成功)<br>モーダルを閉じます...`;

  endRaidProcess(true,true,village);
}

/** 襲擊終了処理 */
function endRaidProcess(isSuccess, isPartSuccess, village) {
  village.log(`[DEBUG] 襲擊結果 成功:${isSuccess} 部分成功:${isPartSuccess}`);
  setTimeout(()=>{
    closeRaidModal();
    let idx=village.villageTraits.indexOf("襲擊中");
    if (idx>=0) {
      village.villageTraits.splice(idx,1);
    }
    village.raidEnemies=[];

    // 襲擊者一覧セクションを非表示に
    const raidSection = document.getElementById("raidEnemiesSection");
    if (raidSection) {
      raidSection.style.display = "none";
    }

    if (isSuccess) {
      if (isPartSuccess) {
        // 部分成功
        village.villagers.forEach(p=>{
          p.happiness=clampValue(p.happiness+10,0,100);
        });
        village.fame+=10;
        village.log("防衛成功(部分):村人幸福+10,名聲+10");
      } else {
        // 完全成功
        village.villagers.forEach(p=>{
          p.happiness=clampValue(p.happiness+20,0,100);
        });
        village.fame+=20;
        village.log("防衛成功(敵人全滅):村人幸福+20,名聲+20");
      }
    } else {
      // 失敗
      let fLoss=Math.floor(village.food*0.2);
      let mLoss=Math.floor(village.materials*0.2);
      let fundLoss=Math.floor(village.funds*0.2);
      village.food=clampValue(village.food - fLoss,0,99999);
      village.materials=clampValue(village.materials - mLoss,0,99999);
      village.funds=clampValue(village.funds - fundLoss,0,99999);
      village.security=clampValue(village.security-10,0,100);

      village.villagers.forEach(p=>{
        p.hp=clampValue(p.hp - randInt(5,15),0,100);
        p.happiness=clampValue(p.happiness-30,0,100);
      });
      village.log(`迎擊失敗:食材-${fLoss},建材-${mLoss},資金-${fundLoss},治安-10,村民HP-5~15,幸福-30`);
    }

    village.isRaidProcessDone=true;

    // nextTurnButton の表示を戻す
    let btn=document.getElementById("nextTurnButton");
    if (btn) {
      btn.textContent="下個月";
    }

    // 襲擊終了後、その月の残り処理を実行→次月へ
    village.hasDonePreEvent=false;
    village.hasDonePostEvent=false;

    // 月前半
    doFixedEventPre(village);
    doRandomEventPre(village);
    // 村人仕事
    handleAllVillagerJobs(village);
    // 月後半
    doFixedEventPost(village);
    doRandomEventPost(village);
    // 月末
    endOfMonthProcess(village);

    if (village.villagers.length===0) {
      village.log("村人全滅→GameOver");
      village.gameOver=true;
      updateUI(village);
      return;
    }

    village.month++;
    if (village.month>12) {
      village.month=1;
      village.year++;
    }

    // 季節更新を月初処理の前に実行
    if ([3,6,9,12].includes(village.month)) {
      updateSeason(village);
    }

    if (village.month===1) {
      doAgingProcess(village);
    }
    doMonthStartProcess(village);

    updateUI(village);

  }, 1500);
}

/** モーダルを閉じる */
export function closeRaidModal() {
  document.getElementById("raidOverlay").style.display="none";
  document.getElementById("raidModal").style.display="none";
}

/**
 * 肉体交換(雷/奇跡)
 *  - isLightning=true の場合はログを簡略化
 */
export function doExchange(a, b, v, isLightning) {
  let tmp={
    bodySex: a.bodySex,
    bodyAge: a.bodyAge,
    hp: a.hp,
    str: a.str, vit:a.vit, dex:a.dex, mag:a.mag, chr:a.chr,
    bodyTraits: [...a.bodyTraits],
    bodyOwner: a.bodyOwner,
    race: a.race,  // 種族も交換
    portraitFile: a.portraitFile,  // 顔グラフィック情報
    raiderPortrait: a.raiderPortrait, // 襲擊者用の顔グラフィック
    visitorPortrait: a.visitorPortrait // 訪問者用の顔グラフィック
  };
  a.bodySex=b.bodySex; 
  a.bodyAge=b.bodyAge;
  a.hp=b.hp;
  a.str=b.str; a.vit=b.vit; a.dex=b.dex; a.mag=b.mag; a.chr=b.chr;
  a.bodyTraits=[...b.bodyTraits];
  a.bodyOwner=b.bodyOwner;
  a.race=b.race;
  a.portraitFile=b.portraitFile;
  a.raiderPortrait=b.raiderPortrait;
  a.visitorPortrait=b.visitorPortrait;

  b.bodySex=tmp.bodySex;
  b.bodyAge=tmp.bodyAge;
  b.hp=tmp.hp;
  b.str=tmp.str; b.vit=tmp.vit; b.dex=tmp.dex; b.mag=tmp.mag; b.chr=tmp.chr;
  b.bodyTraits=[...tmp.bodyTraits];
  b.bodyOwner=tmp.bodyOwner;
  b.race=tmp.race;
  b.portraitFile=tmp.portraitFile;
  b.raiderPortrait=tmp.raiderPortrait;
  b.visitorPortrait=tmp.visitorPortrait;
}

/** 迎擊画面更新 */
export function updateRaidTables(village) {
  // 敵側
  let enemyTbody = document.querySelector("#enemyTable tbody");
  if (enemyTbody) {
    enemyTbody.innerHTML = "";
    village.raidEnemies.forEach(e => {
      let tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${e.name}</td>
        <td>${Math.floor(e.hp)}</td>
        <td>${e.action}</td>
        <td>${Math.floor(e.str)}</td>
        <td>${Math.floor(e.vit)}</td>
        <td>${Math.floor(e.mag)}</td>
        <td>${Math.floor(e.cou)}</td>
      `;
      enemyTbody.appendChild(tr);
    });
  }
  
  // 罠作成部隊
  let trapMakers = village.villagers.filter(v => v.action === "製作陷阱");
  let defenderTbody = document.querySelector("#defenderTable tbody");
  if (defenderTbody) {
    defenderTbody.innerHTML = "";
    trapMakers.forEach(v => {
      let tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${v.name}</td>
        <td>${Math.floor(v.hp)}</td>
        <td>${v.action}</td>
        <td>${Math.floor(v.str)}</td>
        <td>${Math.floor(v.vit)}</td>
        <td>${Math.floor(v.mag)}</td>
        <td>${Math.floor(v.cou)}</td>
      `;
      defenderTbody.appendChild(tr);
    });
  }
  
  // 迎擊部隊
  let raiders = village.villagers.filter(v => v.action === "迎擊");
  let raidersTbody = document.querySelector("#raidersTable tbody");
  if (raidersTbody) {
    raidersTbody.innerHTML = "";
    raiders.forEach(v => {
      let tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${v.name}</td>
        <td>${Math.floor(v.hp)}</td>
        <td>${Math.floor(v.str)}</td>
        <td>${Math.floor(v.vit)}</td>
        <td>${Math.floor(v.mag)}</td>
        <td>${Math.floor(v.cou)}</td>
      `;
      raidersTbody.appendChild(tr);
    });
  }
}

// 戦闘ダメージを受けた際の処理を追加
function applyDamage(target, damage, village) {
  target.hp = clampValue(target.hp - damage, 0, 100);
  
  // HP0以下になった場合の処理
  if (target.hp <= 0) {
    // 村人の場合（襲擊者でない場合）の処理
    if (!target.mindTraits.includes("襲擊者")) {
      // 受傷特性を追加
      if (!target.bodyTraits.includes("受傷")) {
        target.bodyTraits.push("受傷");
      }
      // ログ出力
      village.log(`${target.name}受了重傷、脫離戰鬥`);
    }
  }
}

// 戦闘処理の部分を修正
function executeCombatAction(action, village) {
  let rlog = document.getElementById("raidLogArea");
  
  switch(action.type) {
    case "ATTACK": {
      let atk = action.attacker;
      let def = action.defender;
      let dmg = calcDamage(atk, def);
      
      // ダメージ適用を関数化した処理に変更
      applyDamage(def, dmg.damage, village);
      
      rlog.innerHTML += `<br>${atk.name} → ${def.name} : ${dmg.damage}點傷害`;
      if (def.hp <= 0) {
        rlog.innerHTML += `<br>${def.name}失去戰鬥能力！`;
      }
      break;
    }
    // ... 他のケース ...
  }
  
  updateRaidTables(village);
  checkCombatEndOfActions(village);
}

function filterUnusedPortraits(portraitList) {
  if (!portraitList) return [];
  return portraitList.filter(portrait => !usedPortraits.male.has(portrait));
}
