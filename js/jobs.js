// jobs.js

import { randInt, randFloat, clampValue, round3 } from "./util.js";
import { HobbyEffects } from "./HobbyEffects.js";

/**
 * 全村人の「行動」を実行する
 */
export function handleAllVillagerJobs(village) {
  village.log("【村民的行動階段】");

  village.villagers.forEach(p => {
    let saboProb = 40 - p.ind * 2;
    if (saboProb < 0) saboProb = 0;

    let roll = randInt(1, 100);
    // サボり判定
    if (roll <= saboProb && p.action !== "休養" && p.action !== "休閒" && p.action !== "無" && p.action !== "迎擊" && p.action !== "製作陷阱" && p.action !== "療養" && p.action !== "臨終") {
      doSabori(p, village);
    } else {
      doJobAction(p, village);
    }
  });
}

function doSabori(p, v) {
  if (p.mindTraits.includes("尼特")) {
    p.hp = clampValue(p.hp+40, 0, 100);
    p.mp = clampValue(p.mp+40, 0, 100);
    p.happiness = clampValue(p.happiness+20, 0, 100);
    v.log(`${p.name}是尼特:偷懶 體力+40,精神+40,幸福+20`);
  } else {
    p.hp = clampValue(p.hp+20, 0, 100);
    p.mp = clampValue(p.mp+20, 0, 100);
    v.log(`${p.name}偷懶:體力+20,精神+20`);
  }
}

function doJobAction(p, v) {
  switch(p.action) {
    case "無":
      v.log(`${p.name}沒有行動`);
      break;
    case "休養":
      doRestJob(p, v);
      break;
    case "休閒":
      doLeisureJob(p, v);
      break;
    case "學習":
      doStudy(p, v);
      break;
    case "鍛鍊":
      doTraining(p, v);
      break;
    case "耕作":
      doFarm(p, v);
      break;
    case "伐木":
      doLumber(p, v);
      break;
    case "狩獵":
      doHunt(p, v);
      break;
    case "捕魚":
      doFish(p, v);
      break;
    case "採集":
      doGather(p, v);
      break;
    case "家政":
      doHandiwork(p, v);
      break;
    case "魔法細工":
      doMagicCraft(p, v);
      break;
    case "研究":
      doResearchJob(p, v);
      break;
    case "教育":
      doEducationJob(p, v);
      break;
    case "警備":
      doGuardJob(p, v);
      break;
    case "療養":
      doHealingJob(p, v);
      break;
    case "臨終":
      doLastMomentsJob(p, v);
      break;
    case "舞者":
      doDancer(p, v);
      break;
    case "詩人":
      doPoet(p, v);
      break;
    case "看護":
      doNurse(p, v);
      break;
    case "修女":
      doSister(p, v);
      break;
    case "神官":
      doPriest(p, v);
      break;
    case "行商":
      doTrading(p, v);
      break;
    case "按摩":
      doMassage(p, v);
      break;
    case "巫女":
      doMiko(p, v);
      break;
    case "兔女郎":
      doBunny(p, v);
      break;
    case "錬金術":
      doAlchemy(p, v);
      break;
    case "寫書":
      doCopyBook(p, v);
      break;
    case "紡織":
      doWeaving(p, v);
      break;
    case "醸造":
      doBrewing(p, v);
      break;
    // "罠作成", "迎撃" は襲擊専用(raid.js)で処理するので、ここはログだけ
    case "製作陷阱":
    case "迎擊":
      v.log(`${p.name} ${p.action}(只在攻擊階段執行)`);
      break;

    default:
      v.log(`${p.name}的行動[${p.action}]未被定義`);
      break;
  }
}

function calcBodyCost(base, vit) {
  let val = base * (1 - (vit/100));
  val *= randFloat(0.9, 1.1);
  return Math.round(val);
}
function calcMindCost(base, ind) {
  let val = base * (1 - (ind/100));
  val *= randFloat(0.9, 1.1);
  return Math.round(val);
}

/**
 * 仕事による精神消費を計算
 */
function calcMentalCost(person, jobData) {
  // 工作中毒は仕事の精神消費なし
  if (person.mindTraits.includes("工作中毒")) {
    return 0;
  }

  let cost = jobData.mentalCost || 0;
  
  // 既存の他の計算ロジックがあればそのまま維持
  if (person.job === "休暇") {
    cost = 0;
  }
  // ... その他の条件分岐があれば維持

  return cost;
}

/**
 * 村人の仕事を処理
 */
function handleVillagerJob(person, village) {
  const jobData = JOB_DATA[person.job];
  if (!jobData) return;

  // 精神消費を計算して適用
  const mentalCost = calcMentalCost(person, jobData);
  person.mp = clampValue(person.mp - mentalCost, 0, 100);

  // ... 残りの仕事処理ロジック
}

// -------------------------
// 各ジョブの具体処理
// -------------------------

