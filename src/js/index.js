// Global app controller
import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements } from './views/base';


/*Global state of the app
 - Search object
 - Current recipe object
 - Shiping list object
 - Liked recipes
*/


const state = {};


const controlSearch = async () => {
    //1)Get the query from the view
    const query = searchView.getInput(); //TODO
    console.log(query);
    if (query) {
        //New seearch object and add it to state
        state.search = new Search(query);

        // Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();

        //Search for recipies
        await state.search.getResults();

        //render results on UI
        //state.search.result.forEach(e => console.log(e.recipe.label));
        searchView.renderResults(state.search.result);
    }

}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})


