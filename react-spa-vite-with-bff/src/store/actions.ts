import type { ActionDefinitions } from '@bad-hacking/zustand';
import * as api from '~/api';
import type { State, Store } from './core';

async function loadMessages(store: Store) {
  store.update((d) => {
    d.messagesEntity = { status: 'loading', data: undefined };
  });

  try {
    const messages = await api.getMessages();
    store.update((d) => {
      d.messagesEntity = { status: 'loaded', data: messages };
    });
  } catch (error) {
    store.update((d) => {
      d.messagesEntity = { status: 'error', data: undefined };
    });
  }
}

export type Actions = typeof actions;
export const actions = {
  loadMessages,
} satisfies ActionDefinitions<State>;
