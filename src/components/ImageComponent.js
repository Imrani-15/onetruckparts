import React from 'react';


 
 const ImageComponent = ({image,name,imgStyle}) => {
  

        return (
            <img src={image} style={imgStyle}
                    onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'}
             alt={name} />
        )
     }

 
 
 
export default ImageComponent;
 

