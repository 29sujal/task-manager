const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// All task routes are protected
router.use(protect);

router.route('/').get(getTasks).post(createTask);
router.route('/:id').put(updateTask).delete(deleteTask);
router.patch('/:id/toggle', toggleTask);

module.exports = router;
