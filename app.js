// ===== FORGE v5 — SUPABASE CONNECTED =====
const SUPA_URL='https://zvoruwwnpjllejdpkvby.supabase.co';
const SUPA_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2b3J1d3ducGpsbGVqZHBrdmJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MDEwNTQsImV4cCI6MjA4OTI3NzA1NH0.Yze0pciebPhlrsbBci3eQMIeRpGS_dkYOxVrliiezrQ';
const sb=supabase.createClient(SUPA_URL,SUPA_KEY);

// ===== STATE =====
let S={user:null,profile:null,pg:'dashboard',clients:[],programs:[],sessions:[],surveys:[],foods:[],toasts:[],modal:null,chatTarget:null,exFilter:'Tous',loading:true};
const toast=(m,t='ok')=>{const id=Date.now();S.toasts.push({id,m,t});R();setTimeout(()=>{S.toasts=S.toasts.filter(x=>x.id!==id);R()},3e3)};
const IN=(a,b)=>((a||'X')[0]+(b||'X')[0]).toUpperCase();
const fmtD=d=>d?new Date(d).toLocaleDateString('fr-FR'):'—';
const fmtT=d=>new Date(d).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});

// ===== ICONS =====
const ic={
dash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
users:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>',
lib:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>',
prog:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/></svg>',
timer:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M5 3l2 2M19 3l-2 2M12 5V3M10 3h4"/></svg>',
perf:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
fire:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 002.5 2.5z"/></svg>',
food:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>',
cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>',
star:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01z"/></svg>',
qr:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="3" height="3"/><path d="M21 14h-3v3M21 21v-3h-3"/></svg>',
chart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>',
gear:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1.08 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.6.82 1.02 1.51 1.08H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
out:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>',
plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>',
bell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>',
send:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></svg>',
mic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/></svg>',
edit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4z"/></svg>',
trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>',
play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
};

// ===== AUTH =====
async function doSignUp(email,pass,name,role){
  const{data,error}=await sb.auth.signUp({email,password:pass,options:{data:{full_name:name,role}}});
  if(error){toast(error.message,'err');return false;}
  toast('Compte créé ! Vérifiez votre email pour confirmer.','inf');return true;
}
async function doSignIn(email,pass){
  const{data,error}=await sb.auth.signInWithPassword({email,password:pass});
  if(error){toast(error.message,'err');return false;}
  return true;
}
async function doSignOut(){await sb.auth.signOut();S.user=null;S.profile=null;S.clients=[];R();}

// ===== DATA LOADERS =====
async function loadProfile(){const{data}=await sb.from('profiles').select('*').eq('id',S.user.id).single();S.profile=data;}
async function loadClients(){
  if(S.profile?.role==='coach'){const{data}=await sb.from('clients').select('*').eq('coach_id',S.user.id).order('created_at',{ascending:false});S.clients=data||[];}
  else{const{data}=await sb.from('clients').select('*').eq('user_id',S.user.id);S.clients=data||[];}
}
async function loadSessions(){
  if(S.profile?.role==='coach'){const{data}=await sb.from('sessions').select('*').eq('coach_id',S.user.id).order('date');S.sessions=data||[];}
  else if(S.clients[0]){const{data}=await sb.from('sessions').select('*').eq('client_id',S.clients[0].id).order('date');S.sessions=data||[];}
}
async function loadPrograms(){
  if(S.profile?.role==='coach'){const{data}=await sb.from('programs').select('*').eq('coach_id',S.user.id);S.programs=data||[];}
  else if(S.clients[0]){const{data}=await sb.from('programs').select('*').eq('client_id',S.clients[0].id);S.programs=data||[];}
}
async function loadSurveys(){
  if(S.profile?.role==='coach'){const{data}=await sb.from('surveys').select('*').eq('coach_id',S.user.id).order('created_at',{ascending:false});S.surveys=data||[];}
  else if(S.clients[0]){const{data}=await sb.from('surveys').select('*').eq('client_id',S.clients[0].id);S.surveys=data||[];}
}
async function loadFoods(){const{data}=await sb.from('foods').select('*').order('name');S.foods=data||[];}
async function loadMsgs(cid){const{data}=await sb.from('messages').select('*').eq('client_id',cid).order('created_at');return data||[];}
async function loadPerfs(cid){const{data}=await sb.from('performances').select('*').eq('client_id',cid).order('date');return data||[];}
async function loadAll(){S.loading=true;R();await loadProfile();await loadClients();await loadSessions();await loadPrograms();await loadSurveys();await loadFoods();S.loading=false;R();}

// ===== REALTIME =====
function subRealtime(){
  sb.channel('rt-msgs').on('postgres_changes',{event:'INSERT',schema:'public',table:'messages'},()=>{if(S.pg==='chat'||S.pg==='cl-chat'){const el=document.getElementById('chatMsgs');if(el)refreshChat();}}).subscribe();
  sb.channel('rt-sess').on('postgres_changes',{event:'*',schema:'public',table:'sessions'},()=>{loadSessions().then(R);}).subscribe();
}

// ===== AUTH LISTENER =====
sb.auth.onAuthStateChange(async(ev,session)=>{
  if(session?.user){S.user=session.user;await loadAll();subRealtime();toast('Bienvenue !');}
  else{S.user=null;S.profile=null;S.loading=false;R();}
});
(async()=>{const{data:{session}}=await sb.auth.getSession();if(!session){S.loading=false;R();}})();

// ===== RENDER =====
function R(){
  const root=document.getElementById('root');
  if(S.loading){root.innerHTML='<div class="loading">Chargement de FORGE...</div>';return;}
  if(!S.user){root.innerHTML=authPg();return;}
  const isC=S.profile?.role==='coach';
  root.innerHTML=sideBar(isC)+`<div class="main">${topBar()}<div class="pg">${pgRoute(isC)}</div></div>`+toastH()+modalH();
  setTimeout(()=>{const el=document.getElementById('chatMsgs');if(el)el.scrollTop=el.scrollHeight;},30);
  if((S.pg==='chat'&&S.chatTarget)||(S.pg==='cl-chat'&&S.clients[0]))setTimeout(refreshChat,50);
}

// ===== AUTH PAGE =====
let authMode='login',authRole='coach';
function authPg(){
return `<div style="min-height:100vh;display:flex;position:relative;overflow:hidden">
<div style="position:absolute;width:700px;height:700px;background:radial-gradient(circle,var(--acg) 0%,transparent 65%);top:-250px;left:-150px;pointer-events:none"></div>
<div style="flex:1;display:flex;align-items:center;justify-content:center;padding:50px;position:relative;z-index:1">
<div style="max-width:400px"><h1 style="font-family:var(--fs);font-size:4.5rem;color:var(--ac);font-style:italic;letter-spacing:-3px;line-height:.9">Forge</h1>
<p style="font-size:.95rem;color:var(--t2);margin-top:16px;line-height:1.7;font-weight:300">Plateforme de coaching connectée. Données cloud, chat temps réel, suivi complet.</p>
<div style="margin-top:32px;display:flex;flex-direction:column;gap:8px">${['☁️ Données sauvegardées en cloud','💬 Chat temps réel coach ↔ client','⏱️ Timer AMRAP / EMOM / Tabata','📚 40+ exercices avec anatomie','📱 QR code par client'].map(f=>`<div style="display:flex;align-items:center;gap:10px;font-size:.82rem;color:var(--t2)"><span style="font-size:.9rem">${f.slice(0,2)}</span>${f.slice(3)}</div>`).join('')}</div>
</div></div>
<div style="width:420px;background:var(--bg2);display:flex;align-items:center;justify-content:center;padding:40px;border-left:1px solid rgba(255,255,255,.04);position:relative;z-index:1">
<div style="width:100%;max-width:320px">
<h2 style="font-family:var(--fs);font-size:2rem;font-style:italic;margin-bottom:4px">${authMode==='login'?'Connexion':'Inscription'}</h2>
<p style="color:var(--t3);font-size:.8rem;margin-bottom:18px">${authMode==='login'?'Accédez à votre espace':'Créez votre compte'}</p>
<div style="display:flex;gap:4px;background:var(--bg3);padding:3px;border-radius:var(--r2);margin-bottom:18px">
<div style="flex:1;padding:7px;text-align:center;border-radius:7px;font-size:.74rem;font-weight:600;cursor:pointer;${authMode==='login'?'background:var(--s2);color:var(--t)':'color:var(--t3)'}" onclick="authMode='login';R()">Connexion</div>
<div style="flex:1;padding:7px;text-align:center;border-radius:7px;font-size:.74rem;font-weight:600;cursor:pointer;${authMode==='register'?'background:var(--s2);color:var(--t)':'color:var(--t3)'}" onclick="authMode='register';R()">Inscription</div>
</div>
${authMode==='register'?`
<div style="display:flex;gap:6px;margin-bottom:16px">
<div style="flex:1;padding:10px;border-radius:var(--r2);border:1px solid ${authRole==='coach'?'var(--ac)':'var(--bg5)'};text-align:center;cursor:pointer;background:${authRole==='coach'?'var(--acg)':'var(--bg3)'}" onclick="authRole='coach';R()"><div style="font-size:1.2rem">🏋️</div><div style="font-size:.72rem;font-weight:700;margin-top:3px">Coach</div></div>
<div style="flex:1;padding:10px;border-radius:var(--r2);border:1px solid ${authRole==='client'?'var(--ac)':'var(--bg5)'};text-align:center;cursor:pointer;background:${authRole==='client'?'var(--acg)':'var(--bg3)'}" onclick="authRole='client';R()"><div style="font-size:1.2rem">💪</div><div style="font-size:.72rem;font-weight:700;margin-top:3px">Client</div></div>
</div>
<div class="fg"><label class="lb">Nom complet</label><input id="rN" placeholder="Jean Dupont"></div>
<div class="fg"><label class="lb">Email</label><input id="rE" type="email"></div>
<div class="fg"><label class="lb">Mot de passe (min 6)</label><input id="rP" type="password"></div>
<button class="b bp" style="width:100%" onclick="handleReg()">Créer mon compte</button>
<p style="text-align:center;margin-top:12px;font-size:.76rem;color:var(--t3)">Déjà un compte ? <a onclick="authMode='login';R()">Se connecter</a></p>
`:`
<div class="fg"><label class="lb">Email</label><input id="lE" type="email"></div>
<div class="fg"><label class="lb">Mot de passe</label><input id="lP" type="password"></div>
<button class="b bp" style="width:100%" onclick="handleLogin()">Se connecter</button>
<p style="text-align:center;margin-top:12px;font-size:.76rem;color:var(--t3)">Pas de compte ? <a onclick="authMode='register';R()">S'inscrire</a></p>
`}
</div></div></div>`;
}
async function handleLogin(){const e=document.getElementById('lE')?.value,p=document.getElementById('lP')?.value;if(!e||!p){toast('Champs requis','err');return;}S.loading=true;R();await doSignIn(e,p);}
async function handleReg(){const n=document.getElementById('rN')?.value,e=document.getElementById('rE')?.value,p=document.getElementById('rP')?.value;if(!n||!e||!p){toast('Tous les champs requis','err');return;}if(p.length<6){toast('Mot de passe trop court','err');return;}await doSignUp(e,p,n,authRole);}

