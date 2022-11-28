const { bot, isAdmin } = require('../lib')

bot(
	{
		pattern: 'dlt ?(.*)',
		fromMe: true,
		desc: 'Markierte Nachricht löschen',
		type: 'whatsapp',
	},
	async (message, match) => {
		if (!message.reply_message)
			return await message.send('⭐*SPKings*⭐\n\nMarkiere eine Nachricht')
		const key = message.reply_message.key
		if (!key.fromMe && message.isGroup) {
			const participants = await message.groupMetadata(message.jid)
			const isImAdmin = await isAdmin(participants, message.client.user.jid)
			if (!isImAdmin) return await message.send(`⭐*SPKings*⭐\n\n_Ich brauche Adminrechte für diesen Befehl_`)
		}
		return await message.send(key, {}, 'delete')
	}
)
