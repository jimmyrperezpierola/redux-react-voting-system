import Immutable, { List, Map, fromJS } from 'immutable';
import { expect } from 'chai';

import reducer from '../reducer';

describe('reducer', () => {

  it('handles SET_CLIENT_ID', () => {
    const initialState = Map();
    const action = {
      type: 'SET_CLIENT_ID',
      clientId: '1234'
    };
    const nextState = reducer(initialState, action);

    expect(Immutable.is(nextState, fromJS({
      clientId: '1234'
    })));
  });

  it('handles SET_STATE', () => {
    const initialState = Map();
    const action = {
      type: 'SET_STATE',
      state: Map({
        vote: Map({
          pair: List.of('Jon Snow', 'Ramsay Snow'),
          tally: Map({ 'Jon Snow': 1 })
        })
      })
    };
    const nextState = reducer(initialState, action);

    expect(Immutable.is(nextState, fromJS({
      vote: {
        pair: ['Jon Snow', 'Ramsay Snow'],
        tally: { 'Jon Snow': 1 }
      }
    }))).to.be.true;
  });

  it('handles SET_STATE with plain JS payload', () => {
    const initialState = Map();
    const action = {
      type: 'SET_STATE',
      state: {
        vote: {
          pair: ['Jon Snow', 'Ramsay Snow'],
          tally: { 'Jon Snow': 1 }
        }
      }
    };
    const nextState = reducer(initialState, action);

    expect(Immutable.is(nextState, fromJS({
      vote: {
        pair: ['Jon Snow', 'Ramsay Snow'],
        tally: { 'Jon Snow': 1 }
      }
    }))).to.be.true;
  });

  it('handles SET_STATE withot initial state', () => {
    const initialState = Map();
    const action = {
      type: 'SET_STATE',
      state: {
        vote: {
          pair: ['Jon Snow', 'Ramsay Snow'],
          tally: { 'Jon Snow': 1 }
        }
      }
    };
    const nextState = reducer(undefined, action);

    expect(Immutable.is(nextState, fromJS({
      vote: {
        pair: ['Jon Snow', 'Ramsay Snow'],
        tally: { 'Jon Snow': 1 }
      }
    }))).to.be.true;
  });

  it('handles VOTE by setting myVote', () => {
    const state = fromJS({
      vote: {
        round: 42,
        pair: ['Jon Snow', 'Ramsay Snow'],
        tally: { 'Jon Snow': 1 }
      }
    });
    const action = { type: 'VOTE', entry: 'Jon Snow' };
    const nextState = reducer(state, action);

    expect(Immutable.is(nextState, fromJS({
      vote: {
        round: 42,
        pair: ['Jon Snow', 'Ramsay Snow'],
        tally: { 'Jon Snow': 1 }
      },
      myVote: {
        round: 42,
        entry: 'Jon Snow'
      }
    }))).to.be.true;
  });

  it('does not set myVote for VOTE on invalid entry', () => {
    const state = fromJS({
      vote: {
        round: 42,
        pair: ['Jon Snow', 'Ramsay Snow'],
        tally: { 'Jon Snow': 1 }
      }
    });
    const action = { type: 'VOTE', entry: 'Daenerys Targaryen' };
    const nextState = reducer(state, action);

    expect(Immutable.is(nextState, fromJS({
      vote: {
        round: 42,
        pair: ['Jon Snow', 'Ramsay Snow'],
        tally: { 'Jon Snow': 1 }
      }
    }))).to.be.true;
  });

  it('removes myVote on SET_STATE if pair changes', () => {
    const initialState = fromJS({
      vote: {
        round: 42,
        pair: ['Jon Snow', 'Ramsay Snow'],
        tally: { 'Jon Snow': 1 }
      },
      myVote: {
        round: 42,
        entry: 'Jon Snow'
      }
    });
    const action = {
      type: 'SET_STATE',
      state: {
        vote: {
          round: 43,
          pair: ['Daenerys Targaryen', 'Arya Stark']
        }
      }
    };
    const nextState = reducer(initialState, action);

    expect(Immutable.is(nextState, fromJS({
      vote: {
        round: 43,
        pair: ['Daenerys Targaryen', 'Arya Stark']
      }
    }))).to.be.true;
  });
});