// ===== SIDEBAR =====
function sideBar(isC){
const p=S.pg,name=S.profile?.full_name||S.user?.email||'User';
const cn=[{id:'dashboard',l:'Tableau de bord',i:ic.dash},{id:'clients',l:'Clients',i:ic.users},{id:'exercises',l:'Bibliothèque',i:ic.lib},{id:'programs',l:'Programmes',i:ic.prog},{id:'timer',l:'Timer WOD',i:ic.timer},{id:'performance',l:'Performances',i:ic.perf},{id:'calories',l:'Calories',i:ic.fire},{id:'nutrition',l:'Nutrition',i:ic.food},{id:'calendar',l:'Calendrier',i:ic.cal},{id:'chat',l:'Messages',i:ic.chat},{id:'survey',l:'Satisfaction',i:ic.star},{id:'qrcode',l:'QR Codes',i:ic.qr},{id:'stats',l:'Stats',i:ic.chart}];
const cln=[{id:'cl-dash',l:'Mon espace',i:ic.dash},{id:'cl-cal',l:'Mes séances',i:ic.cal},{id:'cl-prog',l:'Programme',i:ic.prog},{id:'exercises',l:'Exercices',i:ic.lib},{id:'timer',l:'Timer WOD',i:ic.timer},{id:'cl-kcal',l:'Objectifs',i:ic.fire},{id:'cl-nutri',l:'Nutrition',i:ic.food},{id:'cl-chat',l:'Messages',i:ic.chat},{id:'cl-survey',l:'Évaluations',i:ic.star}];
const nav=isC?cn:cln;
return `<div class="side"><div class="side-hd"><div class="logo">Forge</div><div class="logo-s">${isC?'Coach Platform':'Espace Client'}</div></div>
<nav class="side-nav"><div class="nsec">Menu</div>${nav.map(n=>`<div class="ni ${p===n.id?'on':''}" onclick="S.pg='${n.id}';R()">${n.i}${n.l}</div>`).join('')}
<div class="nsec" style="margin-top:10px">Compte</div><div class="ni" onclick="S.pg='settings';R()">${ic.gear}Paramètres</div><div class="ni" onclick="doSignOut()">${ic.out}Déconnexion</div>
</nav><div class="side-ft"><div class="ucard"><div class="av av-s" style="background:${isC?'var(--ac)':'var(--blu)'};color:#000">${name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)}</div><div style="flex:1;min-width:0"><div style="font-size:.75rem;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${name}</div><div style="font-size:.6rem;color:var(--t4)">${isC?'Coach':'Client'}</div></div></div></div></div>`;
}
function topBar(){
const ts={dashboard:'Tableau de bord',clients:'Clients',exercises:'Bibliothèque',programs:'Programmes',timer:'Timer WOD',performance:'Performances',calories:'Calories',nutrition:'Nutrition',calendar:'Calendrier',chat:'Messages',survey:'Satisfaction',qrcode:'QR Codes',stats:'Stats',settings:'Paramètres','cl-dash':'Mon espace','cl-cal':'Mes séances','cl-prog':'Programme','cl-kcal':'Objectifs','cl-nutri':'Nutrition','cl-chat':'Messages','cl-survey':'Évaluations'};
return `<div class="topbar"><span style="font-size:.8rem;font-weight:500">${ts[S.pg]||'Forge'}</span><button class="bic">${ic.bell}</button></div>`;
}

// ===== PAGE ROUTER =====
function pgRoute(isC){
const p=S.pg;
if(p==='exercises')return pgExercises();if(p==='timer')return pgTimer();if(p==='settings')return pgSettings();
if(isC){switch(p){case'dashboard':return cDash();case'clients':return cClients();case'programs':return cPrograms();case'performance':return cPerf();case'calories':return cCalories();case'nutrition':return cNutrition();case'calendar':return cCalendar();case'chat':return cChat();case'survey':return cSurvey();case'qrcode':return cQR();case'stats':return cStats();default:return cDash();}}
else{switch(p){case'cl-dash':return clDash();case'cl-cal':return clCal();case'cl-prog':return clProg();case'cl-kcal':return clKcal();case'cl-nutri':return cNutrition();case'cl-chat':return clChat();case'cl-survey':return clSurvey();default:return clDash();}}
}

// ===== COACH: DASHBOARD =====
function cDash(){
const cl=S.clients,se=S.sessions,sv=S.surveys;
const active=cl.filter(c=>c.active).length;
const avg=sv.length?(sv.reduce((a,s)=>a+(s.global_rating||0),0)/sv.length).toFixed(1):'—';
const today=new Date().toISOString().split('T')[0];
const tse=se.filter(s=>s.date===today);
return `<div class="pills"><div class="pill"><div class="pill-v" style="color:var(--ac)">${active}</div><div class="pill-l">Clients actifs</div></div><div class="pill"><div class="pill-v" style="color:var(--blu)">${S.programs.length}</div><div class="pill-l">Programmes</div></div><div class="pill"><div class="pill-v" style="color:var(--grn)">${avg}</div><div class="pill-l">Note moy.</div></div><div class="pill"><div class="pill-v" style="color:var(--org)">${se.filter(s=>s.status==='upcoming').length}</div><div class="pill-l">Séances à venir</div></div></div>
<div class="g2"><div class="card"><div class="card-h"><h3>Séances du jour</h3><span class="badge ba">${today.slice(5)}</span></div><div class="card-b">${tse.length?tse.map(s=>{const c=cl.find(x=>x.id===s.client_id);return `<div class="sess up"><div style="display:flex;justify-content:space-between;align-items:center"><div style="display:flex;align-items:center;gap:7px"><div class="av av-s" style="background:${c?.color||'var(--t4)'};color:#000">${c?IN(c.first_name,c.last_name):'?'}</div><strong style="font-size:.82rem">${c?c.first_name+' '+c.last_name:'—'}</strong></div><span style="font-family:var(--fm);font-size:.72rem;color:var(--ac)">${s.time||''}</span></div><div style="margin-top:5px"><span class="badge bo">${s.type||''}</span>${s.status==='upcoming'?` <button class="b bg bsm" onclick="complSess(${s.id})">Valider ✓</button>`:' <span class="badge bgr">Fait</span>'}</div></div>`;}).join(''):'<div style="text-align:center;padding:16px;color:var(--t4)">Aucune séance aujourd\'hui</div>'}</div></div>
<div class="card"><div class="card-h"><h3>Clients</h3><button class="b bs bsm" onclick="S.pg='clients';R()">Tous</button></div><div class="card-b">${cl.slice(0,5).map(c=>`<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid rgba(255,255,255,.03);cursor:pointer" onclick="openClient(${c.id})"><div class="av av-s" style="background:${c.color||'var(--ac)'};color:#000">${IN(c.first_name,c.last_name)}</div><div style="flex:1"><div style="font-size:.78rem;font-weight:600">${c.first_name} ${c.last_name}</div><div style="font-size:.65rem;color:var(--t4)">${c.goal||''}</div></div><span class="badge ${c.active?'bgr':'bo'}" style="font-size:.5rem">${c.active?'Actif':'—'}</span></div>`).join('')}${!cl.length?'<div style="text-align:center;padding:14px;color:var(--t4)"><a onclick="openAddClient()">+ Ajouter un client</a></div>':''}</div></div></div>`;
}
async function complSess(id){await sb.from('sessions').update({status:'done'}).eq('id',id);await loadSessions();toast('Séance validée !');R();}

