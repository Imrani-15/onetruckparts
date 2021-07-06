import React, { Fragment } from 'react';

import {
   Row, Col,
   Popover, Button,
   Select, Divider,
   Badge, Avatar
} from 'antd';
import { Link } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { OverlayPanel } from 'primereact/overlaypanel';
import { connect } from "react-redux";
import {
   DownOutlined, ShoppingCartOutlined,
   CarOutlined, UserOutlined, DeleteOutlined
} from '@ant-design/icons';

import Search from './Search';
import OneButton from '../OneButton';
import logo from '../../assets/oneauto.png';
import noFitment from '../../assets/nofitment.png';

import { isNotEmpty } from '../../utils/Utils';
import serviceCall from '../../utils/Services';
import { appTheme, menuItems, PRODUCT_BASE_URL } from '../../utils/Constants';
import userProfile from '../../utils/UserProfile';
import { removeFitmentFromGarage } from '../../utils/commonService';
import FirebaseAuth from '../../containers/Auth/FirebaseAuth';

import "./Navbar.css";

const { Option } = Select;
class DesktopNavbar extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
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
      this.setState({ userData: userData }, () => {
         this.setFitmentData();
      });
   }

   setFitmentData() {
      // if(this.state.userData && this.state.userData.accessToken){
      //     this.getFitmentList();
      // }else{
      let guestGarage = userProfile.getGarage();
      this.setState({ fitmentList: guestGarage && guestGarage.length !== 0 ? guestGarage : [] })
      //}
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
         userProfile.setCart([]);
         userProfile.setcartDetails({});
         this.setState({ showAccountPopOver: false, userData: {} })
         window.location.reload(false);
      })
   }



   toggleFitmentPopover = (e) => {
      this.overLayRef.current.toggle(e)
   }

   createNewFitment = () => {
      this.getFitmentYear();
      this.setState({ createNewFitment: true }, () => {
         this.overLayRef.current.hide()
      })
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
         let restUrl = `${PRODUCT_BASE_URL}fitment/garage/add/${selectedYear}/${selectedMake}/${selectedModel}`;
         let userGarage = userProfile.getGarage()
         serviceCall({
            garage: userGarage
         }, restUrl, 'POST')
            .then((res) => {
               if (!res.data.error) {
                  this.setState({
                     fitmentList: res.data.garage, createNewFitment: false,
                     selectedYear: null, selectedMake: null, selectedModel: null,
                     fitmentMake: [], fitmentModel: []
                  })
                  userProfile.setGarage(res.data.garage)
               } else {

               }
            })
            .catch((error) => {
            })
      }

   }

   deleteVechile = (index) => {
      removeFitmentFromGarage(index).then((resp) => {
         if (!resp.data.error) {
            this.setState({ fitmentList: resp.data.garage })
         }
      })
   }



   renderMenu = () => {
      const { userData } = this.state;
      return (
         <div>
            <div className="menu-list-btn-item">
               {(userData && userData.emailId) ?
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                     <Avatar size="large" style={{ backgroundColor: appTheme.primaryColor }} >
                        {userData.emailId.charAt(0)}
                     </Avatar>
                     <h3 style={{ alignSelf: 'center', marginLeft: 10 }}>{userData.emailId}</h3>
                  </div> :
                  <Link className="navbar-btn-text" to="/login">
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
               <Link className='menu-list-item' key={index} to={item.screenToNavigate}
                  onClick={this.hideMenuPopOver.bind(this)}
               >
                  <h4 style={{ color: appTheme.lightColor }}>
                     {item.navOptionName}
                  </h4>
               </Link>
            )}
            {(userData && userData.accessToken) &&
               <div className='menu-list-item'
                  onClick={this.logOut.bind(this)}
               >
                  <h4 style={{ color: appTheme.lightColor }}>
                     Log Out
                  </h4>
               </div>}
         </div>
      )
   }




   render() {
      const { categories, createNewFitment, showAccountPopOver, fitmentList, userData,
         fitmentYear, fitmentMake, fitmentModel, selectedYear, selectedMake } = this.state
      let { userdata } = this.props;

      return (
         <Fragment>
            <Row type="flex" className="navbar-main">
               <Col md={4} lg={3} className="navbar-style">
                  <Link to={'/'} >
                     <img src={logo} alt={'logo'} className="desktop-navbar-icon" />
                  </Link>
               </Col>
               <Col md={17} lg={18} className="navbar-style">
                  <Row type="flex" style={{ alignItems: 'center' }}>
                     <Col md={0} lg={3}></Col>
                     <Col md={18} lg={15}>
                        <Search
                           navProps={this.props.history}
                           fitmentList={fitmentList}
                           addNewFitment={this.createNewFitment.bind(this)}
                           deleteVechile={this.deleteVechile.bind(this)}
                        />
                     </Col>
                     <Col md={1} lg={1}></Col>
                     <Col md={5} lg={4} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <UserOutlined className="desktop-navbar-usericon" />
                        <Popover content={this.renderMenu()}
                           trigger="click"
                           placement="bottom"
                           visible={showAccountPopOver}
                           onVisibleChange={this.handleVisibleChange}
                           title="">
                           {(userData && userData.accessToken) ?
                              <div className="desktop-navbar-text">My Account <DownOutlined /></div> :
                              <div style={{ color: '#fff', marginBottom: 0 }}>
                                 <div className="desktop-navbar-text">My Account</div>
                                 <div className="desktop-navbar-subtext">
                                    Login/Sign Up  <DownOutlined />
                                 </div>
                              </div>
                           }
                        </Popover>
                     </Col>
                  </Row>
               </Col>
               <Col md={3} lg={3} style={{ display: 'flex', alignItems: 'center' }}>
                  <Link style={{ display: 'flex', alignItems: 'center', paddingLeft: 10, marginTop: 4 }} to={'/cart'}>
                     <Badge style={{ backgroundColor: appTheme.logoTextColor, borderColor: appTheme.secondaryColor }}
                        count={userdata && userdata.cartcount ? userdata.cartcount : 0}>
                        <ShoppingCartOutlined className="desktop-navbar-carticon" />
                     </Badge>
                     <div className="desktop-navbar-carttext">My Cart</div>
                  </Link>
               </Col>

               <Col md={3} lg={4} className="navbar-style">
                  <Link className="navbar-brand"
                     to={'/brands'}
                  >BRANDS</Link>
               </Col>
               <Col md={0} lg={2} />
               <Col md={15} lg={13} className="navbar-style">
                  <div className="navbar-main-categories">
                     {categories.length !== 0 && categories.map((cat, index) => (
                        <>
                           {(index > 0) && <div className="navbar-vl" />}
                           {(index < 6) &&
                              <Link className="navbar-btn-text" key={index}
                                 to={{ pathname: '/products/category:' + cat.name, state: { catName: cat.name } }}
                              >{cat.display_name}</Link>
                           }
                        </>
                     ))}
                  </div>
               </Col>
               <Col md={6} lg={5} className="navbar-style">
                  <div className="selectVechile" onClick={(e) => this.toggleFitmentPopover(e)}>
                     <CarOutlined className="desktop-navbar-caricon" />  Select Your Vehicle
                  </div>
               </Col>
            </Row>

            {/* Fitment List */}
            <OverlayPanel ref={this.overLayRef}
               showCloseIcon={false} id="overlay_panel" style={{ width: 440 }}>
               <div>
                  {fitmentList.length === 0 ?
                     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        <img src={noFitment} alt={'noFitment'}
                           style={{ alignSelf: 'center', justifySelf: 'center', marginLeft: 6 }} height="120px" />
                        <h3 style={{ color: appTheme.logoTextColor }}>No Fitmet Data</h3>
                     </div> :
                     <div>
                        <div style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>Your Vehicle</div>
                        {fitmentList.map((fit, index) => (
                           <div className="p-shadow-2 fitment-list p-mb-2" >
                              <h4 style={{ fontWeight: 'bold', marginBottom: 0 , color:appTheme.primaryColor}}>( {fit.year} )  {' '}  {fit.makename} |{' '} {fit.modelname}</h4>
                              <Button type="text" danger icon={<DeleteOutlined />} onClick={() => this.deleteVechile(index)}/>
                           </div>
                        ))}
                     </div>
                  }
                  <Divider />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 22 }}>
                     <OneButton
                        onClick={() => this.createNewFitment()}
                        buttonLabel={"Add New Vehicle"}
                        btnSize="large"
                        btnBlock={false}
                        buttonStyle={{ fontSize: 16 }}
                     />
                  </div>
               </div>
            </OverlayPanel>

            {/* Create New Fitment */}
            <Dialog visible={createNewFitment} closable={false} header={null} style={{ width: '80%' }} modal className="fitment-dialog" >
               <div style={{ position: 'absolute', top: -40, right: 10, cursor: "pointer" }}
                  onClick={() => this.setState({ createNewFitment: false })}>
                  <i className="pi pi-times" style={{ fontSize: 22, fontWeight: 'bold', color: '#fff', padding: 4 }}></i>
               </div>
               <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div style={{ backgroundColor: appTheme.secondaryColor, width: '100%', borderRadius: 40, padding: 12, }}>
                     <Row justify="center" align="middle">
                        <Col sm={12} md={12} lg={6} align="middle">
                           <Select style={{ width: '80%' }}
                              placeholder="Select Year"
                              size={'large'}
                              onChange={(value) => this.selectedYear(value)}>
                              {fitmentYear.map((year) => (
                                 <Option value={year}>{year}</Option>
                              ))}
                           </Select>
                        </Col>
                        <Col sm={12} md={12} lg={6} align="middle">
                           <Select style={{ width: '80%' }}
                              size={'large'}
                              disabled={!isNotEmpty(selectedYear)}
                              placeholder="Select Brand"
                              onChange={(value) => this.selectedMake(value)}>
                              {fitmentMake.map((make) => (
                                 <Option value={make}>{make}</Option>
                              ))}
                           </Select>
                        </Col>
                        <Col sm={12} md={12} lg={6} align="middle">
                           <Select style={{ width: '80%' }}
                              size={'large'}
                              disabled={!isNotEmpty(selectedMake)}
                              placeholder="Select Modal"
                              onChange={(value) => this.setState({ selectedModel: value })}>
                              {fitmentModel.map((model) => (
                                 <Option value={model}>{model}</Option>
                              ))}
                           </Select>
                        </Col>
                        <Col sm={12} md={12} lg={6} align="middle">
                           <OneButton
                              onClick={this.addVehicle}
                              buttonLabel={"Add Vehicle"}
                              btnSize="large"
                              btnShape="round"
                              btnDisabled={false}
                              buttonStyle={{
                                 fontSize: 16, width: 200, height: 44,
                                 backgroundColor: appTheme.logoTextColor,
                                 borderColor: appTheme.logoTextColor

                              }}
                           />
                        </Col>
                     </Row>
                  </div>
               </div>
            </Dialog>
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

export default connect(mapStateToProps, mapDispatchToProps)(DesktopNavbar);

