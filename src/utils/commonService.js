

import serviceCall from './Services';
import userProfile from './UserProfile';
import {PRODUCT_BASE_URL} from './Constants';




export function updateProductToCart(product,quantity,type="ADD"){
    return new Promise((resolve, reject) => {
        //let restUrl = (type === "ADD") ? `${PRODUCT_BASE_URL}cart/add/${product.osku}/${quantity}` :  `${PRODUCT_BASE_URL}cart/remove/${product.osku}/${quantity}`;
        let restUrl = `${PRODUCT_BASE_URL}cart/add/${product.osku}/${quantity}`;
        let userCart = userProfile.getCart()
             serviceCall({cart:userCart}, restUrl, 'POST').then((res)=>{
                if (res && !res.data.error) {
                    userProfile.setCart(res.data.cart);
                    userProfile.setcartDetails({ cartcount: res.data.cartcount, orderTotal: res.data.ordertotal })
                }
                resolve(res);
            })
            .catch((err)=>{
               reject(err)
            })

    }).catch((ex) => {
        console.log(ex);
    });

}

export function productSaveLater(emailId,product){
    return new Promise((resolve, reject) => {
        let restUrl = `${PRODUCT_BASE_URL}account/saveforlater`;
            let inpobj = {
                emailId: emailId,
                osku: product.osku
            }
             serviceCall(inpobj, restUrl, 'POST').then((res)=>{
                resolve(res);
            })
            .catch((err)=>{
               reject(err)
            })

    }).catch((ex) => {
        console.log(ex);
    });

}

export function removeFitmentFromGarage(fitmentIndex){
    return new Promise((resolve, reject) => {
        let restUrl = `${PRODUCT_BASE_URL}fitment/garage/delete/${fitmentIndex}`
        let getGarage = userProfile.getGarage()
             serviceCall({garage:getGarage}, restUrl, 'POST').then((res)=>{
                if (res && !res.data.error) {
                    userProfile.setGarage(res.data.garage);
                }
                resolve(res);
            })
            .catch((err)=>{
               reject(err)
            })

    }).catch((ex) => {
        console.log(ex);
    });

}