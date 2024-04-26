const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');

// Route: GET /api/workouts - Alle Workouts abrufen
router.get('/', async (req, res) => {
    try {
        const workouts = await Workout.find();
        res.json(workouts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    console.log("Adding Workout..", res)
    const workout = new Workout({
        date: req.body.date,
        exercises: req.body.exercises,
        totalCalories: req.body.totalCalories
    });

    try {
        const newWorkout = await workout.save();
        res.status(201).json(newWorkout);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Route: DELETE /api/workouts/:id - Workout löschen
router.delete('/:id', async (req, res) => {
    try {
        const deletedWorkout = await Workout.findByIdAndDelete(req.params.id);
        if (!deletedWorkout) {
            return res.status(404).json({ message: 'Workout not found' });
        }
        res.json({ message: 'Workout deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
