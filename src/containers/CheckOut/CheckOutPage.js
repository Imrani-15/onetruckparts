import React, { Fragment } from 'react';

import { Steps, Result } from 'antd';
import { Toast } from 'primereact/toast';

import OneButton from '../../components/OneButton';

import Locations from './Locations';
import Payment from './Payment';

import userProfile from '../../utils/UserProfile';
import serviceCall from '../../utils/Services';
import { showToastMessage } from '../../utils/Utils';

import { PRODUCT_BASE_URL, appTheme } from '../../utils/Constants';


import './CheckOutPage.css';

const { Step } = Steps;

const steps = [
    {
        title: 'Select a delivery address',
        content: 'First-content',
    },
    {
        title: 'Payment',
        content: 'Last-content',
    },
    {
        title: 'Order Confirmation',
        content: 'Last-content',
    }
];
class CheckOutPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            selectedAddress: {}
        }
        this.toastRef = React.createRef();
    }


    selectDeliveryAddress(selectedAddress) {
        this.setState({ selectedAddress })
    }


    onClickNext = () => {
        const { current, selectedAddress } = this.state;
        if (Object.keys(selectedAddress).length === 0) {
            showToastMessage(this.toastRef, 'error', 'Address', "Please select delivery address");
        } else if (current === 0 || current === 1) {
            this.setState({ current: this.state.current + 1 })
        }
    }

    submitOrder = () => {
        let restUrl = `${PRODUCT_BASE_URL}cart/checkout`;
        serviceCall({}, restUrl, 'POST')
            .then((res) => {
                this.setState({ loading: false }, () => {
                    if (!res.data.error) {
                        this.props.history.replace('/')
                    } else {

                    }
                })
            })
            .catch((error) => {
                this.setState({ loading: false }, () => {
                    showToastMessage(this.toastRef, 'error', '', 'Opps, Something went wrong, Try again');
                })
            })
    }



    render() {
        const { current } = this.state;
        let userData = userProfile.getUserObj();
        return (
            <Fragment>
                <Toast ref={this.toastRef} />
                <div style={{ padding: 10, margin: '4%' }}>
                    <div style={{ fontSize: 30, fontWeight: '600' }}>
                        Checkout
                    </div>
                    {userData && userData.accessToken && userData.userId ?
                        <div className="p-m-4">

                            <Steps current={current} style={{ width: '60%' }}>
                                {steps.map(item => (
                                    <Step key={item.title} title={item.title} />
                                ))}
                            </Steps>
                            <div className="steps-content">
                                {current === 0 ?
                                    <Locations
                                        selectDeliveryAddress={this.selectDeliveryAddress.bind(this)}

                                    /> :
                                    (current === 1) ?
                                        <Payment /> :
                                        <div>dd</div>

                                }
                            </div>
                            <div className="steps-action">
                                {current < steps.length - 1 && (
                                    <OneButton
                                        onClick={() => this.onClickNext()}
                                        buttonLabel={"Next"}
                                        btnSize="large"
                                        btnBlock={false}
                                        btnDisabled={false}
                                        buttonStyle={{ fontSize: 16, marginTop: 22, width: 200 }}
                                    />
                                )}
                                {current === steps.length - 1 && (
                                    <OneButton
                                        onClick={() => this.submitOrder()}
                                        buttonLabel={"Submit Order"}
                                        btnSize="large"
                                        btnBlock={false}
                                        buttonStyle={{ fontSize: 16, marginTop: 22, width: 200 }}
                                    />
                                )}
                                {current > 0 && (
                                    <OneButton
                                        onClick={() => this.setState({ current: current - 1 })}
                                        buttonLabel={"Previous"}
                                        btnSize="large"
                                        btnType="dashed"
                                        btnBlock={false}
                                        buttonStyle={{
                                            fontSize: 16, marginTop: 22, width: 200, marginLeft: 12,
                                            backgroundColor: '#fff',
                                        }}
                                    />
                                )}
                            </div>



                        </div> :
                        <div>
                            <Result
                                status="403"
                                title="Please Login to checkout"
                                extra={<OneButton
                                    onClick={() => this.props.history.push('/login')}
                                    buttonLabel={"Go to Login Page"}
                                    btnSize="large"
                                    btnShape="round"
                                    btnBlock={false}
                                    buttonStyle={{fontSize:16,width: 220,}}
                                />}
                            />
                        </div>}
                </div>
            </Fragment>
        )
    }



}

export default CheckOutPage;