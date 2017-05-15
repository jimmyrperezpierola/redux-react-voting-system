import { List, Map } from 'immutable';

export const INITIAL_STATE = Map();

export function setEntries(state, entries) {
	const list = List(entries);
	return state.set('entries', list)
		.set('initialEntries', list);
}

export function restart(state) {
	const id = state.getIn(['vote', 'id'], 0);
	return next(
		setEntries(state, state.get('initialEntries'))
			.remove('winner')
			.remove('vote'), id
	);
}

function getWinner(vote) {
	if (!vote) return [];
	const [a, b] = vote.get('pair');
	const aVotes = vote.getIn(['tally', a], 0);
	const bVotes = vote.getIn(['tally', b], 0);
	if (aVotes > bVotes) return [a];
	else if (bVotes > aVotes) return [b];
	else return [a, b];
}

export function next(state, id = state.getIn(['vote', 'id'], 0)) {
	const entries = state.get('entries')
		.concat(getWinner(state.get('vote')));
	if (entries.size === 1) {
		return state.remove('vote')
			.remove('entries')
			.set('winner', entries.first());
	} else {
		return state.merge({
			vote: Map({
				pair: entries.take(2),
				id: id + 1
			}),
			entries: entries.skip(2)
		});
	}
}

function removePreviousVote(voteState, voter) {
	const previousVote = voteState.getIn(['votes', voter]);
	if (previousVote) {
		return voteState.updateIn(['tally', previousVote], t => t - 1)
			.removeIn(['votes', voter]);
	} else {
		return voteState;
	}
}

function addVote(voteState, entry, voter) {
	if (voteState.get('pair').includes(entry)) {
		return voteState.updateIn(['tally', entry], 0, t => t + 1)
			.setIn(['votes', voter], entry);
	} else {
		return voteState;
	}
}

export function vote(voteState, entry, voter) {
	return addVote(
		removePreviousVote(voteState, voter),
		entry,
		voter
	);
}
