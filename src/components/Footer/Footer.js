import React, { Fragment } from 'react';
import { Link } from 'next/router';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import logo from '../../assets/oneauto.png';

import fb from '../../assets/fb.png';
import insta from '../../assets/insta.png';
import twitter from '../../assets/twitter.png';
import youtube from '../../assets/youtube.png';
import { appTheme } from '../../utils/Constants';
import {styles} from  '../../styles/Footer.css';

class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            matches: window.matchMedia("(min-width: 768px)").matches
        }
    }

    componentDidMount(){
        const handler = e => this.setState({matches: e.matches});
        window.matchMedia("(min-width: 768px)").addListener(handler);
    }

    render() {

        return (
            <Fragment>
                {this.state.matches &&
                <div className={styles.footerMain}>
                    <div className="p-grid">
                        <div className="p-col-4"className={styles.footerCol}>
                            <img src={logo} height="42px" style={{ objectFit: 'contain', alignSelf: 'flex-start' }} />

                            <div className="p-mt-6">
                                <div className={styles.footerTitle}>Contact Us</div>
                                <div className={styles.footerText} className="p-mt-2">
                                    <i className="pi pi-phone p-mr-4" style={{ color: appTheme.logoTextColor }} />  (888) 520-2490
                                </div>
                                <div className={styles.footerText} className="p-mt-2">
                                    <i className="pi pi-envelope p-mr-4" style={{ color: appTheme.logoTextColor }} /> sales@oneauto.us
                                </div>
                            </div>
                        </div>
                        <div className="p-col-2" className={styles.footerCol}>
                            <div className={styles.footerTitle}>Information</div>
                            <Link className={styles.footerLink} to={"/about-us"}>
                                About Us
                                </Link>
                            <Link className={styles.footerLink}>
                                Careers
                                </Link>
                            <Link className={styles.footerLink} to={"/terms_condition"}>
                                Terms & Conditions
                                </Link>
                            <Link className={styles.footerLink} to={"/privacy_policy"}>
                                Privacy Policy
                                </Link>
                        </div>
                        <div className="p-col-2" className={styles.footerCol}>
                            <div className={styles.footerTitle}>Helpful</div>
                            <Link className={styles.footerLink}>
                                Help Center
                            </Link>
                            <Link className={styles.footerLink}>
                                Returns
                            </Link>
                            <Link className={styles.footerLink}>
                                Contact Us
                            </Link>
                            <Link className={styles.footerLink}>
                                Shipping Information
                            </Link>
                        </div>
                        <div className="p-col-4" className={styles.footerCol} style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                            <div className="{styles.footerTitle} p-ml-6" style={{ alignSelf: 'center' }}>
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
                    <div className={styles.footerBottom}>
                        <img src={fb} height="38px" style={{ objectFit: 'contain',marginRight:18}} />
                        <img src={insta} height="38px" style={{ objectFit: 'contain',marginRight:18}} />
                        <img src={youtube} height="38px" style={{ objectFit: 'contain',marginRight:18}} />
                        <img src={twitter} height="38px" style={{ objectFit: 'contain',marginRight:18}} />
                    </div>
                </div>
                }

            </Fragment>
        )
    }
}


export default Footer;