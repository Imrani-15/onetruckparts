import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

 
 const AppSpinner = props => {
  

        return (
            <div style={{justifyContent:'center',alignItems:'center',alignContent:'center',
                    height:'100%',width:'100%',display:'flex',position:'fixed',
                    top:0,left:0,backgroundColor:'rgba(0,0,0,0.2)',zIndex:991}}> 
            <ProgressSpinner strokeWidth="4" style={{zIndex:999}} 
                animationDuration="1.5s"
                fill="transparent"/>
            </div>
        )
     }

 
 
 
export default AppSpinner;
 

