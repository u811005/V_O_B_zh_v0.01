// events.js

import { randInt, clampValue, round3 } from "./util.js";
import { doLoverCheck, doMarriageCheck } from "./relationships.js";
import { createRandomVillager, createRandomVisitor} from "./createVillagers.js";
import { startRaidEvent } from "./raid.js";
import { theVillage } from "./main.js";
import { addRelationship} from "./relationships.js";


/**
 * 固定イベント(前半) - 新年祭など
 */
export function doFixedEventPre(village) {
  if (village.month===1 && !village.hasDonePreEvent) {
    newYearFestival(village);
    village.hasDonePreEvent = true;
  }
}

/**
 * 固定イベント(後半) - 復活祭,夏至祭,収穫祭,星霜祭など
 */
export function doFixedEventPost(village) {
  if (!village.hasDonePostEvent) {
    switch(village.month) {
      case 3:
        resurrectionFestival(village);
        village.hasDonePostEvent=true;
        break;
      case 6:
        summerSolsticeFestival(village);
        village.hasDonePostEvent=true;
        break;
      case 10:
        harvestFestival(village);
        village.hasDonePostEvent=true;
        break;
      case 12:
        starsFestival(village);
        village.hasDonePostEvent=true;
        break;
    }
  }
}

// -------------------------
// 各祭り
// -------------------------
function newYearFestival(v) {
  v.log("【新年祭】體力+20,精神+20,幸福+20-30 全員");
  v.villagers.forEach(p=>{
    p.hp=clampValue(p.hp+20,0,100);
    p.mp=clampValue(p.mp+20,0,100);
    let inc=randInt(20,30);
    p.happiness=clampValue(p.happiness+inc,0,100);
  });
}

function resurrectionFestival(v) {
  v.log("【復活祭】體力+20,精神+20 +追加魔素");
  v.villagers.forEach(p=>{
    p.hp=clampValue(p.hp+20,0,100);
    p.mp=clampValue(p.mp+20,0,100);
  });
  let total=0;
  v.villagers.forEach(p=>{
    let amt=10*(p.happiness/100);
    total+=amt;
  });
  let g=Math.floor(total);
  v.mana=clampValue(v.mana+g,0,99999);
  v.log(`復活祭:魔素+${g}`);
}

function summerSolsticeFestival(v) {
  v.log("【夏至祭】體力+20,精神+20,幸福+20-30 +結婚判定");
  v.villagers.forEach(p=>{
    p.hp=clampValue(p.hp+20,0,100);
    p.mp=clampValue(p.mp+20,0,100);
    let inc=randInt(20,30);
    p.happiness=clampValue(p.happiness+inc,0,100);
  });
  doMarriageCheck(v);
}

function harvestFestival(v) {
  v.log("【収穫祭】全員體力+40,精神+20");
  v.villagers.forEach(p=>{
    p.hp=clampValue(p.hp+40,0,100);
    p.mp=clampValue(p.mp+20,0,100);
  });
}

function starsFestival(v) {
  v.log("【星霜祭】體力+20,精神+20 +追加魔素 +戀人判定");
  v.villagers.forEach(p=>{
    p.hp=clampValue(p.hp+20,0,100);
    p.mp=clampValue(p.mp+20,0,100);
  });
  let total=0;
  v.villagers.forEach(p=>{
    let amt=10*(p.happiness/100);
    total+=amt;
  });
  let g=Math.floor(total);
  v.mana=clampValue(v.mana+g,0,99999);
  v.log(`星霜祭:魔素+${g}`);
  doLoverCheck(v);
}

// -------------------------
// ランダムイベント
// -------------------------
export function doRandomEventPre(village) {
  doRandomEventMain(village, "前");
}
export function doRandomEventPost(village) {
  doRandomEventMain(village, "後");
}

function doRandomEventMain(v, phase) {
  let r=randInt(1,100);
  if (r<=1) {
    doMythicEvent(v);
  } else if (r<=25) {
    doGoodEvent(v);
  } else if (r<=40) {
    doBadEvent(v);
  } else {
    v.log(`[${phase}事件] 無事發生`);
  }
}

