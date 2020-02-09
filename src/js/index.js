// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';
import uniqid from 'uniqid';



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

        //Highlight selected search
        if (state.search) searchView.highlightSelected(id);

        //Create new recipe object
        state.recipe = new Recipe(id);
        try {
            //Get the recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //Render the recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        } catch (error) {
            console.log('Error proccessing recipe');
        }

    }
}



['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//Handling Recipe button clciks


document.querySelector('#AddToShoppingList').addEventListener('click', () => {
    if (!state.list) {
        state.list = new List();
    }

    const custEl = document.querySelectorAll('.custIn');

    if (custEl[2].value) {
        const item = {
            id: uniqid(),
            count: custEl[0].value,
            unit: custEl[1].value,
            ingredient: custEl[2].value
        }
        state.list.addItem(item);
        listView.renderItem(item);
        listView.renderDelButton();   
        listView.hideIngredIsRequired();    
        custEl.forEach(el=>el.value="");
    }
    else{
        document.querySelector('#MissingIngredient').innerHTML='Ingredient is required';
    }
})

document.querySelector('#custIngredIngred').addEventListener('click', listView.hideIngredIsRequired);



/*List Controller*/
const controlList = () => {
    //Create a new list if there is none yet
    if (!state.list) {
        state.list = new List();
    }

    //Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });

    listView.renderDelButton();
}

//Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //Handle the delete event
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {

        //Delete from state
        state.list.deleteItem(id);

        //Delete from UI
        listView.deleteItem(id);
       
        if (state.list.items.length===0){ listView.deleteList()}
    }
    //handle the count update
    else if (e.target.matches('.shoping__count-value')) {
        debugger;
        const val = parseFloat(e.target.value);
        if (val > 0) {
            state.list.updateCount(id, val);
        }
    }
})


elements.deleteShoppingList.addEventListener('click', e => {
    if (e.target.matches('.shopping__delete__btn-big , .shopping__delete__btn-big *')) {
        listView.deleteList();
    }
})




window.addEventListener('load', () => {
    state.likes = new Likes();

    //Restore likes
    state.likes.readStorage();

    //Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumberLikes());

    //Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});


/*Like Controller*/
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    //User has not yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        //Add like to the state
        const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.author, state.recipe.img);

        //Toggle the like button
        likesView.togglelikeBtn(true);

        //Add like to the UI list
        likesView.renderLike(newLike)

        //User HAS liked current recipe
    } else {
        // Remove like from state
        state.likes.deleteLike(currentID);

        //Toggle the like button
        likesView.togglelikeBtn(false);

        //Remove like from UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumberLikes());
}

elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease,.btn-decrease *')) {
        //Decreasse button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }

    } else if (e.target.matches('.btn-increase,.btn-increase *')) {
        //Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        //Add ingredients to shopping list
        controlList();
    }
    else if (e.target.matches('.recipe__love,.recipe__love * ')) {
        controlLike();
    }
})

