const express = require("express");
const mongoose = require("mongoose"); //ORM
const cors = require('cors');
const jwt = require('jsonwebtoken');

const taskRouter  =require('./routers/taskRouter');
const authRouter = require('./routers/authRouter');

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

// Middleware
const authenticateToken = (req, res, next)=>{
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({message: 'token de autorizacion no proporcionado'});
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
    if (err) {
      return res.status(403).json({message: 'Token no autenticaion no valido'});
    }
    console.log(user);
    req.user = user;
    next();
  });

  
};


app.use('/api/users', authRouter )
app.use('/api/task', authenticateToken, taskRouter);


const PORT = process.env.PORT || 8080;

app.listen(PORT, ()=>{
console.log(`Servidor ejecutandose en el puerto ${PORT}`);
});
