import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Boxplot from './Boxplot';

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Boxplot data={[]} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
