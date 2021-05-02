import React, { Fragment } from 'react';

import {
   Row, Col,
   Popover, Empty ,
   message, Select, Divider,
   Badge, Avatar
} from 'antd';
import { Link } from 'react-router-dom';
import { OverlayPanel } from 'primereact/overlaypanel';

import { Button } from 'primereact/button';

import { connect } from "react-redux";
import {
   DownOutlined, ShoppingCartOutlined,
   CarOutlined, UserOutlined
} from '@ant-design/icons';
import Search from './Search';
import OneButton from '../OneButton';
import logo from '../../assets/logo.png'
import "./Navbar.css"
import {isNotEmpty} from '../../utils/Utils';
import serviceCall from '../../utils/Services';
import { appTheme, menuItems , PRODUCT_BASE_URL} from '../../utils/Constants';
import userProfile from '../../utils/UserProfile';


const { Option } = Select;
class Navbar extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         showAccountPopOver:false,
         createNewFitment:false,
         categories: [],
         fitmentList:[],
         fitmentYear:[],
         fitmentMake:[],
         fitmentModel:[],
         selectedYear:null,
         selectedMake:null,
         selectedModel:null

      }

      this.overLayRef = React.createRef();
   }


   componentDidMount() {
      this.getCategories();
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

    logOut=()=>{
       this.setState({showAccountPopOver:false},()=>{
         userProfile.setUserObj({});
         this.props.removeUserLoginData();
       })
      
    }


    renderMenu = () => {

      const { loginData } = this.props;
      return (
        <div>
          <div className="menu-list-btn-item">
            {(loginData.accessToken) ?
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Avatar size="large" style={{ backgroundColor: appTheme.primaryColor }} >
                  {loginData.emailId.charAt(0)}
                </Avatar>
                <h3 style={{ alignSelf: 'center' }}>{loginData.emailId}</h3>
              </div> :
              <Link className="navbar-btn-text" to="/login">
                <OneButton 
                     buttonLabel={"Login or Sign Up"}
                     btnSize="large"
                     buttonStyle={{fontSize:16, backgroundColor: appTheme.logoTextColor,
                        borderColor: appTheme.logoTextColor, width: 200, height: 40
                     
                     }}
                     />
              </Link>}
          </div>
          {menuItems.map((item, index) =>
            <Link className='menu-list-item' key={index} to={item.screenToNavigate}
              >
              <h4 style={{ color: appTheme.lightColor }}>
                {item.navOptionName}
              </h4>
            </Link>
          )}
          <div className='menu-list-item' 
          //onClick={this.updateContactModal.bind(this)}
          >
            <h4 style={{ color: appTheme.lightColor }}>
              Contact Us
                </h4>
          </div>
          {isNotEmpty(loginData.accessToken) &&
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

    openFitmentPopOver=(e)=>{
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

   selectedYear(value){
      this.setState({selectedYear:value},()=>{
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

   selectedMake(value){
      this.setState({selectedMake:value},()=>{
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

   addVechile = () => {
      const {selectedYear, selectedMake, selectedModel} = this.state;
      let restUrl = `${PRODUCT_BASE_URL}fitment/garage/add/${selectedYear}/${selectedMake}/${selectedModel}`
      serviceCall({}, restUrl, 'GET')
         .then((res) => {
            if (!res.error) {
               this.setState({ fitmentList: res.data.garage , createNewFitment:false})
            } else {

            }
         })
         .catch((error) => {
         })
   }

   deleteVechile = (index) => {
      let restUrl = `${PRODUCT_BASE_URL}fitment/garage/delete/${index}`
      serviceCall({}, restUrl, 'GET')
         .then((res) => {
            if (!res.error) {
               this.setState({ fitmentList: res.data.garage , createNewFitment:false})
            } else {

            }
         })
         .catch((error) => {
         })
   }
  

   


   render() {
      const { categories, createNewFitment, showAccountPopOver, fitmentList, fitmentYear, fitmentMake, fitmentModel, selectedYear, selectedMake } = this.state
      let { userdata, loginData } = this.props;

      return (
         <Fragment>
            <Row type="flex" className="navbar-main">
               <Col span={2} className="navbar-style">
                  <Link to={'/'} style={{ display: 'grid' }}>
                     <img src={logo} style={{ alignSelf: 'center', justifySelf: 'center' }} height="40px" width="90px" />
                  </Link>
               </Col>
               <Col span={19} className="navbar-style">
                  <Row type="flex" style={{ alignItems: 'center' }}>
                     <Col span={4} style={{ marginLeft: 20 }}>
                        {/* <Locations /> */}
                     </Col>
                     <Col span={15}>
                        <Search navProps={this.props.history} />
                     </Col>
                     <Col span={4} style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center' }}>
                     <UserOutlined style={{ fontSize: '28px', color: '#fff',marginRight:14 }}/>
                        <Popover content={this.renderMenu()}
                           trigger="click"
                           placement="bottom"
                           visible={showAccountPopOver}
                           onVisibleChange={this.handleVisibleChange}
                           title="">
                           {(loginData.accessToken) ?
                           <h3 style={{ color: '#fff',marginBottom:0 }}>My Account <DownOutlined /></h3> :
                           <div style={{ color: '#fff',marginBottom:0 }}>
                              <h3 style={{ color: '#fff',marginBottom:0  }}>My Account</h3>
                              <h5 style={{ color: '#fff', fontWeight: 400 , marginBottom:0 }}>
                                 Login/Sign Up  <DownOutlined />
                              </h5>
                           </div>
                           }
                        </Popover>

                     </Col>
                  </Row>
               </Col>
               <Col span={3} style={{ display: 'flex', alignItems: 'center'}}>
                  <Link style={{ display: 'flex', alignItems: 'center', paddingLeft: 10,marginTop:4 }} to={'/cart'}>
                     <Badge style={{ backgroundColor: appTheme.logoTextColor, borderColor: appTheme.secondaryColor }}
                        count={userdata && userdata.cartcount ? userdata.cartcount : 0}>
                        <ShoppingCartOutlined style={{ fontSize: '34px', color: '#fff' }} />
                     </Badge>
                     <h3 style={{ marginLeft: 20, color: '#fff',marginTop:4 }}>My Cart</h3>
                  </Link>
               </Col>
            </Row>
            <Row type="flex" className="navbar-main">
               <Col span={1.5} className="navbar-style">
            
               </Col>
               <Col span={2} className="navbar-style">
                  <Link className="navbar-brand"
                     to={'/brands'}
                   >BRANDS</Link>
               </Col>
               <Col span={1} />
               <Col span={15} className="navbar-style">
               <div className="navbar-main-categories">
                     {categories !==0 && categories.map((cat,index)=>(
                           <>
                             {(index >0) && <div className="navbar-vl" /> }
                            <Link className="navbar-btn-text" key={index}
                              to={{ pathname: '/products/category:'+cat.display_name, state: { catName: cat.display_name } }}
                            >{cat.display_name}</Link>

                            </>
                     ))}
               </div>
               </Col>
               <Col span={3.5} className="navbar-style">
                  <div className="selectVechile" onClick={(e)=>this.openFitmentPopOver(e)}>
                      <CarOutlined style={{marginRight:14,fontSize:24}}/>  Select Your Vechile
                  </div>
               </Col>
               <Col span={1} />
            
            </Row>
            {/* <Col span={24} style={{display:'flex',justifyContent:'center'}}>
                  <h2 class="test-text" onClick={(e)=>this.openFitmentPopOver(e)}>
                  <CarOutlined style={{marginRight:16,fontSize:24,color:appTheme.logoTextColor}}/>  Select Your Vechile
                  </h2>
            </Col> */}
            <OverlayPanel ref={this.overLayRef}
             showCloseIcon={false} id="overlay_panel" style={{width: 440}}>
                      {createNewFitment ?
                      <div>
                        <div style={{display:'flex', flexDirection:'row',justifyContent:'space-between'}}>
                           <Select  style={{ width: 180}} 
                              placeholder="Select Year"
                              size={'large'}
                              onChange={(value)=> this.selectedYear(value)}>
                                 {fitmentYear.map((year)=>(
                                          <Option value={year}>{year}</Option>
                                 ))}
                              </Select>
                              <Select  style={{ width: 180}} 
                              size={'large'}
                              disabled={!isNotEmpty(selectedYear)}
                              placeholder="Select Brand"
                              onChange={(value)=> this.selectedMake(value)}>
                                 {fitmentMake.map((make)=>(
                                          <Option value={make}>{make}</Option>
                                 ))}
                              </Select>
                        </div>
                        <div style={{display:'flex', flexDirection:'row',justifyContent:'space-between',marginTop:22}}>
                           <Select  style={{ width: 440}} 
                              size={'large'}
                              disabled={!isNotEmpty(selectedMake)}
                              placeholder="Select Modal"
                              onChange={(value)=> this.setState({selectedModel:value})}>
                                 {fitmentModel.map((model)=>(
                                          <Option value={model}>{model}</Option>
                                 ))}
                              </Select>
                        </div>
                        <Divider />
                        <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-end',marginTop:22}}>
                        <OneButton 
                              onClick={()=> this.setState({createNewFitment:false})}  
                              buttonLabel={"Back to List"}
                              btnSize="large"
                              btnBlock={false}
                              btnType="link"
                              buttonStyle={{fontSize:16, marginRight:6, backgroundColor:'#fff', borderColor:'#fff', color:appTheme.logoTextColor}}
                           /> 
                           <OneButton 
                              onClick={this.addVechile} 
                              buttonLabel={"Add Vechile"}
                              btnSize="large"
                              btnBlock={false}
                              buttonStyle={{fontSize:16}}
                           /> 
                        </div>
                        
                      </div> :
                      <div>
                        {fitmentList.length ===0 ?
                           <Empty /> :
                           <div>
                              <div style={{fontSize:18,fontWeight:'600', marginBottom:8}}>Select Your Vechile</div>
                              {fitmentList.map((fit,index)=>(
                                 <div className="p-shadow-2 fitment-list p-mb-2" onClick={()=>this.deleteVechile(index)}>
                                    <div className="fitment-list">
                                       <Button icon="pi pi-circle-off" className="p-button-danger p-button-text" />
                                       <div>
                                          <div style={{fontSize:16,fontWeight:'600',marginBottom:0}}>{fit.makename}</div>
                                          <div style={{fontSize:14,fontWeight:'500', color:appTheme.dark5}}>{fit.modelname}, {fit.mfrlabel}</div>
                                       </div>
                                    </div>
                                    <div>
                                       <Button icon="pi pi-trash" className="p-button-danger p-button-text" />
                                    </div>
                                 </div>
                              ))}
                           </div>
                        }
                           <Divider />
                          <div style={{display:'flex', justifyContent:'flex-end',marginTop:22}}>
                           <OneButton 
                              onClick={()=> this.setState({createNewFitment:true})} 
                              buttonLabel={"Add New Vechile"}
                              btnSize="large"
                              btnBlock={false}
                              buttonStyle={{fontSize:16}}
                           /> 
                        </div>
                      </div>}
            </OverlayPanel>
              
         </Fragment>
      )
   }


}

function mapStateToProps(state) {
   return {
         userdata: state.userData,
         loginData: state.userLoginData,
         getCategories:state.getCategories
   }
}
function mapDispatchToProps(dispatch) {
   return {
       getcategories: (catobj) => {dispatch({type:'GET_CAT',categories:catobj})},
       removeUserLoginData: () =>{
         dispatch({ type: "REMOVE_LOGIN_DATA"});
       }
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);

