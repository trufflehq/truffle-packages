import { TimeAgo, TimeAgoEn } from "../../deps.ts";

TimeAgo.addDefaultLocale(TimeAgoEn);
export const timeAgo = new TimeAgo("en-US");
