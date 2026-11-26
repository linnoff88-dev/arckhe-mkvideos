/**
 * lib/storytree-classify.js
 *
 * Auto-classificaçêo de image_class a partir do prompt original que gerou
 * a imagem. Zero chamada API — keyword matching com prioridade.
 *
 * Returns one of: face | landscape | product | document | object_small |
 *                 abstract | dark | group | architecture | map | unknown
 */

// keywords (em PT e EN) → image_class. Ordem importa: primeira matcheada vence.
const RULES = [
  // GROUP — múltiplas pessoas explícitas (vem antes de FACE pra nêo pegar 1 só)
  {
    cls: 'group',
    patterns: [
      /\b(group|family|crowd|crowd|people together|two\s+people|three\s+people|family of|abraçados|família|grupo|multidêo|todos|amigos juntos|com a família|together holding)\b/i,
    ],
  },

  // FACE — close-up de pessoa, expressêo, olhos
  {
    cls: 'face',
    patterns: [
      /\b(face|portrait|close[- ]?up|eyes|expression|smiling|tearful|crying|rosto|cara|sorriso|chorando|expressêo|olhos|retrato)\b/i,
      /\b(her face|his face|child face|woman.*close|man.*close)\b/i,
    ],
  },

  // ARCHITECTURE — construçêo, prédio, vila
  {
    cls: 'architecture',
    patterns: [
      /\b(building|church|cathedral|temple|tower|castle|monastery|interior|room|kitchen|bedroom|hallway|fa[cç]ade|prédio|igreja|catedral|torre|castelo|quarto|sala|cozinha|interior|fachada|casa de|villa|chalet)\b/i,
    ],
  },

  // DOCUMENT — texto, manuscrito, foto antiga, cartêo
  {
    cls: 'document',
    patterns: [
      /\b(document|manuscript|letter|book|page|newspaper|photo album|old photo|sepia|postcard|note|map|scroll|carta|livro|jornal|álbum|foto antiga|cartêo|postal|manuscrito)\b/i,
    ],
  },

  // MAP — mapa específico
  {
    cls: 'map',
    patterns: [
      /\b(map|cartograph|world map|atlas|terrain map|mapa|cartograf|atlas)\b/i,
    ],
  },

  // OBJECT_SMALL — objeto destacado, foco
  {
    cls: 'object_small',
    patterns: [
      /\b(close[- ]?up of (a|an|the)\s+\w+|object|item|product|cup|mug|book|key|ring|coin|small detail|insert shot|detail shot|xícara|caneca|chave|anel|moeda|copo|objeto|item|produto|detalhe)\b/i,
    ],
  },

  // LANDSCAPE — paisagem, cenário aberto
  {
    cls: 'landscape',
    patterns: [
      /\b(landscape|wide shot|panorama|forest|mountain|valley|beach|ocean|sea|sky|sunset|sunrise|horizon|street|park|field|paisagem|panorâmica|floresta|montanha|vale|praia|oceano|mar|céu|pôr do sol|amanhecer|horizonte|rua|parque|campo|estrada|cidade|vista)\b/i,
    ],
  },

  // ABSTRACT — abstrato, textura
  {
    cls: 'abstract',
    patterns: [
      /\b(abstract|texture|pattern|geometric|shapes|artistic composition|painterly|artwork|abstrato|textura|padrêo|geométrico|formas)\b/i,
    ],
  },

  // PRODUCT — produto comercial específico (raro fora de marketing)
  {
    cls: 'product',
    patterns: [
      /\b(product shot|commercial product|brand|packaging|bottle|box|product photography|produto comercial|marca|embalagem|garrafa)\b/i,
    ],
  },
];

// DARK é flag adicional (aplicada DEPOIS) — modifica image_class quando muito escuro
const DARK_PATTERNS = [
  /\b(dark|night|shadow|shadowy|moonlight|midnight|gloomy|sombra|escuro|noite|sombrio|tenebroso|sinistro|misterioso)\b/i,
];

/**
 * Classifica image_class a partir de um prompt textual.
 * @param {string} prompt — texto descrevendo a imagem
 * @param {object} opts — { defaultClass, allowDarkOverride }
 * @returns {string} — image_class
 */
function classifyImageClass(prompt, opts = {}) {
  const { defaultClass = 'unknown', allowDarkOverride = true } = opts;
  if (!prompt || typeof prompt !== 'string') return defaultClass;

  const text = prompt.toLowerCase();

  // 1. tenta cada regra na ordem
  for (const rule of RULES) {
    for (const re of rule.patterns) {
      if (re.test(prompt)) {
        // 2. dark override — se o prompt é muito sombrio, vira `dark`
        if (allowDarkOverride && rule.cls === 'landscape') {
          for (const dre of DARK_PATTERNS) {
            if (dre.test(prompt)) return 'dark';
          }
        }
        return rule.cls;
      }
    }
  }

  // 3. fallback: se tem dark mas sem outra match, classify as dark
  if (allowDarkOverride) {
    for (const dre of DARK_PATTERNS) {
      if (dre.test(prompt)) return 'dark';
    }
  }

  return defaultClass;
}

/**
 * Classifica em batch um array de { prompt } → adiciona { image_class }.
 */
function classifyBatch(items, opts) {
  return items.map((it) => ({
    ...it,
    image_class: classifyImageClass(it.prompt || it.description || '', opts),
  }));
}

module.exports = { classifyImageClass, classifyBatch };
