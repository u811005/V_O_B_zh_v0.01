// miracles.js

import { clampValue, round3, getPortraitPath } from "./util.js";
import { addRelationship, removeRelationship, checkHasRelationship, getRelationshipTargetName } from "./relationships.js";
import { updateUI } from "./ui.js";  // 実行後にUIを更新する
import { refreshJobTable } from "./createVillagers.js";

/**
 * 奇蹟リスト
 */
export const MIRACLES = [
  {id:"12", name:"交換の奇蹟(20)", cost:20, desc:"交換2人的身體"},
  {id:"13", name:"交換の奇蹟・強(80)", cost:80, desc:"交換包含村外2人的身體"},
  {id:"1",  name:"豐收の奇蹟(100)", cost:100, desc:"本月的收穫2倍(豐收)"},
  {id:"2",  name:"嗎哪の奇蹟(40)",  cost:40,  desc:"食材+80"},
  {id:"3",  name:"邱比特の奇蹟(80)", cost:80, desc:"強制2人結婚(無視條件)"},
  {id:"4",  name:"宴會の奇蹟(人數×15)", cost:-1, desc:"全員體力/精神+30,幸福+20 (需要消耗資金×人數)"},
  {id:"5",  name:"狂宴の奇蹟(人數×30)", cost:-2, desc:"全員體力/精神+100,幸福+50,道德↓,好色+15"},
  {id:"6",  name:"治癒の奇蹟(80)", cost:80, desc:"1人的受傷/疲勞等回復,體力/精神+50"},
  {id:"7",  name:"戰神の奇蹟(80)", cost:80, desc:"1人受到火星的加護(3個月)"},
  {id:"8",  name:"竈女神の奇蹟(60)", cost:60, desc:"戀人100%結婚(沒有則返回30點)"},
  {id:"9",  name:"常春の奇蹟(300)", cost:300,desc:"村莊特性→春 固定。持續到下個季節"},
  {id:"10", name:"旅人の奇蹟(60)", cost:60, desc:"隨機的訪問者(給予訪問者)"},
  {id:"11", name:"遠行の奇蹟(20)", cost:20, desc:"1人離開→依照幸福獲得魔素"},
  {id:"14", name:"邁達斯の奇蹟(100)", cost:100, desc:"1個月間、以資金取代獲得的食材"}
];

/**
 * 開啟奇蹟模組
 */
export function openMiracleModal(village) {
  if (village.gameOver) {
    village.log("GameOver→奇蹟不可");
    return;
  }
  document.getElementById("modalOverlay").style.display = "block";
  document.getElementById("miracleModal").style.display = "block";

  let sel = document.getElementById("miracleSelect");
  sel.innerHTML="";
  MIRACLES.forEach(m=>{
    let op=document.createElement("option");
    op.value=m.id;
    op.textContent=m.name;
    sel.appendChild(op);
  });
  sel.value="12"; // default: 交換の奇蹟
  onSelectMiracleChange(village);
}

/**
 * 關閉奇蹟模組
 */
export function closeMiracleModal() {
  document.getElementById("modalOverlay").style.display="none";
  document.getElementById("miracleModal").style.display="none";
}

/**
 * 選択した奇蹟に応じて詳細UIを変える
 */
export function onSelectMiracleChange(village) {
  let sel = document.getElementById("miracleSelect");
  let mid = sel.value;
  let info = MIRACLES.find(x=> x.id===mid);

  let div = document.getElementById("miracleOptions");
  div.innerHTML = `<p>${info.desc}</p>`;

  // 特定のIDは対象選択が必要
  if (["3","6","7","11","12","13"].includes(mid)) {
    if (mid==="3"||mid==="12"||mid==="13") {
      div.appendChild(createVillagerSelect("targetA", village));
      div.appendChild(createVillagerSelect("targetB", village));
    } else {
      div.appendChild(createVillagerSelect("targetA", village));
    }
  }
}