function doRestJob(p, v) {
  let r = randInt(1,100);
  let hpG = 0;
  let mpG = 0;
  let msg = "";
  if (p.mindTraits.includes("工作中毒")) {
    hpG = 30; 
    mpG = -10; 
    msg = "(工作中毒)";
  } else if (r<=30) {
    hpG = 70; mpG=30; msg="大成功";
  } else if (r<=90) {
    hpG = 50; mpG=20; msg="成功";
  } else {
    hpG = 30; mpG=0; msg="失敗";
  }
  // 中年/老人で効率補正
  let multi=1;
  if (p.bodyTraits.includes("老人")) multi=0.7;
  else if (p.bodyTraits.includes("中年")) multi=0.9;

  hpG=Math.floor(hpG*multi);
  mpG=Math.floor(mpG*multi);

  p.hp=clampValue(p.hp+hpG,0,100);
  p.mp=clampValue(p.mp+mpG,0,100);

  // 尼特特性の場合、幸福度も上昇
  if (p.mindTraits.includes("尼特")) {
    p.happiness = clampValue(p.happiness + 20, 0, 100);
    msg += "(尼特:幸福+20)";
  }

  v.log(`${p.name}休養:${msg} 體力+${hpG},精神+${mpG}`);
}

function doLeisureJob(p, v) {
  let base=50;
  if (p.mindTraits.includes("尼特")) {
    base=100;
    p.happiness=clampValue(p.happiness+20,0,100);
  }
  p.mp=clampValue(p.mp+base,0,100);

  let hobbyMsg = HobbyEffects.apply(p, v);
  v.log(`${p.name}休閒:精神+${base}${hobbyMsg}`);
}

function doStudy(p, v) {
  let tc=calcBodyCost(10, p.vit);
  let mc=calcMindCost(10, p.ind);
  p.hp=clampValue(p.hp-tc,0,100);
  p.mp=clampValue(p.mp-mc,0,100);

  if (Math.random()<0.3) p.int++;
  if (Math.random()<0.3) p.ind++;
  v.log(`${p.name}學習:體力-${tc},精神-${mc},智力/勤奮上昇`);
}

function doTraining(p, v) {
  let tc=calcBodyCost(20, p.vit);
  let mc=calcMindCost(15, p.ind);
  p.hp=clampValue(p.hp-tc,0,100);
  p.mp=clampValue(p.mp-mc,0,100);

  if (Math.random()<0.4) p.str++;
  if (Math.random()<0.3) p.vit++;
  if (Math.random()<0.2) p.cou++;
  v.log(`${p.name}鍛鍊:體力-${tc},精神-${mc},力量/耐力/勇氣UP可能`);
}

function doFarm(p, v) {
  let tc=calcBodyCost(30, p.vit);
  let mc=calcMindCost(15, p.ind);
  p.hp=clampValue(p.hp-tc,0,100);
  p.mp=clampValue(p.mp-mc,0,100);

  let base=10+20*((p.vit/20)*(p.ind/20));
  let mul=1;
  if (v.villageTraits.includes("秋")) mul*=1.5;
  if (v.villageTraits.includes("冬")) mul*=0.5;
  if (v.villageTraits.includes("冷夏")) mul*=0.5;
  if (v.villageTraits.includes("豐收")) mul*=2;
  if (p.mindTraits.includes("熟練農夫")) mul*=1.3;
  if (p.mindTraits.includes("達人農夫")) mul*=1.5;
  if (p.bodyTraits.includes("大地の巫女")) mul*=1.5;

  let amt=Math.round(base*mul);
  
  let logMsg = `${p.name}耕作:食材+${amt},體力-${tc},精神-${mc}`;

  // ミダスの奇跡の効果
  if (v.villageTraits.includes("邁達斯")) {
    v.funds = clampValue(v.funds+amt, 0, 99999);
    logMsg =  `${p.name}耕作:資金+${amt},體力-${tc},精神-${mc}`;
  } else {
    v.food = clampValue(v.food+amt, 0, 99999);
    logMsg = `${p.name}耕作:食材+${amt},體力-${tc},精神-${mc}`;
  }

  // ステータス上昇判定
  if (Math.random() < 0.05) {
    p.vit++;
    logMsg += ",耐力+1";
  }
  if (Math.random() < 0.05) {
    p.ind++;
    logMsg += ",勤奮+1";
  }

  // 特性取得判定
  if (p.spiritAge >= 30 && Math.random() < 0.01 && !p.mindTraits.includes("熟練農夫") && !p.mindTraits.includes("達人農夫")) {
    p.mindTraits.push("熟練農夫");
    logMsg += ",特性[熟練農夫]獲得";
  }
  if (p.mindTraits.includes("熟練農夫") && Math.random() < 0.01) {
    p.mindTraits = p.mindTraits.filter(t => t !== "熟練農夫");
    p.mindTraits.push("達人農夫");
    logMsg += ",特性[達人農夫]獲得";
  }

  v.log(logMsg);
}

