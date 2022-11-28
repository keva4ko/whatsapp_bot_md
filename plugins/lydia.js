const { setLydia, bot } = require('../lib/')

bot(
	{
		pattern: 'lydia ?(.*)',
		fromMe: true,
		desc: 'Chatbot an-/ausschalten',
		type: 'misc',
	},
	async (message, match) => {
		if (!match)
			return await message.send(
				'⭐     _*SPKings*_     ⭐\n\nBeispiel: lydia on/off*\noder antworte auf eine Nachricht'
			)
		const user = message.mention[0] || message.reply_message.jid
		await setLydia(message.jid, match == 'on', user)
		await message.send(
			`_Lydia ${
				match == 'on' ? 'AKTIVIERT' : 'DEAKTIVIERT'
			}_\n*Only works from reply msg.`
		)
	}
)
