import React, { Fragment } from 'react';

import { Row, Col, Result, Button } from 'antd';

import OneButton from '../../components/OneButton';
import { Divider } from 'primereact/divider';
import Ordersuccess from '../../assets/order-success.png';


class OrderSuccess extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <Result
                    status="success"
                    title="Order Successful"
                    subTitle="Thank you so much for your order."
                    extra={[
                        <OneButton
                        onClick={() => this.props.history.replace('/')}
                        buttonLabel={"Back to shopping"}
                        btnShape="round"
                        btnSize="large"
                        btnBlock={false}
                        buttonStyle={{ height: 36, width:400 }}
                    />
                    ]}
                />
            </Fragment>
        )
    }

}


export default OrderSuccess;