function doLumber(p, v) {
  let tc=calcBodyCost(30, p.vit);
  let mc=calcMindCost(15, p.ind);
  p.hp=clampValue(p.hp-tc,0,100);
  p.mp=clampValue(p.mp-mc,0,100);

  let base=10+20*((p.vit/20)*(p.str/20));
  let mul=1;
  if (v.villageTraits.includes("豐收")) mul*=2;
  if (v.villageTraits.includes("冷夏")) mul*=0.5;
  if (p.mindTraits.includes("熟練木樵")) mul*=1.3;
  if (p.mindTraits.includes("達人木樵")) mul*=1.5;

  let amt=Math.round(base*mul);
  v.materials=clampValue(v.materials+amt,0,99999);

  let logMsg = `${p.name}伐木:建材+${amt},體力-${tc},精神-${mc}`;

  // ステータス上昇判定
  if (Math.random() < 0.05) {
    p.str++;
    logMsg += ",力量+1";
  }
  if (Math.random() < 0.05) {
    p.ind++;
    logMsg += ",勤奮+1";
  }

  // 特性取得判定
  if (p.spiritAge >= 30 && Math.random() < 0.01 && !p.mindTraits.includes("熟練木樵") && !p.mindTraits.includes("達人木樵")) {
    p.mindTraits.push("熟練木樵");
    logMsg += ",特性[熟練木樵]獲得";
  }
  if (p.mindTraits.includes("熟練木樵") && Math.random() < 0.01) {
    p.mindTraits = p.mindTraits.filter(t => t !== "熟練木樵");
    p.mindTraits.push("達人木樵");
    logMsg += ",特性[達人木樵]獲得";
  }

  v.log(logMsg);
}

function doHunt(p, v) {
  let tc=calcBodyCost(30, p.vit);
  let mc=calcMindCost(15, p.ind);
  p.hp=clampValue(p.hp-tc,0,100);
  p.mp=clampValue(p.mp-mc,0,100);

  // 成功判定と基本値(X)の決定
  let r = randInt(1,100);
  let x = 0;
  let result = "";
  if (r <= 20) {
    x = 0;
    result = "失敗";
  } else if (r <= 80) {
    x = 20;
    result = "成功";
  } else {
    x = 50;
    result = "大成功";
  }
  
  let base = x * ((p.str/20) * (p.cou/20));
  let mul = 1;
  if (v.villageTraits.includes("豐收")) mul *= 2;
  if (v.villageTraits.includes("冬")) mul *= 1.2;
  if (p.bodyTraits.includes("月の巫女")) mul *= 1.5;
  if (p.bodyTraits.includes("飛行")) mul *= 1.2;
  if (p.mindTraits.includes("熟練狩人")) mul *= 1.3;
  if (p.mindTraits.includes("達人狩人")) mul *= 1.5;

  let amt = Math.round(base * mul);

  // ミダスの奇跡の効果
  if (v.villageTraits.includes("邁達斯")) {
    v.funds = clampValue(v.funds+amt, 0, 99999);
    v.log(`${p.name}狩獵:${result} 資金+${amt},體力-${tc},精神-${mc}`);
  } else {
    v.food = clampValue(v.food+amt, 0, 99999);
    v.log(`${p.name}狩獵:${result} 食材+${amt},體力-${tc},精神-${mc}`);
  }

  // ステータス上昇判定
  if (Math.random() < 0.05) {
    p.str++;
    v.log(`${p.name}狩獵:${result} 力量+1`);
  }
  if (Math.random() < 0.05) {
    p.cou++;
    v.log(`${p.name}狩獵:${result} 勇氣+1`);
  }

  // 特性取得判定
  if (p.spiritAge >= 30 && Math.random() < 0.01 && !p.mindTraits.includes("熟練狩人") && !p.mindTraits.includes("達人狩人")) {
    p.mindTraits.push("熟練狩人");
    v.log(`${p.name}狩獵:${result} 特性[熟練狩人]獲得`);
  }
  if (p.mindTraits.includes("熟練狩人") && Math.random() < 0.01) {
    p.mindTraits = p.mindTraits.filter(t => t !== "熟練狩人");
    p.mindTraits.push("達人狩人");
    v.log(`${p.name}狩獵:${result} 特性[達人狩人]獲得`);
  }

  // v.log(`${p.name}狩獵:${result} 食材+${amt},體力-${tc},精神-${mc}`);
}

