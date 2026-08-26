(() => {
  const T = {
    en:{m5:'First coffee paid for by the experiment',m10:'Okay, this is actually moving',m25:'A stranger is genuinely involved',m50:'Halfway to the first real target',m100:'First milestone. Then we figure out €1,000.',today:'Still wildly optimistic'},
    es:{m5:'El primer café pagado por el experimento',m10:'Vale, esto realmente se está moviendo',m25:'Un desconocido participa de verdad',m50:'A mitad del primer objetivo real',m100:'Primer hito. Después veremos los 1.000 €.',today:'Seguimos siendo increíblemente optimistas'},
    fr:{m5:'Le premier café payé par l’expérience',m10:'Bon, ça avance vraiment',m25:'Un inconnu participe réellement',m50:'À mi-chemin du premier vrai objectif',m100:'Première étape. Ensuite, 1 000 €.',today:'Toujours ridiculement optimiste'},
    de:{m5:'Der erste Kaffee, den das Experiment bezahlt',m10:'Okay, das bewegt sich tatsächlich',m25:'Ein Fremder ist wirklich beteiligt',m50:'Halbwegs zum ersten echten Ziel',m100:'Erster Meilenstein. Dann nehmen wir 1.000 € in Angriff.',today:'Immer noch völlig optimistisch'},
    pt:{m5:'O primeiro café pago pelo experimento',m10:'Ok, isto está mesmo a avançar',m25:'Um desconhecido está realmente envolvido',m50:'A meio do primeiro objetivo real',m100:'Primeiro marco. Depois chegamos aos €1.000.',today:'Continuamos absurdamente otimistas'},
    zh:{m5:'实验支付的第一杯咖啡',m10:'好吧，这真的开始动起来了',m25:'一个陌生人真的参与进来了',m50:'距离第一个真正目标已经过半',m100:'第一个里程碑。然后挑战 €1,000。',today:'依然极度乐观'},
    ja:{m5:'実験で初めて支払ったコーヒー',m10:'よし、本当に動き始めた',m25:'見知らぬ人が本当に参加した',m50:'最初の本当の目標まであと半分',m100:'最初のマイルストーン。次は€1,000。',today:'相変わらず無謀なほど楽観的'},
    ar:{m5:'أول قهوة دفع ثمنها المشروع',m10:'حسنًا، هذا يتحرك فعلًا',m25:'شخص غريب أصبح مشاركًا فعلًا',m50:'في منتصف الطريق نحو أول هدف حقيقي',m100:'أول مرحلة. ثم نصل إلى 1,000 يورو.',today:'ما زلنا متفائلين بشكل مبالغ فيه'}
  };
  document.addEventListener('DOMContentLoaded', () => {
    const apply = () => {
      const lang = localStorage.getItem('iwbr_language') || 'en';
      const t = T[lang] || T.en;
      document.querySelectorAll('[data-milestone]').forEach(el => {
        const key = el.dataset.milestone;
        if (t[key]) el.textContent = t[key];
      });
    };
    apply();
    window.addEventListener('iwbr:languagechange', apply);
  });
})();
