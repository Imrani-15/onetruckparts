class Global {

    static selectedCatItem = null;
    
    static setSelectedCat(item){
       this.selectedCatItem = item;
    }
    static getSelectedCat(){
        return this.selectedCatItem;
    }
    

}

export default Global;