function doFish(p, v) {
  let tc=calcBodyCost(30, p.vit);
  let mc=calcMindCost(15, p.ind);
  p.hp=clampValue(p.hp-tc,0,100);
  p.mp=clampValue(p.mp-mc,0,100);

  // 成功判定と基本値(X)の決定
  let r = randInt(1,100);
  let x = 0;
  let result = "";
  if (r <= 20) {
    x = 0;
    result = "失敗";
  } else if (r <= 80) {
    x = 20;
    result = "成功";
  } else {
    x = 50;
    result = "大成功";
  }
  
  let base = x * ((p.vit/20) * (p.cou/20));
  let mul = 1;
  if (v.villageTraits.includes("豐收")) mul *= 2;
  if (p.bodyTraits.includes("水中呼吸")) mul *= 1.5;
  if (p.mindTraits.includes("海の知恵")) mul *= 1.5;
  if (p.mindTraits.includes("熟練捕魚師")) mul *= 1.3;
  if (p.mindTraits.includes("達人捕魚師")) mul *= 1.5;

  let amt = Math.round(base * mul);

  // ミダスの奇跡の効果
  if (v.villageTraits.includes("邁達斯")) {
    v.funds = clampValue(v.funds+amt, 0, 99999);
    v.log(`${p.name}捕魚:${result} 資金+${amt},體力-${tc},精神-${mc}`);
  } else {
    v.food = clampValue(v.food+amt, 0, 99999);
    v.log(`${p.name}捕魚:${result} 食材+${amt},體力-${tc},精神-${mc}`);
  }

  // ステータス上昇判定
  if (Math.random() < 0.05) {
    p.vit++;
    v.log(`${p.name}捕魚:${result} 耐力+1`);
  }
  if (Math.random() < 0.05) {
    p.cou++;
    v.log(`${p.name}捕魚:${result} 勇氣+1`);
  }

  // 特性取得判定
  if (p.int >= 20 && Math.random() < 0.03 && !p.mindTraits.includes("海の知恵")) {
    p.mindTraits.push("海の知恵");
    v.log(`${p.name}捕魚:${result} 特性[海の知恵]獲得`);
  }
  if (p.spiritAge >= 30 && Math.random() < 0.01 && !p.mindTraits.includes("熟練捕魚師") && !p.mindTraits.includes("達人捕魚師")) {
    p.mindTraits.push("熟練捕魚師");
    v.log(`${p.name}捕魚:${result} 特性[熟練捕魚師]獲得`);
  }
  if (p.mindTraits.includes("熟練捕魚師") && Math.random() < 0.01) {
    p.mindTraits = p.mindTraits.filter(t => t !== "熟練捕魚師");
    p.mindTraits.push("達人捕魚師");
    v.log(`${p.name}捕魚:${result} 特性[達人捕魚師]獲得`);
  }

  // v.log(`${p.name}捕魚:${result} 食材+${amt},體力-${tc},精神-${mc}`);
}

function doGather(p, v) {
  let tc=calcBodyCost(15, p.vit);
  let mc=calcMindCost(15, p.ind);
  p.hp=clampValue(p.hp-tc,0,100);
  p.mp=clampValue(p.mp-mc,0,100);

  let baseF = 5 + 10*((p.dex/20)*(p.int/20));
  let baseM = randInt(1,3);
  let mul=1;
  if (v.villageTraits.includes("豐收")) mul*=2;
  if (v.villageTraits.includes("秋"))   mul*=1.5;
  if (p.bodyTraits.includes("飛行")) mul*=1.2;
  if (p.mindTraits.includes("森の知恵")) mul*=1.5;

  let f = Math.round(baseF*mul);
  let mm= Math.round(baseM*mul);

  // ミダスの奇跡の効果
  if (v.villageTraits.includes("邁達斯")) {
    v.funds = clampValue(v.funds+f, 0, 99999);
    v.materials = clampValue(v.materials+mm, 0, 99999);
    v.log(`${p.name}採集:資金+${f},建材+${mm},體力-${tc},精神-${mc}`);
  } else {
    v.food = clampValue(v.food+f, 0, 99999);
    v.materials = clampValue(v.materials+mm, 0, 99999);
    v.log(`${p.name}採集:食材+${f},建材+${mm},體力-${tc},精神-${mc}`);
  }

  // ステータス上昇判定
  if (Math.random() < 0.05) {
    p.int++;
    v.log(`${p.name}採集:智力+1`);
  }
  if (Math.random() < 0.05) {
    p.dex++;
    v.log(`${p.name}採集:靈巧+1`);
  }

  // 特性取得判定
  if (p.int >= 20 && Math.random() < 0.03 && !p.mindTraits.includes("森の知恵")) {
    p.mindTraits.push("森の知恵");
    v.log(`${p.name}採集:特性[森の知恵]獲得`);
  }

  // v.log(`${p.name}採集:食材+${f},建材+${mm},體力-${tc},精神-${mc}`);
}

function doHandiwork(p, v) {
  let tc = calcBodyCost(15, p.vit);
  let mc = calcMindCost(15, p.ind);
  p.hp = clampValue(p.hp-tc, 0, 100);
  p.mp = clampValue(p.mp-mc, 0, 100);

  let base = 5+10*((p.dex/20)*(p.ind/20));
  let amt = Math.round(base);
  v.funds = clampValue(v.funds+amt, 0, 99999);

  let logMsg = `${p.name}家政:資金+${amt},體力-${tc},精神-${mc}`;
  
  // ステータス上昇判定
  if (Math.random() < 0.05) {
    p.dex++;
    logMsg += ",靈巧+1";
  }
  if (Math.random() < 0.05) {
    p.ind++;
    logMsg += ",勤奮+1";
  }

  v.log(logMsg);
}

