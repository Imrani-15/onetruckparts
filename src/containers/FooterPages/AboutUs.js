import React, { Fragment } from 'react';

import aboutUs from '../../assets/aboutusimg.png';

class AboutUs extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <img src={aboutUs} alt="aboutUs" style={{width:'100%',height:400,objectFit:'cover'}} />
                <div style={{ padding: 10, margin: '4%' }}>
                    <h1 style={{fontWeight: 'bold', marginBottom: 22 }}>
                        About us
                    </h1>
                    <h3>
                        One auto is an e-commerce that focuses on Auto Parts Online where we are engaging everyone in the automotive industry. We are established in the year 2018 in Orlando, Florida.
                    </h3>
                    <h3>
                        Our mission is to strive to become a pioneer in the automotive parts industry. We have an OEM and aftermarket replacement part offered from over 5000+ brands across the country. Our platform offers a trusted channel for both car owners and auto parts dealers to come under one platform to obtain the maximum benefits. We provide an online catalogue for our customers to find their required automotive components by searching through brand or part number etc. We have an expert team who are dedicated to redefine the spare parts industry. Our Basic Idea is that customers can find the right parts with transparent pricing and timely delivery, will surely be a successful situation for all concerned.
                    </h3>
                    <h3>
                        One Truck trade in high-quality genuine parts of over 5000+ brands with competitive and reasonable prices as our 100% customer satisfaction is our
                        priority. We provide Quality products along with brand awareness with 24×7 customer support. We provide 100% availability of right and genuine parts.
                        brilliant sales team understands the customer needs and requirements quickly to find their right product and quality for their vehicle.
                    </h3>
                    <h2>
                        SHIPPING INFORMATION
                    </h2>
                    <h3>
                        One Auto only deal in 100% genuine products sourced directly from the manufacturers. We ensure at every point that the product being delivered is genuine and in working condition. One Auto ship the items within the time specified on the product page. Business days exclude public holidays and Sundays. Estimated delivery time depends on the type of product, Product's availability, the destination to which you want the order to be shipped and mode of delivery.
                    </h3>
                    <h3>
                        Most of the order for all major cities take 3-4 days in transit. This time duration may increase up to 7 days for remote areas. Each order would be shipped only to a single destination address specified at the time of payment for that order. If you wish to ship products to different addresses, you shall need to place multiple orders.
                    </h3>
                    <h3>
                        You will be informed by the customer team in case of delay beyond 5 days via email or phone contact.
                    </h3>
                    <h2>
                        Shipping Charges
                    </h2>
                    <h3>
                        The listed prices are final and all-inclusive. The prices you see on the product page is what you pay. Shipping charges are calculated according to the weight of products and the value of products in the cart. In case the product is oversized then we charge $150 for each item.
                    </h3>
                    <h2>
                        Refund
                    </h2>
                    <h3>
                        As per our policy, only the product cost is refunded. Shipping charges are non-refundable and will not be refunded in case the product is returned.
                    </h3>
                    <h3>
                        You can cancel your order by getting in touch with us via e-mail at <a href="mailto:contact@oneauto.us">contact@oneauto.us</a> or over phone at our customer care number ******** (10.00 a.m. to 6.00 p.m. / Monday – Saturday). Your order will be cancelled if it has not been shipped and we will refund the order value as applicable. Moreover, if the order has been shipped but not yet delivered to you, you may cancel the order by contacting us as mentioned above. Your refund will only be processed by us once we receive the originally ordered product back from our courier / logistics partner after deduction of shipping charges.
                    </h3>
                    <h3>
                        Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund. After approval the refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within a certain amount of days.
                    </h3>
                    <h3>
                        If you haven't received a refund yet, please contact us at <a href="mailto:customercare@oneauto.us">customercare@oneauto.us.</a>
                    </h3>
                    <h2>
                        Returns
                    </h2>
                    <h3>
                        Returns are simple. You can directly go to your orders and place the return, or you can contact us to initiate a return. You will receive an email explaining the process once you have initiated a return.
                    </h3>
                    <h3>
                        Wherever possible our logistics partners will facilitate the pick-up of the item. In case, the pick-up cannot be arranged through our logistics partners, you can return the item through a third-party courier service.
                    </h3>
                    <h3>
                        Under some unforeseen circumstances if the product is received in damaged condition, kindly inform our service center to get the product replaced or get else complete refund will be initiated.
                    </h3>
                    <h3>
                        Our policy lasts 10 days. If 10 days have gone by since your purchase, unfortunately, we cannot offer you a refund or exchange.
                    </h3>
                    <h3>
                        To be eligible for a return, your item must be unused and in the same condition that you received it and It must also be in the original packaging. To complete your return, we require a receipt or proof of purchase.
                    </h3>
                    <h2>
                        Additional non-returnable items:
                    </h2>
                    <h3>
                        Gift cards
                    </h3>
                    <h3>
                        Products that already used
                    </h3>
                    <h3>
                        Electronics that have not been installed properly.
                    </h3>
                    <h2>
                        Exchanges
                    </h2>
                    <h3>
                        We only replace items if they are defective or damaged. If you need to exchange it for the same item, send us an email at
                        <a href="mailto:customercare@oneauto.com"> customercare@oneauto.com.</a>
                    </h3>
                </div>

            </Fragment>
        )
    }


}

export default AboutUs;