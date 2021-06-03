

export const emailValidation = new RegExp("^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,13})+$");

export const passwordValidation = [
    {
      test: new RegExp("^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"),
      message: "Please enter a valid password"
    }
  ];
  


export const formValidation = ( isError, formData ) => {
    let isValid = true;
    Object.values(isError).forEach(
        (val) => val.length > 0 && (isValid = false)
    )
    Object.values(formData).forEach(val => {
        if (val === '') {
            isValid = false
        } else {
            isValid = true
        }
    });
    
    return isValid;
};

export const isNotEmpty = val =>{
    return !!val;
}


export const  showToastMessage =(toastRef,type, title, detail) => {
    return toastRef.current.show({ severity: type, summary: title, detail: detail, life: 5000 })
 }



