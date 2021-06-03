import React, { Fragment } from 'react';

import { connect } from "react-redux";
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from "primereact/inputtext";
import { OrderList } from 'primereact/orderlist';



import OneButton from '../../components/OneButton';
import serviceCall from '../../utils/Services';

import { PRODUCT_BASE_URL, appTheme, sectionTypes } from '../../utils/Constants';


import { appStore } from '../../App';

import './HomeSettings.css'

class HomeSettings extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            homeItems: [],
            addNewItem: false,
            scrollOptions: [
                { label: 'Scroll', value: 'scroll' },
                { label: 'Grid', value: 'grid' }
            ],
            gridBlockOptions: [
                { label: 'Product', value: 'product' },
                { label: 'Html', value: 'html' }
            ],
            selectedScrollType: 'scroll',
            selectedBlockType: '',
            isCategory: false
        }

    }

    componentWillMount() {
        this.getProductsByCategory();
    }




    getProductsByCategory = () => {
        let restUrl = `${PRODUCT_BASE_URL}prod/homesettings`
        serviceCall({}, restUrl, 'GET')
            .then((res) => {
                if (!res.error) {
                    this.setState({ homeItems: JSON.parse(res.data.data) })
                } else {

                }
            })
            .catch((error) => {
            })
    }

    closeDialog = () => {
        this.setState({ addNewItem: false })
    }



    itemTemplate(item, index) {
        return (
            <div>
                <h3>Scroll Type : {item.sectionType}</h3>
                <h5 className="p-mt-2">List Heading : {item.heading}</h5>
                <h5 className="p-mt-2">List Category : {item.category}</h5>
            </div>
        );
    }


    render() {
        const { homeItems, addNewItem, scrollOptions, selectedScrollType, isCategory, gridBlockOptions, selectedBlockType } = this.state;
        return (
            <Fragment>
                <div style={{ padding: 10, margin: '4%' }}>
                    <div style={{ fontSize: 34, fontWeight: '600', marginBottom: 12 }}>
                        Settings
                        </div>
                    <OrderList value={homeItems}
                        header={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2>List of Items</h2>
                                <OneButton
                                    onClick={() => this.setState({ addNewItem: true })}
                                    buttonLabel={"Add New Item"}
                                    btnSize="large"
                                    buttonStyle={{
                                        fontSize: 16, backgroundColor: appTheme.logoTextColor,
                                        borderColor: appTheme.logoTextColor, width: 200, height: 40

                                    }}
                                />
                            </div>
                        }
                        dragdrop listStyle={{ height: 'auto' }}
                        itemTemplate={this.itemTemplate.bind(this)} onChange={(e) => this.setState({ homeItems: e.value })}></OrderList>

                    <Dialog visible={addNewItem} style={{ width: '80%' }} header="Add New Item"
                        onHide={() => this.closeDialog()} modal>
                        <div className="p-fluid p-formgrid p-d-flex">
                            <div className="p-field p-col">
                                <label htmlFor="scrollType">Section Type</label>
                                <Dropdown inputId="state" value={selectedScrollType} options={scrollOptions}
                                    onChange={(e) => this.setState({ selectedScrollType: e.value })} placeholder="Select scroll Type" />
                            </div>
                            <div className="p-field p-col">
                                {selectedScrollType === sectionTypes.SCROLL ?
                                    <div className="p-field-checkbox p-ai-center p-jc-center p-mt-5">
                                        <Checkbox inputId="binary" checked={isCategory} onChange={e => this.setState({ isCategory: e.checked })} />
                                        <label htmlFor="binary">Is Category ?</label>
                                    </div> :
                                    <div className="p-field">
                                        <label htmlFor="scrollType">Block Type</label>
                                        <Dropdown inputId="state" value={selectedBlockType} options={gridBlockOptions}
                                            onChange={(e) => this.setState({ selectedBlockType: e.value })} placeholder="Select scroll Type" />
                                    </div>}
                            </div>
                        </div>
                        <div className="p-fluid p-formgrid p-d-flex">
                            {isCategory ?
                            <div className="p-field p-col">
                                <label htmlFor="scrollType">Section Type</label>
                                <Dropdown inputId="state" value={selectedScrollType} options={scrollOptions}
                                    onChange={(e) => this.setState({ selectedScrollType: e.value })} placeholder="Select scroll Type" />
                            </div> :
                            <div className="p-field p-col">
                            <label htmlFor="scrollType">Section Type</label>
                            <Dropdown inputId="state" value={selectedScrollType} options={scrollOptions}
                                onChange={(e) => this.setState({ selectedScrollType: e.value })} placeholder="Select scroll Type" />
                        </div>}
                            <div className="p-field p-col">
                                {selectedScrollType === sectionTypes.SCROLL ?
                                    <div className="p-field-checkbox p-ai-center p-jc-center p-mt-5">
                                        <Checkbox inputId="binary" checked={isCategory} onChange={e => this.setState({ isCategory: e.checked })} />
                                        <label htmlFor="binary">Is Category ?</label>
                                    </div> :
                                    <div className="p-field">
                                        <label htmlFor="scrollType">Block Type</label>
                                        <Dropdown inputId="state" value={selectedBlockType} options={gridBlockOptions}
                                            onChange={(e) => this.setState({ selectedBlockType: e.value })} placeholder="Select scroll Type" />
                                    </div>}
                            </div>
                        </div>

                    </Dialog>
                </div>

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
export default connect(mapStateToProps, mapDispatchToProps)(HomeSettings);