// ===== COACH: CLIENTS =====
function cClients(){
return `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><h2 style="font-family:var(--fs);font-style:italic;font-size:1.6rem">Clients</h2><button class="b bp" onclick="openAddClient()">${ic.plus} Nouveau</button></div>
<div class="card"><div style="overflow-x:auto"><table><thead><tr><th>Client</th><th>Objectif</th><th>Niveau</th><th>Poids</th><th>Coaching</th><th>Statut</th></tr></thead><tbody>${S.clients.map(c=>`<tr onclick="openClient(${c.id})"><td><div style="display:flex;align-items:center;gap:7px"><div class="av av-s" style="background:${c.color||'var(--ac)'};color:#000">${IN(c.first_name,c.last_name)}</div><strong>${c.first_name} ${c.last_name}</strong></div></td><td>${c.goal||'—'}</td><td><span class="badge bo">${c.level||'—'}</span></td><td style="font-family:var(--fm)">${c.weight?c.weight+'kg':'—'}</td><td style="font-size:.68rem;color:var(--t3)">${fmtD(c.coach_start)} → ${fmtD(c.coach_end)}</td><td><span class="badge ${c.active?'bgr':'bo'}">${c.active?'Actif':'Inactif'}</span></td></tr>`).join('')}${!S.clients.length?'<tr><td colspan="6" style="text-align:center;color:var(--t4);padding:24px">Aucun client</td></tr>':''}</tbody></table></div></div>`;
}
function openAddClient(){
S.modal={title:'Nouveau client',w:true,content:`
<div class="g2"><div class="fg"><label class="lb">Prénom</label><input id="aF"></div><div class="fg"><label class="lb">Nom</label><input id="aL"></div></div>
<div class="g2"><div class="fg"><label class="lb">Email</label><input id="aE"></div><div class="fg"><label class="lb">Téléphone</label><input id="aPh"></div></div>
<div class="g3"><div class="fg"><label class="lb">Âge</label><input id="aA" type="number"></div><div class="fg"><label class="lb">Poids (kg)</label><input id="aW" type="number"></div><div class="fg"><label class="lb">Taille (cm)</label><input id="aH" type="number"></div></div>
<div class="g2"><div class="fg"><label class="lb">Objectif</label><select id="aG"><option>Prise de masse</option><option>Perte de poids</option><option>Remise en forme</option><option>Performance</option></select></div><div class="fg"><label class="lb">Niveau</label><select id="aLv"><option>Débutant</option><option>Intermédiaire</option><option>Avancé</option></select></div></div>
<div class="g2"><div class="fg"><label class="lb">Genre</label><select id="aGn"><option value="male">Homme</option><option value="female">Femme</option></select></div><div class="fg"><label class="lb">Activité</label><select id="aAc"><option value="sedentary">Sédentaire</option><option value="light">Léger</option><option value="moderate" selected>Modéré</option><option value="active">Actif</option><option value="extreme">Très actif</option></select></div></div>
<div class="g2"><div class="fg"><label class="lb">Début coaching</label><input id="aCS" type="date"></div><div class="fg"><label class="lb">Fin coaching</label><input id="aCE" type="date"></div></div>
<div class="fg"><label class="lb">⚠️ Blessures</label><textarea id="aInj"></textarea></div>
<div class="fg"><label class="lb">🏥 Médical</label><textarea id="aMed"></textarea></div>
`,onSave:async()=>{
const f=document.getElementById('aF')?.value,l=document.getElementById('aL')?.value;
if(!f||!l){toast('Nom requis','err');return;}
const cols=['#c8ff00','#3b82f6','#22c55e','#a855f7','#f59e0b','#ef4444','#06b6d4'];
const{error}=await sb.from('clients').insert({coach_id:S.user.id,first_name:f,last_name:l,email:document.getElementById('aE')?.value,phone:document.getElementById('aPh')?.value,age:+document.getElementById('aA')?.value||null,weight:+document.getElementById('aW')?.value||null,height:+document.getElementById('aH')?.value||null,goal:document.getElementById('aG')?.value,level:document.getElementById('aLv')?.value,gender:document.getElementById('aGn')?.value,activity:document.getElementById('aAc')?.value,coach_start:document.getElementById('aCS')?.value||null,coach_end:document.getElementById('aCE')?.value||null,injuries:document.getElementById('aInj')?.value,medical:document.getElementById('aMed')?.value||'RAS',color:cols[Math.floor(Math.random()*cols.length)]});
if(error){toast(error.message,'err');return;}
S.modal=null;await loadClients();toast('Client ajouté !');R();
}};R();
}
function openClient(id){
const c=S.clients.find(x=>x.id===id);if(!c)return;
S.modal={title:c.first_name+' '+c.last_name,w:true,ns:true,content:`
<div style="display:flex;gap:14px;align-items:flex-start;margin-bottom:18px"><div class="av av-l" style="background:${c.color||'var(--ac)'};color:#000">${IN(c.first_name,c.last_name)}</div><div><div style="font-size:1.05rem;font-weight:700">${c.first_name} ${c.last_name}</div><div style="color:var(--t3);font-size:.8rem">${c.email||''} · ${c.phone||''}</div><div style="display:flex;gap:5px;margin-top:5px"><span class="badge ${c.active?'bgr':'bo'}">${c.active?'Actif':'—'}</span><span class="badge bo">${c.level||''}</span><span class="badge bo">${c.goal||''}</span></div></div></div>
<div class="g4" style="margin-bottom:14px">${[['weight','kg','Poids'],['height','cm','Taille'],['age','ans','Âge']].map(([k,u,l])=>`<div style="background:var(--bg3);padding:12px;border-radius:var(--r2);text-align:center"><div style="font-family:var(--fs);font-style:italic;font-size:1.4rem">${c[k]||'—'}<span style="font-size:.6rem;color:var(--t4)">${c[k]?u:''}</span></div><div class="lb" style="margin:3px 0 0">${l}</div></div>`).join('')}<div style="background:var(--bg3);padding:12px;border-radius:var(--r2);text-align:center"><div style="font-family:var(--fs);font-style:italic;font-size:1.4rem">${c.gender==='male'?'H':'F'}</div><div class="lb" style="margin:3px 0 0">Genre</div></div></div>
<div class="g2" style="margin-bottom:12px"><div style="background:var(--bg3);padding:12px;border-radius:var(--r2)"><div class="lb">📅 Coaching</div><div style="font-size:.82rem">${fmtD(c.coach_start)} → ${fmtD(c.coach_end)}</div></div><div style="background:var(--bg3);padding:12px;border-radius:var(--r2)"><div class="lb">💬 Chat</div><div style="font-size:.82rem"><a onclick="S.modal=null;S.chatTarget=${c.id};S.pg='chat';R()">Ouvrir →</a></div></div></div>
${c.injuries||c.medical&&c.medical!=='RAS'?`<div style="background:rgba(245,158,11,.05);border:1px solid rgba(245,158,11,.12);border-radius:var(--r2);padding:12px;margin-bottom:12px"><div style="font-size:.75rem;font-weight:700;color:var(--org);margin-bottom:4px">⚠️ BLESSURES & MÉDICAL</div>${c.injuries?`<div style="font-size:.8rem;margin-bottom:3px"><strong>Blessures:</strong> ${c.injuries}</div>`:''}${c.medical&&c.medical!=='RAS'?`<div style="font-size:.8rem"><strong>Médical:</strong> ${c.medical}</div>`:''}</div>`:''}
<div style="margin-bottom:12px"><div class="lb">📸 Photos avant / après</div><div class="ph-grid"><div class="ph-slot">📷 Avant F</div><div class="ph-slot">📷 Avant D</div><div class="ph-slot">📷 Après F</div><div class="ph-slot">📷 Après D</div></div></div>
<div style="display:flex;gap:6px;margin-top:14px"><button class="b bd bsm" onclick="delClient(${c.id})">${ic.trash} Supprimer</button></div>
`};R();
}
async function delClient(id){if(!confirm('Supprimer ce client ?'))return;await sb.from('clients').delete().eq('id',id);S.modal=null;await loadClients();toast('Client supprimé','inf');R();}

