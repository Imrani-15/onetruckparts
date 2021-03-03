import axios from 'axios';
import {BASE_URL} from  './Constants';

function buildDataRequest(inpobj) {
    var reqData = '';
    for (var prop in inpobj) {
        reqData = reqData + '&' + prop + "=" + inpobj[prop];
    }
    return reqData.substr(1);
}

function getHeaders(){
    return  { headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
}

function getSecureHeaders(){
    return  { headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
}


export default function serviceApi(inpobj,methodName,type='get',secure=false){
    let headers = (secure) ?  getSecureHeaders() : getHeaders();

    return new Promise((resolve,reject)=>{
        axios({
            method: type,
            url: BASE_URL+methodName,
            data: buildDataRequest(inpobj),
            config: headers
        }).then((res)=>resolve(res))
            .catch((err)=>reject(err))
    })
}