function createVillagerSelect(id, village) {
  let sel=document.createElement("select");
  sel.id=id;
  let op0=document.createElement("option");
  op0.value="";
  op0.textContent="(選擇)";
  sel.appendChild(op0);

  // 村人を追加
  village.villagers.forEach(vv=>{
    let opp=document.createElement("option");
    opp.value=vv.name;
    opp.textContent=vv.name;
    sel.appendChild(opp);
  });

  // 訪問者を追加
  village.visitors.forEach(vv=>{
    let opp=document.createElement("option");
    opp.value=vv.name;
    opp.textContent=`${vv.name}(訪問者)`;
    sel.appendChild(opp);
  });

  // 襲擊者を追加
  village.raidEnemies.forEach(vv=>{
    let opp=document.createElement("option");
    opp.value=vv.name;
    opp.textContent=`${vv.name}(襲擊者)`;
    sel.appendChild(opp);
  });

  return sel;
}

/**
 * 奇蹟実行
 */
export function performMiracle(village) {
  let sel=document.getElementById("miracleSelect");
  let mid=sel.value;
  let info=MIRACLES.find(x=>x.id===mid);
  if (!info) return;

  // コスト計算
  let cost = info.cost;
  let vc = village.villagers.length;
  if (cost===-1) {
    // 宴会(人數×15)
    cost = vc * 15;
    if (village.mana<cost || village.funds<cost) {
      village.log(`魔素or資金不足(必要:${cost})`);
      return;
    }
  } else if (cost===-2) {
    // 狂宴(人數×30)
    cost = vc * 30;
    if (village.mana<cost || village.funds<cost) {
      village.log(`魔素or資金不足(必要:${cost})`);
      return;
    }
  } else {
    if (village.mana<cost) {
      village.log(`魔素不足(必要:${cost}, 所持:${village.mana})`);
      return;
    }
  }

  let ta=document.getElementById("targetA");
  let tb=document.getElementById("targetB");
  let vA=null;
  let vB=null;
  if (ta && ta.value) {
    // 村人、訪問者、襲擊者から対象を検索
    vA = village.villagers.find(x=>x.name===ta.value) ||
         village.visitors.find(x=>x.name===ta.value) ||
         village.raidEnemies.find(x=>x.name===ta.value);
  }
  if (tb && tb.value) {
    // 村人、訪問者、襲擊者から対象を検索
    vB = village.villagers.find(x=>x.name===tb.value) ||
         village.visitors.find(x=>x.name===tb.value) ||
         village.raidEnemies.find(x=>x.name===tb.value);
  }

  // 実行
  switch(mid) {
    case "4": // 宴会
      village.mana-=cost;
      village.funds-=cost;
      village.villagers.forEach(p=>{
        p.hp=clampValue(p.hp+30,0,100);
        p.mp=clampValue(p.mp+30,0,100);
        p.happiness=clampValue(p.happiness+20,0,100);
      });
      village.log(`【宴会】全員体力/メンタル+30,幸福+20(費用:${cost})`);
      break;

    case "5": // 狂宴
      village.mana-=cost;
      village.funds-=cost;
      village.villagers.forEach(p=>{
        p.hp=clampValue(p.hp+100,0,100);
        p.mp=clampValue(p.mp+100,0,100);
        p.happiness=clampValue(p.happiness+50,0,100);
        // 狂乱特性を付与（まだ持っていない場合のみ）
        if (!p.mindTraits.includes("狂乱")) {
          p.mindTraits.push("狂乱");
          p.eth=Math.floor(p.eth*0.2);
          p.sexdr=clampValue(p.sexdr+15,0,100);
        }
      });
      village.log(`【狂宴】全員体力/メンタル+100,幸福+50,狂乱付与(倫理*0.2,好色+15)`);
      break;

    default:
      // 通常消費 (消耗mana)
      village.mana-=cost;
      switch(mid) {
        case "1": // 豊穣
          village.villageTraits.push("豐收");
          village.log("【豐收の奇蹟】本月的收穫2倍");
          break;
        case "2": // マナの奇蹟
          village.food=clampValue(village.food+80,0,99999);
          village.log("【嗎哪の奇蹟】食料+80");
          break;
        case "3": // クピド(2人強制結婚)
          if (!vA||!vB||vA===vB) {
            village.log("【邱比特】選擇了2個人");
            village.mana+=cost; // 戻す
            return;
          }
          forceMarriage(vA,vB,village);
          break;
        case "6": // 癒し(1人回復)
          if (!vA) {
            village.log("【治癒】選擇了1個對象");
            village.mana+=cost; 
            return;
          }
          healMiracle(vA,village);
          break;
        case "7": // 戦神(1人)
          if (!vA) {
            village.log("【戰神】選擇了1個對象");
            village.mana+=cost;
            return;
          }
          warMiracle(vA,village);
          break;
        case "8": // 竈女神
          hearthMiracle(village);
          break;
        case "9": // 常春
          let rm=["夏","秋","冬","冷夏","飛蝗","嚴冬","流行病"];
          village.villageTraits=village.villageTraits.filter(x=>!rm.includes(x));
          if (!village.villageTraits.includes("春")) {
            village.villageTraits.push("春");
          }
          village.log("【常春の奇蹟】固定為春天");
          break;
        case "10": // 旅人
          travelerMiracle(village);
          break;
        case "11": // 出立
          if (!vA) {
            village.log("【旅行の奇蹟】選擇了1個對象");
            village.mana+=cost;
            return;
          }
          departureMiracle(vA,village);
          break;
        case "12": // 交換
          if (!vA||!vB||vA===vB) {
            village.log("【交換の奇蹟】必須選擇2人");
            village.mana+=cost;
            return;
          }
          // 通常の交換は村人同士のみ
          if (!village.villagers.includes(vA) || !village.villagers.includes(vB)) {
            village.log("【交換の奇蹟】無法選擇村民以外的對象");
            village.mana+=cost;
            return;
          }
          doExchange(vA,vB,village,false);
          village.log(`【交換の奇蹟】${vA.name}和${vB.name}互換了身體！`);
          
          // 交換専用モーダルを表示
          openExchangeModal(vA, vB);
          break;
        case "13": // 交換(強)
          if (!vA||!vB||vA===vB) {
            village.log("【交換の奇蹟・強】必須選擇2人");
            village.mana+=cost;
            return;
          }
          doExchange(vA,vB,village,false);
          village.log(`【交換の奇蹟・強】${vA.name}和${vB.name}互換了身體！`);
          
          // 交換専用モーダルを表示
          openExchangeModal(vA, vB);
          break;
        case "14": // ミダスの奇蹟
          village.mana -= cost;
          if (!village.villageTraits.includes("邁達斯")) {
            village.villageTraits.push("邁達斯");
          }
          village.log("【邁達斯の奇蹟】1個月間、獲得食材的行動會獲得資金");
          break;
      }
      break;
  }

  updateUI(village);
  closeMiracleModal();
}

