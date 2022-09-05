import { App } from './App';
import { queryAllByRole, render, screen } from 'test-utils';

const START_DATE = new Date('2022-09-04T02:00:00.000Z');

jest.useFakeTimers({ now: START_DATE });

describe('<App />', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('renders the date node', () => {
    expect(screen.getByTestId('date')).toBeInTheDocument();
  });

  it('renders the date', () => {
    expect(screen.getByTestId('date').textContent).toEqual(
      '2022-09-04T02:00:00.000Z'
    );
  });
});
