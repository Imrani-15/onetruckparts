export const __DEV__ = true;

export const BASE_URL = 'http://localhost:8000/';

export const PRODUCT_BASE_URL = 'https://customtemplateapis-dot-gentle-epoch-277301.uk.r.appspot.com/';

export const appTheme = {
    primaryColor:'#142977',
    navBarColor: '#4781CA', 
    secondaryColor:'#EB3875',
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
      screenToNavigate: '/orders',
    },
    {
      navOptionName: `About Us`,
      screenToNavigate: '/about',
    },
    {
      navOptionThumb: 'help_outline',
      navOptionName: `FAQ'S`,
      screenToNavigate: '/faq',
      callService:true,
      type:'FAQ'
    },
    {
      navOptionThumb: 'receipt',
      navOptionName: `Terms & Conditions`,
      screenToNavigate: '/terms',
      callService:true,
      type:'TERMS'
    },
    {
      navOptionThumb: 'privacy_tip',
      navOptionName: `Privacy & Policy`,
      screenToNavigate: '/privacy',
      callService:true,
      type:'PPOLICY'
    },
    {
      navOptionThumb: 'coronavirus',
      navOptionName: `Covid Saftey measures`,
      screenToNavigate: '/covid',
      callService:true,
      type:'COVID'
    }
  ]



