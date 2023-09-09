import durationPlugin from 'dayjs/plugin/duration.js';
import dayjs from 'dayjs';

dayjs.extend(durationPlugin);

export const duration = dayjs.duration;
