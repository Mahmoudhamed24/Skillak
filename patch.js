/* ═══════════════════════════════════════════════════════════════════
   patch.js — Skillak Platform v3.0
   ═══════════════════════════════════════════════════════════════════
   ✅ غرفة انتظار الجلسة مع تفاصيل كاملة
   ✅ زر إنهاء الجلسة في قسم "جلساتي"
   ✅ الجلسة نشطة حتى يضغط إنهاء أو ينتهي الوقت
   ✅ تحويل الأرباح للمعلم + اعتماد الأدمن
   ✅ تحديث صورة البروفيل لحظياً
   ✅ تحديث العمولة تلقائياً
   ✅ لوحة مزدوجة للمسجل كطالب ومعلم
   ✅ قائمة دول كاملة برموزها
   ✅ تصميم احترافي متجاوب
   ═══════════════════════════════════════════════════════════════════ */
'use strict';

function _e(id){return document.getElementById(id);}
function _esc(v){return String(v||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
function _fmt(n){return Number(n||0).toFixed(2);}

/* ══════════════════════════════════════════════════════
   1. COUNTRIES
   ══════════════════════════════════════════════════════ */
const COUNTRIES=[
  {code:'EG',name:'مصر',dial:'+20'},{code:'SA',name:'السعودية',dial:'+966'},
  {code:'AE',name:'الإمارات',dial:'+971'},{code:'KW',name:'الكويت',dial:'+965'},
  {code:'QA',name:'قطر',dial:'+974'},{code:'BH',name:'البحرين',dial:'+973'},
  {code:'OM',name:'عُمان',dial:'+968'},{code:'JO',name:'الأردن',dial:'+962'},
  {code:'LB',name:'لبنان',dial:'+961'},{code:'SY',name:'سوريا',dial:'+963'},
  {code:'IQ',name:'العراق',dial:'+964'},{code:'YE',name:'اليمن',dial:'+967'},
  {code:'LY',name:'ليبيا',dial:'+218'},{code:'TN',name:'تونس',dial:'+216'},
  {code:'DZ',name:'الجزائر',dial:'+213'},{code:'MA',name:'المغرب',dial:'+212'},
  {code:'MR',name:'موريتانيا',dial:'+222'},{code:'SD',name:'السودان',dial:'+249'},
  {code:'SO',name:'الصومال',dial:'+252'},{code:'KM',name:'جزر القمر',dial:'+269'},
  {code:'DJ',name:'جيبوتي',dial:'+253'},{code:'PS',name:'فلسطين',dial:'+970'},
  {code:'TR',name:'تركيا',dial:'+90'},{code:'PK',name:'باكستان',dial:'+92'},
  {code:'IN',name:'الهند',dial:'+91'},{code:'US',name:'أمريكا',dial:'+1'},
  {code:'GB',name:'بريطانيا',dial:'+44'},{code:'DE',name:'ألمانيا',dial:'+49'},
  {code:'FR',name:'فرنسا',dial:'+33'},{code:'CA',name:'كندا',dial:'+1'},
  {code:'AU',name:'أستراليا',dial:'+61'},{code:'NL',name:'هولندا',dial:'+31'},
  {code:'SE',name:'السويد',dial:'+46'},{code:'NO',name:'النرويج',dial:'+47'},
  {code:'IT',name:'إيطاليا',dial:'+39'},{code:'ES',name:'إسبانيا',dial:'+34'},
  {code:'PT',name:'البرتغال',dial:'+351'},{code:'CH',name:'سويسرا',dial:'+41'},
  {code:'BE',name:'بلجيكا',dial:'+32'},{code:'AT',name:'النمسا',dial:'+43'},
  {code:'PL',name:'بولندا',dial:'+48'},{code:'RU',name:'روسيا',dial:'+7'},
  {code:'CN',name:'الصين',dial:'+86'},{code:'JP',name:'اليابان',dial:'+81'},
  {code:'KR',name:'كوريا',dial:'+82'},{code:'NG',name:'نيجيريا',dial:'+234'},
  {code:'ZA',name:'جنوب أفريقيا',dial:'+27'},{code:'KE',name:'كينيا',dial:'+254'},
  {code:'GH',name:'غانا',dial:'+233'},{code:'BR',name:'البرازيل',dial:'+55'},
  {code:'MX',name:'المكسيك',dial:'+52'},{code:'SG',name:'سنغافورة',dial:'+65'},
  {code:'MY',name:'ماليزيا',dial:'+60'},{code:'ID',name:'إندونيسيا',dial:'+62'},
  {code:'PH',name:'الفلبين',dial:'+63'},{code:'BD',name:'بنغلاديش',dial:'+880'},
  {code:'IR',name:'إيران',dial:'+98'},{code:'AF',name:'أفغانستان',dial:'+93'},
];

function _injectCountries(){
  ['r3Cnt','epCnt'].forEach(id=>{
    const el=_e(id); if(!el) return;
    el.innerHTML='<option value="">— اختر الدولة —</option>'+
      COUNTRIES.map(c=>`<option value="${c.name}">${c.name} ${c.dial}</option>`).join('');
  });
}

/* ══════════════════════════════════════════════════════
   2. SESSION — waiting room
   ══════════════════════════════════════════════════════ */
const _orig_enterSession=window.enterSession;
window.enterSession=async function(bookingId){
  try{
    const bS=await db.collection('bookings').doc(bookingId).get();
    if(!bS.exists){showT('لم يتم العثور على الجلسة','err');return;}
    const bk=bS.data();
    const isTutor=bk.tutorId===CU?.uid;
    const other=isTutor?bk.studentName:bk.tutorName;
    const tData=!isTutor?(allT?.find(t=>t.id===bk.tutorId)||{}):{};
    const avBg=tData.color||'#fde68a';
    const avHTML=tData.photo
      ?`<img src="${tData.photo}" class="swr-photo">`
      :`<div class="swr-initials" style="background:${avBg}">${(other||'؟')[0]}</div>`;

    const waitEl=_e('waitOv');
    if(waitEl){
      waitEl.innerHTML=`<div class="swr-inner">
        <div class="swr-logo">Skill<span>ak</span></div>
        <div class="swr-av">${avHTML}</div>
        <h3 class="swr-name">${_esc(other||'—')}</h3>
        <p class="swr-role">${isTutor?'طالبك في هذه الجلسة':'معلمك في هذه الجلسة'}</p>
        <div class="swr-grid">
          <div class="swr-cell"><span class="swr-ic">📅</span><div class="swr-val">${_esc(bk.date||'—')}</div><div class="swr-lbl">التاريخ</div></div>
          <div class="swr-cell"><span class="swr-ic">⏰</span><div class="swr-val">${_esc(bk.timeLbl||bk.time||'—')}</div><div class="swr-lbl">الوقت</div></div>
          <div class="swr-cell"><span class="swr-ic">⏱️</span><div class="swr-val">${bk.duration||60} د</div><div class="swr-lbl">المدة</div></div>
          <div class="swr-cell"><span class="swr-ic">💰</span><div class="swr-val">${_fmt(bk.price)} ج</div><div class="swr-lbl">السعر</div></div>
        </div>
        ${bk.note?`<div class="swr-note">📝 ${_esc(bk.note)}</div>`:''}
        <div class="swr-status"><div class="swr-spin"></div><span>في انتظار ${_esc(isTutor?'الطالب':'المعلم')}…</span></div>
        <p class="swr-tip">💡 تأكد من إضاءة جيدة وإنترنت مستقر</p>
      </div>`;
    }
    const titleEl=_e('sesTitle');
    if(titleEl) titleEl.textContent=`جلسة مع ${other||'—'} • ${bk.date||''} ${bk.timeLbl||bk.time||''}`;
    _startSesCountdown(bk);
  }catch(e){console.warn('[patch] enterSession pre-render:',e);}
  return _orig_enterSession(bookingId);
};

let _sesCountdownInterval=null;
function _startSesCountdown(bk){
  if(_sesCountdownInterval) clearInterval(_sesCountdownInterval);
  const endMs=_getEndMs2(bk); if(!endMs) return;
  let cdEl=_e('sesCountdown');
  if(!cdEl){
    cdEl=document.createElement('div');
    cdEl.id='sesCountdown'; cdEl.className='ses-countdown';
    const bar=document.querySelector('.sesbar');
    if(bar) bar.appendChild(cdEl);
  }
  function tick(){
    const rem=endMs-Date.now();
    if(rem<=0){cdEl.textContent='⏰ انتهى الوقت';cdEl.classList.add('expired');clearInterval(_sesCountdownInterval);return;}
    const m=Math.floor(rem/60000),s=Math.floor((rem%60000)/1000);
    cdEl.textContent=`⏳ ${m}:${String(s).padStart(2,'0')} متبقي`;
    if(m<5) cdEl.classList.add('warning'); else cdEl.classList.remove('warning');
  }
  tick(); _sesCountdownInterval=setInterval(tick,1000);
}

function _getEndMs2(bk){
  if(!bk) return 0;
  if(bk.sessionEndsAtMs) return Number(bk.sessionEndsAtMs)||0;
  const d=bk.date,t=bk.time||bk.timeLbl;
  if(!d||!t) return 0;
  const s=new Date(`${d}T${String(t).slice(0,5)}:00`);
  return isNaN(s)?0:s.getTime()+Number(bk.duration||60)*60000;
}

/* ══════════════════════════════════════════════════════
   3. endSession
   ══════════════════════════════════════════════════════ */
window.endSession=async function(){
  if(_sesCountdownInterval) clearInterval(_sesCountdownInterval);
  const _bid=curSesBid,_bk=curSesBk;
  if(!_bid||!_bk){_cleanupMedia();if(_e('mainNav'))_e('mainNav').style.display='';go('dashboard');return;}
  const mins=Math.floor(sesSec/60),secs=sesSec%60;
  const durStr=mins>0?`${mins} دقيقة ${secs>0?'و'+secs+' ثانية':''}`:`${secs} ثانية`;
  if(!confirm(`إنهاء الجلسة الآن؟\nمدة الجلسة: ${durStr}`)) return;
  _cleanupMedia();
  const isTutor=_bk.tutorId===CU?.uid;
  try{
    const bSnap=await db.collection('bookings').doc(_bid).get();
    const bkLive=bSnap.exists?bSnap.data():_bk;
    const endMs=_getEndMs2(bkLive);
    const stillTime=endMs&&Date.now()<endMs;
    if(stillTime){
      await db.collection('bookings').doc(_bid).set({status:'paused',lastPausedAt:firebase.firestore.FieldValue.serverTimestamp(),sessionEndsAtMs:endMs},{merge:true}).catch(()=>{});
      await db.collection('sessions').doc(_bid).set({status:'paused',pausedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true}).catch(()=>{});
      showT('⏸️ تم إيقاف الجلسة مؤقتاً — يمكنك العودة قبل انتهاء الوقت','inf');
      curSesBid=null;curSesBk=null;
      if(_e('mainNav'))_e('mainNav').style.display='';
      go('dashboard');setTimeout(()=>{if(typeof dNav==='function')dNav('sessions');},300);return;
    }
    await db.collection('bookings').doc(_bid).update({status:'completed',completedAt:firebase.firestore.FieldValue.serverTimestamp(),actualDuration:sesSec?Math.ceil(sesSec/60):(_bk.duration||60)}).catch(()=>{});
    await db.collection('sessions').doc(_bid).set({status:'ended',endedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true}).catch(()=>{});
    await _doTransferEarnings(_bid,bkLive);
    curSesBid=null;curSesBk=null;
    if(_e('mainNav'))_e('mainNav').style.display='';
    go('dashboard');setTimeout(()=>{if(typeof dNav==='function')dNav('sessions');},200);
    setTimeout(()=>{_openReviewAfterSession(_bid,bkLive,isTutor);},900);
  }catch(e){
    console.error('[patch] endSession:',e);
    curSesBid=null;curSesBk=null;
    if(_e('mainNav'))_e('mainNav').style.display='';
    go('dashboard');setTimeout(()=>{_openReviewAfterSession(_bid,_bk,isTutor);},900);
  }
};

function _cleanupMedia(){
  if(typeof sesTInt!=='undefined'&&sesTInt){clearInterval(sesTInt);}
  if(typeof sesChatL!=='undefined'&&sesChatL){try{sesChatL();}catch(e){}}
  if(typeof pc!=='undefined'&&pc){try{pc.close();}catch(e){}pc=null;}
  if(typeof locSt!=='undefined'&&locSt){locSt.getTracks().forEach(t=>t.stop());locSt=null;}
  if(typeof scrSt!=='undefined'&&scrSt){try{scrSt.getTracks().forEach(t=>t.stop());}catch(e){}scrSt=null;}
}

async function _doTransferEarnings(bid,bk){
  try{
    const tutorNet=+(Number(bk.price||0)-Number(bk.tutorFee??bk.fee??0)).toFixed(2);
    if(tutorNet<=0||bk.adminConfirmed) return;
    const settSnap=await db.collection('settings').doc('platform').get().catch(()=>null);
    const autoTransfer=settSnap?.exists?(settSnap.data().autoTransfer!==false):true;
    if(!autoTransfer) return;
    await db.runTransaction(async tx=>{
      const wr=db.collection('wallets').doc(bk.tutorId);
      const ws=await tx.get(wr);
      const wb=ws.exists?(ws.data().balance||0):0;
      tx.set(wr,{balance:+(wb+tutorNet).toFixed(2),userId:bk.tutorId},{merge:true});
      tx.update(db.collection('bookings').doc(bid),{adminConfirmed:true,tutorPaidAt:firebase.firestore.FieldValue.serverTimestamp(),tutorNetAmount:tutorNet});
    });
    await db.collection('transactions').add({
      userId:bk.tutorId,type:'credit',kind:'session_earnings',
      amount:tutorNet,currency:'EGP',status:'approved',bookingId:bid,
      description:`أرباح جلسة مع ${bk.studentName||'طالب'} — ${bk.date||''}`,
      createdAt:firebase.firestore.FieldValue.serverTimestamp()
    });
    if(CU?.uid===bk.tutorId){
      walBal=+(walBal+tutorNet).toFixed(2);
      const nw=_e('nwAmt');if(nw) nw.textContent=walBal.toFixed(2)+' ج.م';
    }
  }catch(e){console.warn('[patch] transfer:',e);}
}

function _openReviewAfterSession(bid,bk,isTutor){
  if(!bid||!bk) return;
  revBid=bid; revTid=isTutor?bk.studentId:bk.tutorId;
  const reviewee=isTutor?bk.studentName:bk.tutorName;
  const ti=_e('revTutorInfo');
  if(ti){
    const avBg=typeof ABG!=='undefined'?ABG[((reviewee||'')[0]?.charCodeAt(0)||0)%ABG.length]:'#fde68a';
    const photo=!isTutor?(allT?.find(t=>t.id===bk.tutorId)||{}).photo||'':'';
    const avHTML=photo?`<img src="${photo}" style="width:44px;height:44px;border-radius:50%;object-fit:cover">`
      :`<div style="width:44px;height:44px;border-radius:50%;background:${avBg};display:flex;align-items:center;justify-content:center;font-weight:900;font-size:1.1rem">${(reviewee||'؟')[0]}</div>`;
    ti.innerHTML=`${avHTML}<div><div style="font-weight:700;font-size:.9rem">${_esc(reviewee)}</div><div style="font-size:.75rem;color:var(--muted)">${isTutor?'طالب':'معلم'} · ${bk.date||''}</div></div>`;
  }
  const sub=_e('revSub');
  if(sub) sub.textContent=isTutor?`كيف كان أداء الطالب ${reviewee}؟`:`كيف كانت جلستك مع ${reviewee}؟`;
  if(typeof setSt==='function') setSt(0);
  const cmt=_e('revCmt'); if(cmt) cmt.value='';
  if(typeof openM==='function') openM('revMod');
}

/* ══════════════════════════════════════════════════════
   4. End session from dashboard
   ══════════════════════════════════════════════════════ */
window.endSessionFromDash=async function(bid){
  if(!bid) return;
  if(!confirm('إنهاء هذه الجلسة نهائياً؟')) return;
  try{
    const bSnap=await db.collection('bookings').doc(bid).get();
    if(!bSnap.exists){showT('لم يتم العثور على الجلسة','err');return;}
    const bk=bSnap.data();
    await db.collection('bookings').doc(bid).update({status:'completed',completedAt:firebase.firestore.FieldValue.serverTimestamp()});
    await db.collection('sessions').doc(bid).set({status:'ended',endedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true}).catch(()=>{});
    await _doTransferEarnings(bid,bk);
    showT('✅ تم إنهاء الجلسة','suc');
    if(bk.studentId===CU?.uid&&!bk.reviewed) setTimeout(()=>{_openReviewAfterSession(bid,bk,false);},600);
    if(typeof dNav==='function') setTimeout(()=>dNav('sessions'),300);
  }catch(e){showT('خطأ: '+e.message,'err');}
};

/* ══════════════════════════════════════════════════════
   5. bkTblHTML — End session button
   ══════════════════════════════════════════════════════ */
const _orig_bkTblHTML=window.bkTblHTML;
window.bkTblHTML=function(list){
  if(!list||!list.length) return _orig_bkTblHTML(list);
  const stL={pending:'⏳ بانتظار الموافقة',confirmed:'✅ مؤكد',active:'🔴 نشطة',paused:'⏸️ متوقفة مؤقتاً',completed:'🏁 مكتملة',cancelled:'❌ ملغية',refunded:'↩️ مستردة'};
  const stCls={pending:'pp',confirmed:'pc',active:'pc',paused:'pp',completed:'pco',cancelled:'pca',refunded:'pc'};
  const isMobile=window.innerWidth<=768;

  const rows=list.map(b=>{
    const isS=b.studentId===CU?.uid,isTut=b.tutorId===CU?.uid;
    const other=isS?b.tutorName:b.studentName;
    const otherUid=isS?b.tutorId:b.studentId;
    const canJoin=window.canJoinSession?window.canJoinSession(b):['confirmed','active','paused'].includes(b.status);
    const canRev=isS&&b.status==='completed'&&!b.reviewed;
    const canCan=isS&&b.status==='pending';
    const canTutorAct=isTut&&b.status==='pending';
    const canEndDash=(isS||isTut)&&['confirmed','active','paused'].includes(b.status);
    const canChat=otherUid&&CU?.uid!==otherUid;
    const safeName=_esc(other||'—').replace(/'/g,"\\'");
    const safeUid=(otherUid||'').replace(/'/g,"\\'");
    const avBg=typeof ABG!=='undefined'?ABG[(other?.charCodeAt(0)||0)%ABG.length]:'#fde68a';
    const acts=`
      ${canTutorAct?`<button class="btn btn-s btn-xs" onclick="tutorApproveBk('${b.id}','${b.studentId}',${b.total||b.price||0})">✅ موافقة</button><button class="btn btn-d btn-xs" onclick="tutorRejectBk('${b.id}','${b.studentId}',${b.total||b.price||0})">❌ رفض</button>`:''}
      ${canJoin?`<button class="btn btn-xs btn-enter-session" onclick="enterSession('${b.id}')">🎥 دخول الجلسة</button>`:''}
      ${canEndDash?`<button class="btn btn-xs btn-end-dash" onclick="endSessionFromDash('${b.id}')">⏹ إنهاء</button>`:''}
      ${canChat?`<button class="btn btn-xs" style="background:var(--wa-green);color:#fff" onclick="openChatWith('${safeUid}','${safeName}','','','','${_esc((other||'؟')[0])}')">💬 شات</button>`:''}
      ${canRev?`<button class="btn btn-a btn-xs" onclick="openRevFromBk('${b.id}','${b.tutorId}','${_esc(b.tutorName||'')}')">⭐ قيّم</button>`:''}
      ${canCan?`<button class="btn btn-xs" style="background:transparent;color:var(--red);border:1.5px solid var(--red);border-radius:var(--rxs)" onclick="cancelBk('${b.id}',${b.total||b.price||0})">إلغاء</button>`:''}
      ${!canTutorAct&&!canJoin&&!canEndDash&&!canRev&&!canCan&&!canChat?'<span style="color:var(--muted);font-size:.78rem">—</span>':''}`;
    if(isMobile) return `<div class="bkcard${b.status==='active'?' bkcard-active':''}">
      <div class="bkcard-h">
        <div style="display:flex;align-items:center;gap:10px;min-width:0">
          <div class="tav" style="background:${avBg};flex-shrink:0">${_esc((other||'؟')[0])}</div>
          <div style="min-width:0"><div class="bkcard-title">${_esc(other||'—')}</div>
            <div class="bkcard-sub">${isS?'معلم':'طالب'} · ${_esc(b.date||'—')} · ${_esc(b.timeLbl||b.time||'')}</div>
          </div>
        </div>
        <span class="pill ${stCls[b.status]||'pp'}">${stL[b.status]||b.status}</span>
      </div>
      <div class="bkcard-meta">
        <span class="tag">⏱️ ${b.duration||60} دقيقة</span>
        <span class="tag tag-a">💰 ${_fmt(b.price)} ج.م</span>
      </div>
      <div class="bkcard-actions">${acts}</div>
    </div>`;
    return `<tr>
      <td><div style="display:flex;align-items:center;gap:9px"><div class="tav" style="background:${avBg}">${_esc((other||'؟')[0])}</div>
        <div><div style="font-weight:700;font-size:.87rem">${_esc(other||'—')}</div><div style="font-size:.71rem;color:var(--muted)">${isS?'معلم':'طالب'}</div></div></div></td>
      <td><div style="font-weight:600;font-size:.86rem">${_esc(b.date||'—')}</div><div style="font-size:.76rem;color:var(--muted)">${_esc(b.timeLbl||b.time||'')} · ${b.duration||60} دق</div></td>
      <td style="font-weight:700;color:var(--teal)">${_fmt(b.price)} ج.م</td>
      <td><span class="pill ${stCls[b.status]||'pp'}">${stL[b.status]||b.status}</span></td>
      <td><div style="display:flex;gap:4px;flex-wrap:wrap">${acts}</div></td>
    </tr>`;
  });

  if(isMobile) return `<div class="bkcards">${rows.join('')}</div>`;
  return `<div class="dtbl-wrap"><table class="dtbl"><thead><tr><th>الطرف الآخر</th><th>التاريخ والوقت</th><th>المبلغ</th><th>الحالة</th><th>إجراءات</th></tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
};

/* ══════════════════════════════════════════════════════
   6. Real-time profile photo
   ══════════════════════════════════════════════════════ */
let _profileListener=null;
function _startProfileListener(){
  if(!CU||_profileListener) return;
  _profileListener=db.collection('users').doc(CU.uid).onSnapshot(snap=>{
    if(!snap.exists) return;
    const d=snap.data();
    if(CP) Object.assign(CP,d);
    const photo=d.photo||'',name=d.name||'أ';
    const _av=(el)=>{ if(!el)return; if(photo){el.innerHTML=`<img src="${photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;}
      else{el.textContent=name[0];el.style.background=d.color||'var(--amber)';} };
    _av(_e('navAv')); _av(_e('sbAv'));
    const ep=_e('editAvPr');
    if(ep&&!window.selectedEditPhoto){if(photo)ep.innerHTML=`<img src="${photo}">`;else{ep.textContent=name[0];ep.style.background=d.color||'var(--amber)';}}
  },()=>{});
}

/* ══════════════════════════════════════════════════════
   7. Commission — hide platform profit from non-admin
   ══════════════════════════════════════════════════════ */
function _applyVisibility(){
  const isAdmin=CP?.role==='admin';
  if(isAdmin) document.body.classList.add('is-admin');
  else document.body.classList.remove('is-admin');
  /* Hide tutor fee + total fee rows in booking modal for non-admin */
  const tFeeEl=_e('bkTutorFee');
  if(tFeeEl){const row=tFeeEl.closest('.pline');if(row)row.style.display=isAdmin?'':'none';}
  const feeEl=_e('bkFee');
  if(feeEl){const row=feeEl.closest('.pline');if(row)row.style.display=isAdmin?'':'none';}
}

window.saveCommissionRates=async function(){
  if(CP?.role!=='admin'){showT('غير مصرح','err');return;}
  const sInp=_e('studentCommissionRateInput'),tInp=_e('tutorCommissionRateInput'),autoEl=_e('autoTransferToggle');
  if(!sInp||!tInp) return;
  const sR=parseFloat(sInp.value),tR=parseFloat(tInp.value);
  if(!Number.isFinite(sR)||sR<0||sR>50){showT('نسبة الطالب: 0–50%','err');return;}
  if(!Number.isFinite(tR)||tR<0||tR>50){showT('نسبة المعلم: 0–50%','err');return;}
  const btn=_e('saveCommissionBtn');
  if(btn){btn.disabled=true;btn.innerHTML='<span class="spin spin-sm spin-wh" style="display:inline-block"></span> جاري الحفظ…';}
  try{
    await db.collection('settings').doc('platform').set({
      studentCommissionRate:sR,tutorCommissionRate:tR,commissionRate:+(sR+tR).toFixed(2),
      autoTransfer:autoEl?autoEl.checked:true,
      updatedAt:firebase.firestore.FieldValue.serverTimestamp(),updatedBy:CU?.uid||'admin'
    },{merge:true});
    showT(`✅ عمولة الطالب ${sR}% + عمولة المعلم ${tR}% = ${+(sR+tR).toFixed(2)}% — تحدّثت فوراً`,'suc');
  }catch(e){showT('خطأ: '+e.message,'err');}
  finally{if(btn){btn.disabled=false;btn.innerHTML='💾 حفظ التغييرات';}}
};

const _orig_adTab=window.adTab;
window.adTab=async function(tab,el){
  const res=await _orig_adTab(tab,el);
  if(tab==='commission'){
    setTimeout(()=>{
      const btn=_e('saveCommissionBtn');
      if(btn&&!btn.dataset.hooked){btn.dataset.hooked='1';btn.onclick=window.saveCommissionRates;}
      if(!_e('autoTransferToggle')){
        const parent=btn?.parentNode;
        if(parent){
          const wrap=document.createElement('div');
          wrap.style.cssText='display:flex;align-items:center;gap:10px;margin-bottom:16px;padding:14px;background:var(--cream2);border-radius:12px';
          wrap.innerHTML=`<label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-weight:600;font-size:.87rem">
            <input type="checkbox" id="autoTransferToggle" checked style="width:18px;height:18px;accent-color:var(--teal)">
            تحويل الأرباح تلقائياً للمعلم عند انتهاء الجلسة
          </label><span class="pill pc" style="white-space:nowrap">موصى به</span>`;
          parent.insertBefore(wrap,btn);
          db.collection('settings').doc('platform').get().then(s=>{
            if(s.exists){const v=s.data().autoTransfer!==false;const cb=_e('autoTransferToggle');if(cb)cb.checked=v;}
          }).catch(()=>{});
        }
      }
    },120);
  }
  if(tab==='users') setTimeout(()=>_enhanceAdminUserRows(),60);
  if(tab==='reviews') setTimeout(async()=>{
    const con=_e('adCon');
    if(!con) return;
    try{
      const snap=await db.collection('reviews').get().catch(()=>({docs:[]}));
      const revs=snap.docs.map(d=>({id:d.id,...d.data()}));
      const byTutor={};
      revs.forEach(r=>{const id=r.tutorId;if(!id)return;if(!byTutor[id])byTutor[id]={name:r.tutorName||'—',revs:[],tot:0};byTutor[id].revs.push(r);byTutor[id].tot+=r.rating||0;});
      const byStudent={};
      revs.forEach(r=>{const id=r.studentId;if(!id)return;if(!byStudent[id])byStudent[id]={name:r.studentName||'—',revs:[],tot:0};byStudent[id].revs.push(r);byStudent[id].tot+=r.rating||0;});
      const tRows=Object.entries(byTutor).map(([uid,d])=>{
        const avg=d.revs.length?(d.tot/d.revs.length).toFixed(1):'—';
        return `<tr><td><strong>${_esc(d.name)}</strong></td><td style="text-align:center">${d.revs.length}</td><td style="text-align:center;color:var(--amber);font-weight:800">${avg} ⭐</td><td><button class="btn btn-xs btn-gh" onclick="window._adminShowTutorRevs('${uid}','${_esc(d.name)}')">عرض</button></td></tr>`;
      });
      const sRows=Object.entries(byStudent).map(([uid,d])=>{
        const avg=d.revs.length?(d.tot/d.revs.length).toFixed(1):'—';
        return `<tr><td><strong>${_esc(d.name)}</strong></td><td style="text-align:center">${d.revs.length}</td><td style="text-align:center;color:var(--teal);font-weight:700">${avg}</td></tr>`;
      });
      con.insertAdjacentHTML('beforeend',`
      <div class="dsec" style="margin-top:22px">
        <div class="dsech"><div class="dsect">👨‍🏫 تقييمات المعلمين</div><span class="pill pp">${tRows.length} معلم</span></div>
        <div style="overflow-x:auto"><table class="dtbl"><thead><tr><th>المعلم</th><th style="text-align:center">عدد</th><th style="text-align:center">المتوسط</th><th>تفاصيل</th></tr></thead><tbody>${tRows.join('')}</tbody></table></div>
        <div id="_tutorRevBox" style="display:none;padding:14px 0"></div>
      </div>
      <div class="dsec" style="margin-top:14px">
        <div class="dsech"><div class="dsect">🎓 نشاط الطلاب كمُقيِّمين</div><span class="pill pc">${sRows.length} طالب</span></div>
        <div style="overflow-x:auto"><table class="dtbl"><thead><tr><th>الطالب</th><th style="text-align:center">تقييمات أُعطيت</th><th style="text-align:center">متوسط ما أعطاه</th></tr></thead><tbody>${sRows.join('')}</tbody></table></div>
      </div>`);
    }catch(e){console.warn('[patch] reviews:',e);}
  },80);
  return res;
};

window._adminShowTutorRevs=async function(tutorId,name){
  const box=_e('_tutorRevBox');if(!box)return;
  box.style.display='block';box.innerHTML='<div style="padding:20px;text-align:center"><div class="spin" style="margin:auto"></div></div>';
  const snap=await db.collection('reviews').where('tutorId','==',tutorId).get().catch(()=>({docs:[]}));
  const revs=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
  box.innerHTML=`<div style="font-weight:800;margin-bottom:10px;color:var(--teal)">📋 تقييمات ${_esc(name)}</div>`+
    (revs.length?revs.map(r=>`<div style="background:var(--cream2);border-radius:10px;padding:10px 12px;margin-bottom:6px;display:flex;gap:10px">
      <div style="font-size:1.2rem">${'⭐'.repeat(r.rating||0)}</div>
      <div style="flex:1"><div style="font-weight:700;font-size:.83rem">${_esc(r.studentName||'—')}</div>
        <div style="font-size:.75rem;color:var(--muted)">${_esc(r.comment||'—')}</div>
        <div style="font-size:.67rem;color:var(--muted);margin-top:3px">${r.createdAt?.toDate?r.createdAt.toDate().toLocaleDateString('ar-EG'):'—'}</div></div>
      <button class="btn btn-d btn-xs" onclick="delRev('${r.id}',this)">🗑</button>
    </div>`).join(''):'<div style="color:var(--muted);padding:10px">لا توجد تقييمات</div>')+
    `<button class="btn btn-gh btn-sm" style="margin-top:8px" onclick="document.getElementById('_tutorRevBox').style.display='none'">إخفاء ↑</button>`;
};

/* ══════════════════════════════════════════════════════
   8. Admin complete booking & pay tutor
   ══════════════════════════════════════════════════════ */
window.adminCompleteBk=async function(bid,tutorId,price,fee){
  if(!confirm('تأكيد اكتمال الجلسة وتحويل الأرباح للمعلم؟')) return;
  try{
    const bSnap=await db.collection('bookings').doc(bid).get();
    const bk=bSnap.exists?bSnap.data():{price,tutorFee:fee,fee,tutorId};
    await db.collection('bookings').doc(bid).update({status:'completed',completedAt:firebase.firestore.FieldValue.serverTimestamp()});
    await _doTransferEarnings(bid,bk);
    showT('✅ تم تأكيد الاكتمال وتحويل الأرباح','suc');
    if(typeof adTab==='function'){const el=document.querySelector('.adminTab');if(el)adTab('bookings',el);}
  }catch(e){showT('خطأ: '+e.message,'err');}
};

/* ══════════════════════════════════════════════════════
   9. canJoinSession
   ══════════════════════════════════════════════════════ */
window.canJoinSession=function(bk){
  if(!CU||!bk) return false;
  const isParty=bk.studentId===CU.uid||bk.tutorId===CU.uid;
  if(!isParty) return false;
  return ['confirmed','active','paused'].includes(bk.status);
};

/* ══════════════════════════════════════════════════════
   10. Admin user chat button
   ══════════════════════════════════════════════════════ */
function _enhanceAdminUserRows(){
  document.querySelectorAll('#usersTbl tbody tr').forEach(row=>{
    const uid=row.getAttribute('data-uid');if(!uid)return;
    const td=row.querySelector('td:last-child');
    if(!td||td.querySelector('.adm-chat-btn')) return;
    const name=row.getAttribute('data-name')||'—',photo=row.getAttribute('data-photo')||'',
      color=row.getAttribute('data-color')||'',fg=row.getAttribute('data-fg')||'',emoji=row.getAttribute('data-emoji')||'؟';
    const btn=document.createElement('button');
    btn.className='btn btn-o btn-xs adm-chat-btn';btn.textContent='💬 شات';
    btn.onclick=()=>{if(typeof openChatWith==='function')openChatWith(uid,name,photo,color,fg,emoji);};
    td.prepend(btn);
  });
}

/* ══════════════════════════════════════════════════════
   11. Dual dashboard for "both"
   ══════════════════════════════════════════════════════ */
const _orig_rdOverview=window.rdOverview;
window.rdOverview=async function(el){
  if(!CU||!CP) return;
  if(CP.role!=='both') return _orig_rdOverview(el);
  el.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:200px"><div class="spin"></div></div>';
  try{
    const uid=CU.uid;
    const[sb,tb]=await Promise.all([
      db.collection('bookings').where('studentId','==',uid).get().catch(()=>({docs:[]})),
      db.collection('bookings').where('tutorId','==',uid).get().catch(()=>({docs:[]}))
    ]);
    const sBks=sb.docs.map(d=>({id:d.id,...d.data()}));
    const tBks=tb.docs.map(d=>({id:d.id,...d.data()}));
    const sComp=sBks.filter(b=>b.status==='completed').length;
    const sUp=sBks.filter(b=>['pending','confirmed','active','paused'].includes(b.status)).length;
    const tComp=tBks.filter(b=>b.status==='completed').length;
    const tUp=tBks.filter(b=>['pending','confirmed','active','paused'].includes(b.status)).length;
    const tPend=tBks.filter(b=>b.status==='pending').length;
    const tEarn=tBks.filter(b=>b.status==='completed').reduce((s,b)=>s+Number((b.price||0)-Number(b.tutorFee??b.fee??0)),0);
    const recent=[...sBks,...tBks].filter((b,i,a)=>a.findIndex(x=>x.id===b.id)===i)
      .sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0)).slice(0,8);
    el.innerHTML=`
    <div class="dashphdr">
      <div><div style="font-size:.7rem;font-weight:800;letter-spacing:.1em;color:var(--amber);margin-bottom:3px">لوحة مزدوجة</div>
        <div class="dashph">أهلاً، ${_esc(CP.name?.split(' ')[0]||'أهلاً')} 👋</div>
        <div style="font-size:.76rem;color:var(--muted);margin-top:2px">مسجّل كطالب ومعلم</div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-p" onclick="go('explore')">+ احجز جلسة</button>
        <button class="btn btn-gh" onclick="go('editProfile')">✏️ تعديل الملف</button>
      </div>
    </div>
    <div class="dual-block student-block">
      <div class="dual-block-hd"><div class="dual-block-icon">🎓</div>
        <div><div class="dual-block-title">أنا كطالب</div><div class="dual-block-sub">نشاطي التعليمي</div></div>
      </div>
      <div class="dual-stats">
        <div class="ds-item"><div class="ds-val">${sBks.length}</div><div class="ds-lbl">إجمالي</div></div>
        <div class="ds-item"><div class="ds-val">${sUp}</div><div class="ds-lbl">قادمة</div></div>
        <div class="ds-item"><div class="ds-val">${sComp}</div><div class="ds-lbl">مكتملة</div></div>
        <div class="ds-item"><div class="ds-val">${_fmt(walBal)}<small> ج</small></div><div class="ds-lbl">رصيدي</div></div>
      </div>
      ${sUp>0?`<div class="dual-alert">🔔 ${sUp} جلسة قادمة<button class="btn btn-sm" onclick="dNav('sessions')" style="margin-right:auto">عرض ←</button></div>`:''}
    </div>
    <div class="dual-block teacher-block">
      <div class="dual-block-hd"><div class="dual-block-icon">👨‍🏫</div>
        <div><div class="dual-block-title">أنا كمعلم</div><div class="dual-block-sub">أدائي وأرباحي</div></div>
      </div>
      <div class="dual-stats">
        <div class="ds-item"><div class="ds-val">${tBks.length}</div><div class="ds-lbl">إجمالي</div></div>
        <div class="ds-item"><div class="ds-val">${tUp}</div><div class="ds-lbl">قادمة</div></div>
        <div class="ds-item"><div class="ds-val">${tComp}</div><div class="ds-lbl">مكتملة</div></div>
        <div class="ds-item"><div class="ds-val">${_fmt(tEarn)}<small> ج</small></div><div class="ds-lbl">أرباح</div></div>
      </div>
      <div class="dual-teacher-info">
        <span class="dti-badge">⭐ ${parseFloat(CP.rating||0).toFixed(1)} (${CP.totalReviews||0})</span>
        <span class="dti-badge">💰 ${CP.price||0} ج/ساعة</span>
        ${tPend>0?`<span class="dti-badge badge-warn">🔔 ${tPend} حجز ينتظر موافقتك</span>`:''}
        <button class="btn btn-sm dti-btn" onclick="dNav('availability')">⏰ أوقاتي</button>
      </div>
    </div>
    <div class="dsec"><div class="dsech"><div class="dsect">📋 آخر الجلسات</div>
      <button class="btn btn-gh btn-sm" onclick="dNav('sessions')">عرض الكل</button></div>
      ${typeof bkTblHTML==='function'?bkTblHTML(recent):''}
    </div>`;
  }catch(e){console.error('[patch] rdOverview both:',e);_orig_rdOverview(el);}
};

