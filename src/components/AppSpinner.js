import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

 
 const AppSpinner = props => {
  

        return (
            <div style={{justifyContent:'center',alignItems:'center',alignContent:'center',
                    height:'100%',width:'100%',display:'flex',position:'fixed',
                    top:0,left:0,backgroundColor:'transparent',opacity:'0.8',zIndex:991}}> 
            <ProgressSpinner strokeWidth="6" style={{zIndex:999}} fill="#fff"/>
           
            </div>
        )
     }

 
 
 
export default AppSpinner;
 

