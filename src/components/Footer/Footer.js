import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import logo from '../../assets/oneauto.png';

import fb from '../../assets/fb.png';
import insta from '../../assets/insta.png';
import twitter from '../../assets/twitter.png';
import youtube from '../../assets/youtube.png';
import { appTheme } from '../../utils/Constants';
import './Footer.css'

class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {

        return (
            <Fragment>
                <div className="footer-main">
                    <div className="p-grid">
                        <div className="p-col-4 footer-col">
                            <img src={logo} height="42px" style={{ objectFit: 'contain', alignSelf: 'flex-start' }} />

                            <div className="p-mt-6">
                                <div className="footer-title">Contact Us</div>
                                <div className="footer-text p-mt-2">
                                    <i className="pi pi-phone p-mr-4" style={{ color: appTheme.logoTextColor }} /> 180-9992-3457
                                </div>
                                <div className="footer-text p-mt-2">
                                    <i className="pi pi-envelope p-mr-4" style={{ color: appTheme.logoTextColor }} /> sales@oneauto.us
                                </div>
                            </div>
                        </div>
                        <div className="p-col-2 footer-col">
                            <div className="footer-title">Information</div>
                            <Link className="footer-link">
                                About Us
                                </Link>
                            <Link className="footer-link">
                                Careers
                                </Link>
                            <Link className="footer-link">
                                Terms & Conditions
                                </Link>
                            <Link className="footer-link">
                                Privacy Policy
                                </Link>
                        </div>
                        <div className="p-col-2 footer-col">
                            <div className="footer-title">Helpful</div>
                            <Link className="footer-link">
                                Help Center
                            </Link>
                            <Link className="footer-link">
                                Returns
                            </Link>
                            <Link className="footer-link">
                                Contact Us
                            </Link>
                            <Link className="footer-link">
                                Shipping Information
                            </Link>
                        </div>
                        <div className="p-col-4 footer-col" style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                            <div className="footer-title p-ml-6" style={{ alignSelf: 'center' }}>
                                Subscribe For Email
                            </div>
                            <div className="p-formgroup-inline p-mt-4">
                                <div className="p-field">
                                    <InputText type="email" className="p-inputtext-sm p-mb-2" placeholder="Enter your Email" />
                                </div>
                                <Button type="button" label="Subscribe" className="p-button-sm"
                                    style={{
                                        backgroundColor: appTheme.logoTextColor,
                                        borderColor: appTheme.logoTextColor
                                    }} />
                            </div>
                        </div>

                    </div>
                    <div className="footer-bottom">
                        <img src={fb} height="38px" style={{ objectFit: 'contain',marginRight:18}} />
                        <img src={insta} height="38px" style={{ objectFit: 'contain',marginRight:18}} />
                        <img src={youtube} height="38px" style={{ objectFit: 'contain',marginRight:18}} />
                        <img src={twitter} height="38px" style={{ objectFit: 'contain',marginRight:18}} />
                    </div>
                </div>


            </Fragment>
        )
    }
}


export default Footer;