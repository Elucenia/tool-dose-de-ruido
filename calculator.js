/* ELUCENIA standalone integration. Source package metadata and rights: README.md. */
(function(root){'use strict';
function freeze(value){if(value&&typeof value==='object'){for(const item of Object.values(value))freeze(item);Object.freeze(value);}return value;}
const TOOL=freeze({"id":"dose-de-ruido","title":"Dose de ruído (NR-15, Anexo 1)","fields":[["n1","Período 1: nível de ruído","num",{"min":60,"max":140,"step":0.1,"unit":"dB(A)","ph":"90"}],["t1","Período 1: tempo de exposição","num",{"min":0,"max":24,"step":0.01,"unit":"h","ph":"4"}],["n2","Período 2: nível de ruído","num",{"min":60,"max":140,"step":0.1,"unit":"dB(A)","opt":true}],["t2","Período 2: tempo de exposição","num",{"min":0,"max":24,"step":0.01,"unit":"h","opt":true}],["n3","Período 3: nível de ruído","num",{"min":60,"max":140,"step":0.1,"unit":"dB(A)","opt":true}],["t3","Período 3: tempo de exposição","num",{"min":0,"max":24,"step":0.01,"unit":"h","opt":true}],["n4","Período 4: nível de ruído","num",{"min":60,"max":140,"step":0.1,"unit":"dB(A)","opt":true}],["t4","Período 4: tempo de exposição","num",{"min":0,"max":24,"step":0.01,"unit":"h","opt":true}]],"config":null,"reviewStatus":"needs-review","clinicalValidation":"not-performed"});
const window={};
/* ELUCENIA arithmetic registry. No DOM access, storage, telemetry or network requests. */
(function(root){
  'use strict';
  const CALC={fn:Object.create(null)};
  const round=(n,d=1)=>Math.round(n*Math.pow(10,d))/Math.pow(10,d);
  const yes=v=>v===true||v==='1'||v===1;
  CALC.h={
    r1:round,
    br:(n,d=1)=>round(n,d).toLocaleString('pt-BR',{minimumFractionDigits:d,maximumFractionDigits:d}),
    band:(n,bands)=>{for(const b of bands)if(n<b[0])return b[1];return bands[bands.length-1][1];},
    sum:(values,weights)=>Object.entries(weights).reduce((n,[key,w])=>n+(yes(values[key])?w:0),0),yes
  };
  CALC.def=(id,fn)=>{if(CALC.fn[id])throw Error('Duplicate calculator '+id);CALC.fn[id]=fn;};
  CALC.score=(cfg,values)=>{
    let score=0;
    for(const[name,type,weight]of cfg.fields){const v=values[name];if(type==='chk'){if(yes(v))score+=weight;}else if(type==='radio'||type==='sel'){const n=parseFloat(v);if(!Number.isNaN(n))score+=n;}}
    score=round(score,2);let band=cfg.bands[0];for(const b of cfg.bands)if(score>=b[0])band=b;
    return{main:[String(score).replace('.',','),cfg.unit||(Math.abs(score)===1?'ponto':'pontos')],label:cfg.label,level:band[1],verdict:band[2],note:band[3]||'',raw:{score}};
  };
  CALC.run=(id,values,cfg)=>{if(cfg&&cfg.bands)return CALC.score(cfg,values);if(!CALC.fn[id])return{error:'Calculadora indisponível.'};return CALC.fn[id](values);};
  root.CALC=CALC;if(typeof module!=='undefined')module.exports=CALC;
})(typeof window!=='undefined'?window:globalThis);

(function(a){'use strict';
var e=a.h;
var o=e.br;
var f=[[85,8],[86,7],[87,6],[88,5],[89,4.5],[90,4],[91,3.5],[92,3],[93,2+40/60],[94,2.25],[95,2],[96,1.75],[98,1.25],[100,1],[102,.75],[104,35/60],[105,.5],[106,25/60],[108,20/60],[110,.25],[112,10/60],[114,8/60],[115,7/60]];
var h=function(a){var e=Math.round(60*a),o=Math.floor(e/60),r=e%60;return(o?o+" h":"")+(o&&r?" ":"")+(r||!o?r+" min":"")};
a.def("dose-de-ruido",function(a){for(var e=0,r=[],i=!1,t=0,n=!1,s=1;s<=4;s++){var d=a["n"+s],l=a["t"+s];if(null!=d||null!=l){if(null==d||null==l)return{error:"Preencha o nível e o tempo de cada período "+s+" (ou deixe os dois em branco)."};if(l>0)if(t++,d>115)i=!0,r.push(["Período "+s+": "+o(d,1)+" dB(A) por "+h(l),"acima de 115 dB(A): não permitido sem proteção"]);else if(d<85)n=!0,r.push(["Período "+s+": "+o(d,1)+" dB(A) por "+h(l),"abaixo de 85 dB(A): sem limite no Quadro"]);else{for(var m=null,c=null,u=0;u<f.length;u++)if(f[u][0]>=d-1e-9){m=f[u][1],c=f[u][0];break}e+=l/m,r.push(["Período "+s+": "+o(d,1)+" dB(A) por "+h(l),"C/T = "+o(l,2)+" / "+o(m,2)+" h = "+o(l/m,2)+(c!==d?" (nível "+c+" dB(A) do Quadro)":"")])}}}if(!t)return{error:"Informe ao menos um período de exposição com tempo maior que zero."};var p=i||e>1?"high":e>=.5?"mid":"low",v=i?"Exposição acima de 115 dB(A) sem proteção adequada: risco grave e iminente (NR-15, Anexo 1, item 7)":e>1?"Dose acima de 1 (100%): exposição acima do limite de tolerância":e>=.5?"Dose entre 0,5 e 1: dentro do limite de tolerância, mas acima do nível de ação":"Dose abaixo de 0,5 (nível de ação)";return{main:[o(100*e,0),"%"],label:"Dose diária de ruído (soma de C/T)",level:p,verdict:v,rows:r,note:n?"Períodos abaixo de 85 dB(A) não entram na soma pelo critério da NR-15.":"",raw:{dose:e}}});
})(window.CALC);
function calculate(input){
 if(!input||typeof input!=='object'||Array.isArray(input))return {error:'Informe um objeto com os campos da ferramenta.',code:'INVALID_INPUT'};
 const values=Object.create(null);
 for(const[name,,kind,o={}] of TOOL.fields){
  const v=Object.hasOwn(input,name)?input[name]:undefined;
  if(kind==='chk'){if(v!==undefined&&v!==null&&![true,false,1,0,'1','0'].includes(v))return {error:'Campo booleano inválido: '+name,field:name,code:'INVALID_INPUT'};values[name]=v===true||v===1||v==='1';continue;}
  const empty=v==null||(typeof v==='string'&&!v.trim());
  if(empty){if(!o.opt)return {error:'Campo obrigatório: '+name,field:name,code:'REQUIRED_FIELD'};values[name]=kind==='num'?null:'';continue;}
  if(kind==='num'){
   if(!['number','string'].includes(typeof v)||(typeof v==='string'&&!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(v.trim()))||!Number.isFinite(Number(v)))return {error:'Número inválido: '+name,field:name,code:'INVALID_INPUT'};
   const n=Number(v);if((Number.isFinite(o.min)&&n<o.min)||(Number.isFinite(o.max)&&n>o.max))return {error:'Valor fora do intervalo: '+name,field:name,code:'OUT_OF_RANGE'};
   values[name]=n;
  }else{if(!Object.hasOwn(o.opts||{},String(v)))return {error:'Opção inválida: '+name,field:name,code:'INVALID_OPTION'};values[name]=String(v);}
 }
 try{const r=window.CALC.run(TOOL.id,values,TOOL.config);if(r.error)return {error:String(r.error).replace(/<[^>]*>/g,''),code:'FORMULA_DOMAIN'};
  if(!Array.isArray(r.main)||r.main.some(v=>typeof v==='number'&&!Number.isFinite(v))||/\b(?:NaN|Infinity)\b/.test(String(r.main[0])))return {error:'Resultado não finito ou indisponível.',code:'INVALID_RESULT'};
  return {id:TOOL.id,main:r.main,label:r.label||TOOL.title,raw:r.raw||{},clinicalValidation:'not-performed'};
 }catch{return {error:'Confira os valores e o domínio da fórmula.',code:'FORMULA_DOMAIN'};}
}
const api=Object.freeze({metadata:TOOL,calculate});if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.EluceniaTool=api;
})(typeof globalThis!=='undefined'?globalThis:this);
