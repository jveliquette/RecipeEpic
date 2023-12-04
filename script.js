// Declaring Variables //
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const mealList = document.getElementById('mealList');
const recipeContainer = document.querySelector('.recipe-container');
const recipeCloseButton = document.querySelector('.close-button');
const mealDetailsContent = document.querySelector('.meal-details-content');


// Event Listeners //

// Listens for a click on a button, retrieves the entered ingredient from an input field,
// Performs a search for meals using that ingredient through function (searchMealsByIngredient),
// Then displays the obtained meals on the UI using function (displayMeals).
searchButton.addEventListener('click', async () => {
    const ingredient = searchInput.value.trim();
    if(ingredient) {
        const meals = await searchMealsByIngredient(ingredient);
        displayMeals(meals);
    }
});

// Handles clicks on individual meal items within the mealList.
// When a meal item is clicked, it retrieves the meal's identifier, information about
// That meal using function (getMealDetails), then displays the detailed information in a
// Popup using function (showMealDetailsPopup).
mealList.addEventListener('click', async (e) => {
    const card = e.target.closest('.meal-item');
    if(card) {
        const mealId = card.dataset.id;
        const meal = await getMealDetails(mealId);
        if(meal) {
            showMealDetailsPopup(meal);
        }
    }
});


// Function to get meals by ingredient //

// Performs an asynchronous fetch to an API endpoint that searches for meals
// Based on a specified ingredient. If the fetch operation is successful, it parses the
// JSON response and returns the meals. If there's an error during the fetch or JSON parsing,
// It logs an error message to the console.
async function searchMealsByIngredient(ingredient) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
        const data = await response.json();
        return data.meals;
    } catch(error) {
        // Prints error to the console //
        console.error('Error fetching data:', error);
    }
}


// Function to get meal details by ID //

// Performs an asynchronous fetch to an API endpoint that retrieves details of a specific
// Meal by its ID (mealId). If the fetch operation is successful, it parses the JSON response
// And returns the details of the first meal. If there's an error during the fetch or JSON parsing,
// It logs an error message to the console.
async function getMealDetails(mealId) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await response.json();
        return data.meals[0];
    } catch(error) {
        // Prints error to the console //
        console.error('Error fetching meal details:', error);
    }
}


// Function to display meals //

// This function creates HTML elements for each meal, populates them with the meal's info,
// And appends them to the 'mealList' element. If there are no meals, it displays a message
// Saying that no meals were found.
function displayMeals(meals) {
    mealList.innerHTML = '';
    if(meals) {
        meals.forEach((meal) => {
            const mealItem = document.createElement('div');
            mealItem.classList.add('meal-item');
            mealItem.dataset.id = meal.idMeal;
            mealItem.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
            `;
            mealList.appendChild(mealItem);
        });
    } else {
        mealList.innerHTML = '<p>No meals found. Try searching another ingredient.</p>';
    }
}


// Function to create and display meal details (popup) //

// Generates HTML content based on the meal's properties and updates the mealDetailsContent
// Element. It makes the recipeContainer visible, displaying the information about the
// Selected meal in a popup.
function showMealDetailsPopup(meal) {
    mealDetailsContent.innerHTML = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-img">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        </div>
        <div class="recipe-video">
            <a href="${meal.strYoutube}" target="_blank">Video Tutorial</a>
        </div>
    `;
    recipeContainer.style.display = 'block';
}


// Popup close button event listener //

// When this button is clicked, it will execute the closeRecipeContainer function.
recipeCloseButton.addEventListener('click', closeRecipeContainer);

// Sets the display CSS property of the recipeContainer to 'none', hiding the container.
function closeRecipeContainer() {
    recipeContainer.style.display = 'none';
}

// Adds event listener to the searchInput element (my search bar). It listens for the 'keyup' event.
// When Enter key is pressed, it executes the performSearch function.
searchInput.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        performSearch();
    }
});

// Called when the Enter key is pressed in the search field. Retrieves the trimmed value of the input
// If the ingredient is not an empty string (if(ingredient)), it performs a search for meals based on
// The entered ingredient using the searchMealsByIngredient function. Meals are displayed using displayMeals function.
async function performSearch() {
    const ingredient = searchInput.value.trim();
    if(ingredient) {
        const meals = await searchMealsByIngredient(ingredient);
        displayMeals(meals);
    }
}


// Search chicken on page load //

// When the entire page has finished loading, this code sets the default value of the search
// Input field to 'chicken' and immediately performs a search for meals using the performSearch function.
// Prepopulates and displays search results on page load.
window.addEventListener('load', () => {
    searchInput.value = 'chicken';
    performSearch();
})
