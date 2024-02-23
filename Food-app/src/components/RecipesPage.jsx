import React, { useState, useEffect } from 'react';
import axios from 'axios';
import spoonAPI from '../apiconfig.js';

// we utilized open source spoon api to get the recipes for the food items
function RecipesPage({ foodList }) {
	const [recipes, setRecipes] = useState([]);

	useEffect(() => {
		const ingredients = foodList.map((item) => item.foodItem).join(',');
		const fetchRecipes = async () => {
			try {
				const response = await axios.get(
					`https://api.spoonacular.com/recipes/findByIngredients`,
					{
						params: {
							ingredients: ingredients,
							number: 5,
							ranking: 2,
							apiKey: spoonAPI,
						},
					}
				);
				console.log(response.data);
				setRecipes(response.data);
			} catch (error) {
				console.error('Error fetching recipes:', error);
			}
		};

		if (ingredients) {
			fetchRecipes();
		}
	}, [foodList]);

	// Handler to fetch recipe details and redirect
	const handleRecipeClick = async (id) => {
		try {
			const response = await axios.get(
				`https://api.spoonacular.com/recipes/${id}/information`,
				{
					params: {
						apiKey: spoonAPI,
					},
				}
			);
			// Redirecting to the recipe's URL
			window.open(response.data.spoonacularSourceUrl, '_blank');
		} catch (error) {
			console.error('Error fetching recipe details:', error);
		}
	};

	return (
		<div>
			<h2>Recipes</h2>
			<ul>
				{recipes.map((recipe) => (
					<li key={recipe.id} onClick={() => handleRecipeClick(recipe.id)}>
						<a href='#'>{recipe.title}</a>
					</li>
				))}
			</ul>
		</div>
	);
}

export default RecipesPage;
