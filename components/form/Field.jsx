// React
import React from 'react';
import PropTypes from 'prop-types';

// Libs
import moment from 'moment';

// Components
import MaskedInput from './MaskedInput';

// Antd
import { Select, Input, InputNumber, Checkbox, Radio, Form, Switch, Icon, TimePicker, DatePicker } from 'antd';


export default class Field extends React.PureComponent {
    getText(type, value, options) {
        switch (type) {
            case 'radio':
                return options[value];
            case 'select':
                return value;
            case 'select-multiple':
                return value.reduce((acc, item) => (acc === '' ? `${item.name}` : `${acc}, ${item.name}`), '');
            case 'checkbox':
                return value ? 'Sim' : 'Não';
            default:
                return value;
        }
    }

    validationField(field, validation, error) {
        if (validation) {
            return (
                <Form.Item
                  validateStatus={error.validateStatus}
                  help={error.msg}
                >
                    {field}
                </Form.Item>
            );
        }

        return (
            <div>
                {field}
            </div>
        );
    }

    customField(type, value, fieldKey, onChange, item, items, disabled, placeholder) {
        switch (type) {
            case 'date':
                return (
                    <DatePicker
                      value={moment(value, this.props.dateFormat)}
                      format={this.props.dateFormat}
                      onChange={(m, date) => onChange(fieldKey, date)}
                      disabled={disabled(item)}
                      placeholder={placeholder}
                    />
                );
            case 'time':
                return (
                    <TimePicker
                      value={moment(value, this.props.timeFormat)}
                      format={this.props.timeFormat}
                      onChange={(m, time) => onChange(fieldKey, time)}
                      disabled={disabled(item)}
                      placeholder={placeholder}
                    />
                );
            case 'masked-input':
                return (
                    <MaskedInput
                      value={value}
                      onChange={(e) => onChange(fieldKey, e)}
                      disabled={disabled(item)}
                      mask={this.props.mask}
                      placeholder={placeholder}
                    />
                );
            case 'input':
                return (
                    <Input
                      placeholder={placeholder}
                      value={value}
                      onChange={(e) => onChange(fieldKey, e.target.value)}
                      disabled={disabled(item)}
                    />
                );
            case 'switch':
                return (
                    <div className="switch">
                        <p className="bullet">{placeholder}</p>
                        <Switch
                          checked={value}
                          checkedChildren={<Icon type="check" />}
                          unCheckedChildren={<Icon type="cross" />}
                          onChange={(checked) => onChange(fieldKey, checked)}
                          disabled={disabled(item)}
                        />
                    </div>
                );
            case 'text':
            case 'email':
            case 'password':
                return (
                    <Input
                      type={type}
                      placeholder={placeholder}
                      value={value}
                      onChange={(e) => onChange(fieldKey, e.target.value)}
                      disabled={disabled(item)}
                    />
                );
            case 'input-number':
                return (
                    <InputNumber
                      placeholder={placeholder}
                      min={0}
                      onChange={(e) => onChange(fieldKey, e)}
                      value={value}
                    />
                );
            case 'radio':
                return (
                    <Radio.Group
                      value={value}
                      onChange={(e) => onChange(fieldKey, e.target.value)}
                      disabled={disabled(item)}
                    >
                        {
                            this.props.options.map((el, index) => (
                                <Radio key={index} value={index}>
                                    {el}
                                </Radio>
                            ))
                        }
                    </Radio.Group>
                );
            case 'select':
                return (
                    <Select
                      placeholder={placeholder}
                      value={value ? value.name : undefined}
                      onSelect={(e) => onChange(fieldKey, items.find(el => `${el.id}` === e.split(';')[1]))}
                      disabled={disabled(item)}
                    >
                        {this.renderSelectOption(items)}
                    </Select>
                );
            case 'select-multiple': {
                return (
                    <Select
                      placeholder={placeholder}
                      mode="multiple"
                      value={value.map(el => `${el.name};${el.id}`)}
                      onSelect={(e) => onChange(fieldKey, e.concat([items.find(el => `${el.id}` === e.split(';')[1])]))}
                      onDeselect={(e) => onChange(fieldKey, value.filter(el => `${el.id}` !== e.split(';')[1]))}
                      disabled={disabled(item)}
                    >
                        {this.renderMultiSelectOption(items)}
                    </Select>
                );
            }
            case 'checkbox':
                return (
                    <Checkbox
                      defaultChecked={value}
                      onChange={(e) => onChange(fieldKey, e.target.checked)}
                      disabled={disabled(item)}
                    />
                );
            default:
                return value;
        }
    }

    renderSelectOption(items) {
        return items.map((item, index) => (
            <Select.Option key={index} value={`${item.name};${item.id}`} >
                {item.name}
            </Select.Option>
        ));
    }

    renderMultiSelectOption(items) {
        return items.map((item, index) => (
            <Select.Option key={index} value={`${item.name};${item.id}`} >
                <p className="multi-selection-label">{item.name}</p>
            </Select.Option>
        ));
    }

    render() {
        return (
            <div className="field">
                {this.validationField(
                    this.customField(
                        this.props.type,
                        this.props.item[this.props.fieldKey],
                        this.props.fieldKey,
                        this.props.onChange,
                        this.props.item,
                        this.props.items,
                        this.props.disabled,
                        this.props.placeholder),
                    this.props.validation,
                    this.props.error[this.props.fieldKey]
                )
                }
            </div>
        );
    }
}

Field.defaultProps = {
    'validation': false,
    'options': [],
    'items': [],
    disabled() { return false; },
    'timeFormat': 'HH:mm',
    'dateFormat': 'DD/MM/YYYY'
};

Field.propTypes = {
    'type': PropTypes.string.isRequired,
    'fieldKey': PropTypes.string.isRequired,
    'onChange': PropTypes.func.isRequired,
    'item': PropTypes.object.isRequired,
    'error': PropTypes.object.isRequired,
    'placeholder': PropTypes.string,
    'items': PropTypes.array,
    'validation': PropTypes.bool,
    'options': PropTypes.array,
    'disabled': PropTypes.func,
    'timeFormat': PropTypes.string,
    'dateFormat': PropTypes.string
};
