const Task = require('../models/Task');

const getTasks = async (req, res) => {
  try {
    const { search, status, priority, page = 1, limit = 6 } = req.query;

    const query = { userId: req.user._id };

    if (status && status !== 'all') query.status = status;
    if (priority && priority !== 'all') query.priority = priority;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      tasks,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      totalTasks: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};


const createTask = async (req, res) => {
  const { title, description, priority } = req.body;

  try {
    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      userId: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({message: error.message || 'Server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const { title, description, status, priority } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;

    const updated = await task.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};


const toggleTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = task.status === 'pending' ? 'completed' : 'pending';
    const updated = await task.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { getTasks, createTask, updateTask, toggleTask, deleteTask };
