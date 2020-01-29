import axios from "axios";
import {baseURLAll, appId,appKey} from '../config';


export default class Search {
    constructor(query) {
        this.query = query;
    }
    async getResults() {
        try {
            let url = baseURLAll + this.query + appId + appKey;
            const res = await axios(url);
            this.result = res.data.hits;
        }
        catch (error) {
            alert('error');
        }
    }
}








//testURL - https://api.edamam.com/search?q=chicken&app_id=c0c8f017&app_key=b6ad6c67d4afedd289363a910f948814


//Sync Vmethod
/*export default class Search {
    constructor(query) {
        this.query = query;
    }

    SearchForRecipe() {
        try {
            let url = baseURL + this.query + appId + appKey;
            let request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.send();
            request.onload = function () {
                var data = JSON.parse(this.response);
                let recipies = data.hits;
                recipies.forEach(e => console.log(e.recipe.label));
            }
        }
        catch (error) {
            alert('error');
        }
    }
}
 */