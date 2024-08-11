import dayjs from 'dayjs';
import durationPlugin, { type DurationUnitType } from 'dayjs/plugin/duration';

dayjs.extend(durationPlugin);

export function howManySeconds(fromAmount: number, fromUnit: DurationUnitType) {
  return dayjs.duration(fromAmount, fromUnit).asSeconds();
}
