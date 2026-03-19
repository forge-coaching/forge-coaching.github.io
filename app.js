// ===== FORGE v5 — SUPABASE CONNECTED =====
const SUPA_URL='https://zvoruwwnpjllejdpkvby.supabase.co';
const SUPA_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2b3J1d3ducGpsbGVqZHBrdmJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MDEwNTQsImV4cCI6MjA4OTI3NzA1NH0.Yze0pciebPhlrsbBci3eQMIeRpGS_dkYOxVrliiezrQ';
const sb=supabase.createClient(SUPA_URL,SUPA_KEY);

// ===== STATE =====
let S={user:null,profile:null,pg:'dashboard',clients:[],programs:[],sessions:[],surveys:[],foods:[],notifs:[],toasts:[],modal:null,chatTarget:null,exFilter:'Tous',loading:true,notifOpen:false,sideOpen:false};
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
async function doSignUp(email,pass,name,role,firstName,lastName,extra){
  const{data,error}=await sb.auth.signUp({email,password:pass,options:{data:{full_name:name,role}}});
  if(error){toast(error.message,'err');S.loading=false;R();return;}
  if(!data.session){
    const{data:d2,error:e2}=await sb.auth.signInWithPassword({email,password:pass});
    if(e2){toast('Compte créé ! Connectez-vous.','inf');S.loading=false;R();return;}
    S.user=d2.user;
  } else {
    S.user=data.user;
  }
  S.loading=true;showTransLoader();
  await loadProfile();
  // Auto-create client record linked to THE coach
  if(S.profile?.role==='client'){
    const{data:existing}=await sb.from('clients').select('id').eq('user_id',S.user.id);
    if(!existing||existing.length===0){
      const fn=firstName||name?.split(' ')[0]||'Client';
      const ln=lastName||name?.split(' ').slice(1).join(' ')||'';
      const{data:coach}=await sb.from('profiles').select('id').eq('role','coach').limit(1).single();
      if(coach){
        const colors=['#c8ff00','#3b82f6','#22c55e','#a855f7','#f59e0b','#06b6d4'];
        await sb.from('clients').insert({
          coach_id:coach.id,user_id:S.user.id,first_name:fn,last_name:ln,email:S.user.email,
          age:extra?.age||null,weight:extra?.weight||null,height:extra?.height||null,
          gender:extra?.gender||'male',goal:extra?.goal||null,level:extra?.level||null,
          activity:'moderate',color:colors[Math.floor(Math.random()*colors.length)],active:true
        });
        await sb.from('notifications').insert({user_id:coach.id,type:'client',title:'Nouveau client',body:`${fn} ${ln} vient de s'inscrire`});
      }
    }
  }
  await loadClients();await loadSessions();await loadPrograms();await loadSurveys();await loadFoods();await loadNotifs();
  subRealtime();S.loading=false;hideTransLoader();R();toast('Bienvenue !');
}
async function doSignIn(email,pass){
  const{data,error}=await sb.auth.signInWithPassword({email,password:pass});
  if(error){toast(error.message,'err');S.loading=false;R();return;}
  S.user=data.user;
  S.loading=true;showTransLoader();
  await loadProfile();
  await loadClients();
  await loadSessions();
  await loadPrograms();
  await loadSurveys();
  await loadFoods();
  await loadNotifs();
  subRealtime();
  S.loading=false;hideTransLoader();R();
  toast('Bienvenue !');
}
function showTransLoader(){const el=document.getElementById('transLoader');if(el)el.classList.add('show');}
function hideTransLoader(){const el=document.getElementById('transLoader');if(el)el.classList.remove('show');}
async function doSignOut(){await sb.auth.signOut();S.user=null;S.profile=null;S.clients=[];S.loading=false;R();showAuth('login');}

