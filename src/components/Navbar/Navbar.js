import React from 'react';

import { Link } from 'react-router-dom';
import { MegaMenu } from 'primereact/megamenu';
import { Dialog } from 'primereact/dialog';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputText } from "primereact/inputtext";
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import logo from '../../assets/logo.png'
import "./Navbar.css"

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
      }

      this.overLayRef = React.createRef();
   }

   userLogin = () => { }


   render() {

      const { search, showModel, showLoginDiv, email, password } = this.state

      return (
         <div>
            <div className="navbar-main" >
               <Link to={'/'} >
                  <img src={logo} height="40px" />
               </Link>

               <span className="p-input-icon-right">
                  <i className="pi pi-search" />
                  <InputText value={search}
                     className="p-search-input" placeholder="Search" />
               </span>
               <span>
                  <i className="pi pi-map-marker" style={{ 'fontSize': '22px', color: '#fff' }}></i>
               </span>
            </div>
            <div className="navbar-main">
               <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '4%', }}>
                  <div className="navbar-btn-text" style={{fontWeight:'500',fontSize:18,marginRight:30}}>Select Your Vechile +</div>
                  <div className="navbar-btn-text" style={{fontWeight:'500',fontSize:18}}>CATEGORIES</div>
                  <div className="navbar-vl" />
                  <div className="navbar-btn-text">BRANDS</div>
                  <div className="navbar-vl" />
                  <div className="navbar-btn-text">GIFT CARDS</div>
                  <div className="navbar-vl" />
                  <div className="navbar-btn-text">HELP</div>
               </div>
               <div style={{ display: 'flex', flexDirection: 'row', marginRight: '1%' }}>
                  <div className="navbar-btn-text" onClick={() => this.setState({ showModel: true })}>HELLO</div>
                  <div className="navbar-vl" />
                  <div className="navbar-btn-text">ORDERS</div>
                  <div className="navbar-vl" />
                  <Link className="navbar-btn-text"
                     to={'/cart'}
                  ><i className="pi pi-shopping-cart" style={{ marginRight: 6 }} />
                        CART</Link>
               </div>

            </div>
            <OverlayPanel ref={el => (this.overLayRef = el)}>
               <div>Login / Register</div>
               <div></div>
            </OverlayPanel>
            <Dialog header="Login / Register" visible={showModel} style={{ width: '25vw' }} onHide={() => this.setState({ showModel: false,showLoginDiv:true })} >
               {(showLoginDiv) ?
                  <div>
                     <div className="p-field">
                        <label htmlFor="email" className="p-d-block">Email</label>
                        <InputText id="email" aria-describedby="email-help" className="p-inputtext-sm" style={{ width: '22vw' }} />
                        <small id="email-help" className="p-d-block">Enter your email.</small>
                     </div>
                     <div className="p-field">
                        <label htmlFor="password" className="p-d-block">Password</label>
                        <Password id="password" value={password} className="p-password-sm" onChange={(e) => this.setState({ password: e.target.value })} style={{ width: '22vw' }} />
                     </div>
                     <Button label="Login" className="p-button-info p-mt-1" onClick={this.userLogin} style={{ width: '22vw' }} />
                     <Button label="No account? Please Register" className="p-button-text p-mt-2" onClick={() => this.setState({ showLoginDiv: false })} style={{ width: '22vw' }} />
                  </div> :
                  <div>
                     <div className="p-field">
                        <label htmlFor="username" className="p-d-block">User name</label>
                        <InputText id="username" aria-describedby="username-help" className="p-inputtext-sm" style={{ width: '22vw' }} />
                     </div>
                     <div className="p-field">
                        <label htmlFor="register-email" className="p-d-block">Email</label>
                        <InputText id="register-email" aria-describedby="register-email-help" className="p-inputtext-sm" style={{ width: '22vw' }} />
                     </div>
                     <div className="p-field">
                        <label htmlFor="password" className="p-d-block">Password</label>
                        <Password id="password" value={password} className="p-password-sm" onChange={(e) => this.setState({ password: e.target.value })} style={{ width: '22vw' }} />
                     </div>
                     <Button label="Register" className="p-button-info p-mt-1" onClick={this.userLogin} style={{ width: '22vw' }} />
                  </div>}

            </Dialog>
         </div>


      )
   }

}

export default Navbar;
