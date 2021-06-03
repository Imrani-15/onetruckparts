import React from 'react'

import { Result } from 'antd';

import OneButton from '../../components/OneButton';

const PageNotFound = (props) => {
    return (
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<OneButton
                onClick={() => props.history.replace('/')}
                buttonLabel={"Go Back"}
                btnSize="large"
                btnShape="round"
                btnBlock={false}
                buttonStyle={{fontSize:16,width: 220,}}
            />}
        />
    )
}

export default PageNotFound