/** クピド: 強制結婚 */
function forceMarriage(a,b,v) {
  removeRelationship(a,`戀人:${b.name}`);
  removeRelationship(b,`戀人:${a.name}`);
  addRelationship(a,"已婚");
  addRelationship(b,"已婚");
  a.happiness=clampValue(a.happiness+50,0,100);
  b.happiness=clampValue(b.happiness+50,0,100);

  if (a.spiritSex==="男") addRelationship(a,`夫:${b.name}`);
  else if (a.spiritSex==="女") addRelationship(a,`妻:${b.name}`);
  if (b.spiritSex==="男") addRelationship(b,`夫:${a.name}`);
  else if (b.spiritSex==="女") addRelationship(b,`妻:${a.name}`);

  v.log(`【邱比特の奇蹟】強制${a.name}和${b.name}結婚`);
}

/** 癒し: 負傷など回復 */
function healMiracle(p,v) {
  p.hp=clampValue(p.hp+50,0,100);
  p.mp=clampValue(p.mp+50,0,100);

  let arr=["受傷","疲勞","過勞","飢餓","心累","抑鬱"];
  let recoveredTraits = [];

  // 身体特性からの状態異常回復
  arr.forEach(trait => {
    if (p.bodyTraits.includes(trait)) {
      recoveredTraits.push(trait);
      p.bodyTraits = p.bodyTraits.filter(t => t !== trait);
      
      // ステータス回復
      switch(trait) {
        case "飢餓":
          p.str = round3(p.str / 0.5);  // 50%から回復
          p.vit = round3(p.vit / 0.5);
          p.dex = round3(p.dex / 0.5);
          break;
        case "疲勞":
          p.str = round3(p.str / 0.8);  // 80%から回復
          p.vit = round3(p.vit / 0.8);
          p.dex = round3(p.dex / 0.8);
          break;
        case "過勞":
          p.str = round3(p.str / 0.25);  // 25%から回復
          p.vit = round3(p.vit / 0.25);
          p.dex = round3(p.dex / 0.25);
          break;
      }
    }
  });

  // 精神特性からの状態異常回復
  arr.forEach(trait => {
    if (p.mindTraits.includes(trait)) {
      recoveredTraits.push(trait);
      p.mindTraits = p.mindTraits.filter(t => t !== trait);
      
      // ステータス回復
      switch(trait) {
        case "心累":
          p.int = round3(p.int / 0.8);  // 80%から回復
          p.cou = round3(p.cou / 0.8);
          p.ind = round3(p.ind / 0.8);
          p.eth = round3(p.eth / 0.8);
          p.sexdr = round3(p.sexdr / 0.8);
          break;
        case "抑鬱":
          p.int = round3(p.int / 0.25);  // 25%から回復
          p.cou = round3(p.cou / 0.25);
          p.ind = round3(p.ind / 0.25);
          p.eth = round3(p.eth / 0.25);
          p.sexdr = round3(p.sexdr / 0.25);
          break;
      }
    }
  });

  let recoveryMsg = recoveredTraits.length > 0 ? 
    `${recoveredTraits.join(",")}回復,` : "";
  v.log(`【治癒の奇蹟】${p.name}${recoveryMsg}體力/精神+50`);
}

