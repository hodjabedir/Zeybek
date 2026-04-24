// === Türkiye merkezli karanlık tema harita ===
const harita = L.map('map', {
    zoomControl: true,
    attributionControl: true
}).setView([39.0, 32.5], 6);

// CartoDB Dark Matter — zarif karanlık harita teması
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap · © CARTO'
}).addTo(harita);

// === Ses Motoru (Web Audio API ile davul sesi sentezi) ===
let audioCtx = null;
let ritimCalisyor = false;
let ritimTimerId = null;
let aktifPlayBtn = null;

function audioBaslat() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

// Davul vuruşu (kick drum) üret
function davulVur(zaman, guclu = false) {
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    const baslangicFreq = guclu ? 160 : 110;
    const bitisFreq = 40;
    const sure = guclu ? 0.28 : 0.15;
    const siddet = guclu ? 1.0 : 0.45;

    osc.frequency.setValueAtTime(baslangicFreq, zaman);
    osc.frequency.exponentialRampToValueAtTime(bitisFreq, zaman + sure);

    gain.gain.setValueAtTime(siddet, zaman);
    gain.gain.exponentialRampToValueAtTime(0.001, zaman + sure);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(zaman);
    osc.stop(zaman + sure);
}

// Ritmi çal
function ritmiCal(zeybek) {
    audioBaslat();
    ritmiDurdur();

    const beatSuresi = 60 / zeybek.bpm;
    const ritim = zeybek.ritim;
    let vurusSayaci = 0;
    let baslangic = audioCtx.currentTime + 0.1;

    ritimCalisyor = true;

    function sonrakileriPlanla() {
        if (!ritimCalisyor) return;

        while (baslangic < audioCtx.currentTime + 0.3) {
            const idx = vurusSayaci % ritim.length;
            const seviye = ritim[idx];

            if (seviye > 0) {
                davulVur(baslangic, seviye === 2);
            }

            // Görsel göstergeyi güncelle
            const zaman = (baslangic - audioCtx.currentTime) * 1000;
            setTimeout(() => gosterimGuncelle(idx, seviye), Math.max(0, zaman));

            baslangic += beatSuresi;
            vurusSayaci++;
        }

        ritimTimerId = setTimeout(sonrakileriPlanla, 30);
    }

    sonrakileriPlanla();
}

// Ritmi durdur
function ritmiDurdur() {
    ritimCalisyor = false;
    if (ritimTimerId) {
        clearTimeout(ritimTimerId);
        ritimTimerId = null;
    }
    document.querySelectorAll('.ritim-nokta').forEach(n => n.classList.remove('aktif', 'guclu'));

    if (aktifPlayBtn) {
        aktifPlayBtn.classList.remove('calisyor');
        const icon = aktifPlayBtn.querySelector('.play-icon');
        const text = aktifPlayBtn.querySelector('.play-text');
        if (icon) icon.textContent = '▶';
        if (text) text.textContent = 'Ritmi Çal';
    }
}

// Görsel ritim göstergesini güncelle
function gosterimGuncelle(idx, seviye) {
    const noktalar = document.querySelectorAll('.ritim-nokta');
    noktalar.forEach(n => n.classList.remove('aktif', 'guclu'));
    const nokta = noktalar[idx];
    if (nokta && seviye > 0) {
        nokta.classList.add('aktif');
        if (seviye === 2) nokta.classList.add('guclu');
    }
}

