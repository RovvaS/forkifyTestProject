export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchResList: document.querySelector('.results__list'),
    recipe:document.querySelector('.recipe'),
    searchRes: document.querySelector('.results'),
    searchResPages: document.querySelector('.results__pages'),
    shopping:document.querySelector('.shopping__list'),
    likesMenu:document.querySelector('.likes__field'),
    likesList:document.querySelector('.likes__list'),
    deleteShoppingList:document.querySelector('.shopping'),
    delShoppingListButt:document.querySelector('.shopping__delete__btn-big'),
};

//General
export const elementStrings = {
    loader: 'loader'
}

export const renderLoader = parent => {
    const loader = `<div class="${elementStrings.loader}">
        <svg>
            <use href='img/icons.svg#icon-cw'></use>
        </svg>
    </div>`;
    parent.insertAdjacentHTML('afterbegin', loader);
}

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if (loader) loader.parentElement.removeChild(loader);
}