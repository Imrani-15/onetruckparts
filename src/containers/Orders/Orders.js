import React, { Fragment } from 'react';

import { connect } from "react-redux";

import { Steps, Collapse, Row, Col, Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

import { Divider } from 'primereact/divider';

import { Toast } from 'primereact/toast';


import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import AppSpinner from '../../components/AppSpinner';
import emptyWishlist from '../../assets/empty-wishlist.png';

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
            orderDetails: [],
            orderLoader: true
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
                this.setState({orderLoader:false},()=>{
                    if (!res.data.error) {
                        if (res.data.orders.length !== 0) {
                            let orders = res.data.orders.map((order) => {
                                order.selected = false
                                return order
                            })
                            this.setState({ ordersList: orders })
                        }
                    } else {
    
                    }
                })
            
            })
            .catch((error) => {
                this.setState({orderLoader:false})
            })
    }

    getOrdersDetails(selorder) {
        this.setState({ orderLoader: true, orderDetails: [] }, () => {

            let restUrl = `${PRODUCT_BASE_URL}account/order/detail/${selorder._id}`
            serviceCall({}, restUrl, 'GET')
                .then((res) => {
                    if (!res.error) {
                        let updOrders = this.state.ordersList.map((order) => {
                            if (order._id === selorder._id) {
                                order.selected = true
                            } else {
                                order.selected = false
                            }
                            return order
                        })
                        this.setState({ orderDetails: res.data.orderDetails, ordersList: updOrders, orderLoader: false })
                    } else {

                    }
                })
                .catch((error) => {
                    this.setState({orderLoader:false})
                })
        })

    }




    render() {
        const { ordersList, orderDetails, orderLoader } = this.state;

        return (
            <Fragment>
                <div className="checkout-main">
                    <Row className="checkout-submain">
                        <Col xs={24} md={24} lg={22} className="p-shadow-1 p-p-lg-4 p-p-2" >
                            <h2>My Orders</h2>
                            <Divider />
                            {ordersList.length === 0 ?
                                <div>
                                    <div style={{ display: 'grid', justifyContent: 'center' }}>
                                        <img src={emptyWishlist} alt="emptyWishlist" style={{ height: 140, alignSelf: 'center' }} />
                                        <h3 style={{ textAlign: 'center', color: appTheme.logoTextColor, fontWeight: '800', marginTop: 12 }}>
                                            No existing orders.
                                        </h3>
                                    </div>
                                </div> :
                                <div>
                                    {ordersList.map((order, index) =>
                                        <div className="p-shadow-2 p-mb-4">
                                            <div className="p-shadow-2 order-main">
                                                <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                    <Button type="text"
                                                        onClick={this.getOrdersDetails.bind(this, order)}
                                                        icon={(order.selected) ? <UpOutlined /> : <DownOutlined />} danger
                                                        className="p-mr-3" />
                                                    <div>
                                                        <h4 style={{ color: appTheme.secondaryColor }}>Order Id: {order._id}</h4>
                                                        <h5 style={{ color: appTheme.dark6 }}>Order Createdon : {' '} {new Date(order.created).toDateString()}</h5>
                                                    </div>
                                                </span>
                                                <div className="order-steps">
                                                    <Steps size="small" progressDot
                                                        responsive
                                                        current={
                                                            (order.status === orderStatus.PENDING) ? 0 : 1
                                                        }
                                                    >
                                                        <Step title="Pending" />
                                                        <Step title="In Progress" />
                                                        <Step title="Shipped" />
                                                        <Step title="Completed" />
                                                    </Steps>
                                                </div>
                                            </div>
                                            {order.selected &&
                                                <div>
                                                    {orderDetails.map((product) => (
                                                        <Row className="p-pb-1 p-pt-1 border-bottom" align="middle">
                                                            <Col xs={7} md={4} lg={4} className="col-align-center p-p-lg-3">
                                                                <img src={`${product.image}`}
                                                                    onError={(e) => e.target.src = 'https://dublin.anglican.org/cmsfiles/placeholder.png'}
                                                                    alt={product.image} style={{ height: '90%', width: '90%', objectFit: 'contain' }} />
                                                            </Col>
                                                            <Col xs={1} md={1} lg={1}></Col>
                                                            <Col xs={16} md={11} lg={9} >
                                                                <h3 style={{ color: appTheme.secondaryColor, fontWeight: '600' }}>{product.title}</h3>
                                                                <h4 style={{ color: appTheme.logoTextColor }}>$ {product.price}</h4>
                                                            </Col>
                                                            <Col xs={0} md={1} lg={1}></Col>
                                                            <Col xs={12} md={4} lg={4} className="col-align-center">
                                                                <h3 style={{ color: appTheme.dark3 }}>Quantity : {product.quantity}</h3>
                                                            </Col>
                                                            <Col xs={12} md={3} lg={4} className="col-align-center">
                                                                <h3 style={{ color: appTheme.dark3 }}>Total : $ {product.total}</h3>
                                                            </Col>

                                                        </Row>
                                                    ))}
                                                    <h3 style={{ color: appTheme.primaryColor ,padding: 12,}}>Order Total: $ {order.orderTotal}</h3>
                                                </div>
                                                
                                            }
                                        </div>)}
                                </div>}
                        </Col>
                    </Row>
                </div>
                {orderLoader && <AppSpinner />}
            </Fragment>
        )
    }




    render1() {
        const { ordersList, orderDetails, orderLoader } = this.state;

        return (
            <Fragment>
                {ordersList.map((order, index) =>
                    <Collapse
                        onChange={this.getOrdersDetails.bind(this, order)}
                        style={{ marginTop: 14 }}
                        accordion
                    ><UpOutlined />
                        <Panel
                            header={
                                <div style={{ color: appTheme.secondaryColor, fontWeight: 'bold' }}>
                                    ORDER PLACED : {' '} {new Date(order.created).toDateString()}
                                </div>
                            } key={index}

                            extra={
                                <Steps size="small" progressDot
                                    style={{ marginTop: -20 }}
                                    current={
                                        (order.status === orderStatus.PENDING) ? 0 : 1
                                    }
                                >
                                    <Step title="Pending" />
                                    <Step title="In Progress" />
                                    <Step title="Shipped" />
                                    <Step title="Completed" />
                                </Steps>
                            }>
                            <div>
                                <div style={{ display: 'flex' }}>
                                    <h4 style={{ color: appTheme.logoTextColor }}>Order Id: {order._id}</h4>
                                </div>
                                {orderDetails.map((product) => (
                                    <Row className="p-pb-1 p-pt-1 border-bottom" align="middle">
                                        <Col xs={7} md={4} lg={4} className="col-align-center p-p-lg-3">
                                            <img src={`${product.image}`}
                                                onError={(e) => e.target.src = 'https://dublin.anglican.org/cmsfiles/placeholder.png'}
                                                alt={product.image} style={{ height: '90%', width: '90%', objectFit: 'contain' }} />
                                        </Col>
                                        <Col xs={1} md={1} lg={1}></Col>
                                        <Col xs={16} md={11} lg={9} >
                                            <h3 style={{ color: appTheme.secondaryColor, fontWeight: '600' }}>{product.title}</h3>
                                            <h4 style={{ color: appTheme.logoTextColor }}>$ {product.price}</h4>
                                        </Col>
                                        <Col xs={0} md={1} lg={1}></Col>
                                        <Col xs={12} md={4} lg={4} className="col-align-center">
                                            <h3 style={{ color: appTheme.dark3 }}>Quantity : {product.quantity}</h3>
                                        </Col>
                                        <Col xs={12} md={3} lg={4} className="col-align-center">
                                            <h3 style={{ color: appTheme.dark3 }}>Total : $ {product.total}</h3>
                                        </Col>

                                    </Row>
                                ))}
                            </div>
                        </Panel>
                    </Collapse>
                )}
                <Toast ref={this.toastRef} />
                <div style={{ padding: 10, margin: '4%' }}>
                    <div style={{ fontSize: 34, fontWeight: '600' }}>
                        MY Orders
                    </div>
                    <div className="p-d-flex p-flex-column order-main">
                        {ordersList.map((order, index) => (
                            <Collapse
                                onChange={this.getOrdersDetails.bind(this, order)}
                                style={{ marginTop: 14 }}
                            >
                                <Panel
                                    header={
                                        <div style={{ color: appTheme.secondaryColor, fontWeight: 'bold' }}>
                                            ORDER PLACED : {' '} {new Date(order.created).toDateString()}
                                        </div>
                                    } key="1" extra={
                                        <Steps size="small" progressDot
                                            style={{ marginTop: -20 }}
                                            current={
                                                (order.status === orderStatus.PENDING) ? 0 : 1
                                            }
                                        >
                                            <Step title="Pending" />
                                            <Step title="In Progress" />
                                            <Step title="Shipped" />
                                            <Step title="Completed" />
                                        </Steps>
                                    }>
                                    <div>
                                        <div style={{ display: 'flex' }}>
                                            <h4 style={{ color: appTheme.logoTextColor }}>Order Id: {order._id}</h4>
                                        </div>
                                        <DataTable

                                            loading={orderLoader}
                                            footer={
                                                <div style={{ display: 'flex' }}>
                                                    <h3 style={{ color: appTheme.primaryColor }}>Order Total: $ {order.orderTotal}</h3>
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