// ===== DATA LOADERS =====
async function loadProfile(){
  console.log('[FORGE] Loading profile for:', S.user.id);
  const{data,error}=await sb.from('profiles').select('*').eq('id',S.user.id).maybeSingle();
  console.log('[FORGE] Profile query result:', data, error);
  if(data){S.profile=data;return;}
  // Profile missing — create it
  console.log('[FORGE] Profile not found, creating...');
  const meta=S.user.user_metadata||{};
  const newP={id:S.user.id,email:S.user.email,full_name:meta.full_name||S.user.email.split('@')[0],role:meta.role||'client'};
  const{data:created,error:iErr}=await sb.from('profiles').insert(newP).select().maybeSingle();
  console.log('[FORGE] Profile insert result:', created, iErr);
  if(iErr){
    console.error('[FORGE] Profile insert failed, using local fallback');
    S.profile=newP; // Use local fallback so app doesn't crash
  } else {
    S.profile=created;
  }
}
async function loadClients(){
  if(S.profile?.role==='coach'){
    const{data}=await sb.from('clients').select('*').eq('coach_id',S.user.id).order('created_at',{ascending:false});
    S.clients=data||[];
  } else {
    // Auto-link: if client has no linked record, find by email and link
    let{data}=await sb.from('clients').select('*').eq('user_id',S.user.id);
    if(!data||data.length===0){
      // Try to find a client record with matching email and link it
      const{data:byEmail}=await sb.from('clients').select('*').eq('email',S.user.email).is('user_id',null);
      if(byEmail&&byEmail.length>0){
        await sb.from('clients').update({user_id:S.user.id}).eq('id',byEmail[0].id);
        data=byEmail;
        data[0].user_id=S.user.id;
      }
    }
    S.clients=data||[];
  }
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
async function loadNotifs(){
  const{data}=await sb.from('notifications').select('*').eq('user_id',S.user.id).order('created_at',{ascending:false});
  S.notifs=data||[];
}
async function loadMsgs(cid){const{data}=await sb.from('messages').select('*').eq('client_id',cid).order('created_at');return data||[];}
async function loadPerfs(cid){const{data}=await sb.from('performances').select('*').eq('client_id',cid).order('date');return data||[];}
async function loadAll(){
  console.log('[FORGE] loadAll starting...');
  S.loading=true;R();
  try{
    await loadProfile();
    console.log('[FORGE] Profile loaded:', S.profile?.role);
    await loadClients();
    console.log('[FORGE] Clients loaded:', S.clients.length);
    await loadSessions();
    await loadPrograms();
    await loadSurveys();
    await loadFoods();
    await loadNotifs();
    console.log('[FORGE] All data loaded');
  }catch(e){console.error('[FORGE] loadAll error:', e);}
  S.loading=false;R();
}

// ===== REALTIME =====
function subRealtime(){
  sb.channel('rt-msgs').on('postgres_changes',{event:'INSERT',schema:'public',table:'messages'},()=>{if(S.pg==='chat'||S.pg==='cl-chat'){const el=document.getElementById('chatMsgs');if(el)refreshChat();}}).subscribe();
  sb.channel('rt-sess').on('postgres_changes',{event:'*',schema:'public',table:'sessions'},()=>{loadSessions().then(R);}).subscribe();
  sb.channel('rt-notifs').on('postgres_changes',{event:'INSERT',schema:'public',table:'notifications',filter:`user_id=eq.${S.user.id}`},()=>{loadNotifs().then(R);}).subscribe();
}

// ===== AUTH - ULTRA SIMPLE =====
async function initApp(){
  const{data:{session}}=await sb.auth.getSession();
  if(session?.user){
    S.user=session.user;
    await loadProfile();
    await loadClients();
    await loadSessions();
    await loadPrograms();
    await loadSurveys();
    await loadFoods();
    subRealtime();
  }
  S.loading=false;
  R();
}

// Listen only for sign out (sign in is handled by doSignIn directly)
sb.auth.onAuthStateChange((ev)=>{
  if(ev==='SIGNED_OUT'){S.user=null;S.profile=null;S.clients=[];S.loading=false;R();}
});

initApp();

// ===== RENDER =====
function R(){
  if(S.loading)return;
  if(!S.user){
    document.getElementById('loader')?.classList.add('hide');
    document.getElementById('landing')?.classList.add('show');
    document.getElementById('app')?.classList.remove('show');
    return;
  }
  document.getElementById('loader')?.classList.add('hide');
  document.getElementById('landing')?.classList.remove('show');
  const app=document.getElementById('app');
  app.classList.add('show');
  const isC=S.profile?.role==='coach';
  app.innerHTML=sideBar(isC)+`<div class="main">${topBar()}<div class="pg">${pgRoute(isC)}</div></div>`+toastH()+modalH();
  setTimeout(()=>{const el=document.getElementById('chatMsgs');if(el)el.scrollTop=el.scrollHeight;},30);
  if((S.pg==='chat'&&S.chatTarget)||(S.pg==='cl-chat'&&S.clients[0]))setTimeout(refreshChat,50);
}

// ===== AUTH PAGE (now in HTML, just manage the form) =====
function showAuth(mode){
  authMode=mode;
  const title=document.getElementById('authTitle');
  const sub=document.getElementById('authSub');
  const form=document.getElementById('authForm');
  if(!title||!form)return;
  if(mode==='register'){
    title.textContent='Créer un compte';
    sub.textContent='Remplissez votre profil';
    form.innerHTML=`
<div class="g2"><div class="fg"><label class="lb">Prénom</label><input id="rF" placeholder="Jean"></div><div class="fg"><label class="lb">Nom</label><input id="rL" placeholder="Dupont"></div></div>
<div class="fg"><label class="lb">Email</label><input id="rE" type="email" placeholder="email@exemple.com"></div>
<div class="fg"><label class="lb">Mot de passe (min 6)</label><input id="rP" type="password" placeholder="••••••••"></div>
<div class="g3"><div class="fg"><label class="lb">Âge</label><input id="rAge" type="number" placeholder="25"></div><div class="fg"><label class="lb">Poids (kg)</label><input id="rW" type="number" placeholder="75"></div><div class="fg"><label class="lb">Taille (cm)</label><input id="rH" type="number" placeholder="178"></div></div>
<div class="g2"><div class="fg"><label class="lb">Sexe</label><select id="rGn"><option value="male">Homme</option><option value="female">Femme</option></select></div><div class="fg"><label class="lb">Objectif</label><select id="rGo"><option>Prise de masse</option><option>Perte de poids</option><option>Remise en forme</option><option>Performance</option></select></div></div>
<div class="fg"><label class="lb">Niveau</label><select id="rLv"><option>Débutant</option><option>Intermédiaire</option><option>Avancé</option></select></div>
<button class="b bp" style="width:100%;justify-content:center;padding:12px" onclick="handleReg()">Créer mon compte</button>
<p style="text-align:center;margin-top:14px;font-size:.72rem;color:var(--t4)">Déjà un compte ? <a onclick="showAuth('login')">Se connecter</a></p>`;
  }else{
    title.textContent='Connexion';
    sub.textContent='Accédez à votre espace';
    form.innerHTML=`<div class="fg"><label class="lb">Email</label><input id="lE" type="email" placeholder="email@exemple.com"></div><div class="fg"><label class="lb">Mot de passe</label><input id="lP" type="password" placeholder="••••••••"></div><button class="b bp" style="width:100%;justify-content:center;padding:12px" onclick="handleLogin()">Se connecter</button><p style="text-align:center;margin-top:16px;font-size:.72rem;color:var(--t4)">Pas de compte ? <a onclick="showAuth('register')">Commencer gratuitement</a></p>`;
  }
}
// Init the login form on load
setTimeout(()=>showAuth('login'),100);

// ===== AUTH PAGE =====
let authMode='login',authRole='coach';
// authPg removed - landing page lives in index.html


async function handleLogin(){const e=document.getElementById('lE')?.value,p=document.getElementById('lP')?.value;if(!e||!p){toast('Champs requis','err');return;}S.loading=true;R();await doSignIn(e,p);}
async function handleReg(){
const f=document.getElementById('rF')?.value,l=document.getElementById('rL')?.value,e=document.getElementById('rE')?.value,p=document.getElementById('rP')?.value;
if(!f||!e||!p){toast('Prénom, email et mot de passe requis','err');return;}
if(p.length<6){toast('Mot de passe trop court','err');return;}
const extra={age:+document.getElementById('rAge')?.value||null,weight:+document.getElementById('rW')?.value||null,height:+document.getElementById('rH')?.value||null,gender:document.getElementById('rGn')?.value||'male',goal:document.getElementById('rGo')?.value||'Remise en forme',level:document.getElementById('rLv')?.value||'Débutant'};
await doSignUp(e,p,f+' '+(l||''),'client',f,l||'',extra);
}

// ===== SIDEBAR =====
function sideBar(isC){
const p=S.pg,name=S.profile?.full_name||S.user?.email||'User';
const cn=[{id:'dashboard',l:'Tableau de bord',i:ic.dash},{id:'clients',l:'Clients',i:ic.users},{id:'exercises',l:'Bibliothèque',i:ic.lib},{id:'programs',l:'Programmes',i:ic.prog},{id:'timer',l:'Timer WOD',i:ic.timer},{id:'performance',l:'Performances',i:ic.perf},{id:'calories',l:'Calories',i:ic.fire},{id:'nutrition',l:'Nutrition',i:ic.food},{id:'calendar',l:'Calendrier',i:ic.cal},{id:'chat',l:'Messages',i:ic.chat},{id:'survey',l:'Satisfaction',i:ic.star},{id:'qrcode',l:'QR Codes',i:ic.qr},{id:'stats',l:'Stats',i:ic.chart}];
const cln=[{id:'cl-dash',l:'Mon espace',i:ic.dash},{id:'cl-cal',l:'Mes séances',i:ic.cal},{id:'cl-prog',l:'Programme',i:ic.prog},{id:'cl-perf',l:'Performances',i:ic.perf},{id:'exercises',l:'Exercices',i:ic.lib},{id:'timer',l:'Timer WOD',i:ic.timer},{id:'cl-kcal',l:'Objectifs',i:ic.fire},{id:'cl-nutri',l:'Nutrition',i:ic.food},{id:'cl-chat',l:'Messages',i:ic.chat},{id:'cl-survey',l:'Évaluations',i:ic.star}];
const nav=isC?cn:cln;
return `<div class="side-overlay ${S.sideOpen?'open':''}" onclick="S.sideOpen=false;R()"></div>
<div class="side ${S.sideOpen?'open':''}"><div class="side-hd"><div class="logo">Forge</div><div class="logo-s">${isC?'Coach Platform':'Espace Client'}</div></div>
<nav class="side-nav"><div class="nsec">Menu</div>${nav.map(n=>`<div class="ni ${p===n.id?'on':''}" onclick="S.pg='${n.id}';S.sideOpen=false;R()">${n.i}${n.l}</div>`).join('')}
<div class="nsec" style="margin-top:8px">Compte</div><div class="ni" onclick="S.pg='settings';S.sideOpen=false;R()">${ic.gear}Paramètres</div><div class="ni" onclick="doSignOut()">${ic.out}Déconnexion</div>
</nav><div class="side-ft"><div class="ucard"><div class="av av-s" style="background:${isC?'var(--ac)':'var(--blu)'};color:#000">${name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)}</div><div style="flex:1;min-width:0"><div style="font-size:.72rem;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${name}</div><div style="font-size:.55rem;color:var(--t4)">${isC?'Coach':'Client'}</div></div></div></div></div>`;
}
function topBar(){
const ts={dashboard:'Tableau de bord',clients:'Clients',exercises:'Bibliothèque',programs:'Programmes',timer:'Timer WOD',performance:'Performances',calories:'Calories',nutrition:'Nutrition',calendar:'Calendrier',chat:'Messages',survey:'Satisfaction',qrcode:'QR Codes',stats:'Stats',settings:'Paramètres','cl-dash':'Mon espace','cl-cal':'Mes séances','cl-prog':'Programme','cl-perf':'Performances','cl-kcal':'Objectifs','cl-nutri':'Nutrition','cl-chat':'Messages','cl-survey':'Évaluations'};
const unread=S.notifs.filter(n=>!n.read).length;
return `<div class="topbar"><div style="display:flex;align-items:center;gap:8px"><button class="mob-toggle" onclick="S.sideOpen=!S.sideOpen;R()"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg></button><span style="font-size:.8rem;font-weight:500">${ts[S.pg]||'Forge'}</span></div>
<div style="position:relative"><button class="bic" onclick="S.notifOpen=!S.notifOpen;R()">${ic.bell}${unread?`<span style="position:absolute;top:3px;right:3px;width:8px;height:8px;background:var(--red);border-radius:50%;border:2px solid var(--bg)"></span>`:''}</button>
${S.notifOpen?`<div style="position:absolute;right:0;top:42px;width:320px;background:var(--bg2);border:1px solid rgba(255,255,255,.06);border-radius:var(--r);box-shadow:0 10px 40px rgba(0,0,0,.4);z-index:200;overflow:hidden">
<div style="padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.04);display:flex;justify-content:space-between;align-items:center"><strong style="font-size:.82rem">Notifications</strong>${unread?`<button class="b bg bsm" onclick="markAllRead()">Tout lu</button>`:''}</div>
<div style="max-height:350px;overflow-y:auto">${S.notifs.length?S.notifs.slice(0,10).map(n=>`<div style="padding:10px 14px;border-bottom:1px solid rgba(255,255,255,.03);cursor:pointer;${n.read?'opacity:.5':''}" onclick="handleNotif(${n.id},'${n.type||''}')">
<div style="display:flex;justify-content:space-between;align-items:center"><div style="font-size:.78rem;font-weight:${n.read?'400':'700'}">${n.title||''}</div>${!n.read?'<div style="width:6px;height:6px;background:var(--ac);border-radius:50%;flex-shrink:0"></div>':''}</div>
<div style="font-size:.7rem;color:var(--t3);margin-top:2px">${n.body||''}</div>
<div style="font-size:.58rem;color:var(--t4);margin-top:3px">${n.created_at?fmtT(n.created_at):''}</div>
</div>`).join(''):'<div style="padding:24px;text-align:center;color:var(--t4);font-size:.8rem">Aucune notification</div>'}</div>
</div>`:''}</div></div>`;
}
async function markAllRead(){
  const ids=S.notifs.filter(n=>!n.read).map(n=>n.id);
  if(ids.length)await sb.from('notifications').update({read:true}).in('id',ids);
  S.notifs.forEach(n=>n.read=true);S.notifOpen=false;R();
}
async function handleNotif(id,type){
  await sb.from('notifications').update({read:true}).eq('id',id);
  const n=S.notifs.find(x=>x.id===id);if(n)n.read=true;
  S.notifOpen=false;
  if(type==='survey'){S.pg=S.profile?.role==='coach'?'survey':'cl-survey';}
  else if(type==='session'){S.pg=S.profile?.role==='coach'?'calendar':'cl-cal';}
  R();
}

// ===== PAGE ROUTER =====
function pgRoute(isC){
const p=S.pg;
if(p==='exercises')return pgExercises();if(p==='timer')return pgTimer();if(p==='settings')return pgSettings();
if(isC){switch(p){case'dashboard':return cDash();case'clients':return cClients();case'programs':return cPrograms();case'performance':return cPerf();case'calories':return cCalories();case'nutrition':return cNutrition();case'calendar':return cCalendar();case'chat':return cChat();case'survey':return cSurvey();case'qrcode':return cQR();case'stats':return cStats();default:return cDash();}}
else{switch(p){case'cl-dash':return clDash();case'cl-cal':return clCal();case'cl-prog':return clProg();case'cl-perf':return clPerf();case'cl-kcal':return clKcal();case'cl-nutri':return cNutrition();case'cl-chat':return clChat();case'cl-survey':return clSurvey();default:return clDash();}}
}

// ===== COACH: DASHBOARD =====
function cDash(){
const cl=S.clients,se=S.sessions,sv=S.surveys;
const active=cl.filter(c=>c.active).length;
const avg=sv.length?(sv.reduce((a,s)=>a+(s.global_rating||0),0)/sv.length).toFixed(1):'—';
const today=new Date().toISOString().split('T')[0];
const tse=se.filter(s=>s.date===today);
return `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><h2 style="font-family:var(--fs);font-style:italic;font-size:1.6rem">Tableau de bord</h2><div style="display:flex;gap:6px"><button class="b bp" onclick="openAddSess()">${ic.plus} Séance</button><button class="b bg" onclick="openAddClient()">${ic.plus} Client</button></div></div>
<div class="pills"><div class="pill"><div class="pill-v" style="color:var(--ac)">${active}</div><div class="pill-l">Clients actifs</div></div><div class="pill"><div class="pill-v" style="color:var(--blu)">${S.programs.length}</div><div class="pill-l">Programmes</div></div><div class="pill"><div class="pill-v" style="color:var(--grn)">${avg}</div><div class="pill-l">Note moy.</div></div><div class="pill"><div class="pill-v" style="color:var(--org)">${se.filter(s=>s.status==='upcoming').length}</div><div class="pill-l">Séances à venir</div></div></div>
<div class="g2"><div class="card"><div class="card-h"><h3>Séances du jour</h3><span class="badge ba">${today.slice(5)}</span></div><div class="card-b">${tse.length?tse.map(s=>{const c=cl.find(x=>x.id===s.client_id);return `<div class="sess up"><div style="display:flex;justify-content:space-between;align-items:center"><div style="display:flex;align-items:center;gap:7px"><div class="av av-s" style="background:${c?.color||'var(--t4)'};color:#000">${c?IN(c.first_name,c.last_name):'?'}</div><strong style="font-size:.82rem">${c?c.first_name+' '+c.last_name:'—'}</strong></div><span style="font-family:var(--fm);font-size:.72rem;color:var(--ac)">${s.time||''}</span></div><div style="margin-top:5px"><span class="badge bo">${s.type||''}</span>${s.status==='upcoming'?` <button class="b bg bsm" onclick="complSess(${s.id})">Valider ✓</button>`:' <span class="badge bgr">Fait</span>'}</div></div>`;}).join(''):'<div style="text-align:center;padding:16px;color:var(--t4)">Aucune séance aujourd\'hui</div>'}</div></div>
<div class="card"><div class="card-h"><h3>Clients</h3><button class="b bs bsm" onclick="S.pg='clients';R()">Tous</button></div><div class="card-b">${cl.slice(0,5).map(c=>`<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid rgba(255,255,255,.03);cursor:pointer" onclick="openClient(${c.id})"><div class="av av-s" style="background:${c.color||'var(--ac)'};color:#000">${IN(c.first_name,c.last_name)}</div><div style="flex:1"><div style="font-size:.78rem;font-weight:600">${c.first_name} ${c.last_name}</div><div style="font-size:.65rem;color:var(--t4)">${c.goal||''}</div></div><span class="badge ${c.active?'bgr':'bo'}" style="font-size:.5rem">${c.active?'Actif':'—'}</span></div>`).join('')}${!cl.length?'<div style="text-align:center;padding:14px;color:var(--t4)"><a onclick="openAddClient()">+ Ajouter un client</a></div>':''}</div></div></div>`;
}
async function complSess(id){
  const sess=S.sessions.find(s=>s.id===id);
  await sb.from('sessions').update({status:'done'}).eq('id',id);
  // Find client and send notification
  if(sess){
    const c=S.clients.find(x=>x.id===sess.client_id);
    if(c&&c.user_id){
      await sb.from('notifications').insert({user_id:c.user_id,client_id:c.id,type:'survey',title:'Séance terminée !',body:`${sess.type||'Séance'} du ${sess.date} — Donnez votre avis`});
    }
    // Auto-open survey creation for coach
    S.modal={title:'Questionnaire post-séance',w:true,content:`
    <div style="background:var(--acg);border:1px solid rgba(200,255,0,.08);border-radius:var(--r2);padding:12px;margin-bottom:14px;font-size:.82rem;color:var(--ac)">📋 Séance "${sess.type||''}" validée pour ${c?c.first_name+' '+c.last_name:''}. Remplir le questionnaire ?</div>
    <div class="g3"><div class="fg"><label class="lb">Note globale (1-5)</label><input id="svG" type="number" min="1" max="5" value="5"></div><div class="fg"><label class="lb">Note coach (1-5)</label><input id="svC" type="number" min="1" max="5" value="5"></div><div class="fg"><label class="lb">Note programme (1-5)</label><input id="svP" type="number" min="1" max="5" value="4"></div></div>
    <div class="g2"><div class="fg"><label class="lb">Effort (1-10)</label><input id="svE" type="number" min="1" max="10" value="7"></div><div class="fg"><label class="lb">Objectifs</label><select id="svGoal"><option>En cours</option><option>Atteints</option><option>Non atteints</option></select></div></div>
    <div class="fg"><label class="lb">Commentaires</label><textarea id="svCom"></textarea></div>
    `,onSave:async()=>{
      await sb.from('surveys').insert({coach_id:S.user.id,client_id:sess.client_id,global_rating:+document.getElementById('svG')?.value,coach_rating:+document.getElementById('svC')?.value,program_rating:+document.getElementById('svP')?.value,effort:+document.getElementById('svE')?.value,comments:document.getElementById('svCom')?.value,goals:document.getElementById('svGoal')?.value});
      S.modal=null;await loadSurveys();toast('Questionnaire enregistré !');R();
    },ns:false};
  }
  await loadSessions();toast('Séance validée !');R();
}

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
<div class="chat-in"><input placeholder="Écrire..." id="chatInput" onkeydown="if(event.key==='Enter')sendMsg('coach')"><button class="bic" id="voiceBtn" onclick="sendVoice('coach')">${ic.mic}</button><button class="bic" style="background:var(--ac);color:#000" onclick="sendMsg('coach')">${ic.send}</button></div></div></div>`;
}
function clChat(){
const mc=S.clients[0];if(!mc)return '<div style="padding:30px;text-align:center;color:var(--t4)">Pas encore lié à un coach.</div>';
return `<div class="chat-wrap"><div class="chat-main" style="width:100%"><div class="chat-head"><div class="av av-s" style="background:var(--ac);color:#000">C</div><strong style="font-size:.85rem">Mon Coach</strong></div>
<div class="chat-msgs" id="chatMsgs"><div class="loading" style="min-height:auto;padding:20px">Chargement...</div></div>
<div class="chat-in"><input placeholder="Écrire..." id="chatInput" onkeydown="if(event.key==='Enter')sendMsg('client')"><button class="bic" id="voiceBtn" onclick="sendVoice('client')">${ic.mic}</button><button class="bic" style="background:var(--ac);color:#000" onclick="sendMsg('client')">${ic.send}</button></div></div></div>`;
}
async function refreshChat(){
const cid=S.profile?.role==='coach'?(S.chatTarget||S.clients[0]?.id):S.clients[0]?.id;
if(!cid)return;
const msgs=await loadMsgs(cid);
const el=document.getElementById('chatMsgs');if(!el)return;
const me=S.profile?.role==='coach'?'coach':'client';
el.innerHTML=msgs.map(m=>`<div class="msg ${m.sender===me?'msg-out':'msg-in'}">${m.is_voice?`<div class="msg-voice" onclick="playVoice(this,'${m.id}')"><span id="vp${m.id}">▶</span><div class="msg-voice-bars">${Array(20).fill(0).map(()=>`<span style="height:${3+Math.random()*14}px"></span>`).join('')}</div><span style="font-size:.6rem;opacity:.5">${m.voice_duration||'0:03'}</span></div>${m.content&&m.content.startsWith('data:audio')?`<audio id="va${m.id}" src="${m.content}" preload="none"></audio>`:''}`:`${m.content}<div class="msg-t">${fmtT(m.created_at)}</div>`}</div>`).join('')||'<div style="text-align:center;padding:30px;color:var(--t4)">Aucun message</div>';
el.scrollTop=el.scrollHeight;
}
function playVoice(el,id){
  const audio=document.getElementById('va'+id);
  const icon=document.getElementById('vp'+id);
  if(!audio){toast('Audio non disponible','inf');return;}
  if(audio.paused){audio.play();if(icon)icon.textContent='⏸';audio.onended=()=>{if(icon)icon.textContent='▶'};}
  else{audio.pause();if(icon)icon.textContent='▶';}
}
async function sendMsg(sender){
const input=document.getElementById('chatInput');if(!input||!input.value.trim())return;
const cid=sender==='coach'?(S.chatTarget||S.clients[0]?.id):S.clients[0]?.id;
const coachId=sender==='coach'?S.user.id:S.clients[0]?.coach_id;
if(!cid||!coachId)return;
await sb.from('messages').insert({coach_id:coachId,client_id:cid,sender,content:input.value.trim()});
input.value='';refreshChat();
}
let mediaRec=null,audioChunks=[];
async function sendVoice(sender){
const cid=sender==='coach'?(S.chatTarget||S.clients[0]?.id):S.clients[0]?.id;
const coachId=sender==='coach'?S.user.id:S.clients[0]?.coach_id;
if(!cid||!coachId)return;
if(mediaRec&&mediaRec.state==='recording'){mediaRec.stop();return;}
try{
  const stream=await navigator.mediaDevices.getUserMedia({audio:true});
  audioChunks=[];
  mediaRec=new MediaRecorder(stream);
  mediaRec.ondataavailable=e=>{if(e.data.size>0)audioChunks.push(e.data)};
  mediaRec.onstop=async()=>{
    stream.getTracks().forEach(t=>t.stop());
    const blob=new Blob(audioChunks,{type:'audio/webm'});
    const reader=new FileReader();
    reader.onloadend=async()=>{
      const base64=reader.result;
      const dur=Math.round(audioChunks.length*0.5+1);
      await sb.from('messages').insert({coach_id:coachId,client_id:cid,sender,is_voice:true,voice_duration:`0:${String(dur).padStart(2,'0')}`,content:base64});
      toast('Note vocale envoyée !');refreshChat();
    };
    reader.readAsDataURL(blob);
    // Reset button
    const btn=document.getElementById('voiceBtn');
    if(btn){btn.innerHTML=ic.mic;btn.style.background='';btn.style.color='';}
  };
  mediaRec.start();
  toast('🎙️ Enregistrement... Cliquez pour arrêter','inf');
  const btn=document.getElementById('voiceBtn');
  if(btn){btn.innerHTML='⏹';btn.style.background='var(--red)';btn.style.color='#fff';}
}catch(e){toast('Micro non disponible','err');}
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
onSave:async()=>{
  const cid=+document.getElementById('sC')?.value;
  const date=document.getElementById('sD')?.value;
  const time=document.getElementById('sT')?.value;
  const type=document.getElementById('sType')?.value||'Séance';
  const{error}=await sb.from('sessions').insert({coach_id:S.user.id,client_id:cid,date,time,type});
  if(error){toast(error.message,'err');return;}
  // Notify client
  const c=S.clients.find(x=>x.id===cid);
  if(c&&c.user_id){
    await sb.from('notifications').insert({user_id:c.user_id,client_id:c.id,type:'session',title:'Nouvelle séance planifiée',body:`${type} le ${date} à ${time}`});
  }
  S.modal=null;await loadSessions();toast('Séance ajoutée !');R();
}};R();
}

// ===== COACH: PROGRAMS (FULL CRUD) =====
function cPrograms(){
return `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><h2 style="font-family:var(--fs);font-style:italic;font-size:1.6rem">Programmes</h2><button class="b bp" onclick="openAddProg()">${ic.plus} Programme</button></div>
${S.programs.length?`<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px">${S.programs.map(p=>{const c=S.clients.find(x=>x.id===p.client_id);return `<div class="card" style="cursor:pointer" onclick="openViewProg(${p.id})"><div style="height:60px;background:linear-gradient(135deg,#1a1a2e,#0f172a);display:flex;align-items:flex-end;padding:10px 14px;position:relative"><div style="position:absolute;inset:0;background:linear-gradient(to top,var(--s),transparent)"></div><h3 style="position:relative;font-family:var(--fs);font-style:italic;font-size:1.1rem">${p.name}</h3></div><div style="padding:12px 14px"><div style="display:flex;gap:4px;margin-bottom:5px"><span class="badge ba">${p.level||''}</span><span class="badge bo">${p.type||''}</span><span class="badge bo">${p.duration||''}</span></div><p style="font-size:.72rem;color:var(--t3)">${p.description||''}</p>${c?`<div style="font-size:.65rem;color:var(--t4);margin-top:4px">→ ${c.first_name} ${c.last_name}</div>`:''}</div></div>`;}).join('')}</div>`:'<div style="color:var(--t4);text-align:center;padding:30px">Aucun programme</div>'}`;
}
function openAddProg(){
const cl=S.clients.filter(c=>c.active);
S.modal={title:'Nouveau programme',w:true,content:`
<div class="fg"><label class="lb">Nom</label><input id="pN" placeholder="Push Pull Legs"></div>
<div class="fg"><label class="lb">Description</label><textarea id="pDesc"></textarea></div>
<div class="g3"><div class="fg"><label class="lb">Type</label><select id="pT"><option>Musculation</option><option>HIIT</option><option>CrossFit</option><option>Pilates</option><option>Cardio</option></select></div><div class="fg"><label class="lb">Niveau</label><select id="pLv"><option>Débutant</option><option>Intermédiaire</option><option>Avancé</option></select></div><div class="fg"><label class="lb">Durée</label><input id="pDur" placeholder="12 sem"></div></div>
<div class="g2"><div class="fg"><label class="lb">Jours/sem</label><input id="pDpw" type="number" value="4"></div><div class="fg"><label class="lb">Client</label><select id="pCl"><option value="">Aucun</option>${cl.map(c=>`<option value="${c.id}">${c.first_name} ${c.last_name}</option>`).join('')}</select></div></div>
`,onSave:async()=>{
const n=document.getElementById('pN')?.value;if(!n){toast('Nom requis','err');return;}
const{error}=await sb.from('programs').insert({coach_id:S.user.id,name:n,description:document.getElementById('pDesc')?.value,type:document.getElementById('pT')?.value,level:document.getElementById('pLv')?.value,duration:document.getElementById('pDur')?.value,days_per_week:+document.getElementById('pDpw')?.value||4,client_id:+document.getElementById('pCl')?.value||null});
if(error){toast(error.message,'err');return;}S.modal=null;await loadPrograms();toast('Programme créé !');R();
}};R();
}
async function openViewProg(id){
const p=S.programs.find(x=>x.id===id);if(!p)return;const c=S.clients.find(x=>x.id===p.client_id);
S.modal={title:p.name,w:true,ns:true,content:`<div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:14px"><span class="badge ba">${p.level||''}</span><span class="badge bo">${p.type||''}</span><span class="badge bo">${p.duration||''}</span>${p.days_per_week?`<span class="badge bo">${p.days_per_week}j/sem</span>`:''}</div><p style="color:var(--t2);margin-bottom:14px">${p.description||''}</p>${c?`<div style="background:var(--bg3);padding:10px;border-radius:var(--r2);margin-bottom:14px"><div class="lb">Client assigné</div><strong>${c.first_name} ${c.last_name}</strong></div>`:''}<button class="b bd bsm" onclick="delProg(${p.id})">${ic.trash} Supprimer</button>`};R();
}
async function delProg(id){if(!confirm('Supprimer ?'))return;await sb.from('programs').delete().eq('id',id);S.modal=null;await loadPrograms();toast('Supprimé','inf');R();}

