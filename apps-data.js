// ==========================================================================
// アプリカタログ用データ生成（100個・シード固定で再現性あり）
// ==========================================================================

(function (global) {
  'use strict';

  // --- 再現性のある疑似乱数生成器（Mulberry32） ---
  function mulberry32(seed) {
    return function () {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const rand = mulberry32(20260706);

  function pick(arr) {
    return arr[Math.floor(rand() * arr.length)];
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // --- アプリ名の素材 ---
  const adjectives = [
    'Zen', 'Swift', 'Bright', 'Pure', 'Nova', 'Aqua', 'Solar', 'Luna', 'Vivid', 'Prime',
    'Echo', 'Cloud', 'Spark', 'Crystal', 'Silent', 'Golden', 'Urban', 'Wild', 'Cosmic', 'Gentle',
    'Noble', 'Velvet', 'Amber', 'Azure', 'Coral', 'Ember', 'Frost', 'Ivory', 'Jade', 'Opal'
  ];
  const nouns = [
    'Note', 'Track', 'Flow', 'Mind', 'Pulse', 'Wallet', 'Journal', 'Chat', 'Studio', 'Planner',
    'Guard', 'Map', 'Beat', 'Focus', 'Trail', 'Kit', 'Hub', 'Space', 'Loop', 'Vault',
    'Lens', 'Diary', 'Coach', 'Board', 'Nest', 'Path', 'Signal', 'Canvas', 'Sync', 'Anchor'
  ];

  // --- カテゴリと説明テンプレート ---
  const categories = [
    {
      name: '生産性', icon: '📋',
      templates: [
        'タスクとスケジュールを一元管理し、毎日の仕事をスマートに整理できるアプリです。',
        'チームでの共同作業を加速するシンプルで美しいワークスペースを提供します。',
        '重要な予定やアイデアを逃さず記録できる、洗練されたノートアプリです。'
      ]
    },
    {
      name: 'ヘルスケア', icon: '❤️',
      templates: [
        '毎日の体調管理を優雅にサポートする、パーソナルヘルスコンパニオン。',
        '睡眠と休息の質を高めるための穏やかなガイダンスを提供します。',
        '心と身体のバランスを整えるマインドフルネス体験を届けます。'
      ]
    },
    {
      name: 'フィットネス', icon: '🏋️',
      templates: [
        '自分だけのトレーニングプランで理想の身体づくりを後押しします。',
        '運動記録を美しく可視化し、モチベーションを保つフィットネスアプリ。',
        'プロのコーチ監修プログラムで自宅でも本格的な運動が楽しめます。'
      ]
    },
    {
      name: '教育', icon: '🎓',
      templates: [
        'すきま時間で語学力を磨ける、上質な学習体験を提供します。',
        '専門家による講座を好きな時間に受講できるラーニングアプリ。',
        '知識を体系的に整理し、学びを習慣化するためのツールです。'
      ]
    },
    {
      name: '写真', icon: '📷',
      templates: [
        'プロ品質の編集ツールで、あなたの一枚を特別な作品に仕上げます。',
        '洗練されたフィルターとレイアウトで思い出を美しく残せます。',
        '直感的な操作で高品質なレタッチができる写真編集アプリ。'
      ]
    },
    {
      name: '音楽', icon: '🎵',
      templates: [
        '上質なサウンドと心地よいUIで、音楽体験をワンランク上に。',
        'お気に入りの一曲をどこまでも美しく楽しむための音楽プレイヤー。',
        '作曲からミキシングまで、本格的な音楽制作を手軽に始められます。'
      ]
    },
    {
      name: 'ファイナンス', icon: '💳',
      templates: [
        '家計と資産をエレガントに可視化するパーソナルファイナンスアプリ。',
        '賢い資産運用をサポートする、信頼性の高い金融ツールです。',
        '支出を美しいグラフで管理し、貯蓄目標の達成を後押しします。'
      ]
    },
    {
      name: 'ソーシャル', icon: '💬',
      templates: [
        '大切な人とのつながりを、より豊かに演出するコミュニケーションアプリ。',
        '洗練されたデザインで、心地よい交流の場を提供します。',
        '写真や近況をスタイリッシュに共有できるソーシャルプラットフォーム。'
      ]
    },
    {
      name: 'ユーティリティ', icon: '🛠️',
      templates: [
        '日常の細やかな作業を効率化する、洗練されたツール集です。',
        'シンプルながら奥深い機能で、毎日をスマートにサポートします。',
        '必要な機能だけを美しくまとめた、上質なユーティリティアプリ。'
      ]
    },
    {
      name: '旅行', icon: '✈️',
      templates: [
        '旅程を優雅に計画し、忘れられない旅の思い出づくりを支えます。',
        '世界中の隠れた名所を、上質なガイドとともに巡れます。',
        '旅先の記録を美しく整理できる、トラベラーのためのアプリ。'
      ]
    },
    {
      name: 'フード', icon: '🍽️',
      templates: [
        '厳選されたレシピで、毎日の食卓を特別なひとときに変えます。',
        'お気に入りのレストランを上質にキュレーションしてお届けします。',
        '栄養バランスを整えながら、美味しい暮らしを提案するアプリ。'
      ]
    },
    {
      name: 'エンタメ', icon: '🎬',
      templates: [
        '上質なコンテンツを、洗練されたインターフェースで楽しめます。',
        'こだわりの演出で、日々のひとときに彩りを添えるエンタメアプリ。',
        'あなた好みの作品に出会える、洗練されたレコメンド体験。'
      ]
    },
    {
      name: 'ライフスタイル', icon: '🕯️',
      templates: [
        '上質な暮らしを叶えるための、こだわり抜かれたライフスタイルアプリ。',
        '日々の習慣を美しく整え、豊かな毎日をデザインします。',
        '心地よい空間づくりのアイデアを、優雅に提案してくれます。'
      ]
    },
    {
      name: 'ニュース', icon: '📰',
      templates: [
        '信頼できる情報源から、洗練されたレイアウトでニュースをお届け。',
        '本当に必要な情報だけを厳選してお届けするニュースアプリ。',
        '世界の動向を上質な誌面デザインで読み解くことができます。'
      ]
    },
    {
      name: 'ビジネス', icon: '💼',
      templates: [
        'エグゼクティブのための、洗練されたビジネスツールです。',
        '商談や会議の記録を美しく整理し、業務の質を高めます。',
        'チームの生産性を最大化する、上質なビジネスプラットフォーム。'
      ]
    }
  ];

  const priceOptions = [
    { label: '無料', weight: 70 },
    { label: '¥250', weight: 8 },
    { label: '¥370', weight: 6 },
    { label: '¥490', weight: 5 },
    { label: '¥730', weight: 4 },
    { label: '¥980', weight: 4 },
    { label: '¥1,500', weight: 3 }
  ];

  function weightedPrice() {
    return '無料';
  }

  // --- 100個分の名前をユニークに生成 ---
  const allCombos = [];
  adjectives.forEach((a) => {
    nouns.forEach((n) => {
      allCombos.push(a + ' ' + n);
    });
  });
  const chosenNames = shuffle(allCombos).slice(0, 100);

  const APPS = chosenNames.map((name, i) => {
    const cat = pick(categories);
    const rating = (3.7 + rand() * 1.3).toFixed(1);
    const reviews = Math.floor(200 + rand() * 98000);
    const downloadsPool = ['1,000+', '5,000+', '1万+', '5万+', '10万+', '50万+', '100万+', '500万+', '1000万+'];
    const downloads = pick(downloadsPool);
    const description = pick(cat.templates);
    const version = `${1 + Math.floor(rand() * 6)}.${Math.floor(rand() * 10)}.${Math.floor(rand() * 10)}`;
    const hue = Math.floor(rand() * 360);

    return {
      id: i + 1,
      name: 'Currently in Development',
      category: '現在開発中',
      icon: cat.icon,
      rating: 5,
      reviews: reviews,
      downloads: downloads,
      price: weightedPrice(),
      description: description,
      version: version,
      hue: hue
    };
  });

  const CATEGORY_NAMES = ['すべて', '現在開発中'];

  global.CATALOG_APPS = APPS;
  global.CATALOG_CATEGORIES = CATEGORY_NAMES;
})(window);