// ===== CHAT =====
function cChat(){
const cl=S.clients,tid=S.chatTarget||cl[0]?.id,tc=cl.find(x=>x.id===tid);
return `<div class="chat-wrap"><div class="chat-list"><div style="padding:6px 8px;font-size:.55rem;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:var(--t4)">Conversations</div>${cl.map(c=>`<div style="display:flex;align-items:center;gap:8px;padding:7px 9px;border-radius:var(--r2);cursor:pointer;${c.id===tid?'background:var(--acg);':''}margin-bottom:1px" onclick="S.chatTarget=${c.id};R()"><div class="av av-s" style="background:${c.color||'var(--ac)'};color:#000">${IN(c.first_name,c.last_name)}</div><div style="font-size:.78rem;font-weight:600;${c.id===tid?'color:var(--ac)':''}">${c.first_name}</div></div>`).join('')}</div>
<div class="chat-main"><div class="chat-head">${tc?`<div class="av av-s" style="background:${tc.color||'var(--ac)'};color:#000">${IN(tc.first_name,tc.last_name)}</div><strong style="font-size:.85rem">${tc.first_name} ${tc.last_name}</strong>`:''}</div>
<div class="chat-msgs" id="chatMsgs"><div class="loading" style="min-height:auto;padding:20px">Chargement...</div></div>
<div class="chat-in"><input placeholder="Écrire..." id="chatInput" onkeydown="if(event.key==='Enter')sendMsg('coach')"><button class="bic" onclick="sendVoice('coach')">${ic.mic}</button><button class="bic" style="background:var(--ac);color:#000" onclick="sendMsg('coach')">${ic.send}</button></div></div></div>`;
}
function clChat(){
const mc=S.clients[0];if(!mc)return '<div style="padding:30px;text-align:center;color:var(--t4)">Pas encore lié à un coach.</div>';
return `<div class="chat-wrap"><div class="chat-main" style="width:100%"><div class="chat-head"><div class="av av-s" style="background:var(--ac);color:#000">C</div><strong style="font-size:.85rem">Mon Coach</strong></div>
<div class="chat-msgs" id="chatMsgs"><div class="loading" style="min-height:auto;padding:20px">Chargement...</div></div>
<div class="chat-in"><input placeholder="Écrire..." id="chatInput" onkeydown="if(event.key==='Enter')sendMsg('client')"><button class="bic" onclick="sendVoice('client')">${ic.mic}</button><button class="bic" style="background:var(--ac);color:#000" onclick="sendMsg('client')">${ic.send}</button></div></div></div>`;
}
async function refreshChat(){
const cid=S.profile?.role==='coach'?(S.chatTarget||S.clients[0]?.id):S.clients[0]?.id;
if(!cid)return;
const msgs=await loadMsgs(cid);
const el=document.getElementById('chatMsgs');if(!el)return;
const me=S.profile?.role==='coach'?'coach':'client';
el.innerHTML=msgs.map(m=>`<div class="msg ${m.sender===me?'msg-out':'msg-in'}">${m.is_voice?`<div class="msg-voice"><span>▶</span><div class="msg-voice-bars">${Array(18).fill(0).map(()=>`<span style="height:${3+Math.random()*14}px"></span>`).join('')}</div><span style="font-size:.6rem;opacity:.5">${m.voice_duration||'0:03'}</span></div>`:`${m.content}<div class="msg-t">${fmtT(m.created_at)}</div>`}</div>`).join('')||'<div style="text-align:center;padding:30px;color:var(--t4)">Aucun message</div>';
el.scrollTop=el.scrollHeight;
}
async function sendMsg(sender){
const input=document.getElementById('chatInput');if(!input||!input.value.trim())return;
const cid=sender==='coach'?(S.chatTarget||S.clients[0]?.id):S.clients[0]?.id;
const coachId=sender==='coach'?S.user.id:S.clients[0]?.coach_id;
if(!cid||!coachId)return;
await sb.from('messages').insert({coach_id:coachId,client_id:cid,sender,content:input.value.trim()});
input.value='';refreshChat();
}
async function sendVoice(sender){
const cid=sender==='coach'?(S.chatTarget||S.clients[0]?.id):S.clients[0]?.id;
const coachId=sender==='coach'?S.user.id:S.clients[0]?.coach_id;
if(!cid||!coachId)return;
await sb.from('messages').insert({coach_id:coachId,client_id:cid,sender,is_voice:true,voice_duration:'0:03'});
toast('Note vocale !');refreshChat();
}

