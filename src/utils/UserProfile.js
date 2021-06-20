class userProfile {

    static userobj = {};
    static cart = [];
    static garage= [];
    static cartdet = {};
    static navobj = {};
    static orderItObj = {};
    static ordprinObj = {}

    static setOrderItObj(inpobj){
        this.orderItObj = inpobj;
       window.localStorage.setItem('orddata', JSON.stringify(inpobj));
    }

    static getOrderItObj(){
        let orderItObj =  window.localStorage.getItem('orddata');
        if(orderItObj){
            orderItObj = JSON.parse(orderItObj)
        }
        this.orderItObj = orderItObj
        return this.orderItObj
        
    }
    static setordprintObj(inpobj){
        this.ordprinObj = inpobj;
       window.localStorage.setItem('printdata', JSON.stringify(inpobj));
    }

    static getOrdprintItObj(){
        let ordprinObj =  window.localStorage.getItem('printdata');
        if(ordprinObj){
            ordprinObj = JSON.parse(ordprinObj)
        }
        this.ordprinObj = ordprinObj
        return this.ordprinObj
    }

    static setUserObj(inpobj){
        this.userobj = inpobj;
        window.localStorage.setItem('userdata', JSON.stringify(inpobj));
    }

    static getUserObj(){
        if(this.userobj && this.userobj.emailId){
            return this.userobj;
        }else {
            let userobj = window.localStorage.getItem('userdata');
            if(userobj){
                userobj = JSON.parse(userobj)
            }
            this.userobj = userobj || null;
            return userobj;
        }
    }

    static setCart(cart){
        this.cart = cart;
        window.localStorage.setItem('cart', JSON.stringify(cart));
    }

    static getCart(){
        if(this.cart && this.cart.length !==0){
            return this.cart;
        }else {
            let cart = window.localStorage.getItem('cart');
            if(cart){
                cart = JSON.parse(cart)
            }
            this.cart = cart || [];
            return cart;
        }
    }

    static setGarage(garage){
        this.garage = garage;
        window.localStorage.setItem('garage', JSON.stringify(garage));
    }

    static getGarage(){
        if(this.garage && this.garage.length !==0){
            return this.garage;
        }else {
            let garage = window.localStorage.getItem('garage');
            if(garage){
                garage = JSON.parse(garage)
            }
            this.garage = garage || [];
            return garage;
        }
    }

    static setcartDetails(details){
        this.cartdet = details;
        window.localStorage.setItem('cartdetails', JSON.stringify(details));
    }

    static getcartDetails(){
        if(this.cartdet && this.cartdet.cartcount){
            return this.cartdet;
        }else {
            let cartdet = window.localStorage.getItem('cartdetails');
            if(cartdet){
                cartdet = JSON.parse(cartdet)
            }
            this.cartdet = cartdet || null;
            return cartdet;
        }
    }

 

  

}

export default userProfile;