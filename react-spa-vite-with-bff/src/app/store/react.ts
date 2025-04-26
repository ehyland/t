import { createReactHooks } from '@bad-hacking/tanstack-store-extensions';

import { type Actions, actions } from './actions';
import type { State } from './core';

export const { StoreProvider, useActions, useSelector, useStore } =
  createReactHooks<State, Actions>(() => actions);
