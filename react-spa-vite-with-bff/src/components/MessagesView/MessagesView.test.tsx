import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { actions } from '~/store/actions';
import { getInitialState } from '~/store/core';
import { StoreProvider } from '~/store/react';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { MessagesView } from './MessagesView';

vi.mock('~/store/actions');

vi.mocked(actions).loadMessages.mockImplementation((store) => {
  store.update((d) => {
    d.messagesEntity = {
      status: 'loaded',
      data: [{ message: 'hello tester' }],
    };
  });
});

describe('<MessagesView/>', () => {
  it('displayed loaded messages', async () => {
    render(<MessagesView />, {
      wrapper: ({ children }) => (
        <StoreProvider initialState={getInitialState()}>
          <ThemeProvider>{children}</ThemeProvider>
        </StoreProvider>
      ),
    });

    expect(screen.getByText('hello tester')).toBeVisible();
  });
});
