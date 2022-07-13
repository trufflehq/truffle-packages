import React from 'https://npm.tfl.dev/react'
import Stylesheet from "https://tfl.dev/@truffle/ui@0.0.1/components/stylesheet/stylesheet.js"

export default function SongInfo({ spotifyData: { title, link, artists, length }, percentDone, progressDate }) {
	function pad(n) {
		return n < 10 ? `0${n}` : n
	}
	function formatDate(d) {
		if (d.getUTCHours())
			return `${d.getUTCHours()}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
		return `${d.getMinutes()}:${pad(d.getSeconds())}`
	}
	return (
		<div className={'song-info '}>
			<div className={'artist-title-container '}>
				<div className='song-title'>
					<a draggable="false" href={link} target="_blank" rel="noopener noreferrer">{title}</a>
				</div>
				<div className='artist-name'>
					{artists.map(artist => (
						<p key={artist}>
							<a draggable="false" href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
								{artist.name}
							</a>
						</p>))}
				</div>
			</div>
			<div className='progress-text-container'>
				<div className='progress'>{formatDate(progressDate)}</div>
				<div className='length'> {formatDate(new Date(length))}</div>
			</div>
			<div className='progress-bar-outer'>
				<div className='progress-bar-inner' style={{ '--song-position': percentDone * 100 + '%' }}> </div>
			</div>
		</div>
	)
}