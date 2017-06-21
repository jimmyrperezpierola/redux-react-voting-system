import React from 'react';
import ReactDOM from 'react-dom';
import {
  renderIntoDocument,
  scryRenderedDOMComponentsWithClass,
  Simulate
} from 'react-dom/test-utils';
import { List, Map } from 'immutable';
import { Results } from '../../components/Results';
import { expect } from 'chai';

describe('Results', () => {
  it('renders entries with vote counts or zero', () => {
    const pair = List.of('Jon Snow', 'Ramsay Snow');
    const tally = Map({ 'Jon Snow': 5 });
    const component = renderIntoDocument(
      <Results pair={pair} tally={tally} />
    );
    const entries = scryRenderedDOMComponentsWithClass(
      component, 'entry'
    );
    const [jon, ramsay] = entries.map(e => e.textContent);

    expect(entries.length).to.equal(2);
    expect(jon).to.contain('Jon Snow');
    expect(jon).to.contain('5');
    expect(ramsay).to.contain('Ramsay Snow');
    expect(ramsay).to.contain('0');
  });

  it('invokes the next callbak when next button is clicked', () => {
    let nextInvoked = false;
    const next = () => nextInvoked = true;

    const pair = List.of('Jon Snow', 'Ramsay Snow');
    const component = renderIntoDocument(
      <Results pair={pair}
        tally={Map()}
        next={next} />
    );
    Simulate.click(ReactDOM.findDOMNode(component.refs.next));

    expect(nextInvoked).to.equal(true);
  });

  it('renders the winner when there is one', () => {
    const component = renderIntoDocument(
      <Results winner='Jon Snow'
        pair={['Jon Snow', 'Ramsay Snow']}
        tally={Map()} />
    );
    const winner = ReactDOM.findDOMNode(component.refs.winner);
    expect(winner).to.be.ok;
    expect(winner.textContent).to.contain('Jon Snow');
  });

  it('invokes action callback when restart button is clicked', () => {
    let restartInvoked = false;
    const pair = List.of('Jon Snow', 'Ramsay Snow');
    const component = renderIntoDocument(
      <Results pair={pair}
        tally={Map()}
        restart={() => restartInvoked = true} />
    );
    Simulate.click(ReactDOM.findDOMNode(component.refs.restart));
    expect(restartInvoked).to.equal(true);
  });
});