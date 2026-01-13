<script>
/* ===============================
   AUDIO UNLOCK GATE – KHÔNG ĐỤNG LOGIC GIEO QUẺ
   =============================== */

(function(){

  // tạo lớp phủ hỏi xác nhận
  const gate = document.createElement("div");
  gate.id = "audioGate";
  gate.style = `
    position:fixed;inset:0;
    background:rgba(0,0,0,.7);
    display:flex;align-items:center;justify-content:center;
    z-index:9999;
  `;
  gate.innerHTML = `
    <div style="background:#fff5e6;padding:20px;border-radius:12px;text-align:center;max-width:320px">
      <div id="q1">
        <b>Bạn đã quét mã coi bói của 10/5?</b><br><br>
        <button id="agree1">ĐỒNG Ý</button>
      </div>
      <div id="q2" style="display:none">
        <b>Bạn sẵn sàng để biết 2026 của bạn chưa?</b><br><br>
        <button id="agree2">ĐỒNG Ý</button>
      </div>
    </div>
  `;
  document.body.appendChild(gate);

  let unlocked = false;

  function unlockAudio(){
    if(unlocked) return;
    unlocked = true;

    document.querySelectorAll("audio").forEach(a=>{
      try{
        a.volume = 0.8;
        a.currentTime = 0;
        a.play().then(()=>a.pause()).catch(()=>{});
      }catch(e){}
    });
  }

  function playClick(){
    const c = document.getElementById("snd-click");
    if(c){
      try{
        c.currentTime = 0;
        c.play().catch(()=>{});
      }catch(e){}
    }
  }

  // gắn sự kiện
  document.getElementById("agree1").onclick = function(){
    unlockAudio();
    playClick();
    document.getElementById("q1").style.display = "none";
    document.getElementById("q2").style.display = "block";
  };

  document.getElementById("agree2").onclick = function(){
    unlockAudio();
    playClick();
    gate.style.display = "none";
  };

})();
</script>
