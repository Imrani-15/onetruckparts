import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import { Input, AutoComplete, Dropdown } from 'antd';

import { SearchOutlined, DownOutlined, CarOutlined } from '@ant-design/icons';
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
      <div style={{backgroundColor:'#fff',marginTop:12}} className="menu-list-btn-item">
        {fitmentData.length !==0 && fitmentData.map((fitment)=>
            <div className='menu-list-item' onClick={()=>this.setState({selectedFitment:fitment})}>
              <h4 style={{ color: appTheme.lightColor }}>
                  {fitment.year} | {fitment.makename} | {fitment.modelname}
              </h4>
            </div>
        )}
        {fitmentData.length ===0 &&
          <div className='menu-list-item' onClick={()=> this.props.addNewFitment()}>
            <h4 style={{ color: appTheme.lightColor }}>
                + Add Vehicle
            </h4>
          </div>
        }
    </div>
    )
  }











  render() {
    const { searchData, searchText, selectedFitment } = this.state;
    let fitment =  Object.keys(selectedFitment).length !== 0 ? selectedFitment.year+selectedFitment.makename+selectedFitment.modelname : "";

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
              alt={search.title} style={{ width: 60, marginRight: 18 }} />
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
          options={options}
          onSearch={(value, e) => this.onSearchProduct(value, e)}
        > 
          <Input size="large" placeholder="Search for Products" className="search-icon"
          addonBefore={
            <Dropdown overlay={this.renderFitmentList()} trigger={['click']}>
              <span onClick={e => e.preventDefault()} style={{fontSize:16,fontWeight:'700',display:'flex', alignItems:'center'}}>
                <CarOutlined style={{fontSize: 20,marginRight:6}}/>
               {Object.keys(selectedFitment).length === 0 ? 'Select Vehicle' : 
               <span>
                 {selectedFitment.year} | {selectedFitment.makename}
              </span> } <DownOutlined style={{fontSize: 16,marginLeft:4,marginTop:5}} />
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