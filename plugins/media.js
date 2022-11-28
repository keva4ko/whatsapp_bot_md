const {
	audioCut,
	videoTrim,
	mergeVideo,
	getFfmpegBuffer,
	videoHeightWidth,
	avm,
	blackVideo,
	cropVideo,
	bot,
	PDF,
} = require('../lib/')
const moment = require('moment')
const fs = require('fs')
const fm = true

bot(
	{
		pattern: 'rotate ?(.*)',
		fromMe: true,
		desc: 'Video rotieren',
		type: 'video',
	},
	async (message, match) => {
		if (!message.reply_message || !message.reply_message.video)
			return await message.send('⭐     _*SPKings*_     ⭐\n\n_Markiere ein Video_')
		if (match === '')
			return await message.send('⭐     _*SPKings*_     ⭐\n\nBeispiel: rotate right|left|flip')
		const location = await message.reply_message.downloadAndSaveMediaMessage(
			'rotate'
		)
		if (/right/.test(match)) {
			await message.send('_Konventiere..._')
			return await message.send(
				await getFfmpegBuffer(location, 'orotate.mp4', 'right'),
				{ mimetype: 'video/mp4', quoted: message.data },
				'video'
			)
		} else if (/left/.test(match)) {
			await message.send('_Konventiere..._')
			return await message.send(
				await getFfmpegBuffer(location, 'orotate.mp4', 'left'),
				{ mimetype: 'video/mp4', quoted: message.data },
				'video'
			)
		} else if (/flip/.test(match)) {
			await message.send('_Konventiere..._')
			return await message.send(
				await getFfmpegBuffer(location, 'orotate.mp4', 'flip'),
				{ mimetype: 'video/mp4', quoted: message.data },
				'video'
			)
		} else await message.send('⭐     _*SPKings*_     ⭐\n\nBeispiel: rotate right|left|flip')
	}
)

bot(
	{
		pattern: 'mp3',
		fromMe: fm,
		desc: 'Video zu Audio oder Audio zu Sprachnachricht',
		type: 'video',
	},
	async (message, match) => {
		if (
			!message.reply_message ||
			(!message.reply_message.video && !message.reply_message.audio)
		)
			return await message.send('⭐     _*SPKings*_     ⭐\n\n_Markiere ein Video oder Audio_')
		return await message.send(
			await getFfmpegBuffer(
				await message.reply_message.downloadAndSaveMediaMessage('mp3'),
				'mp3.mp3',
				'mp3'
			),
			{
				filename: 'mp3.mp3',
				mimetype: 'audio/mpeg',
				ptt: !message.reply_message.ptt,
				quoted: message.data,
			},
			'audio'
		)
	}
)

bot(
	{ pattern: 'photo', fromMe: fm, desc: 'Sticker zu Bild', type: 'sticker' },
	async (message, match) => {
		if (
			!message.reply_message.sticker ||
			message.reply_message === false ||
			message.reply_message.animated
		)
			return await message.send('⭐     _*SPKings*_     ⭐\n\n_Markiere ein Sticker_')
		return await message.send(
			await getFfmpegBuffer(
				await message.reply_message.downloadAndSaveMediaMessage('photo'),
				'photo.png',
				'photo'
			),
			{ quoted: message.data, mimetype: 'image/png' },
			'image'
		)
	}
)

bot(
	{
		pattern: 'reverse',
		fromMe: true,
		desc: 'Video oder Audio rückwärts abspelen',
		type: 'video',
	},
	async (message, match) => {
		if (
			!message.reply_message.audio &&
			!message.reply_message.video &&
			!message.reply_message
		)
			return await message.send('⭐     _*SPKings*_     ⭐\n\n_Markiere ein Video oder Audio_')
		const location = await message.reply_message.downloadAndSaveMediaMessage(
			'reverse'
		)
		if (message.reply_message.video == true) {
			return await message.send(
				await getFfmpegBuffer(location, 'revered.mp4', 'videor'),
				{ mimetype: 'video/mp4', quoted: message.data },
				'video'
			)
		} else if (message.reply_message.audio == true) {
			return await message.send(
				await getFfmpegBuffer(location, 'revered.mp3', 'audior'),
				{
					filename: 'revered.mp3',
					mimetype: 'audio/mpeg',
					ptt: false,
					quoted: message.data,
				},
				'audio'
			)
		}
	}
)

