import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Route, Router, hashHistory } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import io from 'socket.io-client';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import { setClientId, setState } from './action_creators';
import remoteActionMiddleware from './remote_action_middleware';
import getClientId from './client_id';
import reducer from './reducer';
import { VotingContainer } from './components/Voting';
import { ResultsContainer }from './components/Results';

const location = {
  protocol: 'http',
  hostname: '192.168.0.110'
};

const socket = io(`${location.protocol}://${location.hostname}:8090`);
socket.on('state', state =>
  store.dispatch(setState(state))
);

const createStoreWithMiddleware = applyMiddleware(
  remoteActionMiddleware(socket)
)(createStore);
const store = createStoreWithMiddleware(reducer);
store.dispatch(setClientId(getClientId()));

const routes = <Route component={App}>
  <Route path="/results" component={ResultsContainer} />
  <Route path="/" component={VotingContainer} />
</Route>;

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>{routes}</Router>
  </Provider>,
  document.getElementById('root'));
registerServiceWorker();
