// Global app controller
import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements,renderLoader,clearLoader } from './views/base';
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

        //Search for recipies
        await state.search.getResults();
        
        //render results on UI
        //state.search.result.forEach(e => console.log(e.recipe.label));
        clearLoader();
        searchView.renderResults(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})

elements.searchResPages.addEventListener('click', e=>{
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage =parseInt(btn.dataset.goto,10);
        searchView.clearResults();
        searchView.renderResults(state.search.result,goToPage);
        console.log(goToPage);
    }})



    /* Recipe Controller*/
    let res = new Recipe("recipe_9b5945e03f05acbf9d69625138385408");
    res.getRecipe()
    console.log(res);
    