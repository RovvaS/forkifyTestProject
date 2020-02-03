import { elements } from './base';
//Да видим дали pull-ът работи
export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
}


export const highlightSelected = id =>{
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el=>{
        el.classList.remove('results__link--active');
    })
    document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
}

//Function to shorten the title of a recipe to fit on one row but with whole words only
const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0)

        return `${newTitle.join(' ')}...`;
    }
    return title;
}

const renderRecipe = recipe => {
    const hash = recipe.recipe.uri.split('#');
    const markup = `
       <li>
       <a class="results__link" href=#${hash[1]}>
           <figure class="results__fig">
               <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}">
           </figure>
           <div class="results__data">
               <h4 class="results__name">${limitRecipeTitle(recipe.recipe.label)}</h4>
               <p class="results__author">${recipe.recipe.source}</p>
           </div>
       </a>
   </li>
       `;

    elements.searchResList.insertAdjacentHTML('beforeend', markup);

}

//type: 'prev' or 'next'
const createButton = (page, type) => `
<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
<span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
</button>`;


const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;
    if (page === 1 && pages > 1) {
        //Only to next page 
        button = createButton(page, 'next');
    }
    else if (page < pages) {
        button = `${createButton(page, 'prev')}${createButton(page, 'next')}`;
    }
    else if (page === pages && pages > 1) {
        //Only to previous page
        button = createButton(page, 'prev');
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
}

export const renderResults = (recipies, page = 1, resPerPage = 10) => {
    //render results of current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recipies.slice(start, end).forEach(renderRecipe);

    //render buttons
    renderButtons(page, recipies.length, resPerPage);
}
