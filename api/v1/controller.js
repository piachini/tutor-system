const { error } = require("console");
const pool = require("../../db");
const queries = require("./queries");

const LIMITE_VELOCITA = 130;
const NUM_STATIONS = 5;

// Endpoint per registrare un passaggio
const addTransit = async (req, res) => {
    const { targa, postazione, orario } = req.body;
    if (!targa || postazione == null || !orario) {
        return res.status(400).json({ errore: 'Missing data' });
    }
    if (postazione > NUM_STATIONS) {
        return res.status(400).json({ errore: 'Invalid station number' });
    }
    
    try {

    // check se l'orario è compatibile (più recente) per una targa di cui si
    // vuole inserire un passaggio

    const lastOrarioPerTarga = await pool.query(queries.getMaxDate, [targa]);

    // console.log(new Date(lastOrarioPerTarga.rows[0].ultimo_orario));
    // console.log(new Date(orario));
    
    if ((lastOrarioPerTarga.rows[0].ultimo_orario) && new Date(orario) <= new Date(lastOrarioPerTarga.rows[0].ultimo_orario)) {
        return res.status(400).json({ errore: 'Invalid transit date'});
    }

    // check se esiste già un passaggio con stessa targa e stessa posizione
        const resultCheckTransit = await pool.query(queries.checkTransit, [targa, postazione]);
        if (resultCheckTransit.rows.length) {
            return res.status(400).json({ errore: 'Invalid transit'});
        } else {
            // aggiunge il passaggio auto
                await pool.query(queries.addTransit, [targa, postazione, orario]);
                res.status(201).json({ messaggio: 'Transit added' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ errore: 'Server error' });
    }
};

// Funzione per calcolare velocità media in Km/h per una distanzaKm percorsa
// in un periodo di tempo da orario1 ad orario2
function calcolaVelocitaConDistanza(distanzaKm, orario1, orario2) {
    const tempoOre = Math.abs(new Date(orario2) - new Date(orario1)) / (1000 * 60 * 60);
    return distanzaKm / tempoOre;
}

// Endpoint per calcolare le velocità medie di ciascuna auto in ciascun tratto
// tra una postazione e la sua successiva

const getAvgSpeeds = async (req, res) => {
    
    try {
        // Ottieni tutti i passaggi ordinati
        const resultPassaggi = await pool.query(queries.getTransits);

        // Ottieni la posizione delle postazioni
        const resultPostazioni = await pool.query(queries.getStations);
     
        const posizioniPostazioni = {};
        resultPostazioni.rows.forEach((p) => {
            posizioniPostazioni[p.id] = p.posizione_km;
        });

        const passaggi = resultPassaggi.rows;
        const risultati = {};

        // Raggruppa i passaggi per targa
        passaggi.forEach((p) => {
            if (!risultati[p.targa]) risultati[p.targa] = [];
            risultati[p.targa].push(p);
        });

        // Calcola le velocità medie
        const velocitaCalcolata = {};
        for (const targa in risultati) {
            const passaggiOrdinati = risultati[targa];
            velocitaCalcolata[targa] = [];

            for (let i = 1; i < passaggiOrdinati.length; i++) {
                const p1 = passaggiOrdinati[i - 1];
                const p2 = passaggiOrdinati[i];

                if (p2.postazione === p1.postazione + 1) {
                    const distanza = posizioniPostazioni[p2.postazione] - posizioniPostazioni[p1.postazione];
                    const velocita = calcolaVelocitaConDistanza(distanza, p1.orario, p2.orario);
                    velocitaCalcolata[targa].push({
                        postazioneDa: p1.postazione,
                        postazioneA: p2.postazione,
                        distanza,
                        velocita
                    });
                }
            }
        }
        res.json(velocitaCalcolata);
    } catch (error) {
        console.error(error);
        res.status(500).json({ errore: 'Errore del server' });
    };
};


// Endpoint per segnalare infrazioni

const getInfringments = async (req, res) => {

    try {
        // Ottieni tutti i passaggi ordinati
        const resultPassaggi = await pool.query(queries.getTransits);

        // Ottieni la posizione delle postazioni
        const resultPostazioni = await pool.query(queries.getStations);

        const posizioniPostazioni = {};
        resultPostazioni.rows.forEach((p) => {
            posizioniPostazioni[p.id] = p.posizione_km;
        });

        const passaggi = resultPassaggi.rows;
        const infrazioni = [];
        const risultati = {};

        // Raggruppa i passaggi per targa
        passaggi.forEach((p) => {
            if (!risultati[p.targa]) risultati[p.targa] = [];
            risultati[p.targa].push(p);
        });

        // Individua le infrazioni
        for (const targa in risultati) {
            const passaggiOrdinati = risultati[targa];

            for (let i = 1; i < passaggiOrdinati.length; i++) {
                const p1 = passaggiOrdinati[i - 1];
                const p2 = passaggiOrdinati[i];

                if (p2.postazione === p1.postazione + 1) {
                    const distanza = posizioniPostazioni[p2.postazione] - posizioniPostazioni[p1.postazione];
                    const velocita = calcolaVelocitaConDistanza(distanza, p1.orario, p2.orario);
                    if (velocita > LIMITE_VELOCITA) {
                        infrazioni.push({
                            targa,
                            velocita,
                            distanza,
                            postazioneDa: p1.postazione,
                            postazioneA: p2.postazione
                        });
                    }
                }
            }
        }

        res.json(infrazioni);
    } catch (error) {
        console.error(error);
        res.status(500).json({ errore: 'Errore del server' });
    }
};


module.exports = {
    addTransit,
    getAvgSpeeds,
    getInfringments,
}
