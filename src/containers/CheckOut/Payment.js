import React, { Fragment } from 'react';

import axios from 'axios';
import { InputText } from 'primereact/inputtext';

import OneButton from '../../components/OneButton';

import { appTheme } from '../../utils/Constants';

import './Payment.css'

class Payment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }

  }

  componentWillMount() {

  }


  onSubmitPayment = () => {

    var qs = require('qs');
  axios.post(
        'https://api.stripe.com/v1/tokens',
        qs.stringify({
          'card[number]': '4242424242424242',
          'card[exp_month]': 6,
          'card[exp_year]': 22,
          'card[cvc]': '314',
        }),
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Bearer ' + 'sk_test_4eC39HqLyjWDarjtT1zdp7dc',
          },
        },
      )
      .then(response => {
        // handle success
        if (response.status == '200') {
          console.log(response);
          this.setState({cardtoken: response.data.id});
        }
      })
   
  }




  render() {
    const { } = this.state;

    return (
      <Fragment>
        <div className="p-d-flex p-jc-center">
          <div className="p-shadow-4 payment-card">
            <div className="p-d-flex p-jc-between">
                <div style={{fontSize:20,fontWeight:'600'}}>Payment Details</div>
            </div>
            <div className="p-field">
              <label htmlFor="name" className="p-d-block">Name</label>
              <span className="p-input-icon-left">
                <i className="pi pi-user" />
                <InputText id="name" placeholder="e.g. Jhon"
                  value={this.state.value4} style={{ width: 380 }}
                  className={"p-inputtext-sm p-d-block"}
                  onChange={(e) => this.setState({ value4: e.target.value })} />
              </span>
            </div>
            <div className="p-field">
              <label htmlFor="number" className="p-d-block">Card number</label>
              <span className="p-input-icon-left">
                <i className="pi pi-credit-card" />
                <InputText id="number" placeholder="8888-8888-8888-8888"
                  value={this.state.value4} style={{ width: 380 }}
                  className={"p-inputtext-sm p-d-block"}
                  onChange={(e) => this.setState({ value4: e.target.value })} />
              </span>
            </div>
            <div className="p-field">
              <label htmlFor="date" className="p-d-block">Expiry date</label>
              <span className="p-input-icon-left">
                <i className="pi pi-calendar-plus" />
                <InputText id="date"
                  placeholder="06/2020"
                  className={"p-inputtext-sm p-d-block"}
                  style={{ width: 380 }}
                />
              </span>
            </div>
            <div className="p-field">
              <label htmlFor="csv" className="p-d-block">CVV/CSV</label>
              <span className="p-input-icon-left">
                <i className="pi pi-id-card" />
                <InputText value={this.state.value4} style={{ width: 380 }}
                  className={"p-inputtext-sm p-d-block"}
                  placeholder="123"
                  onChange={(e) => this.setState({ value4: e.target.value })} />
              </span>
            </div>
            <OneButton
              onClick={this.onSubmitPayment}
              buttonLabel={"Proceed to pay"}
              btnSize="large"
              btnShape="round"
              buttonStyle={{
                fontSize: 16, width: 380, height: 40

              }}
            />
          </div>

        </div>
      </Fragment>
    );
  }
}

export default Payment;