// --- ミシック(1%)
function doMythicEvent(v) {
  let cands=[];
  v.villagers.forEach(p=>{
    if (p.bodySex==="女" && p.bodyAge>=16 && p.bodyAge<=25 && p.sexdr<=5) {
      cands.push({type:"狩獵神", vill:p});
    }
    if (p.bodySex==="女" && p.bodyAge>=16 && p.bodyAge<=25 && p.chr>=25) {
      cands.push({type:"太陽神", vill:p});
    }
    if (p.bodySex==="女" && p.bodyAge>=16 && p.bodyAge<=28 && p.cou>=20 && p.int>=20) {
      cands.push({type:"戦女神", vill:p});
    }
    if (p.bodySex==="女" && p.bodyAge>=16 && p.bodyAge<=28 && p.ind>=20 && p.eth>=20) {
      cands.push({type:"地母神", vill:p});
    }
  });
  if (cands.length===0) {
    v.log("ミシックイベ:沒有目標");
    return;
  }
  let c = randChoice(cands);
  let p = c.vill;
  switch(c.type) {
    case "狩獵神":
      p.bodyTraits.push("月の巫女");
      p.dex+=10; p.chr+=10;
      v.log(`${p.name}は狩女神の祝福を受けた！(器用+10,魅力+10)`);
      break;
    case "太陽神":
      p.bodyTraits.push("太陽の巫女");
      p.str+=15; p.chr+=5;
      v.log(`${p.name}は太陽神の寵愛を受けた！(筋力+15,魅力+5)`);
      break;
    case "戦女神":
      p.bodyTraits.push("梟の巫女");
      p.mag+=10; p.chr+=10;
      v.log(`${p.name}は戦女神の啓示を受けた！(魔力+10,魅力+10)`);
      break;
    case "地母神":
      p.bodyTraits.push("大地の巫女");
      p.vit+=10; p.chr+=10;
      v.log(`${p.name}は地母神の慈愛を受けた！(耐久+10,魅力+10)`);
      break;
  }
}

// --- グッド(24%)
function doGoodEvent(v) {
  let pool=["cat","gold","strangeRain","fireworks","menFriendship","lover"];
  let ev=randChoice(pool);
  switch(ev) {
    case "cat": {
      if (v.villagers.length>0) {
        let t=randChoice(v.villagers);
        let inc=randInt(20,30);
        t.happiness=clampValue(t.happiness+inc,0,100);
        v.log(`小貓事件:${t.name}幸福+${inc}`);
      }
      break;
    }
    case "gold": {
      let amt=randInt(50,100);
      v.funds=clampValue(v.funds+amt,0,99999);
      v.log(`發現金幣:資金+${amt}`);
      break;
    }
    case "strangeRain": {
      let amt=randInt(10,60);
      v.food=clampValue(v.food+amt,0,99999);
      v.log(`天空降下了魚:食材+${amt}`);
      break;
    }
    case "fireworks": {
      let inc=randInt(5,10);
      v.villagers.forEach(p=>{
        p.happiness=clampValue(p.happiness+inc,0,100);
      });
      v.log(`煙火師來訪:村民全體幸福+${inc}`);
      break;
    }
    case "menFriendship": {
      let men=v.villagers.filter(x=> x.spiritSex==="男" && x.bodyAge>=16);
      if (men.length>=2) {
        let m1=randChoice(men);
        let m2=randChoice(men.filter(x=>x!==m1));
        let incc=randInt(10,15);
        m1.happiness=clampValue(m1.happiness+incc,0,100);
        m2.happiness=clampValue(m2.happiness+incc,0,100);
        addRelationship(m1,`親友:${m2.name}`);
        addRelationship(m2,`親友:${m1.name}`);
        v.log(`男人的友情:${m1.name}和${m2.name}透過酒增進了友情。幸福+${incc}`);
      } else {
        v.log("男人的友情:沒有目標(2名男性以上)");
      }
      break;
    }
    case "lover": {
      doLoverCheck(v);
      break;
    }
  }
}

