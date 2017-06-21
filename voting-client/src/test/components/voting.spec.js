import React from 'react';
import ReactDOM from 'react-dom';
import {
  renderIntoDocument,
  scryRenderedDOMComponentsWithTag,
  Simulate
} from 'react-dom/test-utils';
import { List } from 'immutable';
import { Voting } from '../../components/Voting';
import { expect } from 'chai';


describe('Voting', () => {
  it('renders a pair of buttons', () => {
    const component = renderIntoDocument(
      <Voting pair={['Jon Snow', 'Ramsay Snow']} />
    );
    const buttons = scryRenderedDOMComponentsWithTag(
      component, 'button'
    );

    expect(buttons.length).to.equal(2);
    expect(buttons[0].textContent).to.equal('Jon Snow');
    expect(buttons[1].textContent).to.equal('Ramsay Snow');
  });

  it('invokes callback when a button is clicked', () => {
    let votedWith;
    const vote = (entry) => votedWith = entry;

    const component = renderIntoDocument(
      <Voting pair={['Jon Snow', 'Ramsay Snow']}
        vote={vote} />
    );
    const buttons = scryRenderedDOMComponentsWithTag(
      component, 'button'
    );
    Simulate.click(buttons[0]);

    expect(votedWith).to.equal('Jon Snow');
  });

  it('adds label to the voted entry', () => {
    const component = renderIntoDocument(
      <Voting pair={['Jon Snow', 'Ramsay Snow']}
        hasVoted='Jon Snow' />
    );
    const buttons = scryRenderedDOMComponentsWithTag(
      component, 'button'
    );

    expect(buttons[0].textContent).to.contain('Voted');
  });

  it('renders just the winner when there is one', () => {
    const component = renderIntoDocument(
      <Voting winner='Jon Snow' />
    );
    const buttons = scryRenderedDOMComponentsWithTag(
      component, 'button');
    expect(buttons.length).to.equal(0);
    
    const winner = ReactDOM.findDOMNode(component.refs.winner);
    expect(winner).to.be.ok;
    expect(winner.textContent).to.contain('Jon Snow');
  });

  it('renders as a pure component', () => {
    const pair = ['Jon Snow', 'Ramsay Snow'];
    const container = document.createElement('div');
    let component = ReactDOM.render(
      <Voting pair={pair} />,
      container
    );

    let firstButton = scryRenderedDOMComponentsWithTag(
      component, 'button'
    )[0];
    expect(firstButton.textContent).to.equal('Jon Snow');

    pair[0] = 'Daenerys Targaryen';
    component = ReactDOM.render(
      <Voting pair={pair} />,
      container
    );
    firstButton = scryRenderedDOMComponentsWithTag(
      component, 'button'
    )[0];
    expect(firstButton.textContent).to.equal('Jon Snow');
  });

  it('does update DOM when prop changes', () => {
    const pair = List.of('Jon Snow', 'Ramsay Snow');
    const container = document.createElement('div');
    let component = ReactDOM.render(
      <Voting pair={pair} />,
      container
    );

    let firstButton = scryRenderedDOMComponentsWithTag(
      component, 'button'
    )[0];
    expect(firstButton.textContent).to.equal('Jon Snow');

    const newPair = pair.set(0, 'Daenerys Targaryen');
    component = ReactDOM.render(
      <Voting pair={newPair} />,
      container
    );
    firstButton = scryRenderedDOMComponentsWithTag(
      component, 'button'
    )[0];
    expect(firstButton.textContent).to.equal('Daenerys Targaryen');
  });
});