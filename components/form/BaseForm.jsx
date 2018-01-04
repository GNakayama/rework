// React
import React from 'react';
import PropTypes from 'prop-types';

// Libs
import { validate } from './helpers';

// Components
import Field from './Field';

// Antd
import { Button } from 'antd';


export default class BaseForm extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            'error': this.props.error === undefined ?
                Object.keys(props.validation).reduce((acc, el) => ({ ...acc, [el]: {} }), {})
                :
                this.props.error
        };

        // Bind
        this.onConfirm = this.onConfirm.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
    }

    componentWillReceiveProps(next) {
        if (next.error !== undefined) {
            this.setState({ 'error': next.error });
        }
    }

    /* Private Methods */
    onConfirm() {
        const { valid, error } = validate(this.props.item, this.props.validation, this.props.items);

        if (valid) {
            this.props.onConfirm(this.props.item);
        }

        this.props.handleError(error);

        this.setState({ error });
    }

    handleEnter(e) {
        if (e.charCode === 13) {
            this.onConfirm();
        }
    }

    /* Render */
    renderFields(fields) {
        return fields.reduce((acc, el, index) => acc.concat([(
            <Field
              {...el}
              key={index}
              error={this.state.error}
              onChange={this.props.onChange}
              item={this.props.item}
            />)
        ]), []);
    }

    render() {
        return (
            <div className="base-form" onKeyPress={this.handleEnter}>
                {this.renderFields(this.props.fields, this.props.error)}
                {this.props.children}
                {this.props.hideButton ?
                    undefined
                    :
                    (
                        <Button
                          onClick={this.onConfirm}
                          type="primary"
                        >
                            {this.props.buttonText}
                        </Button>
                    )
                }
            </div>
        );
    }
}

BaseForm.defaultProps = {
    'buttonText': 'Insert',
    handleError() {},
    'fields': [],
    'hideButton': false,
    'items': []
};

BaseForm.propTypes = {
    'onChange': PropTypes.func.isRequired,
    'validation': PropTypes.object.isRequired,
    'item': PropTypes.object.isRequired,
    'onConfirm': PropTypes.func,
    'fields': PropTypes.array,
    'children': PropTypes.node,
    'handleError': PropTypes.func,
    'buttonText': PropTypes.string,
    'hideButton': PropTypes.bool,
    'mask': PropTypes.string,
    'items': PropTypes.array
};
