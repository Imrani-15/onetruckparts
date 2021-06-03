import React, { Fragment } from 'react';

import { connect } from "react-redux";

import { Steps, Collapse, Select } from 'antd';
import { Toast } from 'primereact/toast';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { showToastMessage } from '../../utils/Utils';
import serviceCall from '../../utils/Services';
import { appTheme, PRODUCT_BASE_URL, orderStatus } from '../../utils/Constants';


import './Orders.css'

const { Step } = Steps;
const { Panel } = Collapse;

class Orders extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ordersList: [],
            orderDetails:[],
            orderLoader:false
        }
        this.toastRef = React.createRef();
    }

    componentWillMount() {
        this.getOrders();
    }

    getOrders = () => {
        let restUrl = `${PRODUCT_BASE_URL}account/orders`
        serviceCall({}, restUrl, 'GET')
            .then((res) => {
                if (!res.error) {
                    this.setState({ ordersList: res.data.orders })
                } else {

                }
            })
            .catch((error) => {
            })
    }

    getOrdersDetails(order){
        this.setState({orderLoader:true,orderDetails:[]},()=>{
            let restUrl = `${PRODUCT_BASE_URL}account/order/detail/${order._id}`
            serviceCall({}, restUrl, 'GET')
                .then((res) => {
                    if (!res.error) {
                        this.setState({ orderDetails: res.data.orderDetails,orderLoader:false })
                    } else {
    
                    }
                })
                .catch((error) => {
                })
        })

    }






    render() {
        const { ordersList, orderDetails, orderLoader } = this.state;

        return (
            <Fragment>
                <Toast ref={this.toastRef} />
                <div style={{ padding: 10, margin: '4%' }}>
                    <div style={{ fontSize: 34, fontWeight: '600' }}>
                        MY Orders
                        </div>
                    <div className="p-d-flex p-flex-column order-main">
                        {ordersList.map((order,index) => (
                            <Collapse
                            onChange={this.getOrdersDetails.bind(this,order)}
                            style={{marginTop:14}}
                          >
                            <Panel 
                            header={                         
                                    <div style={{color:appTheme.secondaryColor, fontWeight:'bold'}}>
                                        ORDER PLACED : {' '} {new Date(order.created).toDateString()}
                                    </div>
                            } key="1" extra={
                                <Steps size="small" progressDot  
                                    style={{marginTop:-20}}
                                    current={
                                        (order.status === orderStatus.PENDING) ? 0 : 1
                                    }
                                    >
                                        <Step title="Pending" />
                                        <Step title="In Progress" />
                                        <Step title="Shipped"  />
                                        <Step title="Completed"  />
                                    </Steps> 
                            }>
                              <div>
                                <div style={{display:'flex'}}>
                                    <h4 style={{color:appTheme.logoTextColor}}>Order Id: {order._id}</h4>
                                </div>
                              <DataTable 

                                loading={orderLoader}
                                footer={
                                    <div style={{display:'flex'}}>
                                        <h3 style={{color:appTheme.primaryColor}}>Order Total: $ 200</h3>
                                    </div>
                                }
                                value={orderDetails}>
                                <Column field="title" header="Product" />
                                <Column field="quantity" header="Quantity" />
                                <Column field="price" header="Price" />
                                </DataTable>
                              </div>
                            </Panel>
                          </Collapse>

                        ))}
                    </div>
                </div>
            </Fragment>
        )
    }

}


function mapStateToProps(state) {
    return {

    }
}
function mapDispatchToProps(dispatch) {
    return {
        setUserData: obj => {
            dispatch({ type: "SET_APP_DATA", data: obj });
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Orders);

