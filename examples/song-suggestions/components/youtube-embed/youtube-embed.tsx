import { React, useStyleSheet, memo } from '../../deps.ts'
import styleSheet from "./youtube-embed.scss.js";
import { getYTVidId } from '../../utils/mod.ts'

export type YouTubeEmbedProps = {
  link: string,
  width?: number
}

function Embed({ link }: YouTubeEmbedProps) {
  useStyleSheet(styleSheet)
  const previewUrl = `https://www.youtube.com/embed/${getYTVidId(link)}`
  return <div className='c-youtube-embed'>
  <iframe
    src={previewUrl}
    frameBorder={0}
    allowFullScreen={true}
    title='creator-frame'
    allow='autoplay'
  />
</div>
}

const YoutubeEmbed = memo(({ link }: YouTubeEmbedProps) => {
  return <Embed link={link} />
}, (prev: YouTubeEmbedProps, next: YouTubeEmbedProps) => {
  const isSameLink = prev.link === next.link
  if(isSameLink) {
    return true
  }

  return false
})

export default YoutubeEmbed