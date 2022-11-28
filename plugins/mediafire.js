const { mediafire, bot, isUrl } = require('../lib/index')

bot(
	{
		pattern: 'mediafire ?(.*)',
		fromMe: true,
		desc: 'Download aus Mediafire',
		type: 'download',
	},
	async (message, match) => {
		match = isUrl(match || message.reply_message.text)
		if (!match) return await message.send('⭐     _*SPKings*_     ⭐\n\nBeispiel:\nmediafire Link')
		const result = await mediafire(match)
		if (!result)
			return await message.send('⭐     _*SPKings*_     ⭐\n\nNope, nix gefunden 🤷', {
				quoted: message.quoted,
			})
		return await message.sendFromUrl(result)
	}
)
