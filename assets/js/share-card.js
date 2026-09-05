(()=>{
'use strict';
const canvas=document.createElement('canvas');
canvas.width=1200;canvas.height=630;
const ctx=canvas.getContext('2d');
const W=1200,H=630;
const PURPLE='#b06cff';
const LIGHT='#e7d8ff';
const SOFT='#a49aaa';

function fitText(value,maxWidth,startSize,minSize=24,weight='700'){
  let size=startSize;
  while(size>minSize){ctx.font=`${weight} ${size}px Arial`;if(ctx.measureText(value).width<=maxWidth)return size;size-=2}
  return minSize;
}
function text(value,x,y,size,fill='#fff',weight='700',maxWidth=null,spacing=0){
  ctx.save();ctx.fillStyle=fill;ctx.font=`${weight} ${size}px Arial`;
  if(spacing){let xx=x;for(const ch of value){ctx.fillText(ch,xx,y);xx+=ctx.measureText(ch).width+spacing}}
  else ctx.fillText(value,x,y,maxWidth||undefined);
  ctx.restore();
}
function line(x1,y1,x2,y2,stroke='rgba(210,170,255,.28)',width=1){
  ctx.save();ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.restore();
}
function roundRect(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}

function drawStars(){
  let seed=48271;
  for(let i=0;i<210;i++){
    seed=(seed*16807)%2147483647;
    const x=seed%1200;
    const y=((seed/1200)%1)*500;
    if(x<430&&y>95&&y<460)continue;
    const r=.25+(seed%100)/100*1.15;
    ctx.fillStyle=`rgba(220,194,255,${.12+(seed%65)/100})`;
    ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
  }
}

function drawNebula(){
  const g=ctx.createRadialGradient(905,300,20,900,315,430);
  g.addColorStop(0,'rgba(182,104,255,.24)');
  g.addColorStop(.3,'rgba(118,48,190,.16)');
  g.addColorStop(.72,'rgba(54,22,83,.08)');
  g.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=g;ctx.fillRect(500,0,700,540);
  for(let i=0;i<9;i++){
    ctx.save();ctx.globalAlpha=.035+(i%3)*.012;ctx.strokeStyle='#c18aff';ctx.lineWidth=18;
    ctx.beginPath();ctx.moveTo(610,170+i*35);ctx.bezierCurveTo(760,90+i*15,900,240+i*10,1120,135+i*25);ctx.stroke();ctx.restore();
  }
}

function drawPlanet(){
  const cx=1005,cy=326,r=224;
  ctx.save();
  ctx.shadowColor='rgba(178,100,255,.72)';ctx.shadowBlur=42;
  const rim=ctx.createRadialGradient(cx-90,cy-90,80,cx,cy,r+14);
  rim.addColorStop(0,'rgba(160,93,240,.05)');
  rim.addColorStop(.76,'rgba(104,45,163,.28)');
  rim.addColorStop(.94,'rgba(201,145,255,.76)');
  rim.addColorStop(1,'rgba(122,62,210,0)');
  ctx.fillStyle=rim;ctx.beginPath();ctx.arc(cx,cy,r+8,0,Math.PI*2);ctx.fill();
  ctx.shadowBlur=0;

  const sphere=ctx.createRadialGradient(cx-88,cy-82,8,cx+15,cy+5,r*1.03);
  sphere.addColorStop(0,'#8f65b8');
  sphere.addColorStop(.18,'#593675');
  sphere.addColorStop(.48,'#241334');
  sphere.addColorStop(.78,'#0c0710');
  sphere.addColorStop(1,'#020103');
  ctx.fillStyle=sphere;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();
  ctx.clip();

  // Atmospheric arcs and surface texture.
  for(let i=0;i<30;i++){
    const yy=cy-r+12+i*15;
    ctx.strokeStyle=`rgba(205,160,255,${.035+(i%6)*.012})`;
    ctx.lineWidth=1.5+(i%3)*.4;
    ctx.beginPath();ctx.ellipse(cx-18,yy,205-(i%5)*15,8+(i%4)*3,.12,0,Math.PI*2);ctx.stroke();
  }
  let seed=173;
  for(let i=0;i<120;i++){
    seed=(seed*16807)%2147483647;
    const a=(seed%6283)/1000;
    const rr=35+(seed%185);
    const px=cx+Math.cos(a)*rr;
    const py=cy+Math.sin(a)*rr*.73;
    const alpha=.04+(seed%55)/100;
    ctx.fillStyle=`rgba(230,210,255,${alpha})`;
    ctx.beginPath();ctx.arc(px,py,.5+(seed%18)/10,0,Math.PI*2);ctx.fill();
  }

  // Soft city-light clusters.
  for(let i=0;i<32;i++){
    const a=(i*2.73)%6.28,rr=80+(i*37)%115;
    const px=cx+Math.cos(a)*rr,py=cy+Math.sin(a)*rr*.68;
    ctx.fillStyle=`rgba(210,168,255,${.05+(i%4)*.025})`;
    ctx.fillRect(px,py,1.5+(i%2),1.5+(i%2));
  }
  ctx.restore();
}

function drawLandscape(){
  const horizon=470;
  const haze=ctx.createLinearGradient(0,horizon,0,620);
  haze.addColorStop(0,'rgba(92,45,126,.08)');haze.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=haze;ctx.fillRect(0,horizon,W,H-horizon);

  ctx.beginPath();
  ctx.moveTo(0,565);ctx.lineTo(80,525);ctx.lineTo(150,548);ctx.lineTo(240,505);ctx.lineTo(320,542);ctx.lineTo(410,488);ctx.lineTo(500,535);ctx.lineTo(600,480);ctx.lineTo(690,535);ctx.lineTo(780,493);ctx.lineTo(870,545);ctx.lineTo(965,500);ctx.lineTo(1060,545);ctx.lineTo(1135,505);ctx.lineTo(1200,530);ctx.lineTo(1200,630);ctx.lineTo(0,630);ctx.closePath();
  const far=ctx.createLinearGradient(0,480,0,630);far.addColorStop(0,'#241530');far.addColorStop(1,'#08050b');ctx.fillStyle=far;ctx.fill();

  ctx.beginPath();
  ctx.moveTo(620,630);ctx.lineTo(690,585);ctx.lineTo(755,565);ctx.lineTo(820,580);ctx.lineTo(875,548);ctx.lineTo(930,570);ctx.lineTo(1000,535);ctx.lineTo(1060,565);ctx.lineTo(1125,540);ctx.lineTo(1200,565);ctx.lineTo(1200,630);ctx.closePath();
  const near=ctx.createLinearGradient(0,535,0,630);near.addColorStop(0,'#120b18');near.addColorStop(1,'#030205');ctx.fillStyle=near;ctx.fill();

  // Subtle purple reflections.
  ctx.save();ctx.globalAlpha=.22;ctx.strokeStyle='#a86bdb';ctx.lineWidth=1;
  for(let i=0;i<18;i++){const y=545+i*4;ctx.beginPath();ctx.moveTo(610-i*4,y);ctx.lineTo(980+i*7,y);ctx.stroke()}ctx.restore();
}

function drawFigure(){
  ctx.save();ctx.fillStyle='#020104';
  ctx.beginPath();ctx.ellipse(1022,579,38,8,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(1022,437,13,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.moveTo(1006,451);ctx.quadraticCurveTo(1022,444,1037,453);ctx.lineTo(1042,503);ctx.lineTo(1034,548);ctx.lineTo(1023,550);ctx.lineTo(1019,510);ctx.lineTo(1013,550);ctx.lineTo(1002,548);ctx.lineTo(1006,504);ctx.closePath();ctx.fill();
  ctx.fillRect(1006,490,31,9);
  ctx.restore();
}

function render(p,wealth='13',milestone=null){
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='#060409';ctx.fillRect(0,0,W,H);
  drawNebula();drawStars();

  // Frame.
  ctx.strokeStyle='rgba(198,143,255,.58)';ctx.lineWidth=1;ctx.strokeRect(20,20,W-40,H-40);
  ctx.strokeStyle='rgba(255,255,255,.05)';ctx.strokeRect(24,24,W-48,H-48);

  // Header.
  text('IWANNABERICH',58,59,22,'#f8f5fb','700');
  line(275,51,900,51,'rgba(205,161,255,.42)');
  text('PEOPLE',930,58,12,PURPLE,'600',null,3);
  text('×',1018,58,12,SOFT,'400');
  text('EXPERIMENT',1046,58,12,PURPLE,'600',null,3);
  text('×',1140,58,12,SOFT,'400');
  text('€1B',1167,58,12,PURPLE,'600');

  // Main identity.
  text('A REAL EXPERIMENT.',58,127,18,LIGHT,'500',null,5);
  text('A PUBLIC JOURNEY.',58,156,18,LIGHT,'500',null,5);
  const number=`CONTRIBUTOR #${p?.contributor_number||'—'}`;
  const nSize=fitText(number,720,66,36,'700');
  text(number,58,246,nSize,'#fff','700');
  const here=milestone?`I WAS HERE AT €${Number(milestone).toLocaleString()}.`:'I WAS HERE EARLY.';
  text(here,58,307,51,'#fff','700');

  const score=Number(p?.xp||0).toLocaleString();
  const meta=`${p?.rank||'Curious'}   ·   ${score} Contribution Score   ·   Exploring what's possible.`;
  const metaSize=fitText(meta,760,21,16,'400');
  text(meta,58,350,metaSize,SOFT,'400');

  const current=Number(wealth||13).toLocaleString();
  text(`€${current}  →  €1,000,000,000`,58,430,44,'#fff','700');
  text('A REAL EXPERIMENT.  A PUBLIC JOURNEY.',60,468,14,SOFT,'500',null,4);

  // Visual side of the story.
  drawPlanet();drawLandscape();drawFigure();

  // Live experiment indicator.
  ctx.fillStyle='#b37aff';ctx.beginPath();ctx.arc(1014,116,7,0,Math.PI*2);ctx.fill();
  text('LIVE',1034,121,12,'#fff','600',null,3);
  text('EXPERIMENT',1034,143,12,'#fff','600',null,3);
  text('CONTRIBUTE',1034,177,12,PURPLE,'500',null,3);
  text('FOLLOW',1034,204,12,PURPLE,'500',null,3);
  text('BE PART OF IT',1034,231,12,PURPLE,'500',null,3);

  // Footer.
  text('iwannaberich.xyz',58,586,20,'#aaa0b4','400');
  line(285,578,850,578,'rgba(196,142,255,.34)');
  text('SAME PEOPLE.  A RICHER TOMORROW.',870,586,11,PURPLE,'500',null,3);
  return canvas;
}

window.IWBRShareCard={
  render,
  download(filename='iwannaberich-contributor.png'){
    canvas.toBlob(blob=>{
      if(!blob)return;
      const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename;a.click();
      setTimeout(()=>URL.revokeObjectURL(a.href),1000);
    },'image/png');
  }
};
})();