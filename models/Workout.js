// models/Workout.js

const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    exercises: [{
        exerciseName: {
            type: String,
            required: true
        },
        repetitions: {
            type: Number,
            required: true
        },
        weight: {
            type: Number,
            required: true
        }
    }]
});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;