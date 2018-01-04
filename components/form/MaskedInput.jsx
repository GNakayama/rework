// React
import React from 'react';
import PropTypes from 'prop-types';

// Antd
import { Input } from 'antd';


export default class MaskedInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            'input': props.value
        };

        this.maxInputSize = (this.props.mask.match(/x/g) || []).length;
        this.optionalInputSize = (this.props.mask.match(/\?/g) || []).length;
    }

    // Lifecycle methods
    componentWillReceiveProps(nextProps) {
        this.setState({ 'input': nextProps.value });
    }

    // Private Methods
    onKeyDown(e) {
        if (this.isSpecialKey(e)) {
            return;
        }

        let input = this.state.input || '';

        if (e.key === 'Backspace') {
            input = input.slice(0, -1);
            this.props.onChange(input);
        } else if ((+e.key) >= 0 || (+e.key) <= 9) {
            this.setCaretPosition(e.target, 0);
            if (input.length < this.maxInputSize + this.optionalInputSize) {
                input = input + e.key;
            }

            this.props.onChange(input);
        } else {
            e.preventDefault();
        }

        console.log(e.target);
    }

    setCaretPosition(elem, caretPos) {
        if (elem !== null) {
            if (elem.createTextRange) {
                const range = elem.createTextRange();
                range.move('character', caretPos);
                range.select();
            } else {
                if (elem.selectionStart) {
                    elem.focus();
                    elem.setSelectionRange(caretPos, caretPos);
                } else {
                    elem.focus();
                }
            }
        }
    }

    isSpecialKey(e) {
        return (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey);
    }

    applyMask(mask, input) {
        let [i, j] = [0, 0, 0];
        let value = '';

        while (i < mask.length) {
            if (mask[i] === 'x') {
                if (j < input.length) {
                    value += input[j];
                    j++;
                } else {
                    value += ' ';
                }
            } else if (mask[i] === '?') {
                if (input.length > this.maxInputSize && j < input.length) {
                    value += input[j];
                    j++;
                }
            } else {
                value += mask[i];
            }
            i++;
        }

        return value;
    }

    render() {
        const value = this.state.input === undefined ? undefined : this.applyMask(this.props.mask, this.state.input);

        return (
            <Input
              onKeyDown={(e) => this.onKeyDown(e)}
              placeholder={this.props.placeholder}
              value={this.state.input === '' ? undefined : value}
              disabled={this.props.disabled}
            />
       );
    }
}

MaskedInput.defaultProps = {
    onChange() {},
    'disabled': false,
    'placeholder': ''
};

MaskedInput.propTypes = {
    'mask': PropTypes.string.isRequired,
    'value': PropTypes.string.isRequired,
    'placeholder': PropTypes.string,
    'onChange': PropTypes.func,
    'disabled': PropTypes.bool
};
