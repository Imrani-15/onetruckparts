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


export function createNavItems(inpArr){
    if(!inpArr) return;
    if(inpArr.length==0) return; 
    
    let navItems = [];
    for(let i=0;i<inpArr.length;i++){
        switch (inpArr[i]['navpath']){
            case '/dashboard':
            case '/allproducts': 
            case '/fullfill'  :
            case '/marketing':
            case '/help':     
            case '/orglist': {
                navItems.push({label:inpArr[i]['scrname'],icon:inpArr[i]['scricon'],navpath:inpArr[i]['navpath']});
                break;
            }
            case '/ebayproducts':
            case '/ebaycompitators':
            case '/amazonproducts':
            case '/amazoncompitators':
            case '/channel' : {
                let isProd = false;
                for(let j=0;j<navItems.length;j++){
                    if(navItems[j].label === 'Channel') {
                        isProd = true; break;
                    }
                }
                if(!isProd){
                    navItems.push({label:'Channel',icon:'pi pi-fw pi-bars',items:[]});
                }
                for(let j=0;j<navItems.length;j++){
                    if(navItems[j].label === 'Channel') {
                        navItems[j].items.push({label:inpArr[i]['scrname'],icon:inpArr[i]['scricon'],navpath:inpArr[i]['navpath']});
                        break;
                    }
                }
                break;
                
                
            }
            default:break;

        }

    } // end for
    return navItems;

} // end function
