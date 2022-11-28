const { bot, aliveMessage } = require('../lib/')

bot(
	{
		pattern: 'alive ?(.*)',
		fromMe: true,
		desc: 'Nachricht wenn Bot lebt',
		type: 'misc',
	},
	async (message, match) => {
		const { msg, options, type } = await aliveMessage(match, message)
		return await message.send('⭐     _*SPKings*_     ⭐\n\nbruder was?_')
	}
)
