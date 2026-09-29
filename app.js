/**
 * Interactive Script for Bamboo Music Box Landing Page
 * Features: Dynamic Customizer, Web Audio Synthesizer for "Mi Corazón Encantado",
 * Configurable TikTok Video integration, Live WhatsApp URL builder, Shipping Tabs, FAQ.
 */

// Configuration defaults
const CONFIG = {
  whatsappPhone: "51922590492", // Número oficial de WhatsApp Intita Casa de Regalos (Perú)
  basePrice: 80,
  photoPrice: 5,
  engravePrice: 6,
  tiktokDefaultUrl: "https://www.tiktok.com/@intitaregalos/video/7647972810433809671" // Video oficial de Intita Regalos
};

// State
let selectedExtras = {
  photos: false,
  engraving: false
};
let engravingText = "";
let isPlayingAudio = false;
let audioContext = null;
let musicTimeouts = [];

// Initialize DOM elements & events
document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  initCustomizer();
  initAudioPlayer();
  initTikTokPlayer();
  initShippingTabs();
  initFAQ();
  initCountdown();
  initStickyBar();
  initSmoothScroll();
});

function initIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// -------------------------------------------------------------
// 1. PRODUCT CUSTOMIZER & DYNAMIC WHATSAPP URL GENERATOR
// -------------------------------------------------------------
function initCustomizer() {
  const photoCheckbox = document.getElementById('extra-photos');
  const engraveCheckbox = document.getElementById('extra-engraving');
  const engraveInputWrapper = document.getElementById('engraving-input-container');
  const engraveInput = document.getElementById('engraving-text');
  
  if (photoCheckbox) {
    photoCheckbox.addEventListener('change', (e) => {
      selectedExtras.photos = e.target.checked;
      updatePriceAndLinks();
    });
  }

  if (engraveCheckbox) {
    engraveCheckbox.addEventListener('change', (e) => {
      selectedExtras.engraving = e.target.checked;
      if (engraveInputWrapper) {
        if (e.target.checked) {
          engraveInputWrapper.classList.remove('hidden');
          engraveInput?.focus();
        } else {
          engraveInputWrapper.classList.add('hidden');
        }
      }
      updatePriceAndLinks();
    });
  }

  if (engraveInput) {
    engraveInput.addEventListener('input', (e) => {
      engravingText = e.target.value.trim();
      updatePriceAndLinks();
    });
  }

  updatePriceAndLinks();
}

function calculateTotal() {
  let total = CONFIG.basePrice;
  if (selectedExtras.photos) total += CONFIG.photoPrice;
  if (selectedExtras.engraving) total += CONFIG.engravePrice;
  return total;
}

function generateWhatsAppMessage() {
  const total = calculateTotal();
  let msg = `¡Hola! 👋 Deseo pedir la *Cajita Musical Portarretrato Dragon Ball GT* ("Mi Corazón Encantado").\n\n`;
  msg += `🪵 *Precio base:* S/ ${CONFIG.basePrice}\n`;
  
  let extrasList = [];
  if (selectedExtras.photos) {
    extrasList.push(`• 2 Fotos impresas en papel fotográfico (+S/ ${CONFIG.photoPrice})`);
  }
  if (selectedExtras.engraving) {
    const textDesc = engravingText ? ` [Texto: "${engravingText}"]` : '';
    extrasList.push(`• Grabado a láser personalizado${textDesc} (+S/ ${CONFIG.engravePrice})`);
  }

  if (extrasList.length > 0) {
    msg += `✨ *Personalización añadida:*\n${extrasList.join('\n')}\n`;
  }

  msg += `\n💰 *Total a pagar:* *S/ ${total}*\n`;
  msg += `📦 *Modalidad de envío:* Por favor confirmar disponibilidad y método de entrega (Shalom / Olva).\n\n¡Quedo atento(a) para coordinar! 🐉✨`;

  return encodeURIComponent(msg);
}

function updatePriceAndLinks() {
  const total = calculateTotal();
  const totalPriceDisplay = document.getElementById('custom-total-price');
  const stickyPriceDisplay = document.getElementById('sticky-price');
  
  if (totalPriceDisplay) {
    totalPriceDisplay.textContent = `S/ ${total}`;
  }
  if (stickyPriceDisplay) {
    stickyPriceDisplay.textContent = `S/ ${total}`;
  }

  const message = generateWhatsAppMessage();
  const waUrl = `https://wa.me/${CONFIG.whatsappPhone}?text=${message}`;

  // Update all WhatsApp action buttons
  const waButtons = document.querySelectorAll('.btn-whatsapp-action');
  waButtons.forEach(btn => {
    btn.href = waUrl;
  });
}

