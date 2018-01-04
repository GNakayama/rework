// React
import React from 'react';

// Redux
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

// Components
import App from './App';

// Libs
import Translate from '~/framework/libs/translate';
import Cookies from '~/framework/libs/cookies';

function isLoggedIn() {
    return Cookies.getCookie('Session') !== undefined;
}

const mapStateToProps = (state) => ({
    'isLoading': state.isLoading,
    'isLoggedIn': state.isLoggedIn,
    'dict': new Translate(state.languageDict)
});

export default function appContainer(className, title, moduleStore, Module, redirectPath = '/', shouldBeLoggedIn = false) {
    const Container = connect(
        mapStateToProps
    )((props) => (
        <App
          className={className}
          title={title}
          redirectPath={redirectPath}
          shouldBeLoggedIn={shouldBeLoggedIn}
          {...props}
        >
            <Module />
        </App>
    ));

    const store = createStore(
        moduleStore,
        { 'isLoggedIn': isLoggedIn() },
        applyMiddleware(
            thunkMiddleware
        )
    );

    return (
        <Provider store={store}>
            <Container />
        </Provider>
    );
}
