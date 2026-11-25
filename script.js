(function(){
var PRISTINE='<!DOCTYPE html>\n'+document.documentElement.outerHTML;
var $=function(i){return document.getElementById(i)};
var S=JSON.parse($('state').textContent),OWNER=false,filter='all',RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
var HOSTED=!!(window.claude&&claude.use);
if(!HOSTED){OWNER=true;try{var sv=localStorage.getItem('tm_state');if(sv)S=JSON.parse(sv)}catch(e){}}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function cap(n){try{return window.claude&&claude.use?claude.use(n).then(function(x){return x},function(){return null}):Promise.resolve(null)}catch(e){return Promise.resolve(null)}}
function safe(u){return typeof u==='string'&&(u.indexOf('/_blob/')===0||u.indexOf('https://')===0||(!HOSTED&&u.indexOf('data:')===0))}
function toast(t){var e=$('toast');e.textContent=t;e.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(function(){e.classList.remove('show')},2400)}
function msg(t){$('st').textContent=t;if(t)toast(t)}
/* theme */
var root=document.documentElement;
try{var th=localStorage.getItem('theme');if(th)root.setAttribute('data-theme',th)}catch(e){}
$('theme').addEventListener('click',function(){
var dark=root.getAttribute('data-theme')==='dark'||(!root.getAttribute('data-theme')&&matchMedia('(prefers-color-scheme: dark)').matches);
var n=dark?'light':'dark';root.setAttribute('data-theme',n);try{localStorage.setItem('theme',n)}catch(e){}});
/* render from state */
function skills(){var g=$('grid');g.textContent='';S.skills.forEach(function(s){if(filter!=='all'&&s.c!==filter)return;
var c=el('div','skill');c.appendChild(el('h3',0,s.n));c.appendChild(el('p',0,s.d));
var m=el('div','meter'),l=+s.l;for(var k=1;k<=3;k++)m.appendChild(el('i',k<=l?'on':''));
m.appendChild(el('em',0,l===1?'Basic':l===2?'Good':'Core skill'));c.appendChild(m);g.appendChild(c)})}
function tl(id,arr){var b=$(id);b.textContent='';arr.forEach(function(x){var d=el('div');d.appendChild(el('h3',0,x.t));d.appendChild(el('small',0,x.s));d.appendChild(el('p',0,x.p));b.appendChild(d)})}
function docs(){var d=$('docs');d.textContent='';S.docs.forEach(function(x){var c=el('div','doc'),a=el('a');
c.appendChild(el('h3',0,x.t));c.appendChild(el('p',0,x.d));
if(safe(x.u)){a.textContent='Open document';a.href=x.u;a.target='_blank';a.rel='noopener';if(x.u.indexOf('data:')===0){a.href='#';a.addEventListener('click',function(e){e.preventDefault();fetch(x.u).then(function(r){return r.blob()}).then(function(b){window.open(URL.createObjectURL(b),'_blank')})})}}
else{a.textContent='Ask for a copy';a.href='mailto:'+S.email+'?subject='+encodeURIComponent(x.t+' request')}
c.appendChild(a);d.appendChild(c)})}
function render(){
$('logo').textContent=S.name.split(' ')[0]||'Portfolio';$('h-name').textContent=S.name;$('f-name').textContent=S.name;
var ab=$('ab');ab.textContent='';S.about.split(/\n\s*\n/).forEach(function(p){ab.appendChild(el('p',0,p))});
$('gpa-n').textContent=S.gpa;if(safe(S.photo))$('ph').src=S.photo;
var m=$('c-mail');m.textContent=S.email;m.href='mailto:'+S.email;
var p=$('c-tel');p.textContent=S.phone;p.href='tel:'+S.phone.replace(/[^+\d]/g,'');
document.title=S.name+' | Portfolio';skills();tl('edu',S.edu);tl('exp',S.exp);docs()}
render();
$('yr').textContent=new Date().getFullYear();
/* roles */
var roles=['Front-end developer','Back-end developer','Database manager','Networking enthusiast'],re=$('role');
if(RM){re.textContent=roles[0]}else{var i=0,c=0,del=false;(function tick(){var w=roles[i];c+=del?-1:1;re.textContent=w.slice(0,c);var d=del?35:75;
if(!del&&c===w.length){del=true;d=1400}else if(del&&c===0){del=false;i=(i+1)%roles.length;d=300}setTimeout(tick,d)})()}
/* skill filter */
var chips=document.querySelectorAll('.chip');
chips.forEach(function(ch){ch.addEventListener('click',function(){filter=ch.dataset.f;chips.forEach(function(x){x.setAttribute('aria-pressed',x===ch)});skills()})});
/* progress, gpa count-up, nav highlight */
addEventListener('scroll',function(){var h=document.documentElement;$('prog').style.width=(h.scrollTop/Math.max(1,h.scrollHeight-h.clientHeight)*100)+'%';$('totop').classList.toggle('show',h.scrollTop>600)},{passive:true});
var g=$('gpa-n'),tg=parseFloat(S.gpa);
if(!isNaN(tg)&&!RM&&'IntersectionObserver' in window){new IntersectionObserver(function(es,o){if(es[0].isIntersecting){o.disconnect();var t0=performance.now();(function f(t){var k=Math.min(1,(t-t0)/900);g.textContent=k<1?(tg*k).toFixed(1):S.gpa;if(k<1)requestAnimationFrame(f)})(t0)}}).observe(g)}
var links=document.querySelectorAll('#nav a');
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting)links.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+en.target.id)})})},{rootMargin:'-40% 0px -55% 0px'});
document.querySelectorAll('section').forEach(function(s){io.observe(s)})}
/* contact */
$('send').addEventListener('click',function(){var n=$('cn').value.trim(),m=$('cm').value.trim();
var a=el('a');a.href='mailto:'+S.email+'?subject='+encodeURIComponent('Portfolio message'+(n?' from '+n:''))+'&body='+encodeURIComponent(m);a.target='_blank';a.rel='noopener';document.body.appendChild(a);a.click();a.remove()});
$('copy').addEventListener('click',function(){var b=$('copy');function done(){toast('Email copied');b.textContent='Copied';setTimeout(function(){b.textContent='Copy email address'},1800)}
try{navigator.clipboard.writeText(S.email).then(done,done)}catch(e){done()}});
/* login and editor */
S.admin=S.admin||{s:'',h:''};
function open(id){$(id).classList.add('open')}function shut(id){$(id).classList.remove('open')}
var UNL=false,mode='login';try{UNL=sessionStorage.getItem('tm_ok')==='1'}catch(e){}
function b64(b){var a=new Uint8Array(b),s='';for(var i=0;i<a.length;i++)s+=String.fromCharCode(a[i]);return btoa(s)}
function unb64(s){var r=atob(s),a=new Uint8Array(r.length);for(var i=0;i<r.length;i++)a[i]=r.charCodeAt(i);return a}
function hash(pw,salt){return crypto.subtle.importKey('raw',new TextEncoder().encode(pw),'PBKDF2',false,['deriveBits']).then(function(k){return crypto.subtle.deriveBits({name:'PBKDF2',salt:salt,iterations:150000,hash:'SHA-256'},k,256)}).then(b64)}
function setPw(pw){var salt=crypto.getRandomValues(new Uint8Array(16));return hash(pw,salt).then(function(h){S.admin={s:b64(salt),h:h}})}
function ownerCheck(){if(!HOSTED)return Promise.resolve(true);return cap('user').then(function(u){return u?u.isOwner():false}).catch(function(){return false})}
function setBtn(){$('login').textContent=OWNER&&UNL?'Edit portfolio':'Admin login'}
function lmode(m,note){mode=m;var c=m==='create';$('lt').textContent=c?'Create admin password':'Admin login';
$('lp').textContent=c?'Choose a password with at least 8 characters. You will use it to log in and edit your portfolio.':'Enter your admin password to edit your portfolio.';
$('pw').placeholder=c?'New password':'Password';$('pw2').hidden=!c;$('forgot').hidden=c||!OWNER||!HOSTED;$('lgo').textContent=c?'Save password':'Log in';
$('lmsg').textContent=note||(!HOSTED&&!S.admin.h?'First password: admin123. Change it after you log in.':'');$('pw').value='';$('pw2').value=''}
ownerCheck().then(function(o){OWNER=o;if(!o)UNL=false;setBtn()});
$('login').addEventListener('click',function(){if(OWNER&&UNL){editor();open('dm');return}
ownerCheck().then(function(o){OWNER=o;lmode(o&&!S.admin.h&&HOSTED?'create':'login');open('lm');$('pw').focus()})});
function finish(isNew){UNL=true;try{sessionStorage.setItem('tm_ok','1')}catch(e){}setBtn();shut('lm');editor();open('dm');if(isNew)msg('Password set. Press Save and publish to keep it.')}
$('lgo').addEventListener('click',function(){var pw=$('pw').value,m=$('lmsg');m.textContent='Checking…';
ownerCheck().then(function(o){OWNER=o;
if(!o){m.textContent='This page couldn’t confirm you as the owner. Open it while signed in to the Claude account that published it.';return}
if(!window.crypto||!crypto.subtle){m.textContent='This browser can’t protect passwords. Try another browser.';return}
if(mode==='create'){if(pw.length<8){m.textContent='Use at least 8 characters.';return}
if(pw!==$('pw2').value){m.textContent='The two passwords don’t match.';return}
return setPw(pw).then(function(){finish(true)})}
if(!S.admin.h){if(HOSTED){lmode('create');return}if(pw==='admin123'){finish(false);msg('Default password in use. Change it under Admin password.');return}m.textContent='Wrong password. The first password is admin123.';return}
return hash(pw,unb64(S.admin.s)).then(function(h){if(h===S.admin.h)finish(false);else m.textContent='Wrong password. Try again.'})})});
$('pw').addEventListener('keydown',function(e){if(e.key==='Enter')$('lgo').click()});$('pw2').addEventListener('keydown',function(e){if(e.key==='Enter')$('lgo').click()});
$('forgot').addEventListener('click',function(){lmode('create','Your account is confirmed. Set a new password.')});
$('lx').addEventListener('click',function(){shut('lm')});
$('logout').addEventListener('click',function(){UNL=false;try{sessionStorage.removeItem('tm_ok')}catch(e){}setBtn();shut('dm');toast('Logged out')});
function pwsec(b){b.appendChild(el('h3','sh','Admin password'));var pf=el('div','item'),cp=el('input'),np=el('input'),n2=el('input');
[[cp,'Current password'],[np,'New password (8+ characters)'],[n2,'Repeat new password']].forEach(function(p){p[0].type='password';p[0].placeholder=p[1];p[0].setAttribute('aria-label',p[1]);p[0].autocomplete='off';var w=el('div','f');w.appendChild(p[0]);pf.appendChild(w)});
var cb=el('button','mini','Change password');cb.type='button';
cb.onclick=function(){if(np.value.length<8){msg('Use at least 8 characters.');return}if(np.value!==n2.value){msg('The new passwords don’t match.');return}
(S.admin.h?hash(cp.value,unb64(S.admin.s)).then(function(h){return h===S.admin.h}):Promise.resolve(!HOSTED&&cp.value==='admin123')).then(function(ok){if(!ok){msg('Current password is wrong.');return}return setPw(np.value).then(function(){cp.value=np.value=n2.value='';msg(HOSTED?'Password changed. Press Save and publish to keep it.':'Password changed. Press Save changes to keep it.')})})};
pf.appendChild(cb);b.appendChild(pf)}
$('dclose').addEventListener('click',function(){shut('dm')});
addEventListener('keydown',function(e){if(e.key==='Escape'){shut('lm');shut('dm')}});
var LISTS={skills:['Skills',[['n','Skill name'],['d','Short description'],['c','Group (web, prog, data)',['web','prog','data']],['l','Level (1 basic, 3 core)',['1','2','3']]],{n:'New skill',d:'',c:'web',l:'2'}],
exp:['Experience',[['t','Job title'],['s','Company and dates'],['p','What you did','area']],{t:'Job title',s:'Company, dates',p:''}],
edu:['Education',[['t','Degree'],['s','University and year'],['p','Notes']],{t:'Degree',s:'University, year',p:''}],
docs:['Documents',[['t','Title'],['d','Description']],{t:'New document',d:'',u:''}]};
function field(par,o,k,label,opt){var w=el('div','f'),x;w.appendChild(el('label',0,label));
if(Array.isArray(opt)){x=el('select');opt.forEach(function(v){var e=el('option',0,v);e.value=v;x.appendChild(e)})}
else if(opt==='area'){x=el('textarea');x.rows=4}else{x=el('input');x.type='text'}
x.value=String(o[k]==null?'':o[k]);x.addEventListener('input',function(){o[k]=x.value;render()});w.appendChild(x);par.appendChild(w)}
function pick(label,cb){var b=el('button','mini',label);b.type='button';b.addEventListener('click',function(){
var f=el('input');f.type='file';f.accept='image/*,application/pdf';f.onchange=function(){if(!f.files[0])return;msg('Uploading…');
(HOSTED?cap('assets').then(function(a){if(!a)throw 0;return a.upload(f.files[0])}):new Promise(function(res,rej){var fr=new FileReader();fr.onload=function(){res({url:fr.result})};fr.onerror=rej;fr.readAsDataURL(f.files[0])})).then(function(r){cb(r.url);render();msg('Uploaded. Press the save button to keep it.')}).catch(function(){msg('Upload isn’t available for this account.')})};f.click()});return b}
function editor(){var b=$('dbody');b.textContent='';b.appendChild(el('h2',0,'Edit portfolio'));
b.appendChild(el('p','hint',(HOSTED?'Changes show on the page right away. They go live for visitors when you press Save and publish.':'Changes show right away. Press Save changes to keep them in this browser, or Download page to get an updated index.html.')));
[['name','Full name'],['email','Email'],['phone','Phone'],['gpa','GPA'],['about','About (a blank line starts a new paragraph)','area']].forEach(function(f){field(b,S,f[0],f[1],f[2])});
b.appendChild(pick('Change photo',function(u){S.photo=u}));
Object.keys(LISTS).forEach(function(key){var L=LISTS[key];b.appendChild(el('h3','sh',L[0]));
S[key].forEach(function(o,i){var it=el('div','item');L[1].forEach(function(f){field(it,o,f[0],f[1],f[2])});
if(key==='docs')it.appendChild(pick(o.u?'Replace file':'Upload file',function(u){o.u=u;editor()}));
var r=el('button','mini danger','Remove');r.type='button';r.onclick=function(){S[key].splice(i,1);render();editor()};it.appendChild(r);b.appendChild(it)});
var a=el('button','mini','Add new');a.type='button';a.onclick=function(){S[key].push(JSON.parse(JSON.stringify(L[2])));render();editor()};b.appendChild(a)});pwsec(b)}
function build(){var a='<'+'script type="application/json" id="state">',i=PRISTINE.indexOf(a)+a.length,j=PRISTINE.indexOf('<\/script>',i);
return PRISTINE.slice(0,i)+JSON.stringify(S).replace(/</g,'\\u003c')+PRISTINE.slice(j)}
$('save').addEventListener('click',function(){if(!HOSTED){try{localStorage.setItem('tm_state',JSON.stringify(S));msg('Saved in this browser.')}catch(e){msg('Couldn’t save. The files may be too large.')}return}msg('Saving…');
cap('artifact').then(function(a){if(!a)throw{code:'none'};return a.publish(build())}).then(function(){msg('Saved. The page is reloading.')}).catch(function(e){
var c=e&&e.code;msg(c==='not_writer'||c==='not_granted'?'This account can’t save changes to this page.':c==='conflict'?'Someone else saved first. The page is reloading.':'Couldn’t save. Try again.')})});

