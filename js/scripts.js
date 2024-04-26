document.addEventListener('DOMContentLoaded', function() {
    const mainContent = document.getElementById('mainContent');
    const workoutsList = document.getElementById('previousWorkoutsList');

    document.getElementById('addWorkoutLink').addEventListener('click', event => {
        event.preventDefault();
        loadAddWorkoutForm();
    });

    document.getElementById('previousWorkoutsLink').addEventListener('click', function(event) {
        event.preventDefault();
        loadPreviousWorkouts();
    });

    document.getElementById('calorieTrackerLink').addEventListener('click', function(event) {
        event.preventDefault();
        calorieProtein();
    });

    document.getElementById('supplementsLink').addEventListener('click', function(event) {
        event.preventDefault();
        loadSupplements();
    });

    let addExerciseButtonListener = () => {
        const addExerciseButton = document.getElementById('addExerciseButton');
        const exercisesContainer = document.getElementById('exercisesContainer');
        let exerciseCount = exercisesContainer.querySelectorAll('.exercise').length + 1;

        addExerciseButton.addEventListener('click', function() {
            exerciseCount++;
            const newExercise = document.createElement('div');
            newExercise.className = 'exercise';
            newExercise.innerHTML = `
                <label for="exerciseName${exerciseCount}">Exercise Name:</label>
                <input type="text" id="exerciseName${exerciseCount}" required>
                <label for="repetitions${exerciseCount}">Repetitions:</label>
                <input type="number" id="repetitions${exerciseCount}" required>
                <label for="weight${exerciseCount}">Weight (KG):</label>
                <input type="number" id="weight${exerciseCount}" required>
            `;
            exercisesContainer.appendChild(newExercise);
        });
    }

    function loadAddWorkoutForm() {
        mainContent.innerHTML = `
            <h2>Add new Workout</h2>
            <form id="addWorkoutForm">
                <label for="workoutDate">Date:</label>
                <input type="date" id="workoutDate" placeholder="dd.mm.yyyy" required>
                <div id="exercisesContainer">
                    <div class="exercise">
                        <label for="exerciseName1">Exercise Name:</label>
                        <input type="text" id="exerciseName1" required>
                        <label for="repetitions1">Repetitions:</label>
                        <input type="number" id="repetitions1" required>
                        <label for="weight1">Weight (KG):</label>
                        <input type="number" id="weight1" required>
                    </div>
                </div>
                <button type="button" id="addExerciseButton">Add Exercise</button>
                <button id="submit" type="button">Submit Workout</button>
            </form>
        `;
        addExerciseButtonListener();

        const addWorkoutButton = document.getElementById('submit');
        addWorkoutButton.addEventListener('click', function(event) {
            console.log("clicked")
            const workoutDate = document.getElementById('workoutDate').value;
            const exercises = Array.from(document.querySelectorAll('.exercise')).map(exercise => ({
                exerciseName: exercise.querySelector('input[type="text"]').value,
                repetitions: exercise.querySelector('input[type="number"]').value,
                weight: exercise.querySelector('input[type="number"]').value,
                caloriesBurned: calculateCaloriesBurned(
                    exercise.querySelector('input[type="number"]').value,
                    exercise.querySelector('input[type="number"]').value
                )
            }));
            const totalCalories = exercises.reduce((sum, exercise) => sum + exercise.caloriesBurned, 0);
            const newWorkout = { date: workoutDate, exercises, totalCalories };
            const xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST", "http://localhost:3000/api/", false)
            xmlhttp.setRequestHeader("Content-Type", "application/json")
            xmlhttp.send(JSON.stringify(newWorkout))
            // addWorkoutForm.reset();
            loadPreviousWorkouts();
        });
    }

    function calculateCaloriesBurned(repetitions, weight) {
        const caloriesPerRepetition = 0.1; // Beispielwert
        return Math.round(repetitions * weight * caloriesPerRepetition);
    }

    async function loadPreviousWorkouts() {
        mainContent.innerHTML = `
            <h2>Previous Workouts</h2>
            <ul id="previousWorkoutsList"></ul>`;

        const previousWorkoutsList = document.getElementById('previousWorkoutsList');
        previousWorkoutsList.innerHTML = '';

        const res = await fetch("http://localhost:3000/api/");
        const workouts = await res.json()

        workouts.forEach((workout) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>Date:</strong> ${workout.date}<br><hr>
                <strong>Total Calories:</strong> ${workout.totalCalories}<br><hr>
                <strong>Exercises:</strong><hr>
                <ul>
                    ${workout.exercises.map(exercise => `
                        <li>${exercise.exerciseName} - Repetitions: ${exercise.repetitions}, Weight: ${exercise.weight} KG</li>
                    `).join('')}
                </ul>
                <button class="deleteButton">Delete</button>
            `;
            previousWorkoutsList.appendChild(listItem);
        });

        previousWorkoutsList.addEventListener('click', function(event) {
            if (event.target.classList.contains('deleteButton')) {
                const listItem = event.target.closest('li');
                const index = Array.from(previousWorkoutsList.children).indexOf(listItem);
                workouts.slice(index, 1);
                loadPreviousWorkouts();
            }
        });
    }

    function calorieProtein() {
        mainContent.innerHTML = `
            <h2>Protein and Calorie Tracker</h2>
            <div id="calorieTrackerForm">
                <label for="genderSelect">Gender:</label>
                <select id="genderSelect">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                <label for="weightInput">Weight (kg):</label>
                <input type="number" id="weightInput" required>
                <label for="heightInput">Height (cm):</label>
                <input type="number" id="heightInput" required>
                <label for="ageInput">Age (years):</label>
                <input type="number" id="ageInput" required>
                <button id="calculateButton">Calculate</button>
                <div id="resultsContainer"></div>
            </div>
        `;
    
        const calculateButton = document.getElementById('calculateButton');
        const resultsContainer = document.getElementById('resultsContainer');
    
        calculateButton.addEventListener('click', function() {
            const gender = document.getElementById('genderSelect').value;
            const weight = parseFloat(document.getElementById('weightInput').value);
            const height = parseFloat(document.getElementById('heightInput').value);
            const age = parseInt(document.getElementById('ageInput').value);
    
            if (isNaN(weight) || isNaN(height) || isNaN(age)) {
                resultsContainer.innerHTML = '<p>Please enter valid numeric values.</p>';
                return;
            }
    
            let bmr;
            if (gender === 'male') {
                bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
            } else if (gender === 'female') {
                bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
            }
    
            let proteinIntake;
            if (gender === 'male') {
                proteinIntake = weight * 2;
            } else if (gender === 'female') {
                proteinIntake = weight * 1.8;
            }
    
            resultsContainer.innerHTML = `
                <p><strong>BMR:</strong> ${bmr.toFixed(2)} calories/day</p>
                <p><strong>Protein Intake:</strong> ${proteinIntake.toFixed(2)} grams/day</p>
            `;
        });
    }

    function loadSupplements() {
        mainContent.innerHTML = `
            <h2>Daily Supplements and Split</h2>
             <div class="info-text">
                <p> Creatine: 5G </p>
                <p> Protein: 150G - 180G </p>
                <p> Fats: 50G - 80G </p>
                <p> Carbs: Rest </p><hr>
            <div> Split:
             <p> hi </p>
             
             </div>
             
        `;
    }
});
