// React
import React from 'react';
import PropTypes from 'prop-types';

// Antd
import { Spin } from 'antd';


export default class MainContainer extends React.Component {
    render() {
        return (
            <Spin spinning={this.props.isLoading} size="large">
                <div className={`main-container ${this.props.className}`} style={this.props.style}>
                    {this.props.children}
                </div>
            </Spin>
        );
    }
}

MainContainer.defaulProps = {
    'isLoading': false
};

MainContainer.propTypes = {
    'style': PropTypes.object,
    'children': PropTypes.node,
    'className': PropTypes.string,
    'isLoading': PropTypes.bool
};
