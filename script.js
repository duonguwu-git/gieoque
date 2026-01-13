<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Linh Quẻ 10/5 — Fix âm thanh & gieo</title>
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
  <style>
    :root{--do:#c0392b;--vang:#ffd700;--giay:#fff5e6;--go:#5d4037}
    *{box-sizing:border-box;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial}
    body{margin:0;background:#120807;color:var(--go);display:flex;justify-content:center;padding:18px}
    .app{width:100%;max-width:760px}
    .panel{background:var(--giay);padding:18px;border-radius:12px}
    h1{margin:6px 0}
    input[type="date"]{width:100%;padding:10px;border-radius:8px;border:2px solid var(--go);font-size:16px}
    .btn{margin-top:12px;padding:12px;border-radius:10px;border:none;background:var(--do);color:#fff;font-weight:700;width:100%}
    .overlay{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.55);z-index:999}
    .consent{background:var(--giay);padding:18px;border-radius:12px;text-align:center;max-width:420px;width:92%}
    .hidden{display:none}
    .result-box{margin-top:12px;padding:12px;background:#fff;border-radius:10px;border:2px dashed var(--do)}
  </style>
</head>
<body>
  <!-- Audio -->
  <audio id="snd-click" src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_7c6c9d35b6.mp3?filename=click-82053.mp3" preload="auto"></audio>
  <audio id="snd-shake" src="https://www.soundjay.com/misc/sounds/shaking-ice-in-cup-1.mp3" preload="auto"></audio>
  <audio id="snd-win" src="https://cdn.pixabay.com/download/audio/2021/08/04/audio_4a3c7e7f1a.mp3?filename=happy-fanfare-110758.mp3" preload="auto"></audio>
  <audio id="snd-sad" src="https://cdn.pixabay.com/download/audio/2022/11/16/audio_7f1c6b2f4d.mp3?filename=sad-violin-129898.mp3" preload="auto"></audio>

  <div class="app">
    <div class="panel">
      <div style="font-weight:800">🎪 TRẠI LỚP 10/5 — LINH QUẺ 2026</div>
      <h1>Gieo quẻ định mệnh</h1>

      <div style="margin-top:8px">Nhập ngày sinh</div>
      <input id="dob" type="date" />

      <button id="btnGieo" class="btn">GIEO QUẺ ĐỊNH MỆNH</button>

      <div id="ong" style="display:none;margin-top:14px;text-align:center">
        <div style="font-size:72px">🏺</div>
        <div style="color:#333">Đang lắc quẻ...</div>
      </div>

      <div id="resultArea" class="result-box hidden"></div>
    </div>
  </div>

  <!-- Consent overlay: two steps -->
  <div id="overlay" class="overlay">
    <div class="consent">
      <div id="step1Box">
        <div style="font-weight:800;font-size:18px">Bạn đã quét mã coi bói của 10/5?</div>
        <p class="small">Xác nhận để mở khoá âm thanh</p>
        <button id="agree1" class="btn">ĐỒNG Ý</button>
      </div>

      <div id="step2Box" class="hidden" style="margin-top:10px">
        <div style="font-weight:800;font-size:18px">Bạn sẵn sàng để biết 2026 của bạn chưa?</div>
        <p class="small">Mỗi người chỉ bốc 1 lần</p>
        <button id="agree2" class="btn">ĐỒNG Ý</button>
      </div>
    </div>
  </div>

<script>
/* ---------- CẤU HÌNH / DỮ LIỆU ---------- */
const STORAGE_KEY = "linhque_105_v3";

/* 
  QUE_BANK: nếu bạn đã dán 200 câu vào script.js riêng, bỏ phần khai báo dưới này
  và chắc chắn script.js được include TRƯỚC script này.
  Dưới đây demo 6 câu; paste 200 câu vào mảng này (object {title,desc,gift?})
*/
const QUE_BANK = [
  {title:"Vibe hôm nay ổn", desc:"Làm gì cũng trôi, có niềm vui lặt vặt"},
  {title:"Coi chừng drama", desc:"Hạn chế tranh luận. Mua nước tại quầy 10/5 để giải nghiệp"},
  {title:"Thăng tiến nho nhỏ", desc:"Ý tưởng được chú ý, tận dụng cơ hội", gift:true},
  {title:"Ngày hơi mệt", desc:"Nên nghỉ sớm. Mua nước tại quầy 10/5 để giải nghiệp"},
  {title:"Được rủ đi chơi", desc:"Kết bạn mới hoặc reconnect thú vị"},
  {title:"Tập trung học hành", desc:"Nỗ lực nhỏ, kết quả lớn"}
];
// nếu bạn dán mảng 200 ở script.js riêng, đảm bảo QUE_BANK được định nghĩa trước.

let audioUnlocked = false;

/* ---------- Helper: audio unlock & safe play ---------- */
function unlockAudio(){
  if(audioUnlocked) return;
  audioUnlocked = true;
  const audios = document.querySelectorAll('audio');
  audios.forEach(a=>{
    try{
      a.volume = 0.9;
      a.currentTime = 0;
      const p = a.play();
      if(p && p.then) p.then(()=>a.pause()).catch(()=>{ try{ a.pause(); }catch(e){} });
      else a.pause();
    }catch(e){}
  });
  console.log("Audio unlocked");
}

function safePlay(id){
  try{
    const a = document.getElementById(id);
    if(!a) return;
    a.currentTime = 0;
    const p = a.play();
    if(p && p.catch) p.catch(()=>{ console.log("play rejected", id); });
  }catch(e){ console.warn("safePlay error", e); }
}

function vibr(ms){ if(navigator.vibrate) navigator.vibrate(ms); }

/* ---------- Consent overlay flow ---------- */
const overlay = document.getElementById('overlay');
const step1Box = document.getElementById('step1Box');
const step2Box = document.getElementById('step2Box');
document.getElementById('agree1').addEventListener('click', ()=>{
  unlockAudio();
  safePlay('snd-click');
  vibr(30);
  step1Box.classList.add('hidden');
  step2Box.classList.remove('hidden');
});
document.getElementById('agree2').addEventListener('click', ()=>{
  unlockAudio();
  safePlay('snd-click');
  vibr(50);
  overlay.style.display = 'none';
  document.getElementById('dob').focus();
});

/* If user already has result, we still show overlay (so they can unlock audio),
   but you may auto-hide overlay if you prefer:
   if(localStorage.getItem(STORAGE_KEY)) overlay.style.display='none';
*/

/* ---------- Gieo quẻ flow ---------- */
const btnGieo = document.getElementById('btnGieo');
btnGieo.addEventListener('click', startGieo);

function startGieo(){
  // ensure audio unlocked in case user bypassed overlay
  unlockAudio();
  safePlay('snd-click');
  vibr(30);

  const dob = document.getElementById('dob').value;
  if(!dob){ alert('Vui lòng nhập ngày sinh'); return; }

  // if already have result, show it
  const prev = localStorage.getItem(STORAGE_KEY);
  if(prev){
    showResult(JSON.parse(prev), true);
    return;
  }

  // show jar animation area
  document.getElementById('ong').style.display = 'block';
  safePlay('snd-shake');
  // vibrate pattern
  if(navigator.vibrate) navigator.vibrate([30,20,30]);

  setTimeout(()=>{
    try{ document.getElementById('snd-shake').pause(); document.getElementById('snd-shake').currentTime=0; }catch(e){}
    // compute result
    const res = computeResult(dob);
    // lock result
    localStorage.setItem(STORAGE_KEY, JSON.stringify(res));
    document.getElementById('ong').style.display = 'none';
    showResult(res, false);
  }, 2500);
}

/* computeResult: choose random from QUE_BANK; special VIP for 2010-06-25 */
function computeResult(dob){
  if(dob === '2010-06-25'){
    return {title:"💎 THIẾU GIA VIP 10/5", desc:"Bạn trúng quẻ VIP — vay quà nhé!", type:'vip', gift:true};
  }
  // pick random
  const idx = Math.floor(Math.random() * QUE_BANK.length);
  const item = QUE_BANK[idx];
  // detect bad by phrase (you can customize)
  const isBad = (item.desc && item.desc.includes('Mua nước tại quầy 10/5')) || item.desc.includes('Mua nước tại quầy 10/5'.toLowerCase());
  return {title:item.title, desc:item.desc, type: isBad ? 'bad' : 'good', gift: !!item.gift};
}

/* showResult: render into resultArea & play sound/confetti */
function showResult(res, loaded){
  const area = document.getElementById('resultArea');
  area.classList.remove('hidden');
  area.innerHTML = `<div style="font-weight:800">${res.title}</div><div style="margin-top:8px">${res.desc}</div>`;
  if(res.gift){
    area.innerHTML += `<div style="margin-top:10px;color:var(--do);font-weight:800">🎁 QUÀ: Mang màn hình tới quầy 10/5 để nhận!</div>`;
  }
  // play audio / confetti
  if(!loaded){
    if(res.type === 'good' || res.type === 'vip'){
      safePlay('snd-win');
      confetti({particleCount:100,spread:60,origin:{y:0.4}});
      vibr([30,20,30]);
    }else{
      safePlay('snd-sad');
      vibr(120);
    }
  }
}

/* dev helper: reset - mở console và gọi _resetLinhQue() */
window._resetLinhQue = function(){ localStorage.removeItem(STORAGE_KEY); location.reload(); };

console.log("LinhQuẻ script loaded. QUE_BANK.length =", QUE_BANK.length);
</script>
</body>
</html
