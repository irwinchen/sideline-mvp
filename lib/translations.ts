type TranslationType = {
  [key: string]: {
    es: string; // Spanish
    zh: string; // Chinese
    ja: string; // Japanese
  };
};

export const restrictionTranslations: TranslationType = {
  // Common allergens
  peanuts: {
    es: "cacahuetes",
    zh: "花生",
    ja: "ピーナッツ",
  },
  "tree nuts": {
    es: "frutos secos",
    zh: "坚果",
    ja: "ナッツ類",
  },
  shellfish: {
    es: "mariscos",
    zh: "贝类",
    ja: "貝類",
  },
  fish: {
    es: "pescado",
    zh: "鱼",
    ja: "魚",
  },
  dairy: {
    es: "lácteos",
    zh: "乳制品",
    ja: "乳製品",
  },
  eggs: {
    es: "huevos",
    zh: "鸡蛋",
    ja: "卵",
  },
  soy: {
    es: "soja",
    zh: "大豆",
    ja: "大豆",
  },
  wheat: {
    es: "trigo",
    zh: "小麦",
    ja: "小麦",
  },
  gluten: {
    es: "gluten",
    zh: "麸质",
    ja: "グルテン",
  },
  sesame: {
    es: "sésamo",
    zh: "芝麻",
    ja: "ごま",
  },

  // Common dietary restrictions
  "red meat": {
    es: "carne roja",
    zh: "红肉",
    ja: "赤身肉",
  },
  pork: {
    es: "cerdo",
    zh: "猪肉",
    ja: "豚肉",
  },
  beef: {
    es: "carne de res",
    zh: "牛肉",
    ja: "牛肉",
  },
  chicken: {
    es: "pollo",
    zh: "鸡肉",
    ja: "鶏肉",
  },
  seafood: {
    es: "mariscos",
    zh: "海鲜",
    ja: "魚介類",
  },
  // Adding translations for peppers and black pepper
  peppers: {
    es: "pimientos",
    zh: "辣椒",
    ja: "ピーマン",
  },
  "black pepper": {
    es: "pimienta negra",
    zh: "黑胡椒",
    ja: "黒コショウ",
  },

  // UI text
  "Cannot Eat": {
    es: "No Puedo Comer",
    zh: "不能吃",
    ja: "食べられないもの",
  },
  "Will Not Eat": {
    es: "Prefiero No Comer",
    zh: "不想吃",
    ja: "食べたくないもの",
  },
  "No dietary restrictions added yet.": {
    es: "Aún no se han agregado restricciones dietéticas.",
    zh: "尚未添加饮食限制。",
    ja: "まだ食事制限が追加されていません。",
  },
  "Your restrictions will appear here as you chat.": {
    es: "Sus restricciones aparecerán aquí mientras chatea.",
    zh: "您的饮食限制将在聊天时显示在这里。",
    ja: "チャットしながら、あなたの食事制限がここに表示されます。",
  },
  SummaryCannotOnly: {
    es: "Tengo restricciones dietéticas que me gustaría que se respeten. No puedo comer: {cannotEat}.",
    zh: "我有需要注意的饮食限制。我不能吃：{cannotEat}。",
    ja: "私には守っていただきたい食事制限があります。食べられないもの：{cannotEat}。",
  },
  SummaryBoth: {
    es: "Tengo restricciones dietéticas que me gustaría que se respeten. No puedo comer: {cannotEat}. Prefiero no comer: {willNotEat}.",
    zh: "我有需要注意的饮食限制。我不能吃：{cannotEat}。我不想吃：{willNotEat}。",
    ja: "私には守っていただきたい食事制限があります。食べられないもの：{cannotEat}。食べたくないもの：{willNotEat}。",
  },
};
