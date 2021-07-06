

import serviceCall from './Services';
import userProfile from './UserProfile';
import {PRODUCT_BASE_URL} from './Constants';




export function updateProductToCart(product,quantity,type="ADD"){
    return new Promise((resolve, reject) => {
        let restUrl = `${PRODUCT_BASE_URL}cart/add/${product.osku}/${quantity}`;
        let userCart = userProfile.getCart();
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


export function addressValidate(address){
    return new Promise((resolve, reject) => {
        let restUrl = `${PRODUCT_BASE_URL}address/validate`
            serviceCall(address, restUrl, 'POST').then((res)=>{
                resolve(res);
            })
            .catch((err)=>{
               reject(err)
            })

    }).catch((ex) => {
        console.log(ex);
    });

}



export function taxValidation(address){
    return new Promise((resolve, reject) => {
        let restUrl = `${PRODUCT_BASE_URL}address/tax`;
        let userCart = userProfile.getCart();
        let taxPayload = {
            "type": "SalesInvoice",
            "companyCode": "272160843",
            "date": "2022-04-12",
            "customerCode": "oneauto",
            "purchaseOrderNo": "2017-04-12-001",
            "addresses": {
              "SingleLocation": address
            },
            "lines": userCart,
            "commit": true,
            "currencyCode": "USD",
            "description": "Yarn"
        }
             serviceCall({taxDocument:taxPayload}, restUrl, 'POST').then((res)=>{
                if (res && !res.data.error) {
                   console.log("Rajesh", res)
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


