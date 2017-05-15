import { List, Map } from 'immutable';
import { expect } from 'chai';

import { setEntries, next, vote, restart } from '../src/core';

describe('application logic', () => {

	describe('setEntries', () => {
		it('adds the entries to the state', () => {
			const state = Map();
			const entries = List.of('Jon Snow', 'Ramsay Snow');
			const nextState = setEntries(state, entries);
			expect(nextState).to.equal(Map({
				entries: List.of('Jon Snow', 'Ramsay Snow'),
				initialEntries: List.of('Jon Snow', 'Ramsay Snow')
			}));
		});

		it('converts to immutable', () => {
			const state = Map();
			const entries = ['Jon Snow', 'Ramsay Snow'];
			const nextState = setEntries(state, entries);
			expect(nextState).to.equal(Map({
				entries: List.of('Jon Snow', 'Ramsay Snow'),
				initialEntries: List.of('Jon Snow', 'Ramsay Snow')
			}));
		});

	});

	describe('restart', () => {

		it('returns to initial entries and takes the first two entries under vote', () => {
			const state = Map({
				vote: Map({
					id: 1,
					pair: List.of('Jon Snow', 'Daenerys Targaryen')
				}),
				entries: List(),
				initialEntries: List.of('Jon Snow', 'Ramsay Snow', 'Daenerys Targaryen')
			});
			const nextState = restart(state);

			expect(nextState).to.equal(Map({
				vote: Map({
					id: 2,
					pair: List.of('Jon Snow', 'Ramsay Snow')
				}),
				entries: List.of('Daenerys Targaryen'),
				initialEntries: List.of('Jon Snow', 'Ramsay Snow', 'Daenerys Targaryen')
			})
			);
		});

	});

	describe('next', () => {

		it('takes the next two entries under vote', () => {
			const state = Map({
				entries: List.of('Jon Snow', 'Ramsay Snow', 'Daenerys Targaryen'),
				initialEntries: List.of('Jon Snow', 'Ramsay Snow', 'Daenerys Targaryen')
			});
			const nextState = next(state);
			expect(nextState).to.equal(Map({
				vote: Map({
					pair: List.of('Jon Snow', 'Ramsay Snow'),
					id: 1
				}),
				entries: List.of('Daenerys Targaryen'),
				initialEntries: List.of('Jon Snow', 'Ramsay Snow', 'Daenerys Targaryen')
			}));
		});

		it('puts winner of current vote back to entries', () => {
			const state = Map({
				vote: Map({
					id: 1,
					pair: List.of('Jon Snow', 'Ramsay Snow'),
					tally: Map({
						'Jon Snow': 4,
						'Ramsay Snow': 2
					})
				}),
				entries: List.of('Daenerys Targaryen', 'Arya Stark', 'Tyrion Lannister'),
				initialEntries: List.of('Jon Snow', 'Ramsay Snow', 'Daenerys Targaryen', 'Arya Stark', 'Tyrion Lannister')
			});
			const nextState = next(state);
			expect(nextState).to.equal(Map({
				vote: Map({
					pair: List.of('Daenerys Targaryen', 'Arya Stark'),
					id: 2
				}),
				entries: List.of('Tyrion Lannister', 'Jon Snow'),
				initialEntries: List.of('Jon Snow', 'Ramsay Snow', 'Daenerys Targaryen', 'Arya Stark', 'Tyrion Lannister')
			}));
		});

		it('puts both from tied vote back to entries', () => {
			const state = Map({
				vote: Map({
					pair: List.of('Jon Snow', 'Ramsay Snow'),
					tally: Map({
						'Jon Snow': 3,
						'Ramsay Snow': 3
					})
				}),
				entries: List.of('Daenerys Targaryen', 'Arya Stark', 'Tyrion Lannister')
			});
			const nextState = next(state);
			expect(nextState).to.equal(Map({
				vote: Map({
					pair: List.of('Daenerys Targaryen', 'Arya Stark'),
					id: 1
				}),
				entries: List.of('Tyrion Lannister', 'Jon Snow', 'Ramsay Snow')
			}));
		});

		it('marks winner when just one entry left', () => {
			const state = Map({
				vote: Map({
					pair: List.of('Jon Snow', 'Ramsay Snow'),
					tally: Map({
						'Jon Snow': 4,
						'Ramsay Snow': 2
					})
				}),
				entries: List()
			});
			const nextState = next(state);
			expect(nextState).to.equal(Map({
				winner: 'Jon Snow'
			}));

		});


		it('increases ID when NEXT', () => {
			const state = Map({
				vote: Map({
					pair: List.of('Jon Snow', 'Ramsay Snow'),
					tally: Map({
						'Jon Snow': 4,
						'Ramsay Snow': 2
					}),
					id: 2
				}),
				entries: List.of('Daenerys Targaryen', 'Arya Stark', 'Tyrion Lannister')
			});
			const nextState = next(state);
			expect(nextState).to.equal(Map({
				vote: Map({
					pair: List.of('Daenerys Targaryen', 'Arya Stark'),
					id: 3
				}),
				entries: List.of('Tyrion Lannister', 'Jon Snow')
			}));
		});
	});

	describe('vote', () => {

		it('creates a tally for the voted entry', () => {
			const state = Map({
				pair: List.of('Jon Snow', 'Ramsay Snow')
			});
			const nextState = vote(state, 'Jon Snow', 'voter1');
			expect(nextState).to.equal(Map({
				pair: List.of('Jon Snow', 'Ramsay Snow'),
				tally: Map({
					'Jon Snow': 1
				}),
				votes: Map({
					voter1: 'Jon Snow'
				})
			}));
		});

		it('adds to existing tally for the voted entry', () => {
			const state = Map({
				pair: List.of('Jon Snow', 'Ramsay Snow'),
				tally: Map({
					'Jon Snow': 3,
					'Ramsay Snow': 2
				})
			});
			const nextState = vote(state, 'Jon Snow', 'voter1');
			expect(nextState).to.equal(Map({
				pair: List.of('Jon Snow', 'Ramsay Snow'),
				tally: Map({
					'Jon Snow': 4,
					'Ramsay Snow': 2
				}),
				votes: Map({
					voter1: 'Jon Snow'
				})
			}));
		});

		it('ignores vote on invalid entry', () => {
			const state = Map({
				pair: List.of('Jon Snow', 'Ramsay Snow'),
				tally: Map({
					'Jon Snow': 3,
					'Ramsay Snow': 2
				})
			});
			const nextState = vote(state, 'Daenerys Targaryen', 'voter1');

			expect(nextState).to.equal(Map({
				pair: List.of('Jon Snow', 'Ramsay Snow'),
				tally: Map({
					'Jon Snow': 3,
					'Ramsay Snow': 2
				})
			}));
		});

		it('nullifies previous vote for the same voter', () => {
			const state = Map({
				id: 1,
				pair: List.of('Jon Snow', 'Ramsay Snow'),
				tally: Map({
					'Jon Snow': 3,
					'Ramsay Snow': 2
				}),
				votes: Map({
					voter1: 'Ramsay Snow'
				})
			});
			const nextState = vote(state, 'Jon Snow', 'voter1');

			expect(nextState).to.equal(Map({
				id: 1,
				pair: List.of('Jon Snow', 'Ramsay Snow'),
				tally: Map({
					'Jon Snow': 4,
					'Ramsay Snow': 1
				}),
				votes: Map({
					voter1: 'Jon Snow'
				})
			}))
		});
	});

});