// === Klasik konum pin'i (damla şekli) ===
const zeybekIkonu = L.divIcon({
    className: 'zeybek-marker-custom',
    html: `
        <div class="zeybek-marker-pin">
            <div class="mor-halka"></div>
            <div class="mor-glow"></div>
            <div class="pin-emoji">📍</div>
        </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 46],
    popupAnchor: [0, -44]
});


const markerMap = new Map();

// === Pin Tıklama Animasyonu ===
function pinAnimasyonu(markerElement) {
    if (!markerElement) return;
    const pin = markerElement.querySelector('.zeybek-marker-pin');
    if (!pin) return;

    pin.classList.remove('clicked');
    pin.querySelectorAll('.ripple, .sparkle').forEach(el => el.remove());
    void pin.offsetWidth;
    pin.classList.add('clicked');

    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    pin.appendChild(ripple);

    for (let i = 0; i < 6; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.setProperty('--angle', `${i * 60}deg`);
        sparkle.style.setProperty('--delay', `${i * 0.05}s`);
        pin.appendChild(sparkle);
    }

    setTimeout(() => {
        pin.classList.remove('clicked');
        pin.querySelectorAll('.ripple, .sparkle').forEach(el => el.remove());
    }, 1000);
}

function aktifMarkerAyarla(marker) {
    document.querySelectorAll('.zeybek-marker-pin').forEach(pin => {
        pin.classList.remove('active', 'dimmed');
    });
    const element = marker._icon;
    if (!element) return;
    const activePin = element.querySelector('.zeybek-marker-pin');
    if (activePin) activePin.classList.add('active');
    document.querySelectorAll('.zeybek-marker-pin').forEach(pin => {
        if (pin !== activePin) pin.classList.add('dimmed');
    });
}

// === Detay Paneli ===
function detaylariGoster(zeybek, marker = null) {
    ritmiDurdur();

    const icerik = document.getElementById('detay-icerik');
    const ipucu = document.querySelector('.ipucu');
    if (ipucu) ipucu.style.display = 'none';

    // Ritim noktalarını oluştur (9 vuruş için 9 nokta)
    const ritimNoktalari = zeybek.ritim.map((seviye) => {
        const sinif = seviye === 2 ? 'vurgu' : seviye === 1 ? 'normal' : 'sessiz';
        return `<div class="ritim-nokta ${sinif}"></div>`;
    }).join('');

    icerik.innerHTML = `
        <div class="detay-kart">
            <h3 class="detay-baslik">${zeybek.ad}</h3>
            <div class="detay-yore">📍 ${zeybek.yore}</div>
            <p class="detay-aciklama">${zeybek.aciklama}</p>

            <div class="ozellik-grid">
                <div class="ozellik-kutu">
                    <div class="label">Tempo</div>
                    <div class="value">${zeybek.tempo}</div>
                </div>
                <div class="ozellik-kutu">
                    <div class="label">Ölçü</div>
                    <div class="value">${zeybek.olcu}</div>
                </div>
                <div class="ozellik-kutu">
                    <div class="label">BPM</div>
                    <div class="value">${zeybek.bpm}</div>
                </div>
                <div class="ozellik-kutu">
                    <div class="label">Vuruş</div>
                    <div class="value">${zeybek.ritim.filter(r => r > 0).length} / ${zeybek.ritim.length}</div>
                </div>
            </div>

            <div class="ritim-bolumu">
                <div class="alt-baslik">🥁 Ritim</div>
                <div class="ritim-gosterge">${ritimNoktalari}</div>
                <button class="play-btn" id="play-btn">
                    <span class="play-icon">▶</span>
                    <span class="play-text">Ritmi Çal</span>
                </button>
                <div class="ritim-legend">
                    <span><span class="legend-dot guclu-ornek"></span> Güçlü (DUM)</span>
                    <span><span class="legend-dot normal-ornek"></span> Zayıf (tak)</span>
                    <span><span class="legend-dot sessiz-ornek"></span> Sessiz</span>
                </div>
            </div>

            <div class="alt-baslik">Öne Çıkan Özellikler</div>
            <ul class="ozellik-liste">
                ${zeybek.ozellikler.map((o, i) => `<li style="animation-delay:${i * 0.08}s">${o}</li>`).join('')}
            </ul>
        </div>
    `;

    if (marker && marker._icon) {
        pinAnimasyonu(marker._icon);
        aktifMarkerAyarla(marker);
    }

    harita.flyTo(zeybek.koordinat, 8, { duration: 1.2 });

    // Çal/Durdur butonuna olay bağla
    const playBtn = document.getElementById('play-btn');
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (ritimCalisyor) {
                ritmiDurdur();
            } else {
                aktifPlayBtn = playBtn;
                ritmiCal(zeybek);
                playBtn.classList.add('calisyor');
                playBtn.querySelector('.play-icon').textContent = '⏸';
                playBtn.querySelector('.play-text').textContent = 'Durdur';
            }
        });
    }
}

// === Tüm zeybekleri haritaya ekle ===
zeybekler.forEach((zeybek) => {
    const marker = L.marker(zeybek.koordinat, { icon: zeybekIkonu }).addTo(harita);
    marker.bindPopup(`<b>${zeybek.ad}</b>${zeybek.yore}`);
    marker.on('click', () => detaylariGoster(zeybek, marker));
    markerMap.set(zeybek.ad, marker);
});

// === Zeybek listesi ===
function listeyiOlustur(filtrelenmis = zeybekler) {
    const liste = document.getElementById('zeybek-listesi');
    if (filtrelenmis.length === 0) {
        liste.innerHTML = `<div style="text-align:center;color:var(--text-muted);padding:1rem;font-size:0.9rem;">Sonuç bulunamadı</div>`;
        return;
    }
    liste.innerHTML = filtrelenmis.map(zeybek => `
        <div class="liste-item" data-ad="${zeybek.ad}">
            <div class="liste-item-icon">📍</div>
            <div class="liste-item-text">
                <div class="liste-item-ad">${zeybek.ad}</div>
                <div class="liste-item-yore">${zeybek.yore}</div>
            </div>
        </div>
    `).join('');

    liste.querySelectorAll('.liste-item').forEach(el => {
        el.addEventListener('click', () => {
            const zeybek = zeybekler.find(z => z.ad === el.dataset.ad);
            const marker = markerMap.get(el.dataset.ad);
            if (zeybek) detaylariGoster(zeybek, marker);
        });
    });
}

listeyiOlustur();

// === Arama ===
document.getElementById('arama').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    const filtrelenmis = zeybekler.filter(z =>
        z.ad.toLowerCase().includes(q) ||
        z.yore.toLowerCase().includes(q)
    );
    listeyiOlustur(filtrelenmis);
});

// === Harita boyutunu güncelle ===
window.addEventListener('load', () => {
    setTimeout(() => harita.invalidateSize(), 100);
});
window.addEventListener('resize', () => harita.invalidateSize());