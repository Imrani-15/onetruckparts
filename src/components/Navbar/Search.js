import React,{Component,Fragment} from 'react';
import {connect} from "react-redux";
import {Select, Empty, Skeleton  } from 'antd';
import {
    SearchOutlined
  } from '@ant-design/icons';
import {isNotEmpty} from '../../utils/Utils';







const { Option } = Select;


  


class Search extends Component {

    constructor(props){
        super(props)
        this.state = {
            showSpinner:true,
            searchData:[],
            getAllProducts:[]
        }
    }
    componentDidMount() {
     

    }


    SearchFilterFunction = (text) => {
        this.setState({ search: text,showSpinner:true })
        if (text && text.length > 2){
          text =  this.state.search;
          let searchproduct = this.state.getAllProducts.filter((obj) => {
            return (obj.searchtag.toLowerCase().indexOf(text.toLowerCase()) > -1 )
          })
          this.setState({ searchData: searchproduct ,showSpinner:false,search:text})
        } else {
          this.setState({ searchData: [],showSpinner:true })
        }
      }

    openProductDetail=(value)=>{
    //  this.props.navProps.push('/productdetails/id:'+ value, {selectedId:value})
    }

      

   

    
    
   
    render(){
        const {searchData,showSpinner} = this.state;
        return(
            <Fragment>
               <Select
                  showSearch
                  allowClear={true}
                  style={{ width: '98%' }}
                  size="large"
                  placeholder="Search for Products"
                  optionFilterProp="children"
                  notFoundContent={showSpinner ? <div/> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                  suffixIcon={<SearchOutlined/>}
                  onSearch={this.SearchFilterFunction}
                  onChange={this.openProductDetail}
                >
                 {searchData.map((item)=>(
                      <Option key={item.id} value={item.id}>
                           {!isNotEmpty(item.prdimg) ? 
                                <Skeleton.Image style={{height:40,marginRight: 20}}/> :
                                    <img  src={item.prdimg} style={{height:40,marginRight: 20}} />
                            }
                          {item.name}
                       </Option>
                 ))}
                 
                </Select>
                  
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