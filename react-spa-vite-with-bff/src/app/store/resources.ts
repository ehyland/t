import {
  defineResources,
  type InferStateSlice,
} from '@bad-hacking/tanstack-store-extensions';

import { api } from '~/api';

export const resources = defineResources({
  prise: { loader: () => api.prise.query() },
});

export type ResourcesStateSlice = InferStateSlice<typeof resources>;
