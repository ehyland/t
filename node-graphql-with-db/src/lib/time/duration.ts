import dayjs from "dayjs";
import durationPlugin from "dayjs/plugin/duration.js";

dayjs.extend(durationPlugin);

export const duration = dayjs.duration;
