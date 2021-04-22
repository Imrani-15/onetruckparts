
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

// export function createNavItems(inpArr){
//     if(!inpArr) return;
//     if(inpArr.length==0) return; 
    
//     let navItems = [];
//     for(let i=0;i<inpArr.length;i++){
//         switch (inpArr[i]['navpath']){
//             case '/dashboard':
//             case '/screenlist':
//             case '/ordlist':
//             case '/categories':
//             case '/custlist':
//             case '/alerts':
//             case '/promolist':
//             case '/poslist':
//             case '/reports': 
//             case '/feedback':
            
            
//             case '/orglist': {
//                 navItems.push({label:inpArr[i]['scrname'],icon:inpArr[i]['scricon'],navpath:inpArr[i]['navpath'],
//                 addopt:inpArr[i]['addopt'],editopt:inpArr[i]['editopt'],delopt:inpArr[i]['delopt'],expopt:inpArr[i]['expopt']});
//                 break;
//             }
//             case '/productlist':
//             case '/productitems':
//             case '/deals':
//             case '/lowstock' : {
//                 let isProd = false;
//                 for(let j=0;j<navItems.length;j++){
//                     if(navItems[j].label == 'Products') {
//                         isProd = true; break;
//                     }
//                 }
//                 if(!isProd){
//                     navItems.push({label:'Products',icon:'pi pi-fw pi-bars',items:[]});
//                 }
//                 for(let j=0;j<navItems.length;j++){
//                     if(navItems[j].label == 'Products') {
//                         navItems[j].items.push({label:inpArr[i]['scrname'],icon:inpArr[i]['scricon'],navpath:inpArr[i]['navpath'],addopt:inpArr[i]['addopt'],editopt:inpArr[i]['editopt'],delopt:inpArr[i]['delopt'],expopt:inpArr[i]['expopt']});
//                         break;
//                     }
//                 }
//                 break;
                
                
//             }
//             case '/terms':
//             case '/importdata':
//             case '/covid':
//             case '/faqs':
//             case '/aboutus':
//             case '/ppolicy':
//             case '/bannerlist':
//             case '/slotlist':
//             case '/employee':
//             case '/tags':
//             case '/hsncode' : {
//                 let isProd = false;
//                 for(let j=0;j<navItems.length;j++){
//                     if(navItems[j].label == 'Settings') {
//                         isProd = true; break;
//                     }
//                 }
//                 if(!isProd){
//                     navItems.push({label:'Settings',icon:'pi pi-fw pi-bars',items:[]});
//                 }
//                 for(let j=0;j<navItems.length;j++){
//                     if(navItems[j].label == 'Settings') {
//                         navItems[j].items.push({label:inpArr[i]['scrname'],icon:inpArr[i]['scricon'],navpath:inpArr[i]['navpath'],addopt:inpArr[i]['addopt'],editopt:inpArr[i]['editopt'],delopt:inpArr[i]['delopt'],expopt:inpArr[i]['expopt']});
//                         break;
//                     }
//                 }
//                 break;
                
                
//             }
//             default:break;

//         }

//     } // end for
//     return navItems;

// } // end function
