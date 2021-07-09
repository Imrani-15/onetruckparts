import React, { Fragment } from 'react';


import { InputText } from 'primereact/inputtext';
import { Skeleton } from 'primereact/skeleton';
import { Button } from 'primereact/button';
import serviceCall from '../../utils/Services';
import { appTheme, PRODUCT_BASE_URL } from '../../utils/Constants';

import {styles} from '../../styles/BrandsPage.css';

class BrandsPage extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            brands: [],
            dummyArray:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
            searchInput: '',
            alphabet: '',
            showBrands:true,
            scrolling : false
        }
        this.handleScroll = this.handleScroll.bind(this)

    }

    componentWillMount() {
        window.addEventListener('scroll', this.handleScroll, true);
        this.getBrands();
    }

    componentWillUnmount(){
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll(event) {
        if (window.scrollY < 200) {
            this.setState({scrolling: false});
        }
        else if (window.scrollY > 200) {
            this.setState({scrolling: true});
        }
    }


    getBrands = () => {

        let restUrl = `${PRODUCT_BASE_URL}prod/brands`
        serviceCall({}, restUrl, 'GET')
            .then((res) => {
                if (!res.error) {
                    this.setState({ brands: res.data, showBrands: false })
                } else {

                }
            })
            .catch((error) => {
            })
    }







    goToProductDetailPage() {
        const { selectedPrd } = this.state;
        this.props.history.push('/productdetails/osku:' + selectedPrd.osku, { selectedProduct: selectedPrd })
    }

    prepareAlphabets = () => {
        let result = [];
        for (let i = 65; i < 91; i++) {
            result.push(
                <Button label={String.fromCharCode(i)} 
                onClick={() => this.onAlphabetClick(String.fromCharCode(i))} 
                style={(String.fromCharCode(i) === this.state.alphabet) ?{backgroundColor:appTheme.logoTextColor,color:'#fff'} : {}}
                className="p-button-outlined p-button-secondary p-m-1" />
            )
        }
        return result;
    }

    onAlphabetClick = (value) => {
        this.setState({ alphabet: value })
    }
    elementContainsSearchString = (searchInput, element) => (searchInput ? element.brand.toLowerCase().includes(searchInput.toLowerCase()) : false);

    filterItems = (itemList) => {
        let result = [];
        const { searchInput, alphabet } = this.state;
        if (itemList && (searchInput || alphabet)) {
            result = itemList.filter((element) => (element.brand.charAt(0).toLowerCase() === alphabet.toLowerCase()) ||
                this.elementContainsSearchString(searchInput, element));
        } else {
            result = itemList || [];
        }
        result = (
            <div className="p-grid p-justify-center">
                {result.map((brand, index) => (
      
                    <div className="p-col-4 p-md-2 p-lg-2 p-shadow-2 p-m-md-2" 
                        onClick={()=>this.goToProductPage(brand)}
                        key={index}>
                            <img src={brand.image} style={{ height: 100, width: '100%', objectFit: 'contain' }}
                                onError={(e) => e.target.src = 'https://dublin.anglican.org/cmsfiles/placeholder.png'} />
                            <div style={{ fontWeight: '500', textAlign: 'center' }}>{brand.brand}</div>
                        </div>
             
                ))}

            </div>)
        return result;
    }

    goToProductPage(brand){
        this.props.history.push('/products/category:'+ brand.brand+'?brands=true', {catName:brand.brand, fromBrands:true})
    }

    onSearchInputChange = (e) => {
        this.setState({ searchInput: e.target.value })
    }


    render() {
        const { brands, searchInput, scrolling, showBrands ,dummyArray} = this.state;
        const filteredList = this.filterItems(brands);
        return (
            <Fragment >
                <div style={{ margin: '3%' }}>
                        <div style={{ fontSize: 34, fontWeight: '600' }}>
                            Shop By <span style={{ fontWeight: '400' }}>Brand</span>
                        </div>

                    <div className={(scrolling) ? "p-m-lg-6 {styles.brandsSortScroll}" : "p-m-lg-6 brands-sort" }>
                        {this.prepareAlphabets()}
                    </div>
                    <div className="p-m-lg-6 p-m-4" style={{ display: 'flex', justifyContent: 'center'}}>
                            <span className="p-input-icon-right">
                            <InputText id="search"
                                className="p-inputtext-lg p-d-block {styles.brandsSearch}"
                                placeholder="Search by brand"
                                value={searchInput} onChange={this.onSearchInputChange} />
                                 <i className="pi pi-search" style={{color:appTheme.logoTextColor}}/>
                        </span>
                     
                        
                    </div>
                    {!showBrands ?
                    <div>
                        {filteredList}
                    </div> :
                    <div className="p-grid p-justify-center ">
                    {dummyArray.map((brand, index) => (
                        <div className="p-col-4 p-md-2 p-lg-2 p-shadow-2 p-m-md-2" key={index}>
                            <Skeleton width="100%" height="120px" />
                        </div>
                    ))}
    
                </div>
                    }
             
                </div>



            </Fragment>
        )
    }

}


export default BrandsPage;