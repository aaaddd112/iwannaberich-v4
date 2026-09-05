(()=>{
'use strict';
const canvas=document.createElement('canvas');
canvas.width=1200;canvas.height=630;
const ctx=canvas.getContext('2d');
const W=1200,H=630;
const PURPLE='#a970ff';
const SOFT='#9c92ad';

function fitText(text,maxWidth,startSize,weight='700',family='Arial'){
  let size=startSize;
  while(size>20){
    ctx.font=`${weight} ${size}px ${family}`;
    if(ctx.measureText(text).width<=maxWidth)return size;
    size-=2;
  }
  return size;
}

function text(text,x,y,size,fill='#fff',weight='700',maxWidth=null,spacing=0){
  ctx.save();
  ctx.fillStyle=fill;
  ctx.font=`${weight} ${size}px Arial`;
  if(spacing){
    let xx=x;
    for(const ch of text){ctx.fillText(ch,xx,y);xx+=ctx.measureText(ch).width+spacing}
  }else ctx.fillText(text,x,y,maxWidth||undefined);
  ctx.restore();
}

function line(x1,y1,x2,y2,stroke='rgba(255,255,255,.18)',width=1){
  ctx.save();ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.restore();
}

function drawStars(){
  let seed=7919;
  for(let i=0;i<150;i++){
    seed=(seed*16807)%2147483647;
    const x=(seed%1200), y=((seed/1200)%1)*630;
    if(x<600&&y>120&&y<560)continue;
    const r=((seed%100)/100)*1.25+.25;
    ctx.fillStyle=`rgba(190,150,255,${.12+((seed%60)/100)})`;
    ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
  }
}

function drawPlanet(){
  const cx=1010,cy=315,r=225;
  ctx.save();
  ctx.shadowColor='rgba(174,103,255,.65)';ctx.shadowBlur=32;
  const glow=ctx.createRadialGradient(cx-35,cy-35,80,cx,cy,r+18);
  glow.addColorStop(0,'rgba(181,125,255,.12)');
  glow.addColorStop(.82,'rgba(125,66,220,.28)');
  glow.addColorStop(1,'rgba(177,113,255,.75)');
  ctx.fillStyle=glow;ctx.beginPath();ctx.arc(cx,cy,r+2,0,Math.PI*2);ctx.fill();
  ctx.shadowBlur=0;
  const sphere=ctx.createRadialGradient(cx-82,cy-70,18,cx,cy,r);
  sphere.addColorStop(0,'#7e5a9f');
  sphere.addColorStop(.38,'#3b2751');
  sphere.addColorStop(.72,'#130d1b');
  sphere.addColorStop(1,'#050407');
  ctx.fillStyle=sphere;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();
  ctx.clip();
  for(let i=0;i<22;i++){
    const yy=cy-r+i*21+((i*17)%12);
    ctx.strokeStyle=`rgba(185,130,255,${.06+((i%5)*.018)})`;ctx.lineWidth=2;
    ctx.beginPath();ctx.ellipse(cx-15,yy,190-(i%4)*22,9+(i%3)*4,.08,0,Math.PI*2);ctx.stroke();
  }
  for(let i=0;i<70;i++){
    const a=i*2.399, rr=35+((i*47)%175);
    const px=cx+Math.cos(a)*rr,py=cy+Math.sin(a)*rr*.72;
    ctx.fillStyle=`rgba(226,205,255,${.08+((i%6)*.025)})`;
    ctx.beginPath();ctx.arc(px,py,1+(i%3)*.45,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
}

function drawLandscape(){
  const grad=ctx.createLinearGradient(0,450,0,630);grad.addColorStop(0,'rgba(62,30,86,.05)');grad.addColorStop(1,'#050407');
  ctx.fillStyle=grad;ctx.fillRect(0,430,W,200);
  ctx.beginPath();ctx.moveTo(0,565);ctx.lineTo(90,520);ctx.lineTo(170,548);ctx.lineTo(265,495);ctx.lineTo(340,535);ctx.lineTo(445,475);ctx.lineTo(540,530);ctx.lineTo(650,485);ctx.lineTo(760,545);ctx.lineTo(850,500);ctx.lineTo(940,550);ctx.lineTo(1030,510);ctx.lineTo(1120,545);ctx.lineTo(1200,500);ctx.lineTo(1200,630);ctx.lineTo(0,630);ctx.closePath();
  const m=ctx.createLinearGradient(0,480,0,630);m.addColorStop(0,'#21152d');m.addColorStop(1,'#070508');ctx.fillStyle=m;ctx.fill();
  ctx.beginPath();ctx.moveTo(680,630);ctx.lineTo(735,585);ctx.lineTo(790,560);ctx.lineTo(850,575);ctx.lineTo(910,550);ctx.lineTo(980,570);ctx.lineTo(1030,535);ctx.lineTo(1085,565);ctx.lineTo(1145,540);ctx.lineTo(1200,565);ctx.lineTo(1200,630);ctx.closePath();ctx.fillStyle='#060408';ctx.fill();
}

function drawFigure(){
  ctx.save();
  ctx.fillStyle='#030205';
  ctx.beginPath();ctx.ellipse(1018,575,42,9,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(1018,438,14,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.moveTo(1001,452);ctx.quadraticCurveTo(1018,445,1035,455);ctx.lineTo(1040,505);ctx.lineTo(1030,548);ctx.lineTo(1020,550);ctx.lineTo(1016,510);ctx.lineTo(1010,550);ctx.lineTo(998,548);ctx.lineTo(1003,505);ctx.closePath();ctx.fill();
  ctx.fillRect(1001,492,34,9);
  ctx.restore();
}

function render(p,wealth='13',milestone=null){
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='#07050a';ctx.fillRect(0,0,W,H);
  const bg=ctx.createRadialGradient(950,290,20,950,300,560);bg.addColorStop(0,'rgba(91,43,135,.22)');bg.addColorStop(.55,'rgba(31,14,45,.16)');bg.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  drawStars();
  ctx.strokeStyle='rgba(190,135,255,.55)';ctx.lineWidth=1;ctx.strokeRect(20,20,W-40,H-40);
  text('IWANNABERICH',58,58,22,'#f5f2f8','700');
  line(275,50,900,50,'rgba(190,135,255,.45)');
  text('PEOPLE',932,57,13,PURPLE,'600',null,3);
  text('×',1020,57,13,SOFT,'400');
  text('EXPERIMENT',1050,57,13,PURPLE,'600',null,3);
  text('×',1142,57,13,SOFT,'400');
  text('€1B',1170,57,13,PURPLE,'600');

  text('A REAL EXPERIMENT.',58,126,19,PURPLE,'500',null,5);
  text('A PUBLIC JOURNEY.',58,155,19,PURPLE,'500',null,5);

  const number=`CONTRIBUTOR #${p?.contributor_number||'—'}`;
  const nSize=fitText(number,690,62,'700','Arial');
  text(number,58,245,nSize,'#fff','700');
  const nWidth=ctx.measureText(number).width;
  text('I WAS HERE EARLY.',58,307,50,'#fff','700');
  if(milestone)text(`I WAS HERE AT €${Number(milestone).toLocaleString()}.`,58,307,50,'#fff','700');

  const score=Number(p?.xp||0).toLocaleString();
  text(`${p?.rank||'Curious'}   ·   ${score} Contribution Score   ·   Exploring what's possible.`,58,350,22,SOFT,'400');

  const current=Number(wealth||13).toLocaleString();
  text(`€${current}  →  €1,000,000,000`,58,430,43,'#fff','700');
  text('A REAL EXPERIMENT.  A PUBLIC JOURNEY.',60,467,15,SOFT,'500',null,4);

  drawPlanet();
  drawLandscape();
  drawFigure();

  ctx.save();ctx.fillStyle='#a970ff';ctx.beginPath();ctx.arc(1015,115,7,0,Math.PI*2);ctx.fill();
  text('LIVE',1035,121,13,'#fff','600',null,3);text('EXPERIMENT',1035,143,13,'#fff','600',null,3);
  text('CONTRIBUTE',1035,177,13,PURPLE,'500',null,3);text('FOLLOW',1035,204,13,PURPLE,'500',null,3);text('BE PART OF IT',1035,231,13,PURPLE,'500',null,3);
  ctx.restore();

  text('iwannaberich.xyz',58,585,21,'#aaa0b4','400');
  line(285,577,850,577,'rgba(190,135,255,.35)');
  text('SAME PEOPLE.  A RICHER TOMORROW.',870,585,13,PURPLE,'500',null,3);
  return canvas;
}

window.IWBRShareCard={
  render,
  download(filename='iwannaberich-contributor.png'){
    canvas.toBlob(blob=>{
      if(!blob)return;
      const a=document.createElement('a');
      a.href=URL.createObjectURL(blob);a.download=filename;a.click();
      setTimeout(()=>URL.revokeObjectURL(a.href),1000);
    },'image/png');
  }
};
})();