function doMagicCraft(p, v) {
  let tc=calcBodyCost(15, p.vit);
  let mc=calcMindCost(15, p.ind);
  p.hp=clampValue(p.hp-tc,0,100);
  p.mp=clampValue(p.mp-mc,0,100);

  let base=15+30*((p.dex/20)*(p.mag/20));
  let amt=Math.round(base);

  v.funds=clampValue(v.funds+amt,0,99999);
  v.log(`${p.name}魔法細工:資金+${amt},體力-${tc},精神-${mc}`);
}

function doResearchJob(p, v) {
  let tc = calcBodyCost(15, p.vit);
  let val = 30*(1-(p.int/100))*randFloat(0.9,1.1);
  let mc = Math.round(val);

  p.hp = clampValue(p.hp-tc, 0, 100);
  p.mp = clampValue(p.mp-mc, 0, 100);

  let base = 15+30*((p.int/20)*(p.mag/20));
  let gain = Math.round(base);

  v.tech = clampValue(v.tech+gain, 0, 99999);

  let logMsg = `${p.name}研究:技術+${gain},體力-${tc},精神-${mc}`;
  
  // ステータス上昇判定
  if (Math.random() < 0.05) {
    p.mag++;
    logMsg += ",魔力+1";
  }
  if (Math.random() < 0.05) {
    p.int++;
    logMsg += ",智力+1";
  }

  v.log(logMsg);
}

function doEducationJob(p, v) {
  let tc=calcBodyCost(15, p.vit);
  let val=30*(1-(p.eth/100))*randFloat(0.9,1.1);
  let mc=Math.round(val);

  p.hp=clampValue(p.hp-tc,0,100);
  p.mp=clampValue(p.mp-mc,0,100);

  let improved=0;
  v.villagers.forEach(x=>{
    if (x.spiritAge>=10 && x.spiritAge<=15) {
      let mi=Math.floor(p.int/10); if(mi<1) mi=1;
      let mind2=Math.floor(p.ind/10); if(mind2<1) mind2=1;
      let meth=Math.floor(p.eth/10); if(meth<1) meth=1;
      let mcou=Math.floor(p.cou/10); if(mcou<1) mcou=1;

      if (Math.random()<0.2) { x.int += randInt(1,mi); improved++;}
      if (Math.random()<0.2) { x.ind += randInt(1,mind2); improved++;}
      if (Math.random()<0.2) { x.eth += randInt(1,meth); improved++;}
      if (Math.random()<0.2) { x.cou += randInt(1,mcou); improved++;}
    }
  });
  v.log(`${p.name}教育:小孩能力上升${improved}回,體力-${tc},精神-${mc}`);
}

function doGuardJob(p, v) {
  let tc = calcBodyCost(15, p.vit);
  let val = 30*(1-(p.cou/100))*randFloat(0.9,1.1);
  let mc = Math.round(val);

  p.hp = clampValue(p.hp-tc, 0, 100);
  p.mp = clampValue(p.mp-mc, 0, 100);

  let inc = Math.round((p.cou+p.eth)/50);
  if(inc<1) inc=1;

  v.security = clampValue(v.security+inc, 0, 100);

  let logMsg = `${p.name}警備:治安+${inc},體力-${tc},精神-${mc}`;
  
  // ステータス上昇判定
  if (Math.random() < 0.05) {
    p.str++;
    logMsg += ",力量+1";
  }
  if (Math.random() < 0.05) {
    p.eth++;
    logMsg += ",道德+1";
  }

  v.log(logMsg);
}

function doHealingJob(p, v) {
  let hpG = 20;
  let mpG = 20;
  
  // 中年/老人で効率補正
  if (p.bodyTraits.includes("中年")) {
    hpG = Math.floor(hpG * 0.8);
    mpG = Math.floor(mpG * 0.8);
  } else if (p.bodyTraits.includes("老人")) {
    hpG = Math.floor(hpG * 0.6);
    mpG = Math.floor(mpG * 0.6);
  }
  
  p.hp = clampValue(p.hp + hpG, 0, 100);
  p.mp = clampValue(p.mp + mpG, 0, 100);
  
  let logMsg = `${p.name}療養:體力+${hpG},精神+${mpG}`;
  
  // 受傷特性の回復判定（100%の確率で回復）
  if (p.bodyTraits.includes("受傷") && Math.random() < 1.0) {
    p.bodyTraits = p.bodyTraits.filter(trait => trait !== "受傷");
    logMsg += ",受傷が回復";
  }
  
  v.log(logMsg);
}

function doLastMomentsJob(p, v) {
  v.log(`${p.name}靜靜地等待迎接他的時間。`);
}

