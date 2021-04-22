import React, { Fragment } from 'react';


import { DataView } from 'primereact/dataview';
import { Card } from 'primereact/card';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Timeline } from 'antd';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { ClockCircleOutlined, CreditCardOutlined } from '@ant-design/icons';
import {cartProducts} from '../utils/Constants';
import  ImageComponent from '../components/ImageComponent';

import './styles/CheckOutPage.css';

class CheckOutPage extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
           
        }
    }



    render(){
        return(
            <Fragment>
                 <div style={{ padding: 10,margin:'4%' }}>
                    <div style={{ fontSize: 34, fontWeight: '600' }}>
                        Checkout
                    </div>
                    <div className="p-grid p-mt-4">
                        <div className="p-col-8">
                        <Timeline>
                            <Timeline.Item 
                                dot={<ClockCircleOutlined style={{ fontSize: '20px' }} />}
                                color="red">
                                <h1>Shipping Address</h1>
                                <div className="card-border p-shadow-3">
                                    <div>
                                        <div style={{fontSize:20,fontWeight: 'bold',}}>Rajesh Gudimetla</div>
                                        <div style={{fontSize:18}}>Near Ramalayam</div>
                                        <div style={{fontSize:18}}>Khammam, 505303</div>
                                    </div>
                                    <Button label="Change Shipping Address" style={{height:45}} className="p-button-outlined" /> 
                                </div>
                                </Timeline.Item>
                            <Timeline.Item 
                                color="green"
                                dot={<CreditCardOutlined  style={{ fontSize: '20px' }}/>}
                            >
                             <h1>Payment Method</h1>
                                <div className="card-border p-shadow-3">
                                    <div>
                                        <div style={{fontSize:20,fontWeight: 'bold',}}>Rajesh Gudimetla</div>
                                        <div style={{fontSize:18}}>Near Ramalayam</div>
                                        <div style={{fontSize:18}}>Khammam, 505303</div>
                                    </div>
                                    <Button label="Change Shipping Address" style={{height:45}} className="p-button-outlined" /> 
                                </div>
                            
                            </Timeline.Item>
                            <Timeline.Item>Technical testing 2015-09-01</Timeline.Item>
                            <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item>
                        </Timeline>
                        </div>
                        <div className="p-col-1"></div>
                        <div className="p-col-3 p-shadow-3" style={{height:360,padding: 26}}>
                            <div style={{ fontSize: 24, fontWeight: '600' }}>
                                Cart Details
                            </div>
                            <Divider />
                            <div className="cartdetailsAlign">
                                <div className="cartdetailsText">
                                    Sub Total
                                </div>
                                <div className="cartdetailsText">
                                    $ 200
                                </div>
                            </div>
                            <div className="cartdetailsAlign">
                                <div className="cartdetailsText">
                                    Shipping
                                </div>
                                <div className="cartdetailsText">
                                    $ 20
                                </div>
                            </div>
                            <div className="cartdetailsAlign">
                                <div className="cartdetailsText">
                                    Tax
                                </div>
                                <div className="cartdetailsText">
                                    $ 2
                                </div>
                            </div>
                            <Divider />
                            <div className="cartdetailsAlign">
                                <div className="totalText">
                                    Total
                                </div>
                                <div className="totalText">
                                    $ 240
                                </div>
                            </div>
                            <Button  
                                label="Place Your Order" 
                                className="p-button-raised p-button-rounded p-button-warning" 
                                style={{width:'100%',marginTop:16}}
                                onClick={()=> this.props.history.push("/checkout")}
                            />
                        </div>

                    </div>
                 </div>
            </Fragment>
    )
    }



    // render(){
    //     return(
    //             <Fragment>
    //                  <div className="p-grid " style={{ margin:40,}}>
    //                 <div className="p-col-8">
    //                 <ScrollPanel style={{width: '100%',padding:14}}>
    //                     <h1>1. Shipping Address</h1>
    //                     <div className="card-border">
    //                         <div>
    //                             <div style={{fontSize:20,fontWeight: 'bold',}}>Rajesh Gudimetla</div>
    //                             <div style={{fontSize:18}}>Near Ramalayam</div>
    //                             <div style={{fontSize:18}}>Khammam, 505303</div>
    //                         </div>
    //                         <Button label="Change Shipping Address" style={{height:45}} className="p-button-outlined" /> 
    //                     </div>
    //                     <h1>2. Select Payment</h1>
    //                     <div className="card-border">
                            
    //                     </div>
    //                     <Button label="Add A New Card" style={{height:45,alignSelf:'flex-end'}} className="p-button-outlined" />
    //                     <h1>3. Item Review and Shipping</h1>
    //                     <div className="card-border">
                            
    //                     </div>
    //                     <Button label="Place Your Order" style={{height:45,width:'100%'}} className="p-button p-mt-4" />
    //                 </ScrollPanel>
                     
    //                 </div>
    //                 <div className="p-col-4">
    //                 <Card title="Order Summary" style={{backgroundColor: '#f7f7f7',}}>
    //                         <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',marginBottom:16}}>
    //                             <div>Total Items :</div>
    //                             <div>4</div>
    //                         </div>  
    //                         <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',marginBottom:16}}>
    //                             <div>Sub Total :</div>
    //                             <div>$ 220</div>
    //                         </div>  
    //                         <Button label="Place Your Order" style={{width:'100%'}}  className="p-button-secondary" /> 
    //                 </Card>
    //                 </div>
    //                 </div>
    //             </Fragment>
    //     )
    // }

}

export default CheckOutPage;