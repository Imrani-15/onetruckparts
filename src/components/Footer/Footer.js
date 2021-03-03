import React ,{Fragment} from 'react';
import logo from '../../assets/logo.png';
import './Footer.css'

class Footer extends React.Component {
    constructor(props){
        super(props);
        this.state={
          
        }
    }

    render(){
    
        return(
            <Fragment>
                <div className="footer-main">
                    <div className="footer-menu">
                        <div>
                            <p style={{fontSize:16,fontStyle:'italic'}}>CUSTOMER SERVICE</p>
                            <p style={{color:'#FF891E',fontSize:24}}>1.999.632.5032</p>
                            <p style={{fontSize:16}}>SUBSCRIBE FOR EMAIL</p>
                        </div>
                        <div className="footer-menu-left-border">
                            <div style={{fontSize:16}}>ABOUT</div>
                            <p style={{fontSize:14}}>About Us</p>
                            <p style={{fontSize:14}}>Careers</p>
                            <p style={{fontSize:14}}>Terms of Use</p>
                            <p style={{fontSize:14}}>Privacy Notice</p>
                        </div>
                        <div className="footer-menu-left-border">
                            <div style={{fontSize:16}}>HELP</div>
                            <p style={{fontSize:14}}>Help Center</p>
                            <p style={{fontSize:14}}>Returns</p>
                            <p style={{fontSize:14}}>Contact Us</p>
                            <p style={{fontSize:14}}>Shipping Information</p>
                        </div>
                        <div className="footer-menu-left-border">
                            <h1>1-TRUCK</h1>
                            
                        </div>
                    </div>
                    <div style={{display:'grid',justifyContent:'center',padding:22}}>
                        <img src={logo} height="50px" style={{alignSelf:'center'}}/>
                        <p style={{fontSize:12,color:'#949494'}}>© 2018-2019, trucks-1.com, Inc. or its affiliates</p>
                    </div>
                  
                </div>
                
            </Fragment>
        )
    }
}


export default Footer;