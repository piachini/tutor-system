const express = require("express");
const tutorRoutes = require("./api/v1/routes");

const LIMITE_VELOCITA = 130;

const app = express();
const port = 3000;

app.use(express.json());

const cors = require("cors");
app.use(cors());

app.use("/api/v1/tutor", tutorRoutes);

app.listen(port, () => {
    console.log("app listening on port", port)
});
