import axios from 'axios';
import userProfile from  './UserProfile';

function getHeaders(){
    let userData = userProfile.getUserObj();
    let accessToken = userData && userData.accessToken ? userData.accessToken  : null;
    // onetruckparts or oneauto
    if(accessToken === null){
        return  {
            headers: {
              "Content-Type": "application/json",
              "label": "oneauto"
            },
         //   withCredentials: true,
          
          }
    }else{
        return  {
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${accessToken}` ,
              "label": "oneauto"
            },
         //   withCredentials: true,
          }
    }
   
}




export default function serviceCall(inpobj,restUrl,type='GET'){
    let headers =  getHeaders();

    return new Promise((resolve,reject)=>{
        if(type === 'GET'){
            axios.get(restUrl, headers)
            .then((res)=>resolve(res))
            .catch((err)=>reject(err))
        }else if(type === 'DELETE'){
            axios.delete(restUrl, headers)
            .then((res)=>resolve(res))
            .catch((err)=>reject(err))
        }else {
            axios.post(restUrl,inpobj, headers)
            .then((res)=>resolve(res))
            .catch((err)=>reject(err))

        }
       
    })
}
