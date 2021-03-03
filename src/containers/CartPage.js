import React, { Fragment } from 'react';


import { DataView } from 'primereact/dataview';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

import {cartProducts} from '../utils/Constants';
import  ImageComponent from '../components/ImageComponent';

import './styles/CartPage.css';

class CartPage extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
           
        }
    }


    renderListItem = (data) => {
        return (
                <div className="product-list-item">
                    <div className="product-list-detail">
                    <ImageComponent image={data.imgurl} name={data.name} imgStyle={{width:120}} />
                    <div style={{marginLeft:20}}>
                        <div className="product-name">{data.name}</div>
                        <div className="product-price">Price : ${data.price}</div>
                        <div className="product-quantity">Quantity : 1</div>
                    </div>
                    </div>
                    
                    <div className="product-list-action">
                        <Button icon="pi pi-shopping-cart" label="Add to Cart"></Button>
                    </div>
                </div>
        );
    }


    render(){
        return(
                <Fragment>
                     <div className="p-grid " style={{ padding: 10 }}>
                    <div className="p-col-9 cart-dataview">
                        
                        <DataView value={cartProducts} 
                             layout={"list"} 
                            header={<h2>Shopping Cart</h2>}
                            rows={10}
                            itemTemplate={this.renderListItem} />
                    </div>
                    <div className="p-col-3">
                    <Card title="Cart Details" style={{backgroundColor: '#f7f7f7',}}>
                            <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',marginBottom:16}}>
                                <div>Total Items :</div>
                                <div>4</div>
                            </div>  
                            <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',marginBottom:16}}>
                                <div>Sub Total :</div>
                                <div>$ 220</div>
                            </div>  
                            <Button label="Proceed to checkout" style={{width:'100%'}}  className="p-button-secondary" /> 
                    </Card>
                    </div>
                    </div>
                </Fragment>
        )
    }

}

export default CartPage;