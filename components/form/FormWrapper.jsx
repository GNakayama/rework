// React
import React from 'react';
import PropTypes from 'prop-types';

// Libs
import cloneDeep from 'lodash/cloneDeep';


export default class FormWrapper extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            'item': cloneDeep(props.item)
        };

        // Bind
        this.onChange = this.onChange.bind(this);
    }

    /* Lifecycle methods */
    componentWillReceiveProps(next) {
        if (next.item) {
            this.setState({ 'item': cloneDeep(next.item) });
        }
    }

    /* Private Methods */
    onChange(key, value) {
        const item = { ...this.state.item, [key]: value };

        this.setState({ item });
    }

    /* Render */
    render() {
        const Form = this.props.form;

        return (
            <Form
              item={this.state.item}
              onInsert={this.props.onInsert}
              onChange={this.onChange}
            />
        );
    }
}

FormWrapper.defaultProps = {
    onInsert() {},
    onUpdate() {}
};

FormWrapper.propTypes = {
    'item': PropTypes.object.isRequired,
    'form': PropTypes.func.isRequired,
    'onInsert': PropTypes.func,
    'onUpdate': PropTypes.func
};

