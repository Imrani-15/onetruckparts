import React,{Component,Fragment} from 'react';
import {connect} from "react-redux";
import { Link } from 'react-router-dom';

import {Empty, Input, AutoComplete  } from 'antd';

import { SearchOutlined } from '@ant-design/icons';
import { ScrollPanel } from 'primereact/scrollpanel';
import { OverlayPanel } from 'primereact/overlaypanel';
import serviceCall from '../../utils/Services';

import {PRODUCT_BASE_URL, appTheme} from '../../utils/Constants';

import '../Navbar/Navbar.css'

class Search extends Component {

    constructor(props){
        super(props)
        this.state = {
            showSpinner:true,
            searchData:[],
            searchText:'',
        }
        this.overLayRef = React.createRef();
    }
    componentDidMount() {
     

    }

    onSearchProduct(value,e){
      this.getSearchProducts(value,e);
    }


  
    getSearchProducts=(value,e)=>{
      this.setState({searchText:value},()=>{
        if(this.state.searchText.length >= 2){
          let restUrl = `${PRODUCT_BASE_URL}globalsearch/${value}?page=1`
          serviceCall({}, restUrl, 'GET')
              .then((res) => {
                  if (!res.error) {
                      this.setState({ searchData: res.data.data,showFeaturedProducts:false })
                  } else {
    
                  }
              })
              .catch((error) => {
              })
        }

      })
    
    }




      

   

    
    
   
    render(){
        const {searchData,searchText} = this.state;
        const options = searchData.map((search,index)=>{
                return {
                  value: `${search.title}`,
                  label:(
                        <Link 
                                to={"/productdetails/osku:"+ search.osku}
                                className="search-list" 
                                key={index}
                                >
                                    <img src={search.image} 
                                     onError={(e) => e.target.src='https://dublin.anglican.org/cmsfiles/placeholder.png'}
                                    alt={search.title} style={{width:60,marginRight:18}} />
                                  <div>
                                      <div style={{fontSize:16,fontWeight:'600',marginBottom:0}}>{search.title}</div>
                                      <div style={{fontSize:14,fontWeight:'400', color:appTheme.dark5}}>{search.osku}</div>
                                  </div>
                           </Link>
                  )
                }
        })
        return(
            <Fragment>
                 <AutoComplete
                    dropdownMatchSelectWidth={250}
                    style={{
                      width: '100%'
                    }}
                    options={options}
                    onSearch={(value,e)=> this.onSearchProduct(value,e)}
                  >
                    <Input size="large"  placeholder="Search for Products" className="search-icon"    addonAfter={
                     <Link
                     to={"/search/prd:"+ searchText}
                     onClick={()=> this.setState({searchData:[]})}
                     >
                        <SearchOutlined style={{fontSize:20, color:'#fff',alignSelf:'center'}}/>
                     </Link>
                    }  />
                  </AutoComplete>
            </Fragment>
        )
    }
}

function mapStateToProps(state) {
    return {
      
    }
}
function mapDispatchToProps(dispatch){
    return {
       
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Search);