import React, { Fragment } from 'react';

import { Galleria } from 'primereact/galleria';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';

class ProductDetailsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photoList: [],
            quantity: 0
        }



    }

    componentDidMount() {
        this.getPhotos()
    }



    getPhotos() {
        let sliders = [
            {
                id: 1,
                imgurl: 'https://www.primefaces.org/primereact/showcase/showcase/demo/images/galleria/galleria1.jpg',
                thumbimg: 'https://www.primefaces.org/primereact/showcase/showcase/demo/images/galleria/galleria1s.jpg'
            },
            {
                id: 2, imgurl: 'https://www.primefaces.org/primereact/showcase/showcase/demo/images/galleria/galleria2.jpg',
                thumbimg: 'https://www.primefaces.org/primereact/showcase/showcase/demo/images/galleria/galleria2s.jpg'
            },
            {
                id: 3, imgurl: 'https://www.primefaces.org/primereact/showcase/showcase/demo/images/galleria/galleria3.jpg',
                thumbimg: 'https://www.primefaces.org/primereact/showcase/showcase/demo/images/galleria/galleria3s.jpg'
            },
            {
                id: 4, imgurl: 'https://www.primefaces.org/primereact/showcase/showcase/demo/images/galleria/galleria4.jpg',
                thumbimg: 'https://www.primefaces.org/primereact/showcase/showcase/demo/images/galleria/galleria4s.jpg'
            }
        ];
        this.setState({ photoList: sliders })
    }


    itemTemplate(item) {
        return <img src={item.imgurl} alt={item.alt} style={{ width: '100%', display: 'block' }} />
    }

    thumbnailTemplate(item) {
        return <img src={item.thumbimg} alt={item.alt} style={{ width: '100%', display: 'block' }} />
    }

    render() {
        const { quantity } = this.state;
        return (
            <Fragment>
                <div className="p-grid" style={{ padding: 10, paddingTop: 30 }}>
                    <div className="p-col-6">

                        <Galleria value={this.state.photoList} numVisible={4}
                            thumbnailsPosition="left" style={{ maxWidth: '600px' }}

                            item={this.itemTemplate} thumbnail={this.thumbnailTemplate} />
                    </div>
                    <div className="p-col-3 p-col-align-start">
                        <div style={{ fontSize: 26 }}>American Tri-Fold Tonneau Cover</div>
                        <ul>
                            <li>Neil Armstrong</li>
                            <li>Alan Bean</li>
                            <li>Peter Conrad</li>
                            <li>Edgar Mitchell</li>
                            <li>Alan Shepard</li>
                        </ul>
                    </div>
                    <div className="p-col-3">
                        <div>
                            <div className="p-field">
                                <label htmlFor="quantity" className="p-d-block">Quantity</label>
                                <InputNumber value={quantity} id="quantity"
                                    onValueChange={(e) => this.setState({ quantity: e.value })}
                                    mode="decimal" showButtons
                                    min={0} max={100}
                                />
                            </div>

                            <div style={{ marginBottom: 20, marginTop: 20 }}>
                                <Button label="Add to Cart" icon="pi pi-check" iconPos="right" />
                            </div>

                            <Button label="Buy Now" />
                        </div>

                    </div>
                </div>
                <div style={{ padding: 10, paddingTop: 30 }}>
                    <h2>Product description</h2>
                    <p>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                    </p>
                </div>
            </Fragment>
        )
    }
}


export default ProductDetailsPage;