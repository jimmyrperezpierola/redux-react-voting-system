import { Map, fromJS } from 'immutable';
import { expect } from 'chai';

import reducer from '../src/reducer';

describe('reducer', () => {

	it('has not an initial state', () => {
		const action = { type: 'SET_ENTRIES', entries: ['Jon Snow'] };
		const nextState = reducer(undefined, action);
		expect(nextState).to.equal(fromJS({
			entries: ['Jon Snow'],
			initialEntries: ['Jon Snow']
		}));
	});

	it('handles SET_ENTRIES', () => {
		const initialState = Map();
		const action = { type: 'SET_ENTRIES', entries: ['Jon Snow'] };
		const nextState = reducer(initialState, action);

		expect(nextState).to.equal(fromJS({
			entries: ['Jon Snow'],
			initialEntries: ['Jon Snow']
		}));
	});

	it('handles RESTART', () => {
		const initialState = fromJS({
			vote: {
				id: 1,
				pair: ['Jon Snow', 'Ramsay Snow']
			},
			entries: ['Daenerys Targaryen'],
			initialEntries: ['Arya Stark', 'Jon Snow', 'Ramsay Snow', 'Daenerys Targaryen']
		});
		const action = { type: 'RESTART' }
		const nextState = reducer(initialState, action);
		expect(nextState).to.equal(fromJS({
			vote: {
				id: 2,
				pair: ['Arya Stark', 'Jon Snow']
			},
			entries: ['Ramsay Snow', 'Daenerys Targaryen'],
			initialEntries: ['Arya Stark', 'Jon Snow', 'Ramsay Snow', 'Daenerys Targaryen']
		}));
	});

	it('handles NEXT', () => {
		const initialState = fromJS({
			entries: ['Jon Snow', 'Ramsay Snow']
		});
		const action = { type: 'NEXT' };
		const nextState = reducer(initialState, action);

		expect(nextState).to.equal(fromJS({
			vote: {
				pair: ['Jon Snow', 'Ramsay Snow'],
				id: 1
			},
			entries: []
		}));
	});

	it('handles VOTE', () => {
		const initialState = fromJS({
			vote: {
				pair: ['Jon Snow', 'Ramsay Snow']
			},
			entries: []
		});
		const action = { type: 'VOTE', entry: 'Jon Snow', clientId: 'voter1' };
		const nextState = reducer(initialState, action);

		expect(nextState).to.equal(fromJS({
			vote: {
				pair: ['Jon Snow', 'Ramsay Snow'],
				tally: { 'Jon Snow': 1 },
				votes: {
					voter1: 'Jon Snow'
				}
			},
			entries: []
		}));
	});

	it('can be used with reduce', () => {
		const actions = [
			{ type: 'SET_ENTRIES', entries: ['Jon Snow', 'Ramsay Snow'] },
			{ type: 'NEXT' },
			{ type: 'VOTE', entry: 'Jon Snow', clientId: 'voter1' },
			{ type: 'VOTE', entry: 'Ramsay Snow', clientId: 'voter1' },
			{ type: 'VOTE', entry: 'Jon Snow', clientId: 'voter1' },
			{ type: 'NEXT' }
		];
		const finalState = actions.reduce(reducer, Map());

		expect(finalState).to.equal(fromJS({
			winner: 'Jon Snow',
			initialEntries: ['Jon Snow', 'Ramsay Snow']
		}));
	});

});