/* ══════════════════════════════════════════════════════
   12. Crop modal live preview fix
   ══════════════════════════════════════════════════════ */
window.applyCrop=function(){
  if(!window.cropperInstance) return;
  const canvas=window.cropperInstance.getCroppedCanvas({width:900,height:900,imageSmoothingQuality:'high'});
  if(!canvas){showT('تعذّر قص الصورة','err');return;}
  const dataUrl=canvas.toDataURL('image/jpeg',0.93);
  const resultImg=_e('cropResultPreview');
  if(resultImg){resultImg.src=dataUrl;}
  if(window.cropMode==='reg'){
    window.regPhotoData=dataUrl;
    const box=_e('r2PhotoPreview');
    if(box){box.classList.remove('hidden');box.innerHTML=`<img src="${dataUrl}" style="width:88px;height:88px;border-radius:50%;object-fit:cover;border:3px solid var(--teal)">`;}
    const r2=_e('r2Img');if(r2)r2.dataset.cropped=dataUrl;
  }else if(window.cropMode==='edit'){
    window.selectedEditPhoto=dataUrl;
    const box=_e('editPhotoPreview');
    if(box){box.classList.remove('hidden');box.innerHTML=`<img src="${dataUrl}" style="width:88px;height:88px;border-radius:50%;object-fit:cover;border:3px solid var(--teal)">`;}
    const editPh=_e('editPh');if(editPh)editPh.value=dataUrl;
    const navAv=_e('navAv');if(navAv)navAv.innerHTML=`<img src="${dataUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
    const sbAv=_e('sbAv');if(sbAv)sbAv.innerHTML=`<img src="${dataUrl}">`;
    const ep=_e('editAvPr');if(ep)ep.innerHTML=`<img src="${dataUrl}">`;
  }
  if(typeof closeM==='function') closeM('cropMod');
  showT('✅ تم تطبيق الصورة','suc');
};

window.stepCropZoom=function(delta){
  if(!window.cropperInstance)return;
  window.cropperInstance.zoom(delta);
  const r=_e('cropZoomRange');
  if(r)r.value=Math.min(3,Math.max(0.5,parseFloat(r.value||1)+delta)).toFixed(2);
};

/* ══════════════════════════════════════════════════════
   13. Booking modal visibility
   ══════════════════════════════════════════════════════ */
const _orig_openBkMod=window.openBkMod;
window.openBkMod=function(){
  if(typeof _orig_openBkMod==='function') _orig_openBkMod();
  setTimeout(()=>_applyVisibility(),80);
};

/* ══════════════════════════════════════════════════════
   14. Auto-complete expired sessions
   ══════════════════════════════════════════════════════ */
async function _autoCompleteExpired(){
  if(!CU) return;
  try{
    const snap=await db.collection('bookings').where('studentId','==',CU.uid).where('status','in',['confirmed','active']).get().catch(()=>({docs:[]}));
    for(const doc of snap.docs){
      const bk={id:doc.id,...doc.data()};
      const endMs=_getEndMs2(bk);
      if(!endMs||Date.now()<endMs+5*60000) continue;
      await db.collection('bookings').doc(bk.id).update({status:'completed',completedAt:firebase.firestore.FieldValue.serverTimestamp(),autoCompleted:true}).catch(()=>{});
      await _doTransferEarnings(bk.id,bk);
      if(!bk.reviewed) _openReviewAfterSession(bk.id,bk,false);
    }
  }catch(e){}
}

/* ══════════════════════════════════════════════════════
   BOOT
   ══════════════════════════════════════════════════════ */
const _orig_updNavU=window.updNavU;
window.updNavU=function(){
  if(typeof _orig_updNavU==='function') _orig_updNavU();
  _startProfileListener();
  _applyVisibility();
};

document.addEventListener('DOMContentLoaded',()=>{
  _injectCountries();
  const adCon=_e('adCon');
  if(adCon){
    new MutationObserver(()=>{
      const btn=_e('saveCommissionBtn');
      if(btn&&!btn.dataset.hooked){btn.dataset.hooked='1';btn.onclick=window.saveCommissionRates;}
    }).observe(adCon,{childList:true,subtree:true});
  }
  setTimeout(_autoCompleteExpired,9000);
  setInterval(_autoCompleteExpired,10*60*1000);
});

console.log('✅ Skillak patch.js v3.0 loaded');
