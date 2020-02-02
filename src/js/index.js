// Global app controller
import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';
import Recipe from './models/Recipe';

/*Global state of the app
 - Search object
 - Current recipe object
 - Shiping list object
 - Liked recipes
*/

const state = {};


/* Search Controller*/
const controlSearch = async () => {
    //1)Get the query from the view
    const query = searchView.getInput(); //TODO
    if (query) {
        //New seearch object and add it to state
        state.search = new Search(query);

        // Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        try {
            //Search for recipies
            await state.search.getResults();

            //render results on UI
            //state.search.result.forEach(e => console.log(e.recipe.label));
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (error) {
            console.log('Something wrong with the search');
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        console.log(goToPage);
    }
})



/* Recipe Controller*/
const controlRecipe = async () => {
    //Get the id from URL
    const id = window.location.hash.replace('#', '');
    if (id) {

        recipeView.clearRecipe();
        //Prepare UI for changes
        renderLoader(elements.recipe);

        //Create new recipe object
        state.recipe = new Recipe(id);
        try {
            //Get the recipe data and parse ingredients
            await state.recipe.getRecipe();
            
            state.recipe.parseIngredients();

            // //Calculate servings and time
            // state.recipe.calcTime();
            // state.recipe.calcServings();

            //Render the recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch (error) {
            console.log('Error proccessing recipe');
        }

    }
}



['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));