const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    default: "",
  },
  estado: {
    type: String,
    enum: ["pendiente", "progreso", "completada"],
    default: "pendiente",
  },
  fechaCreacion:{
    type: Date,
    default: Date.now,
  },
  fechaVencimiento:{
    type: Date,
    default: null,
  },
});


module.exports = mongoose.model('Task', taskSchema);