function doDancer(p, v) {
  let tc = calcBodyCost(20, p.vit);
  let mc = calcBodyCost(20, p.sexdr);
  p.hp = clampValue(p.hp-tc, 0, 100);
  p.mp = clampValue(p.mp-mc, 0, 100);

  let inc = Math.round(5 * p.chr * p.sexdr / 400);
  
  // 酒場があれば効果1.2倍
  if (v.buildingFlags && v.buildingFlags.hasTavern) {
    inc = Math.round(inc * 1.2);
  }
  
  // 澄んだ声または通る声の特性があれば効果1.2倍
  if (p.bodyTraits.includes("清澈的聲") || p.bodyTraits.includes("嘹亮的聲")) {
    inc = Math.round(inc * 1.2);
  }
  
  let affected = 0;
  v.villagers.forEach(target => {
    if (target.spiritSex === "男") {
      target.happiness = clampValue(target.happiness + inc, 0, 100);
      affected++;
    }
  });

  let logMsg = `${p.name}舞者:男性${affected}人的幸福+${inc},體力-${tc},精神-${mc}`;
  
  // ステータス上昇判定
  if (Math.random() < 0.05) {
    p.chr++;
    logMsg += ",魅力+1";
  }
  if (Math.random() < 0.05) {
    p.sexdr++;
    logMsg += ",好色+1";
  }

  v.log(logMsg);
}

function doPoet(p, v) {
  let tc = calcBodyCost(20, p.vit);
  let mc = calcBodyCost(20, p.ind);
  p.hp = clampValue(p.hp-tc, 0, 100);
  p.mp = clampValue(p.mp-mc, 0, 100);

  let inc = Math.round(5 * p.chr * p.chr / 400);
  
  // 酒場があれば効果1.2倍
  if (v.buildingFlags && v.buildingFlags.hasTavern) {
    inc = Math.round(inc * 1.2);
  }
  
  // 澄んだ声または通る声の特性があれば効果1.2倍
  if (p.bodyTraits.includes("清澈的聲") || p.bodyTraits.includes("嘹亮的聲")) {
    inc = Math.round(inc * 1.2);
  }
  
  let affected = 0;
  v.villagers.forEach(target => {
    if (target.spiritSex === "女") {
      target.happiness = clampValue(target.happiness + inc, 0, 100);
      affected++;
    }
  });

  let logMsg = `${p.name}詩人:女性${affected}人的幸福+${inc},體力-${tc},精神-${mc}`;
  
  // ステータス上昇判定
  if (Math.random() < 0.05) {
    p.chr++;
    logMsg += ",魅力+1";
  }

  v.log(logMsg);
}

function doNurse(p, v) {
  let tc = calcBodyCost(20, p.vit);
  let mc = calcBodyCost(20, p.eth);
  p.hp = clampValue(p.hp-tc, 0, 100);
  p.mp = clampValue(p.mp-mc, 0, 100);

  let lowestHP = 100;
  let targets = [];
  v.villagers.forEach(target => {
    if (target.hp < lowestHP) {
      lowestHP = target.hp;
      targets = [target];
    } else if (target.hp === lowestHP) {
      targets.push(target);
    }
  });

  let logMsg;
  if (targets.length > 0) {
    let target = targets[Math.floor(Math.random() * targets.length)];
    let heal = Math.round(20 * p.mag * p.eth / 400);
    target.hp = clampValue(target.hp + heal, 0, 100);
    logMsg = `${p.name}看護:${target.name}的體力+${heal},體力-${tc},精神-${mc}`;
  } else {
    logMsg = `${p.name}看護:沒有對象,體力-${tc},精神-${mc}`;
  }
  
  // ステータス上昇判定
  if (Math.random() < 0.05) {
    p.mag++;
    logMsg += ",魔力+1";
  }
  if (Math.random() < 0.05) {
    p.eth++;
    logMsg += ",道德+1";
  }

  v.log(logMsg);
}

function doSister(p, v) {
  let tc = calcBodyCost(10, p.vit);
  let mc = calcBodyCost(30, p.eth);
  p.hp = clampValue(p.hp-tc, 0, 100);
  p.mp = clampValue(p.mp-mc, 0, 100);

  let heal = Math.round(5 * p.chr * p.eth / 400);
  
  // 礼拝堂があれば効果1.2倍
  if (v.buildingFlags && v.buildingFlags.hasChurch) {
    heal = Math.round(heal * 1.2);
  }
  
  // 澄んだ声または通る声の特性があれば効果1.2倍
  if (p.bodyTraits.includes("清澈的聲") || p.bodyTraits.includes("嘹亮的聲")) {
    heal = Math.round(heal * 1.2);
  }
  
  let affected = 0;
  v.villagers.forEach(target => {
    target.mp = clampValue(target.mp + heal, 0, 100);
    affected++;
  });

  let logMsg = `${p.name}修女:全${affected}人的精神+${heal},體力-${tc},精神-${mc}`;
  
  // ステータス上昇判定
  if (Math.random() < 0.05) {
    p.chr++;
    logMsg += ",魅力+1";
  }
  if (Math.random() < 0.05) {
    p.eth++;
    logMsg += ",道德+1";
  }

  v.log(logMsg);
}

