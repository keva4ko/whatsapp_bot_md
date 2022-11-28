const { facebook, bot, genButtonMessage, isUrl } = require('../lib/')

bot(
	{
		pattern: 'fb ?(.*)',
		fromMe: true,
		desc: 'Download Facebook Video',
		type: 'download',
	},
	async (message, match) => {
		match = isUrl(match || message.reply_message.text)
		if (!match) return await message.send('⭐*SPKings*⭐\n\nBeispiel:\nfb Link')
		const result = await facebook(match)
		if (!result.length)
			return await message.send('⭐*SPKings*⭐\n\n_Nicht gefunden_', {
				quoted: message.quoted,
			})
		return await message.send(
			await genButtonMessage(
				result.map((e) => ({
					id: `upload ${e.url}`,
					text: e.quality,
				})),
				'⭐*SPKings*⭐\n\nWähle die Videoqualität'
			),
			{},
			'button'
		)
	}
)