// --- バッド(15%)
function doBadEvent(v) {
  let pool=["storm","downpour","heat","fire","thief","rats","lightning1","lightning2","snow"];
  let ev=randChoice(pool);
  switch(ev) {
    case "storm": {
      let loss=Math.floor(v.food*0.1);
      v.food=clampValue(v.food-loss,0,99999);
      v.log(`春嵐:食材-${loss}`);
      break;
    }
    case "downpour": {
      let loss=Math.floor(v.food*0.1);
      v.food=clampValue(v.food-loss,0,99999);
      v.log(`豪雨:食材-${loss}`);
      break;
    }
    case "heat": {
      v.villagers.forEach(p=>{
        p.hp=clampValue(p.hp-10,0,100);
      });
      v.log("酷暑:全員體力-10");
      break;
    }
    case "fire": {
      let loss=Math.floor(v.materials*0.1);
      v.materials=clampValue(v.materials-loss,0,99999);
      v.log(`火災:建材-${loss}`);
      break;
    }
    case "thief": {
      let loss=Math.floor(v.funds*0.1);
      v.funds=clampValue(v.funds-loss,0,99999);
      v.security=clampValue(v.security-5,0,100);
      v.log(`到賊團:資金-${loss},治安-5`);
      break;
    }
    case "rats": {
      let loss=Math.floor(v.food*0.3);
      v.food=clampValue(v.food-loss,0,99999);
      v.log(`老鼠大量發生:食材-${loss}`);
      break;
    }
    case "lightning1": {
      if (v.villagers.length>0) {
        let t=randChoice(v.villagers);
        t.hp=clampValue(t.hp-50,0,100);
        t.bodyTraits.push("受傷");
        v.log(`落雷1:${t.name}體力-50,受傷`);
      }
      break;
    }
    case "lightning2": {
      if (v.villagers.length>=2) {
        let a=randChoice(v.villagers);
        let b=randChoice(v.villagers.filter(x=>x!==a));
        doExchange(a,b,v,true);
        v.log(`落雷2:${a.name}和${b.name}互換了身體`);
      }
      break;
    }
    case "snow": {
      v.villagers.forEach(p=>{
        p.hp=clampValue(p.hp-5,0,100);
        p.mp=clampValue(p.mp-5,0,100);
      });
      v.log("大雪:全員體力-5,精神-5");
      break;
    }
  }
}

