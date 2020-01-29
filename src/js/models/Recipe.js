import axios from 'axios'

import { baseURLSpecific, appId, appKey, baseURLAll } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios('https://api.edamam.com/search?r=' + baseURLSpecific + this.id+appId+appKey);
            this.title = res.data[0].label;
            this.author = res.data[0].source;
            this.img = res.data[0].image;
            this.ingredients = res.data[0].ingredients;
            this.url - res.data[0].url;
            this.time = res.data[0].totalTime || 15;
            this.servings = Math.floor(res.data[0].totalWeight / 300) || 1;
            //console.log(res);            
        } catch (error) {
            console.log(error);
            alert('Something went wrong :(');
        }
    }
}