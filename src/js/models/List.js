import uniqid from 'uniqid'

export default class List{
    constructor(){
        this.items=[];
    }

    addItem (count, unit, ingredient){
        const item = {
            id:uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        this.persistData();
        return item;
    }


    deleteItem(id)
    {
        const index = this.items.findIndex(el=>el.id==id);
        this.items.splice(index,1);
        this.persistData();
        //Splice mutates the original array
    }

    updateCount(id,newCount){
        this.items.find(el=>el.id===id).count=newCount;
        this.persistData();
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('items'));

        //Restoring likes from the localStorage
        if (storage) { this.items = storage; }
    }

    
    persistData() {
        localStorage.setItem('items', JSON.stringify(this.items));
    }


}