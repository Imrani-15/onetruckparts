import React, { Fragment } from 'react';

import './Payment.css'

class Payment extends React.Component {
    fattJs = null;
    constructor(props){
        super(props);
        this.state ={
            tokenizedPaymentMethod: null,
            completedTransaction: null,
            isPayButtonDisabled: true,
            formValues: {},
            loading: false,
        }
        
    }

    componentWillMount() {
        // the FattJs class is attached to `window` by our script
        const FattJs = window.FattJs;
    
        // tell fattJs to load in the card fields
        const fattJs = new FattJs("Oneauto-48859c9cfe78", {
          number: {
            id: "card-number",
            placeholder: "0000 0000 0000 0000",
            style:
              "height: 35px; width: 100%; font-size: 15px; font-family: Helvetica Neue, Helvetica; color: #31325f; font-weight: 300;", // 35px is the height of my card-number div
          },
          cvv: {
            id: "card-cvv",
            placeholder: "CVV",
            style:
              "height: 35px; width: 100%; font-size: 15px; font-family: Helvetica Neue, Helvetica; color: #31325f; font-weight: 300;", // 35px is the height of my card-cvv div
          },
        });
    
        fattJs.showCardForm().then((handler) => {
          console.log("form loaded! :^)");
    
          // for testing!
          handler.setTestPan("4111111111111111");
          handler.setTestCvv("123");
    
          // this.setState({
          //   formValues: {
          //     month: "11",
          //     year: "2024",
          //     firstname: "Himanshu",
          //     lastname: "singh",
          //     phone: "+1111111111111111",
          //   },
          // });
        });
    
        fattJs.on("card_form_complete", (message) => {
          console.log("card_form_complete", message);
          // activate pay button
          this.setState({ isPayButtonDisabled: false });
        });
    
        fattJs.on("card_form_uncomplete", (message) => {
          console.log("card_form_uncomplete", message);
          // deactivate pay button
          this.setState({ isPayButtonDisabled: true });
        });
    
        this.fattJs = fattJs;
      }
    
      handleFieldChange = (event) => {
        const { formValues } = this.state;
        const { name, value } = event.target;
        this.setState({ formValues: { ...formValues, [name]: value } });
      };
    
      // if email is supplied, a reciept will be sent to customer
      handlePay = () => {
        this.setState({
          tokenizedPaymentMethod: null,
          completedTransaction: null,
          isPayButtonDisabled: true,
          loading: true,
        });
    
        const { formValues } = this.state;
        const extraDetails = {
          ...formValues,
          total: 1,
          address_1: "100 S Orange Ave",
          address_2: "",
          address_city: "Orlando",
          address_state: "FL",
          address_zip: "32811",
          address_country: "USA",
          url: "https://omni.fattmerchant.com/#/bill/",
          method: "card",
          // validate is optional and can be true or false.
          // determines whether or not fattmerchant.js does client-side validation.
          // the validation follows the sames rules as the api.
          // check the api documentation for more info:
          // https://fattmerchant.com/api-documentation/
          validate: false,
          // meta is optional and each field within the POJO is optional also
          meta: {
            reference: "invoice-reference-num", // optional - will show up in emailed receipts
            memo: "notes about this transaction", // optional - will show up in emailed receipts
            otherField1: "other-value-1", // optional - we don't care
            otherField2: "other-value-2", // optional - we don't care
            subtotal: 1, // optional - will show up in emailed receipts
            tax: 0, // optional - will show up in emailed receipts
            lineItems: [
              // optional - will show up in emailed receipts
              {
                id: "optional-fm-catalog-item-id",
                item: "Demo Item",
                details: "this is a regular, demo item",
                quantity: 10,
                price: 0.1,
              },
            ],
          },
        };
    
        this.fattJs.pay(extraDetails).then((completedTransaction) => {
          console.log(
            "successfully paid. here's the transaction: ",
            completedTransaction
          );
          this.setState({
            completedTransaction,
            isPayButtonDisabled: false,
            loading: false,
          });
        });
      };
    