/** 戰神(戦神の加護) */
function warMiracle(p, v) {
  // 戦神の奇蹟の開始時に、アレス変数を初期化
  p.ares = 0;
  v.log(`【戰神の奇蹟】給予${p.name}火星的加護(力量・耐力・勇氣1.6倍、智力・勤奮・道德0.2倍) 持續3個月`);
  p.bodyTraits.push("火星的加護");
  // 筋力・耐久・勇気は1.6倍に、知力・勤勉・倫理は0.2倍に変更し、round3で丸める
  p.str = round3(p.str * 1.6);
  p.vit = round3(p.vit * 1.6);
  p.cou = round3(p.cou * 1.6);
  p.int = round3(p.int * 0.2);
  p.eth = round3(p.eth * 0.2);
  p.ind = round3(p.ind * 0.2);
}

/** 竈女神(恋人を結婚100%) */
function hearthMiracle(v) {
  let c=v.villagers.filter(x=> x.spiritAge>=18 && checkHasRelationship(x,"戀人") && !checkHasRelationship(x,"已婚"));
  if (c.length===0) {
    v.log("【竈女神の奇蹟】沒有可以結婚的戀人→返還30魔素");
    v.mana=clampValue(v.mana+30,0,99999);
    return;
  }
  let done=[];
  c.forEach(a=>{
    if (!done.includes(a)) {
      let bName=getRelationshipTargetName(a,"戀人");
      if (bName) {
        let b=v.villagers.find(xx=>xx.name===bName);
        if (b && !done.includes(b) && !checkHasRelationship(a,"已婚") && !checkHasRelationship(b,"已婚")) {
          removeRelationship(a,`戀人:${b.name}`);
          removeRelationship(b,`戀人:${a.name}`);
          addRelationship(a,"已婚");
          addRelationship(b,"已婚");
          a.happiness=clampValue(a.happiness+50,0,100);
          b.happiness=clampValue(b.happiness+50,0,100);

          if (a.spiritSex==="男") addRelationship(a,`夫:${b.name}`);
          else if (a.spiritSex==="女") addRelationship(a,`妻:${b.name}`);
          if (b.spiritSex==="男") addRelationship(b,`夫:${a.name}`);
          else if (b.spiritSex==="女") addRelationship(b,`妻:${a.name}`);

          v.log(`【竈女神の奇蹟】${a.name}和${b.name}100%結婚`);
          done.push(a,b);
        }
      }
    }
  });
}

/** 旅人の奇蹟(1名来訪) */
import { createRandomVillager, createRandomVisitor } from "./createVillagers.js";
function travelerMiracle(v) {
  // let newV = createRandomVillager();
  let newV = createRandomVisitor();
  v.log(`【旅人の奇蹟】${newV.name}來了(訪問者)`);
  v.villageTraits.push("訪問者");
  // ★ここでは村に追加するか不明(訪問のみ?)
  // もし本当に村に加えるなら: v.villagers.push(newV); など
  v.visitors.push(newV)
}

