import axios from 'axios';
import userProfile from  './UserProfile';

function getHeaders(){
    let userData = userProfile.getUserObj();
    // onetruckparts --> true
    // oneauto --> remove
    // dev ---> false
    let isProd = false
    let accessToken = userData && userData.accessToken ? userData.accessToken  : null;
    if(accessToken === null){
        return  {
            headers: {
              "Content-Type": "application/json",
             "isprod": isProd
            },
         //   withCredentials: true,
          
          }
    }else{
        return  {
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${accessToken}` ,
              "isprod": isProd
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