      handleTokenize = () => {
        this.setState({
          tokenizedPaymentMethod: null,
          completedTransaction: null,
          isPayButtonDisabled: true,
          loading: true,
        });
    
        const { formValues } = this.state;
        const extraDetails = {
          ...formValues,
          total: 1,
          address_1: "100 S Orange Ave",
          address_2: "",
          address_city: "Orlando",
          address_state: "FL",
          address_zip: "32811",
          address_country: "USA",
          url: "https://omni.fattmerchant.com/#/bill/",
          method: "card",
          // validate is optional and can be true or false.
          // determines whether or not fattmerchant.js does client-side validation.
          // the validation follows the sames rules as the api.
          // check the api documentation for more info:
          // https://fattmerchant.com/api-documentation/
          validate: false,
        };
    
        this.fattJs.tokenize(extraDetails).then((tokenizedPaymentMethod) => {
          console.log(
            "successfully tokenized! here's the payment method: ",
            tokenizedPaymentMethod
          );
          this.setState({
            tokenizedPaymentMethod,
            isPayButtonDisabled: false,
            loading: false,
          });
        });
      };


      renderCustomerDetails = () => {
        const { formValues } = this.state;
    
        return (
          <div className="group">
            <label>
              <span>First Name</span>
              <input
                name="firstname"
                className="field"
                placeholder="Jane"
                onChange={this.handleFieldChange}
                value={formValues.firstname || ""}
              />
            </label>
            <label>
              <span>Last Name</span>
              <input
                name="lastname"
                className="field"
                placeholder="Doe"
                onChange={this.handleFieldChange}
                value={formValues.lastname || ""}
              />
            </label>
            <label>
              <span></span>
              <input
                name="phone"
                className="field"
                placeholder="+1000000000000"
                onChange={this.handleFieldChange}
                value={formValues.phone || ""}
              />
            </label>
          </div>
        );
      };
    
      renderCardDetails = () => {
        const { formValues } = this.state;
    
        return (
          <div className="group">
            <label>
              <span>Card</span>
              <div id="card-element" className="field">
                <div id="card-number" className="card-number" />
                <div id="card-cvv" className="card-cvv" />
              </div>
              <div className="expiry-month">
                <input
                  className="field"
                  name="month"
                  maxLength="2"
                  placeholder="MM"
                  onChange={this.handleFieldChange}
                  value={formValues.month || ""}
                />
              </div>
              <div>/</div>
              <div className="expiry-year">
                <input
                  className="field"
                  name="year"
                  maxLength="4"
                  placeholder="YYYY"
                  onChange={this.handleFieldChange}
                  value={formValues.year || ""}
                />
              </div>
            </label>
          </div>
        );
      };
    
      renderMessage = () => {
        const { completedTransaction, tokenizedPaymentMethod } = this.state;
        const success = completedTransaction || tokenizedPaymentMethod;
    
        return (
          <div className="success">
            {completedTransaction
              ? `Successfully paid $1! The ID for this transaction is ${completedTransaction.id}`
              : ""}
            {tokenizedPaymentMethod
              ? `Successfully tokenized the card! The ID for the payment method is ${tokenizedPaymentMethod.id}`
              : ""}
          </div>
        );
      };


    render() {
        const { isPayButtonDisabled, loading } = this.state;
    
        return (
          <div id="paymenttest">
            <form onSubmit={(e) => e.preventDefault()}>
              {this.renderCustomerDetails()}
              {this.renderCardDetails()}
    
              <button
                className="button"
                onClick={this.handlePay}
                disabled={isPayButtonDisabled}
              >
                Pay $1
              </button>
    
              <button
                className="button"
                onClick={this.handleTokenize}
                disabled={isPayButtonDisabled}
              >
                Tokenize Card
              </button>
    
              <div className="outcome">
                {this.renderMessage()}
                {loading && <div className="loader" />}
              </div>
            </form>
          </div>
        );
      }
}

export default Payment;