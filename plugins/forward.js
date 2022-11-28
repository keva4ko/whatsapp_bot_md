const { forwardOrBroadCast, bot, parsedJid } = require('../lib/')

bot(
	{
		pattern: 'forward ?(.*)',
		fromMe: true,
		desc: 'forward replied msg',
		type: 'misc',
	},
	async (message, match) => {
		if (!message.reply_message)
			return await message.send('⭐*SPKings*⭐\n\n*Markiere eine Nachricht*')
		for (const jid of parsedJid(match)) await forwardOrBroadCast(jid, message)
	}
)

bot(
	{
		pattern: 'save ?(.*)',
		fromMe: true,
		desc: 'forward replied msg to u',
		type: 'misc',
	},
	async (message, match) => {
		if (!message.reply_message)
			return await message.send('⭐*SPKings*⭐\n\n*Markiere eine Nachricht*')
		await forwardOrBroadCast(message.participant, message)
	}
)
