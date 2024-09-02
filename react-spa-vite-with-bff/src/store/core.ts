import type { EnhancedStore } from '@bad-hacking/zustand';
import type { Messages } from '~/api';

export type State = {
  messagesEntity:
    | { status: 'initial' | 'loading' | 'error'; data: undefined }
    | { status: 'loaded'; data: Messages };
};

export const getInitialState = (): State => ({
  messagesEntity: { status: 'initial', data: undefined },
});

export type Store = EnhancedStore<State>;
