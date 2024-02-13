// RecipesPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import spoonAPI from '../apiconfig.js'; // Update this path to where your apiconfig.js is located

function RecipesPage({ foodList }) {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const ingredients = foodList.map(item => item.foodItem).join(',');
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(`https://api.spoonacular.com/recipes/findByIngredients`, {
          params: {
            ingredients: ingredients,
            number: 10,
           // apiKey: spoonAPI // Use the imported API key here
          }
        });
        setRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        // Optionally handle the error, e.g., by setting an error state
      }
    };

    if (ingredients) {
      fetchRecipes();
    }
  }, [foodList]); // Ensure foodList is a dependency so this effect runs when it changes

  return (
    <div>
      <h2>Recipes</h2>
      <ul>
        {recipes.map(recipe => (
          <li key={recipe.id}>{recipe.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default RecipesPage;
