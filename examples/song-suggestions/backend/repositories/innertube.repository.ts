import { Innertube } from "https://tfl.dev/@truffle/youtube-js@0.5.9/index.js"
export class InnertubeRepository {
  static async getVideoDetails(videoId: string) {
    const yt = await Innertube.create();

    const video = await yt.getInfo(videoId);

    return video
  }

  static async getChannel(channelId: string) {
    console.log('getting channel details', channelId)
    const yt = await Innertube.create();
  
    console.log('init innertube')
    const channel = await yt.getChannel(channelId);

    return channel
  }

  static getVideoId(url: string) {
    const p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return (url?.match(p)) ? RegExp.$1 : '';
  }
  
}
