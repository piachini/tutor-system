Il progetto è a supporto delle lezioni del corso TPSI V anno sulle architetture distribuite.

Tutor-System Backend

Implementa un sistema per registrare e gestire i passaggi delle automobili in postazioni di controllo.
Calcola la velocità media tra le postazioni, tenendo conto della distanza tra le stesse.
Segnala le infrazioni quando la velocità media supera i 130 km/h.
Salva i dati in un database PostgreSQL, con tabelle per postazioni e passaggi.


Struttura del database

Tabella postazioni:
- Contiene l'identificativo della postazione e la posizione chilometrica.

Tabella passaggi:
- Registra i passaggi delle auto con targa, ID della postazione e orario.


Endpoint REST

- POST /passaggi: registra un passaggio.
- GET /velocita: calcola la velocità media tra le postazioni per ogni auto.
- GET /infrazioni: restituisce le infrazioni.

-------

Tutor-System Frontend

Una semplice interfaccia web per interagire con il backend.
Consente di:
- Inserire i passaggi tramite un modulo.
- Visualizzare le velocità medie tra le postazioni in una tabella.
- Elencare le infrazioni (superamento della velocità media) in un'altra tabella.

Utilizzo di HTML/CSS per la struttura e lo stile.
Uso di JavaScript con Fetch API per comunicare con il backend.
Tabelle dinamiche per visualizzare i dati ottenuti dalle API.