bot(
	{
		pattern: 'cut ?(.*)',
		fromMe: fm,
		desc: 'Video oder Audio schneiden',
		type: 'audio',
	},
	async (message, match) => {
		if (
			!message.reply_message ||
			(!message.reply_message.audio && !message.reply_message.video)
		)
			return await message.send('⭐     _*SPKings*_     ⭐\n\n_Markiere ein Video oder Audio_')
		if (!match) return await message.send('⭐     _*SPKings*_     ⭐\n\nBeispiel: trim 0;30')
		const [start, duration] = match.split(':')
		if (!start || !duration || isNaN(start) || isNaN(duration))
			return await message.send('⭐     _*SPKings*_     ⭐\n\nBeispiel: trim 10:30')
		return await message.send(
			await audioCut(
				await message.reply_message.downloadAndSaveMediaMessage('cut'),
				start.trim(),
				duration.trim()
			),
			{
				filename: 'cut.mp3',
				mimetype: 'audio/mpeg',
				ptt: false,
				quoted: message.data,
			},
			'audio'
		)
	}
)

bot(
	{
		pattern: 'trim ?(.*)',
		fromMe: fm,
		desc: 'Video oder Audio trimmen',
		type: 'video',
	},
	async (message, match) => {
		if (!message.reply_message || !message.reply_message.video)
			return await message.send('⭐     _*SPKings*_     ⭐\n\n_Markiere ein Video_')
		if (!match) return await message.send('⭐     _*SPKings*_     ⭐\n\nBeispiel: trim 10:30')
		const [start, duration] = match.split(':')
		if (!start || !duration || isNaN(start) || isNaN(duration))
			return await message.send('⭐     _*SPKings*_     ⭐\n\nBeispiel: trim 60:30')
		return await message.send(
			await videoTrim(
				await message.reply_message.downloadAndSaveMediaMessage('trim'),
				start,
				duration
			),
			{ mimetype: 'video/mp4', quoted: message.data },
			'video'
		)
	}
)
bot(
	{
		pattern: 'page ?(.*)',
		fromMe: fm,
		desc: 'Zum Bilder hinzufügen.',
		type: 'document',
	},
	async (message, match) => {
		if (!message.reply_message || !message.reply_message.image)
			return await message.send('⭐     _*SPKings*_     ⭐\n\n_Antworte auf ein Bild_')
		if (isNaN(match))
			return await message.send('⭐     _*SPKings*_     ⭐\n\n*Reply in order*\n*Ex: .page 1*')
		await message.reply_message.downloadAndSaveMediaMessage(`./pdf/${match}`)
		return await message.send('⭐     _*SPKings*_     ⭐\n\n_Seite hinzugefügt_ ' + match)
	}
)

bot(
	{
		pattern: 'pdf ?(.*)',
		fromMe: fm,
		desc: 'Konventiere Bilder zu PDF.',
		type: 'document',
	},
	async (message, match) => {
		await message.send('⭐     _*SPKings*_     ⭐\n\n_Lade PDF hoch..._')
		return await message.send(
			await PDF(),
			{
				fileName: `${moment(new Date()).format('YYYY_MM_DD_HH_mm')}.pdf`,
				mimetype: 'application/pdf',
				quoted: message.data,
			},
			'document'
		)
	}
)

bot(
	{
		pattern: 'merge ?(.*)',
		fromMe: true,
		desc: 'Videos verbinden',
		type: 'video',
	},
	async (message, match) => {
		if (!fs.existsSync('./media/merge')) {
			fs.mkdirSync('./media/merge')
		}
		if (
			match == '' &&
			message.reply_message != false &&
			!message.reply_message.video
		)
			return await message.send('⭐     _*SPKings*_     ⭐\n\n_Markiere ein Video_')
		if (match == '' && isNaN(match))
			return await message.send(
				'⭐     _*SPKings*_     ⭐\n\n_Antworte mit der Warteschlangennummer_\nBeispiel:\nmerge 1, merge 2, merge 3...'
			)
		if (/[0-9]+/.test(match)) {
			await message.reply_message.downloadAndSaveMediaMessage(
				'./media/merge/' + match
			)
			return await message.send('```_Video ' + match + ' verbunden_```')
		} else {
			let length = fs.readdirSync('./media/merge').length
			if (!(length > 0))
				return await message.send(
					'```⭐     _*SPKings*_     ⭐\n\n_Füge Videos zur Warteschlange hinzu._```\nBeispiel\nmerge 1'
				)
			await message.send('```_Verbinde ' + length + ' Videos..._```')
			return await message.send(
				await mergeVideo(length),
				{ mimetype: 'video/mp4', quoted: message.data },
				'video'
			)
		}
	}
)