function doPriest(p, v) {
  let tc = calcBodyCost(10, p.vit);
  let mc = calcBodyCost(30, p.eth);
  p.hp = clampValue(p.hp-tc, 0, 100);
  p.mp = clampValue(p.mp-mc, 0, 100);

  let heal = Math.round(5 * p.chr * p.eth / 400);
  
  // 礼拝堂があれば効果1.2倍
  if (v.buildingFlags && v.buildingFlags.hasChurch) {
    heal = Math.round(heal * 1.2);
  }
  
  // 澄んだ声または通る声の特性があれば効果1.2倍
  if (p.bodyTraits.includes("清澈的聲") || p.bodyTraits.includes("嘹亮的聲")) {
    heal = Math.round(heal * 1.2);
  }
  
  let affected = 0;
  v.villagers.forEach(target => {
    target.mp = clampValue(target.mp + heal, 0, 100);
    affected++;
  });

  let logMsg = `${p.name}神官:全${affected}人的精神+${heal},體力-${tc},精神-${mc}`;
  
  // ステータス上昇判定
  if (Math.random() < 0.05) {
    p.chr++;
    logMsg += ",魅力+1";
  }
  if (Math.random() < 0.05) {
    p.eth++;
    logMsg += ",道德+1";
  }

  v.log(logMsg);
}

function doTrading(p, v) {
  let tc = calcBodyCost(20, p.vit);
  let mc = calcMindCost(20, p.ind);
  p.hp = clampValue(p.hp-tc, 0, 100);
  p.mp = clampValue(p.mp-mc, 0, 100);

  let base = 20 * ((p.chr/20) * (p.int/20));
  let amt = Math.round(base);

  v.funds = clampValue(v.funds+amt, 0, 99999);

  let logMsg = `${p.name}行商:資金+${amt},體力-${tc},精神-${mc}`;
  
  // ステータス上昇判定
  if (Math.random() < 0.05) {
    p.chr++;
    logMsg += ",魅力+1";
  }
  if (Math.random() < 0.05) {
    p.int++;
    logMsg += ",智力+1";
  }

  v.log(logMsg);
}

function doMassage(p, v) {
  let tc = calcBodyCost(20, p.vit);
  let mc;
  let heal;
  let logMsg;

  if (p.bodySex === "男") {
    mc = calcMindCost(20, p.ind);
    heal = Math.round(20 * p.str/20 * p.dex/20);
    logMsg = `${p.name}按摩:體力-${tc},精神-${mc}`;
    
    // ステータス上昇判定
    if (Math.random() < 0.01) {
      p.str++;
      logMsg += ",力量+1";
    }
    if (Math.random() < 0.01) {
      p.dex++;
      logMsg += ",靈巧+1";
    }
  } else {
    mc = calcMindCost(20, p.sexdr);
    heal = Math.round(20 * p.chr/20 * p.sexdr/20);
    logMsg = `${p.name}按摩:體力-${tc},精神-${mc}`;
    
    // ステータス上昇判定
    if (Math.random() < 0.01) {
      p.chr++;
      logMsg += ",魅力+1";
    }
    if (Math.random() < 0.01) {
      p.sexdr++;
      logMsg += ",好色+1";
    }
  }

  p.hp = clampValue(p.hp-tc, 0, 100);
  p.mp = clampValue(p.mp-mc, 0, 100);

  // 體力が最も低い村人を探して回復
  let lowestHP = 100;
  let targets = [];
  v.villagers.forEach(target => {
    if (target.hp < lowestHP) {
      lowestHP = target.hp;
      targets = [target];
    } else if (target.hp === lowestHP) {
      targets.push(target);
    }
  });

  if (targets.length > 0) {
    let target = targets[Math.floor(Math.random() * targets.length)];
    target.hp = clampValue(target.hp + heal, 0, 100);
    logMsg += `,${target.name}的體力+${heal}`;
  }

  v.log(logMsg);
}

function doMiko(p, v) {
  let tc = calcBodyCost(20, p.vit);
  let mc = calcMindCost(20, p.sexdr);
  p.hp = clampValue(p.hp-tc, 0, 100);
  p.mp = clampValue(p.mp-mc, 0, 100);

  let manaGain = Math.round(10 * p.chr/20 * p.mag/20 * p.sexdr/20);
  v.mana = clampValue(v.mana + manaGain, 0, 99999);

  let logMsg = `${p.name}巫女:體力-${tc},精神-${mc},魔素+${manaGain}`;
  
  // ステータス上昇判定
  if (Math.random() < 0.01) {
    p.chr++;
    logMsg += ",魅力+1";
  }
  if (Math.random() < 0.01) {
    p.sexdr++;
    logMsg += ",好色+1";
  }

  v.log(logMsg);
}

