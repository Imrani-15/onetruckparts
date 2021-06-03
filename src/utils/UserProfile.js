class userProfile {

    static userobj = {};
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
        console.log(this.orderItObj)
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

    static setUserToken(token){
        window.localStorage.setItem('token', token);
    }

    static getUserToken(){
        let accessToken = window.localStorage.getItem('token');
        if(accessToken){
            return accessToken;
        }else{
            return null
        }
    }

 

  

}

export default userProfile;