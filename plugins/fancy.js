const { bot, textToStylist, fontType, stylishTextGen } = require('../lib')
bot(
	{
		pattern: 'fancy ?(.*)',
		fromMe: true,
		desc: 'Creates fancy text from given text',
		type: 'misc',
	},
	async (message, match) => {
		if (
			!match ||
			(message.reply_message.text &&
				(!match || isNaN(match) || match < 1 || match > 47))
		)
			return await message.send(
				'⭐*SPKings*⭐\n\nBeispiel: \nfancy Hi\nfancy 7 beim Markieren einer Textnachricht'
			)
		if (message.reply_message.text) {
			return await message.send(
				textToStylist(message.reply_message.text, fontType(match))
			)
		}
		return await message.send(stylishTextGen(match))
	}
)