// -------------------------------------------------------------
// 2. REALISTIC MUSIC BOX SOUND SYNTHESIZER (Web Audio API)
// -------------------------------------------------------------
// Notes for "Mi Corazón Encantado" (Dan Dan Kokoro Hikareteku) main melodic phrase
const MELODY_NOTES = [
  // Intro / Chorus hook: "Tu sonrisa tan resplandeciente..."
  { note: 'G4', dur: 0.35, delay: 0 },
  { note: 'B4', dur: 0.35, delay: 350 },
  { note: 'D5', dur: 0.35, delay: 700 },
  { note: 'E5', dur: 0.6,  delay: 1050 },
  { note: 'D5', dur: 0.4,  delay: 1550 },
  { note: 'B4', dur: 0.4,  delay: 1950 },
  { note: 'A4', dur: 0.4,  delay: 2350 },
  { note: 'B4', dur: 0.7,  delay: 2750 },
  // "a mi corazón deja encantado..."
  { note: 'G4', dur: 0.35, delay: 3600 },
  { note: 'A4', dur: 0.35, delay: 3950 },
  { note: 'B4', dur: 0.35, delay: 4300 },
  { note: 'D5', dur: 0.5,  delay: 4650 },
  { note: 'C5', dur: 0.4,  delay: 5150 },
  { note: 'B4', dur: 0.4,  delay: 5550 },
  { note: 'A4', dur: 0.4,  delay: 5950 },
  { note: 'G4', dur: 0.9,  delay: 6350 },
  // "Ven, toma mi mano..."
  { note: 'B4', dur: 0.4,  delay: 7450 },
  { note: 'C5', dur: 0.4,  delay: 7850 },
  { note: 'D5', dur: 0.6,  delay: 8250 },
  { note: 'E5', dur: 0.5,  delay: 8850 },
  { note: 'D5', dur: 0.5,  delay: 9350 },
  { note: 'B4', dur: 0.4,  delay: 9850 },
  { note: 'G4', dur: 0.8,  delay: 10250 },
  // "para huir de esta infinita oscuridad..."
  { note: 'A4', dur: 0.4,  delay: 11200 },
  { note: 'B4', dur: 0.4,  delay: 11600 },
  { note: 'C5', dur: 0.4,  delay: 12000 },
  { note: 'B4', dur: 0.4,  delay: 12400 },
  { note: 'A4', dur: 0.4,  delay: 12800 },
  { note: 'G4', dur: 1.2,  delay: 13200 }
];

const NOTE_FREQS = {
  'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25,
  'G5': 783.99, 'A5': 880.00, 'B5': 987.77
};

function playMusicBoxTine(freq, duration) {
  if (!audioContext) return;
  const now = audioContext.currentTime;

  // Master chime tone (Bell / Steel Music Box Comb Tine)
  const osc1 = audioContext.createOscillator();
  const osc2 = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  // Primary tone
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(freq, now);

  // Overtone for metal chime resonance
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(freq * 2.01, now);

  // Music box sharp pluck envelope
  gainNode.gain.setValueAtTime(0.001, now);
  gainNode.gain.exponentialRampToValueAtTime(0.35, now + 0.015);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration + 1.2);

  osc1.connect(gainNode);
  osc2.connect(gainNode);
  gainNode.connect(audioContext.destination);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + duration + 1.3);
  osc2.stop(now + duration + 1.3);
}