bot(
	{
		pattern: 'compress ?(.*)',
		fromMe: true,
		desc: 'compress video',
		type: 'video',
	},
	async (message, match) => {
		if (!message.reply_message || !message.reply_message.video)
			return await message.send('⭐     _*SPKings*_     ⭐\n\n_Markiere ein Video_')
		return await message.send(
			await getFfmpegBuffer(
				await message.reply_message.downloadAndSaveMediaMessage('compress'),
				'ocompress.mp4',
				'compress'
			),
			{ quoted: message.data },
			'video'
		)
	}
)

bot(
	{
		pattern: 'bass ?(.*)',
		fromMe: true,
		desc: 'Bassverstärkung',
		type: 'audio',
	},
	async (message, match) => {
		if (
			!message.reply_message ||
			(!message.reply_message.audio && !message.reply_message.video)
		)
			return await message.send('⭐     _*SPKings*_     ⭐\n\n_Markiere ein Audio_')
		return await message.send(
			await getFfmpegBuffer(
				await message.reply_message.downloadAndSaveMediaMessage('basso'),
				'bass.mp3',
				`bass,${match == '' ? 10 : match}`
			),
			{ mimetype: 'audio/mpeg', quoted: message.data },
			'audio'
		)
	}
)

bot(
	{
		pattern: 'treble ?(.*)',
		fromMe: true,
		desc: 'alter audio treble',
		type: 'audio',
	},
	async (message, match) => {
		if (
			!message.reply_message ||
			(!message.reply_message.audio && !message.reply_message.video)
		)
			return await message.send('⭐     _*SPKings*_     ⭐\n\n_Markiere ein Audio oder Video_')
		return await message.send(
			await getFfmpegBuffer(
				await message.reply_message.downloadAndSaveMediaMessage('trebleo'),
				'treble.mp3',
				`treble,${match == '' ? 10 : match}`
			),
			{ mimetype: 'audio/mpeg', quoted: message.data },
			'audio'
		)
	}
)

bot(
	{
		pattern: 'histo',
		fromMe: true,
		desc: 'Audio zu Video',
		type: 'audio',
	},
	async (message, match) => {
		if (
			!message.reply_message ||
			(!message.reply_message.audio && !message.reply_message.video)
		)
			return await message.send('⭐     _*SPKings*_     ⭐\n\n_Markiere ein Audio oder Video_')
		return await message.send(
			await getFfmpegBuffer(
				await message.reply_message.downloadAndSaveMediaMessage('histo'),
				'histo.mp4',
				'histo'
			),
			{ mimetype: 'video/mp4', quoted: message.data },
			'video'
		)
	}
)

bot(
	{
		pattern: 'vector',
		fromMe: true,
		desc: 'Audio zu Video',
		type: 'audio',
	},
	async (message, match) => {
		if (
			!message.reply_message ||
			(!message.reply_message.audio && !message.reply_message.video)
		)
			return await message.send('⭐     _*SPKings*_     ⭐\n\n_Markiere ein Audio oder Video_')
		return await message.send(
			await getFfmpegBuffer(
				await message.reply_message.downloadAndSaveMediaMessage('vector'),
				'vector.mp4',
				'vector'
			),
			{ mimetype: 'video/mp4', quoted: message.data },
			'video'
		)
	}
)
bot(
	{
		pattern: 'crop ?(.*)',
		fromMe: true,
		desc: 'To crop video\nExample \n.crop 512,512,0,512\n.crop outW,outH,WtoCrop,HtoCrop',
		type: 'video',
	},
	async (message, match) => {
		if (!message.reply_message || !message.reply_message.video)
			return await message.send('⭐     _*SPKings*_     ⭐\n\n_Markiere ein Video_')
		const [vw, vh, w, h] = match.split(',')
		if (
			!vh ||
			!vw ||
			!w ||
			!h ||
			typeof +vh !== 'number' ||
			typeof +w !== 'number' ||
			typeof +h !== 'number' ||
			typeof +vw !== 'number'
		)
			return await message.send(
				`⭐     _*SPKings*_     ⭐\n\nBeispiel:\ncrop out_w,out_h,x,y\nx and y are top left where to start croping`
			)
		const location = await message.reply_message.downloadAndSaveMediaMessage(
			'plain'
		)
		const { height, width } = await videoHeightWidth(location)
		if (vw > width || vh > height)
			return await message.send(
				`⭐     _*SPKings*_     ⭐\n\n Video Breite: ${width}\nHöhe: ${height}*\n*Wähle eine Endgröße`
			)
		return await message.send(
			await cropVideo(location, vw, vh, w, h),
			{ mimetype: 'video/mp4', quoted: message.data },
			'video'
		)
	}
)

