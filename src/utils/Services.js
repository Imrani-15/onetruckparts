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
    return  {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
}

function getSecureHeaders(){
    return  { headers: {'Content-Type': 'application/x-www-form-urlencoded'}, withCredentials: true}
}


export default function serviceCall(inpobj,restUrl,type='GET',secure=false){
    let headers = (secure) ?  getSecureHeaders() : getHeaders();

    return new Promise((resolve,reject)=>{
        if(type === 'GET'){
            axios.get(restUrl, headers)
            .then((res)=>resolve(res))
            .catch((err)=>reject(err))
        }else{
            axios({
                method: type,
                url: restUrl,
                data: inpobj,
                config: headers
            }).then((res)=>resolve(res))
                .catch((err)=>reject(err))
        }
       
    })
}