/** 出立の奇蹟(対象を離脱→幸福度分魔素取得) */
function departureMiracle(p,v) {
  let bonus = p.happiness;
  v.mana=clampValue(v.mana+bonus,0,99999);
  v.log(`【遠行の奇蹟】${p.name}離開了,魔素+${bonus}`);
  let idx=v.villagers.indexOf(p);
  if (idx>=0) {
    v.villagers.splice(idx,1);
  }
}

/**
 * 肉体交換(雷/奇蹟)
 */
export function doExchange(a, b, v, isLightning) {
  // 交換されるパラメータ（肉体に関連する要素）
  let exchangeParams = {
    // 基本情報
    bodySex: a.bodySex,
    bodyAge: a.bodyAge,
    bodyOwner: a.bodyOwner,
    race: a.race,  // 種族も交換
    portraitFile: a.portraitFile,  // 顔グラフィック情報を追加
    raiderPortrait: a.raiderPortrait, // 襲擊者用の顔グラフィック
    visitorPortrait: a.visitorPortrait, // 訪問者用の顔グラフィック

    // 肉体パラメータ
    hp: a.hp,
    str: a.str,
    vit: a.vit,
    dex: a.dex,
    mag: a.mag,
    chr: a.chr,

    // 肉体特性
    bodyTraits: [...a.bodyTraits]
  };

  // Aの肉体パラメータをBのものに
  a.bodySex = b.bodySex;
  a.bodyAge = b.bodyAge;
  a.bodyOwner = b.bodyOwner;
  a.race = b.race;
  a.portraitFile = b.portraitFile;  // 顔グラフィック情報を交換
  a.raiderPortrait = b.raiderPortrait; // 襲擊者用の顔グラフィック
  a.visitorPortrait = b.visitorPortrait; // 訪問者用の顔グラフィック
  a.hp = b.hp;
  a.str = b.str;
  a.vit = b.vit;
  a.dex = b.dex;
  a.mag = b.mag;
  a.chr = b.chr;
  a.bodyTraits = [...b.bodyTraits];

  // Bの肉体パラメータをAのものに（一時保存したもの）
  b.bodySex = exchangeParams.bodySex;
  b.bodyAge = exchangeParams.bodyAge;
  b.bodyOwner = exchangeParams.bodyOwner;
  b.race = exchangeParams.race;
  b.portraitFile = exchangeParams.portraitFile;  // 顔グラフィック情報を交換
  b.raiderPortrait = exchangeParams.raiderPortrait; // 襲擊者用の顔グラフィック
  b.visitorPortrait = exchangeParams.visitorPortrait; // 訪問者用の顔グラフィック
  b.hp = exchangeParams.hp;
  b.str = exchangeParams.str;
  b.vit = exchangeParams.vit;
  b.dex = exchangeParams.dex;
  b.mag = exchangeParams.mag;
  b.chr = exchangeParams.chr;
  b.bodyTraits = [...exchangeParams.bodyTraits];

  // 交換後に両者の仕事テーブルを更新
  refreshJobTable(a);
  refreshJobTable(b);
  
  // 現在の仕事と行動が新しいテーブルに含まれていない場合は「なし」に
  if (!a.jobTable.includes(a.job)) a.job = "無";
  if (!a.actionTable.includes(a.action)) a.action = a.job;
  if (!b.jobTable.includes(b.job)) b.job = "無";
  if (!b.actionTable.includes(b.action)) b.action = b.job;

  // 交換のログ出力（雷の場合は簡略化）
  if (!isLightning) {
    v.log(`【交換の奇蹟】${a.name}和${b.name}互換了身體！`);
  }
}

/**
 * 交換の奇蹟モーダルを開く
 */