// ===== COACH: PERFORMANCES =====
function cPerf(){
const cl=S.clients.filter(c=>c.active);
return `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><h2 style="font-family:var(--fs);font-style:italic;font-size:1.6rem">Performances</h2><button class="b bp" onclick="openAddPerf()">${ic.plus} Entrée</button></div>
<div class="fg"><label class="lb">Client</label><select id="perfCl" onchange="showPerf()">${cl.map(c=>`<option value="${c.id}">${c.first_name} ${c.last_name}</option>`).join('')}</select></div>
<div id="perfData"></div>`;
}
async function showPerf(){
const cid=+document.getElementById('perfCl')?.value;if(!cid)return;
const data=await loadPerfs(cid);const el=document.getElementById('perfData');if(!el)return;
if(!data.length){el.innerHTML='<div class="card"><div class="card-b" style="text-align:center;color:var(--t4);padding:24px">Aucune performance</div></div>';return;}
const exs=[...new Set(data.map(p=>p.exercise))];
el.innerHTML=exs.map(ex=>{const d=data.filter(p=>p.exercise===ex);const mx=Math.max(...d.map(x=>x.weight||1));return `<div class="card"><div class="card-h"><h3>${ex}</h3><span class="badge ba">${d[d.length-1].weight}kg × ${d[d.length-1].reps}</span></div><div class="card-b"><div class="perf-bars">${d.map((x,i)=>`<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;height:100px;justify-content:flex-end"><span style="font-size:.55rem;font-family:var(--fm);color:var(--ac)">${x.weight}kg</span><div style="width:100%;max-width:24px;height:${x.weight/mx*100}%;background:var(--ac);border-radius:3px 3px 0 0;opacity:${.4+i/d.length*.6}"></div><span style="font-size:.5rem;color:var(--t4)">${x.date?.slice(5)||''}</span></div>`).join('')}</div><div style="display:flex;justify-content:space-between;font-size:.7rem;color:var(--t3);margin-top:6px"><span>${d[0].weight}→${d[d.length-1].weight}kg</span><span style="color:var(--grn)">+${(d[d.length-1].weight-d[0].weight).toFixed(1)}kg</span></div></div></div>`;}).join('');
}
setTimeout(()=>{if(S.pg==='performance')showPerf()},50);
function openAddPerf(){
const cl=S.clients.filter(c=>c.active);
S.modal={title:'Nouvelle performance',content:`
<div class="fg"><label class="lb">Client</label><select id="prCl">${cl.map(c=>`<option value="${c.id}">${c.first_name} ${c.last_name}</option>`).join('')}</select></div>
<div class="fg"><label class="lb">Exercice</label><select id="prEx">${EX.filter(e=>e.cat==='Force'||e.cat==='Hypertrophie').map(e=>`<option>${e.n}</option>`).join('')}</select></div>
<div class="g3"><div class="fg"><label class="lb">Charge (kg)</label><input id="prW" type="number"></div><div class="fg"><label class="lb">Reps</label><input id="prR" type="number"></div><div class="fg"><label class="lb">Date</label><input id="prD" type="date" value="${new Date().toISOString().split('T')[0]}"></div></div>
`,onSave:async()=>{const{error}=await sb.from('performances').insert({client_id:+document.getElementById('prCl')?.value,exercise:document.getElementById('prEx')?.value,weight:+document.getElementById('prW')?.value||0,reps:+document.getElementById('prR')?.value||0,date:document.getElementById('prD')?.value});if(error){toast(error.message,'err');return;}S.modal=null;toast('Enregistré !');showPerf();R();}};R();
}

// ===== DEFAULT FOODS DATABASE =====
const DEFAULT_FOODS=[
{name:'Blanc de poulet cru (100g)',calories:120,protein:22.5,carbs:0,fat:2.6},
{name:'Saumon cru (100g)',calories:208,protein:20,carbs:0,fat:13},
{name:'Steak haché 5% cru (100g)',calories:137,protein:20,carbs:0,fat:5},
{name:'Thon cru (100g)',calories:130,protein:29,carbs:0,fat:1},
{name:'Cabillaud cru (100g)',calories:82,protein:18,carbs:0,fat:0.7},
{name:'Crevettes crues (100g)',calories:85,protein:18,carbs:0,fat:1.2},
{name:'Dinde crue (100g)',calories:104,protein:24,carbs:0,fat:0.7},
{name:'Œuf entier (60g)',calories:90,protein:7.5,carbs:0.5,fat:6.3},
{name:'Whey protéine (30g)',calories:120,protein:24,carbs:3,fat:1.5},
{name:'Fromage blanc 0% (100g)',calories:45,protein:7,carbs:4,fat:0.2},
{name:'Yaourt grec 0% (100g)',calories:58,protein:10,carbs:3.5,fat:0},
{name:'Riz basmati cru (100g)',calories:350,protein:7.5,carbs:78,fat:0.6},
{name:'Pâtes crues (100g)',calories:350,protein:12,carbs:72,fat:1.5},
{name:'Flocons d\'avoine (100g)',calories:389,protein:16.9,carbs:66,fat:6.9},
{name:'Patate douce crue (100g)',calories:86,protein:1.6,carbs:20,fat:0.1},
{name:'Quinoa cru (100g)',calories:368,protein:14,carbs:64,fat:6},
{name:'Lentilles crues (100g)',calories:353,protein:25,carbs:60,fat:1},
{name:'Pain complet (1 tranche 30g)',calories:72,protein:3,carbs:12,fat:1.2},
{name:'Banane (120g)',calories:107,protein:1.3,carbs:27,fat:0.4},
{name:'Pomme (150g)',calories:78,protein:0.5,carbs:21,fat:0.3},
{name:'Brocoli cru (100g)',calories:34,protein:2.8,carbs:7,fat:0.4},
{name:'Avocat (100g)',calories:160,protein:2,carbs:8.5,fat:14.7},
{name:'Amandes (30g)',calories:183,protein:6.3,carbs:2,fat:16},
{name:'Beurre cacahuète (15g / 1cs)',calories:94,protein:4,carbs:2,fat:8},
{name:'Huile d\'olive (10ml / 1cs)',calories:90,protein:0,carbs:0,fat:10},
{name:'Miel (15g / 1cs)',calories:46,protein:0,carbs:12,fat:0},
{name:'Lait demi-écrémé (200ml)',calories:92,protein:6.4,carbs:9.6,fat:3.2},
{name:'Beurre (10g)',calories:75,protein:0.1,carbs:0,fat:8.3},
{name:'Parmesan (30g)',calories:120,protein:10.5,carbs:0,fat:8.7},
{name:'Haricots rouges crus (100g)',calories:333,protein:22,carbs:60,fat:0.8},
];

// ===== COACH: NUTRITION =====
function cNutrition(){
const allFoods=[...DEFAULT_FOODS,...S.foods];
return `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><h2 style="font-family:var(--fs);font-style:italic;font-size:1.6rem">Nutrition</h2><button class="b bp" onclick="openAddFood()">${ic.plus} Aliment</button></div>
<div class="search-b"><input placeholder="Rechercher..." oninput="filterFood(this.value)"></div>
<div class="card"><div class="card-h"><h3>Base nutritionnelle</h3><span class="badge bo">${allFoods.length}</span></div><div class="card-b" id="foodGrid">${rndrFoods(allFoods)}</div></div>`;
}
function rndrFoods(list){return list.map(f=>`<div class="food-i"><div class="food-n">${f.name}</div><div class="food-m"><span style="color:var(--t2)">${f.calories||0}kcal</span><span style="color:var(--ac)">P:${f.protein||0}g</span><span style="color:var(--org)">G:${f.carbs||0}g</span><span style="color:var(--red)">L:${f.fat||0}g</span></div></div>`).join('')||'<div style="color:var(--t4);text-align:center;padding:14px">Aucun aliment</div>';}
function filterFood(q){const el=document.getElementById('foodGrid');if(el)el.innerHTML=rndrFoods([...DEFAULT_FOODS,...S.foods].filter(f=>f.name.toLowerCase().includes(q.toLowerCase())));}
function openAddFood(){S.modal={title:'Ajouter un aliment',content:`<div class="fg"><label class="lb">Nom</label><input id="fN" placeholder="Blanc de poulet (100g)"></div><div class="g4"><div class="fg"><label class="lb">Cal</label><input id="fCal" type="number"></div><div class="fg"><label class="lb">Prot</label><input id="fP" type="number"></div><div class="fg"><label class="lb">Gluc</label><input id="fC" type="number"></div><div class="fg"><label class="lb">Lip</label><input id="fF" type="number"></div></div>`,onSave:async()=>{const n=document.getElementById('fN')?.value;if(!n){toast('Nom requis','err');return;}const{error}=await sb.from('foods').insert({coach_id:S.user.id,name:n,calories:+document.getElementById('fCal')?.value||0,protein:+document.getElementById('fP')?.value||0,carbs:+document.getElementById('fC')?.value||0,fat:+document.getElementById('fF')?.value||0});if(error){toast(error.message,'err');return;}S.modal=null;await loadFoods();toast('Ajouté !');R();}};R();}

// ===== COACH: SATISFACTION =====
function cSurvey(){
const sv=S.surveys;const avg=sv.length?(sv.reduce((a,s)=>a+(s.global_rating||0),0)/sv.length).toFixed(1):0;
return `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><h2 style="font-family:var(--fs);font-style:italic;font-size:1.6rem">Satisfaction</h2><button class="b bp" onclick="openAddSurvey()">${ic.plus} Questionnaire</button></div>
<div class="pills"><div class="pill"><div class="pill-v" style="color:var(--ac)">${avg}/5</div><div class="pill-l">Note moy.</div></div><div class="pill"><div class="pill-v" style="color:var(--grn)">${sv.length}</div><div class="pill-l">Réponses</div></div></div>
<div class="card"><div class="card-b">${sv.map(s=>{const c=S.clients.find(x=>x.id===s.client_id);return `<div style="background:var(--bg3);padding:12px;border-radius:var(--r2);border-left:3px solid ${(s.global_rating||0)>=4?'var(--grn)':'var(--org)'};margin-bottom:6px"><div style="display:flex;justify-content:space-between;margin-bottom:3px"><strong style="font-size:.82rem">${c?c.first_name+' '+c.last_name:'—'}</strong><span style="color:var(--ac)">${'★'.repeat(s.global_rating||0)}${'☆'.repeat(5-(s.global_rating||0))}</span></div><div style="display:flex;gap:4px;margin-top:3px"><span class="badge bo">Effort ${s.effort||'—'}/10</span><span class="badge bo">Coach ${s.coach_rating||'—'}/5</span></div>${s.comments?`<p style="font-size:.75rem;color:var(--t2);margin-top:4px">"${s.comments}"</p>`:''}</div>`;}).join('')||'<div style="color:var(--t4);text-align:center;padding:16px">Aucun</div>'}</div></div>`;
}
function openAddSurvey(){
const cl=S.clients.filter(c=>c.active);
S.modal={title:'Nouveau questionnaire',w:true,content:`
<div class="fg"><label class="lb">Client</label><select id="svCl">${cl.map(c=>`<option value="${c.id}">${c.first_name} ${c.last_name}</option>`).join('')}</select></div>
<div class="g3"><div class="fg"><label class="lb">Note globale (1-5)</label><input id="svG" type="number" min="1" max="5" value="5"></div><div class="fg"><label class="lb">Note coach (1-5)</label><input id="svC" type="number" min="1" max="5" value="5"></div><div class="fg"><label class="lb">Note programme (1-5)</label><input id="svP" type="number" min="1" max="5" value="4"></div></div>
<div class="g2"><div class="fg"><label class="lb">Effort (1-10)</label><input id="svE" type="number" min="1" max="10" value="7"></div><div class="fg"><label class="lb">Objectifs</label><select id="svGoal"><option>Atteints</option><option>En cours</option><option>Non atteints</option></select></div></div>
<div class="fg"><label class="lb">Commentaires</label><textarea id="svCom"></textarea></div>
`,onSave:async()=>{const{error}=await sb.from('surveys').insert({coach_id:S.user.id,client_id:+document.getElementById('svCl')?.value,global_rating:+document.getElementById('svG')?.value,coach_rating:+document.getElementById('svC')?.value,program_rating:+document.getElementById('svP')?.value,effort:+document.getElementById('svE')?.value,comments:document.getElementById('svCom')?.value,goals:document.getElementById('svGoal')?.value});if(error){toast(error.message,'err');return;}S.modal=null;await loadSurveys();toast('Enregistré !');R();}};R();
}

// ===== COACH: QR CODES (real QR generation) =====
function genQR(text,size=120){
// Simple QR-like matrix generation (deterministic from text)
const modules=21;let matrix=Array(modules).fill(null).map(()=>Array(modules).fill(false));
// Finder patterns
const setFinder=(r,c)=>{for(let i=0;i<7;i++)for(let j=0;j<7;j++){matrix[r+i][c+j]=(i===0||i===6||j===0||j===6||(i>=2&&i<=4&&j>=2&&j<=4));}};
setFinder(0,0);setFinder(0,14);setFinder(14,0);
// Data from text hash
let h=0;for(let i=0;i<text.length;i++)h=((h<<5)-h)+text.charCodeAt(i);h=Math.abs(h);
for(let y=0;y<modules;y++)for(let x=0;x<modules;x++){
  if((x<8&&y<8)||(x>12&&y<8)||(x<8&&y>12))continue;
  h=((h*1103515245+12345)&0x7fffffff);
  if(h%3===0)matrix[y][x]=true;
}
const cs=size/modules;
let svg=`<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><rect width="${size}" height="${size}" fill="white" rx="4"/>`;
for(let y=0;y<modules;y++)for(let x=0;x<modules;x++){
  if(matrix[y][x])svg+=`<rect x="${x*cs}" y="${y*cs}" width="${cs}" height="${cs}" fill="black"/>`;
}
return svg+'</svg>';
}
function cQR(){
const base='https://forge-coaching.github.io';
return `<div style="margin-bottom:16px"><h2 style="font-family:var(--fs);font-style:italic;font-size:1.6rem">QR Codes</h2><p style="color:var(--t3);font-size:.8rem">Partagez le QR code pour que vos clients accèdent à leur espace</p></div>
<div class="qr-grid">${S.clients.filter(c=>c.active).map(c=>{
const url=`${base}?client=${c.id}`;
return `<div class="qr-card">
<div class="av av-m" style="background:${c.color||'var(--ac)'};color:#000;margin:0 auto 8px">${IN(c.first_name,c.last_name)}</div>
<div style="font-weight:700;font-size:.88rem">${c.first_name} ${c.last_name}</div>
<div style="font-size:.65rem;color:var(--t3);margin-top:2px">${c.email||''}</div>
<div style="background:#fff;border-radius:8px;padding:8px;display:inline-block;margin:12px 0">${genQR(c.first_name+c.last_name+c.id)}</div>
<div style="display:flex;gap:6px;justify-content:center">
<button class="b bg bsm" onclick="navigator.clipboard?.writeText('${url}');toast('Lien copié !')">📋 Copier</button>
<button class="b bs bsm" onclick="printQR(${c.id})">🖨️ Imprimer</button>
</div></div>`;}).join('')||'<div style="color:var(--t4);text-align:center;padding:30px">Aucun client actif</div>'}</div>`;
}
function printQR(cid){
const c=S.clients.find(x=>x.id===cid);if(!c)return;
const qr=genQR(c.first_name+c.last_name+c.id,200);
const win=window.open('','_blank','width=400,height=500');
win.document.write('<html><head><title>QR - '+c.first_name+'</title><style>body{font-family:Arial;text-align:center;padding:40px}h1{font-size:28px;margin-bottom:4px}p{color:#666;margin-bottom:20px}.qr{display:inline-block;padding:16px;border:2px solid #000;border-radius:8px}small{color:#999;display:block;margin-top:16px}</style></head><body><h1>FORGE</h1><p>Espace client de <strong>'+c.first_name+' '+c.last_name+'</strong></p><div class="qr">'+qr+'</div><br><small>Scannez ce QR code pour accéder à votre espace coaching</small></body></html>');
win.document.close();
setTimeout(()=>win.print(),500);
}

// ===== COACH: STATS =====
function cStats(){
const done=S.sessions.filter(s=>s.status==='done').length;const goals={};S.clients.forEach(c=>{if(c.goal)goals[c.goal]=(goals[c.goal]||0)+1});const mg=Math.max(...Object.values(goals),1);
return `<div style="margin-bottom:16px"><h2 style="font-family:var(--fs);font-style:italic;font-size:1.6rem">Statistiques</h2></div>
<div class="pills"><div class="pill"><div class="pill-v" style="color:var(--ac)">${S.clients.filter(c=>c.active).length}</div><div class="pill-l">Clients actifs</div></div><div class="pill"><div class="pill-v" style="color:var(--blu)">${S.sessions.length}</div><div class="pill-l">Séances</div></div><div class="pill"><div class="pill-v" style="color:var(--grn)">${done}</div><div class="pill-l">Terminées</div></div><div class="pill"><div class="pill-v" style="color:var(--org)">${S.surveys.length}</div><div class="pill-l">Avis</div></div></div>
<div class="g2"><div class="card"><div class="card-h"><h3>Objectifs</h3></div><div class="card-b">${Object.entries(goals).map(([g,n])=>`<div style="margin-bottom:8px"><div style="display:flex;justify-content:space-between;font-size:.75rem;margin-bottom:2px"><span>${g}</span><span style="font-family:var(--fm);color:var(--ac)">${n}</span></div><div class="mbar"><div class="mfill" style="width:${n/mg*100}%;background:var(--ac)"></div></div></div>`).join('')||'—'}</div></div>
<div class="card"><div class="card-h"><h3>Complétion</h3></div><div class="card-b" style="text-align:center"><div style="font-family:var(--fs);font-style:italic;font-size:2.5rem;color:var(--ac)">${S.sessions.length?Math.round(done/S.sessions.length*100):0}%</div><div class="lb" style="margin-top:3px">séances terminées</div></div></div></div>`;
}
function cCalories(){
return `<div style="margin-bottom:16px"><h2 style="font-family:var(--fs);font-style:italic;font-size:1.6rem">Calculateur calorique</h2><p style="color:var(--t3);font-size:.8rem">Mifflin-St Jeor · Valeurs indicatives</p></div>
<div class="card"><div class="card-b">
<div class="fg"><label class="lb">Client</label><select id="calCl" onchange="fillCalForm()"><option value="">Choisir un client...</option>${S.clients.map(c=>`<option value="${c.id}">${c.first_name} ${c.last_name}</option>`).join('')}</select></div>
<div class="g4"><div class="fg"><label class="lb">Âge</label><input id="calAge" type="number" placeholder="25"></div><div class="fg"><label class="lb">Poids (kg)</label><input id="calW" type="number" placeholder="75"></div><div class="fg"><label class="lb">Taille (cm)</label><input id="calH" type="number" placeholder="178"></div><div class="fg"><label class="lb">Sexe</label><select id="calG"><option value="male">Homme</option><option value="female">Femme</option></select></div></div>
<div class="g2"><div class="fg"><label class="lb">Niveau d'activité</label><select id="calAc"><option value="sedentary">Sédentaire (bureau)</option><option value="light">Peu actif (1-2x/sem)</option><option value="moderate" selected>Modéré (3-5x/sem)</option><option value="active">Actif (6-7x/sem)</option><option value="extreme">Très actif (2x/jour)</option></select></div><div class="fg"><label class="lb">Objectif</label><select id="calGo"><option value="maintain">Maintien</option><option value="muscle">Prise de masse (+350)</option><option value="lose">Perte de poids (-500)</option><option value="tone">Tonification (-200)</option><option value="endurance">Endurance (+200)</option></select></div></div>
<button class="b bp" onclick="calcKcal()" style="width:100%;justify-content:center">Calculer mes besoins</button>
</div></div><div id="calResult"></div>`;
}
function fillCalForm(){
const id=+document.getElementById('calCl')?.value;if(!id)return;
const c=S.clients.find(x=>x.id===id);if(!c)return;
if(c.age)document.getElementById('calAge').value=c.age;
if(c.weight)document.getElementById('calW').value=c.weight;
if(c.height)document.getElementById('calH').value=c.height;
if(c.gender)document.getElementById('calG').value=c.gender;
if(c.activity)document.getElementById('calAc').value=c.activity;
if(c.goal==='Prise de masse')document.getElementById('calGo').value='muscle';
else if(c.goal==='Perte de poids')document.getElementById('calGo').value='lose';
else if(c.goal==='Performance')document.getElementById('calGo').value='endurance';
}

// Shared calculator for coach + client
function kcalCalc(isClient){
return `<div style="margin-bottom:16px"><h2 style="font-family:var(--fs);font-style:italic;font-size:1.6rem">${isClient?'Mes objectifs':'Calculateur calorique'}</h2><p style="color:var(--t3);font-size:.8rem">Mifflin-St Jeor · Valeurs indicatives</p></div>
<div class="card"><div class="card-b">
<div class="g4"><div class="fg"><label class="lb">Âge</label><input id="calAge" type="number" value="${isClient&&S.clients[0]?S.clients[0].age||25:''}" placeholder="25"></div><div class="fg"><label class="lb">Poids (kg)</label><input id="calW" type="number" value="${isClient&&S.clients[0]?S.clients[0].weight||70:''}" placeholder="75"></div><div class="fg"><label class="lb">Taille (cm)</label><input id="calH" type="number" value="${isClient&&S.clients[0]?S.clients[0].height||175:''}" placeholder="178"></div><div class="fg"><label class="lb">Sexe</label><select id="calG"><option value="male" ${isClient&&S.clients[0]?.gender==='male'?'selected':''}>Homme</option><option value="female" ${isClient&&S.clients[0]?.gender==='female'?'selected':''}>Femme</option></select></div></div>
<div class="g2"><div class="fg"><label class="lb">Niveau d'activité</label><select id="calAc"><option value="sedentary">Sédentaire</option><option value="light">Peu actif (1-2x/sem)</option><option value="moderate" ${isClient&&S.clients[0]?.activity==='moderate'?'selected':''}>Modéré (3-5x/sem)</option><option value="active" ${isClient&&S.clients[0]?.activity==='active'?'selected':''}>Actif (6-7x/sem)</option><option value="extreme" ${isClient&&S.clients[0]?.activity==='extreme'?'selected':''}>Très actif</option></select></div><div class="fg"><label class="lb">Objectif</label><select id="calGo"><option value="maintain">Maintien</option><option value="muscle">Prise de masse</option><option value="lose">Perte de poids</option><option value="tone">Tonification</option><option value="endurance">Endurance</option></select></div></div>
<button class="b bp" onclick="calcKcal()" style="width:100%;justify-content:center">Calculer</button>
</div></div><div id="calResult"></div>`;
}
function clKcal(){return kcalCalc(true);}

// Client performances page
function clPerf(){
const mc=S.clients[0];if(!mc)return '<div style="padding:30px;text-align:center;color:var(--t3)">Pas encore lié à un coach.</div>';
return `<div style="margin-bottom:16px"><h2 style="font-family:var(--fs);font-style:italic;font-size:1.6rem">Mes performances</h2></div><div id="clPerfData"><div class="loading" style="min-height:auto;padding:20px">Chargement...</div></div>`;
}
async function showClPerf(){
const mc=S.clients[0];if(!mc)return;
const data=await loadPerfs(mc.id);
const el=document.getElementById('clPerfData');if(!el)return;
if(!data.length){el.innerHTML='<div class="card"><div class="card-b" style="text-align:center;color:var(--t4);padding:24px">Aucune performance enregistrée par votre coach</div></div>';return;}
const exs=[...new Set(data.map(p=>p.exercise))];
el.innerHTML=exs.map(ex=>{const d=data.filter(p=>p.exercise===ex);const mx=Math.max(...d.map(x=>x.weight||1));return `<div class="card"><div class="card-h"><h3>${ex}</h3><span class="badge ba">${d[d.length-1].weight}kg × ${d[d.length-1].reps}</span></div><div class="card-b"><div class="perf-bars">${d.map((x,i)=>`<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;height:100px;justify-content:flex-end"><span style="font-size:.55rem;font-family:var(--fm);color:var(--ac)">${x.weight}kg</span><div style="width:100%;max-width:24px;height:${x.weight/mx*100}%;background:var(--ac);border-radius:3px 3px 0 0;opacity:${.4+i/d.length*.6}"></div><span style="font-size:.5rem;color:var(--t4)">${x.date?.slice(5)||''}</span></div>`).join('')}</div><div style="display:flex;justify-content:space-between;font-size:.7rem;color:var(--t3);margin-top:6px"><span>${d[0].weight}→${d[d.length-1].weight}kg</span><span style="color:var(--grn)">+${(d[d.length-1].weight-d[0].weight).toFixed(1)}kg</span></div></div></div>`;}).join('');
}
setTimeout(()=>{if(S.pg==='cl-perf')showClPerf()},50);

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
function clSurvey(){return `<div style="margin-bottom:16px"><h2 style="font-family:var(--fs);font-style:italic;font-size:1.6rem">Évaluations</h2></div>${S.surveys.map(s=>`<div class="card"><div class="card-b"><span style="color:var(--ac)">${'★'.repeat(s.global_rating||0)}${'☆'.repeat(5-(s.global_rating||0))}</span> <span style="font-size:.7rem;color:var(--t4)">${s.date||''}</span>${s.comments?`<p style="font-size:.8rem;color:var(--t2);margin-top:3px">"${s.comments}"</p>`:''}</div></div>`).join('')||'<div style="color:var(--t4);text-align:center;padding:30px">Aucune</div>'}`;}

// ===== CALORIES CALCULATOR (shared) =====
function calcKcal(){
const age=+document.getElementById('calAge')?.value||25;
const w=+document.getElementById('calW')?.value||70;
const h=+document.getElementById('calH')?.value||175;
const g=document.getElementById('calG')?.value||'male';
const ac=document.getElementById('calAc')?.value||'moderate';
const go=document.getElementById('calGo')?.value||'maintain';
if(!w||!h){toast('Remplissez poids et taille','err');return;}
const bmr=g==='male'?10*w+6.25*h-5*age+5:10*w+6.25*h-5*age-161;
const mult={sedentary:1.2,light:1.375,moderate:1.55,active:1.725,extreme:1.9};
const tdee=Math.round(bmr*(mult[ac]||1.55));
let adj=0,pm=1.8,gl='Maintien';
if(go==='muscle'){adj=350;pm=2.2;gl='Prise de masse';}
else if(go==='lose'){adj=-500;pm=2.4;gl='Perte de poids';}
else if(go==='tone'){adj=-200;pm=2;gl='Tonification';}
else if(go==='endurance'){adj=200;pm=1.6;gl='Endurance';}
const t=Math.max(tdee+adj,1200);
const prot=Math.round(w*pm),fat=Math.round(t*.25/9),carbs=Math.round((t-prot*4-fat*9)/4);
const pp=Math.round(prot*4/t*100),fp=Math.round(fat*9/t*100),cp=100-pp-fp;
const imc=(w/((h/100)**2)).toFixed(1);
document.getElementById('calResult').innerHTML=`
<div class="card" style="margin-top:14px"><div class="card-b">
<div style="text-align:center;margin-bottom:16px"><div style="font-size:.55rem;font-weight:600;text-transform:uppercase;letter-spacing:2px;color:var(--t4);margin-bottom:4px">Vos besoins journaliers</div><div style="font-family:var(--fs);font-size:3rem;color:var(--ac);line-height:1;font-weight:700">${t}</div><div style="font-size:.7rem;color:var(--t3);margin-top:2px">kcal/jour · ${gl}</div></div>
<div class="g4" style="text-align:center;margin-bottom:16px">
<div style="background:var(--bg3);padding:12px 8px;border-radius:var(--r2)"><div style="font-family:var(--fs);font-size:1.4rem;color:var(--ac);font-weight:700">${prot}g</div><div style="font-size:.5rem;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:var(--t4);margin-top:2px">Protéines</div><div style="font-size:.6rem;color:var(--t3)">${pm}g/kg</div></div>
<div style="background:var(--bg3);padding:12px 8px;border-radius:var(--r2)"><div style="font-family:var(--fs);font-size:1.4rem;color:var(--org);font-weight:700">${carbs}g</div><div style="font-size:.5rem;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:var(--t4);margin-top:2px">Glucides</div><div style="font-size:.6rem;color:var(--t3)">${cp}%</div></div>
<div style="background:var(--bg3);padding:12px 8px;border-radius:var(--r2)"><div style="font-family:var(--fs);font-size:1.4rem;color:var(--red);font-weight:700">${fat}g</div><div style="font-size:.5rem;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:var(--t4);margin-top:2px">Lipides</div><div style="font-size:.6rem;color:var(--t3)">${fp}%</div></div>
<div style="background:var(--bg3);padding:12px 8px;border-radius:var(--r2)"><div style="font-family:var(--fs);font-size:1.4rem;color:var(--blu);font-weight:700">${imc}</div><div style="font-size:.5rem;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:var(--t4);margin-top:2px">IMC</div></div>
</div>
<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;font-size:.7rem;margin-bottom:3px"><span>Répartition calorique</span></div>
<div style="display:flex;height:8px;border-radius:4px;overflow:hidden"><div style="width:${pp}%;background:var(--ac)"></div><div style="width:${cp}%;background:var(--org)"></div><div style="width:${fp}%;background:var(--red)"></div></div>
<div style="display:flex;justify-content:space-between;margin-top:4px;font-size:.6rem;color:var(--t4)"><span style="color:var(--ac)">Prot ${pp}%</span><span style="color:var(--org)">Gluc ${cp}%</span><span style="color:var(--red)">Lip ${fp}%</span></div></div>
<div style="display:flex;justify-content:space-between;font-size:.72rem;color:var(--t3);padding-top:10px;border-top:var(--border)"><span>BMR: ${Math.round(bmr)} kcal</span><span>TDEE: ${tdee} kcal</span><span>Ajust: ${adj>0?'+':''}${adj}</span></div>
</div></div>`;
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
