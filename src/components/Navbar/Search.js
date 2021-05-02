import React,{Component,Fragment} from 'react';
import {connect} from "react-redux";
import { Link } from 'react-router-dom';

import {Empty, Input } from 'antd';
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
            getAllProducts:[]
        }
        this.overLayRef = React.createRef();
    }
    componentDidMount() {
     

    }

    onSearchProduct(value,e){
      this.getSearchProducts(value,e);
    }


    onSearchChange = (value,e) => {
        if (value && value.length > 2){
          value =  this.state.search;
          this.getSearchProducts(value,e);
        } else {
          this.setState({ searchData: [],showSpinner:true })
        }
      }

    getSearchProducts=(value,e)=>{
      this.overLayRef.current.toggle(e)
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



    hideOverlay=()=>{
      this.overLayRef.current.hide();
      this.setState({ searchData:[]});
    }

      

   

    
    
   
    render(){
        const {searchData,showSpinner} = this.state;
        return(
            <Fragment>
              <Input.Search 
                 placeholder="Search for Products"  
                style={{ width: '98%' }} 
                size="large"
                enterButton
              //  onChange={(e)=> this.onSearchChange(e.target.value,e)}
                onSearch={(value,e)=> this.onSearchProduct(value,e)}
                />
                <OverlayPanel ref={this.overLayRef}
                  className="p-overlaypanel-search"
                  showCloseIcon={false}>
                    <div>
                    {searchData.length ===0 ?
                       <Empty /> :
                       <ScrollPanel style={{width: '100%', height: '260px'}}>
                         {searchData.map((search,index)=>(
                              <Link 
                                to={"/productdetails/osku:"+ search.osku}
                                className="search-list" 
                                key={index}
                                onClick={(search)=> this.hideOverlay(search)}>
                                    <img src={search.image} 
                                     onError={(e) => e.target.src='https://dublin.anglican.org/cmsfiles/placeholder.png'}
                                    alt={search.title} style={{width:60,marginRight:18}} />
                                  <div>
                                      <div style={{fontSize:16,fontWeight:'600',marginBottom:0}}>{search.title}</div>
                                      <div style={{fontSize:14,fontWeight:'400', color:appTheme.dark5}}>{search.osku}</div>
                                  </div>
                           </Link>
                         ))}
                      </ScrollPanel>
                    }

                    </div>

             </OverlayPanel>
              
                  
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