// -------------------------
// 月末処理
// -------------------------
export function endOfMonthProcess(v) {
  v.log("【月末處理】");



  let totalF=0;
  let totalMat=0;
  let isWinter = v.villageTraits.includes("冬");

  v.villagers.forEach(p=>{
    let cost=10;
    if (p.mindTraits.includes("大食")) cost=12;
    if (p.mindTraits.includes("小食"))  cost=8;
    totalF+=cost;

    if (isWinter) {
      totalMat+=10;
    }
  });
  v.food=clampValue(v.food - totalF,0,99999);
  v.materials=clampValue(v.materials - totalMat,0,99999);

  if (totalF>0) v.log(`食材-${totalF}`);
  if (totalMat>0) v.log(`建材-${totalMat}`);

  let removeList=["豐收","訪問者","襲擊者","邁達斯"];
  // "襲擊中" はここでは消さない(raid.js 内で完了時に消す)
  v.villageTraits = v.villageTraits.filter(tr=> !removeList.includes(tr));

  // 狂乱の解除処理を最初に行う
  v.villagers.forEach(p => {
    if (p.mindTraits.includes("狂乱")) {
      p.mindTraits = p.mindTraits.filter(t => t !== "狂乱");
      // 倫理値と好色値を元に戻す
      p.eth = round3(p.eth / 0.2);
      p.sexdr = clampValue(p.sexdr - 15, 0, 100);  // 加算した15を引く
      v.log(`${p.name}的狂乱解除了`);
    }
  });

  // 火星の加護の効果期間更新 (3ヶ月経過した場合、効果を終了)
  v.villagers.forEach(p => {
    if (p.bodyTraits.includes("火星的加護")) {
      if (typeof p.ares !== 'number') {
         p.ares = 0;
      }
      p.ares++;
      if (p.ares >= 3) {
         // 3ヶ月経過したら、効果を終了
         p.bodyTraits = p.bodyTraits.filter(trait => trait !== "火星的加護");
         // 効果を元に戻す（付与時の逆の計算を行う）
         p.str = round3(p.str / 1.6);
         p.vit = round3(p.vit / 1.6);
         p.cou = round3(p.cou / 1.6);
         p.int = round3(p.int / 0.2);
         p.eth = round3(p.eth / 0.2);
         p.ind = round3(p.ind / 0.2);
         p.ares = 0;
         v.log(`【戰神の奇跡】結束 ${p.name}火星的加護已失效`);
      }
    }
  });

  // 状態異常の解除処理
  v.villagers.forEach(p => {
    // 身体特性からの状態異常解除
    let bodyTraitsToRemove = ["飢餓", "結凍", "疲勞", "過勞", "生病", "産褥"];
    bodyTraitsToRemove.forEach(trait => {
      if (p.bodyTraits.includes(trait)) {
        // 特性を解除
        p.bodyTraits = p.bodyTraits.filter(t => t !== trait);
        
        // ステータス回復
        switch(trait) {
          case "飢餓":
            p.str = round3(p.str / 0.5);  // 50%から回復
            p.vit = round3(p.vit / 0.5);
            p.dex = round3(p.dex / 0.5);
                        break;
          case "結凍":
            p.str = round3(p.str / 0.8);  // 80%から回復
            p.vit = round3(p.vit / 0.8);
            p.dex = round3(p.dex / 0.8);
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
          default:
            
        }
      }
    });

    // 精神特性からの状態異常解除
    let mindTraitsToRemove = ["心累", "抑鬱"];
    mindTraitsToRemove.forEach(trait => {
      if (p.mindTraits.includes(trait)) {
        // 特性を解除
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
  });

  // ログ出力を元に戻す処理を削除
  // v.log = originalLog;

  // 月末サマリーモーダルを表示する処理を削除
  // showMonthEndSummary(monthEndLogs);
}

/**
 * 月初処理
 *  - 魔素増加(幸福度ベース)
 *  - 食料/資材0時のペナルティ
 *  - 幸福度調整
 *  - jobTable再構築
 *  - 襲擊判定
 */
export function doMonthStartProcess(v) {
  v.log("【月初處理】");

  // 幸福度由来の魔素増加
  let tot=0;
  v.villagers.forEach(p=>{
    let amt=10*(p.happiness/100);
    tot+=amt;
  });
  let gain=Math.floor(tot);
  v.mana=clampValue(v.mana+gain,0,99999);
  v.log(`魔素+${gain}(來自村民的幸福度)`);

  // 食料/資材0のペナルティ
  if (v.food<=0) {
    v.log("食材0→發生飢餓");
    v.villagers.forEach(p=>{
      // 飢餓の身体特性を付与（まだ持っていない場合のみ）
      if (!p.bodyTraits.includes("飢餓")) {
        p.bodyTraits.push("飢餓");
      }
      
      // 各種ステータスにペナルティ
      p.str = round3(p.str * 0.5);  // 筋力を50%に
      p.vit = round3(p.vit * 0.5);  // 耐久を50%に
      p.dex = round3(p.dex * 0.5);  // 器用を50%に
      p.hp = Math.floor(p.hp * 0.5);  // 体力を50%に
      p.mp = Math.floor(p.mp * 0.5);  // メンタルを50%に
      p.happiness = clampValue(p.happiness - 30, 0, 100);  // 幸福度-30
    });
  }
  if (v.villageTraits.includes("冬") && v.materials<=0) {
    v.log("冬天建材0→結凍");
    v.villagers.forEach(p=>{
      // 結凍の身体特性を付与（まだ持っていない場合のみ）
      if (!p.bodyTraits.includes("結凍")) {
        p.bodyTraits.push("結凍");
      }
      
      // 各種ステータスにペナルティ
      p.str = round3(p.str * 0.8);  // 筋力を80%に
      p.vit = round3(p.vit * 0.8);  // 耐久を80%に
      p.dex = round3(p.dex * 0.8);  // 器用を80%に
      p.hp = Math.floor(p.hp * 0.5);  // 体力を50%に
      p.mp = Math.floor(p.mp * 0.5);  // メンタルを50%に
      p.happiness = clampValue(p.happiness - 30, 0, 100);  // 幸福度-30
    });
  }


  // 体力・メンタル状態によるペナルティ
  v.villagers.forEach(p => {
    // 体力に関するペナルティ
    if (p.hp <= 0) {
      // 過勞状態
      if (!p.bodyTraits.includes("過勞")) {
        p.bodyTraits.push("過勞");
      }
      p.str = round3(p.str * 0.25);
      p.vit = round3(p.vit * 0.25);
      p.dex = round3(p.dex * 0.25);
      p.happiness = clampValue(p.happiness - 30, 0, 100);
      

      v.log(`${p.name}正處於過勞狀態`);
    } else if (p.hp <= 33) {
      // 疲勞状態
      if (!p.bodyTraits.includes("疲勞")) {
        p.bodyTraits.push("疲勞");
      }
      p.str = round3(p.str * 0.8);
      p.vit = round3(p.vit * 0.8);
      p.dex = round3(p.dex * 0.8);
      v.log(`${p.name}正處於疲勞狀態`);
    }
    
    // メンタルに関するペナルティ
    if (p.mp <= 0) {
      // 抑鬱状態
      if (!p.mindTraits.includes("抑鬱")) {
        p.mindTraits.push("抑鬱");
      }
      p.int = round3(p.int * 0.25);
      p.cou = round3(p.cou * 0.25);
      p.ind = round3(p.ind * 0.25);
      p.eth = round3(p.eth * 0.25);
      p.sexdr = round3(p.sexdr * 0.25);
      p.happiness = clampValue(p.happiness - 30, 0, 100);


      v.log(`${p.name}正處於抑鬱狀態`);
    } else if (p.mp <= 33) {
      // 心累状態
      if (!p.mindTraits.includes("心累")) {
        p.mindTraits.push("心累");
      }
      p.int = round3(p.int * 0.8);
      p.cou = round3(p.cou * 0.8);
      p.ind = round3(p.ind * 0.8);
      p.eth = round3(p.eth * 0.8);
      p.sexdr = round3(p.sexdr * 0.8);
      v.log(`${p.name}正處於心累狀態`);
    }
  });
  // 幸福度調整
  v.villagers.forEach(p=>{
    if (p.happiness>50) {
      let diff = p.happiness-50;
      let dec = Math.floor(diff * randFloat(0.2,0.4));
      p.happiness=clampValue(p.happiness-dec,0,100);
    }
  });
  // 既存の訪問者をクリア
  v.visitors = [];

  // 50%の確率で訪問者を生成
  if (Math.random() < 0.5) {
    let visitor = createRandomVisitor();
    v.visitors.push(visitor);
    v.log(`訪問者 ${visitor.name} 來到了村莊`);
  }



  // 既に"襲擊中"でなければ、20%で襲擊開始
  if (!v.villageTraits.includes("襲擊中")) {
    if (Math.random()<0.2) {
      startRaidEvent(v);
    }
  }

  // 全村人の行動テーブルを再構築
  v.villagers.forEach(p=>{
    let currentJob = p.job;     // 現在のjobを保存
    let currentAction = p.action; // 現在のactionを保存
    
    // 一旦空にする
    p.actionTable = [];
    p.jobTable = [];  // jobTableも初期化
    
    // ②状態異常特性による行動制限を優先チェック
    if (p.bodyTraits.includes("危篤")) {
      p.actionTable = ["臨終"];
      p.jobTable = ["無"];
      p.job = "無";
      p.action = "臨終";
      v.log(`${p.name}情況危急，行動已設定為「臨終」。`);
      return;
    } else if (
      p.bodyTraits.includes("生病") || 
      p.bodyTraits.includes("受傷") || 
      p.bodyTraits.includes("過勞") ||
      p.bodyTraits.includes("産褥") ||
      p.mindTraits.includes("抑鬱")
    ) {
      p.actionTable = ["療養"];
      p.action = "療養";
      let abnormalities = [];
      if (p.bodyTraits.includes("生病")) abnormalities.push("生病");
      if (p.bodyTraits.includes("受傷")) abnormalities.push("受傷");
      if (p.bodyTraits.includes("過勞")) abnormalities.push("過勞");
      if (p.bodyTraits.includes("産褥")) abnormalities.push("産褥");
      if (p.mindTraits.includes("抑鬱")) abnormalities.push("抑鬱");
      let selected = randChoice(abnormalities);
      v.log(`${p.name}因為${selected}，行動設定成「療養」`);
      return;
    }
    // // refreshJobTable(p);
    // // 通常の行動テーブル構築
    // let sa = p.spiritAge;
    // if (sa <= 9) {
    //   p.jobTable = ["無"];
    //   p.actionTable = ["無"];
    // } else if (sa <= 15) {
    //   p.jobTable = ["學習", "鍛鍊", "無"];
    //   p.actionTable = ["學習", "鍛鍊", "休養", "休閒"];
    // } else {
    //   // 基本の仕事テーブル（共通）
    //   let commonJobs = [
    //     "無",
    //     "耕作", "狩獵", "捕魚",
    //     "伐木",
    //     "採集", "家政", "行商",
    //     "研究", "警備", "看護"
    //   ];
    //   const buildingFlags = theVillage.buildingFlags || {};

    //       // 建築物によって解放される共通の仕事
    //   if (buildingFlags.hasClinic) {
    //     commonJobs.push("按摩");
    //   }
    //   if (buildingFlags.hasLibrary) {
    //     commonJobs.push("寫書");
    //   }
    //   if (buildingFlags.hasBrewery) {
    //     commonJobs.push("醸造");
    //   }
    //   if (buildingFlags.hasAlchemy) {
    //     commonJobs.push("錬金術");
    //   }
    //   if (buildingFlags.hasWeaving) {
    //     commonJobs.push("紡織");
    //   }

    //   // 性別に応じた仕事テーブル
    //   if (p.bodySex === "男") {
    //     p.jobTable = [
    //       ...commonJobs,
    //       "詩人", "神官"
    //     ];
    //   } else {
    //     p.jobTable = [
    //       ...commonJobs,
    //       "舞者", "修女"
    //     ];
    //     // 女性限定の建築物依存の仕事
    //     if (buildingFlags.hasTavern) {
    //       p.jobTable.push("兔女郎");
    //     }
    //     if (buildingFlags.hasChurch) {
    //       p.jobTable.push("巫女");
    //     }
    //   }

    //     // 性別に応じた行動テーブル
    //     if (p.bodySex === "男") {
    //       p.actionTable = [
    //         "休養", "休閒",
    //         "耕作", "狩獵", "捕魚",
    //         "伐木",
    //         "採集", "家政", "行商",
    //         "研究", "警備", "看護",
    //         "詩人", "神官"
    //       ];

    //       // 建築物によって解放される共通の仕事を行動テーブルにも追加
    //       if (buildingFlags.hasClinic) {
    //         p.actionTable.push("按摩");
    //       }
    //       if (buildingFlags.hasLibrary) {
    //         p.actionTable.push("寫書");
    //       }
    //       if (buildingFlags.hasBrewery) {
    //         p.actionTable.push("醸造");
    //       }
    //       if (buildingFlags.hasAlchemy) {
    //         p.actionTable.push("錬金術");
    //       }
    //       if (buildingFlags.hasWeaving) {
    //         p.actionTable.push("紡織");
    //       }
    //     } else {
    //       p.actionTable = [
    //         "休養", "休閒",
    //         "耕作", "狩獵", "捕魚",
    //         "伐木",
    //         "採集", "家政", "行商",
    //         "研究", "警備", "看護",
    //         "舞者", "修女"
    //       ];

    //       // 建築物によって解放される共通の仕事を行動テーブルにも追加
    //       if (buildingFlags.hasClinic) {
    //         p.actionTable.push("按摩");
    //       }
    //       if (buildingFlags.hasLibrary) {
    //         p.actionTable.push("寫書");
    //       }
    //       if (buildingFlags.hasBrewery) {
    //         v.actionTable.push("醸造");
    //       }
    //       if (buildingFlags.hasAlchemy) {
    //         p.actionTable.push("錬金術");
    //       }
    //       if (buildingFlags.hasWeaving) {
    //         p.actionTable.push("紡織");
    //       }

    //       // 女性限定の建築物依存の仕事を行動テーブルにも追加
    //       if (buildingFlags.hasTavern) {
    //         p.actionTable.push("兔女郎");
    //       }
    //       if (buildingFlags.hasChurch) {
    //         p.actionTable.push("巫女");
    //       }

    //     }
    // }



    // // 襲擊関連の行動追加（状態異常がない場合のみ）
    // if (v.villageTraits.includes("襲擊中")) {
    //   p.actionTable.push("迎擊", "製作陷阱");
    // }

    refreshJobTable(p);

    // jobTableに現在のjobが含まれている場合は維持
    if (p.jobTable.includes(currentJob)) {
      p.job = currentJob;
    }

    // 現在の行動と仕事が一致している場合は維持
    if (currentAction === currentJob) {
      p.action = currentAction;
    } else {
      // 現在の行動と仕事が一致していない場合は仕事と同じにする
      p.action = p.job;
    }

    // 勤勉度および体力・メンタルによる休養判定
    let needsRest = false;
    let restReason = "";

    if (p.ind >= 21) {
      // 高勤勉の場合、体力かメンタルが33以下なら休養
      if (p.hp <= 33 && p.mp <= 33) {
        needsRest = true;
        restReason = "體力和精神低落";
        p.action = p.hp <= p.mp ? "休養" : "休閒";
      } else if (p.hp <= 33) {

        needsRest = true;
        restReason = "體力低下";
        p.action = "休養";
      } else if (p.mp <= 33) {
        needsRest = true;
        restReason = "精神低落";
        p.action = "休閒";
      }
    } else if (p.ind >= 13) {
      // 中勤勉の場合、体力かメンタルが50以下なら休養
      if (p.hp <= 50 && p.mp <= 50) {
        needsRest = true;
        restReason = "體力和精神低落";
        p.action = p.hp <= p.mp ? "休養" : "休閒";
      } else if (p.hp <= 50) {
        needsRest = true;
        restReason = "體力低下";
        p.action = "休養";
      } else if (p.mp <= 50) {
        needsRest = true;
        restReason = "精神低落";
        p.action = "休閒";
      }
    } else {
      // 低勤勉の場合、体力かメンタルが60以下なら休養
      if (p.hp <= 60 && p.mp <= 60) {
        needsRest = true;
        restReason = "體力和精神低落";
        p.action = p.hp <= p.mp ? "休養" : "休閒";
      } else if (p.hp <= 60) {
        needsRest = true;
        restReason = "體力低下";
        p.action = "休養";
      } else if (p.mp <= 60) {
        needsRest = true;
        restReason = "精神低落";
        p.action = "休閒";
      }
    }

    // 休養が必要な場合はログに表示
    if (needsRest) {
      v.log(`${p.name}因為${restReason}，必須${p.action}`);
    }
  });
}

// -------------------------
// 加齢 (年始に呼ばれる)
// -------------------------
export function doAgingProcess(v) {
  v.log("【年齡增加】");
  v.villagers.forEach(p=>{
    p.bodyAge++;
    p.spiritAge++;
    if (!p.bodyTraits.includes("老人")) {
      if (p.bodyAge>=60) {
        p.bodyTraits.push("老人");
        p.str = round3(p.str * 0.5);
        p.vit = round3(p.vit * 0.5);
        p.chr = round3(p.chr * 0.5);
        v.log(`${p.name}進入老`);
      } else if (!p.bodyTraits.includes("中年") && p.bodyAge>=40) {
        p.bodyTraits.push("中年");
        p.str = round3(p.str * 0.75);
        p.vit = round3(p.vit * 0.75);
        p.chr = round3(p.chr * 0.75);
        v.log(`${p.name}進入中年`);
      }
    }
    v.log(`${p.name}:${p.bodyAge}歲(精神年齢${p.spiritAge})`);
  });
}

// -------------------------
// 季節更新
// -------------------------
export function updateSeason(v) {
  ["春","夏","秋","冬"].forEach(ss=>{
    let i=v.villageTraits.indexOf(ss);
    if (i>=0) v.villageTraits.splice(i,1);
  });
  let newS="";
  switch(v.month) {
    case 3: newS="春"; break;
    case 6: newS="夏"; break;
    case 9: newS="秋"; break;
    case 12:newS="冬"; break;
  }
  if (newS) {
    v.villageTraits.push(newS);
    // 季節変更ダイアログを表示
    showSeasonChangeDialog(newS);
    v.log(`${newS}天到了`);
  }
}

// 季節変更ダイアログを表示する関数
function showSeasonChangeDialog(season) {
  let messages = {
    "春": "這是暖風和新生命的季節。",
    "夏": "太陽高高升起，是充滿生命力的季節。",
    "秋": "收穫的季節到了，是豐收的時刻。",
    "冬": "寒冷和安靜的季節。"
  };

  let dialog = document.createElement("div");
  dialog.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 2em;
    border-radius: 10px;
    text-align: center;
    z-index: 1000;
    min-width: 300px;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
  `;

  let seasonText = document.createElement("h2");
  seasonText.textContent = `${season}天到了`;
  seasonText.style.cssText = `
    margin: 0 0 1em 0;
    color: #FFD700;
    font-size: 1.5em;
  `;

  let message = document.createElement("p");
  message.textContent = messages[season];
  message.style.cssText = `
    margin: 0 0 1.5em 0;
    line-height: 1.5;
  `;

  let closeButton = document.createElement("button");
  closeButton.textContent = "關閉";
  closeButton.style.cssText = `
    padding: 0.5em 2em;
    background: #4a4a4a;
    border: 1px solid #666;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
  `;
  closeButton.onmouseover = () => closeButton.style.background = "#666";
  closeButton.onmouseout = () => closeButton.style.background = "#4a4a4a";
  closeButton.onclick = () => dialog.remove();

  dialog.appendChild(seasonText);
  dialog.appendChild(message);
  dialog.appendChild(closeButton);
  document.body.appendChild(dialog);

  // 5秒後に自動で閉じる
  setTimeout(() => {
    if (document.body.contains(dialog)) {
      dialog.remove();
    }
  }, 5000);
}

// 追加で本ファイル内だけで使う randChoice 等
function randChoice(arr) {
  if (!arr||arr.length===0) return null;
  return arr[Math.floor(Math.random()*arr.length)];
}

// refreshJobTable が events.js 内で必要になったのでimport
import { refreshJobTable } from "./createVillagers.js";
// doExchange が lightning2 で必要
import { doExchange } from "./raid.js";
// randFloat (幸福度自然減衰で使用)
function randFloat(min,max){ return Math.random()*(max-min)+min; }

function finalizeRaid(isSuccess, reason, village) {
  village.log(`【襲擊結果】${isSuccess?"防衛成功":"防衛失敗"} : ${reason}`);
  let rlog=document.getElementById("raidLogArea");
  rlog.innerHTML+=`<br>→ 襲擊結果: ${isSuccess?"防衛成功":"失敗"} (${reason})<br>關閉模組...`;
  alert(`襲擊結果: ${isSuccess?"防衛成功":"失敗"} (${reason})`);
  endRaidProcess(isSuccess, false, village);
}

/**
 * 迎撃モーダルを開く (nextTurnから呼ばれる)
 */
export function openRaidModal(village) {
  document.getElementById("raidOverlay").style.display="block";
  document.getElementById("raidModal").style.display="block";

  updateRaidTables(village);
  const rlog=document.getElementById("raidLogArea");
  rlog.innerHTML="襲擊開始。<br>按「下一步」按鈕繼續。";

  let trapMakers = village.villagers.filter(p=> p.action==="製作陷阱");
  let defenders  = village.villagers.filter(p=> p.action==="迎擊");

  if (trapMakers.length===0 && defenders.length===0) {
    // 確認ダイアログを表示
    if (confirm("沒有負責迎擊和製作陷阱的村民。如果繼續的話，襲擊會自動失敗。 要繼續嗎？")) {
      rlog.innerHTML+=`<br>沒有迎擊者！ → 襲擊自動成功(敵方)。`;
      village.raidActionQueue=[ {type:"AUTO_FAIL"} ];
      village.currentActionIndex=0;
    } else {
      // キャンセルした場合はモーダルを閉じる
      closeRaidModal();
      return;
    }
  } else {
    village.raidTurnCount=1;
    createTrapActionQueue(village);
  }
}
