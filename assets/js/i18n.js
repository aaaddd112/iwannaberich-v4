(() => {
  "use strict";

  const STORAGE_KEY = "iwbr_language";
  const SUPPORTED = [
  "en",
  "es",
  "fr",
  "de",
  "pt",
  "zh",
  "ja",
  "ar"
];
  const RTL = new Set(["ar"]);
  const translations = {
  "en": {
    "nav.explore": "Explore",
    "nav.experiment": "The experiment",
    "nav.community": "Community",
    "nav.updates": "Updates",
    "nav.about": "About",
    "nav.numbers": "Numbers",
    "nav.plan": "The plan",
    "nav.milestones": "Milestones",
    "nav.why": "Why this exists",
    "nav.rules": "The rules",
    "nav.log": "The log",
    "nav.join": "Join the experiment",
    "nav.internet": "The internet",
    "nav.predictions": "Predictions",
    "nav.language": "Language",
    "footer.tagline": "Trying something absurd in public.",
    "footer.updates": "Updates",
    "footer.faq": "FAQ",
    "footer.about": "About",
    "footer.telegram": "Telegram",
    "footer.privacy": "Privacy",
    "footer.terms": "Terms",
    "support.eyebrow": "No expertise required",
    "support.title": "Will this<br>actually work?",
    "support.intro": "Vote once. Leave a prediction if you like. No account, no inbox, no promises that you will be right.",
    "support.yes": "YES",
    "support.no": "NO",
    "support.loadingVotes": "Loading votes...",
    "support.leave": "Leave a prediction",
    "support.placeholder": "I think this will work because...",
    "support.chars": "280 characters left",
    "support.post": "Post prediction",
    "support.loadingPredictions": "Loading predictions...",
    "support.firstVote": "Be the first to vote.",
    "support.votesSoFar": "{count} vote{plural} so far",
    "support.owner": "IWANNABERICH · OWNER",
    "script.progress": "{pct}% of the way there. Technically.",
    "script.progressEmpty": "The bar is ready. The money is taking its time.",
    "script.milestoneProgress": "{pct}% of the way to the current milestone.",
    "script.sinceLaunch": "+{amount} since launch.",
    "script.toGo": "{amount} to go.",
    "script.firstMilestoneComplete": "First €100 reached.",
    "script.unavailable": "Verified support is temporarily unavailable.",
    "script.updated": "Updated from publicly recorded support.",
    "script.next": "Next milestone: {milestone} — {remaining} to go.",
    "script.allMilestones": "All listed milestones cleared. The billion remains.",
    "script.unlocked": "UNLOCKED",
    "script.starting": "STARTING",
    "script.unknown": "???",
    "script.locked": "LOCKED",
    "script.noLedger": "No verified contributions yet.",
    "script.supportLabel": "Support",
    "script.ledgerUnavailable": "Public ledger temporarily unavailable.",
    "script.votes": "votes",
    "script.votesShort": "votes",
    "script.firstExperimentVote": "Be the first to vote.",
    "script.copied": "Copied",
    "script.shareMoment": "Share this moment"
  },
  "es": {
    "nav.explore": "Explorar",
    "nav.experiment": "El experimento",
    "nav.community": "Comunidad",
    "nav.updates": "Actualizaciones",
    "nav.about": "Acerca de",
    "nav.numbers": "Números",
    "nav.plan": "El plan",
    "nav.milestones": "Hitos",
    "nav.why": "Por qué existe",
    "nav.rules": "Las reglas",
    "nav.log": "El registro",
    "nav.join": "Únete al experimento",
    "nav.internet": "Internet",
    "nav.predictions": "Predicciones",
    "nav.language": "Idioma",
    "footer.tagline": "Intentando algo absurdo en público.",
    "footer.updates": "Actualizaciones",
    "footer.faq": "Preguntas frecuentes",
    "footer.about": "Acerca de",
    "footer.telegram": "Telegram",
    "footer.privacy": "Privacidad",
    "footer.terms": "Términos",
    "support.eyebrow": "No necesitas experiencia",
    "support.title": "¿Esto<br>funcionará de verdad?",
    "support.intro": "Vota una vez. Deja una predicción si quieres. Sin cuenta, sin bandeja de entrada y sin promesas de acertar.",
    "support.yes": "SÍ",
    "support.no": "NO",
    "support.loadingVotes": "Cargando votos...",
    "support.leave": "Deja una predicción",
    "support.placeholder": "Creo que esto funcionará porque...",
    "support.chars": "Quedan 280 caracteres",
    "support.post": "Publicar predicción",
    "support.loadingPredictions": "Cargando predicciones...",
    "support.firstVote": "Sé la primera persona en votar.",
    "support.votesSoFar": "{count} voto{plural} hasta ahora",
    "support.owner": "IWANNABERICH · PROPIETARIO"
  },
  "fr": {
    "nav.explore": "Explorer",
    "nav.experiment": "L’expérience",
    "nav.community": "Communauté",
    "nav.updates": "Actualités",
    "nav.about": "À propos",
    "nav.numbers": "Chiffres",
    "nav.plan": "Le plan",
    "nav.milestones": "Étapes",
    "nav.why": "Pourquoi ce projet existe",
    "nav.rules": "Les règles",
    "nav.log": "Le journal",
    "nav.join": "Rejoindre l’expérience",
    "nav.internet": "Internet",
    "nav.predictions": "Prédictions",
    "nav.language": "Langue",
    "footer.tagline": "Tenter quelque chose d’absurde en public.",
    "footer.updates": "Actualités",
    "footer.faq": "FAQ",
    "footer.about": "À propos",
    "footer.telegram": "Telegram",
    "footer.privacy": "Confidentialité",
    "footer.terms": "Conditions",
    "support.eyebrow": "Aucune expertise requise",
    "support.title": "Est-ce que ça<br>va vraiment marcher ?",
    "support.intro": "Votez une fois. Laissez une prédiction si vous voulez. Aucun compte, aucune boîte mail, aucune promesse d’avoir raison.",
    "support.yes": "OUI",
    "support.no": "NON",
    "support.loadingVotes": "Chargement des votes...",
    "support.leave": "Laisser une prédiction",
    "support.placeholder": "Je pense que ça marchera parce que...",
    "support.chars": "280 caractères restants",
    "support.post": "Publier la prédiction",
    "support.loadingPredictions": "Chargement des prédictions...",
    "support.firstVote": "Soyez le premier à voter.",
    "support.votesSoFar": "{count} vote{plural} pour le moment",
    "support.owner": "IWANNABERICH · PROPRIÉTAIRE"
  },
  "de": {
    "nav.explore": "Entdecken",
    "nav.experiment": "Das Experiment",
    "nav.community": "Community",
    "nav.updates": "Updates",
    "nav.about": "Über uns",
    "nav.numbers": "Zahlen",
    "nav.plan": "Der Plan",
    "nav.milestones": "Meilensteine",
    "nav.why": "Warum es das gibt",
    "nav.rules": "Die Regeln",
    "nav.log": "Das Protokoll",
    "nav.join": "Beim Experiment mitmachen",
    "nav.internet": "Das Internet",
    "nav.predictions": "Prognosen",
    "nav.language": "Sprache",
    "footer.tagline": "Ich versuche öffentlich etwas Absurdes.",
    "footer.updates": "Updates",
    "footer.faq": "FAQ",
    "footer.about": "Über uns",
    "footer.telegram": "Telegram",
    "footer.privacy": "Datenschutz",
    "footer.terms": "Impressum & Bedingungen",
    "support.eyebrow": "Keine Vorkenntnisse nötig",
    "support.title": "Wird das<br>wirklich funktionieren?",
    "support.intro": "Einmal abstimmen. Wenn du möchtest, eine Prognose hinterlassen. Kein Konto, kein Postfach, keine Garantie, dass du richtig liegst.",
    "support.yes": "JA",
    "support.no": "NEIN",
    "support.loadingVotes": "Stimmen werden geladen...",
    "support.leave": "Eine Prognose abgeben",
    "support.placeholder": "Ich glaube, dass das funktioniert, weil...",
    "support.chars": "Noch 280 Zeichen",
    "support.post": "Prognose posten",
    "support.loadingPredictions": "Prognosen werden geladen...",
    "support.firstVote": "Sei die erste Person, die abstimmt.",
    "support.votesSoFar": "{count} Stimme{plural} bisher",
    "support.owner": "IWANNABERICH · INHABER"
  },
  "pt": {
    "nav.explore": "Explorar",
    "nav.experiment": "O experimento",
    "nav.community": "Comunidade",
    "nav.updates": "Atualizações",
    "nav.about": "Sobre",
    "nav.numbers": "Números",
    "nav.plan": "O plano",
    "nav.milestones": "Marcos",
    "nav.why": "Por que isso existe",
    "nav.rules": "As regras",
    "nav.log": "O registro",
    "nav.join": "Entrar no experimento",
    "nav.internet": "A internet",
    "nav.predictions": "Previsões",
    "nav.language": "Idioma",
    "footer.tagline": "Tentando algo absurdo em público.",
    "footer.updates": "Atualizações",
    "footer.faq": "FAQ",
    "footer.about": "Sobre",
    "footer.telegram": "Telegram",
    "footer.privacy": "Privacidade",
    "footer.terms": "Termos",
    "support.eyebrow": "Nenhuma experiência necessária",
    "support.title": "Será que isso<br>vai funcionar mesmo?",
    "support.intro": "Vote uma vez. Deixe uma previsão se quiser. Sem conta, sem caixa de entrada e sem promessas de que você estará certo.",
    "support.yes": "SIM",
    "support.no": "NÃO",
    "support.loadingVotes": "Carregando votos...",
    "support.leave": "Deixe uma previsão",
    "support.placeholder": "Acho que isso vai funcionar porque...",
    "support.chars": "280 caracteres restantes",
    "support.post": "Publicar previsão",
    "support.loadingPredictions": "Carregando previsões...",
    "support.firstVote": "Seja a primeira pessoa a votar.",
    "support.votesSoFar": "{count} voto{plural} até agora",
    "support.owner": "IWANNABERICH · DONO"
  },
  "zh": {
    "nav.explore": "探索",
    "nav.experiment": "实验",
    "nav.community": "社区",
    "nav.updates": "更新",
    "nav.about": "关于",
    "nav.numbers": "数据",
    "nav.plan": "计划",
    "nav.milestones": "里程碑",
    "nav.why": "为什么做这件事",
    "nav.rules": "规则",
    "nav.log": "记录",
    "nav.join": "加入实验",
    "nav.internet": "互联网",
    "nav.predictions": "预测",
    "nav.language": "语言",
    "footer.tagline": "公开尝试一些荒唐的事情。",
    "footer.updates": "更新",
    "footer.faq": "常见问题",
    "footer.about": "关于",
    "footer.telegram": "Telegram",
    "footer.privacy": "隐私",
    "footer.terms": "条款",
    "support.eyebrow": "无需任何专业知识",
    "support.title": "这件事<br>真的能成功吗？",
    "support.intro": "投一次票。想的话也可以留下预测。不需要账号，没有收件箱，也没人保证你会猜对。",
    "support.yes": "是",
    "support.no": "否",
    "support.loadingVotes": "正在加载投票...",
    "support.leave": "留下预测",
    "support.placeholder": "我觉得这会成功，因为...",
    "support.chars": "还剩 280 个字符",
    "support.post": "发布预测",
    "support.loadingPredictions": "正在加载预测...",
    "support.firstVote": "成为第一个投票的人。",
    "support.votesSoFar": "目前有 {count} 票",
    "support.owner": "IWANNABERICH · 创建者"
  },
  "ja": {
    "nav.explore": "探索",
    "nav.experiment": "この実験について",
    "nav.community": "コミュニティ",
    "nav.updates": "更新",
    "nav.about": "概要",
    "nav.numbers": "数字",
    "nav.plan": "計画",
    "nav.milestones": "マイルストーン",
    "nav.why": "なぜ始めたのか",
    "nav.rules": "ルール",
    "nav.log": "記録",
    "nav.join": "実験に参加",
    "nav.internet": "インターネット",
    "nav.predictions": "予測",
    "nav.language": "言語",
    "footer.tagline": "ばかげたことを、公開で試しています。",
    "footer.updates": "更新",
    "footer.faq": "FAQ",
    "footer.about": "概要",
    "footer.telegram": "Telegram",
    "footer.privacy": "プライバシー",
    "footer.terms": "利用規約",
    "support.eyebrow": "専門知識は必要ありません",
    "support.title": "本当に<br>うまくいく？",
    "support.intro": "一度だけ投票してください。よければ予測も残せます。アカウント不要、受信箱もなし、正解の保証もありません。",
    "support.yes": "はい",
    "support.no": "いいえ",
    "support.loadingVotes": "投票を読み込んでいます...",
    "support.leave": "予測を残す",
    "support.placeholder": "これがうまくいくと思う理由は...",
    "support.chars": "残り280文字",
    "support.post": "予測を投稿",
    "support.loadingPredictions": "予測を読み込んでいます...",
    "support.firstVote": "最初の一票を入れてください。",
    "support.votesSoFar": "現在 {count} 票",
    "support.owner": "IWANNABERICH · OWNER"
  },
  "ar": {
    "nav.explore": "استكشف",
    "nav.experiment": "التجربة",
    "nav.community": "المجتمع",
    "nav.updates": "التحديثات",
    "nav.about": "عن المشروع",
    "nav.numbers": "الأرقام",
    "nav.plan": "الخطة",
    "nav.milestones": "المراحل",
    "nav.why": "لماذا يوجد هذا المشروع",
    "nav.rules": "القواعد",
    "nav.log": "السجل",
    "nav.join": "انضم إلى التجربة",
    "nav.internet": "الإنترنت",
    "nav.predictions": "التوقعات",
    "nav.language": "اللغة",
    "footer.tagline": "أحاول فعل شيء عبثي على مرأى الجميع.",
    "footer.updates": "التحديثات",
    "footer.faq": "الأسئلة الشائعة",
    "footer.about": "عن المشروع",
    "footer.telegram": "Telegram",
    "footer.privacy": "الخصوصية",
    "footer.terms": "الشروط",
    "support.eyebrow": "لا تحتاج إلى أي خبرة",
    "support.title": "هل سينجح هذا<br>حقًا؟",
    "support.intro": "صوّت مرة واحدة. واترك توقعًا إذا أردت. لا حساب، لا بريد وارد، ولا وعود بأنك ستكون على حق.",
    "support.yes": "نعم",
    "support.no": "لا",
    "support.loadingVotes": "جارٍ تحميل الأصوات...",
    "support.leave": "اترك توقعًا",
    "support.placeholder": "أعتقد أن هذا سينجح لأن...",
    "support.chars": "متبقي 280 حرفًا",
    "support.post": "نشر التوقع",
    "support.loadingPredictions": "جارٍ تحميل التوقعات...",
    "support.firstVote": "كن أول من يصوّت.",
    "support.votesSoFar": "{count} تصويت حتى الآن",
    "support.owner": "IWANNABERICH · المالك"
  }
};

  const phraseTranslations = {
  "Coming soon": {
    "es": "Próximamente",
    "fr": "Bientôt",
    "de": "Demnächst",
    "pt": "Em breve",
    "zh": "即将推出",
    "ja": "近日公開",
    "ar": "قريبًا"
  },
  "Membership is on the way.": {
    "es": "Las membresías están en camino.",
    "fr": "Les abonnements arrivent.",
    "de": "Mitgliedschaften kommen bald.",
    "pt": "As assinaturas estão a caminho.",
    "zh": "会员功能即将上线。",
    "ja": "メンバーシップは近日開始します。",
    "ar": "العضويات قادمة."
  },
  "Want to support the experiment on a recurring basis? Memberships are planned for a future milestone.": {
    "es": "¿Quieres apoyar el experimento de forma recurrente? Las membresías están previstas para un hito futuro.",
    "fr": "Vous voulez soutenir l’expérience régulièrement ? Les abonnements sont prévus pour une étape future.",
    "de": "Du möchtest das Experiment regelmäßig unterstützen? Mitgliedschaften sind für einen späteren Meilenstein geplant.",
    "pt": "Quer apoiar o experimento de forma recorrente? As assinaturas estão previstas para um marco futuro.",
    "zh": "想持续支持这项实验吗？会员功能计划在未来的某个里程碑推出。",
    "ja": "継続的に実験を支援したいですか？メンバーシップは将来のマイルストーンで導入予定です。",
    "ar": "هل تريد دعم التجربة بشكل متكرر؟ العضويات مخطط لها في مرحلة لاحقة."
  },
  "A public experiment in unreasonable ambition": {
    "es": "Un experimento público de ambición desmedida",
    "fr": "Une expérience publique d’ambition déraisonnable",
    "de": "Ein öffentliches Experiment mit maßloser Ambition",
    "pt": "Um experimento público de ambição absurda",
    "zh": "一场公开的非理性野心实验",
    "ja": "無謀な野心を公開で試す実験",
    "ar": "تجربة علنية لطموح غير منطقي"
  },
  "I'm trying to become": {
    "es": "Estoy intentando volverme",
    "fr": "J’essaie de devenir",
    "de": "Ich versuche,",
    "pt": "Estou tentando ficar",
    "zh": "我正在尝试成为",
    "ja": "私はなろうとしている",
    "ar": "أحاول أن أصبح"
  },
  "ridiculously rich.": {
    "es": "ridículamente rico.",
    "fr": "ridiculement riche.",
    "de": "absurd reich zu werden.",
    "pt": "ridiculamente rico.",
    "zh": "富得离谱的人。",
    "ja": "とんでもなく金持ちに。",
    "ar": "ثريًا بشكل مبالغ فيه."
  },
  "No startup. No crypto. No AI. Just a very public attempt to reach €1 billion. The strategy is mostly consistency, curiosity, and seeing what the internet does with a terrible idea.": {
    "es": "Sin startup. Sin criptomonedas. Sin IA. Solo un intento muy público de alcanzar 1.000 millones de euros. La estrategia consiste sobre todo en constancia, curiosidad y ver qué hace internet con una idea terrible.",
    "fr": "Pas de startup. Pas de crypto. Pas d’IA. Juste une tentative très publique d’atteindre 1 milliard d’euros. La stratégie repose surtout sur la constance, la curiosité et l’observation de ce qu’Internet fait d’une idée terrible.",
    "de": "Kein Startup. Keine Krypto. Keine KI. Nur der sehr öffentliche Versuch, 1 Milliarde Euro zu erreichen. Die Strategie besteht vor allem aus Konsequenz, Neugier und der Frage, was das Internet mit einer schlechten Idee macht.",
    "pt": "Sem startup. Sem cripto. Sem IA. Apenas uma tentativa muito pública de chegar a 1 bilhão de euros. A estratégia é principalmente consistência, curiosidade e descobrir o que a internet faz com uma ideia terrível.",
    "zh": "没有创业公司。没有加密货币。没有 AI。只有一次公开尝试，目标是达到 10 亿欧元。策略主要是坚持、好奇，以及看看互联网会如何对待一个糟糕的想法。",
    "ja": "スタートアップなし。暗号資産なし。AIなし。1,000,000,000ユーロを目指す、あまりにも公開された挑戦です。戦略はほぼ、継続、好奇心、そしてインターネットがこのひどいアイデアをどう扱うかを見ること。",
    "ar": "لا شركة ناشئة. لا عملات مشفرة. لا ذكاء اصطناعي. مجرد محاولة علنية جدًا للوصول إلى مليار يورو. الاستراتيجية هي الاستمرار والفضول ورؤية ما سيفعله الإنترنت بفكرة سيئة."
  },
  "Will it work? Probably not. Is that a reason not to document it? Also probably not.": {
    "es": "¿Funcionará? Probablemente no. ¿Es eso motivo para no documentarlo? Probablemente tampoco.",
    "fr": "Est-ce que ça marchera ? Probablement pas. Est-ce une raison pour ne pas le documenter ? Probablement pas non plus.",
    "de": "Wird es funktionieren? Wahrscheinlich nicht. Ist das ein Grund, es nicht zu dokumentieren? Wahrscheinlich auch nicht.",
    "pt": "Vai funcionar? Provavelmente não. Isso é motivo para não documentar? Provavelmente também não.",
    "zh": "会成功吗？大概不会。不记录它就有理由了吗？大概也没有。",
    "ja": "うまくいく？たぶん無理。でも記録しない理由になる？それもたぶん違う。",
    "ar": "هل سينجح؟ على الأرجح لا. هل هذا سبب لعدم توثيقه؟ على الأرجح لا أيضًا."
  },
  "MAKE A QUESTIONABLE DECISION": {
    "es": "TOMA UNA DECISIÓN CUESTIONABLE",
    "fr": "PRENEZ UNE DÉCISION DOUTEUSE",
    "de": "TRIFF EINE FRAGWÜRDIGE ENTSCHEIDUNG",
    "pt": "TOME UMA DECISÃO QUESTIONÁVEL",
    "zh": "做一个值得怀疑的决定",
    "ja": "怪しい決断をする",
    "ar": "اتخذ قرارًا مشكوكًا فيه"
  },
  "Read the terrible plan": {
    "es": "Lee el terrible plan",
    "fr": "Lire le plan terrible",
    "de": "Lies den schrecklichen Plan",
    "pt": "Leia o plano terrível",
    "zh": "看看这个糟糕的计划",
    "ja": "ひどい計画を読む",
    "ar": "اقرأ الخطة السيئة"
  },
  "The goal": {
    "es": "El objetivo",
    "fr": "L’objectif",
    "de": "Das Ziel",
    "pt": "O objetivo",
    "zh": "目标",
    "ja": "目標",
    "ar": "الهدف"
  },
  "One billion euros. Still the plan.": {
    "es": "Mil millones de euros. Ese sigue siendo el plan.",
    "fr": "Un milliard d’euros. Toujours le plan.",
    "de": "Eine Milliarde Euro. Das bleibt der Plan.",
    "pt": "Um bilhão de euros. Esse continua sendo o plano.",
    "zh": "10亿欧元。计划还是这个计划。",
    "ja": "10億ユーロ。それでも計画は変わらない。",
    "ar": "مليار يورو. ما زالت هذه هي الخطة."
  },
  "Share the delusion": {
    "es": "Comparte la ilusión",
    "fr": "Partagez le délire",
    "de": "Teile die Illusion",
    "pt": "Compartilhe a ilusão",
    "zh": "分享这个妄想",
    "ja": "妄想をシェアする",
    "ar": "شارك الوهم"
  },
  "No equity. No returns. No pitch deck hidden behind a PDF.": {
    "es": "Sin participación. Sin rentabilidad. Sin pitch deck escondido detrás de un PDF.",
    "fr": "Aucune participation. Aucun rendement. Aucun pitch deck caché dans un PDF.",
    "de": "Keine Beteiligung. Keine Rendite. Kein Pitch Deck, das sich hinter einem PDF versteckt.",
    "pt": "Sem participação. Sem retorno. Nenhum pitch deck escondido em um PDF.",
    "zh": "没有股权。没有回报。没有藏在 PDF 后面的融资演示文稿。",
    "ja": "株式なし。リターンなし。PDFの裏に隠したピッチデックもなし。",
    "ar": "لا أسهم. لا عوائد. ولا عرض تقديمي مخبأ خلف ملف PDF."
  },
  "Why does this exist?": {
    "es": "¿Por qué existe esto?",
    "fr": "Pourquoi ce projet existe-t-il ?",
    "de": "Warum gibt es das?",
    "pt": "Por que isso existe?",
    "zh": "为什么要做这件事？",
    "ja": "なぜこれが存在するのか？",
    "ar": "لماذا يوجد هذا المشروع؟"
  },
  "a ridiculous conversation.": {
    "es": "una conversación ridícula.",
    "fr": "une conversation absurde.",
    "de": "einem absurden Gespräch.",
    "pt": "uma conversa ridícula.",
    "zh": "一次荒唐的对话。",
    "ja": "ばかげた会話。",
    "ar": "محادثة عبثية."
  },
  "It started with a conversation with my brother-in-law.": {
    "es": "Todo empezó con una conversación con mi cuñado.",
    "fr": "Tout a commencé par une conversation avec mon beau-frère.",
    "de": "Es begann mit einem Gespräch mit meinem Schwager.",
    "pt": "Tudo começou com uma conversa com meu cunhado.",
    "zh": "一切始于我和姐夫/妹夫的一次谈话。",
    "ja": "すべては義兄弟との会話から始まりました。",
    "ar": "بدأ الأمر بمحادثة مع شقيق زوجتي."
  },
  "He came up with a simple idea: what if there were a website where anyone could give a little money, and the money was simply allowed to accumulate while the experiment was documented? ": {
    "es": "Se le ocurrió una idea sencilla: ¿y si hubiera un sitio donde cualquiera pudiera aportar un poco de dinero y simplemente dejáramos que se acumulara mientras documentábamos el experimento?",
    "fr": "Il a eu une idée simple : et s’il existait un site où chacun pourrait donner un peu d’argent, que l’on laisserait simplement s’accumuler tout en documentant l’expérience ?",
    "de": "Er hatte eine einfache Idee: Was wäre, wenn es eine Website gäbe, auf der jeder etwas Geld geben könnte und das Geld einfach gesammelt würde, während das Experiment dokumentiert wird?",
    "pt": "Ele teve uma ideia simples: e se houvesse um site onde qualquer pessoa pudesse dar um pouco de dinheiro, e o dinheiro simplesmente se acumulasse enquanto o experimento fosse documentado?",
    "zh": "他提出了一个简单的想法：如果有一个网站，任何人都可以给一点钱，然后让这些钱在记录实验的同时慢慢累积，会怎样？",
    "ja": "彼はシンプルなアイデアを思いつきました。誰でも少しお金を出せて、そのお金を実験の記録とともにただ積み上げていくサイトがあったら？",
    "ar": "جاء بفكرة بسيطة: ماذا لو كان هناك موقع يستطيع أي شخص أن يساهم فيه بمبلغ صغير، ثم نترك المال يتراكم بينما نوثق التجربة؟"
  },
  "It was just a conversation at first. Then I kept thinking about it and eventually decided to actually try it.": {
    "es": "Al principio solo era una conversación. Luego seguí pensando en ello y finalmente decidí intentarlo de verdad.",
    "fr": "Au début, ce n’était qu’une conversation. Puis j’y ai continué à penser et j’ai finalement décidé d’essayer pour de vrai.",
    "de": "Am Anfang war es nur ein Gespräch. Dann ließ mich die Idee nicht los und schließlich beschloss ich, es wirklich zu versuchen.",
    "pt": "No começo, era apenas uma conversa. Depois continuei pensando nisso e finalmente decidi tentar de verdade.",
    "zh": "起初这只是一次谈话。后来我一直想着它，最终决定真的试试看。",
    "ja": "最初はただの会話でした。でも考え続けるうちに、本当にやってみることにしました。",
    "ar": "في البداية كانت مجرد محادثة. ثم واصلت التفكير فيها وقررت في النهاية أن أجربها فعلًا."
  },
  "Why €1 billion?\nBecause it's a ridiculous amount of money.": {
    "es": "¿Por qué 1.000 millones de euros?\nPorque es una cantidad ridícula de dinero.",
    "fr": "Pourquoi 1 milliard d’euros ?\nParce que c’est une somme d’argent absurde.",
    "de": "Warum 1 Milliarde Euro?\nWeil es absurd viel Geld ist.",
    "pt": "Por que 1 bilhão de euros?\nPorque é uma quantia absurda de dinheiro.",
    "zh": "为什么是 10 亿欧元？\n因为这是一笔荒唐的巨额财富。",
    "ja": "なぜ10億ユーロ？\nばかげた金額だからです。",
    "ar": "لماذا مليار يورو؟\nلأنه مبلغ مالي عبثي."
  },
  "The real motivation": {
    "es": "La verdadera motivación",
    "fr": "La vraie motivation",
    "de": "Die eigentliche Motivation",
    "pt": "A verdadeira motivação",
    "zh": "真正的动力",
    "ja": "本当の動機",
    "ar": "الدافع الحقيقي"
  },
  "I'm tired of working in a corporation for a salary that doesn't feel like it's getting me anywhere.": {
    "es": "Estoy cansado de trabajar en una empresa por un sueldo que no siento que me lleve a ninguna parte.",
    "fr": "Je suis fatigué de travailler dans une entreprise pour un salaire qui ne me donne pas l’impression d’avancer.",
    "de": "Ich bin es leid, in einem Unternehmen für ein Gehalt zu arbeiten, bei dem ich nicht das Gefühl habe, voranzukommen.",
    "pt": "Estou cansado de trabalhar em uma empresa por um salário que não parece me levar a lugar algum.",
    "zh": "我厌倦了在公司里工作，拿着一份让我觉得毫无进展的工资。",
    "ja": "会社で働き、どこにも近づいていないように感じる給料をもらい続けることに疲れました。",
    "ar": "سئمت العمل في شركة مقابل راتب لا أشعر أنه يقودني إلى أي مكان."
  },
  "So instead of just complaining about it, I decided to see how far I could get building something of my own. Maybe nowhere. Maybe €3. The point is to find out.": {
    "es": "Así que, en vez de limitarme a quejarme, decidí ver hasta dónde podía llegar construyendo algo propio. Quizá a ninguna parte. Quizá a 3 €. La cuestión es descubrirlo.",
    "fr": "Alors, au lieu de simplement m’en plaindre, j’ai décidé de voir jusqu’où je pouvais aller en construisant quelque chose à moi. Peut-être nulle part. Peut-être 3 €. Le but est de le découvrir.",
    "de": "Also beschloss ich, statt nur darüber zu klagen, herauszufinden, wie weit ich mit etwas Eigenem kommen kann. Vielleicht nirgendwo. Vielleicht 3 €. Darum geht es: es herauszufinden.",
    "pt": "Então, em vez de apenas reclamar, decidi descobrir até onde consigo chegar construindo algo meu. Talvez a lugar nenhum. Talvez €3. O objetivo é descobrir.",
    "zh": "所以，与其只是抱怨，我决定看看自己靠打造属于自己的东西能走多远。也许哪儿都到不了。也许只能到 3 欧元。重点就是弄清楚答案。",
    "ja": "だから文句を言うだけではなく、自分のものを作ってどこまで行けるか試すことにしました。どこにも行けないかもしれない。3ユーロかもしれない。知りたいのです。",
    "ar": "لذلك، بدلًا من الاكتفاء بالشكوى، قررت أن أرى إلى أي مدى يمكنني الوصول ببناء شيء خاص بي. ربما لا أصل إلى أي مكان. ربما أصل إلى 3 يورو. المهم أن نعرف."
  },
  "No grand promise": {
    "es": "Ninguna gran promesa",
    "fr": "Aucune grande promesse",
    "de": "Kein großes Versprechen",
    "pt": "Nenhuma grande promessa",
    "zh": "没有宏大承诺",
    "ja": "大げさな約束はありません",
    "ar": "لا وعود كبيرة"
  },
  "I'm not claiming I know how to become a billionaire.": {
    "es": "No afirmo saber cómo convertirme en multimillonario.",
    "fr": "Je ne prétends pas savoir comment devenir milliardaire.",
    "de": "Ich behaupte nicht, zu wissen, wie man Milliardär wird.",
    "pt": "Não estou dizendo que sei como me tornar bilionário.",
    "zh": "我并不声称知道如何成为亿万富翁。",
    "ja": "億万長者になる方法を知っているとは言いません。",
    "ar": "لا أدعي أنني أعرف كيف أصبح مليارديرًا."
  },
  "I'm starting from €0, documenting the decisions, the failures, the lucky breaks and the things that actually work. If the experiment goes nowhere, that becomes part of the story too.": {
    "es": "Empiezo desde 0 €, documentando las decisiones, los fracasos, los golpes de suerte y lo que realmente funciona. Si el experimento no llega a ninguna parte, eso también será parte de la historia.",
    "fr": "Je pars de 0 €, en documentant les décisions, les échecs, les coups de chance et ce qui fonctionne réellement. Si l’expérience n’aboutit à rien, cela fera aussi partie de l’histoire.",
    "de": "Ich starte bei 0 € und dokumentiere Entscheidungen, Misserfolge, Glücksfälle und das, was tatsächlich funktioniert. Wenn das Experiment nirgendwohin führt, wird auch das Teil der Geschichte.",
    "pt": "Estou começando com €0, documentando decisões, fracassos, acasos felizes e o que realmente funciona. Se o experimento não chegar a lugar algum, isso também fará parte da história.",
    "zh": "我从 0 欧元开始，记录每个决定、失败、幸运时刻以及真正有效的事情。如果实验最终毫无进展，这也会成为故事的一部分。",
    "ja": "0ユーロから始め、決断、失敗、幸運、そして本当にうまくいったことを記録します。実験がどこにもたどり着かなければ、それも物語の一部です。",
    "ar": "أبدأ من 0 يورو، وأوثق القرارات والإخفاقات والفرص المحظوظة وما ينجح فعلًا. وإذا لم تصل التجربة إلى أي مكان، فسيكون ذلك أيضًا جزءًا من القصة."
  },
  "Starting from €0.": {
    "es": "Empezando desde 0 €.",
    "fr": "En partant de 0 €.",
    "de": "Start bei 0 €.",
    "pt": "Começando com €0.",
    "zh": "从 0 欧元开始。",
    "ja": "0ユーロから。",
    "ar": "البداية من 0 يورو."
  },
  "I WANNA BE RICH.": {
    "es": "QUIERO SER RICO.",
    "fr": "JE VEUX ÊTRE RICHE.",
    "de": "ICH WILL REICH WERDEN.",
    "pt": "EU QUERO FICAR RICO.",
    "zh": "我想变得有钱。",
    "ja": "金持ちになりたい。",
    "ar": "أريد أن أصبح ثريًا."
  },
  "The goal is simple:": {
    "es": "El objetivo es simple:",
    "fr": "L’objectif est simple :",
    "de": "Das Ziel ist einfach:",
    "pt": "O objetivo é simples:",
    "zh": "目标很简单：",
    "ja": "目標はシンプルです：",
    "ar": "الهدف بسيط:"
  },
  "The plan is... not so much.": {
    "es": "El plan... no tanto.",
    "fr": "Le plan… beaucoup moins.",
    "de": "Der Plan … eher nicht.",
    "pt": "O plano... nem tanto.",
    "zh": "计划……就没那么简单了。",
    "ja": "計画は……そうでもありません。",
    "ar": "أما الخطة... فليست كذلك."
  },
  "Current wealth": {
    "es": "Patrimonio actual",
    "fr": "Patrimoine actuel",
    "de": "Aktuelles Vermögen",
    "pt": "Patrimônio atual",
    "zh": "当前财富",
    "ja": "現在の資産",
    "ar": "الثروة الحالية"
  },
  "Loading verified support...": {
    "es": "Cargando apoyo verificado...",
    "fr": "Chargement du soutien vérifié…",
    "de": "Verifizierte Unterstützung wird geladen …",
    "pt": "Carregando apoio verificado...",
    "zh": "正在加载已验证的支持……",
    "ja": "確認済みの支援を読み込んでいます…",
    "ar": "جارٍ تحميل الدعم الموثق..."
  },
  "Progress: an objectively tiny percentage.": {
    "es": "Progreso: un porcentaje objetivamente diminuto.",
    "fr": "Progression : un pourcentage objectivement minuscule.",
    "de": "Fortschritt: ein objektiv winziger Prozentsatz.",
    "pt": "Progresso: uma porcentagem objetivamente minúscula.",
    "zh": "进度：一个客观上微小的百分比。",
    "ja": "進捗：客観的に見て極小の割合です。",
    "ar": "التقدم: نسبة ضئيلة بشكل موضوعي."
  },
  "Current milestone": {
    "es": "Hito actual",
    "fr": "Étape actuelle",
    "de": "Aktueller Meilenstein",
    "pt": "Marco atual",
    "zh": "当前里程碑",
    "ja": "現在のマイルストーン",
    "ar": "المرحلة الحالية"
  },
  "0% of the way to the current milestone.": {
    "es": "0 % del camino al hito actual.",
    "fr": "0 % du chemin vers l’étape actuelle.",
    "de": "0 % auf dem Weg zum aktuellen Meilenstein.",
    "pt": "0% do caminho até o marco atual.",
    "zh": "距离当前里程碑还有 0%。",
    "ja": "現在のマイルストーンまで 0%。",
    "ar": "0٪ من الطريق إلى المرحلة الحالية."
  },
  "🌍 GLOBAL VALUE": {
    "es": "🌍 VALOR GLOBAL",
    "fr": "🌍 VALEUR MONDIALE",
    "de": "🌍 GLOBALER WERT",
    "pt": "🌍 VALOR GLOBAL",
    "zh": "🌍 全球价值",
    "ja": "🌍 世界価値",
    "ar": "🌍 القيمة العالمية"
  },
  "Still €1 billion. 💀": {
    "es": "Siguen siendo 1.000 millones de euros. 💀",
    "fr": "Toujours 1 milliard d’euros. 💀",
    "de": "Immer noch 1 Milliarde Euro. 💀",
    "pt": "Ainda 1 bilhão de euros. 💀",
    "zh": "还是 10 亿欧元。💀",
    "ja": "まだ10億ユーロ。💀",
    "ar": "ما زال مليار يورو. 💀"
  },
  "Target": {
    "es": "Objetivo",
    "fr": "Objectif",
    "de": "Ziel",
    "pt": "Meta",
    "zh": "目标",
    "ja": "目標",
    "ar": "الهدف"
  },
  "Confidence": {
    "es": "Confianza",
    "fr": "Confiance",
    "de": "Zuversicht",
    "pt": "Confiança",
    "zh": "信心",
    "ja": "自信度",
    "ar": "الثقة"
  },
  "Unreasonable": {
    "es": "Irracional",
    "fr": "Déraisonnable",
    "de": "Unvernünftig",
    "pt": "Irracional",
    "zh": "不切实际",
    "ja": "無謀",
    "ar": "غير منطقي"
  },
  "Business model": {
    "es": "Modelo de negocio",
    "fr": "Modèle économique",
    "de": "Geschäftsmodell",
    "pt": "Modelo de negócio",
    "zh": "商业模式",
    "ja": "ビジネスモデル",
    "ar": "نموذج العمل"
  },
  "Public optimism": {
    "es": "Optimismo público",
    "fr": "Optimisme public",
    "de": "Öffentlicher Optimismus",
    "pt": "Otimismo público",
    "zh": "公开乐观",
    "ja": "公開された楽観主義",
    "ar": "تفاؤل علني"
  },
  "Financial status": {
    "es": "Situación financiera",
    "fr": "Situation financière",
    "de": "Finanzstatus",
    "pt": "Situação financeira",
    "zh": "财务状态",
    "ja": "財務状況",
    "ar": "الوضع المالي"
  },
  "Aggressively optimistic": {
    "es": "Agresivamente optimista",
    "fr": "Agressivement optimiste",
    "de": "Aggressiv optimistisch",
    "pt": "Agressivamente otimista",
    "zh": "极度乐观",
    "ja": "極端に楽観的",
    "ar": "متفائل بشكل مفرط"
  },
  "Risk profile": {
    "es": "Perfil de riesgo",
    "fr": "Profil de risque",
    "de": "Risikoprofil",
    "pt": "Perfil de risco",
    "zh": "风险状况",
    "ja": "リスクプロファイル",
    "ar": "ملف المخاطر"
  },
  "Your call": {
    "es": "Tú decides",
    "fr": "À vous de juger",
    "de": "Du entscheidest",
    "pt": "Você decide",
    "zh": "由你判断",
    "ja": "あなた次第です",
    "ar": "القرار لك"
  },
  "The plan, unfortunately": {
    "es": "El plan, por desgracia",
    "fr": "Le plan, malheureusement",
    "de": "Der Plan, leider",
    "pt": "O plano, infelizmente",
    "zh": "这个计划，不幸的是",
    "ja": "残念ながら、この計画は",
    "ar": "الخطة، للأسف"
  },
  "How this becomes\n€1 billion.": {
    "es": "Cómo esto se convierte en 1.000 millones de euros.",
    "fr": "Comment atteindre 1 milliard d’euros.",
    "de": "Wie daraus 1 Milliarde Euro wird.",
    "pt": "Como isso chega a 1 bilhão de euros.",
    "zh": "如何走向 10 亿欧元。",
    "ja": "これが10億ユーロになるまで。",
    "ar": "كيف تصبح هذه التجربة مليار يورو."
  },
  "Get to €100.": {
    "es": "Llegar a 100 €.",
    "fr": "Atteindre 100 €.",
    "de": "100 € erreichen.",
    "pt": "Chegar a €100.",
    "zh": "达到 100 欧元。",
    "ja": "100ユーロに到達する。",
    "ar": "الوصول إلى 100 يورو."
  },
  "Get to €1,000.": {
    "es": "Llegar a 1.000 €.",
    "fr": "Atteindre 1 000 €.",
    "de": "1.000 € erreichen.",
    "pt": "Chegar a €1.000.",
    "zh": "达到 1,000 欧元。",
    "ja": "1,000ユーロに到達する。",
    "ar": "الوصول إلى 1,000 يورو."
  },
  "Get to €10,000.": {
    "es": "Llegar a 10.000 €.",
    "fr": "Atteindre 10 000 €.",
    "de": "10.000 € erreichen.",
    "pt": "Chegar a €10.000.",
    "zh": "达到 10,000 欧元。",
    "ja": "10,000ユーロに到達する。",
    "ar": "الوصول إلى 10,000 يورو."
  },
  "Get to €100,000.": {
    "es": "Llegar a 100.000 €.",
    "fr": "Atteindre 100 000 €.",
    "de": "100.000 € erreichen.",
    "pt": "Chegar a €100.000.",
    "zh": "达到 100,000 欧元。",
    "ja": "100,000ユーロに到達する。",
    "ar": "الوصول إلى 100,000 يورو."
  },
  "Get to €1,000,000.": {
    "es": "Llegar a 1.000.000 €.",
    "fr": "Atteindre 1 000 000 €.",
    "de": "1.000.000 € erreichen.",
    "pt": "Chegar a €1.000.000.",
    "zh": "达到 1,000,000 欧元。",
    "ja": "1,000,000ユーロに到達する。",
    "ar": "الوصول إلى 1,000,000 يورو."
  },
  "Figure out the billion.": {
    "es": "Descubrir cómo llegar al mil millones.",
    "fr": "Trouver comment atteindre le milliard.",
    "de": "Herausfinden, wie die Milliarde möglich wird.",
    "pt": "Descobrir como chegar ao bilhão.",
    "zh": "想办法达到 10 亿。",
    "ja": "10億への道を見つける。",
    "ar": "اكتشاف كيفية الوصول إلى المليار."
  },
  "There is no secret master plan.": {
    "es": "No existe un plan maestro secreto.",
    "fr": "Il n’y a pas de plan secret et génial.",
    "de": "Es gibt keinen geheimen Masterplan.",
    "pt": "Não existe um grande plano secreto.",
    "zh": "没有什么秘密的终极计划。",
    "ja": "秘密の完璧な計画はありません。",
    "ar": "لا توجد خطة سرية عبقرية."
  },
  "The plan gets smarter as the number gets bigger.": {
    "es": "El plan se vuelve más inteligente a medida que crece la cifra.",
    "fr": "Le plan devient plus intelligent à mesure que le nombre augmente.",
    "de": "Der Plan wird klüger, je größer die Zahl wird.",
    "pt": "O plano fica mais inteligente à medida que o número cresce.",
    "zh": "数字越大，计划就越聪明。",
    "ja": "数字が大きくなるほど、計画も賢くなります。",
    "ar": "كلما كبر الرقم، أصبحت الخطة أذكى."
  },
  "The rules.": {
    "es": "Las reglas.",
    "fr": "Les règles.",
    "de": "Die Regeln.",
    "pt": "As regras.",
    "zh": "规则。",
    "ja": "ルール。",
    "ar": "القواعد."
  },
  "The number has to be real.": {
    "es": "La cifra tiene que ser real.",
    "fr": "Le chiffre doit être réel.",
    "de": "Die Zahl muss echt sein.",
    "pt": "O número precisa ser real.",
    "zh": "这个数字必须真实。",
    "ja": "数字は本物でなければなりません。",
    "ar": "يجب أن يكون الرقم حقيقيًا."
  },
  "No pretending to be richer than I am.": {
    "es": "No fingir ser más rico de lo que soy.",
    "fr": "Pas question de prétendre être plus riche que je ne le suis.",
    "de": "Nicht so tun, als wäre ich reicher, als ich bin.",
    "pt": "Nada de fingir ser mais rico do que sou.",
    "zh": "不假装自己比实际更有钱。",
    "ja": "実際より裕福に見せかけません。",
    "ar": "لا تظاهر بأنني أغنى مما أنا عليه."
  },
  "No fake screenshots, fake donations, or suspiciously creative accounting.": {
    "es": "Nada de capturas falsas, donaciones falsas ni contabilidad sospechosamente creativa.",
    "fr": "Pas de fausses captures, de fausses donations ni de comptabilité étrangement créative.",
    "de": "Keine gefälschten Screenshots, Spenden oder verdächtig kreative Buchhaltung.",
    "pt": "Nada de capturas falsas, doações falsas ou contabilidade suspeitamente criativa.",
    "zh": "不造假截图、不造假捐款，也不做可疑的创意会计。",
    "ja": "偽のスクリーンショット、偽の寄付、怪しい会計はなし。",
    "ar": "لا لقطات شاشة مزيفة، ولا تبرعات مزيفة، ولا محاسبة إبداعية بشكل مريب."
  },
  "The goal stays €1 billion.": {
    "es": "El objetivo sigue siendo 1.000 millones de euros.",
    "fr": "L’objectif reste 1 milliard d’euros.",
    "de": "Das Ziel bleibt 1 Milliarde Euro.",
    "pt": "A meta continua sendo 1 bilhão de euros.",
    "zh": "目标仍然是 10 亿欧元。",
    "ja": "目標は10億ユーロのままです。",
    "ar": "الهدف ما زال مليار يورو."
  },
  "Because apparently €100 million was not sufficiently unreasonable.": {
    "es": "Porque, al parecer, 100 millones de euros no eran lo bastante absurdos.",
    "fr": "Parce qu’apparemment, 100 millions d’euros n’étaient pas assez déraisonnables.",
    "de": "Denn offenbar waren 100 Millionen Euro nicht unvernünftig genug.",
    "pt": "Porque, aparentemente, €100 milhões não eram absurdos o suficiente.",
    "zh": "因为显然 1 亿欧元还不够离谱。",
    "ja": "どうやら1億ユーロでは十分に無謀ではなかったようです。",
    "ar": "لأن 100 مليون يورو، على ما يبدو، لم تكن غير منطقية بما يكفي."
  },
  "If the plan changes, I say so.": {
    "es": "Si el plan cambia, lo diré.",
    "fr": "Si le plan change, je le dirai.",
    "de": "Wenn sich der Plan ändert, sage ich es.",
    "pt": "Se o plano mudar, eu aviso.",
    "zh": "如果计划改变，我会说出来。",
    "ja": "計画が変わったら、そう伝えます。",
    "ar": "إذا تغيرت الخطة، سأقول ذلك."
  },
  "This is a public experiment. The good ideas, bad ideas, and inevitable disasters stay public.": {
    "es": "Este es un experimento público. Las buenas ideas, las malas ideas y los desastres inevitables siguen siendo públicos.",
    "fr": "C’est une expérience publique. Les bonnes idées, les mauvaises idées et les catastrophes inévitables restent publiques.",
    "de": "Dies ist ein öffentliches Experiment. Gute Ideen, schlechte Ideen und unvermeidliche Katastrophen bleiben öffentlich.",
    "pt": "Este é um experimento público. As boas ideias, as más ideias e os desastres inevitáveis continuam públicos.",
    "zh": "这是一个公开实验。好主意、坏主意以及不可避免的灾难都会公开。",
    "ja": "これは公開実験です。良いアイデアも悪いアイデアも、避けられない失敗も公開します。",
    "ar": "هذه تجربة علنية. ستبقى الأفكار الجيدة والسيئة والكوارث الحتمية علنية."
  },
  "There is no guaranteed outcome.": {
    "es": "No hay un resultado garantizado.",
    "fr": "Aucun résultat n’est garanti.",
    "de": "Es gibt kein garantiertes Ergebnis.",
    "pt": "Não há resultado garantido.",
    "zh": "没有保证的结果。",
    "ja": "結果は保証されません。",
    "ar": "لا توجد نتيجة مضمونة."
  },
  "You are supporting the experiment, not buying a piece of the imaginary empire.": {
    "es": "Estás apoyando el experimento, no comprando una parte del imperio imaginario.",
    "fr": "Vous soutenez l’expérience, vous n’achetez pas une part de l’empire imaginaire.",
    "de": "Du unterstützt das Experiment und kaufst keinen Anteil am imaginären Imperium.",
    "pt": "Você está apoiando o experimento, não comprando uma parte do império imaginário.",
    "zh": "你是在支持实验，而不是购买虚构帝国的一部分。",
    "ja": "あなたが支援しているのは実験であり、架空の帝国の持分ではありません。",
    "ar": "أنت تدعم التجربة، ولا تشتري حصة في إمبراطورية خيالية."
  },
  "The public record": {
    "es": "El registro público",
    "fr": "Le registre public",
    "de": "Das öffentliche Protokoll",
    "pt": "O registro público",
    "zh": "公开记录",
    "ja": "公開記録",
    "ar": "السجل العلني"
  },
  "What has happened\nso far.": {
    "es": "Lo que ha ocurrido hasta ahora.",
    "fr": "Ce qui s’est passé jusqu’ici.",
    "de": "Was bisher passiert ist.",
    "pt": "O que aconteceu até agora.",
    "zh": "到目前为止发生了什么。",
    "ja": "これまでに起きたこと。",
    "ar": "ما حدث حتى الآن."
  },
  "THE IDEA": {
    "es": "LA IDEA",
    "fr": "L’IDÉE",
    "de": "DIE IDEE",
    "pt": "A IDEIA",
    "zh": "想法",
    "ja": "アイデア",
    "ar": "الفكرة"
  },
  "A ridiculous conversation became a real experiment.": {
    "es": "Una conversación ridícula se convirtió en un experimento real.",
    "fr": "Une conversation absurde est devenue une véritable expérience.",
    "de": "Aus einem absurden Gespräch wurde ein echtes Experiment.",
    "pt": "Uma conversa ridícula virou um experimento real.",
    "zh": "一次荒唐的对话变成了真实的实验。",
    "ja": "ばかげた会話が本当の実験になりました。",
    "ar": "تحولت محادثة عبثية إلى تجربة حقيقية."
  },
  "THE GOAL": {
    "es": "EL OBJETIVO",
    "fr": "L’OBJECTIF",
    "de": "DAS ZIEL",
    "pt": "O OBJETIVO",
    "zh": "目标",
    "ja": "目標",
    "ar": "الهدف"
  },
  "Pick the most unreasonable number possible.": {
    "es": "Elige el número más absurdo posible.",
    "fr": "Choisir le nombre le plus déraisonnable possible.",
    "de": "Die unvernünftigste Zahl wählen, die möglich ist.",
    "pt": "Escolher o número mais absurdo possível.",
    "zh": "选一个尽可能离谱的数字。",
    "ja": "可能な限り無謀な数字を選ぶ。",
    "ar": "اختيار أكثر رقم غير منطقي ممكن."
  },
  "THE WEBSITE": {
    "es": "EL SITIO WEB",
    "fr": "LE SITE",
    "de": "DIE WEBSITE",
    "pt": "O SITE",
    "zh": "网站",
    "ja": "ウェブサイト",
    "ar": "الموقع"
  },
  "Make the attempt public.": {
    "es": "Hacer público el intento.",
    "fr": "Rendre la tentative publique.",
    "de": "Den Versuch öffentlich machen.",
    "pt": "Tornar a tentativa pública.",
    "zh": "让这次尝试公开化。",
    "ja": "挑戦を公開する。",
    "ar": "جعل المحاولة علنية."
  },
  "THE FIRST TEST": {
    "es": "LA PRIMERA PRUEBA",
    "fr": "LE PREMIER TEST",
    "de": "DER ERSTE TEST",
    "pt": "O PRIMEIRO TESTE",
    "zh": "第一次测试",
    "ja": "最初のテスト",
    "ar": "الاختبار الأول"
  },
  "Reddit noticed before the other platforms did.": {
    "es": "Reddit se dio cuenta antes que las otras plataformas.",
    "fr": "Reddit l’a remarqué avant les autres plateformes.",
    "de": "Reddit hat es vor den anderen Plattformen bemerkt.",
    "pt": "O Reddit percebeu antes das outras plataformas.",
    "zh": "Reddit 比其他平台更早注意到了它。",
    "ja": "他のプラットフォームより先にRedditが気づきました。",
    "ar": "لاحظ Reddit الأمر قبل المنصات الأخرى."
  },
  "SOCIAL MEDIA": {
    "es": "REDES SOCIALES",
    "fr": "RÉSEAUX SOCIAUX",
    "de": "SOCIAL MEDIA",
    "pt": "REDES SOCIAIS",
    "zh": "社交媒体",
    "ja": "ソーシャルメディア",
    "ar": "وسائل التواصل الاجتماعي"
  },
  "TikTok, Instagram and X were much less impressed.": {
    "es": "TikTok, Instagram y X quedaron mucho menos impresionados.",
    "fr": "TikTok, Instagram et X ont été beaucoup moins impressionnés.",
    "de": "TikTok, Instagram und X waren deutlich weniger beeindruckt.",
    "pt": "TikTok, Instagram e X ficaram bem menos impressionados.",
    "zh": "TikTok、Instagram 和 X 的反应冷淡得多。",
    "ja": "TikTok、Instagram、Xの反応はかなり薄かったです。",
    "ar": "كان TikTok وInstagram وX أقل إعجابًا بكثير."
  },
  "THE REAL PROBLEM": {
    "es": "EL VERDADERO PROBLEMA",
    "fr": "LE VRAI PROBLÈME",
    "de": "DAS EIGENTLICHE PROBLEM",
    "pt": "O VERDADEIRO PROBLEMA",
    "zh": "真正的问题",
    "ja": "本当の問題",
    "ar": "المشكلة الحقيقية"
  },
  "People can't care about a story they never see.": {
    "es": "La gente no puede interesarse por una historia que nunca ve.",
    "fr": "On ne peut pas s’intéresser à une histoire qu’on ne voit jamais.",
    "de": "Menschen können sich nicht für eine Geschichte interessieren, die sie nie sehen.",
    "pt": "As pessoas não podem se importar com uma história que nunca veem.",
    "zh": "人们无法关心一个从未见过的故事。",
    "ja": "見たことのない物語を気にかけてもらうことはできません。",
    "ar": "لا يمكن للناس الاهتمام بقصة لم يروها قط."
  },
  "The experiment doesn't need another cold link. It needs a journey people actually want to follow. The next target is the first €100.": {
    "es": "El experimento no necesita otro enlace frío. Necesita un viaje que la gente realmente quiera seguir. El próximo objetivo son los primeros 100 €.",
    "fr": "L’expérience n’a pas besoin d’un autre lien froid. Elle a besoin d’un parcours que les gens veulent vraiment suivre. Le prochain objectif est le premier 100 €.",
    "de": "Das Experiment braucht keinen weiteren kalten Link. Es braucht eine Reise, die Menschen wirklich verfolgen wollen. Das nächste Ziel sind die ersten 100 €.",
    "pt": "O experimento não precisa de mais um link frio. Precisa de uma jornada que as pessoas realmente queiram acompanhar. O próximo alvo são os primeiros €100.",
    "zh": "这个实验不需要另一个冷冰冰的链接，而需要一段人们真正想追随的旅程。下一个目标是第一个 100 欧元。",
    "ja": "実験に必要なのは、もう一つの冷たいリンクではありません。本当に追いたくなる旅です。次の目標は最初の100ユーロ。",
    "ar": "التجربة لا تحتاج إلى رابط بارد آخر. إنها تحتاج إلى رحلة يريد الناس فعلًا متابعتها. الهدف التالي هو أول 100 يورو."
  },
  "NEXT": {
    "es": "SIGUIENTE",
    "fr": "SUIVANT",
    "de": "ALS NÄCHSTES",
    "pt": "PRÓXIMO",
    "zh": "下一步",
    "ja": "次へ",
    "ar": "التالي"
  },
  "Make the first €100 from €0.": {
    "es": "Conseguir los primeros 100 € desde 0 €.",
    "fr": "Faire les premiers 100 € à partir de 0 €.",
    "de": "Die ersten 100 € aus 0 € machen.",
    "pt": "Fazer os primeiros €100 a partir de €0.",
    "zh": "从 0 欧元赚到第一个 100 欧元。",
    "ja": "0ユーロから最初の100ユーロを作る。",
    "ar": "تحقيق أول 100 يورو انطلاقًا من 0 يورو."
  },
  "The billion remains the ridiculous long-term goal. First, let's see whether this experiment can make its first hundred euros.": {
    "es": "El mil millones sigue siendo el absurdo objetivo a largo plazo. Primero, veamos si este experimento puede conseguir sus primeros cien euros.",
    "fr": "Le milliard reste l’objectif absurde à long terme. D’abord, voyons si cette expérience peut atteindre ses premiers cent euros.",
    "de": "Die Milliarde bleibt das absurde langfristige Ziel. Zuerst sehen wir, ob dieses Experiment seine ersten hundert Euro schaffen kann.",
    "pt": "O bilhão continua sendo o objetivo absurdo de longo prazo. Primeiro, vamos ver se este experimento consegue seus primeiros cem euros.",
    "zh": "10 亿欧元仍是那个荒唐的长期目标。首先，看看这次实验能否赚到第一个 100 欧元。",
    "ja": "10億ユーロは相変わらず無謀な長期目標です。まずは最初の100ユーロを作れるか見てみましょう。",
    "ar": "ما زال المليار هو الهدف الطويل الأجل العبثي. أولًا، لنرَ هل تستطيع التجربة تحقيق أول مئة يورو."
  },
  "The experiment is open": {
    "es": "El experimento está abierto",
    "fr": "L’expérience est ouverte",
    "de": "Das Experiment ist offen",
    "pt": "O experimento está aberto",
    "zh": "实验正在进行",
    "ja": "実験は開かれています",
    "ar": "التجربة مفتوحة"
  },
  "JOIN THE\nEXPERIMENT.": {
    "es": "ÚNETE AL\nEXPERIMENTO.",
    "fr": "REJOIGNEZ L’\nEXPÉRIENCE.",
    "de": "MACH BEIM\nEXPERIMENT MIT.",
    "pt": "ENTRE NO\nEXPERIMENTO.",
    "zh": "加入\n实验。",
    "ja": "実験に\n参加する。",
    "ar": "انضم إلى\nالتجربة."
  },
  "This isn't just my experiment anymore.": {
    "es": "Esto ya no es solo mi experimento.",
    "fr": "Ce n’est plus seulement mon expérience.",
    "de": "Das ist nicht mehr nur mein Experiment.",
    "pt": "Isso não é mais apenas o meu experimento.",
    "zh": "这已经不只是我的实验了。",
    "ja": "これはもう私だけの実験ではありません。",
    "ar": "لم تعد هذه تجربتي وحدي."
  },
  "I'm trying to go from\n€0 to €1,000,000,000\n— and honestly, I don't know the best way to get there.": {
    "es": "Estoy intentando pasar de 0 € a 1.000.000.000 € — y, sinceramente, no sé cuál es la mejor manera de llegar.",
    "fr": "J’essaie de passer de 0 € à 1 000 000 000 € — et honnêtement, je ne sais pas quelle est la meilleure façon d’y arriver.",
    "de": "Ich versuche, von 0 € auf 1.000.000.000 € zu kommen – und ehrlich gesagt weiß ich nicht, wie man am besten dorthin gelangt.",
    "pt": "Estou tentando sair de €0 para €1.000.000.000 — e, honestamente, não sei qual é a melhor maneira de chegar lá.",
    "zh": "我正在尝试从 0 欧元走到 10 亿欧元——老实说，我不知道最好的方法是什么。",
    "ja": "0ユーロから10億ユーロを目指しています。正直、そこへ行く最善の方法はまだ分かりません。",
    "ar": "أحاول الانتقال من 0 يورو إلى مليار يورو — وبصراحة لا أعرف أفضل طريقة للوصول إلى هناك."
  },
  "So I'm letting other people influence what happens next.": {
    "es": "Así que dejo que otras personas influyan en lo que ocurre después.",
    "fr": "Je laisse donc d’autres personnes influencer la suite.",
    "de": "Deshalb lasse ich andere Menschen beeinflussen, was als Nächstes passiert.",
    "pt": "Então estou deixando outras pessoas influenciarem o que acontece a seguir.",
    "zh": "所以我让其他人影响接下来会发生什么。",
    "ja": "だから、次に何が起こるかを他の人にも委ねます。",
    "ar": "لذلك أسمح للآخرين بالتأثير في ما سيحدث بعد ذلك."
  },
  "Got an idea?\nKnow a way to make the first €100?\nThink I'm doing something completely stupid?\nTell me.": {
    "es": "¿Tienes una idea?\n¿Conoces una forma de conseguir los primeros 100 €?\n¿Crees que estoy haciendo algo completamente estúpido?\nDímelo.",
    "fr": "Une idée ?\nVous connaissez un moyen de faire les premiers 100 € ?\nVous pensez que je fais quelque chose de complètement stupide ?\nDites-le-moi.",
    "de": "Eine Idee?\nKennst du einen Weg zu den ersten 100 €?\nDenkst du, ich mache etwas völlig Dummes?\nSag es mir.",
    "pt": "Tem uma ideia?\nSabe uma forma de fazer os primeiros €100?\nAcha que estou fazendo algo completamente estúpido?\nMe diga.",
    "zh": "有想法吗？\n知道如何赚到第一个 100 欧元吗？\n觉得我在做一件彻头彻尾的蠢事？\n告诉我。",
    "ja": "アイデアはありますか？\n最初の100ユーロを作る方法を知っていますか？\n私が完全にバカなことをしていると思いますか？\n教えてください。",
    "ar": "لديك فكرة؟\nتعرف طريقة لتحقيق أول 100 يورو؟\nتعتقد أنني أفعل شيئًا غبيًا تمامًا؟\nأخبرني."
  },
  "We can discuss ideas, vote on what I should try next, and follow the experiment as it happens.": {
    "es": "Podemos hablar de ideas, votar qué debería probar después y seguir el experimento mientras ocurre.",
    "fr": "Nous pouvons discuter des idées, voter sur ce que je devrais essayer ensuite et suivre l’expérience au fil des événements.",
    "de": "Wir können Ideen diskutieren, darüber abstimmen, was ich als Nächstes versuchen soll, und das Experiment live verfolgen.",
    "pt": "Podemos discutir ideias, votar no que devo tentar a seguir e acompanhar o experimento enquanto ele acontece.",
    "zh": "我们可以讨论想法、投票决定我下一步该尝试什么，并跟随实验的发展。",
    "ja": "アイデアを話し合い、次に試すことへ投票し、実験の進行を追うことができます。",
    "ar": "يمكننا مناقشة الأفكار والتصويت على ما يجب أن أجربه بعد ذلك ومتابعة التجربة أثناء حدوثها."
  },
  "Join the Telegram community →": {
    "es": "Únete a la comunidad de Telegram →",
    "fr": "Rejoindre la communauté Telegram →",
    "de": "Der Telegram-Community beitreten →",
    "pt": "Entrar na comunidade do Telegram →",
    "zh": "加入 Telegram 社区 →",
    "ja": "Telegramコミュニティに参加 →",
    "ar": "انضم إلى مجتمع Telegram ←"
  },
  "The goal isn't to build a fan club. It's to figure out what actually works.": {
    "es": "El objetivo no es crear un club de fans. Es descubrir qué funciona de verdad.",
    "fr": "Le but n’est pas de créer un fan-club. C’est de découvrir ce qui fonctionne vraiment.",
    "de": "Das Ziel ist nicht, einen Fanclub aufzubauen. Es geht darum herauszufinden, was tatsächlich funktioniert.",
    "pt": "O objetivo não é criar um fã-clube. É descobrir o que realmente funciona.",
    "zh": "目标不是建立粉丝俱乐部，而是弄清楚什么真的有效。",
    "ja": "ファンクラブを作ることが目的ではありません。本当にうまくいくものを見つけることが目的です。",
    "ar": "الهدف ليس بناء نادٍ للمعجبين. بل معرفة ما الذي ينجح فعلًا."
  },
  "CURRENT MISSION": {
    "es": "MISIÓN ACTUAL",
    "fr": "MISSION ACTUELLE",
    "de": "AKTUELLE MISSION",
    "pt": "MISSÃO ATUAL",
    "zh": "当前任务",
    "ja": "現在のミッション",
    "ar": "المهمة الحالية"
  },
  "The billion is the ridiculous long-term target. Right now, we need to figure out how to make the first hundred euros.": {
    "es": "El mil millones es el absurdo objetivo a largo plazo. Ahora necesitamos descubrir cómo conseguir los primeros cien euros.",
    "fr": "Le milliard est l’objectif absurde à long terme. Pour l’instant, il faut trouver comment faire les cent premiers euros.",
    "de": "Die Milliarde ist das absurde langfristige Ziel. Jetzt müssen wir herausfinden, wie wir die ersten hundert Euro schaffen.",
    "pt": "O bilhão é o objetivo absurdo de longo prazo. Agora precisamos descobrir como fazer os primeiros cem euros.",
    "zh": "10 亿欧元是那个荒唐的长期目标。现在，我们需要先想办法赚到第一个 100 欧元。",
    "ja": "10億ユーロは無謀な長期目標。今はまず最初の100ユーロをどう作るかを考えます。",
    "ar": "المليار هو الهدف الطويل الأجل العبثي. الآن نحتاج لمعرفة كيفية تحقيق أول مئة يورو."
  },
  "Suggest an idea": {
    "es": "Sugiere una idea",
    "fr": "Suggérer une idée",
    "de": "Eine Idee vorschlagen",
    "pt": "Sugerir uma ideia",
    "zh": "提出一个想法",
    "ja": "アイデアを提案する",
    "ar": "اقترح فكرة"
  },
  "Vote on what happens next": {
    "es": "Vota qué ocurre después",
    "fr": "Votez sur la suite",
    "de": "Abstimmen, was als Nächstes passiert",
    "pt": "Vote no que acontece a seguir",
    "zh": "投票决定下一步",
    "ja": "次に何が起きるか投票する",
    "ar": "صوّت على ما سيحدث بعد ذلك"
  },
  "Watch me try it": {
    "es": "Mírame intentarlo",
    "fr": "Regardez-moi essayer",
    "de": "Schau mir beim Versuch zu",
    "pt": "Veja-me tentar",
    "zh": "看我尝试",
    "ja": "私が試すのを見る",
    "ar": "شاهدني أحاول"
  },
  "See the result — good or bad": {
    "es": "Mira el resultado — bueno o malo",
    "fr": "Voir le résultat — bon ou mauvais",
    "de": "Sieh dir das Ergebnis an – gut oder schlecht",
    "pt": "Veja o resultado — bom ou ruim",
    "zh": "看看结果——好或坏",
    "ja": "結果を見る — 良くても悪くても",
    "ar": "شاهد النتيجة — جيدة أم سيئة"
  },
  "The internet has opinions": {
    "es": "Internet tiene opiniones",
    "fr": "Internet a des opinions",
    "de": "Das Internet hat Meinungen",
    "pt": "A internet tem opiniões",
    "zh": "互联网有自己的看法",
    "ja": "インターネットには意見がある",
    "ar": "للإنترنت آراء"
  },
  "The experiment\nhas been reviewed.": {
    "es": "El experimento\nha sido revisado.",
    "fr": "L’expérience\na été examinée.",
    "de": "Das Experiment\nwurde bewertet.",
    "pt": "O experimento\nfoi analisado.",
    "zh": "这项实验\n已经被评审。",
    "ja": "実験は\nレビューされました。",
    "ar": "التجربة\nتمت مراجعتها."
  },
  "Current consensus": {
    "es": "Consenso actual",
    "fr": "Consensus actuel",
    "de": "Aktueller Konsens",
    "pt": "Consenso atual",
    "zh": "当前共识",
    "ja": "現在の総意",
    "ar": "الإجماع الحالي"
  },
  "Still stupid.": {
    "es": "Sigue siendo una estupidez.",
    "fr": "Toujours aussi stupide.",
    "de": "Immer noch dumm.",
    "pt": "Ainda é uma ideia estúpida.",
    "zh": "还是很蠢。",
    "ja": "まだバカげています。",
    "ar": "ما زال غبيًا."
  },
  "The useful part is that people are talking about it. The experiment continues.": {
    "es": "Lo útil es que la gente está hablando de ello. El experimento continúa.",
    "fr": "L’important, c’est que les gens en parlent. L’expérience continue.",
    "de": "Das Nützliche ist, dass die Leute darüber reden. Das Experiment geht weiter.",
    "pt": "O útil é que as pessoas estão falando sobre isso. O experimento continua.",
    "zh": "有用的是，人们正在讨论它。实验继续。",
    "ja": "役に立つのは、人々が話題にしていること。実験は続きます。",
    "ar": "المفيد أن الناس يتحدثون عنه. التجربة مستمرة."
  },
  "A small reason to come back": {
    "es": "Una pequeña razón para volver",
    "fr": "Une petite raison de revenir",
    "de": "Ein kleiner Grund, wiederzukommen",
    "pt": "Um pequeno motivo para voltar",
    "zh": "一个回来再看的小理由",
    "ja": "また戻ってくる小さな理由",
    "ar": "سبب صغير للعودة"
  },
  "Make a prediction.": {
    "es": "Haz una predicción.",
    "fr": "Faites une prédiction.",
    "de": "Gib eine Prognose ab.",
    "pt": "Faça uma previsão.",
    "zh": "做出预测。",
    "ja": "予測してみる。",
    "ar": "ضع توقعًا."
  },
  "Will this become a billion-euro story?\nVote yes or no, leave a comment, and earn absolutely no financial upside.": {
    "es": "¿Se convertirá esto en una historia de mil millones de euros?\nVota sí o no, deja un comentario y no obtendrás absolutamente ningún beneficio financiero.",
    "fr": "Est-ce que cela deviendra une histoire à 1 milliard d’euros ?\nVotez oui ou non, laissez un commentaire et ne gagnez absolument aucun avantage financier.",
    "de": "Wird daraus eine Milliarde-Euro-Geschichte?\nStimme mit Ja oder Nein ab, hinterlasse einen Kommentar und erhalte absolut keinen finanziellen Vorteil.",
    "pt": "Isso vai virar uma história de 1 bilhão de euros?\nVote sim ou não, deixe um comentário e não ganhe absolutamente nenhum benefício financeiro.",
    "zh": "这会成为一个 10 亿欧元的故事吗？\n投赞成或反对，留下评论，但绝对不会获得任何经济收益。",
    "ja": "これは10億ユーロの物語になる？\nはい／いいえに投票してコメントを残しても、金銭的な利益は一切ありません。",
    "ar": "هل ستصبح هذه قصة بمليار يورو؟\nصوّت بنعم أو لا، واترك تعليقًا، ولن تحصل على أي منفعة مالية على الإطلاق."
  },
  "Milestones, generously defined": {
    "es": "Hitos, definidos generosamente",
    "fr": "Étapes, généreusement définies",
    "de": "Meilensteine, großzügig definiert",
    "pt": "Marcos, generosamente definidos",
    "zh": "里程碑，慷慨地定义",
    "ja": "マイルストーン、かなり寛大に定義",
    "ar": "مراحل، بتعريف سخي"
  },
  "Every euro has\na job.": {
    "es": "Cada euro tiene\nun propósito.",
    "fr": "Chaque euro a\nun rôle.",
    "de": "Jeder Euro hat\neine Aufgabe.",
    "pt": "Cada euro tem\num propósito.",
    "zh": "每一欧元\n都有用途。",
    "ja": "すべてのユーロには\n役割があります。",
    "ar": "لكل يورو\nوظيفة."
  },
  "Coffee, for stamina": {
    "es": "Café, para aguantar",
    "fr": "Café, pour tenir",
    "de": "Kaffee, für Durchhaltevermögen",
    "pt": "Café, para aguentar",
    "zh": "咖啡，用来续命",
    "ja": "コーヒー、持久力のため",
    "ar": "قهوة، للاستمرار"
  },
  "Stop comparing Lidl prices": {
    "es": "Dejar de comparar precios de Lidl",
    "fr": "Arrêter de comparer les prix de Lidl",
    "de": "Aufhören, Lidl-Preise zu vergleichen",
    "pt": "Parar de comparar preços do Lidl",
    "zh": "不再比较 Lidl 的价格",
    "ja": "Lidlの価格比較をやめる",
    "ar": "التوقف عن مقارنة أسعار Lidl"
  },
  "Say “entrepreneur” once": {
    "es": "Decir «emprendedor» una vez",
    "fr": "Dire « entrepreneur » une fois",
    "de": "Einmal „Unternehmer“ sagen",
    "pt": "Dizer “empreendedor” uma vez",
    "zh": "说一次“创业者”",
    "ja": "「起業家」と一度言う",
    "ar": "قول «رائد أعمال» مرة واحدة"
  },
  "Consider a LinkedIn post": {
    "es": "Considerar una publicación en LinkedIn",
    "fr": "Envisager une publication LinkedIn",
    "de": "Einen LinkedIn-Post erwägen",
    "pt": "Considerar uma publicação no LinkedIn",
    "zh": "考虑发一条 LinkedIn 帖子",
    "ja": "LinkedIn投稿を検討する",
    "ar": "التفكير في منشور على LinkedIn"
  },
  "Reveal identity. Breathe.": {
    "es": "Revelar la identidad. Respirar.",
    "fr": "Révéler l’identité. Respirer.",
    "de": "Identität enthüllen. Durchatmen.",
    "pt": "Revelar a identidade. Respirar.",
    "zh": "公开身份。深呼吸。",
    "ja": "正体を明かす。深呼吸。",
    "ar": "كشف الهوية. خذ نفسًا."
  },
  "Today": {
    "es": "Hoy",
    "fr": "Aujourd’hui",
    "de": "Heute",
    "pt": "Hoje",
    "zh": "今天",
    "ja": "今日",
    "ar": "اليوم"
  },
  "Still wildly optimistic": {
    "es": "Sigo siendo increíblemente optimista",
    "fr": "Toujours incroyablement optimiste",
    "de": "Immer noch völlig optimistisch",
    "pt": "Ainda absurdamente otimista",
    "zh": "依然极度乐观",
    "ja": "相変わらず猛烈に楽観的",
    "ar": "ما زلت متفائلًا بشكل مبالغ فيه"
  },
  "A completely unnecessary warning": {
    "es": "Una advertencia completamente innecesaria",
    "fr": "Un avertissement totalement inutile",
    "de": "Eine völlig unnötige Warnung",
    "pt": "Um aviso completamente desnecessário",
    "zh": "一个完全没必要的警告",
    "ja": "完全に不要な警告",
    "ar": "تحذير غير ضروري تمامًا"
  },
  "Things that could\ngo wrong.": {
    "es": "Cosas que podrían\nsalir mal.",
    "fr": "Les choses qui pourraient\nmal tourner.",
    "de": "Dinge, die\nschiefgehen könnten.",
    "pt": "Coisas que podem\ndar errado.",
    "zh": "可能\n出问题的事情。",
    "ja": "うまくいかない\n可能性のあること。",
    "ar": "أشياء قد\nتسوء."
  },
  "STATUS: PROBABLY FINE": {
    "es": "ESTADO: PROBABLEMENTE BIEN",
    "fr": "STATUT : PROBABLEMENT OK",
    "de": "STATUS: WAHRSCHEINLICH OK",
    "pt": "STATUS: PROVAVELMENTE TUDO BEM",
    "zh": "状态：大概没事",
    "ja": "ステータス：たぶん大丈夫",
    "ar": "الحالة: غالبًا بخير"
  },
  "Almost everything.": {
    "es": "Casi todo.",
    "fr": "Presque tout.",
    "de": "Fast alles.",
    "pt": "Quase tudo.",
    "zh": "几乎所有事情。",
    "ja": "ほぼ全部。",
    "ar": "تقريبًا كل شيء."
  },
  "We have deliberately left room for this possibility.": {
    "es": "Hemos dejado deliberadamente espacio para esta posibilidad.",
    "fr": "Nous avons délibérément laissé de la place à cette possibilité.",
    "de": "Wir haben diese Möglichkeit bewusst eingeplant.",
    "pt": "Deixamos deliberadamente espaço para essa possibilidade.",
    "zh": "我们特意为这种可能性留出了空间。",
    "ja": "この可能性のために、意図的に余地を残しています。",
    "ar": "لقد تركنا عمدًا مجالًا لهذا الاحتمال."
  },
  "The internet gets bored.": {
    "es": "Internet se aburre.",
    "fr": "Internet s’ennuie.",
    "de": "Das Internet langweilt sich.",
    "pt": "A internet fica entediada.",
    "zh": "互联网会感到无聊。",
    "ja": "インターネットは飽きます。",
    "ar": "الإنترنت يشعر بالملل."
  },
  "Honestly, fair. There are many tabs open.": {
    "es": "Sinceramente, justo. Hay muchas pestañas abiertas.",
    "fr": "Honnêtement, c’est juste. Il y a beaucoup d’onglets ouverts.",
    "de": "Ehrlich gesagt, fair. Es sind viele Tabs offen.",
    "pt": "Sinceramente, justo. Há muitas abas abertas.",
    "zh": "说实话，很合理。打开的标签页太多了。",
    "ja": "正直、それは仕方ない。タブが多すぎます。",
    "ar": "بصراحة، هذا عادل. هناك الكثير من علامات التبويب المفتوحة."
  },
  "The plan stops making sense.": {
    "es": "El plan deja de tener sentido.",
    "fr": "Le plan cesse d’avoir du sens.",
    "de": "Der Plan ergibt keinen Sinn mehr.",
    "pt": "O plano deixa de fazer sentido.",
    "zh": "计划开始失去意义。",
    "ja": "計画が意味をなさなくなる。",
    "ar": "الخطة تتوقف عن أن تكون منطقية."
  },
  "Good news: it started that way.": {
    "es": "Buenas noticias: empezó así.",
    "fr": "Bonne nouvelle : c’était déjà le cas.",
    "de": "Gute Nachricht: So hat es angefangen.",
    "pt": "Boas notícias: começou assim.",
    "zh": "好消息：一开始就是这样。",
    "ja": "朗報：最初からそうでした。",
    "ar": "الخبر الجيد: لقد بدأ بهذه الطريقة."
  },
  "Taxes.": {
    "es": "Impuestos.",
    "fr": "Les impôts.",
    "de": "Steuern.",
    "pt": "Impostos.",
    "zh": "税收。",
    "ja": "税金。",
    "ar": "الضرائب."
  },
  "Future me can worry about future me.": {
    "es": "Mi yo del futuro puede preocuparse por mi yo del futuro.",
    "fr": "Mon moi futur pourra s’inquiéter pour mon moi futur.",
    "de": "Mein zukünftiges Ich kann sich um mein zukünftiges Ich kümmern.",
    "pt": "Meu eu do futuro pode se preocupar com meu eu do futuro.",
    "zh": "未来的我可以为未来的我操心。",
    "ja": "未来の自分のことは未来の自分に任せます。",
    "ar": "يمكن لنسخة المستقبل مني أن تقلق بشأن نسخة المستقبل مني."
  },
  "We run out of ideas.": {
    "es": "Nos quedamos sin ideas.",
    "fr": "Nous manquons d’idées.",
    "de": "Uns gehen die Ideen aus.",
    "pt": "Ficamos sem ideias.",
    "zh": "我们没点子了。",
    "ja": "アイデアが尽きる。",
    "ar": "تنفد الأفكار منا."
  },
  "Then we ask the internet for worse ones.": {
    "es": "Entonces le pedimos a internet otras peores.",
    "fr": "Alors on demande à Internet d’en trouver de pires.",
    "de": "Dann fragen wir das Internet nach noch schlechteren.",
    "pt": "Então pedimos à internet outras ainda piores.",
    "zh": "那就向互联网征集更糟的点子。",
    "ja": "それならインターネットにもっとひどい案を聞きます。",
    "ar": "عندها نسأل الإنترنت عن أفكار أسوأ."
  },
  "It actually works.": {
    "es": "Realmente funciona.",
    "fr": "Ça marche vraiment.",
    "de": "Es funktioniert tatsächlich.",
    "pt": "Realmente funciona.",
    "zh": "它居然真的有效。",
    "ja": "本当にうまくいく。",
    "ar": "إنها تنجح فعلًا."
  },
  "This would be extremely inconvenient for the joke.": {
    "es": "Esto sería extremadamente incómodo para el chiste.",
    "fr": "Ce serait extrêmement gênant pour la blague.",
    "de": "Das wäre für den Witz äußerst unpraktisch.",
    "pt": "Isso seria extremamente inconveniente para a piada.",
    "zh": "这对这个玩笑来说会非常不方便。",
    "ja": "このジョークには非常に都合が悪い。",
    "ar": "سيكون هذا مزعجًا جدًا بالنسبة للنكتة."
  },
  "Your moment in financial history": {
    "es": "Tu momento en la historia financiera",
    "fr": "Votre moment dans l’histoire financière",
    "de": "Dein Moment in der Finanzgeschichte",
    "pt": "Seu momento na história financeira",
    "zh": "你的金融史时刻",
    "ja": "金融史におけるあなたの瞬間",
    "ar": "لحظتك في التاريخ المالي"
  },
  "Fund the least\nrealistic plan online.": {
    "es": "Financia el plan menos\nrealista de internet.",
    "fr": "Financez le plan le moins\nréaliste d’Internet.",
    "de": "Finanziere den am wenigsten\nrealistischen Plan im Internet.",
    "pt": "Financie o plano menos\nrealista da internet.",
    "zh": "支持网上最不现实的\n计划。",
    "ja": "ネット上で最も\n非現実的な計画を支援する。",
    "ar": "موّل أقل خطة\nواقعية على الإنترنت."
  },
  "One-time support or monthly encouragement. Either way, you become part of an objectively strange story.": {
    "es": "Apoyo puntual o ánimo mensual. En cualquier caso, pasas a formar parte de una historia objetivamente extraña.",
    "fr": "Soutien ponctuel ou encouragement mensuel. Dans tous les cas, vous faites partie d’une histoire objectivement étrange.",
    "de": "Einmalige Unterstützung oder monatliche Ermutigung. So oder so wirst du Teil einer objektiv seltsamen Geschichte.",
    "pt": "Apoio único ou incentivo mensal. De qualquer forma, você passa a fazer parte de uma história objetivamente estranha.",
    "zh": "一次性支持或每月鼓励。无论哪种方式，你都会成为一个客观上很奇怪的故事的一部分。",
    "ja": "一度の支援でも毎月の応援でも、どちらにせよ奇妙な物語の一部になります。",
    "ar": "دعم لمرة واحدة أو تشجيع شهري. في كلتا الحالتين، ستصبح جزءًا من قصة غريبة بشكل موضوعي."
  },
  "Support is voluntary. Contributions are not investments and are not refundable.": {
    "es": "El apoyo es voluntario. Las contribuciones no son inversiones y no son reembolsables.",
    "fr": "Le soutien est volontaire. Les contributions ne sont pas des investissements et ne sont pas remboursables.",
    "de": "Unterstützung ist freiwillig. Beiträge sind keine Investitionen und nicht erstattungsfähig.",
    "pt": "O apoio é voluntário. As contribuições não são investimentos e não são reembolsáveis.",
    "zh": "支持是自愿的。捐助不是投资，也不予退款。",
    "ja": "支援は任意です。支援金は投資ではなく、返金もできません。",
    "ar": "الدعم طوعي. المساهمات ليست استثمارات وغير قابلة للاسترداد."
  },
  "Unsolicited financial commentary": {
    "es": "Comentarios financieros no solicitados",
    "fr": "Commentaires financiers non sollicités",
    "de": "Ungefragte Finanzkommentare",
    "pt": "Comentários financeiros não solicitados",
    "zh": "未经请求的财务评论",
    "ja": "求められていない金融コメント",
    "ar": "تعليقات مالية غير مطلوبة"
  },
  "Calculating impossible odds...": {
    "es": "Calculando probabilidades imposibles...",
    "fr": "Calcul des probabilités impossibles…",
    "de": "Unmögliche Wahrscheinlichkeiten werden berechnet …",
    "pt": "Calculando probabilidades impossíveis...",
    "zh": "正在计算不可能的概率……",
    "ja": "不可能な確率を計算中…",
    "ar": "جارٍ حساب الاحتمالات المستحيلة..."
  },
  "IWANNABERICH // INTERNAL": {
    "es": "IWANNABERICH // INTERNO",
    "fr": "IWANNABERICH // INTERNE",
    "de": "IWANNABERICH // INTERN",
    "pt": "IWANNABERICH // INTERNO",
    "zh": "IWANNABERICH // 内部",
    "ja": "IWANNABERICH // 内部",
    "ar": "IWANNABERICH // داخلي"
  },
  "A financially questionable decision": {
    "es": "Una decisión financieramente cuestionable",
    "fr": "Une décision financièrement douteuse",
    "de": "Eine finanziell fragwürdige Entscheidung",
    "pt": "Uma decisão financeiramente questionável",
    "zh": "一个财务上值得怀疑的决定",
    "ja": "財務的に怪しい決断",
    "ar": "قرار مالي مشكوك فيه"
  },
  "Want to fund\nthe experiment?": {
    "es": "¿Quieres financiar\nel experimento?",
    "fr": "Vous voulez financer\nl’expérience ?",
    "de": "Willst du das\nExperiment finanzieren?",
    "pt": "Quer financiar\no experimento?",
    "zh": "想支持\n这项实验？",
    "ja": "実験を\n支援しますか？",
    "ar": "هل تريد تمويل\nالتجربة؟"
  },
  "Choose any amount you want. Every contribution becomes part of the public experiment.": {
    "es": "Elige la cantidad que quieras. Cada contribución pasa a formar parte del experimento público.",
    "fr": "Choisissez le montant de votre choix. Chaque contribution devient partie intégrante de l’expérience publique.",
    "de": "Wähle einen beliebigen Betrag. Jeder Beitrag wird Teil des öffentlichen Experiments.",
    "pt": "Escolha qualquer valor. Cada contribuição passa a fazer parte do experimento público.",
    "zh": "选择你想要的金额。每一笔支持都会成为公开实验的一部分。",
    "ja": "好きな金額を選んでください。すべての支援が公開実験の一部になります。",
    "ar": "اختر أي مبلغ تريده. كل مساهمة تصبح جزءًا من التجربة العلنية."
  },
  "What happens next": {
    "es": "Qué ocurre después",
    "fr": "Que se passe-t-il ensuite",
    "de": "Was passiert als Nächstes",
    "pt": "O que acontece depois",
    "zh": "接下来会发生什么",
    "ja": "次に起こること",
    "ar": "ماذا يحدث بعد ذلك"
  },
  "Stripe opens a secure checkout.": {
    "es": "Stripe abre un pago seguro.",
    "fr": "Stripe ouvre un paiement sécurisé.",
    "de": "Stripe öffnet einen sicheren Checkout.",
    "pt": "O Stripe abre um checkout seguro.",
    "zh": "Stripe 会打开安全结账页面。",
    "ja": "Stripeが安全な決済画面を開きます。",
    "ar": "يفتح Stripe صفحة دفع آمنة."
  },
  "Amount": {
    "es": "Cantidad",
    "fr": "Montant",
    "de": "Betrag",
    "pt": "Valor",
    "zh": "金额",
    "ja": "金額",
    "ar": "المبلغ"
  },
  "What I get": {
    "es": "Qué obtengo",
    "fr": "Ce que j’obtiens",
    "de": "Was ich bekomme",
    "pt": "O que eu recebo",
    "zh": "我得到什么",
    "ja": "得られるもの",
    "ar": "ما أحصل عليه"
  },
  "One more reason to keep going.": {
    "es": "Una razón más para seguir.",
    "fr": "Une raison de plus de continuer.",
    "de": "Ein weiterer Grund weiterzumachen.",
    "pt": "Mais um motivo para continuar.",
    "zh": "继续下去的又一个理由。",
    "ja": "続けるもう一つの理由。",
    "ar": "سبب إضافي للاستمرار."
  },
  "You choose the amount directly on Stripe.": {
    "es": "Tú eliges la cantidad directamente en Stripe.",
    "fr": "Vous choisissez le montant directement sur Stripe.",
    "de": "Du wählst den Betrag direkt bei Stripe.",
    "pt": "Você escolhe o valor diretamente no Stripe.",
    "zh": "你可以直接在 Stripe 上选择金额。",
    "ja": "Stripeで金額を直接選べます。",
    "ar": "تختار المبلغ مباشرة على Stripe."
  },
  "Open secure Stripe checkout →": {
    "es": "Abrir el pago seguro de Stripe →",
    "fr": "Ouvrir le paiement sécurisé Stripe →",
    "de": "Sicheren Stripe-Checkout öffnen →",
    "pt": "Abrir checkout seguro do Stripe →",
    "zh": "打开 Stripe 安全结账 →",
    "ja": "安全なStripe決済を開く →",
    "ar": "فتح صفحة دفع Stripe الآمنة ←"
  },
  "Payments are processed securely by Stripe. Contributions are voluntary and are not investments or purchases of equity.": {
    "es": "Los pagos son procesados de forma segura por Stripe. Las contribuciones son voluntarias y no son inversiones ni compras de participación.",
    "fr": "Les paiements sont traités en toute sécurité par Stripe. Les contributions sont volontaires et ne constituent ni des investissements ni des achats de participation.",
    "de": "Zahlungen werden sicher von Stripe verarbeitet. Beiträge sind freiwillig und weder Investitionen noch der Kauf von Beteiligungen.",
    "pt": "Os pagamentos são processados com segurança pelo Stripe. As contribuições são voluntárias e não são investimentos nem compras de participação.",
    "zh": "付款由 Stripe 安全处理。支持是自愿的，不属于投资或股权购买。",
    "ja": "支払いはStripeによって安全に処理されます。支援は任意であり、投資や株式の購入ではありません。",
    "ar": "تتم معالجة المدفوعات بأمان عبر Stripe. المساهمات طوعية وليست استثمارات أو شراءً لحصص."
  },
  "Who is behind this?": {
    "es": "¿Quién está detrás de esto?",
    "fr": "Qui est derrière tout ça ?",
    "de": "Wer steckt dahinter?",
    "pt": "Quem está por trás disso?",
    "zh": "谁在幕后？",
    "ja": "誰がこの実験をしているのか？",
    "ar": "من يقف وراء هذا؟"
  },
  "Anonymous.\nFor now.": {
    "es": "Anónimo.\nPor ahora.",
    "fr": "Anonyme.\nPour l’instant.",
    "de": "Anonym.\nVorerst.",
    "pt": "Anônimo.\nPor enquanto.",
    "zh": "匿名。\n目前如此。",
    "ja": "匿名です。\n今のところは。",
    "ar": "مجهول.\nفي الوقت الحالي."
  },
  "This is not a brand origin story. It is one person trying a strange idea in public, before it has enough money to deserve a documentary.": {
    "es": "No es la historia del origen de una marca. Es una persona probando una idea extraña en público, antes de que tenga suficiente dinero como para merecer un documental.",
    "fr": "Ce n’est pas l’histoire des origines d’une marque. C’est une personne qui tente une idée étrange en public, avant qu’elle ait assez d’argent pour mériter un documentaire.",
    "de": "Das ist keine Markengeschichte. Es ist eine Person, die eine seltsame Idee öffentlich ausprobiert, bevor sie genug Geld hat, um eine Dokumentation zu verdienen.",
    "pt": "Esta não é uma história de origem de marca. É uma pessoa testando uma ideia estranha em público, antes de ter dinheiro suficiente para merecer um documentário.",
    "zh": "这不是一个品牌的起源故事，而是一个人在公开场合尝试一个奇怪的想法，还没富到值得拍纪录片。",
    "ja": "ブランドの誕生秘話ではありません。ドキュメンタリーに値するほどのお金もないうちに、一人が奇妙なアイデアを公開で試しています。",
    "ar": "هذه ليست قصة نشأة علامة تجارية. إنها قصة شخص يجرب فكرة غريبة علنًا قبل أن تملك ما يكفي من المال لتستحق فيلمًا وثائقيًا."
  },
  "What is IWANNABERICH?": {
    "es": "¿Qué es IWANNABERICH?",
    "fr": "Qu’est-ce que IWANNABERICH ?",
    "de": "Was ist IWANNABERICH?",
    "pt": "O que é IWANNABERICH?",
    "zh": "IWANNABERICH 是什么？",
    "ja": "IWANNABERICHとは？",
    "ar": "ما هو IWANNABERICH؟"
  },
  "A public attempt to become ridiculously rich without pretending there is a startup, a secret algorithm, or a course to sell you.": {
    "es": "Un intento público de hacerse ridículamente rico sin fingir que existe una startup, un algoritmo secreto o un curso que venderte.",
    "fr": "Une tentative publique de devenir ridiculement riche sans prétendre qu’il existe une startup, un algorithme secret ou une formation à vous vendre.",
    "de": "Ein öffentlicher Versuch, absurd reich zu werden, ohne so zu tun, als gäbe es ein Startup, einen geheimen Algorithmus oder einen Kurs zu verkaufen.",
    "pt": "Uma tentativa pública de ficar ridiculamente rico sem fingir que existe uma startup, um algoritmo secreto ou um curso para vender.",
    "zh": "一次公开尝试，目标是变得富得离谱，不假装有创业公司、秘密算法或课程要卖给你。",
    "ja": "スタートアップも秘密のアルゴリズムも売る講座もないまま、とんでもなく金持ちになる公開挑戦です。",
    "ar": "محاولة علنية لأصبح ثريًا بشكل مبالغ فيه دون التظاهر بوجود شركة ناشئة أو خوارزمية سرية أو دورة أبيعها لك."
  },
  "Why stay anonymous?": {
    "es": "¿Por qué seguir en el anonimato?",
    "fr": "Pourquoi rester anonyme ?",
    "de": "Warum anonym bleiben?",
    "pt": "Por que permanecer anônimo?",
    "zh": "为什么保持匿名？",
    "ja": "なぜ匿名なのか？",
    "ar": "لماذا البقاء مجهولًا؟"
  },
  "Because the experiment is more interesting when it is about the idea, not the person. If the challenge reaches €1,000,000,000, the identity behind it will be revealed. That is a wildly optimistic milestone reward.": {
    "es": "Porque el experimento es más interesante cuando trata de la idea, no de la persona. Si el reto alcanza 1.000.000.000 €, se revelará la identidad. Es una recompensa de hito bastante optimista.",
    "fr": "Parce que l’expérience est plus intéressante lorsqu’elle porte sur l’idée, pas sur la personne. Si le défi atteint 1 000 000 000 €, l’identité sera révélée. Une récompense de jalon follement optimiste.",
    "de": "Weil das Experiment interessanter ist, wenn es um die Idee und nicht um die Person geht. Wenn die Herausforderung 1.000.000.000 € erreicht, wird die Identität enthüllt. Eine äußerst optimistische Belohnung für diesen Meilenstein.",
    "pt": "Porque o experimento é mais interessante quando é sobre a ideia, não sobre a pessoa. Se o desafio chegar a €1.000.000.000, a identidade será revelada. Uma recompensa de marco extremamente otimista.",
    "zh": "因为当实验关注的是想法而不是个人时，它更有意思。如果挑战达到 10 亿欧元，背后的身份将被公开。这是一个极其乐观的里程碑奖励。",
    "ja": "実験は人ではなくアイデアが主役の方が面白いからです。10億ユーロに到達したら、正体を公開します。かなり楽観的なマイルストーン報酬です。",
    "ar": "لأن التجربة أكثر إثارة عندما تدور حول الفكرة لا الشخص. إذا وصل التحدي إلى مليار يورو، فسيتم كشف الهوية. إنها مكافأة متفائلة جدًا."
  },
  "What is the point?": {
    "es": "¿Cuál es el objetivo?",
    "fr": "Quel est le but ?",
    "de": "Worum geht es?",
    "pt": "Qual é o objetivo?",
    "zh": "意义是什么？",
    "ja": "目的は何か？",
    "ar": "ما الهدف؟"
  },
  "To find out whether honesty, consistency, and collective internet curiosity can carry an absurd goal farther than common sense would recommend.": {
    "es": "Descubrir si la honestidad, la constancia y la curiosidad colectiva de internet pueden llevar un objetivo absurdo más lejos de lo que recomendaría el sentido común.",
    "fr": "Découvrir si l’honnêteté, la constance et la curiosité collective d’Internet peuvent porter un objectif absurde plus loin que ne le conseillerait le bon sens.",
    "de": "Herauszufinden, ob Ehrlichkeit, Konsequenz und die gemeinsame Neugier des Internets ein absurdes Ziel weiter tragen können, als es der gesunde Menschenverstand empfehlen würde.",
    "pt": "Descobrir se honestidade, consistência e curiosidade coletiva da internet podem levar um objetivo absurdo mais longe do que o bom senso recomendaria.",
    "zh": "看看诚实、坚持以及互联网集体的好奇心，能否把一个荒唐目标带到常识不建议的地方。",
    "ja": "正直さ、継続、そしてインターネットの集合的な好奇心が、常識なら勧めないほど遠くまで無謀な目標を運べるか確かめるためです。",
    "ar": "لمعرفة ما إذا كان الصدق والاستمرارية وفضول الإنترنت الجماعي يمكن أن يحمل هدفًا عبثيًا أبعد مما ينصح به المنطق."
  },
  "Want to say hello?": {
    "es": "¿Quieres saludar?",
    "fr": "Vous voulez dire bonjour ?",
    "de": "Hallo sagen?",
    "pt": "Quer dizer olá?",
    "zh": "想打个招呼？",
    "ja": "挨拶したい？",
    "ar": "تريد أن تقول مرحبًا؟"
  },
  "Questions, kind words, skeptical essays, and well-researched warnings are welcome. The easiest way to reach us is on Telegram.": {
    "es": "Son bienvenidas las preguntas, las palabras amables, los ensayos escépticos y las advertencias bien investigadas. La forma más fácil de contactarnos es por Telegram.",
    "fr": "Les questions, les mots gentils, les essais sceptiques et les avertissements bien documentés sont les bienvenus. Le moyen le plus simple de nous contacter est Telegram.",
    "de": "Fragen, nette Worte, skeptische Essays und gut recherchierte Warnungen sind willkommen. Am einfachsten erreichst du uns über Telegram.",
    "pt": "Perguntas, palavras gentis, textos céticos e alertas bem pesquisados são bem-vindos. A forma mais fácil de falar conosco é pelo Telegram.",
    "zh": "欢迎提问、友善的话、怀疑性的长文以及有充分依据的提醒。最方便的联系方式是 Telegram。",
    "ja": "質問、優しい言葉、懐疑的な文章、よく調べた警告を歓迎します。連絡するならTelegramが一番簡単です。",
    "ar": "نرحب بالأسئلة والكلمات الطيبة والمقالات المتشككة والتحذيرات المدروسة جيدًا. أسهل طريقة للتواصل معنا هي Telegram."
  },
  "Join us on Telegram →": {
    "es": "Únete a nosotros en Telegram →",
    "fr": "Rejoignez-nous sur Telegram →",
    "de": "Auf Telegram mitmachen →",
    "pt": "Junte-se a nós no Telegram →",
    "zh": "加入我们的 Telegram →",
    "ja": "Telegramで参加 →",
    "ar": "انضم إلينا على Telegram ←"
  },
  "Frequently asked, honestly answered": {
    "es": "Preguntas frecuentes, respondidas con honestidad",
    "fr": "Questions fréquentes, réponses honnêtes",
    "de": "Häufig gefragt, ehrlich beantwortet",
    "pt": "Perguntas frequentes, respondidas com honestidade",
    "zh": "常见问题，诚实回答",
    "ja": "よくある質問、正直に回答",
    "ar": "أسئلة شائعة، وإجابات صادقة"
  },
  "The important questions, including the ones a sensible person would ask before clicking anything.": {
    "es": "Las preguntas importantes, incluidas las que una persona sensata haría antes de hacer clic en cualquier cosa.",
    "fr": "Les questions importantes, y compris celles qu’une personne raisonnable poserait avant de cliquer sur quoi que ce soit.",
    "de": "Die wichtigen Fragen, einschließlich derer, die ein vernünftiger Mensch stellen würde, bevor er irgendwo klickt.",
    "pt": "As perguntas importantes, incluindo as que uma pessoa sensata faria antes de clicar em qualquer coisa.",
    "zh": "重要的问题，包括一个理智的人在点击任何东西之前会问的问题。",
    "ja": "重要な質問、何かをクリックする前に分別ある人ならする質問も含みます。",
    "ar": "الأسئلة المهمة، بما فيها تلك التي قد يطرحها شخص عاقل قبل الضغط على أي شيء."
  },
  "Is this an investment?": {
    "es": "¿Es una inversión?",
    "fr": "Est-ce un investissement ?",
    "de": "Ist das eine Investition?",
    "pt": "Isso é um investimento?",
    "zh": "这是投资吗？",
    "ja": "これは投資ですか？",
    "ar": "هل هذا استثمار؟"
  },
  "No. Support is a voluntary contribution, not equity, a loan, a security, or a ticket to future returns.": {
    "es": "No. El apoyo es una contribución voluntaria, no participación, préstamo, valor financiero ni entrada a futuros rendimientos.",
    "fr": "Non. Le soutien est une contribution volontaire, pas des parts, un prêt, un titre financier ou un ticket vers de futurs rendements.",
    "de": "Nein. Unterstützung ist ein freiwilliger Beitrag, keine Beteiligung, kein Darlehen, kein Wertpapier und kein Anspruch auf zukünftige Renditen.",
    "pt": "Não. O apoio é uma contribuição voluntária, não participação societária, empréstimo, valor mobiliário ou ingresso para retornos futuros.",
    "zh": "不是。支持是自愿捐助，不是股权、贷款、证券，也不是未来收益的门票。",
    "ja": "いいえ。支援は任意の寄付であり、株式、ローン、有価証券、将来の利益への権利ではありません。",
    "ar": "لا. الدعم مساهمة طوعية وليس أسهمًا أو قرضًا أو ورقة مالية أو تذكرة لعوائد مستقبلية."
  },
  "Is this a scam?": {
    "es": "¿Es una estafa?",
    "fr": "Est-ce une arnaque ?",
    "de": "Ist das ein Betrug?",
    "pt": "Isso é uma fraude?",
    "zh": "这是骗局吗？",
    "ja": "これは詐欺ですか？",
    "ar": "هل هذه عملية احتيال؟"
  },
  "A scam generally promises something in return. This site is unusually clear: you get no financial upside, only a place in a strange internet story.": {
    "es": "Una estafa normalmente promete algo a cambio. Este sitio es inusualmente claro: no obtienes ningún beneficio financiero, solo un lugar en una extraña historia de internet.",
    "fr": "Une arnaque promet généralement quelque chose en retour. Ce site est exceptionnellement clair : vous n’obtenez aucun avantage financier, seulement une place dans une étrange histoire Internet.",
    "de": "Ein Betrug verspricht normalerweise etwas im Gegenzug. Diese Website ist ungewöhnlich klar: Du bekommst keinen finanziellen Vorteil, nur einen Platz in einer seltsamen Internetgeschichte.",
    "pt": "Uma fraude geralmente promete algo em troca. Este site é excepcionalmente claro: você não recebe benefício financeiro, apenas um lugar em uma história estranha da internet.",
    "zh": "骗局通常会承诺回报。这个网站非常明确：你得不到任何经济收益，只会成为一个奇怪互联网故事的一部分。",
    "ja": "詐欺は通常、見返りを約束します。このサイトは珍しく明確です。金銭的な利益はなく、奇妙なインターネット物語の一員になるだけです。",
    "ar": "عادةً ما تعد عملية الاحتيال بشيء مقابل المال. هذا الموقع واضح بشكل غير معتاد: لا تحصل على أي مكسب مالي، فقط مكان في قصة غريبة على الإنترنت."
  },
  "What happens to my support?": {
    "es": "¿Qué ocurre con mi apoyo?",
    "fr": "Que devient mon soutien ?",
    "de": "Was passiert mit meiner Unterstützung?",
    "pt": "O que acontece com meu apoio?",
    "zh": "我的支持会怎样？",
    "ja": "支援金はどうなりますか？",
    "ar": "ماذا يحدث لدعمي؟"
  },
  "It helps the creator continue the public challenge. Payment is handled by the selected third-party service, not by this website.": {
    "es": "Ayuda al creador a continuar el reto público. El pago lo gestiona el servicio externo seleccionado, no este sitio web.",
    "fr": "Il aide le créateur à poursuivre le défi public. Le paiement est géré par le service tiers sélectionné, pas par ce site.",
    "de": "Es hilft dem Ersteller, die öffentliche Herausforderung fortzusetzen. Die Zahlung wird vom ausgewählten Drittanbieter abgewickelt, nicht von dieser Website.",
    "pt": "Ajuda o criador a continuar o desafio público. O pagamento é processado pelo serviço terceirizado selecionado, não por este site.",
    "zh": "它帮助创建者继续这项公开挑战。付款由选定的第三方服务处理，而不是由本网站处理。",
    "ja": "支援はクリエイターが公開チャレンジを続ける助けになります。支払いはこのサイトではなく、選択された第三者サービスが処理します。",
    "ar": "يساعد المبدع على مواصلة التحدي العلني. تتم معالجة الدفع بواسطة الخدمة الخارجية المختارة، وليس بواسطة هذا الموقع."
  },
  "Can I get a refund?": {
    "es": "¿Puedo obtener un reembolso?",
    "fr": "Puis-je être remboursé ?",
    "de": "Kann ich eine Rückerstattung bekommen?",
    "pt": "Posso receber um reembolso?",
    "zh": "可以退款吗？",
    "ja": "返金できますか？",
    "ar": "هل يمكنني استرداد المال؟"
  },
  "Contributions are voluntary and non-refundable. Please only send money you are comfortable not seeing again.": {
    "es": "Las contribuciones son voluntarias y no reembolsables. Envía solo dinero que estés dispuesto a no volver a ver.",
    "fr": "Les contributions sont volontaires et non remboursables. N’envoyez que de l’argent que vous êtes à l’aise de ne jamais revoir.",
    "de": "Beiträge sind freiwillig und nicht erstattungsfähig. Bitte sende nur Geld, auf das du verzichten kannst.",
    "pt": "As contribuições são voluntárias e não reembolsáveis. Envie apenas dinheiro que você não se importe de não ver novamente.",
    "zh": "支持是自愿的且不可退款。请只发送你能接受无法收回的钱。",
    "ja": "支援は任意で返金できません。戻ってこなくても構わない金額だけ送ってください。",
    "ar": "المساهمات طوعية وغير قابلة للاسترداد. أرسل فقط مالًا يمكنك تقبل عدم رؤيته مرة أخرى."
  },
  "What happens at €1,000,000,000?": {
    "es": "¿Qué pasa al llegar a 1.000.000.000 €?",
    "fr": "Que se passe-t-il à 1 000 000 000 € ?",
    "de": "Was passiert bei 1.000.000.000 €?",
    "pt": "O que acontece aos €1.000.000.000?",
    "zh": "达到 10 亿欧元会怎样？",
    "ja": "10億ユーロに到達するとどうなりますか？",
    "ar": "ماذا يحدث عند الوصول إلى مليار يورو؟"
  },
  "The creator reveals their identity, makes several responsible decisions, and probably cries a little.": {
    "es": "El creador revela su identidad, toma varias decisiones responsables y probablemente llora un poco.",
    "fr": "Le créateur révèle son identité, prend plusieurs décisions responsables et pleure probablement un peu.",
    "de": "Der Ersteller enthüllt seine Identität, trifft einige verantwortungsvolle Entscheidungen und weint wahrscheinlich ein bisschen.",
    "pt": "O criador revela sua identidade, toma algumas decisões responsáveis e provavelmente chora um pouco.",
    "zh": "创建者会公开身份，做出一些负责任的决定，可能还会哭一会儿。",
    "ja": "クリエイターが正体を明かし、いくつか責任ある決断をして、おそらく少し泣きます。",
    "ar": "يكشف المبدع عن هويته، ويتخذ عدة قرارات مسؤولة، وربما يبكي قليلًا."
  },
  "Can I contact you?": {
    "es": "¿Puedo contactar contigo?",
    "fr": "Puis-je vous contacter ?",
    "de": "Kann ich dich kontaktieren?",
    "pt": "Posso entrar em contato?",
    "zh": "可以联系你吗？",
    "ja": "連絡できますか？",
    "ar": "هل يمكنني التواصل معك؟"
  },
  "Yes:": {
    "es": "Sí:",
    "fr": "Oui :",
    "de": "Ja:",
    "pt": "Sim:",
    "zh": "可以：",
    "ja": "はい：",
    "ar": "نعم:"
  },
  "Replies may be slower than the road to a billion.": {
    "es": "Las respuestas pueden ser más lentas que el camino hacia los mil millones.",
    "fr": "Les réponses peuvent être plus lentes que la route vers le milliard.",
    "de": "Antworten können langsamer sein als der Weg zur Milliarde.",
    "pt": "As respostas podem ser mais lentas que o caminho até o bilhão.",
    "zh": "回复速度可能比通往 10 亿欧元的路还慢。",
    "ja": "返信は10億ユーロへの道のりより遅いかもしれません。",
    "ar": "قد تكون الردود أبطأ من الطريق إلى المليار."
  },
  "Changelog, allegedly": {
    "es": "Registro de cambios, supuestamente",
    "fr": "Journal des modifications, soi-disant",
    "de": "Änderungsprotokoll, angeblich",
    "pt": "Changelog, supostamente",
    "zh": "更新日志，据说",
    "ja": "変更履歴、たぶん",
    "ar": "سجل التغييرات، على حد زعمه"
  },
  "A record of what actually changes. This page is deliberately short until there is more to report.": {
    "es": "Un registro de lo que realmente cambia. Esta página es deliberadamente corta hasta que haya más que contar.",
    "fr": "Un registre de ce qui change réellement. Cette page reste volontairement courte jusqu’à ce qu’il y ait plus à raconter.",
    "de": "Ein Protokoll dessen, was sich tatsächlich ändert. Diese Seite bleibt bewusst kurz, bis es mehr zu berichten gibt.",
    "pt": "Um registro do que realmente muda. Esta página é deliberadamente curta até haver mais para contar.",
    "zh": "记录真正发生变化的内容。在有更多可报告之前，这个页面会保持简短。",
    "ja": "実際に変わったことの記録。報告できることが増えるまで、あえて短くしています。",
    "ar": "سجل لما يتغير فعليًا. هذه الصفحة قصيرة عمدًا حتى يصبح هناك المزيد للإبلاغ عنه."
  },
  "Made it easier to share.": {
    "es": "Hicimos que compartir fuera más fácil.",
    "fr": "Partage simplifié.",
    "de": "Das Teilen erleichtert.",
    "pt": "Facilitamos o compartilhamento.",
    "zh": "让分享更容易。",
    "ja": "共有しやすくしました。",
    "ar": "جعلنا المشاركة أسهل."
  },
  "Social previews tightened up, share buttons added, and the experiment is now a little easier to send into the internet.": {
    "es": "Mejoramos las vistas previas sociales, añadimos botones para compartir y ahora es un poco más fácil enviar el experimento a internet.",
    "fr": "Aperçus sociaux améliorés, boutons de partage ajoutés, et l’expérience est désormais un peu plus facile à diffuser sur Internet.",
    "de": "Social Previews verbessert, Teilen-Schaltflächen hinzugefügt und das Experiment lässt sich nun etwas leichter ins Internet schicken.",
    "pt": "Melhoramos as prévias sociais, adicionamos botões de compartilhamento e agora ficou um pouco mais fácil enviar o experimento para a internet.",
    "zh": "优化了社交预览，加入分享按钮，现在把实验传播到互联网更容易了。",
    "ja": "ソーシャルプレビューを整え、共有ボタンを追加。実験をインターネットへ送り出しやすくしました。",
    "ar": "حسّنا المعاينات الاجتماعية، وأضفنا أزرار مشاركة، وأصبح نشر التجربة على الإنترنت أسهل قليلًا."
  },
  "Website polished.": {
    "es": "Sitio web pulido.",
    "fr": "Site amélioré.",
    "de": "Website verfeinert.",
    "pt": "Site refinado.",
    "zh": "网站优化完成。",
    "ja": "ウェブサイトを改善。",
    "ar": "تم تحسين الموقع."
  },
  "Cleaner flow, clearer terms, better sharing metadata, a Telegram contact route, and fewer things pretending to be live.": {
    "es": "Flujo más limpio, términos más claros, mejores metadatos para compartir, contacto por Telegram y menos cosas fingiendo estar en vivo.",
    "fr": "Parcours plus clair, conditions plus nettes, meilleurs métadonnées de partage, contact Telegram et moins de choses prétendant être en direct.",
    "de": "Klarerer Ablauf, deutlichere Bedingungen, bessere Sharing-Metadaten, Telegram-Kontakt und weniger Dinge, die so tun, als wären sie live.",
    "pt": "Fluxo mais limpo, termos mais claros, melhores metadados de compartilhamento, contato via Telegram e menos coisas fingindo estar ao vivo.",
    "zh": "流程更清晰、条款更明确、分享元数据更好、增加 Telegram 联系方式，也减少了假装实时的内容。",
    "ja": "流れを整理し、規約を明確化し、共有メタデータを改善、Telegram連絡先を追加。ライブっぽく見せるものも減らしました。",
    "ar": "تدفق أنظف، شروط أوضح، بيانات مشاركة أفضل، وسيلة تواصل عبر Telegram، وأشياء أقل تتظاهر بأنها مباشرة."
  },
  "The experiment launched.": {
    "es": "El experimento se lanzó.",
    "fr": "L’expérience a été lancée.",
    "de": "Das Experiment ist gestartet.",
    "pt": "O experimento foi lançado.",
    "zh": "实验上线了。",
    "ja": "実験が開始されました。",
    "ar": "تم إطلاق التجربة."
  },
  "A domain, a progress bar, and an amount of confidence not supported by conventional business theory.": {
    "es": "Un dominio, una barra de progreso y una cantidad de confianza que la teoría empresarial convencional no respalda.",
    "fr": "Un domaine, une barre de progression et un niveau de confiance que la théorie commerciale conventionnelle ne soutient pas.",
    "de": "Eine Domain, ein Fortschrittsbalken und ein Maß an Zuversicht, das von konventioneller Geschäftstheorie nicht gestützt wird.",
    "pt": "Um domínio, uma barra de progresso e uma confiança que a teoria empresarial convencional não apoia.",
    "zh": "一个域名、一条进度条，以及传统商业理论无法支持的自信程度。",
    "ja": "ドメイン、進捗バー、そして従来のビジネス理論では説明できない自信。",
    "ar": "نطاق، وشريط تقدم، وكمية من الثقة لا تدعمها نظريات الأعمال التقليدية."
  },
  "Actual progress.": {
    "es": "Progreso real.",
    "fr": "Progrès réel.",
    "de": "Tatsächlicher Fortschritt.",
    "pt": "Progresso real.",
    "zh": "真正的进展。",
    "ja": "実際の進捗。",
    "ar": "التقدم الفعلي."
  },
  "New support, new milestones, and updates worth refreshing for.": {
    "es": "Nuevo apoyo, nuevos hitos y novedades que merezcan refrescar la página.",
    "fr": "Nouveaux soutiens, nouvelles étapes et mises à jour qui valent la peine d’être actualisées.",
    "de": "Neue Unterstützung, neue Meilensteine und Updates, für die sich ein Neuladen lohnt.",
    "pt": "Novo apoio, novos marcos e atualizações que valem a pena acompanhar.",
    "zh": "新的支持、新的里程碑，以及值得刷新页面查看的更新。",
    "ja": "新しい支援、新しいマイルストーン、更新する価値のある進展。",
    "ar": "دعم جديد، ومراحل جديدة، وتحديثات تستحق إعادة التحميل."
  },
  "The boring page, made readable": {
    "es": "La página aburrida, hecha legible",
    "fr": "La page ennuyeuse, rendue lisible",
    "de": "Die langweilige Seite, lesbar gemacht",
    "pt": "A página chata, agora legível",
    "zh": "无聊的页面，也做得好读",
    "ja": "退屈なページを読みやすく",
    "ar": "الصفحة المملة، لكن سهلة القراءة"
  },
  "Information you choose to provide": {
    "es": "Información que eliges proporcionar",
    "fr": "Informations que vous choisissez de fournir",
    "de": "Informationen, die du bereitstellst",
    "pt": "Informações que você escolhe fornecer",
    "zh": "你选择提供的信息",
    "ja": "あなたが提供することを選んだ情報",
    "ar": "المعلومات التي تختار تقديمها"
  },
  "If you post a prediction or comment, its text and time of submission are stored so it can be displayed on the site. Do not submit personal or sensitive information.": {
    "es": "Si publicas una predicción o comentario, su texto y hora de envío se almacenan para mostrarlo en el sitio. No envíes información personal o sensible.",
    "fr": "Si vous publiez une prédiction ou un commentaire, son texte et son heure d’envoi sont stockés pour être affichés sur le site. Ne soumettez pas d’informations personnelles ou sensibles.",
    "de": "Wenn du eine Prognose oder einen Kommentar veröffentlichst, werden Text und Zeitpunkt gespeichert, damit sie auf der Website angezeigt werden können. Übermittle keine persönlichen oder sensiblen Informationen.",
    "pt": "Se você publicar uma previsão ou comentário, o texto e o horário de envio serão armazenados para exibição no site. Não envie informações pessoais ou sensíveis.",
    "zh": "如果你发布预测或评论，其文本和提交时间会被存储，以便在网站上显示。请勿提交个人或敏感信息。",
    "ja": "予測やコメントを投稿すると、サイトに表示するため本文と投稿時刻が保存されます。個人情報や機密情報は送信しないでください。",
    "ar": "إذا نشرت توقعًا أو تعليقًا، يتم تخزين نصه ووقت إرساله لعرضه على الموقع. لا ترسل معلومات شخصية أو حساسة."
  },
  "Support data": {
    "es": "Datos de apoyo",
    "fr": "Données de soutien",
    "de": "Unterstützungsdaten",
    "pt": "Dados de apoio",
    "zh": "支持数据",
    "ja": "支援データ",
    "ar": "بيانات الدعم"
  },
  "Payments are made through third-party providers. This website does not collect or store your full payment-card information. Providers handle data under their own policies.": {
    "es": "Los pagos se realizan mediante proveedores externos. Este sitio no recopila ni almacena los datos completos de tu tarjeta. Los proveedores gestionan los datos según sus propias políticas.",
    "fr": "Les paiements passent par des prestataires tiers. Ce site ne collecte ni ne stocke les informations complètes de votre carte bancaire. Les prestataires gèrent les données selon leurs propres politiques.",
    "de": "Zahlungen erfolgen über Drittanbieter. Diese Website sammelt oder speichert keine vollständigen Kartendaten. Anbieter verarbeiten Daten nach ihren eigenen Richtlinien.",
    "pt": "Os pagamentos são feitos por provedores terceirizados. Este site não coleta nem armazena suas informações completas de cartão. Os provedores tratam os dados de acordo com suas próprias políticas.",
    "zh": "付款通过第三方提供商进行。本网站不会收集或存储完整的银行卡信息。服务商根据自己的政策处理数据。",
    "ja": "支払いは第三者サービスを通じて行われます。このサイトは完全なカード情報を収集・保存しません。各サービスは独自のポリシーに従ってデータを扱います。",
    "ar": "تتم المدفوعات عبر مزودي خدمات خارجيين. لا يجمع هذا الموقع معلومات بطاقتك الكاملة أو يخزنها. يتعامل المزودون مع البيانات وفق سياساتهم الخاصة."
  },
  "Technical data": {
    "es": "Datos técnicos",
    "fr": "Données techniques",
    "de": "Technische Daten",
    "pt": "Dados técnicos",
    "zh": "技术数据",
    "ja": "技術データ",
    "ar": "البيانات التقنية"
  },
  "The site and its service providers may process ordinary technical information needed to operate and secure the service, such as logs, browser information, and timestamps. To limit prediction spam, the prediction service also uses a one-way hashed network identifier for rate limiting; it is not displayed publicly.": {
    "es": "El sitio y sus proveedores pueden procesar información técnica habitual necesaria para operar y proteger el servicio, como registros, información del navegador y marcas de tiempo. Para limitar el spam de predicciones, el servicio también usa un identificador de red hasheado de una sola vía para limitar la frecuencia; no se muestra públicamente.",
    "fr": "Le site et ses prestataires peuvent traiter les informations techniques ordinaires nécessaires au fonctionnement et à la sécurité du service, comme les journaux, les informations du navigateur et les horodatages. Pour limiter le spam de prédictions, le service utilise aussi un identifiant réseau haché à sens unique pour limiter la fréquence ; il n’est pas affiché publiquement.",
    "de": "Die Website und ihre Dienstleister können übliche technische Informationen verarbeiten, die für Betrieb und Sicherheit nötig sind, etwa Protokolle, Browserinformationen und Zeitstempel. Um Prediction-Spam zu begrenzen, verwendet der Prediction-Dienst außerdem einen einseitig gehashten Netzwerkidentifikator zur Ratenbegrenzung; er wird nicht öffentlich angezeigt.",
    "pt": "O site e seus provedores podem processar informações técnicas comuns necessárias para operar e proteger o serviço, como registros, informações do navegador e horários. Para limitar spam de previsões, o serviço também usa um identificador de rede com hash unidirecional para limitar a frequência; ele não é exibido publicamente.",
    "zh": "网站及其服务提供商可能会处理运行和保护服务所需的普通技术信息，例如日志、浏览器信息和时间戳。为限制预测垃圾信息，预测服务还会使用单向哈希的网络标识符进行频率限制；该标识符不会公开显示。",
    "ja": "サイトとサービス提供者は、運用・セキュリティに必要な通常の技術情報（ログ、ブラウザ情報、タイムスタンプなど）を処理することがあります。予測スパムを制限するため、一方向ハッシュ化したネットワーク識別子もレート制限に使用しますが、公開表示はされません。",
    "ar": "قد يعالج الموقع ومقدمو خدماته معلومات تقنية عادية لازمة لتشغيل الخدمة وتأمينها، مثل السجلات ومعلومات المتصفح والطوابع الزمنية. وللحد من رسائل التوقعات المزعجة، تستخدم الخدمة أيضًا معرف شبكة مجزأ أحادي الاتجاه لتحديد المعدل؛ ولا يتم عرضه علنًا."
  },
  "How information is used": {
    "es": "Cómo se utiliza la información",
    "fr": "Comment les informations sont utilisées",
    "de": "Wie Informationen verwendet werden",
    "pt": "Como as informações são usadas",
    "zh": "信息如何使用",
    "ja": "情報の利用方法",
    "ar": "كيف تُستخدم المعلومات"
  },
  "It is used to run the site, show public predictions or support totals, prevent misuse, and respond to messages. It is not sold as a product.": {
    "es": "Se utiliza para operar el sitio, mostrar predicciones públicas o totales de apoyo, prevenir abusos y responder a mensajes. No se vende como producto.",
    "fr": "Elle sert à faire fonctionner le site, afficher les prédictions publiques ou les totaux de soutien, prévenir les abus et répondre aux messages. Elle n’est pas vendue comme produit.",
    "de": "Sie wird verwendet, um die Website zu betreiben, öffentliche Prognosen oder Unterstützungssummen anzuzeigen, Missbrauch zu verhindern und auf Nachrichten zu antworten. Sie wird nicht als Produkt verkauft.",
    "pt": "Ela é usada para operar o site, mostrar previsões públicas ou totais de apoio, prevenir abusos e responder a mensagens. Não é vendida como produto.",
    "zh": "这些信息用于运行网站、显示公开预测或支持总额、防止滥用并回复消息。不会作为产品出售。",
    "ja": "サイト運営、公に表示する予測や支援総額の表示、不正利用の防止、メッセージへの対応に使用されます。商品として販売されることはありません。",
    "ar": "تُستخدم لتشغيل الموقع وعرض التوقعات العامة أو إجمالي الدعم ومنع إساءة الاستخدام والرد على الرسائل. ولا تُباع كمنتج."
  },
  "Your questions": {
    "es": "Tus preguntas",
    "fr": "Vos questions",
    "de": "Deine Fragen",
    "pt": "Suas perguntas",
    "zh": "你的问题",
    "ja": "質問はこちら",
    "ar": "أسئلتك"
  },
  "For privacy questions or removal requests, email": {
    "es": "Para preguntas de privacidad o solicitudes de eliminación, escribe a",
    "fr": "Pour les questions de confidentialité ou les demandes de suppression, écrivez à",
    "de": "Bei Datenschutzfragen oder Löschanfragen schreibe an",
    "pt": "Para dúvidas de privacidade ou pedidos de remoção, envie um e-mail para",
    "zh": "如有隐私问题或删除请求，请发送邮件至",
    "ja": "プライバシーに関する質問や削除依頼は、こちらにメールしてください",
    "ar": "لأسئلة الخصوصية أو طلبات الحذف، راسل"
  },
  "The important small print": {
    "es": "La letra pequeña importante",
    "fr": "Les petites lignes importantes",
    "de": "Das wichtige Kleingedruckte",
    "pt": "As letras miúdas importantes",
    "zh": "重要的小字条款",
    "ja": "重要な細則",
    "ar": "التفاصيل الصغيرة المهمة"
  },
  "What this is": {
    "es": "Qué es esto",
    "fr": "Ce que c’est",
    "de": "Was das ist",
    "pt": "O que é isso",
    "zh": "这是什么",
    "ja": "これは何か",
    "ar": "ما هذا"
  },
  "IWANNABERICH is a personal public experiment. It is not a company offer, security, investment, loan, or financial product.": {
    "es": "IWANNABERICH es un experimento público personal. No es una oferta de empresa, valor financiero, inversión, préstamo ni producto financiero.",
    "fr": "IWANNABERICH est une expérience publique personnelle. Ce n’est ni une offre d’entreprise, ni un titre financier, ni un investissement, ni un prêt, ni un produit financier.",
    "de": "IWANNABERICH ist ein persönliches öffentliches Experiment. Es ist kein Unternehmensangebot, Wertpapier, keine Investition, kein Darlehen und kein Finanzprodukt.",
    "pt": "IWANNABERICH é um experimento público pessoal. Não é uma oferta empresarial, valor mobiliário, investimento, empréstimo ou produto financeiro.",
    "zh": "IWANNABERICH 是个人公开实验。它不是公司要约、证券、投资、贷款或金融产品。",
    "ja": "IWANNABERICHは個人による公開実験です。会社のオファー、有価証券、投資、ローン、金融商品ではありません。",
    "ar": "IWANNABERICH تجربة شخصية علنية. ليست عرضًا لشركة أو ورقة مالية أو استثمارًا أو قرضًا أو منتجًا ماليًا."
  },
  "Voluntary support": {
    "es": "Apoyo voluntario",
    "fr": "Soutien volontaire",
    "de": "Freiwillige Unterstützung",
    "pt": "Apoio voluntário",
    "zh": "自愿支持",
    "ja": "任意の支援",
    "ar": "الدعم الطوعي"
  },
  "Any support sent through a linked third-party payment service is voluntary and non-refundable. It does not create equity, ownership, returns, voting rights, or a claim on future success.": {
    "es": "Cualquier apoyo enviado mediante un servicio de pago externo vinculado es voluntario y no reembolsable. No crea participación, propiedad, rendimientos, derechos de voto ni derecho sobre el éxito futuro.",
    "fr": "Tout soutien envoyé via un service de paiement tiers lié est volontaire et non remboursable. Il ne crée aucune participation, propriété, rendement, droit de vote ni droit sur un succès futur.",
    "de": "Jede über einen verknüpften Drittanbieter gesendete Unterstützung ist freiwillig und nicht erstattungsfähig. Sie begründet keine Beteiligung, Eigentumsrechte, Renditen, Stimmrechte oder Ansprüche auf zukünftigen Erfolg.",
    "pt": "Qualquer apoio enviado por um serviço de pagamento terceirizado vinculado é voluntário e não reembolsável. Não cria participação, propriedade, retornos, direitos de voto ou direito sobre sucesso futuro.",
    "zh": "通过关联的第三方支付服务提供的任何支持都是自愿且不可退款的。不会产生股权、所有权、收益、投票权或对未来成功的权利。",
    "ja": "リンクされた第三者決済サービスを通じた支援は任意で返金不可です。株式、所有権、利益、議決権、将来の成功への請求権は発生しません。",
    "ar": "أي دعم يتم إرساله عبر خدمة دفع خارجية مرتبطة هو طوعي وغير قابل للاسترداد. ولا ينشئ أسهمًا أو ملكية أو عوائد أو حقوق تصويت أو مطالبة بالنجاح المستقبلي."
  },
  "Predictions and comments": {
    "es": "Predicciones y comentarios",
    "fr": "Prédictions et commentaires",
    "de": "Prognosen und Kommentare",
    "pt": "Previsões e comentários",
    "zh": "预测与评论",
    "ja": "予測とコメント",
    "ar": "التوقعات والتعليقات"
  },
  "By posting a prediction or comment, you allow it to be displayed on the site. Keep it lawful, respectful, and free of personal information you do not want public.": {
    "es": "Al publicar una predicción o comentario, permites que se muestre en el sitio. Mantén el contenido legal, respetuoso y sin información personal que no quieras hacer pública.",
    "fr": "En publiant une prédiction ou un commentaire, vous autorisez son affichage sur le site. Restez légal, respectueux et n’incluez pas d’informations personnelles que vous ne voulez pas rendre publiques.",
    "de": "Mit dem Veröffentlichen einer Prognose oder eines Kommentars erlaubst du die Anzeige auf der Website. Halte den Inhalt rechtmäßig, respektvoll und frei von persönlichen Informationen, die du nicht öffentlich machen möchtest.",
    "pt": "Ao publicar uma previsão ou comentário, você permite que ele seja exibido no site. Mantenha o conteúdo legal, respeitoso e sem informações pessoais que você não queira tornar públicas.",
    "zh": "发布预测或评论即表示你允许其在网站上展示。请确保内容合法、尊重他人，并不要包含你不希望公开的个人信息。",
    "ja": "予測やコメントを投稿すると、サイトでの表示を許可したことになります。合法的で礼儀正しく、公開したくない個人情報は含めないでください。",
    "ar": "بنشر توقع أو تعليق، فإنك تسمح بعرضه على الموقع. اجعله قانونيًا ومحترمًا وخاليًا من معلومات شخصية لا تريد نشرها."
  },
  "Third-party services": {
    "es": "Servicios de terceros",
    "fr": "Services tiers",
    "de": "Drittanbieter-Dienste",
    "pt": "Serviços de terceiros",
    "zh": "第三方服务",
    "ja": "第三者サービス",
    "ar": "خدمات الطرف الثالث"
  },
  "Payment providers and other linked services have their own terms and privacy practices. Use them only if you agree to those terms.": {
    "es": "Los proveedores de pago y otros servicios vinculados tienen sus propios términos y prácticas de privacidad. Úsalos solo si aceptas esos términos.",
    "fr": "Les prestataires de paiement et autres services liés ont leurs propres conditions et pratiques de confidentialité. Utilisez-les uniquement si vous les acceptez.",
    "de": "Zahlungsanbieter und andere verknüpfte Dienste haben eigene Bedingungen und Datenschutzpraktiken. Nutze sie nur, wenn du diesen zustimmst.",
    "pt": "Provedores de pagamento e outros serviços vinculados têm seus próprios termos e práticas de privacidade. Use-os apenas se concordar com esses termos.",
    "zh": "支付提供商和其他关联服务有自己的条款和隐私政策。只有同意这些条款时才使用它们。",
    "ja": "決済事業者などのリンク先サービスには独自の規約とプライバシー慣行があります。同意した場合のみ利用してください。",
    "ar": "لدى مزودي الدفع والخدمات المرتبطة شروط وممارسات خصوصية خاصة بهم. استخدمها فقط إذا وافقت على تلك الشروط."
  },
  "Contact": {
    "es": "Contacto",
    "fr": "Contact",
    "de": "Kontakt",
    "pt": "Contato",
    "zh": "联系",
    "ja": "連絡先",
    "ar": "التواصل"
  },
  "Questions about these terms:": {
    "es": "Preguntas sobre estos términos:",
    "fr": "Questions sur ces conditions :",
    "de": "Fragen zu diesen Bedingungen:",
    "pt": "Dúvidas sobre estes termos:",
    "zh": "关于这些条款的问题：",
    "ja": "この規約に関する質問：",
    "ar": "أسئلة حول هذه الشروط:"
  },
  "A small note about small files": {
    "es": "Una pequeña nota sobre pequeños archivos",
    "fr": "Une petite note sur les petits fichiers",
    "de": "Eine kleine Notiz über kleine Dateien",
    "pt": "Uma pequena nota sobre pequenos arquivos",
    "zh": "关于小文件的一点说明",
    "ja": "小さなファイルについての小さな注意",
    "ar": "ملاحظة صغيرة عن الملفات الصغيرة"
  },
  "Cookie Policy": {
    "es": "Política de cookies",
    "fr": "Politique relative aux cookies",
    "de": "Cookie-Richtlinie",
    "pt": "Política de Cookies",
    "zh": "Cookie 政策",
    "ja": "Cookieポリシー",
    "ar": "سياسة ملفات تعريف الارتباط"
  },
  "What cookies are": {
    "es": "Qué son las cookies",
    "fr": "Ce que sont les cookies",
    "de": "Was Cookies sind",
    "pt": "O que são cookies",
    "zh": "什么是 Cookie",
    "ja": "Cookieとは",
    "ar": "ما هي ملفات تعريف الارتباط"
  },
  "Cookies are small pieces of data that a browser can store to remember information about a visit.": {
    "es": "Las cookies son pequeños datos que un navegador puede almacenar para recordar información sobre una visita.",
    "fr": "Les cookies sont de petites données qu’un navigateur peut stocker pour mémoriser des informations sur une visite.",
    "de": "Cookies sind kleine Datenstücke, die ein Browser speichern kann, um Informationen über einen Besuch zu merken.",
    "pt": "Cookies são pequenos dados que um navegador pode armazenar para lembrar informações sobre uma visita.",
    "zh": "Cookie 是浏览器可以存储的小段数据，用于记住访问信息。",
    "ja": "Cookieはブラウザが保存して訪問情報を記憶する小さなデータです。",
    "ar": "ملفات تعريف الارتباط هي بيانات صغيرة يمكن للمتصفح تخزينها لتذكر معلومات عن الزيارة."
  },
  "How this site uses them": {
    "es": "Cómo los utiliza este sitio",
    "fr": "Comment ce site les utilise",
    "de": "Wie diese Website sie verwendet",
    "pt": "Como este site os usa",
    "zh": "本网站如何使用它们",
    "ja": "このサイトでの利用方法",
    "ar": "كيف يستخدمها هذا الموقع"
  },
  "IWANNABERICH does not use cookies for advertising or sell browsing data. Essential third-party services, such as payment providers or privacy-friendly analytics, may use limited storage or similar technologies to operate securely and measure aggregate activity.": {
    "es": "IWANNABERICH no utiliza cookies para publicidad ni vende datos de navegación. Los servicios externos esenciales, como proveedores de pago o analítica respetuosa con la privacidad, pueden usar almacenamiento limitado o tecnologías similares para operar de forma segura y medir la actividad agregada.",
    "fr": "IWANNABERICH n’utilise pas de cookies à des fins publicitaires et ne vend pas les données de navigation. Des services tiers essentiels, comme les prestataires de paiement ou des outils d’analyse respectueux de la vie privée, peuvent utiliser un stockage limité ou des technologies similaires pour fonctionner en sécurité et mesurer l’activité agrégée.",
    "de": "IWANNABERICH verwendet Cookies weder für Werbung noch verkauft es Browserdaten. Notwendige Drittanbieter wie Zahlungsanbieter oder datenschutzfreundliche Analytics können begrenzten Speicher oder ähnliche Technologien verwenden, um sicher zu funktionieren und aggregierte Aktivität zu messen.",
    "pt": "O IWANNABERICH não usa cookies para publicidade nem vende dados de navegação. Serviços terceirizados essenciais, como provedores de pagamento ou análises com foco em privacidade, podem usar armazenamento limitado ou tecnologias semelhantes para operar com segurança e medir atividade agregada.",
    "zh": "IWANNABERICH 不使用 Cookie 做广告，也不出售浏览数据。必要的第三方服务（如支付服务商或注重隐私的分析工具）可能使用有限存储或类似技术，以安全运行并衡量汇总活动。",
    "ja": "IWANNABERICHは広告目的でCookieを使わず、閲覧データも販売しません。決済事業者やプライバシー配慮型分析などの必要な第三者サービスは、安全な運用や集計活動の測定のため限定的な保存等を使用する場合があります。",
    "ar": "لا يستخدم IWANNABERICH ملفات تعريف الارتباط للإعلانات ولا يبيع بيانات التصفح. قد تستخدم الخدمات الخارجية الأساسية، مثل مزودي الدفع أو التحليلات التي تراعي الخصوصية، تخزينًا محدودًا أو تقنيات مشابهة للتشغيل الآمن وقياس النشاط الإجمالي."
  },
  "Your choices": {
    "es": "Tus opciones",
    "fr": "Vos choix",
    "de": "Deine Optionen",
    "pt": "Suas escolhas",
    "zh": "你的选择",
    "ja": "選択肢",
    "ar": "خياراتك"
  },
  "You can control or delete cookies in your browser settings. Blocking some storage may affect features provided by third parties, including payments.": {
    "es": "Puedes controlar o eliminar las cookies en la configuración del navegador. Bloquear cierto almacenamiento puede afectar funciones de terceros, incluidos los pagos.",
    "fr": "Vous pouvez contrôler ou supprimer les cookies dans les paramètres du navigateur. Bloquer certains stockages peut affecter des fonctionnalités tierces, notamment les paiements.",
    "de": "Du kannst Cookies in den Browsereinstellungen kontrollieren oder löschen. Das Blockieren bestimmter Speicherarten kann Funktionen von Drittanbietern, einschließlich Zahlungen, beeinträchtigen.",
    "pt": "Você pode controlar ou excluir cookies nas configurações do navegador. Bloquear algum armazenamento pode afetar recursos de terceiros, incluindo pagamentos.",
    "zh": "你可以在浏览器设置中控制或删除 Cookie。阻止某些存储可能会影响第三方功能，包括支付。",
    "ja": "ブラウザ設定でCookieを管理・削除できます。一部の保存をブロックすると、決済など第三者機能に影響する場合があります。",
    "ar": "يمكنك التحكم في ملفات تعريف الارتباط أو حذفها من إعدادات المتصفح. قد يؤثر حظر بعض التخزين على ميزات الطرف الثالث، بما فيها المدفوعات."
  },
  "Questions": {
    "es": "Preguntas",
    "fr": "Questions",
    "de": "Fragen",
    "pt": "Perguntas",
    "zh": "问题",
    "ja": "質問",
    "ar": "أسئلة"
  },
  "For privacy questions, see the": {
    "es": "Para preguntas de privacidad, consulta la",
    "fr": "Pour les questions de confidentialité, consultez la",
    "de": "Bei Datenschutzfragen siehe",
    "pt": "Para dúvidas de privacidade, consulte",
    "zh": "如有隐私问题，请查看",
    "ja": "プライバシーについては",
    "ar": "لأسئلة الخصوصية، راجع"
  },
  "Privacy Policy": {
    "es": "Política de privacidad",
    "fr": "Politique de confidentialité",
    "de": "Datenschutzerklärung",
    "pt": "Política de Privacidade",
    "zh": "隐私政策",
    "ja": "プライバシーポリシー",
    "ar": "سياسة الخصوصية"
  },
  "A minor setback": {
    "es": "Un pequeño contratiempo",
    "fr": "Un petit contretemps",
    "de": "Ein kleiner Rückschlag",
    "pt": "Um pequeno contratempo",
    "zh": "一个小挫折",
    "ja": "ちょっとした後退",
    "ar": "انتكاسة صغيرة"
  },
  "This page doesn't exist. Which is unfortunate, but still less concerning than the €1 billion plan.": {
    "es": "Esta página no existe. Es desafortunado, pero sigue siendo menos preocupante que el plan de 1.000 millones de euros.",
    "fr": "Cette page n’existe pas. C’est regrettable, mais toujours moins inquiétant que le plan à 1 milliard d’euros.",
    "de": "Diese Seite existiert nicht. Bedauerlich, aber immer noch weniger beunruhigend als der 1-Milliarde-Euro-Plan.",
    "pt": "Esta página não existe. É uma pena, mas ainda é menos preocupante que o plano de €1 bilhão.",
    "zh": "这个页面不存在。很遗憾，但还是没有 10 亿欧元的计划那么令人担忧。",
    "ja": "このページは存在しません。残念ですが、10億ユーロ計画よりはまだ安心です。",
    "ar": "هذه الصفحة غير موجودة. هذا مؤسف، لكنه لا يزال أقل إثارة للقلق من خطة المليار يورو."
  },
  "Take me back to the delusion": {
    "es": "Llévame de vuelta a la ilusión",
    "fr": "Ramenez-moi au délire",
    "de": "Bring mich zurück zur Illusion",
    "pt": "Leve-me de volta à ilusão",
    "zh": "带我回到妄想",
    "ja": "妄想に戻る",
    "ar": "أعدني إلى الوهم"
  },
  "No equity. No returns. Not financial advice.\nBarely a business. Definitely a goal.": {
    "es": "Sin participación. Sin rendimientos. No es asesoramiento financiero.\nApenas un negocio. Sin duda, un objetivo.",
    "fr": "Aucune participation. Aucun rendement. Pas un conseil financier.\nÀ peine une activité. Certainement un objectif.",
    "de": "Keine Beteiligung. Keine Rendite. Keine Finanzberatung.\nKaum ein Geschäft. Definitiv ein Ziel.",
    "pt": "Sem participação. Sem retorno. Não é aconselhamento financeiro.\nMal é um negócio. Com certeza é um objetivo.",
    "zh": "没有股权。没有回报。不是财务建议。\n勉强算个生意，但绝对是个目标。",
    "ja": "株式なし。リターンなし。金融アドバイスではありません。\nほとんどビジネスではない。でも確実に目標です。",
    "ar": "لا أسهم. لا عوائد. ليست نصيحة مالية.\nبالكاد مشروع. لكنه بالتأكيد هدف."
  },
  "Skip to content": {
    "es": "Saltar al contenido",
    "fr": "Passer au contenu",
    "de": "Zum Inhalt springen",
    "pt": "Pular para o conteúdo",
    "zh": "跳到内容",
    "ja": "コンテンツへ移動",
    "ar": "تخطى إلى المحتوى"
  },
  "Live wealth counter": {
    "es": "Contador de patrimonio en vivo",
    "fr": "Compteur de patrimoine en direct",
    "de": "Live-Vermögenszähler",
    "pt": "Contador de patrimônio ao vivo",
    "zh": "实时财富计数器",
    "ja": "資産ライブカウンター",
    "ar": "عداد الثروة المباشر"
  },
  "How the experiment works": {
    "es": "Cómo funciona el experimento",
    "fr": "Comment fonctionne l’expérience",
    "de": "So funktioniert das Experiment",
    "pt": "Como o experimento funciona",
    "zh": "实验如何运作",
    "ja": "実験の仕組み",
    "ar": "كيف تعمل التجربة"
  },
  "What's next": {
    "es": "Qué sigue",
    "fr": "Et ensuite ?",
    "de": "Wie geht es weiter?",
    "pt": "O que vem a seguir",
    "zh": "下一步是什么",
    "ja": "次は何？",
    "ar": "ماذا بعد؟"
  },
  "The story behind it": {
    "es": "La historia detrás",
    "fr": "L’histoire derrière",
    "de": "Die Geschichte dahinter",
    "pt": "A história por trás",
    "zh": "背后的故事",
    "ja": "その背景にある物語",
    "ar": "القصة وراءه"
  },
  "How the game is played": {
    "es": "Cómo se juega",
    "fr": "Comment se joue le jeu",
    "de": "So wird gespielt",
    "pt": "Como o jogo funciona",
    "zh": "游戏规则",
    "ja": "ゲームの進め方",
    "ar": "كيف تُلعب اللعبة"
  },
  "Public record": {
    "es": "Registro público",
    "fr": "Registre public",
    "de": "Öffentliche Aufzeichnung",
    "pt": "Registro público",
    "zh": "公开记录",
    "ja": "公開記録",
    "ar": "السجل العلني"
  },
  "Telegram community": {
    "es": "Comunidad de Telegram",
    "fr": "Communauté Telegram",
    "de": "Telegram-Community",
    "pt": "Comunidade do Telegram",
    "zh": "Telegram 社区",
    "ja": "Telegramコミュニティ",
    "ar": "مجتمع Telegram"
  },
  "What people are saying": {
    "es": "Lo que dice la gente",
    "fr": "Ce que les gens disent",
    "de": "Was die Leute sagen",
    "pt": "O que as pessoas estão dizendo",
    "zh": "人们怎么说",
    "ja": "人々の声",
    "ar": "ماذا يقول الناس"
  },
  "Make your call": {
    "es": "Haz tu apuesta",
    "fr": "Faites votre pronostic",
    "de": "Gib deine Einschätzung ab",
    "pt": "Dê seu palpite",
    "zh": "做出你的判断",
    "ja": "予想する",
    "ar": "أعطِ توقعك"
  },
  "SOON": {
    "es": "PRONTO",
    "fr": "BIENTÔT",
    "de": "BALD",
    "pt": "EM BREVE",
    "zh": "即将推出",
    "ja": "近日",
    "ar": "قريبًا"
  },
  "It started as": {
    "es": "Empezó como",
    "fr": "Cela a commencé par",
    "de": "Es begann als",
    "pt": "Começou como",
    "zh": "它始于",
    "ja": "始まりは",
    "ar": "بدأ كـ"
  },
  "Why €1 billion?": {
    "es": "¿Por qué 1.000 millones de euros?",
    "fr": "Pourquoi 1 milliard d’euros ?",
    "de": "Warum 1 Milliarde Euro?",
    "pt": "Por que 1 bilhão de euros?",
    "zh": "为什么是 10 亿欧元？",
    "ja": "なぜ10億ユーロ？",
    "ar": "لماذا مليار يورو؟"
  },
  "Because it's a ridiculous amount of money.": {
    "es": "Porque es una cantidad ridícula de dinero.",
    "fr": "Parce que c’est une somme d’argent absurde.",
    "de": "Weil es absurd viel Geld ist.",
    "pt": "Porque é uma quantia absurda de dinheiro.",
    "zh": "因为这是一笔荒唐的巨额财富。",
    "ja": "ばかげた金額だからです。",
    "ar": "لأنه مبلغ مالي عبثي."
  },
  "The first real proof that strangers on the internet are willing to play along.": {
    "es": "La primera prueba real de que desconocidos en internet están dispuestos a seguir el juego.",
    "fr": "La première vraie preuve que des inconnus sur Internet sont prêts à jouer le jeu.",
    "de": "Der erste echte Beweis, dass Fremde im Internet bereit sind mitzuspielen.",
    "pt": "A primeira prova real de que desconhecidos na internet estão dispostos a participar.",
    "zh": "第一个真正的证明：互不相识的网友愿意参与这个游戏。",
    "ja": "ネット上の見知らぬ人が付き合ってくれるという最初の本当の証拠。",
    "ar": "أول دليل حقيقي على أن غرباء الإنترنت مستعدون لمجاراة التجربة."
  },
  "Turn the first bit of traction into something that can actually compound.": {
    "es": "Convertir el primer impulso en algo que realmente pueda crecer.",
    "fr": "Transformer les premiers signes d’intérêt en quelque chose qui peut réellement se développer.",
    "de": "Die erste Traktion in etwas verwandeln, das tatsächlich wachsen kann.",
    "pt": "Transformar a primeira tração em algo que realmente possa crescer.",
    "zh": "把最初的势头变成真正能够积累增长的东西。",
    "ja": "最初の勢いを、本当に積み上がるものへ変える。",
    "ar": "تحويل أول قدر من الزخم إلى شيء يمكن أن يتراكم فعلًا."
  },
  "At this point, the experiment starts becoming difficult to dismiss as a one-off.": {
    "es": "En este punto, resulta difícil considerar el experimento algo aislado.",
    "fr": "À ce stade, il devient difficile de considérer l’expérience comme un simple coup unique.",
    "de": "Ab diesem Punkt wird es schwierig, das Experiment als einmaligen Zufall abzutun.",
    "pt": "Neste ponto, fica difícil tratar o experimento como algo isolado.",
    "zh": "到了这一步，很难再把实验当成一次性的偶然。",
    "ja": "この段階になると、一度きりの出来事とは言いにくくなります。",
    "ar": "عند هذه النقطة، يصبح من الصعب اعتبار التجربة مجرد حالة عابرة."
  },
  "Build something bigger around the attention, the community, and whatever actually worked.": {
    "es": "Construir algo más grande alrededor de la atención, la comunidad y lo que realmente haya funcionado.",
    "fr": "Construire quelque chose de plus grand autour de l’attention, de la communauté et de ce qui a réellement fonctionné.",
    "de": "Aus der Aufmerksamkeit, der Community und dem, was wirklich funktioniert hat, etwas Größeres aufbauen.",
    "pt": "Construir algo maior em torno da atenção, da comunidade e do que realmente funcionou.",
    "zh": "围绕关注度、社区以及真正有效的东西，建立更大的项目。",
    "ja": "注目、コミュニティ、そして本当にうまくいったものを軸に、もっと大きなものを作る。",
    "ar": "بناء شيء أكبر حول الاهتمام والمجتمع وما نجح فعلًا."
  },
  "Now we're talking about a serious project — and probably a very different business model.": {
    "es": "Ahora sí hablamos de un proyecto serio — y probablemente de un modelo de negocio muy diferente.",
    "fr": "Là, on parle d’un projet sérieux — et probablement d’un modèle économique très différent.",
    "de": "Jetzt sprechen wir über ein ernsthaftes Projekt – und wahrscheinlich ein völlig anderes Geschäftsmodell.",
    "pt": "Agora estamos falando de um projeto sério — e provavelmente de um modelo de negócio bem diferente.",
    "zh": "现在我们谈的是一个严肃的项目——而且商业模式可能完全不同。",
    "ja": "ここからは本格的なプロジェクトの話です — そしておそらく全く違うビジネスモデルに。",
    "ar": "الآن نتحدث عن مشروع جاد — وربما نموذج عمل مختلف تمامًا."
  },
  "This is the part where the business plan becomes noticeably less confident.": {
    "es": "Aquí es donde el plan de negocio se vuelve notablemente menos seguro.",
    "fr": "C’est ici que le plan d’affaires devient nettement moins sûr de lui.",
    "de": "Hier wird der Geschäftsplan merklich weniger selbstbewusst.",
    "pt": "É aqui que o plano de negócios fica visivelmente menos confiante.",
    "zh": "到了这里，商业计划的自信明显下降。",
    "ja": "ここからビジネスプランの自信が目に見えて薄くなります。",
    "ar": "هنا تصبح خطة العمل أقل ثقة بشكل ملحوظ."
  },
  "Terms of the delusion": {
    "es": "Términos de la ilusión",
    "fr": "Conditions du délire",
    "de": "Bedingungen der Illusion",
    "pt": "Termos da ilusão",
    "zh": "妄想条款",
    "ja": "妄想の利用規約",
    "ar": "شروط الوهم"
  },
  "Current Wealth only moves when actual support makes it into the experiment.": {
    "es": "El patrimonio actual solo cambia cuando el apoyo real entra en el experimento.",
    "fr": "Le patrimoine actuel ne bouge que lorsque le soutien réel entre dans l’expérience.",
    "de": "Das aktuelle Vermögen ändert sich nur, wenn echte Unterstützung im Experiment ankommt.",
    "pt": "O patrimônio atual só muda quando o apoio real entra no experimento.",
    "zh": "只有真实的支持进入实验后，当前财富才会变化。",
    "ja": "実際の支援が実験に入ったときだけ、現在の資産が動きます。",
    "ar": "لا تتغير الثروة الحالية إلا عندما يدخل الدعم الحقيقي في التجربة."
  },
  "What has happened": {
    "es": "Lo que ha ocurrido",
    "fr": "Ce qui s’est passé",
    "de": "Was passiert ist",
    "pt": "O que aconteceu",
    "zh": "发生了什么",
    "ja": "起きたこと",
    "ar": "ما حدث"
  },
  "Will this become a billion-euro story?": {
    "es": "¿Se convertirá esto en una historia de mil millones de euros?",
    "fr": "Cela deviendra-t-il une histoire à 1 milliard d’euros ?",
    "de": "Wird daraus eine Milliarde-Euro-Geschichte?",
    "pt": "Isso vai virar uma história de 1 bilhão de euros?",
    "zh": "这会成为一个 10 亿欧元的故事吗？",
    "ja": "これは10億ユーロの物語になる？",
    "ar": "هل ستصبح هذه قصة بمليار يورو؟"
  },
  "Vote yes or no, leave a comment, and earn absolutely no financial upside.": {
    "es": "Vota sí o no, deja un comentario y no obtendrás absolutamente ningún beneficio financiero.",
    "fr": "Votez oui ou non, laissez un commentaire et ne gagnez absolument aucun avantage financier.",
    "de": "Stimme mit Ja oder Nein ab, hinterlasse einen Kommentar und erhalte absolut keinen finanziellen Vorteil.",
    "pt": "Vote sim ou não, deixe um comentário e não ganhe absolutamente nenhum benefício financeiro.",
    "zh": "投赞成或反对，留下评论，但绝对不会获得任何经济收益。",
    "ja": "はい／いいえに投票してコメントを残しても、金銭的な利益は一切ありません。",
    "ar": "صوّت بنعم أو لا، واترك تعليقًا، ولن تحصل على أي منفعة مالية على الإطلاق."
  },
  "He came up with a simple idea: what if there were a website where anyone could give a little money, and the money was simply allowed to accumulate while the experiment was documented?": {
    "es": "Se le ocurrió una idea sencilla: ¿y si hubiera un sitio donde cualquiera pudiera aportar un poco de dinero y simplemente dejáramos que se acumulara mientras documentábamos el experimento?",
    "fr": "Il a eu une idée simple : et s’il existait un site où chacun pourrait donner un peu d’argent, que l’on laisserait simplement s’accumuler tout en documentant l’expérience ?",
    "de": "Er hatte eine einfache Idee: Was wäre, wenn es eine Website gäbe, auf der jeder etwas Geld geben könnte und das Geld einfach gesammelt würde, während das Experiment dokumentiert wird?",
    "pt": "Ele teve uma ideia simples: e se houvesse um site onde qualquer pessoa pudesse dar um pouco de dinheiro, e o dinheiro simplesmente se acumulasse enquanto o experimento fosse documentado?",
    "zh": "他提出了一个简单的想法：如果有一个网站，任何人都可以给一点钱，然后让这些钱在记录实验的同时慢慢累积，会怎样？",
    "ja": "彼はシンプルなアイデアを思いつきました。誰でも少しお金を出せて、そのお金を実験の記録とともにただ積み上げていくサイトがあったら？",
    "ar": "جاء بفكرة بسيطة: ماذا لو كان هناك موقع يستطيع أي شخص أن يساهم فيه بمبلغ صغير، ثم نترك المال يتراكم بينما نوثق التجربة؟"
  },
  "The original idea came from a conversation with my brother-in-law: what if people could contribute whatever they wanted and we simply let the money accumulate?": {
    "es": "La idea original surgió de una conversación con mi cuñado: ¿y si la gente pudiera aportar lo que quisiera y simplemente dejáramos que el dinero se acumulara?",
    "fr": "L’idée originale est née d’une conversation avec mon beau-frère : et si les gens pouvaient contribuer ce qu’ils veulent et que nous laissions simplement l’argent s’accumuler ?",
    "de": "Die ursprüngliche Idee entstand in einem Gespräch mit meinem Schwager: Was wäre, wenn Menschen beitragen könnten, was sie wollen, und wir das Geld einfach sammeln?",
    "pt": "A ideia original veio de uma conversa com meu cunhado: e se as pessoas pudessem contribuir com o que quisessem e nós simplesmente deixássemos o dinheiro acumular?",
    "zh": "最初的想法来自我和姐夫/妹夫的一次谈话：如果人们可以随意贡献，我们就让钱慢慢累积，会怎样？",
    "ja": "元のアイデアは義兄弟との会話から生まれました。人々が好きなだけ貢献し、そのお金をただ積み上げていったら？",
    "ar": "جاءت الفكرة الأصلية من محادثة مع شقيق زوجتي: ماذا لو استطاع الناس المساهمة بما يريدون، وتركنا المال يتراكم ببساطة؟"
  },
  "€1 billion. Not because I have a secret plan to reach it, but because a ridiculous target makes the experiment worth watching.": {
    "es": "1.000 millones de euros. No porque tenga un plan secreto para alcanzarlos, sino porque un objetivo absurdo hace que el experimento merezca la pena seguirlo.",
    "fr": "1 milliard d’euros. Pas parce que j’ai un plan secret pour y arriver, mais parce qu’un objectif absurde rend l’expérience intéressante à suivre.",
    "de": "1 Milliarde Euro. Nicht, weil ich einen geheimen Plan habe, sondern weil ein absurdes Ziel das Experiment sehenswert macht.",
    "pt": "1 bilhão de euros. Não porque eu tenha um plano secreto para chegar lá, mas porque uma meta absurda torna o experimento interessante de acompanhar.",
    "zh": "10 亿欧元。不是因为我有秘密计划，而是因为一个荒唐的目标让实验值得关注。",
    "ja": "10億ユーロ。秘密の到達計画があるからではなく、無謀な目標だからこそ見届ける価値があります。",
    "ar": "مليار يورو. ليس لأن لدي خطة سرية للوصول إليه، بل لأن الهدف العبثي يجعل التجربة جديرة بالمتابعة."
  },
  "Built IWANNABERICH to track the real number, document the journey and keep the failures public instead of pretending everything is going according to plan.": {
    "es": "Construí IWANNABERICH para seguir la cifra real, documentar el viaje y mantener los fracasos públicos en lugar de fingir que todo va según lo previsto.",
    "fr": "J’ai créé IWANNABERICH pour suivre le vrai chiffre, documenter le parcours et garder les échecs publics plutôt que de prétendre que tout se passe comme prévu.",
    "de": "Ich habe IWANNABERICH gebaut, um die echte Zahl zu verfolgen, den Weg zu dokumentieren und die Misserfolge öffentlich zu halten, statt so zu tun, als liefe alles nach Plan.",
    "pt": "Criei o IWANNABERICH para acompanhar o número real, documentar a jornada e manter os fracassos públicos em vez de fingir que tudo está indo conforme o plano.",
    "zh": "我创建 IWANNABERICH 是为了追踪真实数字、记录旅程，并公开失败，而不是假装一切都按计划进行。",
    "ja": "IWANNABERICHを作り、実際の数字を追い、旅を記録し、すべてが計画通りだと装わず失敗も公開します。",
    "ar": "أنشأت IWANNABERICH لتتبع الرقم الحقيقي وتوثيق الرحلة وإبقاء الإخفاقات علنية بدل التظاهر بأن كل شيء يسير وفق الخطة."
  },
  "The first Reddit post reached roughly 1.8K views and 9 comments. That was enough to prove that the story could get some attention.": {
    "es": "La primera publicación en Reddit alcanzó unas 1,8 mil visualizaciones y 9 comentarios. Fue suficiente para demostrar que la historia podía llamar algo de atención.",
    "fr": "Le premier post Reddit a atteint environ 1,8 k vues et 9 commentaires. C’était suffisant pour montrer que l’histoire pouvait attirer un peu d’attention.",
    "de": "Der erste Reddit-Post erreichte etwa 1,8 Tsd. Aufrufe und 9 Kommentare. Das reichte, um zu zeigen, dass die Geschichte Aufmerksamkeit bekommen kann.",
    "pt": "O primeiro post no Reddit alcançou cerca de 1,8 mil visualizações e 9 comentários. Foi suficiente para provar que a história podia chamar alguma atenção.",
    "zh": "第一条 Reddit 帖子获得约 1.8K 次浏览和 9 条评论。这足以证明这个故事能获得一些关注。",
    "ja": "最初のReddit投稿は約1.8Kビューと9件のコメントを獲得しました。物語に少し注目が集まることを証明するには十分でした。",
    "ar": "وصل أول منشور على Reddit إلى نحو 1.8 ألف مشاهدة و9 تعليقات. كان ذلك كافيًا لإثبات أن القصة يمكن أن تحظى ببعض الاهتمام."
  },
  "Tried different formats, trends, AI-generated content and manually created content. Some TikToks received almost no distribution.": {
    "es": "Probé distintos formatos, tendencias, contenido generado con IA y contenido creado manualmente. Algunos TikToks casi no recibieron distribución.",
    "fr": "J’ai essayé différents formats, tendances, contenus générés par IA et contenus créés manuellement. Certains TikToks n’ont presque pas été diffusés.",
    "de": "Ich habe verschiedene Formate, Trends, KI-generierte Inhalte und manuell erstellte Inhalte ausprobiert. Einige TikToks bekamen fast keine Reichweite.",
    "pt": "Testei formatos diferentes, tendências, conteúdo gerado por IA e conteúdo criado manualmente. Alguns TikToks quase não receberam distribuição.",
    "zh": "我尝试了不同格式、趋势、AI 生成内容和手工制作内容。有些 TikTok 几乎没有获得分发。",
    "ja": "さまざまな形式、トレンド、AI生成コンテンツ、手作りコンテンツを試しました。ほとんど配信されなかったTikTokもあります。",
    "ar": "جربت تنسيقات واتجاهات مختلفة ومحتوى مولدًا بالذكاء الاصطناعي ومحتوى أنشأته يدويًا. بعض مقاطع TikTok لم تحصل تقريبًا على أي انتشار."
  },
  "“The idea is so incredibly stupid, it could work.”": {
    "es": "“La idea es tan increíblemente estúpida que podría funcionar.”",
    "fr": "« L’idée est tellement incroyablement stupide qu’elle pourrait marcher. »",
    "de": "„Die Idee ist so unglaublich dumm, dass sie funktionieren könnte.“",
    "pt": "“A ideia é tão incrivelmente estúpida que pode funcionar.”",
    "zh": "“这个想法蠢得离谱，说不定真能成功。”",
    "ja": "「このアイデアはあまりにもバカげているから、うまくいくかもしれない。」",
    "ar": "«الفكرة غبية بشكل لا يصدق، وقد تنجح.»"
  },
  "“Bro stop begging...”": {
    "es": "“Bro, deja de pedir...”",
    "fr": "« Mec, arrête de mendier… »",
    "de": "„Bro, hör auf zu betteln …“",
    "pt": "“Mano, para de pedir...”",
    "zh": "“兄弟，别再求了……”",
    "ja": "「兄弟、もう物乞いはやめろ…」",
    "ar": "«يا أخي، توقف عن التسول...»"
  },
  "FAQ": {
    "es": "Preguntas frecuentes",
    "fr": "FAQ",
    "de": "FAQ",
    "pt": "FAQ",
    "zh": "常见问题",
    "ja": "FAQ",
    "ar": "الأسئلة الشائعة"
  },
  "Updates": {
    "es": "Actualizaciones",
    "fr": "Actualités",
    "de": "Updates",
    "pt": "Atualizações",
    "zh": "更新",
    "ja": "更新",
    "ar": "التحديثات"
  },
  "The Plan": {
    "es": "El plan",
    "fr": "Le plan",
    "de": "Der Plan",
    "pt": "O plano",
    "zh": "计划",
    "ja": "計画",
    "ar": "الخطة"
  },
  "Milestones": {
    "es": "Hitos",
    "fr": "Étapes",
    "de": "Meilensteine",
    "pt": "Marcos",
    "zh": "里程碑",
    "ja": "マイルストーン",
    "ar": "المراحل"
  },
  "Help": {
    "es": "Ayuda",
    "fr": "Aide",
    "de": "Hilfe",
    "pt": "Ajuda",
    "zh": "帮助",
    "ja": "ヘルプ",
    "ar": "مساعدة"
  },
  "I'm trying to go from": {
    "es": "Estoy intentando pasar de",
    "fr": "J’essaie de passer de",
    "de": "Ich versuche, von",
    "pt": "Estou tentando sair de",
    "zh": "我正在尝试从",
    "ja": "0ユーロから",
    "ar": "أحاول الانتقال من"
  },
  "— and honestly, I don’t know the best way to get there.": {
    "es": "— y, sinceramente, no sé cuál es la mejor manera de llegar.",
    "fr": "— et honnêtement, je ne sais pas quelle est la meilleure façon d’y arriver.",
    "de": "– und ehrlich gesagt weiß ich nicht, wie man am besten dorthin gelangt.",
    "pt": "— e, honestamente, não sei qual é a melhor maneira de chegar lá.",
    "zh": "——老实说，我不知道最好的方法是什么。",
    "ja": "— 正直、そこへ行く最善の方法はまだ分かりません。",
    "ar": "— وبصراحة لا أعرف أفضل طريقة للوصول إلى هناك."
  },
  "Got an idea?": {
    "es": "¿Tienes una idea?",
    "fr": "Une idée ?",
    "de": "Eine Idee?",
    "pt": "Tem uma ideia?",
    "zh": "有想法吗？",
    "ja": "アイデアはありますか？",
    "ar": "لديك فكرة؟"
  },
  "Know a way to make the first €100?": {
    "es": "¿Conoces una forma de conseguir los primeros 100 €?",
    "fr": "Vous connaissez un moyen de faire les premiers 100 € ?",
    "de": "Kennst du einen Weg zu den ersten 100 €?",
    "pt": "Sabe uma forma de fazer os primeiros €100?",
    "zh": "知道如何赚到第一个 100 欧元吗？",
    "ja": "最初の100ユーロを作る方法を知っていますか？",
    "ar": "تعرف طريقة لتحقيق أول 100 يورو؟"
  },
  "Think I'm doing something completely stupid?": {
    "es": "¿Crees que estoy haciendo algo completamente estúpido?",
    "fr": "Vous pensez que je fais quelque chose de complètement stupide ?",
    "de": "Denkst du, ich mache etwas völlig Dummes?",
    "pt": "Acha que estou fazendo algo completamente estúpido?",
    "zh": "觉得我在做一件彻头彻尾的蠢事？",
    "ja": "私が完全にバカなことをしていると思いますか？",
    "ar": "تعتقد أنني أفعل شيئًا غبيًا تمامًا؟"
  },
  "Tell me.": {
    "es": "Dímelo.",
    "fr": "Dites-le-moi.",
    "de": "Sag es mir.",
    "pt": "Me diga.",
    "zh": "告诉我。",
    "ja": "教えてください。",
    "ar": "أخبرني."
  },
  "Next": {
    "es": "Siguiente",
    "fr": "Suivant",
    "de": "Als Nächstes",
    "pt": "Próximo",
    "zh": "下一步",
    "ja": "次へ",
    "ar": "التالي"
  },
  "so far.": {
    "es": "hasta ahora.",
    "fr": "jusqu’ici.",
    "de": "bisher.",
    "pt": "até agora.",
    "zh": "到目前为止。",
    "ja": "これまでに。",
    "ar": "حتى الآن."
  },
  "CURRENT WEALTH": {
  "es": "PATRIMONIO ACTUAL",
  "fr": "PATRIMOINE ACTUEL",
  "de": "AKTUELLES VERMÖGEN",
  "pt": "PATRIMÔNIO ATUAL",
  "zh": "当前财富",
  "ja": "現在の資産",
  "ar": "الثروة الحالية"
},
  "CURRENT MISSION": {
  "es": "MISIÓN ACTUAL",
  "fr": "MISSION ACTUELLE",
  "de": "AKTUELLE MISSION",
  "pt": "MISSÃO ATUAL",
  "zh": "当前任务",
  "ja": "現在のミッション",
  "ar": "المهمة الحالية"
},
  "Make your prediction": {
  "es": "Haz tu predicción",
  "fr": "Faites votre prédiction",
  "de": "Gib deine Prognose ab",
  "pt": "Faça sua previsão",
  "zh": "做出你的预测",
  "ja": "予測する",
  "ar": "قدّم توقعك"
},
  "Every euro is accounted for.": {
  "es": "Cada euro está contabilizado.",
  "fr": "Chaque euro est comptabilisé.",
  "de": "Jeder Euro wird erfasst.",
  "pt": "Cada euro é contabilizado.",
  "zh": "每一欧元都有记录。",
  "ja": "すべてのユーロを記録します。",
  "ar": "كل يورو محسوب."
},
  "PUBLIC MONEY RECORD": {
  "es": "REGISTRO PÚBLICO DEL DINERO",
  "fr": "REGISTRE PUBLIC DE L’ARGENT",
  "de": "ÖFFENTLICHES GELDPROTOKOLL",
  "pt": "REGISTRO PÚBLICO DO DINHEIRO",
  "zh": "公开资金记录",
  "ja": "公開マネー記録",
  "ar": "سجل الأموال العام"
},
  "Verified support": {
  "es": "Apoyo verificado",
  "fr": "Soutien vérifié",
  "de": "Verifizierte Unterstützung",
  "pt": "Apoio verificado",
  "zh": "已验证的支持",
  "ja": "確認済みの支援",
  "ar": "دعم موثّق"
},
  "The public counter is calculated from verified support recorded for the experiment. Individual payment details stay private.": {
  "es": "El contador público se calcula a partir del apoyo verificado registrado para el experimento. Los datos de pagos individuales se mantienen privados.",
  "fr": "Le compteur public est calculé à partir des soutiens vérifiés enregistrés pour l’expérience. Les détails des paiements individuels restent privés.",
  "de": "Der öffentliche Zähler basiert auf verifizierter Unterstützung für das Experiment. Einzelne Zahlungsdetails bleiben privat.",
  "pt": "O contador público é calculado a partir do apoio verificado registrado para o experimento. Os detalhes de pagamentos individuais permanecem privados.",
  "zh": "公开计数来自为本实验记录的已验证支持金额。个人支付详情保持私密。",
  "ja": "公開カウンターは、この実験に記録された確認済みの支援額から計算されています。個別の支払い情報は非公開です。",
  "ar": "يُحتسب العداد العام من الدعم الموثّق المسجل للتجربة. تبقى تفاصيل المدفوعات الفردية خاصة."
},
  "THE FIRST €100": {
    "es": "LOS PRIMEROS 100 €",
    "fr": "LES PREMIERS 100 €",
    "de": "DIE ERSTEN 100 €",
    "pt": "OS PRIMEIROS 100 €",
    "zh": "第一个 100 欧元",
    "ja": "最初の100ユーロ",
    "ar": "أول 100 يورو"
  },
  "Can the internet get me to": {
    "es": "¿Puede internet llevarme a",
    "fr": "Internet peut-il m’emmener à",
    "de": "Kann das Internet mich auf",
    "pt": "A internet consegue me levar a",
    "zh": "互联网能让我达到",
    "ja": "ネットの力で",
    "ar": "هل يستطيع الإنترنت أن يوصلني إلى"
  },
  "€1B is the ridiculous long-term target. Right now, the experiment is simply trying to make its first €100 from €0.": {
    "es": "€1B es el objetivo absurdo a largo plazo. Ahora mismo, el experimento solo intenta conseguir sus primeros 100 € desde 0 €.",
    "fr": "1 Md€ est l’objectif absurde à long terme. Pour l’instant, l’expérience essaie simplement de faire ses premiers 100 € en partant de 0 €.",
    "de": "1 Mrd. € ist das absurde langfristige Ziel. Im Moment versucht das Experiment einfach, die ersten 100 € aus 0 € zu machen.",
    "pt": "€1B é o objetivo absurdo de longo prazo. Por enquanto, o experimento só tenta chegar aos primeiros 100 € partindo de 0 €.",
    "zh": "10亿欧元是那个荒唐的长期目标。现在，这项实验只是在尝试从 0 欧元做到第一个 100 欧元。",
    "ja": "10億ユーロは無謀な長期目標。今は0ユーロから最初の100ユーロを作ることだけに挑戦しています。",
    "ar": "مليار يورو هو الهدف الطويل الأجل العبثي. الآن، تحاول التجربة ببساطة الوصول إلى أول 100 يورو انطلاقًا من صفر."
  },
  "to the first €100": {
    "es": "hasta los primeros 100 €",
    "fr": "pour atteindre les premiers 100 €",
    "de": "bis zu den ersten 100 €",
    "pt": "até aos primeiros 100 €",
    "zh": "距离第一个 100 欧元",
    "ja": "最初の100ユーロまで",
    "ar": "حتى أول 100 يورو"
  },
  "HOW IT WORKS": {
    "es": "CÓMO FUNCIONA",
    "fr": "COMMENT ÇA MARCHE",
    "de": "SO FUNKTIONIERT ES",
    "pt": "COMO FUNCIONA",
    "zh": "运作方式",
    "ja": "仕組み",
    "ar": "كيف يعمل"
  },
  "Suggest → Vote → Try → Result": {
    "es": "Sugiere → Vota → Pruebo → Resultado",
    "fr": "Suggérer → Voter → Essayer → Résultat",
    "de": "Vorschlagen → Abstimmen → Ausprobieren → Ergebnis",
    "pt": "Sugerir → Votar → Tentar → Resultado",
    "zh": "提出 → 投票 → 尝试 → 结果",
    "ja": "提案 → 投票 → 試す → 結果",
    "ar": "اقترح ← صوّت ← أجرّب ← النتيجة"
  },
  "You suggest an idea, people vote, I try it, and the result becomes part of the public record.": {
    "es": "Tú propones una idea, la gente vota, yo la pruebo y el resultado pasa a formar parte del registro público.",
    "fr": "Vous proposez une idée, les gens votent, je l’essaie et le résultat rejoint le registre public.",
    "de": "Du schlägst eine Idee vor, die Leute stimmen ab, ich probiere sie aus und das Ergebnis wird Teil des öffentlichen Protokolls.",
    "pt": "Você sugere uma ideia, as pessoas votam, eu tento e o resultado passa a fazer parte do registro público.",
    "zh": "你提出想法，大家投票，我去尝试，结果会成为公开记录的一部分。",
    "ja": "アイデアを提案し、みんなが投票し、私が試して、その結果を公開記録に残します。",
    "ar": "أنت تقترح فكرة، ويصوّت الناس، وأنا أجرّبها، ثم تصبح النتيجة جزءًا من السجل العام."
  },
  "Suggest": {"es":"Sugerir","fr":"Suggérer","de":"Vorschlagen","pt":"Sugerir","zh":"提出","ja":"提案","ar":"اقتراح"},
  "Vote": {"es":"Votar","fr":"Voter","de":"Abstimmen","pt":"Votar","zh":"投票","ja":"投票","ar":"تصويت"},
  "Try": {"es":"Probar","fr":"Essayer","de":"Ausprobieren","pt":"Tentar","zh":"尝试","ja":"試す","ar":"تجربة"},
  "See the result": {"es":"Ver el resultado","fr":"Voir le résultat","de":"Ergebnis ansehen","pt":"Ver o resultado","zh":"查看结果","ja":"結果を見る","ar":"رؤية النتيجة"},
  "LATEST UPDATE": {"es":"ÚLTIMA ACTUALIZACIÓN","fr":"DERNIÈRE MISE À JOUR","de":"LETZTES UPDATE","pt":"ÚLTIMA ATUALIZAÇÃO","zh":"最新更新","ja":"最新アップデート","ar":"آخر تحديث"},
  "The experiment": {"es":"El experimento","fr":"L’expérience","de":"Das Experiment","pt":"O experimento","zh":"这项实验","ja":"この実験","ar":"التجربة"},
  "Read the full log": {"es":"Ver el registro completo","fr":"Voir le journal complet","de":"Das vollständige Protokoll lesen","pt":"Ler o registro completo","zh":"查看完整记录","ja":"完全なログを見る","ar":"اقرأ السجل الكامل"},
  "The next phase is simple: find out what actually moves the number, document it, and keep going.": {
    "es":"La siguiente fase es sencilla: descubrir qué hace avanzar realmente la cifra, documentarlo y seguir.",
    "fr":"La prochaine étape est simple : découvrir ce qui fait vraiment bouger le chiffre, le documenter et continuer.",
    "de":"Die nächste Phase ist einfach: herausfinden, was die Zahl tatsächlich bewegt, es dokumentieren und weitermachen.",
    "pt":"A próxima fase é simples: descobrir o que realmente faz o número crescer, documentar e continuar.",
    "zh":"下一阶段很简单：找出什么真正能推动这个数字，记录下来，然后继续。",
    "ja":"次の段階はシンプルです。数字を本当に動かすものを見つけ、記録し、続けます。",
    "ar":"المرحلة التالية بسيطة: معرفة ما الذي يحرّك الرقم فعلًا، وتوثيقه، ثم الاستمرار."
  },
  "The public counter is calculated from verified support. Individual payment details stay private.": {
    "es": "El contador público se calcula a partir del apoyo verificado. Los datos de pagos individuales se mantienen privados.",
    "fr": "Le compteur public est calculé à partir des soutiens vérifiés. Les détails des paiements individuels restent privés.",
    "de": "Der öffentliche Zähler basiert auf verifizierter Unterstützung. Einzelne Zahlungsdetails bleiben privat.",
    "pt": "O contador público é calculado a partir do apoio verificado. Os detalhes de pagamentos individuais permanecem privados.",
    "zh": "公开计数来自已验证的支持金额。个人支付详情保持私密。",
    "ja": "公開カウンターは確認済みの支援額から計算されています。個別の支払い情報は非公開です。",
    "ar": "يُحتسب العداد العام من الدعم الموثّق. تبقى تفاصيل المدفوعات الفردية خاصة."
  },
  "The first hundred": {"es":"Los primeros cien","fr":"Les cent premiers","de":"Die ersten hundert","pt":"Os primeiros cem","zh":"第一个一百","ja":"最初の100","ar":"المئة الأولى"},
  "Small numbers first.": {"es":"Primero, los números pequeños.","fr":"D’abord, les petits chiffres.","de":"Erst die kleinen Zahlen.","pt":"Primeiro, os números pequenos.","zh":"先从小数字开始。","ja":"まずは小さな数字から。","ar":"الأرقام الصغيرة أولًا."},
  "The billion can wait.": {"es":"El mil millones puede esperar.","fr":"Le milliard peut attendre.","de":"Die Milliarde kann warten.","pt":"O bilhão pode esperar.","zh":"十亿可以等等。","ja":"10億は後でいい。","ar":"يمكن للمليار أن ينتظر."},
  "First coffee paid for by the experiment": {"es":"El primer café pagado por el experimento","fr":"Le premier café payé par l’expérience","de":"Der erste Kaffee, den das Experiment bezahlt","pt":"O primeiro café pago pelo experimento","zh":"实验买单的第一杯咖啡","ja":"実験が払った最初のコーヒー","ar":"أول قهوة يدفع ثمنها التجربة"},
  "Okay, this is actually moving": {"es":"Vale, esto realmente avanza","fr":"Bon, ça bouge vraiment","de":"Okay, das bewegt sich wirklich","pt":"Ok, isto está mesmo a avançar","zh":"好吧，这真的在增长","ja":"よし、本当に動いている","ar":"حسنًا، هذا يتحرك فعلًا"},
  "A stranger is genuinely involved": {"es":"Un desconocido está realmente involucrado","fr":"Un inconnu est vraiment impliqué","de":"Ein Fremder ist wirklich dabei","pt":"Um desconhecido está realmente envolvido","zh":"真的有人愿意参与","ja":"本当に誰かが参加している","ar":"هناك شخص غريب يشارك فعلًا"},
  "Halfway to the first real target": {"es":"A mitad del primer objetivo real","fr":"À mi-chemin du premier vrai objectif","de":"Halbwegs zum ersten echten Ziel","pt":"A meio do primeiro objetivo real","zh":"距离第一个真正目标还有一半","ja":"最初の本当の目標まであと半分","ar":"في منتصف الطريق إلى الهدف الحقيقي الأول"},
  "First milestone. Then we figure out €1,000.": {"es":"Primer hito. Después averiguamos cómo llegar a 1.000 €.","fr":"Premier jalon. Ensuite, on verra pour 1 000 €.","de":"Erster Meilenstein. Danach schauen wir auf 1.000 €.","pt":"Primeiro marco. Depois descobrimos como chegar aos 1.000 €.","zh":"第一个里程碑。然后再想办法做到 1,000 欧元。","ja":"最初のマイルストーン。その後で1,000ユーロを考える。","ar":"أول محطة. ثم نكتشف كيف نصل إلى 1000 يورو."},
  "Loading...": {
    "es": "Cargando...",
    "fr": "Chargement…",
    "de": "Wird geladen …",
    "pt": "Carregando...",
    "zh": "正在加载……",
    "ja": "読み込み中…",
    "ar": "جارٍ التحميل..."
  }
  ,"NOW":{"es":"AHORA","fr":"MAINTENANT","de":"JETZT","pt":"AGORA","zh":"现在","ja":"現在","ar":"الآن"}
  ,"€13 is real. The first €100 is the next test.":{"es":"Los 13 € son reales. Los primeros 100 € son la próxima prueba.","fr":"Les 13 € sont réels. Les 100 premiers € sont le prochain test.","de":"Die 13 € sind echt. Die ersten 100 € sind der nächste Test.","pt":"Os 13 € são reais. Os primeiros 100 € são o próximo teste.","zh":"13欧元是真实的。下一个测试是达到100欧元。","ja":"13ユーロは現実です。次のテストは最初の100ユーロ。","ar":"الـ13 يورو حقيقية. والاختبار التالي هو الوصول إلى أول 100 يورو."}
  ,"Product Hunt is live, the site is now multilingual, and the next phase is simple: find out what actually moves the number, document it, and keep going.":{"es":"Product Hunt ya está activo, el sitio ahora es multilingüe y la siguiente fase es simple: descubrir qué mueve realmente la cifra, documentarlo y seguir adelante.","fr":"Product Hunt est lancé, le site est désormais multilingue et la prochaine phase est simple : découvrir ce qui fait vraiment bouger le chiffre, le documenter et continuer.","de":"Product Hunt ist live, die Website ist jetzt mehrsprachig und die nächste Phase ist einfach: herausfinden, was die Zahl wirklich bewegt, es dokumentieren und weitermachen.","pt":"O Product Hunt está no ar, o site agora é multilíngue e a próxima fase é simples: descobrir o que realmente move o número, documentar e continuar.","zh":"Product Hunt 已上线，网站现在支持多种语言。下一阶段很简单：找出真正能推动数字的方法，记录下来，然后继续。","ja":"Product Hunt は公開中で、サイトも多言語対応になりました。次の段階はシンプルです。数字を本当に動かすものを見つけ、記録し、続けます。","ar":"تم إطلاق Product Hunt، وأصبح الموقع متعدد اللغات. المرحلة التالية بسيطة: معرفة ما الذي يحرّك الرقم فعلًا، وتوثيقه، ثم الاستمرار."}
  ,"The first €100 became the mission.":{"es":"Los primeros 100 € se convirtieron en la misión.","fr":"Les premiers 100 € sont devenus la mission.","de":"Die ersten 100 € wurden zur Mission.","pt":"Os primeiros 100 € viraram a missão.","zh":"第一个100欧元成为了当前任务。","ja":"最初の100ユーロが現在のミッションになりました。","ar":"أصبح أول 100 يورو هو المهمة الحالية."}
  ,"The site now focuses the story on €13 → €100, community voting, public money records, and short experiment updates. The €1B goal stays in the background as the ridiculous long-term target.":{"es":"El sitio ahora centra la historia en 13 € → 100 €, las votaciones de la comunidad, los registros públicos del dinero y actualizaciones breves. El objetivo de 1.000 millones sigue al fondo como la meta absurda a largo plazo.","fr":"Le site se concentre désormais sur 13 € → 100 €, les votes de la communauté, les registres publics de l’argent et de courtes mises à jour. L’objectif de 1 Md€ reste en arrière-plan comme cible absurde à long terme.","de":"Die Website konzentriert sich jetzt auf 13 € → 100 €, Community-Abstimmungen, öffentliche Geldaufzeichnungen und kurze Experiment-Updates. Das 1-Mrd.-€-Ziel bleibt als absurdes langfristiges Ziel im Hintergrund.","pt":"O site agora foca a história em 13 € → 100 €, votação da comunidade, registros públicos do dinheiro e atualizações curtas. A meta de 1 bilhão de euros fica ao fundo como objetivo absurdo de longo prazo.","zh":"网站现在把故事重点放在13欧元→100欧元、社区投票、公开资金记录和简短实验更新上。10亿欧元目标仍作为荒谬的长期目标留在背景中。","ja":"サイトでは今、13ユーロ→100ユーロ、コミュニティ投票、公開マネー記録、短い実験アップデートに焦点を当てています。10億ユーロの目標は、ばかげた長期目標として背景に残ります。","ar":"يركز الموقع الآن على 13 يورو ← 100 يورو، وتصويت المجتمع، والسجل العام للأموال، وتحديثات التجارب القصيرة. ويبقى هدف المليار يورو في الخلفية كهدف طويل الأمد عبثي."}

};

  function detectLanguage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED.includes(saved)) return saved;
    const candidates = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
    for (const value of candidates) {
      const code = String(value || "").toLowerCase().split("-")[0];
      if (SUPPORTED.includes(code)) return code;
    }
    return "en";
  }

  function translate(lang) {
    const dict = translations[lang] || translations.en;
    document.documentElement.lang = lang;
    document.documentElement.dir = RTL.has(lang) ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (Object.prototype.hasOwnProperty.call(dict, key)) el.innerHTML = dict[key];
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (Object.prototype.hasOwnProperty.call(dict, key)) el.setAttribute("placeholder", dict[key]);
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria-label");
      if (Object.prototype.hasOwnProperty.call(dict, key)) el.setAttribute("aria-label", dict[key]);
    });

    // Translate full-page copy marked with data-i18n-phrase.
    // These entries live in phraseTranslations and are intentionally kept
    // separate from the smaller UI dictionary above.
    document.querySelectorAll("[data-i18n-phrase]").forEach((el) => {
      const phrase = el.getAttribute("data-i18n-phrase");
      // English is the source copy. Phrase translations intentionally do not
      // duplicate English entries, so always fall back to the original phrase
      // when switching back to English (or when a translation is missing).
      const translated = phraseTranslations[phrase]?.[lang] || phrase;
      el.innerHTML = translated;
    });

    document.querySelectorAll(".language-select").forEach((select) => {
      select.value = lang;
      select.setAttribute("aria-label", dict["nav.language"] || "Language");
    });
    localStorage.setItem(STORAGE_KEY, lang);
    window.dispatchEvent(new CustomEvent("iwbr:languagechange", { detail: { language: lang } }));
  }

  function init() {
    const select = document.querySelector(".language-select");
    if (!select) return;
    const initial = detectLanguage();
    translate(initial);
    select.addEventListener("change", () => translate(select.value));
  }

  const dynamicTranslations = {
  "en": {
    "support.unavailable": "Votes unavailable right now.",
    "support.ownerMode": "Owner mode enabled — you can reply below.",
    "support.loginOwner": "Log in as the owner first.",
    "support.replying": "Replying...",
    "support.couldntPost": "Couldn't post reply.",
    "support.systemError": "Couldn't reach the prediction system.",
    "support.reply": "Reply",
    "support.noComments": "No comments yet. Be the first.",
    "support.anonymous": "Anonymous",
    "support.replyPlaceholder": "Reply as the owner...",
    "support.writeReply": "Write a reply first.",
    "support.commentsUnavailable": "Comments unavailable right now.",
    "script.updated": "Updated from publicly recorded support.",
    "script.unavailable": "Verified support is temporarily unavailable.",
    "script.next": "Next milestone: {milestone} — {remaining} to go.",
    "script.allMilestones": "All listed milestones cleared. The billion remains.",
    "script.progress": "{pct}% of the way there. Technically.",
    "script.progressEmpty": "The bar is ready. The money is taking its time.",
    "script.milestoneProgress": "{pct}% of the way to the current milestone.",
    "script.unlocked": "UNLOCKED",
    "script.starting": "STARTING",
    "script.locked": "LOCKED",
    "script.unknown": "???",
    "script.firstMilestoneComplete": "First €100 reached.",
    "script.currentMission": "CURRENT MISSION",
    "script.firstMilestone": "THE FIRST €100",
    "script.toGo": "{amount} to go.",
    "script.sinceLaunch": "+{amount} since launch.",
    "script.verifiedSupport": "Verified support",
    "script.publicLedger": "PUBLIC MONEY RECORD",
    "script.ledgerNote": "The public counter is calculated from verified support recorded for the experiment. Individual payment details stay private.",
    "script.suggestNext": "What should I try next?",
    "script.suggestCopy": "Suggest an idea → vote → watch me try it → see the result.",
  },
  "es": {
    "script.noLedger": "Aún no hay contribuciones verificadas.",
    "script.ledgerUnavailable": "El registro público no está disponible temporalmente.",
    "script.supportLabel": "Apoyo",
    "script.votes": "votos",
    "script.votesShort": "votos",
    "script.firstExperimentVote": "Sé la primera persona en votar.",
    "script.copied": "Copiado",
    "script.shareMoment": "Comparte este momento",
    "support.unavailable": "Los votos no están disponibles ahora mismo.",
    "support.ownerMode": "Modo propietario activado — puedes responder abajo.",
    "support.loginOwner": "Inicia sesión como propietario primero.",
    "support.replying": "Respondiendo...",
    "support.couldntPost": "No se pudo publicar la respuesta.",
    "support.systemError": "No se pudo contactar con el sistema de predicciones.",
    "support.reply": "Responder",
    "support.noComments": "Aún no hay comentarios. Sé el primero.",
    "support.anonymous": "Anónimo",
    "support.replyPlaceholder": "Responder como propietario...",
    "support.writeReply": "Escribe primero una respuesta.",
    "support.commentsUnavailable": "Los comentarios no están disponibles ahora mismo.",
    "script.updated": "Actualizado con el apoyo registrado públicamente.",
    "script.unavailable": "El apoyo verificado no está disponible temporalmente.",
    "script.next": "Próximo hito: {milestone} — faltan {remaining}.",
    "script.allMilestones": "Todos los hitos listados están superados. El mil millones sigue en pie.",
    "script.progress": "{pct}% del camino. Técnicamente.",
    "script.progressEmpty": "La barra está lista. El dinero se está tomando su tiempo.",
    "script.milestoneProgress": "{pct}% del camino al hito actual.",
    "script.unlocked": "DESBLOQUEADO",
    "script.starting": "EMPEZANDO",
    "script.locked": "BLOQUEADO",
    "script.unknown": "???",
    "script.firstMilestoneComplete": "Primeros 100 € alcanzados.",
    "script.currentMission": "MISIÓN ACTUAL",
    "script.firstMilestone": "LOS PRIMEROS 100 €",
    "script.toGo": "Faltan {amount}.",
    "script.sinceLaunch": "+{amount} desde el lanzamiento.",
    "script.verifiedSupport": "Apoyo verificado",
    "script.publicLedger": "REGISTRO PÚBLICO DEL DINERO",
    "script.ledgerNote": "El contador público se calcula a partir del apoyo verificado registrado para el experimento. Los datos de pagos individuales se mantienen privados.",
    "script.suggestNext": "¿Qué debería probar después?",
    "script.suggestCopy": "Sugiere una idea → vota → mira cómo la pruebo → descubre el resultado.",
  },
  "fr": {
    "script.noLedger": "Aucune contribution vérifiée pour le moment.",
    "script.ledgerUnavailable": "Le registre public est temporairement indisponible.",
    "script.supportLabel": "Soutien",
    "script.votes": "votes",
    "script.votesShort": "votes",
    "script.firstExperimentVote": "Soyez le premier à voter.",
    "script.copied": "Copié",
    "script.shareMoment": "Partager ce moment",
    "support.unavailable": "Les votes sont indisponibles pour le moment.",
    "support.ownerMode": "Mode propriétaire activé — vous pouvez répondre ci-dessous.",
    "support.loginOwner": "Connectez-vous d’abord en tant que propriétaire.",
    "support.replying": "Réponse en cours…",
    "support.couldntPost": "Impossible de publier la réponse.",
    "support.systemError": "Impossible d’atteindre le système de prédictions.",
    "support.reply": "Répondre",
    "support.noComments": "Aucun commentaire pour l’instant. Soyez le premier.",
    "support.anonymous": "Anonyme",
    "support.replyPlaceholder": "Répondre en tant que propriétaire…",
    "support.writeReply": "Écrivez d’abord une réponse.",
    "support.commentsUnavailable": "Les commentaires sont indisponibles pour le moment.",
    "script.updated": "Mis à jour depuis les soutiens enregistrés publiquement.",
    "script.unavailable": "Le soutien vérifié est temporairement indisponible.",
    "script.next": "Prochaine étape : {milestone} — {remaining} restants.",
    "script.allMilestones": "Toutes les étapes listées sont franchies. Le milliard reste l’objectif.",
    "script.progress": "{pct}% du chemin. Techniquement.",
    "script.progressEmpty": "La barre est prête. L’argent prend son temps.",
    "script.milestoneProgress": "{pct}% du chemin vers l’étape actuelle.",
    "script.unlocked": "DÉBLOQUÉ",
    "script.starting": "DÉMARRAGE",
    "script.locked": "VERROUILLÉ",
    "script.unknown": "???",
    "script.firstMilestoneComplete": "Les premiers 100 € sont atteints.",
    "script.currentMission": "MISSION ACTUELLE",
    "script.firstMilestone": "LES PREMIERS 100 €",
    "script.toGo": "Encore {amount}.",
    "script.sinceLaunch": "+{amount} depuis le lancement.",
    "script.verifiedSupport": "Soutien vérifié",
    "script.publicLedger": "REGISTRE PUBLIC DE L’ARGENT",
    "script.ledgerNote": "Le compteur public est calculé à partir des soutiens vérifiés enregistrés pour l’expérience. Les détails des paiements individuels restent privés.",
    "script.suggestNext": "Que devrais-je essayer ensuite ?",
    "script.suggestCopy": "Propose une idée → vote → regarde-moi l’essayer → vois le résultat.",
  },
  "de": {
    "script.noLedger": "Noch keine verifizierten Beiträge.",
    "script.ledgerUnavailable": "Das öffentliche Protokoll ist vorübergehend nicht verfügbar.",
    "script.supportLabel": "Unterstützung",
    "script.votes": "Stimmen",
    "script.votesShort": "Stimmen",
    "script.firstExperimentVote": "Sei die erste Person, die abstimmt.",
    "script.copied": "Kopiert",
    "script.shareMoment": "Diesen Moment teilen",
    "support.unavailable": "Stimmen sind derzeit nicht verfügbar.",
    "support.ownerMode": "Eigentümermodus aktiviert — du kannst unten antworten.",
    "support.loginOwner": "Melde dich zuerst als Eigentümer an.",
    "support.replying": "Antwort wird gesendet …",
    "support.couldntPost": "Antwort konnte nicht veröffentlicht werden.",
    "support.systemError": "Das Prognosesystem konnte nicht erreicht werden.",
    "support.reply": "Antworten",
    "support.noComments": "Noch keine Kommentare. Sei der Erste.",
    "support.anonymous": "Anonym",
    "support.replyPlaceholder": "Als Eigentümer antworten …",
    "support.writeReply": "Schreibe zuerst eine Antwort.",
    "support.commentsUnavailable": "Kommentare sind derzeit nicht verfügbar.",
    "script.updated": "Aktualisiert aus öffentlich erfasster Unterstützung.",
    "script.unavailable": "Verifizierte Unterstützung ist vorübergehend nicht verfügbar.",
    "script.next": "Nächster Meilenstein: {milestone} — noch {remaining}.",
    "script.allMilestones": "Alle aufgeführten Meilensteine erreicht. Die Milliarde bleibt das Ziel.",
    "script.progress": "{pct}% des Weges. Technisch gesehen.",
    "script.progressEmpty": "Die Leiste ist bereit. Das Geld lässt sich Zeit.",
    "script.milestoneProgress": "{pct}% auf dem Weg zum aktuellen Meilenstein.",
    "script.unlocked": "FREIGESCHALTET",
    "script.starting": "START",
    "script.locked": "GESPERRT",
    "script.unknown": "???",
    "script.firstMilestoneComplete": "Die ersten 100 € sind erreicht.",
    "script.currentMission": "AKTUELLE MISSION",
    "script.firstMilestone": "DIE ERSTEN 100 €",
    "script.toGo": "Noch {amount}.",
    "script.sinceLaunch": "+{amount} seit dem Start.",
    "script.verifiedSupport": "Verifizierte Unterstützung",
    "script.publicLedger": "ÖFFENTLICHES GELDPROTOKOLL",
    "script.ledgerNote": "Der öffentliche Zähler basiert auf verifizierter Unterstützung für das Experiment. Einzelne Zahlungsdetails bleiben privat.",
    "script.suggestNext": "Was soll ich als Nächstes ausprobieren?",
    "script.suggestCopy": "Idee vorschlagen → abstimmen → zuschauen, wie ich es ausprobiere → Ergebnis sehen.",
  },
  "pt": {
    "script.noLedger": "Ainda não há contribuições verificadas.",
    "script.ledgerUnavailable": "O registro público está temporariamente indisponível.",
    "script.supportLabel": "Apoio",
    "script.votes": "votos",
    "script.votesShort": "votos",
    "script.firstExperimentVote": "Seja a primeira pessoa a votar.",
    "script.copied": "Copiado",
    "script.shareMoment": "Compartilhar este momento",
    "support.unavailable": "Os votos não estão disponíveis no momento.",
    "support.ownerMode": "Modo proprietário ativado — você pode responder abaixo.",
    "support.loginOwner": "Entre primeiro como proprietário.",
    "support.replying": "Respondendo...",
    "support.couldntPost": "Não foi possível publicar a resposta.",
    "support.systemError": "Não foi possível acessar o sistema de previsões.",
    "support.reply": "Responder",
    "support.noComments": "Ainda não há comentários. Seja o primeiro.",
    "support.anonymous": "Anônimo",
    "support.replyPlaceholder": "Responder como proprietário...",
    "support.writeReply": "Escreva uma resposta primeiro.",
    "support.commentsUnavailable": "Os comentários não estão disponíveis no momento.",
    "script.updated": "Atualizado a partir do apoio registrado publicamente.",
    "script.unavailable": "O apoio verificado está temporariamente indisponível.",
    "script.next": "Próximo marco: {milestone} — faltam {remaining}.",
    "script.allMilestones": "Todos os marcos listados foram alcançados. O bilhão continua sendo o objetivo.",
    "script.progress": "{pct}% do caminho. Tecnicamente.",
    "script.progressEmpty": "A barra está pronta. O dinheiro está demorando.",
    "script.milestoneProgress": "{pct}% do caminho até o marco atual.",
    "script.unlocked": "DESBLOQUEADO",
    "script.starting": "COMEÇANDO",
    "script.locked": "BLOQUEADO",
    "script.unknown": "???",
    "script.firstMilestoneComplete": "Os primeiros €100 foram alcançados.",
    "script.currentMission": "MISSÃO ATUAL",
    "script.firstMilestone": "OS PRIMEIROS €100",
    "script.toGo": "Faltam {amount}.",
    "script.sinceLaunch": "+{amount} desde o lançamento.",
    "script.verifiedSupport": "Apoio verificado",
    "script.publicLedger": "REGISTRO PÚBLICO DO DINHEIRO",
    "script.ledgerNote": "O contador público é calculado a partir do apoio verificado registrado para o experimento. Os detalhes de pagamentos individuais permanecem privados.",
    "script.suggestNext": "O que devo tentar a seguir?",
    "script.suggestCopy": "Sugira uma ideia → vote → veja-me tentar → veja o resultado.",
  },
  "zh": {
    "script.noLedger": "目前还没有经过验证的支持。",
    "script.ledgerUnavailable": "公开记录暂时不可用。",
    "script.supportLabel": "支持",
    "script.votes": "票",
    "script.votesShort": "票",
    "script.firstExperimentVote": "成为第一个投票的人。",
    "script.copied": "已复制",
    "script.shareMoment": "分享这一刻",
    "support.unavailable": "投票暂时不可用。",
    "support.ownerMode": "所有者模式已启用——你可以在下方回复。",
    "support.loginOwner": "请先以所有者身份登录。",
    "support.replying": "正在回复……",
    "support.couldntPost": "无法发布回复。",
    "support.systemError": "无法连接预测系统。",
    "support.reply": "回复",
    "support.noComments": "还没有评论。成为第一个吧。",
    "support.anonymous": "匿名",
    "support.replyPlaceholder": "以所有者身份回复……",
    "support.writeReply": "请先写下回复。",
    "support.commentsUnavailable": "评论暂时不可用。",
    "script.updated": "根据公开记录的支持金额更新。",
    "script.unavailable": "已验证的支持暂时不可用。",
    "script.next": "下一个里程碑：{milestone} — 还差 {remaining}。",
    "script.allMilestones": "所有列出的里程碑都已达成。10 亿欧元仍是目标。",
    "script.progress": "进度 {pct}%。技术上是这样。",
    "script.progressEmpty": "进度条准备好了。钱还在路上。",
    "script.milestoneProgress": "距离当前里程碑 {pct}%。",
    "script.unlocked": "已解锁",
    "script.starting": "开始",
    "script.locked": "锁定",
    "script.unknown": "???",
    "script.firstMilestoneComplete": "已达到第一个 100 欧元。",
    "script.currentMission": "当前任务",
    "script.firstMilestone": "第一个 100 欧元",
    "script.toGo": "还差 {amount}。",
    "script.sinceLaunch": "自上线以来 +{amount}。",
    "script.verifiedSupport": "已验证的支持",
    "script.publicLedger": "公开资金记录",
    "script.ledgerNote": "公开计数来自为本实验记录的已验证支持金额。个人支付详情保持私密。",
    "script.suggestNext": "我下一步该尝试什么？",
    "script.suggestCopy": "提出想法 → 投票 → 看我尝试 → 查看结果。",
  },
  "ja": {
    "script.noLedger": "確認済みの支援はまだありません。",
    "script.ledgerUnavailable": "公開記録は一時的に利用できません。",
    "script.supportLabel": "支援",
    "script.votes": "票",
    "script.votesShort": "票",
    "script.firstExperimentVote": "最初の一票を入れてください。",
    "script.copied": "コピーしました",
    "script.shareMoment": "この瞬間を共有",
    "support.unavailable": "現在、投票を利用できません。",
    "support.ownerMode": "オーナーモードが有効です — 下から返信できます。",
    "support.loginOwner": "まずオーナーとしてログインしてください。",
    "support.replying": "返信中…",
    "support.couldntPost": "返信を投稿できませんでした。",
    "support.systemError": "予測システムに接続できませんでした。",
    "support.reply": "返信",
    "support.noComments": "まだコメントはありません。最初の一人になりましょう。",
    "support.anonymous": "匿名",
    "support.replyPlaceholder": "オーナーとして返信…",
    "support.writeReply": "まず返信を書いてください。",
    "support.commentsUnavailable": "現在コメントを利用できません。",
    "script.updated": "公開記録の支援額から更新しました。",
    "script.unavailable": "確認済みの支援を一時的に利用できません。",
    "script.next": "次のマイルストーン：{milestone} — 残り {remaining}。",
    "script.allMilestones": "リストされたマイルストーンはすべて達成。10億ユーロはまだ目標です。",
    "script.progress": "{pct}%到達。技術的には。",
    "script.progressEmpty": "バーは準備完了。お金はゆっくり進んでいます。",
    "script.milestoneProgress": "現在のマイルストーンまで{pct}%。",
    "script.unlocked": "解除済み",
    "script.starting": "開始",
    "script.locked": "ロック中",
    "script.unknown": "???",
    "script.firstMilestoneComplete": "最初の100ユーロに到達しました。",
    "script.currentMission": "現在のミッション",
    "script.firstMilestone": "最初の100ユーロ",
    "script.toGo": "あと{amount}。",
    "script.sinceLaunch": "開始以来 +{amount}。",
    "script.verifiedSupport": "確認済みの支援",
    "script.publicLedger": "公開マネー記録",
    "script.ledgerNote": "公開カウンターは、この実験に記録された確認済みの支援額から計算されています。個別の支払い情報は非公開です。",
    "script.suggestNext": "次は何を試すべき？",
    "script.suggestCopy": "アイデアを提案 → 投票 → 私が試す → 結果を見る。",
  },
  "ar": {
    "script.noLedger": "لا توجد مساهمات موثقة بعد.",
    "script.ledgerUnavailable": "السجل العام غير متاح مؤقتًا.",
    "script.supportLabel": "دعم",
    "script.votes": "تصويتات",
    "script.votesShort": "تصويتات",
    "script.firstExperimentVote": "كن أول من يصوّت.",
    "script.copied": "تم النسخ",
    "script.shareMoment": "شارك هذه اللحظة",
    "support.unavailable": "التصويت غير متاح حاليًا.",
    "support.ownerMode": "وضع المالك مفعّل — يمكنك الرد أدناه.",
    "support.loginOwner": "سجّل الدخول أولًا بصفتك المالك.",
    "support.replying": "جارٍ الرد...",
    "support.couldntPost": "تعذر نشر الرد.",
    "support.systemError": "تعذر الوصول إلى نظام التوقعات.",
    "support.reply": "رد",
    "support.noComments": "لا توجد تعليقات بعد. كن أول من يعلّق.",
    "support.anonymous": "مجهول",
    "support.replyPlaceholder": "الرد بصفتك المالك...",
    "support.writeReply": "اكتب ردًا أولًا.",
    "support.commentsUnavailable": "التعليقات غير متاحة حاليًا.",
    "script.updated": "تم التحديث من الدعم المسجل علنًا.",
    "script.unavailable": "الدعم الموثق غير متاح مؤقتًا.",
    "script.next": "المرحلة التالية: {milestone} — المتبقي {remaining}.",
    "script.allMilestones": "تم تجاوز جميع المراحل المدرجة. ما زال المليار هو الهدف.",
    "script.progress": "{pct}% من الطريق. تقنيًا.",
    "script.progressEmpty": "الشريط جاهز. المال يأخذ وقته.",
    "script.milestoneProgress": "{pct}% من الطريق إلى المرحلة الحالية.",
    "script.unlocked": "مفتوح",
    "script.starting": "البداية",
    "script.locked": "مغلق",
    "script.unknown": "؟؟؟",
    "script.firstMilestoneComplete": "تم الوصول إلى أول 100 يورو.",
    "script.currentMission": "المهمة الحالية",
    "script.firstMilestone": "أول 100 يورو",
    "script.toGo": "متبقي {amount}.",
    "script.sinceLaunch": "+{amount} منذ الإطلاق.",
    "script.verifiedSupport": "دعم موثّق",
    "script.publicLedger": "سجل الأموال العام",
    "script.ledgerNote": "يُحتسب العداد العام من الدعم الموثّق المسجل للتجربة. تبقى تفاصيل المدفوعات الفردية خاصة.",
    "script.suggestNext": "ماذا يجب أن أجرب بعد ذلك؟",
    "script.suggestCopy": "اقترح فكرة ← صوّت ← شاهدني أجرّبها ← شاهد النتيجة.",
  }
};

  function format(key, vars = {}) {
    const lang = detectLanguage();
    const dict = translations[lang] || translations.en;
    let value = dict[key] || translations.en[key] || dynamicTranslations[lang]?.[key] || dynamicTranslations.en?.[key] || key;
    return value.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ""));
  }

  window.IWBRI18N = { translate, getLanguage: detectLanguage, supported: SUPPORTED, format, translations };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
