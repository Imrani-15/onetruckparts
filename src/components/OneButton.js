import React from 'react';

import { Button } from 'antd';
import {appTheme} from '../utils/Constants';

 
const OneButton = ({btnType="primary", btnShape="",btnSize="", buttonLabel, buttonStyle, onClick, btnBlock=true}) => {
        let defaultStyle = {backgroundColor:appTheme.primaryColor, borderColor: appTheme.primaryColor, fontWeight: '500', }
        let updateStyle = buttonStyle ? buttonStyle : {}
        return (
            <Button type={btnType} shape={btnShape} size={btnSize}  onClick={onClick} style={{...defaultStyle, ...updateStyle}} block={btnBlock}>
                {buttonLabel}
            </Button>
        )
     }

 
 
 
export default OneButton;
 

