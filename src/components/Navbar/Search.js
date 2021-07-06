import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import { Input, AutoComplete, Dropdown, Button } from 'antd';

import { SearchOutlined, DownOutlined, CarOutlined, DeleteOutlined } from '@ant-design/icons';
import serviceCall from '../../utils/Services';
import { isNotEmpty } from '../../utils/Utils';
import { PRODUCT_BASE_URL, appTheme } from '../../utils/Constants';

import '../Navbar/Navbar.css'

class Search extends Component {

  constructor(props) {
    super(props)
    this.state = {
      showSpinner: true,
      searchData: [],
      extraData: [],
      searchText: '',
      selectedFitment:{}
    }
 
  }

  componentDidMount() {
    this.updateLastFitment();
  }

  componentDidUpdate(prevProps){
      if(this.props.fitmentList.length !== prevProps.fitmentList.length){
        this.updateLastFitment();
      }
  }

  updateLastFitment(){
    let fitments = this.props.fitmentList;
    if(fitments.length !==0){
      let fitment =  fitments[fitments.length-1];
      this.setState({selectedFitment:fitment})
    }else{
      this.setState({selectedFitment:{}})
    }
  }

  onSearchProduct(value, e) {
    this.getSearchProducts(value, e);
  }



  getSearchProducts = (value, e) => {
    this.setState({ searchText: value }, () => {
      if (this.state.searchText.length > 1) {
        if (this.state.searchText.length % 2 === 0) {

          let selectedFitment =  this.state.selectedFitment;
          let fitment =  Object.keys(selectedFitment).length !== 0 ? (selectedFitment.year+selectedFitment.makename+selectedFitment.modelname).replace(' ','').toLowerCase() : "";
          
          let restUrl = `${PRODUCT_BASE_URL}globalsearch/${value}?page=0&fitment=${fitment}`
          serviceCall({}, restUrl, 'GET')
            .then((res) => {
              if (!res.error) {
                this.setState({ searchData: res.data.data, extraData: res.data.extra, showFeaturedProducts: false })
              } else {

              }
            })
            .catch((error) => {
            })
        }

      }

    })

  }

  onSubmitSearch() {
    if (this.state.searchText.length > 1) {
      this.setState({ searchData: [] })
    }
  }


  renderFitmentList=()=>{
    let fitmentData = this.props.fitmentList;
    return(
      <div style={{backgroundColor:'#fff',marginTop:12, width:320}} className="menu-list-btn-item">
        <h3 style={{ color: appTheme.logoTextColor, fontWeight:'600',paddingLeft: 10 }}>
             Your Vehicle
        </h3>
        {fitmentData.length !==0 && fitmentData.map((fitment, index)=>
            <div className='menu-list-item fitment-list' onClick={()=>this.setState({selectedFitment:fitment})}>
              <h4 style={{ color: appTheme.lightColor, fontWeight:'bold', marginBottom: 0  }}>
                  {fitment.year} | {fitment.makename} | {fitment.modelname}
              </h4>
              <Button type="text" danger icon={<DeleteOutlined />} onClick={() => this.props.deleteVechile(index)} />
            </div>
        )}
       
        <div className='menu-list-item' onClick={()=> this.props.addNewFitment()}>
          <h4 style={{ color: appTheme.secondaryColor, fontWeight:'bold' }}>
              <i className="pi pi-plus"  style={{fontWeight:'bold', fontSize:14, marginRight:6}}/> Add Vehicle
          </h4>
        </div>
        
    </div>
    )
  }











  render() {
    const { searchData, searchText, selectedFitment } = this.state;
    let fitment =  Object.keys(selectedFitment).length !== 0 ? selectedFitment.year+selectedFitment.makename+selectedFitment.modelname : "";

    const noData = {
        value: '',
        label: (
          <Link
            onClick={() => this.onSubmitSearch()}
          >
            <h3 style={{ fontSize: 16, fontWeight: '600', textAlign:'center', color:appTheme.logoTextColor }}>No products found.</h3>
          </Link>
        )
      }


    const options = searchData.map((search, index) => {
      return {
        value: `${search.title}`,
        label: (
          <Link
            to={"/productdetails/osku:" + search.osku}
            className="search-list"
            key={index}
            onClick={() => this.onSubmitSearch()}
          >
            <img src={search.image}
              onError={(e) => e.target.src = 'https://dublin.anglican.org/cmsfiles/placeholder.png'}
              alt={search.title} style={{ width: 60,  marginRight: 18 , objectFit:'contain'}} />
            <div>
              <div style={{ fontSize: 16, fontWeight: '600', marginBottom: 0 }}>{search.title}</div>
              <div style={{ fontSize: 14, fontWeight: '400', color: appTheme.dark5 }}>{search.osku}</div>
            </div>
          </Link>
        )
      }
    })

    return (
      <Fragment>
        <AutoComplete
          dropdownMatchSelectWidth={250}
          style={{
            width: '100%'
          }}
         options={searchData.length !== 0 ? [noData] : options}
         //options={options}
          onSearch={(value, e) => this.onSearchProduct(value, e)}
        > 
          <Input size="large" placeholder="Search for Products" className="search-icon"
          addonBefore={
            <Dropdown overlay={this.renderFitmentList()} trigger={['click']}>
              <span onClick={e => e.preventDefault()} style={{fontSize:16,fontWeight:'700',display:'flex', alignItems:'center'}}>
                <CarOutlined style={{fontSize: 22,marginRight:8}}/>
               {Object.keys(selectedFitment).length === 0 ? 'Select your vehicle' : 
               <span>
                 {selectedFitment.year} | {selectedFitment.makename}
              </span> } <DownOutlined style={{fontSize: 14,marginLeft:4,marginTop:6}} />
              </span>
            </Dropdown>
          }
          
          addonAfter={
            (isNotEmpty(searchText)) ?
              <Link
                to={"/search/prd:" + searchText + '?fitment='+fitment}
                onClick={() => this.onSubmitSearch()}
              >
                <SearchOutlined style={{ fontSize: 20, color: '#fff', alignSelf: 'center' }} />
              </Link> :
              <Link>
                <SearchOutlined style={{ fontSize: 20, color: '#fff', alignSelf: 'center' }} />
              </Link>
          } />
        </AutoComplete>
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

  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Search);