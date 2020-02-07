import axios from 'axios'

import { baseURLSpecific, appId, appKey, baseURLAll } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios('https://api.edamam.com/search?r=' + baseURLSpecific + this.id + appId + appKey);
            this.title = res.data[0].label;
            this.author = res.data[0].source;
            this.img = res.data[0].image;
            this.ingredients = res.data[0].ingredients;
            this.url = res.data[0].url;
            this.time = res.data[0].totalTime || 15;
            this.servings = Math.floor(res.data[0].totalWeight / 300) || 1;          
        } catch (error) {
            console.log(error);
            alert('Something went wrong :(');
        }
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounces', 'teaspoon', 'teaspoons', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound','tbs.','lb.','tsp.','oz.'];

        const newIngredients = this.ingredients.map(el => {
            //1) Uniform units 
            let ingredient = el.text.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            //2) Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            //3)Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2));

            let objIng;
            if (unitIndex > -1) {
                //There is a unit
                const arrCount = arrIng.slice(0, unitIndex);

                let count;
                if (arrCount.length === 1) {
                    count = arrIng[0];
                }
                else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count:parseInt(count),
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex+1).join(' ')
                }


            } else if (parseInt(arrIng[0], 10)) {
                //THere is No unit, but there is a number
                objIng = {
                    count: parseInt(arrIng[0]),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                //There is NO unit and NO number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objIng;
        });
        this.ingredients = newIngredients;
    }

    updateServings(type) {
       
        //Servings
        const newServings = type ==='dec'? this.servings-1 : this.servings+1;
        //Ingredients
        let multiplicator = newServings/this.servings;
        this.ingredients.forEach(ing=>ing.count *= multiplicator);
        this.ingredients.forEach(ing=> ing.count = Math.round(ing.count*10)/10);
        this.servings = newServings;
    }

}