function openExchangeModal(personA, personB) {
  const overlay = document.getElementById("exchangeOverlay");
  const modal = document.getElementById("exchangeModal");
  const portraitA = document.getElementById("exchangePortraitA");
  const portraitB = document.getElementById("exchangePortraitB");
  const textA = document.getElementById("exchangeTextA");
  const textB = document.getElementById("exchangeTextB");
  
  if (!overlay || !modal || !portraitA || !portraitB || !textA || !textB) return;
  
  // 顔グラフィックを設定（エラーハンドリング付き）
  try {
    // 共通関数を使用して顔グラフィックのパスを取得
    // 注意: 交換後の状態を表示するため、personAの体はpersonBの顔グラフィックを表示
    portraitA.src = getPortraitPath(personA);
    portraitA.onerror = () => {
      console.error(`Portrait image not found: ${portraitA.src}`);
      portraitA.src = 'images/portraits/default.png';
    };
    
    // 同様に、personBの体はpersonAの顔グラフィックを表示
    portraitB.src = getPortraitPath(personB);
    portraitB.onerror = () => {
      console.error(`Portrait image not found: ${portraitB.src}`);
      portraitB.src = 'images/portraits/default.png';
    };
  } catch (error) {
    console.error('Error loading portraits:', error);
    portraitA.src = 'images/portraits/default.png';
    portraitB.src = 'images/portraits/default.png';
  }
  
  // 口調タイプの決定を修正
  const getSpeechType = (person) => {
    // 襲擊者の場合は襲擊者タイプを使用
    if (person.mindTraits && person.mindTraits.includes("襲擊者")) {
      // 名前から襲擊者タイプを抽出
      const raiderTypes = ["山賊", "哥布林", "狼", "獨眼巨魔", "哈比"];
      for (const type of raiderTypes) {
        if (person.name.includes(type)) {
          return type;
        }
      }
    }
    // 通常のキャラクターは既存の口調を使用
    return person.speechType || (person.bodySex === "男" ? "普通Ｍ" : "普通Ｆ");
  };

  const speechTypeA = getSpeechType(personA);
  const speechTypeB = getSpeechType(personB);
  
  // 入れ替わり時のセリフをランダムに選択
  const getRandomLine = (patterns, type) => {
    const lines = patterns[type] || patterns[personA.bodySex === "男" ? "普通Ｍ" : "普通Ｆ"];
    return lines[Math.floor(Math.random() * lines.length)];
  };
  
  // 会話テキストを設定
  textA.innerHTML = `
    <p><strong>${personA.name}:</strong> ${getRandomLine(EXCHANGE_SPEECH_PATTERNS, speechTypeA)}</p>
    <p><small>身體的主人: ${personB.name}</small></p>
  `;
  
  textB.innerHTML = `
    <p><strong>${personB.name}:</strong> ${getRandomLine(EXCHANGE_SPEECH_PATTERNS, speechTypeB)}</p>
    <p><small>身體的主人: ${personA.name}</small></p>
  `;
  
  overlay.style.display = "block";
  modal.style.display = "block";
}

/**
 * 交換の奇蹟モーダルを閉じる
 */
export function closeExchangeModal() {
  const overlay = document.getElementById("exchangeOverlay");
  const modal = document.getElementById("exchangeModal");
  
  if (overlay) overlay.style.display = "none";
  if (modal) modal.style.display = "none";
}

/**
 * 交換の奇蹟実行時のセリフパターン
 */
