
const addTransit = "INSERT INTO passaggi (targa, postazione, orario) VALUES ($1, $2, $3)";
const checkTransit = "SELECT p FROM passaggi p WHERE p.targa = $1 AND p.postazione = $2";

const getTransits = "SELECT * FROM passaggi ORDER BY targa, postazione";
const getStations = "SELECT * FROM postazioni";
const getMaxDate = "SELECT MAX(orario) AS ultimo_orario FROM passaggi WHERE targa = $1";

module.exports = {
  addTransit,
  checkTransit,
  getTransits,
  getStations,
  getMaxDate,
};