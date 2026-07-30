// ===== Pobieranie najnowszej aktualizacji =====
async function fetchLatestUpdate() {
    const container = document.getElementById('latestUpdate');
    const DOCS_URL = 'https://docs.google.com/document/d/1UyX9zzSaaz2HVWZkkavanANkWTI0up2otZ1yywN8JhE/export?format=txt';

    try {
        const response = await fetch(DOCS_URL);
        if (!response.ok) throw new Error('Nie udało się pobrać');

        const text = await response.text();
        const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

        let latest = null;
        let changes = [];

        for (const line of lines) {
            const versionMatch = line.match(/^v(\d+\.\d+\.\d+)\s*[-–—]\s*(\d{2}\.\d{2}\.\d{4})/i) ||
                                line.match(/^v(\d+\.\d+\.\d+)\s*(\d{2}\.\d{2}\.\d{4})/i);

            if (versionMatch) {
                if (latest) break; // już mamy najnowszy
                latest = { version: versionMatch[1], date: versionMatch[2] };
                changes = [];
            } else if (latest && (line.startsWith('-') || line.startsWith('•') || line.startsWith('*') || line.startsWith('✦'))) {
                let change = line.replace(/^[-•*✦]\s*/, '').trim();
                if (change) changes.push(change);
            }
        }

        if (latest && changes.length > 0) {
            container.innerHTML = `
                <div class="update-header">
                    <span class="update-version">v${latest.version}</span>
                    <span class="update-date">${latest.date}</span>
                </div>
                <ul class="update-changes">
                    ${changes.map(c => `<li>✦ ${c}</li>`).join('')}
                </ul>
                <a href="updates.html" class="btn btn-secondary btn-small">View Full Changelog</a>
            `;
        } else {
            // Przykładowe dane fallback
            container.innerHTML = `
                <div class="update-header">
                    <span class="update-version">v0.0.1</span>
                    <span class="update-date">07.30.2026</span>
                </div>
                <ul class="update-changes">
                    <li>✦ Added shop</li>
                    <li>✦ Added codes</li>
                    <li>✦ Added log in</li>
                    <li>✦ Added settings</li>
                </ul>
                <a href="updates.html" class="btn btn-secondary btn-small">View Full Changelog</a>
            `;
        }
    } catch (error) {
        console.error('Błąd pobierania aktualizacji:', error);
        container.innerHTML = `
            <div style="text-align:center;color:#ff6b6b;padding:20px 0;">
                ❌ Nie udało się pobrać aktualizacji
            </div>
            <a href="updates.html" class="btn btn-secondary btn-small" style="display:block;margin:0 auto;text-align:center;max-width:200px;">
                View Full Changelog
            </a>
        `;
    }
}

fetchLatestUpdate();
