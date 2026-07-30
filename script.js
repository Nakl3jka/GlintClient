import { supabase } from './supabase.js';

// --- Fade-in on scroll ---
const fadeElements = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.2 });
fadeElements.forEach(el => observer.observe(el));

// --- Navbar toggle ---
const toggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
    });
});

// --- Download Modal ---
const modal = document.getElementById('downloadModal');
const openBtn = document.getElementById('openDownloadModal');
const closeBtn = document.getElementById('closeModal');
const windowsBtn = document.getElementById('windowsDownloadBtn');

openBtn.addEventListener('click', () => modal.classList.add('active'));
closeBtn.addEventListener('click', () => modal.classList.remove('active'));
modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
});
windowsBtn.addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = 'https://example.com/glint-client-setup.exe';
    a.download = 'GlintClient_Setup.exe';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    modal.classList.remove('active');
});

// --- Activation Code Checker ---
const activationInput = document.getElementById('activationInput');
const activationCheckBtn = document.getElementById('activationCheckBtn');
const activationResult = document.getElementById('activationResult');

activationCheckBtn.addEventListener('click', async () => {
    const code = activationInput.value.trim();
    if (!code) {
        activationResult.textContent = 'Please enter a code.';
        activationResult.className = 'activation-result invalid';
        return;
    }

    try {
        const { data, error } = await supabase
            .from('codes')
            .select('code, active, expires_at, reward')
            .eq('code', code)
            .single();

        if (error || !data) {
            activationResult.textContent = 'Invalid code.';
            activationResult.className = 'activation-result invalid';
            return;
        }

        if (!data.active) {
            activationResult.textContent = 'Expired code.';
            activationResult.className = 'activation-result expired';
            return;
        }

        if (data.expires_at) {
            const now = new Date();
            const exp = new Date(data.expires_at);
            if (exp < now) {
                activationResult.textContent = 'Expired code.';
                activationResult.className = 'activation-result expired';
                return;
            }
        }

        let msg = '✅ Valid code.';
        if (data.reward) msg += ` Reward: ${data.reward}`;
        activationResult.textContent = msg;
        activationResult.className = 'activation-result valid';
    } catch (err) {
        activationResult.textContent = 'Error checking code.';
        activationResult.className = 'activation-result invalid';
        console.error(err);
    }
});

// --- Player Count (exactly under the download button) ---
const playerCountDisplay = document.getElementById('playerCountDisplay');

async function updatePlayerCount() {
    try {
        const { count, error } = await supabase
            .from('player_active')
            .select('*', { count: 'exact', head: true })
            .eq('is_online', true);

        if (error) throw error;

        const countText = count === 1 ? '1 player' : `${count} players`;
        playerCountDisplay.innerHTML = `<span>${countText}</span> now online`;
    } catch (err) {
        console.error('Error fetching player count:', err);
        playerCountDisplay.textContent = 'Failed to load player count';
    }
}

updatePlayerCount();
setInterval(updatePlayerCount, 10000);
