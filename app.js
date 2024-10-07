import express from 'express';
import db from './models/index.js';  // Au lieu de './models'
const { Task } = db;
const app = express();
app.use(express.json());

// Route pour créer une nouvelle tâche
app.post('/tasks', async (req, res) => {
  const { title, description, status } = req.body;
  try {
    const newTask = await Task.create({ title, description, status });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Impossible de créer la tâche' });
  }
});

// Route pour récupérer toutes les tâches
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Impossible de récupérer les tâches' });
  }
});

// Route pour récupérer une tâche par ID
app.get('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findByPk(id);
    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404).json({ error: 'Tâche non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la tâche' });
  }
});

// Route pour mettre à jour une tâche
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  try {
    const task = await Task.findByPk(id);
    if (task) {
      task.title = title;
      task.description = description;
      task.status = status;
      await task.save();
      res.status(200).json(task);
    } else {
      res.status(404).json({ error: 'Tâche non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la tâche' });
  }
});

// Route pour supprimer une tâche
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findByPk(id);
    if (task) {
      await task.destroy();
      res.status(200).json({ message: 'Tâche supprimée avec succès' });
    } else {
      res.status(404).json({ error: 'Tâche non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la tâche' });
  }
});

// Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
