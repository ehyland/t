import type { Duration } from 'dayjs/plugin/duration';

import { duration } from './duration';

function createMutableCacheHeader({
  cacheFor,
  staleFor,
}: {
  cacheFor: Duration;
  staleFor: Duration;
}) {
  return `public, s-maxage=${cacheFor.asSeconds()}, stale-while-revalidate=${staleFor.asSeconds()}`;
}

export const mutableCacheHeader = createMutableCacheHeader({
  cacheFor: duration(1, 'hour'),
  staleFor: duration(7, 'days'),
});
