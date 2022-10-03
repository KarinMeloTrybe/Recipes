import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Recommendations from './Recommendations';
import { fetchByID, fetchInitialItems } from '../services/fetchAPI';
import Context from '../context/Context';

export default function MealDetail({ id }) {
  const [recipe, setRecipe] = useState([]);
  const [recommendation, setRecommendation] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [measures, setMeasures] = useState([]);

  const { setRecipeInProgress } = useContext(Context);

  // faz o fetch apartir do ID e coloca a receita no estado do componente.
  useEffect(() => {
    const idFetch = async () => {
      const { meals } = await fetchByID(id, 'Meals');
      setRecipe(meals[0]);
    };
    idFetch();
  }, []);

  // fetch para setar o estado das receitas recomendadas
  useEffect(() => {
    const RecommendationDrinksFetch = async () => {
      const { drinks } = await fetchInitialItems('Drinks');
      setRecommendation(drinks);
    };
    RecommendationDrinksFetch();
  }, []);

  // coloca a receita no estado do Provider para ser recuperado na tela de RecipeInProgress
  useEffect(() => {
    setRecipeInProgress(recipe);
  }, [recipe]);

  // apartir da receita, busca e filtra somente os ingredientes e medidas existentes e coloca em novos estados
  useEffect(() => {
    const FIRST_INGREDIENT = Object.keys(recipe).indexOf('strIngredient1');
    const LAST_INGREDIENT = Object.keys(recipe).indexOf('strIngredient20');
    const FIRST_MEASURE = Object.keys(recipe).indexOf('strMeasure1');
    const LAST_MEASURE = Object.keys(recipe).indexOf('strMeasure20');
    const ingredValues = Object.values(recipe).slice(FIRST_INGREDIENT, LAST_INGREDIENT);
    const measuresValues = Object.values(recipe).slice(FIRST_MEASURE, LAST_MEASURE);
    setIngredients(ingredValues.filter((i) => i));
    setMeasures(measuresValues.filter((m) => m !== ' '));
  }, [recipe]);

  return (
    <div>
      <img
        className="detailsImage"
        data-testid="recipe-photo"
        src={ recipe?.strMealThumb }
        alt={ recipe?.strMeal }
      />
      <h3 data-testid="recipe-title">{ recipe?.strMeal }</h3>
      <h5 data-testid="recipe-category">{ recipe?.strCategory }</h5>
      <ul>
        {ingredients.map((ing, index) => (
          <li
            data-testid={ `${index}-ingredient-name-and-measure` }
            key={ index }
          >
            {`${ing}: ${measures[index]}`}
          </li>
        ))}
      </ul>
      <fieldset>
        <p data-testid="instructions">{ recipe?.strInstructions }</p>
      </fieldset>
      <div>
        <iframe
          title="YTVideo"
          width="280"
          height="165"
          src={ recipe?.strYoutube?.replace('watch?v=', 'embed/') }
          data-testid="video"
        >
          youtube
        </iframe>

      </div>
      {
        recommendation.length > 0 && (
          <Recommendations recommendations={ recommendation } title="Drinks" />
        )
      }
    </div>
  );
}

MealDetail.propTypes = {
  id: PropTypes.string.isRequired,
};