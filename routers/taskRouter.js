const {Router} = require('express');
const router = Router();
const taskController = require('../controllers/taskController');

router.post('/', taskController.createTask);
router.get('/', taskController.getAllTask);
router.get('/:id', taskController.getTaskById);

module.exports = router;