const EXCHANGE_SPEECH_PATTERNS = {
  "普通Ｍ": [
    "這是什麼……這真的是我的身體嗎？",
    "身體竟然互換了！該怎麼辦……",
    "沒想到真的會交換……該如怎麼辦才好……"
  ],
  "丁寧Ｍ": [
    "這……看來我的身體好像互換了。真是個大狀麻煩呢。",
    "身體竟然互換了……我還沒做好心理準備呀。",
    "這到底是怎麼一回事？ 我很困惑。"
  ],
  "強気Ｍ": [
    "喂、喂，發生什麼事了？老子的身體在哪裡！",
    "該死的，竟然真的互換了！不過，這也是種經驗啊！",
    "哼，這副身體也不賴！很快就會適應了！"
  ],
  "乱暴": [
    "別跟我開玩笑了！老子原本的身體還來！這種身體真是太糟糕了！",
    "他媽的！到底發生什麼了！這副身體是什麼鬼！",
    "開什麼玩笑！是誰幹的這種事！"
  ],
  "お調子者": [
    "哇——！真的交換了耶！真是有趣～",
    "這不是夢吧？太厲害了！會變成什麼樣呢～",
    "新的身體，看起來不錯耶！讓我好好享受一下～"
  ],
  "陰気": [
    "發……什麼……怎麼了……",
    "身體變了...到底...該怎麼辦...",
    "這...夢...是嗎..."
  ],
  "クールＭ": [
    "嗯，看來交換已經成立了。真是一個有趣的現象。",
    "有意思，試著看看用這副身體能做些什麼吧。",
    "身體交換啊。嗯，也不是無法應付的狀況。"
  ],

  "普通Ｆ": [
    "阿啦……這不是我的身體！到底怎麼回事？",
    "身體竟然互換了？真是難以置信……",
    "這就是交換的奇蹟……發生的事遠超我的想像……"
  ],
  "丁寧Ｆ": [
    "嗯……這真令人吃驚。身體竟然交換了。",
    "該怎麼辦呢，身體變得不一樣了，看來需要一段時間適應。",
    "這完全是出乎意料的狀況。究竟該如何應對呢……"
  ],
  "お嬢様": [
    "哎呀！這到底是怎麼回事？這絕對不是我的身體跌絲襪！",
    "真是不可思議……竟然會交換身體……人家毫無心理準備跌絲襪。",
    "這不是在作夢吧？真的在現實中發生了跌絲襪。"
  ],
  "快活": [
    "哇——真的交換了耶！太厲害了！",
    "新的身體到手了！會是什麼感覺呢？真讓人心跳加速！",
    "沒想到竟然會真的發生這種事……"
  ],
  "内気": [
    "啊...那個...我的...身體...不一樣了...該、該怎麼辦才好...",
    "這、這不是...我的身體...好可怕...",
    "有人...請幫幫我...回到原來的狀態..."
  ],
  "強気Ｆ": [
    "這是什麼？真的交換了嗎？挺有趣的嘛！",
    "哼，這點小事絕不會讓我慌張！我很快就能適應的！",
    "真是出乎意料……得想辦法好好駕馭這副身體。"
  ],
  "蓮っ葉": [
    "等一下！你看看，真的交換了身體！這到底是怎麼回事？",
    "哇～，這就是交換的奇蹟？不會是在開玩笑吧～？",
    "新的身體啊～嗯，感覺還不錯呢～。來好好享受一下吧～"
  ],
  "おっとり": [
    "啊啦……這真讓人吃驚。身體竟然交換了呢。",
    "該怎麼辦呢……是不是應該平靜接受呢……真讓人困惑。",
    "雖然這是一件意外的事……但肯定是有它的意義……"
  ],
  "クールＦ": [
    "正如預料的一樣。只需冷靜應對即可。",
    "交換已經完成了。現在需要仔細分析這種狀況。",
    "真是個有趣的現象。得弄清楚這副身體的特性才行。"
  ],
  "ぶりっこ": [
    "哎呀！身體變了呢～！該怎麼辦呢～？",
    "這真的交換了嗎～？真讓人難以置信～♪",
    "新的身體到手啦～。會是什麼感覺呢～？好緊張呢～♪"
  ],
  "中性": [
    "看來……身體好像交換了。感覺真奇妙。",
    "沒想到真的會交換……得好好想想怎麼應對。",
    "新的身體，看來需要一段時間來適應呢。"
  ],
  "ギャル風": [
    " 真嘟假嘟！？身體換了耶！超酷的吧？",
    "哇～！這不是身體換互嗎！？難以置信～！",
    "新的身體到手了！來試試看感覺如何吧！"
  ],
  // 襲擊者用的模式
  "山賊": [
    "該死，這副身體是什麼爛東西！根本沒法作戰！",
    "喂，到底發生什麼事了！把我原來的身體還來！",
    "切，就算是這副身體，襲擊也會繼續下去！"
  ],
  "哥布林": [
    "哥布哥布！身體變了布！",
    "嘿嘿！換到一副有趣的身體了！",
    "就算是這副身體，也能打敗人類！"
  ],
  "狼": [
    "嗚嚕……（身體變了……）",
    "嗚嗚……（這的身體狩獵真不方便……）",
    "嗷嗚！（但獵物絕不會放過！）"
  ],
  "獨眼巨魔": [
    "什麼！？這麼小的身體根本發不出力量！",
    "我的巨體去哪了！把它還來！",
    "就算是這副身體，我也要把一切踩在腳下！"
  ],
  "哈比": [
    "哎呀，用這副身體根本飛不起來！",
    "我的美麗翅膀到底去哪了！？",
    "就算這樣，我也會襲擊那個村莊！"
  ]
};