// ===== CALENDAR =====
function cCalendar(){
const se=S.sessions,cl=S.clients;const now=new Date(),y=now.getFullYear(),m=now.getMonth(),td=now.getDate();
const fd=new Date(y,m,1).getDay(),af=(fd+6)%7,dim=new Date(y,m+1,0).getDate();
const dn=['L','M','M','J','V','S','D'],mn=['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const cells=[];for(let i=0;i<af;i++)cells.push({d:0});
for(let i=1;i<=dim;i++){const ds=`${y}-${String(m+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;cells.push({d:i,today:i===td,ss:se.filter(s=>s.date===ds)});}
while(cells.length%7)cells.push({d:0});
return `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><h2 style="font-family:var(--fs);font-style:italic;font-size:1.6rem">${mn[m]} ${y}</h2><button class="b bp" onclick="openAddSess()">${ic.plus} Séance</button></div>
<div class="card" style="margin-bottom:12px"><div class="card-b"><div class="cal">${dn.map(d=>`<div class="cal-hd">${d}</div>`).join('')}${cells.map(c=>!c.d?'<div class="cal-d oth"></div>':`<div class="cal-d ${c.today?'today':''} ${c.ss?.length?'has':''}">${c.d}</div>`).join('')}</div></div></div>
<div class="card"><div class="card-h"><h3>Séances à venir</h3></div><div style="overflow-x:auto"><table><thead><tr><th>Date</th><th>Heure</th><th>Client</th><th>Type</th><th></th></tr></thead><tbody>${se.filter(s=>s.status==='upcoming').map(s=>{const c=cl.find(x=>x.id===s.client_id);return `<tr><td style="font-family:var(--fm)">${s.date}</td><td style="font-family:var(--fm)">${s.time||''}</td><td>${c?c.first_name+' '+c.last_name:'—'}</td><td><span class="badge bo">${s.type||''}</span></td><td><button class="b bg bsm" onclick="complSess(${s.id})">✓</button></td></tr>`;}).join('')||'<tr><td colspan="5" style="text-align:center;color:var(--t4);padding:16px">Aucune</td></tr>'}</tbody></table></div></div>`;
}
function openAddSess(){
const cl=S.clients.filter(c=>c.active);
S.modal={title:'Nouvelle séance',content:`<div class="fg"><label class="lb">Client</label><select id="sC">${cl.map(c=>`<option value="${c.id}">${c.first_name} ${c.last_name}</option>`).join('')}</select></div><div class="g2"><div class="fg"><label class="lb">Date</label><input id="sD" type="date" value="${new Date().toISOString().split('T')[0]}"></div><div class="fg"><label class="lb">Heure</label><input id="sT" value="09:00"></div></div><div class="fg"><label class="lb">Type</label><input id="sType" placeholder="Push, HIIT..."></div>`,
onSave:async()=>{const{error}=await sb.from('sessions').insert({coach_id:S.user.id,client_id:+document.getElementById('sC')?.value,date:document.getElementById('sD')?.value,time:document.getElementById('sT')?.value,type:document.getElementById('sType')?.value||'Séance'});if(error){toast(error.message,'err');return;}S.modal=null;await loadSessions();toast('Séance ajoutée !');R();}};R();
}

// ===== PROGRAMS, PERF, NUTRITION, SURVEY, QR, STATS, CALORIES =====
function cPrograms(){return `<div style="margin-bottom:16px"><h2 style="font-family:var(--fs);font-style:italic;font-size:1.6rem">Programmes</h2><p style="color:var(--t3);font-size:.8rem">${S.programs.length} programme(s)</p></div>${S.programs.map(p=>`<div class="card"><div class="card-b"><strong>${p.name}</strong><div style="color:var(--t3);font-size:.78rem;margin-top:3px">${p.description||''}</div><div style="display:flex;gap:4px;margin-top:6px"><span class="badge bo">${p.level||''}</span><span class="badge bo">${p.type||''}</span><span class="badge bo">${p.duration||''}</span></div></div></div>`).join('')||'<div style="color:var(--t4);text-align:center;padding:30px">Aucun programme. Créez-en un depuis la gestion client.</div>'}`;}
function cPerf(){return `<div style="margin-bottom:16px"><h2 style="font-family:var(--fs);font-style:italic;font-size:1.6rem">Performances</h2></div><div class="card"><div class="card-b"><p style="color:var(--t3);font-size:.82rem">Sélectionnez un client pour voir ses performances. Section en développement — les données sont stockées en base.</p></div></div>`;}
function cNutrition(){return `<div style="margin-bottom:16px"><h2 style="font-family:var(--fs);font-style:italic;font-size:1.6rem">Nutrition</h2><p style="color:var(--t3);font-size:.8rem">${S.foods.length} aliment(s) en base</p></div><button class="b bp" style="margin-bottom:12px" onclick="openAddFood()">+ Aliment</button><div class="card"><div class="card-b" id="foodGrid">${S.foods.map(f=>`<div class="food-i"><div class="food-n">${f.name}</div><div class="food-m"><span style="color:var(--t2)">${f.calories||0}kcal</span><span style="color:var(--ac)">P:${f.protein||0}g</span><span style="color:var(--org)">G:${f.carbs||0}g</span><span style="color:var(--red)">L:${f.fat||0}g</span></div></div>`).join('')||'<div style="color:var(--t4);text-align:center;padding:14px">Aucun aliment. Ajoutez-en !</div>'}</div></div>`;}
function openAddFood(){S.modal={title:'Ajouter un aliment',content:`<div class="fg"><label class="lb">Nom</label><input id="fN" placeholder="Blanc de poulet (100g)"></div><div class="g4"><div class="fg"><label class="lb">Calories</label><input id="fCal" type="number"></div><div class="fg"><label class="lb">Prot (g)</label><input id="fP" type="number"></div><div class="fg"><label class="lb">Gluc (g)</label><input id="fC" type="number"></div><div class="fg"><label class="lb">Lip (g)</label><input id="fF" type="number"></div></div>`,onSave:async()=>{const n=document.getElementById('fN')?.value;if(!n){toast('Nom requis','err');return;}const{error}=await sb.from('foods').insert({coach_id:S.user.id,name:n,calories:+document.getElementById('fCal')?.value||0,protein:+document.getElementById('fP')?.value||0,carbs:+document.getElementById('fC')?.value||0,fat:+document.getElementById('fF')?.value||0});if(error){toast(error.message,'err');return;}S.modal=null;await loadFoods();toast('Aliment ajouté !');R();}};R();}
function cSurvey(){const sv=S.surveys;const avg=sv.length?(sv.reduce((a,s)=>a+(s.global_rating||0),0)/sv.length).toFixed(1):0;return `<div style="margin-bottom:16px"><h2 style="font-family:var(--fs);font-style:italic;font-size:1.6rem">Satisfaction</h2></div><div class="pills"><div class="pill"><div class="pill-v" style="color:var(--ac)">${avg}/5</div><div class="pill-l">Note moy.</div></div><div class="pill"><div class="pill-v" style="color:var(--grn)">${sv.length}</div><div class="pill-l">Réponses</div></div></div><div class="card"><div class="card-b">${sv.map(s=>{const c=S.clients.find(x=>x.id===s.client_id);return `<div style="background:var(--bg3);padding:12px;border-radius:var(--r2);border-left:3px solid ${(s.global_rating||0)>=4?'var(--grn)':'var(--org)'};margin-bottom:6px"><div style="display:flex;justify-content:space-between;margin-bottom:3px"><strong style="font-size:.82rem">${c?c.first_name+' '+c.last_name:'—'}</strong><span style="color:var(--ac)">${'★'.repeat(s.global_rating||0)}${'☆'.repeat(5-(s.global_rating||0))}</span></div>${s.comments?`<p style="font-size:.75rem;color:var(--t2)">"${s.comments}"</p>`:''}</div>`;}).join('')||'<div style="color:var(--t4);text-align:center;padding:16px">Aucun questionnaire</div>'}</div></div>`;}
function cQR(){return `<div style="margin-bottom:16px"><h2 style="font-family:var(--fs);font-style:italic;font-size:1.6rem">QR Codes</h2></div><div class="qr-grid">${S.clients.filter(c=>c.active).map(c=>`<div class="qr-card"><div class="av av-m" style="background:${c.color||'var(--ac)'};color:#000;margin:0 auto 6px">${IN(c.first_name,c.last_name)}</div><div style="font-weight:700">${c.first_name} ${c.last_name}</div><div style="font-size:.7rem;color:var(--t3);margin-top:2px">${c.goal||''}</div><button class="b bg bsm" style="margin-top:10px" onclick="navigator.clipboard?.writeText('https://forge-coaching.github.io?client=${c.id}');toast('Lien copié !')">📋 Copier le lien</button></div>`).join('')||'<div style="color:var(--t4);text-align:center;padding:30px">Aucun client actif</div>'}</div>`;}
function cStats(){return `<div style="margin-bottom:16px"><h2 style="font-family:var(--fs);font-style:italic;font-size:1.6rem">Statistiques</h2></div><div class="pills"><div class="pill"><div class="pill-v" style="color:var(--ac)">${S.clients.filter(c=>c.active).length}</div><div class="pill-l">Clients actifs</div></div><div class="pill"><div class="pill-v" style="color:var(--blu)">${S.sessions.length}</div><div class="pill-l">Séances total</div></div><div class="pill"><div class="pill-v" style="color:var(--grn)">${S.sessions.filter(s=>s.status==='done').length}</div><div class="pill-l">Terminées</div></div><div class="pill"><div class="pill-v" style="color:var(--org)">${S.surveys.length}</div><div class="pill-l">Questionnaires</div></div></div>`;}
function cCalories(){
return `<div style="margin-bottom:16px"><h2 style="font-family:var(--fs);font-style:italic;font-size:1.6rem">Calculateur métabolique</h2><p style="color:var(--t3);font-size:.8rem">Mifflin-St Jeor · ⚠️ Estimation uniquement</p></div>
<div class="card"><div class="card-b"><p style="color:var(--t2);font-size:.82rem">Sélectionnez un client pour calculer ses besoins caloriques personnalisés. Les données sont tirées de sa fiche (poids, taille, âge, activité, objectif).</p>
<div class="fg" style="margin-top:14px"><label class="lb">Client</label><select id="calCl" onchange="calcKcal()"><option value="">Choisir...</option>${S.clients.map(c=>`<option value="${c.id}">${c.first_name} ${c.last_name}</option>`).join('')}</select></div>
<div id="calResult"></div></div></div>`;
}

// ===== CLIENT PAGES =====
function clDash(){
const c=S.clients[0];if(!c)return '<div style="padding:30px;text-align:center;color:var(--t3)">Votre coach ne vous a pas encore ajouté.</div>';
const se=S.sessions;
return `<div style="margin-bottom:16px"><h2 style="font-family:var(--fs);font-style:italic;font-size:1.8rem">Bonjour ${c.first_name} 👋</h2></div>
${c.medical&&c.medical!=='RAS'?`<div style="background:rgba(245,158,11,.05);border:1px solid rgba(245,158,11,.1);border-radius:var(--r2);padding:10px;margin-bottom:12px;font-size:.8rem"><strong style="color:var(--org)">⚠️</strong> ${c.medical}</div>`:''}
<div class="pills"><div class="pill"><div class="pill-v" style="color:var(--ac)">${c.weight?c.weight+'kg':'—'}</div><div class="pill-l">Poids</div></div><div class="pill"><div class="pill-v" style="color:var(--grn)">${se.filter(s=>s.status==='done').length}</div><div class="pill-l">Terminées</div></div><div class="pill"><div class="pill-v" style="color:var(--blu)">${se.filter(s=>s.status==='upcoming').length}</div><div class="pill-l">À venir</div></div></div>
<div class="card"><div class="card-h"><h3>Prochaines séances</h3></div><div class="card-b">${se.filter(s=>s.status==='upcoming').slice(0,3).map(s=>`<div class="sess up"><div style="display:flex;justify-content:space-between"><strong>${s.type||'Séance'}</strong><span style="font-family:var(--fm);font-size:.75rem;color:var(--ac)">${s.date} ${s.time||''}</span></div></div>`).join('')||'<div style="color:var(--t4);text-align:center;padding:12px">Aucune</div>'}</div></div>`;
}
function clCal(){const se=S.sessions;return `<div style="margin-bottom:16px"><h2 style="font-family:var(--fs);font-style:italic;font-size:1.6rem">Mes séances</h2></div><div class="g2">${[['Terminées','done','bgr'],['À venir','upcoming','ba']].map(([t,st,bc])=>`<div class="card"><div class="card-h"><h3>${t}</h3><span class="badge ${bc}">${se.filter(s=>s.status===st).length}</span></div><div class="card-b">${se.filter(s=>s.status===st).map(s=>`<div class="sess ${st==='done'?'dn':'up'}"><strong>${s.type||''}</strong> <span style="font-family:var(--fm);font-size:.7rem">${s.date} ${s.time||''}</span></div>`).join('')||'<div style="color:var(--t4);text-align:center;padding:10px">—</div>'}</div></div>`).join('')}</div>`;}
function clProg(){return `<div style="margin-bottom:16px"><h2 style="font-family:var(--fs);font-style:italic;font-size:1.6rem">Mon programme</h2></div>${S.programs.length?S.programs.map(p=>`<div class="card"><div class="card-b"><strong>${p.name}</strong><p style="color:var(--t3);font-size:.8rem;margin-top:3px">${p.description||''}</p></div></div>`).join(''):'<div style="color:var(--t4);text-align:center;padding:30px">Aucun programme assigné</div>'}`;}
function clKcal(){const c=S.clients[0];if(!c)return '';const bmr=c.gender==='male'?10*(c.weight||70)+6.25*(c.height||175)-5*(c.age||30)+5:10*(c.weight||60)+6.25*(c.height||165)-5*(c.age||30)-161;const mult={sedentary:1.2,light:1.375,moderate:1.55,active:1.725,extreme:1.9};let tdee=Math.round(bmr*(mult[c.activity]||1.55));let t=tdee;if(c.goal==='Perte de poids')t=tdee-500;else if(c.goal==='Prise de masse')t=tdee+350;t=Math.max(t,1200);return `<div style="margin-bottom:16px"><h2 style="font-family:var(--fs);font-style:italic;font-size:1.6rem">Mes objectifs</h2><p style="color:var(--t3);font-size:.78rem">⚠️ Estimation Mifflin-St Jeor</p></div><div style="background:linear-gradient(135deg,var(--s),var(--bg3));border:1px solid rgba(200,255,0,.08);border-radius:18px;padding:24px;text-align:center;max-width:350px"><div style="font-family:var(--fs);font-style:italic;font-size:2.8rem;color:var(--ac);line-height:1">${t}</div><div style="font-size:.6rem;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:var(--t3);margin-top:3px">Kcal/jour · ${c.goal||'Maintien'}</div></div>`;}
function clSurvey(){return `<div style="margin-bottom:16px"><h2 style="font-family:var(--fs);font-style:italic;font-size:1.6rem">Évaluations</h2></div>${S.surveys.map(s=>`<div class="card"><div class="card-b"><span style="color:var(--ac)">${'★'.repeat(s.global_rating||0)}${'☆'.repeat(5-(s.global_rating||0))}</span> <span style="font-size:.7rem;color:var(--t4)">${s.date||''}</span>${s.comments?`<p style="font-size:.8rem;color:var(--t2);margin-top:3px">"${s.comments}"</p>`:''}</div></div>`).join('')||'<div style="color:var(--t4);text-align:center;padding:30px">Aucune</div>'}`;}

// ===== CALORIES CALCULATOR =====
function calcKcal(){
const id=+document.getElementById('calCl')?.value;if(!id){document.getElementById('calResult').innerHTML='';return;}
const c=S.clients.find(x=>x.id===id);if(!c)return;
const bmr=c.gender==='male'?10*(c.weight||70)+6.25*(c.height||175)-5*(c.age||30)+5:10*(c.weight||60)+6.25*(c.height||165)-5*(c.age||30)-161;
const mult={sedentary:1.2,light:1.375,moderate:1.55,active:1.725,extreme:1.9};
const tdee=Math.round(bmr*(mult[c.activity]||1.55));
let t=tdee,gl=c.goal||'Maintien',adj=0,pm=1.8;
if(gl==='Prise de masse'){adj=350;pm=2.2;}else if(gl==='Perte de poids'){adj=-500;pm=2.4;}else if(gl==='Performance'){adj=200;pm=2;}
t=Math.max(tdee+adj,1200);
const prot=Math.round((c.weight||70)*pm),fat=Math.round(t*.25/9),carbs=Math.round((t-prot*4-fat*9)/4);
document.getElementById('calResult').innerHTML=`
<div style="margin-top:16px;background:linear-gradient(135deg,var(--s),var(--bg3));border:1px solid rgba(200,255,0,.08);border-radius:18px;padding:24px;text-align:center"><div style="font-family:var(--fs);font-style:italic;font-size:3rem;color:var(--ac);line-height:1">${t}</div><div style="font-size:.6rem;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:var(--t3);margin-top:4px">Kcal/jour · ${gl} (${adj>0?'+':''}${adj})</div></div>
<div class="g3" style="margin-top:14px;text-align:center">${[[prot,'var(--ac)','Prot ('+pm+'g/kg)'],[carbs,'var(--org)','Glucides'],[fat,'var(--red)','Lipides']].map(([v,col,l])=>`<div style="background:var(--bg3);padding:10px;border-radius:var(--r2)"><div style="font-family:var(--fs);font-style:italic;font-size:1.3rem;color:${col}">${v}g</div><div class="lb" style="margin:2px 0 0">${l}</div></div>`).join('')}</div>
<div style="margin-top:12px;font-size:.75rem;color:var(--t3)">BMR: ${Math.round(bmr)} kcal · TDEE: ${tdee} kcal · IMC: ${(c.weight/((c.height/100)**2)).toFixed(1)}</div>`;
}

// ===== EXERCISES =====
const EX=[
{n:'Squat barre',m:'Quadriceps',s:'Fessiers, Lombaires',cat:'Force',type:'Poly',diff:3,eq:'Barre',url:'https://www.youtube.com/results?search_query=squat+barre',hl:['quads','glutes']},
{n:'Soulevé de terre',m:'Dos',s:'Ischio-jambiers',cat:'Force',type:'Poly',diff:4,eq:'Barre',url:'https://www.youtube.com/results?search_query=soulevé+de+terre',hl:['back','hamstrings']},
{n:'Développé couché',m:'Pectoraux',s:'Triceps, Épaules',cat:'Force',type:'Poly',diff:2,eq:'Barre+Banc',url:'https://www.youtube.com/results?search_query=développé+couché',hl:['chest','triceps','shoulders']},
{n:'Développé militaire',m:'Épaules',s:'Triceps',cat:'Force',type:'Poly',diff:3,eq:'Barre',url:'https://www.youtube.com/results?search_query=développé+militaire',hl:['shoulders','triceps']},
{n:'Rowing barre',m:'Dos',s:'Biceps',cat:'Force',type:'Poly',diff:3,eq:'Barre',url:'https://www.youtube.com/results?search_query=rowing+barre',hl:['back','biceps']},
{n:'Hip thrust',m:'Fessiers',s:'Ischio-jambiers',cat:'Force',type:'Poly',diff:2,eq:'Barre',url:'https://www.youtube.com/results?search_query=hip+thrust',hl:['glutes','hamstrings']},
{n:'Curl biceps',m:'Biceps',s:'Avant-bras',cat:'Hypertrophie',type:'Iso',diff:1,eq:'Barre EZ',url:'https://www.youtube.com/results?search_query=curl+biceps',hl:['biceps']},
{n:'Extensions triceps',m:'Triceps',s:'—',cat:'Hypertrophie',type:'Iso',diff:1,eq:'Poulie',url:'https://www.youtube.com/results?search_query=extension+triceps',hl:['triceps']},
{n:'Élévations latérales',m:'Épaules',s:'Trapèzes',cat:'Hypertrophie',type:'Iso',diff:1,eq:'Haltères',url:'https://www.youtube.com/results?search_query=élévations+latérales',hl:['shoulders']},
{n:'Tractions',m:'Dos',s:'Biceps',cat:'Hypertrophie',type:'Poly',diff:3,eq:'Barre fixe',url:'https://www.youtube.com/results?search_query=tractions',hl:['back','biceps']},
{n:'Dips',m:'Pectoraux',s:'Triceps',cat:'Hypertrophie',type:'Poly',diff:2,eq:'Barres',url:'https://www.youtube.com/results?search_query=dips',hl:['chest','triceps']},
{n:'Leg extension',m:'Quadriceps',s:'—',cat:'Hypertrophie',type:'Iso',diff:1,eq:'Machine',url:'https://www.youtube.com/results?search_query=leg+extension',hl:['quads']},
{n:'Leg curl',m:'Ischio-jambiers',s:'—',cat:'Hypertrophie',type:'Iso',diff:1,eq:'Machine',url:'https://www.youtube.com/results?search_query=leg+curl',hl:['hamstrings']},
{n:'Clean & Jerk',m:'Full body',s:'Épaules, Quadriceps',cat:'CrossFit',type:'Poly',diff:5,eq:'Barre olympique',url:'https://www.youtube.com/results?search_query=clean+and+jerk',hl:['quads','shoulders','back']},
{n:'Thrusters',m:'Full body',s:'Quadriceps, Épaules',cat:'CrossFit',type:'Poly',diff:3,eq:'Barre',url:'https://www.youtube.com/results?search_query=thruster',hl:['quads','shoulders']},
{n:'Burpees',m:'Full body',s:'Cardio',cat:'CrossFit',type:'Poly',diff:2,eq:'Aucun',url:'https://www.youtube.com/results?search_query=burpees',hl:['chest','quads','core']},
{n:'Kettlebell swing',m:'Ch. postérieure',s:'Core',cat:'CrossFit',type:'Poly',diff:2,eq:'Kettlebell',url:'https://www.youtube.com/results?search_query=kettlebell+swing',hl:['hamstrings','glutes','core']},
{n:'The Hundred',m:'Abdominaux',s:'—',cat:'Pilates',type:'Iso',diff:2,eq:'Tapis',url:'https://www.youtube.com/results?search_query=hundred+pilates',hl:['core']},
{n:'Teaser',m:'Core',s:'Quadriceps',cat:'Pilates',type:'Poly',diff:4,eq:'Tapis',url:'https://www.youtube.com/results?search_query=teaser+pilates',hl:['core','quads']},
{n:'Rameur',m:'Full body',s:'Dos, Jambes',cat:'Cardio',type:'Poly',diff:2,eq:'Rameur',url:'https://www.youtube.com/results?search_query=rameur+technique',hl:['back','quads']},
{n:'Mountain climbers',m:'Core',s:'Épaules',cat:'Cardio',type:'Poly',diff:2,eq:'Aucun',url:'https://www.youtube.com/results?search_query=mountain+climbers',hl:['core','shoulders']},
{n:'Corde à sauter',m:'Mollets',s:'Épaules',cat:'Cardio',type:'Poly',diff:1,eq:'Corde',url:'https://www.youtube.com/results?search_query=corde+à+sauter',hl:['calves','shoulders']},
];

function bodysvg(hl=[],w=52,h=68){
const s=new Set(hl);const mc=id=>s.has(id)?'0.55':'0';
const cl=id=>s.has(id)?({'chest':'var(--ac)','back':'#06b6d4','shoulders':'var(--blu)','biceps':'var(--pur)','triceps':'var(--org)','quads':'var(--ac)','hamstrings':'var(--org)','glutes':'var(--pur)','core':'var(--grn)','calves':'var(--blu)'}[id]||'var(--ac)'):'none';
return `<svg viewBox="0 0 100 160" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="16" rx="12" ry="14" fill="none" stroke="var(--t4)" stroke-width="1.2"/><path d="M38 28L36 32L30 36Q22 40 18 52L14 68L18 70L24 56L32 44L38 50L38 90L34 110L32 140L36 142L44 142L46 110L50 94L54 110L56 142L64 142L68 140L66 110L62 90L62 50L68 44L76 56L82 70L86 68L82 52Q78 40 70 36L64 32L62 28" fill="none" stroke="var(--t4)" stroke-width="1.2" stroke-linejoin="round"/><ellipse cx="42" cy="40" rx="7" ry="5" fill="${cl('chest')}" opacity="${mc('chest')}"/><ellipse cx="58" cy="40" rx="7" ry="5" fill="${cl('chest')}" opacity="${mc('chest')}"/><ellipse cx="30" cy="34" rx="5" ry="4" fill="${cl('shoulders')}" opacity="${mc('shoulders')}"/><ellipse cx="70" cy="34" rx="5" ry="4" fill="${cl('shoulders')}" opacity="${mc('shoulders')}"/><ellipse cx="24" cy="52" rx="3.5" ry="7" fill="${cl('biceps')}" opacity="${mc('biceps')}"/><ellipse cx="76" cy="52" rx="3.5" ry="7" fill="${cl('biceps')}" opacity="${mc('biceps')}"/><ellipse cx="20" cy="52" rx="2.5" ry="7" fill="${cl('triceps')}" opacity="${mc('triceps')}"/><ellipse cx="80" cy="52" rx="2.5" ry="7" fill="${cl('triceps')}" opacity="${mc('triceps')}"/><path d="M44 46Q50 44 56 46L56 56Q50 58 44 56Z" fill="${cl('core')}" opacity="${mc('core')}"/><ellipse cx="50" cy="42" rx="8" ry="6" fill="${cl('back')}" opacity="${mc('back')}"/><ellipse cx="42" cy="80" rx="6" ry="14" fill="${cl('quads')}" opacity="${mc('quads')}"/><ellipse cx="58" cy="80" rx="6" ry="14" fill="${cl('quads')}" opacity="${mc('quads')}"/><ellipse cx="37" cy="82" rx="4" ry="12" fill="${cl('hamstrings')}" opacity="${mc('hamstrings')}"/><ellipse cx="63" cy="82" rx="4" ry="12" fill="${cl('hamstrings')}" opacity="${mc('hamstrings')}"/><ellipse cx="44" cy="68" rx="8" ry="5" fill="${cl('glutes')}" opacity="${mc('glutes')}"/><ellipse cx="56" cy="68" rx="8" ry="5" fill="${cl('glutes')}" opacity="${mc('glutes')}"/><ellipse cx="40" cy="120" rx="3" ry="10" fill="${cl('calves')}" opacity="${mc('calves')}"/><ellipse cx="60" cy="120" rx="3" ry="10" fill="${cl('calves')}" opacity="${mc('calves')}"/></svg>`;
}
function ddots(n){return '<span style="color:var(--ac)">'+'●'.repeat(n)+'</span><span style="color:var(--bg5)">'+'●'.repeat(5-n)+'</span>';}

function pgExercises(){
const f=S.exFilter,cats=['Tous','Force','Hypertrophie','CrossFit','Pilates','Cardio'];
const list=f==='Tous'?EX:EX.filter(e=>e.cat===f);
return `<div style="margin-bottom:16px"><h2 style="font-family:var(--fs);font-style:italic;font-size:1.6rem">Bibliothèque</h2><p style="color:var(--t3);font-size:.8rem">${EX.length} exercices</p></div>
<div class="search-b"><input placeholder="Rechercher..." id="exSrch" oninput="filterEx()"></div>
<div class="exf-wrap">${cats.map(c=>`<div class="exf ${f===c?'on':''}" onclick="S.exFilter='${c}';R()">${c}</div>`).join('')}</div>
<div class="exg" id="exGrid">${exCards(list)}</div>`;
}
function exCards(list){return list.map(e=>`<div class="exc" onclick="window.open('${e.url}','_blank')"><div style="width:52px;height:68px;flex-shrink:0">${bodysvg(e.hl)}</div><div style="flex:1;min-width:0"><div style="font-weight:700;font-size:.85rem;margin-bottom:3px">${e.n}</div><div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:3px"><span class="badge ${e.cat==='Force'?'bor':e.cat==='Hypertrophie'?'ba':e.cat==='CrossFit'?'bre':e.cat==='Pilates'?'bpu':'bgr'}">${e.cat}</span><span class="badge ${e.type==='Poly'?'bbl':'bo'}">${e.type==='Poly'?'Polyarticulaire':'Isolation'}</span></div><div style="font-size:.72rem;color:var(--t3)"><strong style="color:var(--t2)">${e.m}</strong> · ${e.s}</div><div style="font-size:.65rem;margin-top:3px">Diff: ${ddots(e.diff)} · ${e.eq}</div></div></div>`).join('');}
function filterEx(){const q=(document.getElementById('exSrch')?.value||'').toLowerCase();const f=S.exFilter;const l=(f==='Tous'?EX:EX.filter(e=>e.cat===f)).filter(e=>!q||e.n.toLowerCase().includes(q)||e.m.toLowerCase().includes(q));const g=document.getElementById('exGrid');if(g)g.innerHTML=exCards(l);}

// ===== TIMER =====
let T={mode:'amrap',on:false,paused:false,sec:0,round:0,iv:null,cfg:{amrap:{min:12},fortime:{cap:20},emom:{min:10,iv:60},tabata:{rounds:8,work:20,rest:10}}};
const fmt=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
function pgTimer(){
let d='00:00',info='',cls='',pct=0;const c=T.cfg;
if(T.mode==='amrap'){const tot=c.amrap.min*60;d=T.on||T.paused?fmt(Math.max(tot-T.sec,0)):fmt(tot);pct=T.sec/tot*100;info=`Round: <strong>${T.round}</strong>`;if(T.sec>=tot&&T.on){cls='done';stopT();info+=' — TERMINÉ!';}}
else if(T.mode==='fortime'){const cap=c.fortime.cap*60;d=T.on||T.paused?fmt(T.sec):fmt(0);pct=T.sec/cap*100;info=`Cap: ${c.fortime.cap}min`;if(T.sec>=cap&&T.on){cls='done';stopT();info='TIME CAP!';}}
else if(T.mode==='emom'){const iv=c.emom.iv,tot=c.emom.min*60,cr=Math.floor(T.sec/iv)+1,sir=T.sec%iv;d=T.on||T.paused?fmt(iv-sir):fmt(iv);pct=sir/iv*100;info=`Round <strong>${Math.min(cr,c.emom.min)}</strong>/${c.emom.min}`;if(T.sec>=tot&&T.on){cls='done';stopT();info='TERMINÉ!';}}
else if(T.mode==='tabata'){const w=c.tabata.work,r=c.tabata.rest,cyc=w+r,cc=Math.floor(T.sec/cyc),sic=T.sec%cyc,isW=sic<w;d=T.on||T.paused?fmt(isW?w-sic:cyc-sic):fmt(w);cls=isW?'':'rest';pct=isW?sic/w*100:(sic-w)/r*100;info=`Rd <strong>${Math.min(cc+1,c.tabata.rounds)}</strong>/${c.tabata.rounds} · ${isW?'🔥WORK':'😮‍💨REST'}`;if(cc>=c.tabata.rounds&&T.on){cls='done';stopT();info='TERMINÉ!';}}
return `<div style="margin-bottom:16px"><h2 style="font-family:var(--fs);font-style:italic;font-size:1.6rem">Timer WOD</h2></div>
<div class="timer-modes">${[['amrap','🔁','AMRAP','Max rounds'],['fortime','⏱️','FOR TIME','Le + vite possible'],['emom','⏰','EMOM','Every Min on Min'],['tabata','🔥','TABATA','Work/Rest']].map(([id,i,n,dd])=>`<div class="tm ${T.mode===id?'on':''}" onclick="T.mode='${id}';resetT();R()"><div class="tm-i">${i}</div><div class="tm-n">${n}</div><div class="tm-d">${dd}</div></div>`).join('')}</div>
<div class="card" style="margin-bottom:10px"><div class="card-b" style="padding:8px 16px">${T.mode==='amrap'?`<div class="g2"><div class="fg"><label class="lb">Durée(min)</label><input type="number" value="${c.amrap.min}" onchange="T.cfg.amrap.min=+this.value" ${T.on?'disabled':''}></div><div style="display:flex;align-items:flex-end;padding-bottom:14px"><button class="b bs bsm" onclick="T.round++;R()" ${!T.on?'disabled':''}>+Round</button></div></div>`:T.mode==='fortime'?`<div class="fg"><label class="lb">Cap(min)</label><input type="number" value="${c.fortime.cap}" onchange="T.cfg.fortime.cap=+this.value" ${T.on?'disabled':''}></div>`:T.mode==='emom'?`<div class="g2"><div class="fg"><label class="lb">Min</label><input type="number" value="${c.emom.min}" onchange="T.cfg.emom.min=+this.value" ${T.on?'disabled':''}></div><div class="fg"><label class="lb">Intervalle(s)</label><input type="number" value="${c.emom.iv}" onchange="T.cfg.emom.iv=+this.value" ${T.on?'disabled':''}></div></div>`:`<div class="g3"><div class="fg"><label class="lb">Rounds</label><input type="number" value="${c.tabata.rounds}" onchange="T.cfg.tabata.rounds=+this.value" ${T.on?'disabled':''}></div><div class="fg"><label class="lb">Work(s)</label><input type="number" value="${c.tabata.work}" onchange="T.cfg.tabata.work=+this.value" ${T.on?'disabled':''}></div><div class="fg"><label class="lb">Rest(s)</label><input type="number" value="${c.tabata.rest}" onchange="T.cfg.tabata.rest=+this.value" ${T.on?'disabled':''}></div></div>`}</div></div>
<div class="card"><div class="card-b"><div class="timer-display ${cls}">${d}</div><div class="t-prog"><div class="t-prog-f" style="width:${pct}%;background:${cls==='rest'?'var(--org)':cls==='done'?'var(--grn)':'var(--ac)'}"></div></div><div style="text-align:center;font-size:.85rem;color:var(--t2);margin-top:8px">${info}</div><div class="t-ctrls">${!T.on&&!T.paused?`<button class="t-btn t-play" onclick="startT()">▶</button>`:''} ${T.on?`<button class="t-btn t-pause" onclick="pauseT()">⏸</button>`:''} ${T.paused?`<button class="t-btn t-play" onclick="resumeT()">▶</button>`:''} ${T.on||T.paused?`<button class="t-btn t-stop" onclick="resetT()">■</button>`:''}</div></div></div>`;
}
function tick(){T.sec++;const m=T.mode,c=T.cfg;
if(m==='tabata'){const w=c.tabata.work,r=c.tabata.rest,cyc=w+r,sic=T.sec%cyc,isW=sic<w;if(isW&&(w-sic)<=5&&(w-sic)>0)beepS();if(!isW&&(cyc-sic)<=5&&(cyc-sic)>0)beepS();if(sic===0||sic===w)beepL();}
if(m==='emom'){const iv=c.emom.iv,sir=T.sec%iv;if(sir===0)beepL();else if((iv-sir)<=5)beepS();}
if(m==='amrap'){const l=c.amrap.min*60-T.sec;if(l<=5&&l>0)beepS();if(l===0)beepL();}
if(m==='fortime'){const l=c.fortime.cap*60-T.sec;if(l<=5&&l>0)beepS();if(l===0)beepL();}R();}
function startT(){T.on=true;T.paused=false;T.sec=0;T.round=0;T.iv=setInterval(tick,1e3);beepL();R();}
function pauseT(){clearInterval(T.iv);T.on=false;T.paused=true;R();}
function resumeT(){T.on=true;T.paused=false;T.iv=setInterval(tick,1e3);R();}
function resetT(){clearInterval(T.iv);T.on=false;T.paused=false;T.sec=0;T.round=0;R();}
function stopT(){clearInterval(T.iv);T.on=false;beepL();}
function beepS(){try{const a=new(window.AudioContext||window.webkitAudioContext)(),o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);o.frequency.value=880;g.gain.value=.3;o.start();o.stop(a.currentTime+.1);}catch(e){}}
function beepL(){try{const a=new(window.AudioContext||window.webkitAudioContext)(),o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);o.frequency.value=1100;g.gain.value=.4;o.start();o.stop(a.currentTime+.3);}catch(e){}}

// ===== SETTINGS =====
function pgSettings(){const name=S.profile?.full_name||'';return `<div style="margin-bottom:16px"><h2 style="font-family:var(--fs);font-style:italic;font-size:1.6rem">Paramètres</h2></div><div class="card" style="max-width:550px"><div class="card-h"><h3>Profil</h3></div><div class="card-b"><div style="display:flex;align-items:center;gap:12px;margin-bottom:16px"><div class="av av-l" style="background:var(--ac);color:#000">${name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)}</div><div><div style="font-size:1rem;font-weight:700">${name}</div><div style="color:var(--t3);font-size:.8rem">${S.user?.email||''}</div><span class="badge bo" style="margin-top:3px">${S.profile?.role||'client'}</span></div></div><div class="fg"><label class="lb">Nom</label><input id="sN" value="${name}"></div><button class="b bp" onclick="updProfile()">Sauvegarder</button></div></div>`;}
async function updProfile(){const n=document.getElementById('sN')?.value;if(!n)return;await sb.from('profiles').update({full_name:n}).eq('id',S.user.id);S.profile.full_name=n;toast('Mis à jour !');R();}

// ===== TOAST & MODAL =====
function toastH(){return S.toasts.length?`<div class="toasts">${S.toasts.map(t=>`<div class="toast ${t.t}">${t.t==='ok'?'✓':t.t==='err'?'✕':'ℹ'} ${t.m}</div>`).join('')}</div>`:'';}
function modalH(){const m=S.modal;if(!m)return '';return `<div class="mov" onclick="if(event.target===this){S.modal=null;R()}"><div class="mod ${m.w?'w':''}"><div class="mod-h"><h3>${m.title}</h3><button class="bic" onclick="S.modal=null;R()">${ic.x}</button></div><div class="mod-b">${m.content}</div>${!m.ns?`<div class="mod-f"><button class="b bs" onclick="S.modal=null;R()">Annuler</button><button class="b bp" onclick="S.modal.onSave()">Enregistrer</button></div>`:''}</div></div>`;}

R();
