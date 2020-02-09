import { elements } from './base';

export const renderItem = item => {
    const markup = ` <li class="shopping__item" data-itemid=${item.id}>
                        <div class="shopping__count">
                             <input type="number" value="${item.count}" step="${item.count}" min="1" class="shoping__count-value">
                             <p>${item.unit}</p>
                        </div>
                        <p class="shopping__description">${item.ingredient}</p>
                        <button class="shopping__delete btn-tiny">
                            <svg>
                                <use href="img/icons.svg#icon-circle-with-cross"></use>
                            </svg>
                        </button>
                    </li>`;
    elements.shopping.insertAdjacentHTML('beforeend', markup);
}

export const deleteItem = id => {
    const item = document.querySelector(`[data-itemid="${id}"]`);
    item.parentElement.removeChild(item);
    
}


//Render of Delete button for My shopping list
export const renderDelButton = () => {
    if (!document.querySelector('.shopping__delete__btn-big')) {
        const markup = `<button id="DELETE" class="shopping__delete__btn-big btn"> Delete All</button>`;
        elements.shopping.insertAdjacentHTML('afterend', markup);
    }
}

//Delete the whole LIST
export const deleteList = () => {
    elements.shopping.innerHTML = '';
    document.querySelector('.shopping__delete__btn-big').parentElement.removeChild(document.querySelector('.shopping__delete__btn-big'));
}

export const hideIngredIsRequired = ()=>{
    document.querySelector('#MissingIngredient').innerHTML="";
}