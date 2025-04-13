// index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const adRoutes = require("./routes/adRoutes");
const allowedOrigins = ['https://guilda-4498a.web.app', 'http://localhost:3000'];
const checkApiKey = require('./middleware/apiKey');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Acesso negado'));
    }
  }
}));

app.use(express.json());
app.use(checkApiKey);

app.use("/ads", adRoutes);

app.get("/", (req, res) => {
  res.send("API funcionando no Render!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
