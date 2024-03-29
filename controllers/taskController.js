const Task = require("../models/Task");

const authorizeAdmin = (req, res, next) => {
  const currentUser = req.user;
  if (currentUser && currentUser.roles.includes("ADMIN")) {
    next();
  } else {
    res
      .status(403)
      .json({ message: "No tienes permiso para editar esta tarea" });
  }
};

const taskController = {
  // Crear una Tarea
  createTask: async (req, res) => {
    try {
      const { titulo, descripcion, estado, fechaVencimiento } = req.body;
      if (!fechaVencimiento) {
        throw new Error("Fecha de vencimiento no fue registrada");
      }

      // Convertir la fecha en Fomrato ISO 8601
      const fechaVencimientoISO8601 = new Date(fechaVencimiento).toISOString();
      // crear un nuevo objeto con los datos del body:
      const newTask = new Task({
        titulo,
        descripcion,
        estado,
        fechaVencimiento: fechaVencimientoISO8601,
      });
      // Guarda los datos en la BD Mongo
      await newTask.save();
      // Responder con la tarea creada 201(Created)
      res.status(201).json(newTask);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Obtener todas las tareas
  getAllTask: async (req, res) => {
    try {
      const tasks = await Task.find();
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtener una tarea por Id
  getTaskById: async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (task) {
        res.status(200).json(task);
      } else {
        res.status(404).json({ message: "No existe el recurso" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Actualizar una tarea
  updateTask: [
    authorizeAdmin,
    async (req, res) => {
      try {
        // const {id, titulo, descripcion, estado, fechaVencimiento} = req.body;
        const { estado } = req.body;
        if (!["pendiente", "en progreso", "completada"].includes(estado)) {
          throw new Error("Estado incorrecto");
        }
        const updateTask = await Task.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        );
        if (updateTask) {
          res.status(200).json(updateTask);
        } else {
          res.status(202).json({ message: "Error al actualizar task" });
        }
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    },
  ],

  // Eliminar una tarea por ID
  deleteTask: async (req, res) => {
    try {
      const deleteTask = await Task.findByIdAndDelete(req.params.id);
      if (deleteTask) {
        res.status(200).json({ message: "Task eliminada correctamente" });
      } else {
        res.status(404).json({ message: "No existe Task con el Id ingresado" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = taskController;
