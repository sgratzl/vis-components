import * as React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Default } from './Boxplot.stories';

describe('it', () => {
  it('renders without crashing', () => {
    render(<Default />);
  });
});
