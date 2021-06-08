export const __DEV__ = true;

export const BASE_URL = 'http://localhost:8000/';

export const PRODUCT_BASE_URL = 'https://customtemplateapis-dot-gentle-epoch-277301.uk.r.appspot.com/';

export const userRoles = {
    CUSTOMER : "customer",
    ADMIN : "admin"
}

export const sectionTypes = {
  SCROLL : "scroll",
  GRID : "grid"
}

export const orderStatus = {
  PENDING : "pending",
  INPROGRESS : "inprogress"
}

export const deviceWidth = {
  MOBILE : 424,
  TAB: 767,
  LAPTOP: 1023
}
export const appTheme = {

    primaryColor:'#041E42',
    navBarColor: '#4781CA', 
    secondaryColor:'#142977',
    launchBgColor:'#361059',
    logoTextColor:'#FF891E',
    lightText: '#6c757d',
    dark1:'#2c2c2c',
    dark2:'#222222',
    dark3:'#333333',
    dark4:'#444444',
    dark5:'#555555',
    dark6:'#666',
    dark9:'#999999'
 
 
}

export const menuItems = [
    {
      navOptionName: `My Wishlist`,
      screenToNavigate: '/saveforlater',
    },
    {
      navOptionName: `My Orders`,
      screenToNavigate: '/my-orders',
    },
    // {
    //   navOptionName: `About Us`,
    //   screenToNavigate: '/about',
    // },
    // {
    //   navOptionThumb: 'receipt',
    //   navOptionName: `Terms & Conditions`,
    //   screenToNavigate: '/terms',
    //   callService:true,
    //   type:'TERMS'
    // },
    // {
    //   navOptionThumb: 'privacy_tip',
    //   navOptionName: `Privacy & Policy`,
    //   screenToNavigate: '/privacy',
    //   callService:true,
    //   type:'PPOLICY'
    // }
  ]



