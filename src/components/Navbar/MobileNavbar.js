import React, { Fragment } from 'react';

import {
   Select, Drawer,
   Badge, Avatar
} from 'antd';
import { Link } from 'next/router';


import { connect } from "react-redux";
import {
   DownOutlined, ShoppingCartOutlined,
   CarOutlined, UserOutlined
} from '@ant-design/icons';

import Search from './Search';
import OneButton from '../OneButton';
import logo from '../../assets/oneauto.png';
import noFitment from '../../assets/nofitment.png';

import { isNotEmpty } from '../../utils/Utils';
import serviceCall from '../../utils/Services';
import { appTheme, menuItems, PRODUCT_BASE_URL, userRoles } from '../../utils/Constants';
import userProfile from '../../utils/UserProfile';
import FirebaseAuth from '../../containers/Auth/FirebaseAuth';

import {styles} from '../..styles/Navbar.css';

const { Option } = Select;
class MobileNavbar extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         showSideMenu: false,
         showAccountPopOver: false,
         createNewFitment: false,
         userData: {},
         categories: [],
         fitmentList: [],
         fitmentYear: [],
         fitmentMake: [],
         fitmentModel: [],
         selectedYear: null,
         selectedMake: null,
         selectedModel: null

      }

      this.overLayRef = React.createRef();
   }


   componentDidMount() {
      this.getCategories();
      let userData = userProfile.getUserObj();
      this.setState({ userData: userData });
   }

   componentDidUpdate(prevProps) {

   }


   getCategories = () => {
      let restUrl = `${PRODUCT_BASE_URL}prod/categories`
      serviceCall({}, restUrl, 'GET')
         .then((res) => {
            if (!res.error) {
               this.props.getcategories(res.data);
               this.setState({ categories: res.data })
            } else {

            }
         })
         .catch((error) => {
         })
   }

   handleVisibleChange = showAccountPopOver => {
      this.setState({ showAccountPopOver });
   };

   hideMenuPopOver = () => {
      this.setState({ showAccountPopOver: false })
   }

   logOut = () => {
      FirebaseAuth.auth().signOut().then(() => {
         userProfile.setUserObj({});
         this.setState({ showAccountPopOver: false, userData: {} })
         window.location = "/";
      })
   }


   renderMenu = () => {
      const { userData } = this.state;
      return (
         <div>
            <div className={styles.menuListBtnItem}>
               {(userData && userData.emailId) ?
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                     <Avatar size="large" style={{ backgroundColor: appTheme.primaryColor }} >
                        {userData.emailId.charAt(0)}
                     </Avatar>
                     <h3 style={{ alignSelf: 'center', marginLeft: 10 }}>{userData.emailId}</h3>
                  </div> :
                  <Link className={styles.navbarBtnText} to="/login">
                     <OneButton
                        buttonLabel={"Login or Sign Up"}
                        btnSize="large"
                        buttonStyle={{
                           fontSize: 16, backgroundColor: appTheme.logoTextColor,
                           borderColor: appTheme.logoTextColor, width: 200, height: 40

                        }}
                     />
                  </Link>}
            </div>
            {menuItems.map((item, index) =>
               <Link className={styles.menuListItem} key={index} to={item.screenToNavigate}
                  onClick={this.hideMenuPopOver.bind(this)}
               >
                  <h4 style={{ color: appTheme.lightColor }}>
                     {item.navOptionName}
                  </h4>
               </Link>
            )}
            <Link className={styles.menuListItem} to='/settings'
               onClick={this.hideMenuPopOver.bind(this)}
            >
               <h4 style={{ color: appTheme.lightColor }}>
                  Settings
              </h4>
            </Link>
            {(userData && userData.accessToken) &&
               <div className={styles.menuListItem}
                  onClick={this.logOut.bind(this)}
               >
                  <h4 style={{ color: appTheme.lightColor }}>
                     Log Out
                </h4>
               </div>}
         </div>
      )
   }

   openFitmentPopOver = (e) => {
      this.getFitmentList();
      this.getFitmentYear();
      this.overLayRef.current.toggle(e)
   }


   getFitmentList = () => {
      let restUrl = `${PRODUCT_BASE_URL}fitment/garage`
      serviceCall({}, restUrl, 'GET')
         .then((res) => {
            if (!res.error) {
               this.setState({ fitmentList: res.data.garage })
            } else {

            }
         })
         .catch((error) => {
         })
   }

   getFitmentYear = () => {
      let restUrl = `${PRODUCT_BASE_URL}fitment/year`
      serviceCall({}, restUrl, 'GET')
         .then((res) => {
            if (!res.error) {
               this.setState({ fitmentYear: res.data.years })
            } else {

            }
         })
         .catch((error) => {
         })
   }

   selectedYear(value) {
      this.setState({ selectedYear: value }, () => {
         this.getFitmentMake(value);
      })
   }

   getFitmentMake = (year) => {
      let restUrl = `${PRODUCT_BASE_URL}fitment/make/${year}`
      serviceCall({}, restUrl, 'GET')
         .then((res) => {
            if (!res.error) {
               this.setState({ fitmentMake: res.data.makes })
            } else {

            }
         })
         .catch((error) => {
         })
   }

   selectedMake(value) {
      this.setState({ selectedMake: value }, () => {
         this.getFitmentModel(value);
      })
   }

   getFitmentModel = (make) => {
      let restUrl = `${PRODUCT_BASE_URL}fitment/model/${make}/${this.state.selectedYear}`
      serviceCall({}, restUrl, 'GET')
         .then((res) => {
            if (!res.error) {
               this.setState({ fitmentModel: res.data.models })
            } else {

            }
         })
         .catch((error) => {
         })
   }

   addVehicle = () => {
      const { selectedYear, selectedMake, selectedModel } = this.state;
      if (!isNotEmpty(selectedYear)) {

      } else if (!isNotEmpty(selectedMake)) {

      } else if (!isNotEmpty(selectedModel)) {

      } else {
         let restUrl = `${PRODUCT_BASE_URL}fitment/garage/add/${selectedYear}/${selectedMake}/${selectedModel}`
         serviceCall({}, restUrl, 'GET')
            .then((res) => {
               if (!res.error) {
                  this.setState({ fitmentList: res.data.garage, createNewFitment: false })
               } else {

               }
            })
            .catch((error) => {
            })
      }

   }

   deleteVechile = (index) => {
      let restUrl = `${PRODUCT_BASE_URL}fitment/garage/delete/${index}`
      serviceCall({}, restUrl, 'GET')
         .then((res) => {
            if (!res.error) {
               this.setState({ fitmentList: res.data.garage, createNewFitment: false })
            } else {

            }
         })
         .catch((error) => {
         })
   }





   render() {
      const { showSideMenu, categories, createNewFitment, showAccountPopOver, fitmentList, userData,
         fitmentYear, fitmentMake, fitmentModel, selectedYear, selectedMake } = this.state
      let { userdata } = this.props;

      return (
         <Fragment>
            <div className={styles.mobileNavbarMain}>
               <i className="pi pi-align-justify" style={{ color: '#fff', fontSize: 22 }} onClick={() => this.setState({ showSideMenu: true })} ></i>
               <img src={logo} alt={'logo'} style={{ alignSelf: 'center' }} height="28px" />
               <Link to={'/cart'}>
                  <Badge style={{ backgroundColor: appTheme.logoTextColor, borderColor: appTheme.secondaryColor }}
                     count={userdata && userdata.cartcount ? userdata.cartcount : 0}>
                     <ShoppingCartOutlined style={{ fontSize: '28px', color: '#fff' }} />
                  </Badge>
               </Link>
            </div>
            <div className={styles.mobileNavbarMain}>
               {/* <Search navProps={this.props.history} /> */}
            </div>

            <Drawer
               placement="left"
               closable={false}
               onClose={() => this.setState({ showSideMenu: false })}
               visible={showSideMenu}
            >
               <div>
                  <div className={styles.menuListBtnItem}>
                     {(userData && userData.emailId) ?
                        <div style={{ display: 'flex', flexDirection: 'row', }}>
                           <Avatar size="large" style={{ backgroundColor: appTheme.primaryColor }} >
                              {userData.emailId.charAt(0)}
                           </Avatar>
                           <h3 style={{ alignSelf: 'center', marginLeft: 10 }}>{userData.emailId}</h3>
                        </div> :
                        <Link className={styles.navbarBtnText} to="/login">
                           <OneButton
                              buttonLabel={"Login or Sign Up"}
                              btnSize="large"
                              buttonStyle={{
                                 fontSize: 16, backgroundColor: appTheme.logoTextColor,
                                 borderColor: appTheme.logoTextColor, width: 200, height: 40
                              }}
                           />
                        </Link>}
                  </div>
                  <Link className={styles.menuListItem}
                     to="/"
                  >
                     <h4 style={{ color: appTheme.lightColor }}>
                        Home
                        </h4>
                  </Link>
                  <div className={styles.mobilemenuHeader}>
                     <Link className={styles.mobileNavbarBrand}
                        to={'/brands'}
                     >Brands</Link>
                  </div>
                  <div className={styles.mobilemenuHeader}>
                     Categories
                  </div>
                  <div>
                     {categories.length !== 0 && categories.map((cat, index) =>
                        <Link className={styles.menuListItem} key={index}
                           to={{ pathname: '/products/category:' + cat.name, state: { catName: cat.name } }}
                           onClick={this.hideMenuPopOver.bind(this)}
                        >
                           <h4 style={{ color: appTheme.lightColor }}>
                              {cat.display_name}
                           </h4>
                        </Link>
                     )}
                  </div>

                  {menuItems.map((item, index) =>
                     <Link className={styles.menuListItem} key={index} to={item.screenToNavigate}
                        onClick={this.hideMenuPopOver.bind(this)}
                     >
                        <h4 style={{ color: appTheme.lightColor }}>
                           {item.navOptionName}
                        </h4>
                     </Link>
                  )}
                  {(userData && userData.accessToken) &&
                     <div className={styles.menuListItem}
                        onClick={this.logOut.bind(this)}
                     >
                        <h4 style={{ color: appTheme.lightColor }}>
                           Log Out
                        </h4>
                     </div>}
               </div>

            </Drawer>
         </Fragment>
      )
   }


}

function mapStateToProps(state) {
   return {
      userdata: state.userData,
      loginData: state.userLoginData,
      getCategories: state.getCategories
   }
}
function mapDispatchToProps(dispatch) {
   return {
      getcategories: (catobj) => { dispatch({ type: 'GET_CAT', categories: catobj }) },
      removeUserLoginData: () => {
         dispatch({ type: "REMOVE_LOGIN_DATA" });
      }
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(MobileNavbar);

