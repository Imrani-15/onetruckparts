import React from 'react';

import { Button } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import {appTheme} from '../utils/Constants';

 
const OneButton = ({btnType="primary", btnShape="",btnSize="", buttonLabel, buttonStyle, onClick, btnBlock=true, btnDisabled=false,showIcon=false}) => {
        let defaultStyle = {backgroundColor:(btnDisabled) ? appTheme.dark7 : appTheme.secondaryColor, 
                            borderColor: appTheme.secondaryColor, fontWeight: '500', color:'#fff'}
        let updateStyle = buttonStyle ? buttonStyle : {};

        return (
            <Button type={btnType} shape={btnShape} size={btnSize} icon={(showIcon) ? <GoogleOutlined /> : null}
            onClick={onClick} style={{...defaultStyle, ...updateStyle}} block={btnBlock}
            disabled={btnDisabled}
            >
                {buttonLabel}
            </Button>
        )
     }

 
 
 
export default OneButton;
 

