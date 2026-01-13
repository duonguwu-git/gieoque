const dataFortune = [
    {t: "GIÀU NGANG NGƯỢC", d: "Năm 2026 lúa về đầy kho, quý nhân gánh team cực mạnh. Chuẩn bị tinh thần flex túi tiền không đáy nhé!", gift: false},
    {t: "GREEN FLAG", d: "Tình duyên năm tới nở rộ. Một nửa 'over hợp' sắp xuất hiện, chốt đơn thôi ní lớp 10/5 ơi!", gift: false},
    {t: "VẬN MAY KIẾN TẠO", d: "Đỉnh của chóp! Bạn sắp có bước ngoặt lớn làm thay đổi cuộc đời. Thời tới cản không kịp!", gift: true},
    {t: "CỨU CÁI CỘT SỐNG", d: "Năm tới bận rộn tới công chuyện luôn, nhưng thành quả xứng đáng. Tiền thưởng sẽ cứu vãn cột sống của bạn!", gift: false},
    {t: "VÍ KHÔNG ĐÁY", d: "Tiền bạc rơi trúng đầu, chi tiêu không cần nhìn giá. Vận tài lộc của bạn đang ở mức 100%!", gift: false},
    {t: "SỐ HƯỞNG VÔ THỰC", d: "Vận may năm tới cực cháy! Làm gì cũng thành công, đi đâu cũng có người bao ăn bao chơi.", gift: true},
    {t: "BẬC THẦY FLEX", d: "Năm tới danh tiếng vang xa, học hành thi cử đỗ đạt cao. Cả năm chỉ ngồi nhận lời chúc tụng thôi!", gift: false},
    {t: "TÌNH YÊU TRÊN MÂY", d: "Người yêu cũ không còn là nỗi lo. Một mối quan hệ mới cực kỳ 'healing' đang tiến về phía bạn.", gift: false}
];

// Kiểm tra nếu đã chơi
window.onload = function() {
    const saved = localStorage.getItem('que_10_5_vip');
    if (saved) showFinal(JSON.parse(saved));
};

function startGieo() {
    const dob = document.getElementById('dob').value;
    if(!dob) {
        alert("Ní ơi, nhập ngày sinh đã thì quẻ mới linh!");
        return;
    }
    
    document.getElementById('input-box').style.display = 'none';
    const ongContainer = document.getElementById('ong-que-container');
    const ong = document.getElementById('ong-que');
    const sndShake = document.getElementById('snd-shake');

    ongContainer.style.display = 'block';
    sndShake.play();
    ong.classList.add('shaking');

    setTimeout(() => {
        ong.classList.remove('shaking');
        ongContainer.style.display = 'none';
        renderSticks(dob);
    }, 2500);
}

function renderSticks(dob) {
    const box = document.getElementById('spread-box');
    box.style.display = 'block';
    for(let i=0; i<8; i++) {
        const stick = document.createElement('div');
        stick.className = 'que-the';
        stick.innerHTML = "QUẺ 10/5";
        stick.onclick = function() { pick(this, dob); };
        box.appendChild(stick);
        setTimeout(() => { 
            stick.style.transform = `rotate(${(i-3.5)*15}deg) translateX(${(i-3.5)*10}px)`; 
        }, i*100);
    }
}

function pick(el, dob) {
    // Vô hiệu hóa các thẻ khác
    document.querySelectorAll('.que-the').forEach(s => s.style.pointerEvents = 'none');
    el.classList.add('selected');

    setTimeout(() => {
        const cleanDob = dob.replace(/-/g, "");
        let sum = 0; for(let n of cleanDob) sum += parseInt(n);
        const res = dataFortune[sum % dataFortune.length];
        
        localStorage.setItem('que_10_5_vip', JSON.stringify(res));
        showFinal(res);
    }, 800);
}

function showFinal(res) {
    document.getElementById('snd-win').play();
    
    // Nếu trúng quà thì bắn pháo hoa
    if(res.gift) {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff0000', '#ffd700', '#ffffff']
        });
    }

    document.getElementById('resTitle').innerText = res.t;
    document.getElementById('resDesc').innerText = res.d;
    if(res.gift) document.getElementById('giftSection').style.display = 'block';
    
    document.getElementById('resultModal').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
}
