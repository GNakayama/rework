// React
import React from 'react';
import PropTypes from 'prop-types';

// Libs
import Cookies from '../libs/cookies';

// Components
import MainContainer from '~/framework/components/MainContainer';


export default class App extends React.Component {
    constructor(props) {
        super(props);
        document.title = this.props.title;
    }

    /* Lifecycle Methods */
    componentWillUpdate(nextProps) {
        if (!nextProps.isLoggedIn) {
            Cookies.remove('Session');
        }
    }

    componentDidUpdate() {
        this.shouldRedirect();
    }

    /* Private Methods */
    shouldRedirect() {
        if (this.props.shouldBeLoggedIn !== this.isLoggedIn()) {
            window.location.href = this.props.redirectPath;
        }

        if (this.props.shouldBeLoggedIn !== this.props.isLoggedIn) {
            window.location.href = this.props.redirectPath;
        }
    }

    isLoggedIn() {
        return Cookies.getCookie('Session') !== undefined;
    }

    render() {
        this.shouldRedirect();

        if (this.props.shouldBeLoggedIn !== this.props.isLoggedIn ||
            this.props.shouldBeLoggedIn !== this.isLoggedIn()) {
            return (
                <div></div>
            );
        }

        return (
            <MainContainer
              className={this.props.className}
              isLoading={this.props.isLoading}
            >
                {this.props.children}
            </MainContainer>
        );
    }
}

App.defaultProps = {
    'title': '',
    'isLoading': false,
    'isLoggedIn': false,
    'shouldBeLoggedIn': false,
    'redirectPath': '/'
};

App.propTypes = {
    'dict': PropTypes.object.isRequired,
    'children': PropTypes.node,
    'title': PropTypes.string,
    'isLoading': PropTypes.bool,
    'isLoggedIn': PropTypes.bool,
    'shouldBeLoggedIn': PropTypes.bool,
    'redirectPath': PropTypes.string,
    'className': PropTypes.string
};