bot(
	{
		pattern: 'low',
		fromMe: true,
		desc: 'Audio tief',
		type: 'audio',
	},
	async (message, match) => {
		if (
			!message.reply_message ||
			(!message.reply_message.audio && !message.reply_message.video)
		)
			return await message.send('⭐     _*SPKings*_     ⭐\n\n_Markiere ein Audio oder Video_')
		return await message.send(
			await getFfmpegBuffer(
				await message.reply_message.downloadAndSaveMediaMessage('lowmp3'),
				'lowmp3.mp3',
				'pitch'
			),
			{ filename: 'lowmp3.mp3', mimetype: 'audio/mpeg', quoted: message.data },
			'audio'
		)
	}
)
bot(
	{
		pattern: 'pitch',
		fromMe: true,
		desc: 'alter audio',
		type: 'audio',
	},
	async (message, match) => {
		if (
			!message.reply_message ||
			(!message.reply_message.audio && !message.reply_message.video)
		)
			return await message.send('⭐     _*SPKings*_     ⭐\n\n_Markiere ein Audio oder Video_')
		return await message.send(
			await getFfmpegBuffer(
				await message.reply_message.downloadAndSaveMediaMessage('pitchmp3'),
				'lowmp3.mp3',
				'lowmp3'
			),
			{ filename: 'lowmp3.mp3', mimetype: 'audio/mpeg', quoted: message.data },
			'audio'
		)
	}
)
bot(
	{
		pattern: 'avec',
		fromMe: true,
		desc: 'Audio zu Video',
		type: 'audio',
	},
	async (message, match) => {
		if (
			!message.reply_message ||
			(!message.reply_message.audio && !message.reply_message.video)
		)
			return await message.send('⭐     _*SPKings*_     ⭐\n\n_Markiere ein Audio oder Video_')
		return await message.send(
			await getFfmpegBuffer(
				await message.reply_message.downloadAndSaveMediaMessage('avec'),
				'avec.mp4',
				'avec'
			),
			{ mimetype: 'video/mp4', quoted: message.data },
			'video'
		)
	}
)

bot(
	{
		pattern: 'avm',
		fromMe: true,
		desc: 'Audio mit Video verbinden',
		type: 'misc',
	},
	async (message, match) => {
		if (!fs.existsSync('./media/avm')) {
			fs.mkdirSync('./media/avm')
		}
		let files = fs.readdirSync('./media/avm/')
		if (
			(!message.reply_message && files.length < 2) ||
			(message.reply_message &&
				!message.reply_message.audio &&
				!message.reply_message.video)
		)
			return await message.send(
				'⭐     _*SPKings*_     ⭐\n\n_Markiere ein Audio oder Video._'
			)
		if (message.reply_message.audio) {
			await message.reply_message.downloadAndSaveMediaMessage(
				'./media/avm/audio'
			)
			return await message.send('```_Audio hinzugefügt._```')
		}
		if (message.reply_message.video) {
			await message.reply_message.downloadAndSaveMediaMessage(
				'./media/avm/video'
			)
			return await message.send('```_Video hinzugefügt._```')
		}
		return await message.send(
			await avm(files),
			{ quoted: message.data },
			'video'
		)
	}
)

bot(
	{
		pattern: 'black',
		fromMe: true,
		desc: 'Audio zu Video.',
		type: 'audio',
	},
	async (message, match) => {
		if (
			!message.reply_message ||
			(!message.reply_message.audio && !message.reply_message.video)
		)
			return await message.send('⭐     _*SPKings*_     ⭐\n\n_Markiere ein Audio oder Video_')
		await message.send(
			await blackVideo(
				await message.reply_message.downloadAndSaveMediaMessage('black')
			),
			{ quoted: message.data },
			'video'
		)
	}
)
