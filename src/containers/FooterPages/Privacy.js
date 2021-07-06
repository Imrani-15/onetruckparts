import React, { Fragment } from 'react';

import aboutUs from '../../assets/aboutusimg.png';

class Privacy extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <img src={aboutUs} alt="aboutUs" style={{ width: '100%', height: 400, objectFit: 'cover' }} />
                <div style={{ padding: 10, margin: '4%' }}>
                    <h1 style={{fontWeight: 'bold', marginBottom: 22 }}>
                        Privacy Policy
                    </h1>
                    <h3>
                        This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from oneauto.us (the “Site”).
                    </h3>
                    <h2>
                        PERSONAL INFORMATION WE COLLECT
                    </h2>
                    <h3>
                        When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.
                        Additionally, as you browse the Site, we collect information about the individual web pages or products that you view, what websites or search terms referred you to the Site, and information about how you interact with the Site.
                        We refer to this automatically-collected information as “Device Information.”
                    </h3>
                    <h3>
                        We collect Device Information using the following technologies:
                    </h3>
                    <h3>
                        - “Cookies” are data files that are placed on your device or computer and often include an anonymous unique identifier. For more information about cookies, and how to disable cookies, visit http://www.allaboutcookies.org.
                    </h3>
                    <h3>
                        - “Log files” track actions occurring on the Site, and collect data including your IP address, browser type, Internet service provider, referring/exit pages, and date/time stamps.
                    </h3>
                    <h3>
                        - “Web beacons,” “tags,” and “pixels” are electronic files used to record information about how you browse the Site.
                        Additionally when you make a purchase or attempt to make a purchase through the Site, we collect certain information from you, including your name, billing address, shipping address, payment information (including credit card numbers [[INSERT ANY OTHER PAYMENT TYPES ACCEPTED]]), email address, and phone number.
                        We refer to this information as “Order Information.”
                    </h3>
                    <h3>
                        When we talk about “Personal Information” in this Privacy Policy, we are talking both about Device Information and Order Information.
                    </h3>
                    <h2>
                        HOW DO WE USE YOUR PERSONAL INFORMATION?
                    </h2>
                    <h3>
                        We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations).
                        Additionally, we use this Order Information to: <br />
                        Communicate with you;Screen our orders for potential risk or fraud; and
                        When in line with the preferences you have shared with us, provide you with information or advertising relating to our products or services. <br />
                        [[INSERT OTHER USES OF ORDER INFORMATION]] <br />
                        We use the Device Information that we collect to help us screen for potential risk and fraud (in particular, your IP address), and more generally to improve and optimize our Site (for example, by generating analytics about how our customers browse and interact with the Site, and to assess the success of our marketing and advertising campaigns).
                        [[INSERT OTHER USES OF DEVICE INFORMATION, INCLUDING:  ADVERTISING/RETARGETING]]SHARING YOUR PERSONAL INFORMATION
                    </h3>
                    <h3>
                        We share your Personal Information with third parties to help us use your Personal Information, as described above.  For example, we use Google Analytics to help us understand how our customers use the Site--you can read more about how Google uses your Personal Information here:<a href="https://www.google.com/intl/en/policies/privacy/"> https://www.google.com/intl/en/policies/privacy/. </a>
                        You can also opt-out of Google Analytics here: <a href="https://tools.google.com/dlpage/gaoptout">https://tools.google.com/dlpage/gaoptout.</a>
                    </h3>
                    <h3>
                        Finally, we may also share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena,
                        search warrant or other lawful request for information we receive, or to otherwise protect our rights.
                    </h3>
                    <h2>
                        BEHAVIOURAL ADVERTISING
                    </h2>
                    <h3>
                        As described above, we use your Personal Information to provide you with targeted advertisements or marketing communications we believe may be of interest to you.  For more information about how targeted advertising works, you can visit the Network Advertising Initiative’s (“NAI”) educational page at
                        <a href="http://www.networkadvertising.org/understanding-online-advertising/how-does-it-work"> http://www.networkadvertising.org/understanding-online-advertising/how-does-it-work.</a>
                    </h3>
                    <h3>
                        FACEBOOK - <a href="https://www.facebook.com/settings/?tab=ads">https://www.facebook.com/settings/?tab=ads</a>
                    </h3>
                    <h3>
                        GOOGLE - <a href="https://www.google.com/settings/ads/anonymous">https://www.google.com/settings/ads/anonymous</a>
                    </h3>
                    <h3>
                        BING - <a href="https://advertise.bingads.microsoft.com/en-us/resources/policies/personalized-ads">https://advertise.bingads.microsoft.com/en-us/resources/policies/personalized-ads</a>
                    </h3>
                    <h2>
                        DO NOT TRACK
                    </h2>
                    <h3>
                        Please note that we do not alter our Site’s data collection and use practices when we see a Do Not Track signal from your browser.
                    </h3>
                    <h2>
                        YOUR RIGHTS
                    </h2>
                    <h3>
                        If you are a European resident, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us through the contact information below.Additionally,
                        if you are a European resident we note that we are processing your information in order to fulfill contracts we might have with you (for example if you make an order through the Site), or otherwise to pursue our legitimate business interests listed above.  Additionally, please note that your information will be transferred outside of Europe, including to Canada and the United States.
                    </h3>
                    <h3>
                        DATA RETENTION<br />
                        When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information.
                    </h3>
                    <h3>
                        The Site is not intended for individuals under the age of 13 years.
                    </h3>
                    <h3>
                        CHANGES<br />
                        We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal or regulatory reasons.
                    </h3>
                    <h3>
                        CONTACT US<br />
                        For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at <a href="mailto:sudhapsk@yahoo.com"> sudhapsk@yahoo.com </a> or by mail using the details provided below:
                    </h3>
                    <h3>
                        7208 W. Sand Lake Road, Suite 305, Orlando, FL, 32819, United States
                    </h3>

                </div>

            </Fragment>
        )
    }


}

export default Privacy;