function initAudioPlayer() {
  const toggleBtn = document.getElementById('btn-play-melody');
  const soundBars = document.querySelectorAll('.sound-bar');
  const audioStatus = document.getElementById('audio-status-text');
  const discSpinner = document.getElementById('music-disc-spinner');

  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    if (isPlayingAudio) {
      stopAudio();
    } else {
      startAudio();
    }
  });

  function startAudio() {
    try {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
    } catch (e) {
      console.warn("AudioContext error", e);
    }

    isPlayingAudio = true;
    toggleBtn.classList.add('bg-amber-500', 'text-white');
    toggleBtn.classList.remove('bg-amber-100', 'text-amber-900');
    if (audioStatus) audioStatus.textContent = "Reproduciendo melodía...";
    if (discSpinner) discSpinner.classList.add('animate-spin');

    soundBars.forEach(bar => bar.classList.remove('sound-bar-paused'));

    // Schedule all notes
    musicTimeouts.forEach(t => clearTimeout(t));
    musicTimeouts = [];

    MELODY_NOTES.forEach(item => {
      const timeout = setTimeout(() => {
        if (isPlayingAudio) {
          playMusicBoxTine(NOTE_FREQS[item.note] || 440, item.dur);
        }
      }, item.delay);
      musicTimeouts.push(timeout);
    });

    // Auto finish after last note
    const lastNoteDelay = MELODY_NOTES[MELODY_NOTES.length - 1].delay + 2500;
    const endTimeout = setTimeout(() => {
      stopAudio();
    }, lastNoteDelay);
    musicTimeouts.push(endTimeout);
  }

  function stopAudio() {
    isPlayingAudio = false;
    musicTimeouts.forEach(t => clearTimeout(t));
    musicTimeouts = [];

    toggleBtn.classList.remove('bg-amber-500', 'text-white');
    toggleBtn.classList.add('bg-amber-100', 'text-amber-900');
    if (audioStatus) audioStatus.textContent = "Escuchar melodía 'Mi Corazón Encantado'";
    if (discSpinner) discSpinner.classList.remove('animate-spin');

    soundBars.forEach(bar => bar.classList.add('sound-bar-paused'));
  }
}

// -------------------------------------------------------------
// 3. CONFIGURABLE TIKTOK VIDEO & MEDIA PLAYER
// -------------------------------------------------------------
function initTikTokPlayer() {
  const container = document.getElementById('tiktok-embed-container');
  const configBtn = document.getElementById('btn-config-tiktok');
  const heroConfigBtn = document.getElementById('hero-config-tiktok-btn');
  const tiktokModal = document.getElementById('tiktok-modal');
  const tiktokInput = document.getElementById('tiktok-url-input');
  const tiktokSaveBtn = document.getElementById('tiktok-save-btn');
  const tiktokCloseBtn = document.getElementById('tiktok-close-btn');
  const heroSoundBtn = document.getElementById('btn-hero-sound');

  // Load saved tiktok URL or default (migrate from old dummy test url if present)
  let savedUrl = localStorage.getItem('bamboo_tiktok_url');
  if (!savedUrl || savedUrl.includes('7106594312292453678')) {
    savedUrl = CONFIG.tiktokDefaultUrl;
    localStorage.setItem('bamboo_tiktok_url', savedUrl);
  }
  
  renderTikTokEmbed(savedUrl);

  const openConfigModal = (e) => {
    if (e) e.preventDefault();
    if (tiktokInput) tiktokInput.value = localStorage.getItem('bamboo_tiktok_url') || CONFIG.tiktokDefaultUrl;
    if (tiktokModal) tiktokModal.classList.remove('hidden');
  };

  if (configBtn) configBtn.addEventListener('click', openConfigModal);
  if (heroConfigBtn) heroConfigBtn.addEventListener('click', openConfigModal);

  if (tiktokCloseBtn && tiktokModal) {
    tiktokCloseBtn.addEventListener('click', () => {
      tiktokModal.classList.add('hidden');
    });
  }

  if (tiktokSaveBtn && tiktokInput) {
    tiktokSaveBtn.addEventListener('click', () => {
      const val = tiktokInput.value.trim();
      if (val) {
        localStorage.setItem('bamboo_tiktok_url', val);
        renderTikTokEmbed(val);
        if (tiktokModal) tiktokModal.classList.add('hidden');
      }
    });
  }

  // Hook Hero sound button to audio player
  if (heroSoundBtn) {
    heroSoundBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const playBtn = document.getElementById('btn-play-melody');
      if (playBtn) playBtn.click();
    });
  }
}

