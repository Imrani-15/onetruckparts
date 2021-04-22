import React, { Fragment } from 'react';

import {
   Row, Col,
   Popover, Input,
   message, Select,
   Badge, Drawer,
   Button, Avatar
} from 'antd';
import { Link } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputText } from "primereact/inputtext";
import { Password } from 'primereact/password';
//import { Button } from 'primereact/button';

import { connect } from "react-redux";
import {
   DownOutlined, ShoppingCartOutlined,
   CarOutlined
} from '@ant-design/icons';
import Search from './Search';
import logo from '../../assets/logo.png'
import "./Navbar.css"
import Global from '../../utils/Global';
import serviceCall from '../../utils/Services';
import { PRODUCT_BASE_URL } from '../../utils/Constants';

import { appTheme, menuItems } from '../../utils/Constants';


class Navbar extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         search: '',
         navItems: [],
         email: '',
         password: '',
         showModel: false,
         showLoginDiv: true,
         categories: []
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

   userLogin = () => { }


   render() {
      const { search, showModel, showLoginDiv, email, password, categories, showAccountPopOver, userdata } = this.state
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
                        <Search navProps={this.props.navProps} />
                     </Col>
                     <Col span={4} style={{ paddingLeft: 40 }}>
                        {/* <Popover content={this.renderMenu()}
                  trigger="click"
                  placement="bottom"
                  visible={showAccountPopOver}
                  onVisibleChange={this.handleVisibleChange}
                  title="">
                  {(userdata.custid) ?
                    <h3 style={{ color: '#fff' }}>My Account <DownOutlined /></h3> :
                    <div>
                      <h3 style={{ color: '#fff' }}>My Account</h3>
                      <h5 style={{ color: '#fff', fontWeight: 400 }}>
                        Login/Sign Up  <DownOutlined />
                      </h5>
                    </div>
                  }
                </Popover> */}

                     </Col>
                  </Row>
               </Col>
               <Col span={3} style={{ display: 'flex', alignItems: 'center'}}>
                  <Link style={{ display: 'flex', alignItems: 'center', paddingLeft: 10,marginTop:4 }} to={'/cart'}>
                     <Badge style={{ backgroundColor: appTheme.primaryColor, borderColor: appTheme.secondaryColor }}
                        count={5}>
                        <ShoppingCartOutlined style={{ fontSize: '34px', color: '#fff' }} />
                     </Badge>
                     <h3 style={{ marginLeft: 20, color: '#fff',marginTop:4 }}>My Cart</h3>
                  </Link>
               </Col>
            </Row>
            <Row type="flex" className="navbar-main">
               <Col span={2} className="navbar-style">
            
               </Col>
               <Col span={2} className="navbar-style">
                  <Link className="navbar-btn-text"
                     to={'/brands'}
                   >SHOP BY BRAND</Link>
               </Col>
               <Col span={1} />
               <Col span={19} className="navbar-style">
               <div className="navbar-main-categories">
                     {categories !==0 && categories.map((cat,index)=>(
                           <>
                             {(index >0) && <div className="navbar-vl" /> }
                            <Link className="navbar-btn-text" key={index}
                              to={{ pathname: '/productslist/type:'+cat.display_name, state: { catName: cat.display_name } }}
                            >{cat.display_name}</Link>

                            </>
                     ))}
               </div>
               </Col>
               <Col span={24} style={{display:'flex',justifyContent:'center',top:30}}>
                  <h2 class="test-text">
                  <CarOutlined style={{marginRight:16,fontSize:24}}/>  Select Your Vechile
                  </h2>
               </Col>
              
            </Row>
         </Fragment>
      )
   }


}

function mapStateToProps(state) {
   return {
       orgDetails: state.orgDetails,
       getCategories:state.getCategories
   }
}
function mapDispatchToProps(dispatch) {
   return {
       getcategories: (catobj) => {dispatch({type:'GET_CAT',categories:catobj})}
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);