function doBunny(p, v) {
  let tc = calcBodyCost(20, p.vit);
  let mc = calcMindCost(20, p.sexdr);
  p.hp = clampValue(p.hp-tc, 0, 100);
  p.mp = clampValue(p.mp-mc, 0, 100);

  let happinessInc = Math.round(6 * p.chr/20 * p.sexdr/20);
  let mentalHeal = Math.round(6 * p.chr/20 * p.sexdr/20);
  let affected = 0;

  v.villagers.forEach(target => {
    if (target.spiritSex === "男") {
      target.happiness = clampValue(target.happiness + happinessInc, 0, 100);
      target.mp = clampValue(target.mp + mentalHeal, 0, 100);
      affected++;
    }
  });

  let logMsg = `${p.name}兔女郎:男性${affected}人的幸福+${happinessInc},精神+${mentalHeal},體力-${tc},精神-${mc}`;
  
  // ステータス上昇判定
  if (Math.random() < 0.01) {
    p.chr++;
    logMsg += ",魅力+1";
  }
  if (Math.random() < 0.01) {
    p.sexdr++;
    logMsg += ",好色+1";
  }

  v.log(logMsg);
}

function doAlchemy(p, v) {
  let tc = calcBodyCost(20, p.vit);
  let mc = calcMindCost(20, p.int);
  p.hp = clampValue(p.hp-tc, 0, 100);
  p.mp = clampValue(p.mp-mc, 0, 100);

  let fundsGain = Math.round(24 * p.mag/20 * p.int/20);
  let techGain = Math.round(24 * p.mag/20 * p.int/20);
  
  v.funds = clampValue(v.funds + fundsGain, 0, 99999);
  v.tech = clampValue(v.tech + techGain, 0, 99999);

  let logMsg = `${p.name}錬金:資金+${fundsGain},技術+${techGain},體力-${tc},精神-${mc}`;
  
  // ステータス上昇判定
  if (Math.random() < 0.01) {
    p.mag++;
    logMsg += ",魔力+1";
  }
  if (Math.random() < 0.01) {
    p.int++;
    logMsg += ",智力+1";
  }

  v.log(logMsg);
}

function doCopyBook(p, v) {
  let tc = calcBodyCost(20, p.vit);
  let mc = calcMindCost(20, p.ind);
  p.hp = clampValue(p.hp-tc, 0, 100);
  p.mp = clampValue(p.mp-mc, 0, 100);

  let fundsGain = Math.round(24 * p.dex/20 * p.int/20);
  let techGain = Math.round(24 * p.dex/20 * p.int/20);
  
  v.funds = clampValue(v.funds + fundsGain, 0, 99999);
  v.tech = clampValue(v.tech + techGain, 0, 99999);

  let logMsg = `${p.name}寫書:資金+${fundsGain},技術+${techGain},體力-${tc},精神-${mc}`;
  
  // ステータス上昇判定
  if (Math.random() < 0.01) {
    p.dex++;
    logMsg += ",靈巧+1";
  }
  if (Math.random() < 0.01) {
    p.int++;
    logMsg += ",智力+1";
  }

  v.log(logMsg);
}

function doWeaving(p, v) {
  let tc = calcBodyCost(20, p.vit);
  let mc = calcMindCost(20, p.ind);
  p.hp = clampValue(p.hp-tc, 0, 100);
  p.mp = clampValue(p.mp-mc, 0, 100);

  let fundsGain = Math.round(30 * p.dex/20 * p.ind/20);
  v.funds = clampValue(v.funds + fundsGain, 0, 99999);

  let logMsg = `${p.name}紡織:資金+${fundsGain},體力-${tc},精神-${mc}`;
  
  // ステータス上昇判定
  if (Math.random() < 0.01) {
    p.dex++;
    logMsg += ",靈巧+1";
  }
  if (Math.random() < 0.01) {
    p.ind++;
    logMsg += ",勤奮+1";
  }

  v.log(logMsg);
}

function doBrewing(p, v) {
  let tc = calcBodyCost(20, p.vit);
  let mc = calcMindCost(20, p.ind);
  p.hp = clampValue(p.hp-tc, 0, 100);
  p.mp = clampValue(p.mp-mc, 0, 100);

  let foodGain = Math.round(24 * p.mag/20 * p.ind/20);
  let manaGain = Math.round(5 * p.mag/20 * p.ind/20);
  
  v.food = clampValue(v.food + foodGain, 0, 99999);
  v.mana = clampValue(v.mana + manaGain, 0, 99999);

  let logMsg = `${p.name}醸造:食材+${foodGain},魔素+${manaGain},體力-${tc},精神-${mc}`;
  
  // ステータス上昇判定
  if (Math.random() < 0.01) {
    p.mag++;
    logMsg += ",魔力+1";
  }
  if (Math.random() < 0.01) {
    p.ind++;
    logMsg += ",勤奮+1";
  }

  v.log(logMsg);
}