function renderTikTokEmbed(url) {
  const desktopContainer = document.getElementById('tiktok-embed-container');
  const mobileContainer = document.getElementById('tiktok-embed-container-mobile');
  const targets = [desktopContainer, mobileContainer].filter(Boolean);
  if (targets.length === 0) return;

  // Extract TikTok Video ID if present (e.g. /video/7647972810433809671)
  const videoIdMatch = url ? url.match(/\/video\/(\d+)/) : null;
  const videoId = videoIdMatch ? videoIdMatch[1] : null;

  targets.forEach(container => {
    if (videoId) {
      container.innerHTML = `
        <iframe 
          src="https://www.tiktok.com/player/v1/${videoId}?autoplay=0&loop=1&music_info=1&description=1" 
          class="w-full h-full border-0 rounded-2xl sm:rounded-3xl bg-transparent" 
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      `;
    } else {
      container.innerHTML = `
        <div class="relative w-full h-full bg-[#FFEDC1] flex flex-col items-center justify-center p-6 text-center text-stone-900 select-none">
          <div class="w-20 h-20 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow-xl mb-4">
            <svg class="w-8 h-8 fill-current ml-1 text-stone-950" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <p class="font-bold text-lg text-stone-900">Cajita Musical en Acción</p>
          <p class="text-xs text-stone-600 mt-1">Mira el mecanismo a cuerda girando</p>
          <a href="${url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 mt-4 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 px-5 py-2.5 rounded-full shadow-md">
            <span>Ver en TikTok</span>
          </a>
        </div>
      `;
    }
  });
}

// -------------------------------------------------------------
// 4. SHIPPING TABS (SHALOM vs OLVA)
// -------------------------------------------------------------
function initShippingTabs() {
  const tabShalom = document.getElementById('tab-shalom');
  const tabOlva = document.getElementById('tab-olva');
  const contentShalom = document.getElementById('shipping-content-shalom');
  const contentOlva = document.getElementById('shipping-content-olva');

  if (tabShalom && tabOlva) {
    tabShalom.addEventListener('click', () => {
      tabShalom.classList.add('bg-amber-500', 'text-white', 'shadow-md');
      tabShalom.classList.remove('bg-stone-100', 'text-stone-700');
      tabOlva.classList.remove('bg-amber-500', 'text-white', 'shadow-md');
      tabOlva.classList.add('bg-stone-100', 'text-stone-700');

      contentShalom?.classList.remove('hidden');
      contentOlva?.classList.add('hidden');
    });

    tabOlva.addEventListener('click', () => {
      tabOlva.classList.add('bg-amber-500', 'text-white', 'shadow-md');
      tabOlva.classList.remove('bg-stone-100', 'text-stone-700');
      tabShalom.classList.remove('bg-amber-500', 'text-white', 'shadow-md');
      tabShalom.classList.add('bg-stone-100', 'text-stone-700');

      contentOlva?.classList.remove('hidden');
      contentShalom?.classList.add('hidden');
    });
  }
}

// -------------------------------------------------------------
// 5. FAQ ACCORDION
// -------------------------------------------------------------
function initFAQ() {
  const faqButtons = document.querySelectorAll('.faq-toggle');
  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const icon = btn.querySelector('.faq-icon');
      const isOpen = !content.classList.contains('hidden');

      // Close all first
      document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
      document.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('rotate-180'));

      if (!isOpen) {
        content.classList.remove('hidden');
        icon?.classList.add('rotate-180');
      }
    });
  });
}

// -------------------------------------------------------------
// 6. URGENCY STOCK & TIMER
// -------------------------------------------------------------
function initCountdown() {
  const minutesEl = document.getElementById('timer-minutes');
  const secondsEl = document.getElementById('timer-seconds');
  
  if (!minutesEl || !secondsEl) return;

  let totalSeconds = 14 * 60 + 38; // 14 mins 38 secs
  setInterval(() => {
    if (totalSeconds > 0) {
      totalSeconds--;
      const m = Math.floor(totalSeconds / 60);
      const s = totalSeconds % 60;
      minutesEl.textContent = m < 10 ? `0${m}` : m;
      secondsEl.textContent = s < 10 ? `0${s}` : s;
    }
  }, 1000);
}

// -------------------------------------------------------------
// 7. STICKY MOBILE BOTTOM BAR
// -------------------------------------------------------------
function initStickyBar() {
  const stickyBar = document.getElementById('sticky-mobile-bar');
  const heroSection = document.getElementById('hero');

  if (!stickyBar || !heroSection) return;

  window.addEventListener('scroll', () => {
    const heroBottom = heroSection.getBoundingClientRect().bottom;
    if (heroBottom < 0) {
      stickyBar.classList.remove('translate-y-full');
      stickyBar.classList.add('translate-y-0');
    } else {
      stickyBar.classList.add('translate-y-full');
      stickyBar.classList.remove('translate-y-0');
    }
  });
}

// -------------------------------------------------------------
// 8. SMOOTH SCROLL
// -------------------------------------------------------------
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