/* hero parallax, card spotlight, back to top */
if(!RM){var hero=document.querySelector('.hero'),ph=$('photo');
hero.addEventListener('pointermove',function(e){var r=hero.getBoundingClientRect();ph.style.setProperty('--px',((e.clientX-r.left)/r.width-.5).toFixed(3));ph.style.setProperty('--py',((e.clientY-r.top)/r.height-.5).toFixed(3))});
hero.addEventListener('pointerleave',function(){ph.style.setProperty('--px',0);ph.style.setProperty('--py',0)})}
document.addEventListener('pointermove',function(e){var c=e.target.closest&&e.target.closest('.skill,.doc');if(c){var r=c.getBoundingClientRect();c.style.setProperty('--x',(e.clientX-r.left)+'px');c.style.setProperty('--y',(e.clientY-r.top)+'px')}});
$('totop').addEventListener('click',function(){window.scrollTo({top:0,behavior:RM?'auto':'smooth'})});

if(!HOSTED){$('save').textContent='Save changes';var dl=el('button','btn','Download page');dl.type='button';
dl.onclick=function(){var b=new Blob([build()],{type:'text/html'}),a=el('a');a.href=URL.createObjectURL(b);a.download='index.html';document.body.appendChild(a);a.click();a.remove()};$('save').after(dl)}
})();
