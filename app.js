const express = require("express");
const mongoose = require("mongoose"); //ORM
const cors = require('cors');

require("dotenv").config();

const app = express();

// Middlware de Cors y parse JSON
app.use(cors());
app.use(express.json());

// Conexion a BD MongoDB
console.log(process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Conectado a MongoDB");
  })
  .catch((err) => console.error("No se logro conectar a la BD Mongo"));

  const PORT = process.env.PORT || 8080;

  app.listen(PORT, ()=>{
    console.log(`Servidor ejecutandose en el puerto ${PORT}`);
  });
