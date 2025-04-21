const express = require("express");
const cors = require("cors");
require("dotenv").config();

const adRoutes = require("./routes/adRoutes");
const storeRoutes = require("./routes/storeRoutes")
const checkApiKey = require('./middleware/apiKey');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors())

app.use(express.json());
app.use(checkApiKey);

app.use("/ads", adRoutes);
app.use("/stores", storeRoutes);

app.get("/", (req, res) => {
  res.send("API funcionando no Render!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
