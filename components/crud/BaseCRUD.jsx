// React
import React from 'react';
import PropTypes from 'prop-types';

// Libs
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import omit from 'lodash/omit';


export default class BaseCRUD extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            'updatedItems': {},
            'item': cloneDeep(this.props.item),
            'error': cloneDeep(this.props.error)
        };

        // Bind
        this.onInsert = this.onInsert.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.onUpdateAll = this.onUpdateAll.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onItemUpdate = this.onItemUpdate.bind(this);
    }

    // Private Methods
    onInsert() {
        const { valid, error } = this.props.validate(this.state.item);

        if (valid) {
            this.setState({ 'item': cloneDeep(this.props.item), error });
            this.props.onInsert(this.state.item);
        } else {
            this.setState({ error });
        }
    }

    onUpdate(updatedItem, updatedItems, item) {
        const { valid, error } = this.props.validate(merge(cloneDeep(item), updatedItem));

        if (valid) {
            this.setState({ 'updatedItems': omit(updatedItems, item.id) });
            this.props.onUpdate(merge(merge(item, updatedItem), { error }));
        } else {
            this.setState({
                'updatedItems': merge(updatedItems, { [item.id]: merge(updatedItem, { error }) })
            });
        }
    }

    onEdit(updatedItems, item) {
        const data = this.props.updateComponent ? cloneDeep(item) : { 'error': cloneDeep(item.error) };
        this.setState(merge(updatedItems, { [item.id]: data }));
    }

    onCancel(updatedItems, id) {
        this.setState({ 'updatedItems': omit(updatedItems, id) });
    }

    onChange(key, value) {
        this.setState({ 'item': { ...this.state.item, [key]: value } });
    }

    onItemUpdate(id, key, value) {
        const updatedItems = this.state.updatedItems;
        const updatedItem = merge(this.state.updatedItems[id], { [key]: value });

        updatedItems[id][key] = value;

        this.setState({ 'updatedItems': merge(updatedItems, { [id]: updatedItem }) });
    }

    onUpdateAll() {
        let updatedItems = this.state.updatedItems;
        const items = this.props.items;
        const newItems = items.reduce((acc, item) => {
            const updatedItem = updatedItems[item.id];
            if (updatedItem !== undefined) {
                const { valid, error } = this.props.validate(merge(cloneDeep(item), updatedItem));

                if (valid) {
                    updatedItems = omit(updatedItems, item.id);
                    return acc.concat([merge(merge(item, updatedItem), { error })]);
                }

                updatedItems = merge(updatedItems, { [item.id]: merge(updatedItem, { error }) });
            }

            return acc;
        }, []);

        this.setState({ updatedItems });
        this.props.onUpdateAll(newItems);
    }

    // Render
    render() {
        return (
            <div className={`base-crud ${this.props.className}`}>
                <this.props.insertForm
                  onChange={this.onChange}
                  onInsert={this.onInsert}
                  error={this.state.error}
                  item={this.state.item}
                />
                <this.props.list
                  items={this.props.items}
                  updatedItems={this.state.updatedItems}
                  columns={this.props.columns}
                  onUpdate={this.onUpdate}
                  onUpdateAll={this.onUpdateAll}
                  onRemove={this.props.onRemove}
                  onEdit={this.onEdit}
                  onCancel={this.onCancel}
                  onItemUpdate={this.onItemUpdate}
                  updateComponent={this.props.updateComponent}
                  error={this.state.error}
                />
            </div>
        );
    }
}

BaseCRUD.defaultProps = {
    onInsert() {},
    onRemove() {},
    onUpdate() {},
    onUpdateAll() {},
    validate() {return [true, {}];},
    'item': {},
    'className': ''
};

BaseCRUD.propTypes = {
    'insertForm': PropTypes.func.isRequired,
    'list': PropTypes.func.isRequired,
    'items': PropTypes.array.isRequired,
    'columns': PropTypes.array.isRequired,
    'error': PropTypes.object.isRequired,
    'onInsert': PropTypes.func,
    'onUpdate': PropTypes.func,
    'onUpdateAll': PropTypes.func,
    'onRemove': PropTypes.func,
    'validate': PropTypes.func,
    'item': PropTypes.object,
    'className': PropTypes.string,
    'updateComponent': PropTypes.func
};
