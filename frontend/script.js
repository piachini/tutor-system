// API URLs
const baseUrl = 'http://localhost:3000/api/v1/tutor';
const passaggiUrl = `${baseUrl}/passaggi`;
const velocitaUrl = `${baseUrl}/velocita`;
const infrazioniUrl = `${baseUrl}/infrazioni`;

// Riferimenti al DOM
const passaggiForm = document.getElementById('passaggi-form');
const velocitaTbody = document.getElementById('velocita-tbody');
const infrazioniTbody = document.getElementById('infrazioni-tbody');

// Funzione per aggiungere un passaggio
passaggiForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const targa = document.getElementById('targa').value;
    const postazione = document.getElementById('postazione').value;
    const orario = document.getElementById('orario').value;

    const body = { targa, postazione: parseInt(postazione), orario };

    try {
        const response = await fetch(passaggiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            alert('Passaggio registrato con successo!');
            passaggiForm.reset();
            aggiornaDati();
        } else {
            const error = await response.json();
            alert(`Errore: ${error.errore}`);
        }
    } catch (err) {
        console.error(err);
        alert('Errore del server.');
    }
});

// Funzione per aggiornare la tabella delle velocità
async function aggiornaVelocita() {
    velocitaTbody.innerHTML = ''; // Svuota la tabella

    try {
        const response = await fetch(velocitaUrl);
        const dati = await response.json();

        for (const [targa, velocitaArray] of Object.entries(dati)) {
            velocitaArray.forEach(({ postazioneDa, postazioneA, distanza, velocita }) => {
                const row = `<tr>
                    <td>${targa}</td>
                    <td class=\"center\">${postazioneDa}</td>
                    <td class=\"center\">${postazioneA}</td>
                    <td class=\"center\">${distanza}</td>
                    <td class=\"right\">${velocita.toFixed(2)}</td>
                </tr>`;
                velocitaTbody.innerHTML += row;
            });
        }
    } catch (err) {
        console.error(err);
    }
}

// Funzione per aggiornare la tabella delle infrazioni
async function aggiornaInfrazioni() {
    infrazioniTbody.innerHTML = ''; // Svuota la tabella

    try {
        const response = await fetch(infrazioniUrl);
        const dati = await response.json();

        dati.forEach(({ targa, postazioneDa, postazioneA, velocita }) => {
            const row = `<tr>
                <td>${targa}</td>
                <td class=\"center\">${postazioneDa}</td>
                <td class=\"center\">${postazioneA}</td>
                <td class=\"right\">${velocita.toFixed(2)}</td>
            </tr>`;
            infrazioniTbody.innerHTML += row;
        });
    } catch (err) {
        console.error(err);
    }
}

// Aggiorna le tabelle al caricamento della pagina
async function aggiornaDati() {
    await aggiornaVelocita();
    await aggiornaInfrazioni();
}

document.addEventListener('DOMContentLoaded', aggiornaDati);
