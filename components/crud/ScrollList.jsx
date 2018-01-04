// React
import React from 'react';
import PropTypes from 'prop-types';


export default class ScrollList extends React.Component {
    constructor(props) {
        super(props);

        // Bind
        this.onUpdate = this.onUpdate.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onEdit = this.onEdit.bind(this);
    }

    // Private Methods
    onUpdate(item) {
        const { updatedItems, onUpdate } = this.props;

        onUpdate(updatedItems[item.id], updatedItems, item);
    }

    onCancel(id) {
        this.props.onCancel(this.props.updatedItems, id);
    }

    onEdit(item) {
        this.props.onEdit(this.props.updatedItems, item);
    }

    // Render
    render() {
        const items = this.props.items.reduce((acc, el, index) => acc.concat([
            (<li key={index}>
                <this.props.view
                  {...this.props}
                  item={el}
                  updatedItem={{ ...el, ...this.props.updatedItems[el.id] }}
                  onCancel={this.onCancel}
                  onEdit={this.onEdit}
                  onUpdate={this.onUpdate}
                  editable={this.props.updatedItems[el.id] !== undefined}
                />
            </li>)
        ]), []);

        return (
            <div className="scroll-list">
                <ul>
                    {items}
                </ul>
            </div>
        );
    }
}

ScrollList.defaultProps = {
    onRemove() {},
    onUpdate() {},
    onEdit() {},
    onCancel() {}
};

ScrollList.propTypes = {
    'items': PropTypes.array.isRequired,
    'updatedItems': PropTypes.object.isRequired,
    'view': PropTypes.func.isRequired,
    'onUpdate': PropTypes.func,
    'onRemove': PropTypes.func,
    'onEdit': PropTypes.func,
    'onCancel': PropTypes.func
};
