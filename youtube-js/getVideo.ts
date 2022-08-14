import { Innertube } from "./index.js"

const yt = await Innertube.create();
// const videoId = "F2H6Ip1tYPg"
// const video = await yt.getInfo(videoId);
const channelId = "UCZaVG6KWBuquVXt63G6xopg"
const channel = await yt.getChannel(channelId);
console.log('channel', channel)


