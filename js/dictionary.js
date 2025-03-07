// 辞書データ
const dictionaryData = {
  "農作業": {
    description: "村の基本的な食料生産手段。",
    details: [
      "基本生産量 = 10 + 20 * ((耐久/20) * (勤勉/20))",
      "秋: 1.5倍",
      "冬: 0.5倍",
      "冷夏: 0.5倍",
      "豊穣: 2.0倍",
      "熟練農夫: 1.3倍",
      "達人農夫: 1.5倍",
      "大地の巫女: 1.5倍"
    ]
  },
  "伐採": {
    description: "村の基本的な資材生産手段。",
    details: [
      "基本生産量 = 10 + 20 * ((耐久/20) * (筋力/20))",
      "冷夏: 0.5倍",
      "豊穣: 2.0倍",
      "熟練木樵: 1.3倍",
      "達人木樵: 1.5倍"
    ]
  },
  "狩猟": {
    description: "食料を得る手段の一つ。成功判定あり。",
    details: [
      "失敗(20%): 基本値0",
      "成功(60%): 基本値20",
      "大成功(20%): 基本値50",
      "最終生産量 = 基本値 * ((筋力/20) * (勇気/20))",
      "冬: 1.2倍",
      "豊穣: 2.0倍",
      "月の巫女: 1.5倍",
      "飛行: 1.2倍",
      "熟練狩人: 1.3倍",
      "達人狩人: 1.5倍"
    ]
  },
  "漁": {
    description: "食料を得る手段の一つ。成功判定あり。",
    details: [
      "失敗(20%): 基本値0",
      "成功(60%): 基本値20",
      "大成功(20%): 基本値50",
      "最終生産量 = 基本値 * ((耐久/20) * (勇気/20))",
      "豊穣: 2.0倍",
      "水中呼吸: 1.5倍",
      "海の知恵: 1.5倍",
      "熟練漁師: 1.3倍",
      "達人漁師: 1.5倍"
    ]
  },
  "採集": {
    description: "食料と資材を少量得られる手段。",
    details: [
      "食料基本値 = 5 + 10 * ((器用/20) * (知力/20))",
      "資材基本値 = 1～3",
      "秋: 1.5倍",
      "豊穣: 2.0倍",
      "飛行: 1.2倍",
      "森の知恵: 1.5倍"
    ]
  },
  "豊穣": {
    description: "村特性の一つ。",
    details: [
      "全ての生産量が2倍になる",
      "農作業、伐採、狩猟、漁、採集に影響"
    ]
  },
  "休養": {
    description: "体力とメンタルを回復する基本的な行動。",
    details: [
      "大成功(30%): 体力+70,メンタル+30",
      "成功(60%): 体力+50,メンタル+20",
      "失敗(10%): 体力+30,メンタル+0",
      "老人: 効果×0.7",
      "中年: 効果×0.9",
      "ワーカホリック: 体力+30,メンタル-10",
      "ニート: 幸福+20"
    ]
  },
  "余暇": {
    description: "メンタルを回復し、趣味の効果を発動する。",
    details: [
      "基本: メンタル+50",
      "ニート: メンタル+100,幸福+20",
      "趣味効果も発動"
    ]
  },
  "学業": {
    description: "知力と勤勉を上昇させる。",
    details: [
      "体力コスト: 10 * (1-耐久/100)",
      "メンタルコスト: 10 * (1-勤勉/100)",
      "30%で知力上昇",
      "30%で勤勉上昇"
    ]
  },
  "鍛錬": {
    description: "筋力、耐久、勇気を上昇させる。",
    details: [
      "体力コスト: 20 * (1-耐久/100)",
      "メンタルコスト: 15 * (1-勤勉/100)",
      "40%で筋力上昇",
      "30%で耐久上昇",
      "20%で勇気上昇"
    ]
  },
  "看護": {
    description: "最も体力の低い村人を回復させる。",
    details: [
      "体力コスト: 20 * (1-耐久/100)",
      "メンタルコスト: 20 * (1-倫理/100)",
      "回復量 = 20 * (魔力/20) * (倫理/20)",
      "5%で魔力上昇",
      "5%で倫理上昇"
    ]
  },
  "シスター": {
    description: "全村人のメンタルを回復する。",
    details: [
      "体力コスト: 10 * (1-耐久/100)",
      "メンタルコスト: 30 * (1-倫理/100)",
      "回復量 = 5 * (魅力/20) * (倫理/20)",
      "5%で魅力上昇",
      "5%で倫理上昇"
    ]
  },
  "神官": {
    description: "全村人のメンタルを回復する。",
    details: [
      "体力コスト: 10 * (1-耐久/100)",
      "メンタルコスト: 30 * (1-倫理/100)",
      "回復量 = 5 * (魅力/20) * (倫理/20)",
      "5%で魅力上昇",
      "5%で倫理上昇"
    ]
  },
  "交換の奇跡": {
    description: "2人の肉体を交換する。",
    details: [
      "コスト: 20魔素",
      "村人同士のみ交換可能",
      "精神年齢と精神性別はそのまま"
    ]
  },
  "交換の奇跡・強": {
    description: "2人の肉体を交換する（村外可）。",
    details: [
      "コスト: 80魔素",
      "訪問者や襲擊者との交換も可能",
      "精神年齢と精神性別はそのまま"
    ]
  },
  "豊穣の奇跡": {
    description: "今月のみ全ての生産量が2倍になる。",
    details: [
      "コスト: 100魔素",
      "村特性に「豊穣」が付与される",
      "農作業、伐採、狩猟、漁、採集に効果"
    ]
  },
  "マナの奇跡": {
    description: "食料を得る。",
    details: [
      "コスト: 40魔素",
      "食料+80"
    ]
  },
  "クピドの奇跡": {
    description: "2人を強制的に結婚させる。",
    details: [
      "コスト: 80魔素",
      "通常の結婚条件を無視",
      "幸福+50",
      "已婚特性付与"
    ]
  },
  "宴会の奇跡": {
    description: "全員の状態を回復する。",
    details: [
      "コスト: 人数×15魔素",
      "人数×15資金も必要",
      "全員の体力/メンタル+30",
      "全員の幸福+20"
    ]
  },
  "狂宴の奇跡": {
    description: "全員の状態を大幅に回復するが倫理が下がる。",
    details: [
      "コスト: 人数×30魔素",
      "人数×30資金も必要",
      "全員の体力/メンタル+100",
      "全員の幸福+50",
      "全員の倫理70%減少",
      "全員の好色+15"
    ]
  },
  "癒しの奇跡": {
    description: "1人の状態異常を回復する。",
    details: [
      "コスト: 80魔素",
      "体力/メンタル+50",
      "負傷、疲労、過労、飢餓、心労、抑鬱を回復"
    ]
  },
  "戦神の奇跡": {
    description: "1人に火星の加護を付与する。",
    details: [
      "コスト: 10魔素",
      "3ヶ月継続",
      "筋力・耐久・勇気が1.6倍",
      "知力・勤勉・倫理が0.2倍"
    ]
  },
  "竈女神の奇跡": {
    description: "恋人同士を結婚させる。",
    details: [
      "コスト: 60魔素",
      "恋人がいない場合は30魔素返還",
      "幸福+50",
      "已婚特性付与"
    ]
  },
  "常春の奇跡": {
    description: "村を春に固定する。",
    details: [
      "コスト: 300魔素",
      "村特性を春に固定",
      "夏、秋、冬、冷夏、飛蝗、厳冬、疫病流行を除去"
    ]
  },
  "旅人の奇跡": {
    description: "ランダムな訪問者を生成する。",
    details: [
      "コスト: 60魔素",
      "訪問者1名を生成",
      "村特性に「訪問者」が付与"
    ]
  },
  "出立の奇跡": {
    description: "1人を村から離脱させ魔素を得る。",
    details: [
      "コスト: 20魔素",
      "対象の幸福度分の魔素を獲得",
      "対象は村から離脱"
    ]
  },
  // 身体特性
  "老人": {
    description: "60歳以上の特性。身体能力が大きく低下する。",
    details: [
      "筋力: 50%",
      "耐久: 50%",
      "魅力: 50%",
      "休養効果: 70%"
    ]
  },
  "中年": {
    description: "40歳以上の特性。身体能力が低下する。",
    details: [
      "筋力: 75%",
      "耐久: 75%",
      "魅力: 75%",
      "休養効果: 90%"
    ]
  },
  "ニート": {
    description: "休養や余暇の効果が高い。",
    details: [
      "休養時: 幸福+20",
      "余暇時: メンタル+100(通常50),幸福+20",
      "サボり時: 体力+40,メンタル+40,幸福+20"
    ]
  },
  "ワーカホリック": {
    description: "休養が苦手。",
    details: [
      "休養時: 体力+30,メンタル-10",
      "勤勉23以上で30%の確率で付与"
    ]
  },
  "非戦主義": {
    description: "戦闘を好まない平和主義者。",
    details: [
      "倫理25以上で50%の確率で付与",
      "襲擊戦闘で不利"
    ]
  },
  "聖女の輝き": {
    description: "高い倫理性と清らかさを持つ女性の特性。",
    details: [
      "女性のみ",
      "倫理23以上、好色12以下で50%の確率で付与",
      "シスター、神官の効果上昇"
    ]
  },
  "繊細な指": {
    description: "手先が器用な特性。",
    details: [
      "器用22以上、魅力22以上で10%の確率で付与",
      "魔法細工、内職の効果上昇"
    ]
  },
  "寒がり": {
    description: "寒さに弱い特性。",
    details: [
      "筋力12以下、耐久12以下で10%の確率で付与",
      "冬季の生産性低下"
    ]
  },
  "大食い": {
    description: "食料消費が多い特性。",
    details: [
      "耐久22以上、魅力16以下で10%の確率で付与",
      "食料消費量増加"
    ]
  },
  "小食": {
    description: "食料消費が少ない特性。",
    details: [
      "耐久12以下で10%の確率で付与",
      "食料消費量減少"
    ]
  },
  "澄んだ声": {
    description: "美しい声を持つ特性。",
    details: [
      "女性のみ",
      "魅力25以上で10%の確率で付与",
      "詩人、踊り子、シスター、神官の効果1.2倍"
    ]
  },
  "通る声": {
    description: "力強い声を持つ特性。",
    details: [
      "魅力20以上、勇気20以上、倫理20以上で30%の確率で付与",
      "詩人、踊り子、シスター、神官の効果1.2倍"
    ]
  },
  "酒豪": {
    description: "酒に強い特性。",
    details: [
      "耐久25以上、魅力16以上、好色18以上で10%の確率で付与",
      "宴会、狂宴の効果上昇"
    ]
  },
  "汗かき": {
    description: "汗をかきやすい特性。",
    details: [
      "耐久24以上、魅力12以下で20%の確率で付与",
      "夏季の生産性低下"
    ]
  },
  // 精神特性
  "才女": {
    description: "知的で勤勉な女性の特性。",
    details: [
      "女性のみ",
      "知力20以上、勤勉18以上、倫理16以上",
      "学業、研究の効果上昇"
    ]
  },
  "才色兼備": {
    description: "知的で美しい女性の特性。",
    details: [
      "女性のみ",
      "知力20以上、魅力22以上",
      "学業、研究、接客の効果上昇"
    ]
  },
  "仕事の鬼": {
    description: "極度の働き者。",
    details: [
      "勤勉24以上",
      "全ての生産作業の効果上昇",
      "休養効果低下"
    ]
  },
  "マッド": {
    description: "狂気的な知性を持つ。",
    details: [
      "知力24以上、倫理9以下",
      "研究、魔法細工の効果上昇"
    ]
  },
  "豪傑": {
    description: "力と勇気を兼ね備えた者。",
    details: [
      "筋力24以上、勇気24以上",
      "戦闘能力大幅上昇",
      "狩猟の効果上昇"
    ]
  },
  "職人気質": {
    description: "物作りに長けている。",
    details: [
      "器用20以上、勤勉20以上",
      "内職、魔法細工の効果上昇"
    ]
  },
  // 職業熟練特性
  "熟練農夫": {
    description: "農作業に熟練した特性。",
    details: [
      "農作業の生産量1.3倍"    
    ]
  },
  "達人農夫": {
    description: "農作業の達人としての特性。",
    details: [
      "農作業の生産量1.5倍",
      "熟練農夫から更に経験を積むと獲得"
    ]
  },
  "熟練木樵": {
    description: "伐採に熟練した特性。",
    details: [
      "伐採の生産量1.3倍"
    ]
  },
  "達人木樵": {
    description: "伐採の達人としての特性。",
    details: [
      "伐採の生産量1.5倍",
      "熟練木樵から更に経験を積むと獲得"
    ]
  },
  "熟練狩人": {
    description: "狩猟に熟練した特性。",
    details: [
      "狩猟の生産量1.3倍"
    ]
  },
  "達人狩人": {
    description: "狩猟の達人としての特性。",
    details: [
      "狩猟の生産量1.5倍",
      "熟練狩人から更に経験を積むと獲得"
    ]
  },
  "熟練漁師": {
    description: "漁に熟練した特性。",
    details: [
      "漁の生産量1.3倍"
    ]
  },
  "達人漁師": {
    description: "漁の達人としての特性。",
    details: [
      "漁の生産量1.5倍",
      "熟練漁師から更に経験を積むと獲得"
    ]
  },
  // 魔法的特性
  "大地の巫女": {
    description: "大地の力を操る巫女としての特性。",
    details: [
      "女性のみ",
      "農作業の生産量1.5倍"
    ]
  },
  "月の巫女": {
    description: "月の力を操る巫女としての特性。",
    details: [
      "女性のみ",
      "狩猟の生産量1.5倍"
    ]
  },
    "飛行": {
    description: "空を飛ぶ能力を持つ特性。",
    details: [
      "狩猟の生産量1.2倍",
      "採集の生産量1.2倍"
    ]
  },
  "水中呼吸": {
    description: "水中で呼吸できる特性。",
    details: [
      "漁の生産量1.5倍"
    ]
  },
  "森の知恵": {
    description: "森での生活に長けた特性。",
    details: [
      "採集の生産量1.5倍"
    ]
  },
  "海の知恵": {
    description: "海での生活に長けた特性。",
    details: [
      "漁の生産量1.5倍"
    ]
  },
  "踊り子": {
    description: "踊りで村人を癒す女性専用の職業。",
    details: [
      "体力コスト: 20 * (1-耐久/100)",
      "メンタルコスト: 20 * (1-好色/100)",
      "男性村人の幸福度上昇",
      "回復量 = 10 * (魅力/20) * (好色/20)",
      "5%で魅力上昇",
      "5%で好色上昇"
      
    ]
  },
  "詩人": {
    description: "詩や歌で村人を癒す男性専用の職業。",
    details: [
      "体力コスト: 20 * (1-耐久/100)",
      "メンタルコスト: 20 * (1-勤勉/100)",
      "女性村人の幸福度上昇",
      "回復量 = 10 * (魅力/20) * (魅力/20)",
      "5%で魅力上昇"
      
    ]
  },
  // 新しい仕事の辞書データを追加
  "バニー": {
    description: "精神性別が男性の村人全員の幸福度とメンタルを回復する仕事。女性限定。",
    details: [
      "酒場建設で解放",
      "体力コスト: 20 * (1-耐久/100)",
      "メンタルコスト: 20 * (1-好色/100)",
      "幸福度上昇量: 6 * (魅力/20) * (好色/20)",
      "メンタル回復量: 6 * (魅力/20) * (好色/20)",
      "1%で魅力上昇",
      "1%で好色上昇"
    ]
  },
  "巫女": {
    description: "魔素を増やす仕事。女性限定。",
    details: [
      "礼拝堂建設で解放",
      "体力コスト: 20 * (1-耐久/100)",
      "メンタルコスト: 20 * (1-好色/100)",
      "魔素増加量: 10 * (魅力/20) * (魔力/20) * (好色/20)",
      "1%で魅力上昇",
      "1%で好色上昇"
    ]
  },
  "あんま": {
    description: "体力が最も低い村人を回復する仕事。",
    details: [
      "体力コスト: 20 * (1-耐久/100)",
      "男性の場合:",
      "- メンタルコスト: 20 * (1-勤勉/100)",
      "- 回復量: 24 * (筋力/20) * (器用/20)",
      "- 1%で筋力上昇",
      "- 1%で器用上昇",
      "女性の場合:",
      "- メンタルコスト: 20 * (1-好色/100)",
      "- 回復量: 24 * (魅力/20) * (好色/20)",
      "- 1%で魅力上昇",
      "- 1%で好色上昇",
      "診療所があれば効果1.2倍"
    ]
  },
  "写本": {
    description: "資金と技術を増やす仕事。",
    details: [
      "図書館建設で解放",
      "体力コスト: 20 * (1-耐久/100)",
      "メンタルコスト: 20 * (1-勤勉/100)",
      "資金増加量: 24 * (器用/20) * (知力/20)",
      "技術増加量: 24 * (器用/20) * (知力/20)",
      "1%で器用上昇",
      "1%で知力上昇"
    ]
  },
  "醸造": {
    description: "食料と魔素を増やす仕事。",
    details: [
      "醸造所建設で解放",
      "体力コスト: 20 * (1-耐久/100)",
      "メンタルコスト: 20 * (1-勤勉/100)",
      "食料増加量: 24 * (魔力/20) * (勤勉/20)",
      "魔素増加量: 5 * (魔力/20) * (勤勉/20)",
      "1%で魔力上昇",
      "1%で勤勉上昇"
    ]
  },
  "錬金術": {
    description: "資金と技術を増やす仕事。",
    details: [
      "錬金工房建設で解放",
      "体力コスト: 20 * (1-耐久/100)",
      "メンタルコスト: 20 * (1-知力/100)",
      "資金増加量: 24 * (魔力/20) * (知力/20)",
      "技術増加量: 24 * (魔力/20) * (知力/20)",
      "1%で魔力上昇",
      "1%で知力上昇"
    ]
  },
  "機織り": {
    description: "資金を増やす仕事。",
    details: [
      "機織小屋建設で解放",
      "体力コスト: 20 * (1-耐久/100)",
      "メンタルコスト: 20 * (1-勤勉/100)",
      "資金増加量: 30 * (器用/20) * (勤勉/20)",
      "1%で器用上昇",
      "1%で勤勉上昇"
    ]
  },
  // 建築物の辞書データを追加
  "酒場": {
    description: "娯楽施設。",
    details: [
      "資材: 50",
      "資金: 50",
      "技術: 0",
      "詩人・踊り子の効果1.2倍",
      "訪問者の最大人数が2人に",
      "女性限定「バニー」仕事解放",
      "規模+20"
    ]
  },
  "礼拝堂": {
    description: "信仰施設。",
    details: [
      "資材: 50",
      "資金: 50",
      "技術: 0",
      "シスター・神官の効果1.2倍",
      "女性限定「巫女」仕事解放",
      "規模+30"
    ]
  },
  "診療所": {
    description: "医療施設。",
    details: [
      "資材: 50",
      "資金: 0",
      "技術: 100",
      "看護の効果1.2倍",
      "「あんま」仕事解放",
      "規模+20"
    ]
  },
  "図書館": {
    description: "教育施設。",
    details: [
      "資材: 50",
      "資金: 50",
      "技術: 100",
      "研究の効果1.2倍",
      "「写本」仕事解放",
      "規模+30"
    ]
  },
  "醸造所": {
    description: "酒造施設。",
    details: [
      "資材: 50",
      "資金: 100",
      "技術: 300",
      "「醸造」仕事解放",
      "規模+40"
    ]
  },
  "錬金工房": {
    description: "錬金施設。",
    details: [
      "資材: 50",
      "資金: 100",
      "技術: 200",
      "「錬金術」仕事解放",
      "規模+40"
    ]
  },
  "機織小屋": {
    description: "織物施設。",
    details: [
      "資材: 50",
      "資金: 50",
      "技術: 100",
      "「機織り」仕事解放",
      "規模+20"
    ]
  },
  "勧誘": {
    description: "訪問者を村人として勧誘する。",
    details: [
      "成功率: coefficient * (魅力/20) * (知力/20) * 100%",
      "- coefficientは訪問者タイプによる係数:",
      "  - 流民: 0.8",
      "  - 巡礼者: 0.2",
      "  - 冒険者: 0.4",
      "  - 旅人: 0.4",
      "  - 学者: 0.2",
      "  - 観光客: 0.4",
      "  - 行商人: 0.2",
      "村の人口が上限に達している場合は実行不可",
      "成功すると訪問者が村人になる",
      "失敗すると訪問者に「勧誘失敗」特性が付与"
    ]
  },
  "誘惑": {
    description: "訪問者を魅了して村人として勧誘する。",
    details: [
      "条件:",
      "- 誘惑者の好色が21以上必要",
      "- 誘惑者の肉体性別と訪問者の精神性別が異なる必要あり",
      "成功率: coefficient * (魅力/20) * (好色/20) * 100%",
      "- coefficientは訪問者タイプによる係数:",
      "  - 流民: 0.8",
      "  - 巡礼者: 0.2",
      "  - 冒険者: 0.4",
      "  - 旅人: 0.4",
      "  - 学者: 0.2",
      "  - 観光客: 0.4",
      "  - 行商人: 0.2",
      "村の人口が上限に達している場合は実行不可",
      "成功すると訪問者が村人になる",
      "失敗すると訪問者に「勧誘失敗」特性が付与"
    ]
  },
  "迎撃": {
    description: "襲擊者との戦闘を行う行動。",
    details: [
      "ダメージ計算:",
      "- 物理ダメージ = ((筋力 * 勇気) / 400) * 50 - 相手の耐久",
      "- 魔法ダメージ = ((魔力 * 勇気) / 400) * 25",
      "- 物理と魔法のうち高いほうが適用される",
      "HP0になると戦闘離脱",
      "- 「負傷」特性が付与される"
    ]
  },
  "罠作成": {
    description: "襲擊者に対して罠を仕掛ける行動。",
    details: [
      "ダメージ計算:",
      "- ダメージ = (器用 * 知力 / 400) * 30",
      "- 敵をランダムに1体選んで攻撃",
      "- 敵のHPが0になれば撃破",
      "罠作成は襲擊イベントの最初のフェーズで行われる"
    ]
  },
};

export function searchDictionary() {
  const searchTerm = document.getElementById("dictionarySearch").value.trim();
  const contentDiv = document.getElementById("dictionaryContent");
  
  if (!searchTerm) {
    contentDiv.innerHTML = "<p>キーワードを入力してください</p>";
    return;
  }

  const matches = Object.entries(dictionaryData)
    .filter(([key]) => key.includes(searchTerm));

  if (matches.length === 0) {
    contentDiv.innerHTML = "<p>該当する項目が見つかりません</p>";
    return;
  }

  contentDiv.innerHTML = matches.map(([key, data]) => `
    <div style="margin-bottom: 15px;">
      <h3 style="margin: 0 0 5px 0;">${key}</h3>
      <p style="margin: 0 0 5px 0;">${data.description}</p>
      <ul style="margin: 0; padding-left: 20px;">
        ${data.details.map(detail => `<li>${detail}</li>`).join("")}
      </ul>
    </div>
  `).join("");
}

// グローバルに公開
window.searchDictionary = searchDictionary; 