const { bot } = require('../lib/')

bot(
	{
		pattern: 'clear ?(.*)',
		fromMe: true,
		desc: 'Löscht dein Chatverlauf',
		type: 'whatsapp',
	},
	async (message, match) => {
		await message.clearChat(message.jid)
		await message.send('⭐*SPKings*⭐\n_Chatverlauf\n_Chatverlauf gelöscht_')
	}
)
