// React
import React from 'react';
import PropTypes from 'prop-types';

// Antd
import { Table, Icon, Popconfirm, Button, Input, Form, Radio, Select, Checkbox, Modal, InputNumber } from 'antd';

// Libs
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import Immutable from 'seamless-immutable';

class Field extends React.PureComponent {
    getText(type, text, options) {
        switch (type) {
            case 'radio':
                return options[text];
            case 'select':
                return text.name;
            case 'edit-multiple':
            case 'select-multiple':
                return text.reduce((acc, item) => (acc === '' ? `${item.name}` : `${acc}, ${item.name}`), '');
            case 'checkbox':
                return text ? 'Sim' : 'Não';
            case 'password':
                return '********';
            default:
                return text;
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

    customField(type, text, id, fieldKey, onUpdate, items, disabled, record, updatedItem) {
        switch (type) {
            case 'email':
            case 'password':
                return (
                    <Input
                      type={type}
                      onChange={(e) => onUpdate(fieldKey, e.target.value)}
                      disabled={disabled(record)}
                    />
                );
            case 'input':
                return (
                    <Input
                      defaultValue={text}
                      onChange={(e) => onUpdate(id, fieldKey, e.target.value)}
                      disabled={disabled(record)}
                    />
                );
            case 'input-number':
                return (
                    <InputNumber
                      min={0}
                      onChange={(value) => onUpdate(id, fieldKey, value)}
                      defaultValue={text}
                    />
                );
            case 'radio':
                return (
                    <Radio.Group
                      defaultValue={text}
                      onChange={(e) => onUpdate(id, fieldKey, e.target.value)}
                      disabled={disabled(record)}
                    >
                        {
                            this.props.options.map((item, index) => (
                                <Radio key={index} value={index}>
                                    {item}
                                </Radio>
                            ))
                        }
                    </Radio.Group>
                );
            case 'select':
                return (
                    <Select
                      defaultValue={text.name}
                      onSelect={(value) => onUpdate(id, fieldKey, items.find(item => item.id === value.split(';')[1]))}
                      disabled={disabled(record)}
                    >
                        {this.renderSelectOption(items)}
                    </Select>
                );
            case 'select-multiple': {
                const collection = updatedItem[fieldKey] === undefined ? text : updatedItem[fieldKey];

                return (
                    <Select
                      mode="multiple"
                      defaultValue={text.map(item => `${item.name};${item.id}`)}
                      onSelect={(value) => onUpdate(id, fieldKey, collection.concat([items.find(item => item.id === value.split(';')[1])]))}
                      onDeselect={(value) => onUpdate(id, fieldKey, collection.filter(item => item.id !== value.split(';')[1]))}
                      disabled={disabled(record)}
                    >
                        {this.renderMultiSelectOption(items)}
                    </Select>
                );
            }
            case 'edit-multiple': {
                const collection = updatedItem[fieldKey] === undefined ? text : updatedItem[fieldKey];

                return (
                    <Select
                      mode="multiple"
                      value={collection.map(item => `${item.name};${item.id}`)}
                      onSelect={(value) => this.props.showModal({
                          ...this.props.modal,
                          'props': {
                              ...items.find(el => el.id === value.split(';')[1])
                          },
                          'collectionKey': fieldKey,
                          id
                      }, [])}
                      onDeselect={(value) => onUpdate(id, fieldKey, collection.filter(item => item.id !== value.split(';')[1]))}
                      disabled={disabled(record)}
                    >
                        {this.renderMultiSelectOption(items, type, collection, this.props.modal, id, fieldKey)}
                    </Select>
                );
            }
            case 'checkbox':
                return (
                    <Checkbox
                      defaultChecked={text}
                      onChange={(e) => onUpdate(id, fieldKey, e.target.checked)}
                      disabled={disabled(record, updatedItem)}
                    />
                );
            default:
                return text;
        }
    }

    renderSelectOption(items) {
        return items.map((item, index) => (
            <Select.Option key={index} value={`${item.name};${item.id}`} >
                {item.name}
            </Select.Option>
        ));
    }

    renderMultiSelectOption(items, type, collection, modal, id, collectionKey) {
        switch (type) {
            case 'edit-multiple':
                return items.map((item, index) => (
                    <Select.Option key={index} value={`${item.name};${item.id}`} >
                        <p className="multi-selection-label">{item.name}</p>
                        <Icon type="edit" onClick={() => this.props.showModal({
                            ...modal,
                            'props': {
                                ...item
                            },
                            id,
                            collectionKey
                        }, collection.find(el => el.id === item.id)[modal.key] || [])}
                        />
                    </Select.Option>
                ));
            default:
                return items.map((item, index) => (
                    <Select.Option key={index} value={`${item.name};${item.id}`} >
                        <p className="multi-selection-label">{item.name}</p>
                    </Select.Option>
                ));
        }
    }

    render() {
        if (!this.props.editable) {
            return (
                <div>
                    {this.getText(this.props.type, this.props.text, this.props.options)}
                </div>
            );
        }

        return (
            <div>
                {this.validationField(
                    this.customField(
                        this.props.type,
                        this.props.text,
                        this.props.id,
                        this.props.fieldKey,
                        this.props.onUpdate,
                        this.props.items,
                        this.props.disabled,
                        this.props.record,
                        this.props.updatedItem),
                    this.props.validation,
                    this.props.error
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
    showModal() {}
};

Field.propTypes = {
    'editable': PropTypes.bool.isRequired,
    'id': PropTypes.string.isRequired,
    'fieldKey': PropTypes.string.isRequired,
    'text': PropTypes.any.isRequired,
    'onUpdate': PropTypes.func.isRequired,
    'type': PropTypes.string.isRequired,
    'record': PropTypes.object.isRequired,
    'updatedItem': PropTypes.object,
    'error': PropTypes.object,
    'validation': PropTypes.bool,
    'options': PropTypes.array,
    'items': PropTypes.array,
    'disabled': PropTypes.func,
    'showModal': PropTypes.func,
    'modal': PropTypes.object
};

export default class ItemsList extends React.Component {
    constructor(props, className) {
        super(props, className);

        this.state = {
            'showModal': false,
            'modal': {},
            'showEditModal': false,
            'selected': { 'id': 0 }
        };

        this.columns = this.buildColumns(this.props.columns);

        // Bind
        this.showModal = this.showModal.bind(this);
        this.insertModalItem = this.insertModalItem.bind(this);
        this.updateModalItem = this.updateModalItem.bind(this);
        this.removeModalItem = this.removeModalItem.bind(this);
        this.updateAllModalItems = this.updateAllModalItems.bind(this);
        this.saveModalItems = this.saveModalItems.bind(this);
        this.cancelModalItems = this.cancelModalItems.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.onEditConfirm = this.onEditConfirm.bind(this);
        this.onEditCancel = this.onEditCancel.bind(this);
    }

    onEditConfirm() {
        const { updatedItems, onUpdate } = this.props;
        const { selected } = this.state;

        if (onUpdate(updatedItems[selected.id], updatedItems, selected)) {
            this.toggleModal();
        }
    }

    onEditCancel() {
        const { updatedItems, onCancel } = this.props;

        onCancel(updatedItems, this.state.selected.id);
        this.toggleModal();
    }

    toggleModal(item) {
        const { showEditModal } = this.state;
        this.setState({
            'showEditModal': !showEditModal,
            'selected': item
        });
    }

    handleEditClick(item) {
        if (this.props.updateComponent) {
            this.toggleModal(item);
        }
        this.props.onEdit(this.props.updatedItems, item);
    }

    // Private Methods
    buildColumns(columns) {
        const _this = this;
        const actionColumns = [{
            'title': 'Ação',
            'key': 'action',
            'render': function actions(text, record, index) {
                const element = _this.props.updatedItems[_this.props.items[index].id] !== undefined ?
                (
                    <span>
                        <span className="ant-divider" />
                        <Popconfirm
                          title="Confirmar edição?"
                          okText="Sim"
                          cancelText="Não"
                          onConfirm={() => _this.props.onUpdate(
                              _this.props.updatedItems[_this.props.items[index].id],
                              _this.props.updatedItems, Immutable.from(_this.props.items[index])
                          )}
                        >
                            <Icon
                              type="check"
                            />
                        </Popconfirm>
                        <Popconfirm
                          title="Deseja realmente cancelar?"
                          okText="Sim"
                          cancelText="Não"
                          onConfirm={() => _this.props.onCancel(_this.props.updatedItems, _this.props.items[index].id)}
                        >
                            <Icon
                              type="close"
                            />
                        </Popconfirm>
                    </span>
                )
                :
                (
                    <span>
                        <Icon
                          onClick={() => _this.handleEditClick(_this.props.items[index])}
                          type="edit"
                        />
                        <span className="ant-divider" />
                        <Popconfirm
                          title="Deseja realmente deletar?"
                          okText="Sim"
                          cancelText="Não"
                          onConfirm={() => _this.props.onRemove(_this.props.items[index].id)}
                        >
                            <Icon
                              type="delete"
                            />
                        </Popconfirm>
                    </span>
                );

                return element;
            }
        }];

        const renderedColumns = columns.reduce((acc, column) => {
            if (column.render === undefined) {
                const onUpdate = this.props.onItemUpdate.bind(this);
                let render = (text, record) => {
                    const editable = _this.props.updatedItems[record.id] !== undefined;
                    const error = editable ?
                        _this.props.updatedItems[record.id].error[column.key]
                        :
                        record.error[column.key];

                    return (
                        <Field
                          editable={editable}
                          id={record.id}
                          text={text}
                          validation={column.validation}
                          error={error}
                          fieldKey={column.key}
                          onUpdate={onUpdate}
                          type={column.type}
                          options={column.options}
                          items={column.items}
                          disabled={column.disabled}
                          record={record}
                          updatedItem={_this.props.updatedItems[record.id]}
                          showModal={_this.showModal}
                          hideModal={_this.hideModal}
                          modal={column.modal}
                        />
                    );
                };

                render = render.bind(this);

                return acc.concat(merge(column, { render, 'dataIndex': column.key }));
            }

            return acc.concat(column);
        }, []);

        return renderedColumns.concat(actionColumns);
    }

    showModal(modal, item) {
        this.setState({ 'showModal': true, modal, 'items': item });
    }

    hideModal() {
        this.setState({ 'showModal': false, 'modal': {} });
    }

    insertModalItem(item) {
        const id = Math.random().toString(36).substring(5);
        const items = this.state.items.concat([Immutable.from(Object.assign({ 'key': id, id, 'error': cloneDeep(this.state.modal.error) }, item))]);

        this.setState({ items });
    }

    removeModalItem(id) {
        const items = this.state.items.filter(item => item.id !== id);

        this.setState({ items });

        return false;
    }

    updateModalItem(item) {
        const items = this.state.items.map(el => {
            if (item.id === el.id) {
                return item;
            }

            return el;
        });

        this.setState({ items });
    }

    updateAllModalItems(items) {
        const updatedItems = {};

        items.forEach(item => {
            updatedItems[items.id] = item;
        });

        const newItems = this.state.items.map(item => {
            if (updatedItems[item.id] !== undefined) {
                return updatedItems[item.id];
            }

            return item;
        });

        this.setState({ 'items': newItems });
    }

    saveModalItems() {
        const item = this.state.modal.props;
        let collection = this.props.updatedItems[this.state.modal.id][this.state.modal.collectionKey] ||
            this.props.items.find(el => el.id === this.state.modal.id)[this.state.modal.collectionKey];

        if (!collection.find(el => el.id === item.id)) {
            collection = collection.concat({ ...item, [this.state.modal.key]: this.state.items });
        } else {
            collection = collection.map(el => {
                if (el.id === item.id) {
                    return { ...item, [this.state.modal.key]: this.state.items };
                }

                return el;
            });
        }

        this.props.onItemUpdate(this.state.modal.id, this.state.modal.collectionKey, Immutable.asMutable(collection));
        this.setState({ 'items': [], 'modal': {}, 'showModal': false });

        return new Promise(resolve => {
            resolve();
        });
    }

    cancelModalItems() {
        this.setState({ 'items': [], 'modal': {}, 'showModal': false });

        return new Promise(resolve => {
            resolve();
        });
    }

    // Render
    render() {
        const {
            onUpdateAll,
            updatedItems,
            onItemUpdate
        } = this.props;

        const Component = this.props.updateComponent;
        const editModal = this.state.selected.id !== 0 && (
            <Modal
              title="Alteração"
              onOk={this.onEditConfirm}
              onCancel={this.onEditCancel}
              visible={this.state.showEditModal}
              okText="Confirmar"
              cancelText="Cancelar"
            >
                <Component
                  onChange={(key, value) => onItemUpdate(this.state.selected.id, key, value)}
                  item={this.props.updatedItems[this.state.selected.id]}
                  error={this.props.updatedItems[this.state.selected.id] ? this.props.updatedItems[this.state.selected.id].error : undefined}
                  editMode
                />
            </Modal>
        );

        return (
            <div className={this.className}>
                {this.state.showModal ?
                    <Modal
                      visible={this.state.showModal}
                      title={this.state.modal.title}
                      width={this.state.modal.width}
                      footer={[
                          <Button key="back" size="large" onClick={this.cancelModalItems}>Cancelar</Button>,
                          <Button key="submit" type="primary" size="large" disabled={this.state.items.length === 0} onClick={this.saveModalItems}>
                          Salvar
                      </Button>
                      ]}
                    >
                        {this.state.modal.render ? this.state.modal.render({
                            'items': this.state.items,
                            'onInsert': this.insertModalItem,
                            'onRemove': this.removeModalItem,
                            'onUpdate': this.updateModalItem,
                            'onUpdateAll': this.updateAllModalItems,
                            ...this.state.modal.props
                        }) : undefined}
                    </Modal>
                    :
                    undefined
                }
                <Table
                  dataSource={Immutable.asMutable(this.props.items, { 'deep': true })}
                  columns={this.columns}
                  locale={{ 'emptyText': '' }}
                />
                <div className="update-all-button">
                    <Popconfirm
                      title="Confirmar edições?"
                      okText="Sim"
                      cancelText="Não"
                      onConfirm={onUpdateAll}
                    >
                        <Button
                          type="primary"
                          disabled={Object.keys(updatedItems).length === 0}
                        >
                            {"Salvar todos"}
                        </Button>
                    </Popconfirm>
                </div>
                {editModal}
            </div>
        );
    }
}

ItemsList.defaultProps = {
    onRemove() {},
    onUpdate() {},
    onUpdateAll() {},
    onEdit() {},
    onCancel() {},
    onItemUpdate() {}
};

ItemsList.propTypes = {
    'items': PropTypes.array.isRequired,
    'updatedItems': PropTypes.object.isRequired,
    'columns': PropTypes.array.isRequired,
    'onUpdate': PropTypes.func,
    'onUpdateAll': PropTypes.func,
    'onRemove': PropTypes.func,
    'onEdit': PropTypes.func,
    'onCancel': PropTypes.func,
    'onItemUpdate': PropTypes.func,
    'updateComponent': PropTypes.func
};
