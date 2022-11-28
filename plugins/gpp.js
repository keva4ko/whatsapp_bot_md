const { bot, isAdmin } = require('../lib/')
const fm = true

bot(
	{
		pattern: 'gpp ?(.*)',
		fromMe: fm,
		desc: 'Gruppenbild',
		type: 'group',
		onlyGroup: true,
	},
	async (message, match) => {
		const isRestrict = await message.groupMetadata(message.jid, 'restrict')
		if (isRestrict) {
			const participants = await message.groupMetadata(message.jid)
			const isImAdmin = await isAdmin(participants, message.client.user.jid)
			if (!isImAdmin) return await message.send(`⭐*SPKings*⭐\n\n_Ich brauche Adminrechte._`)
		}
		if (!message.reply_message || !message.reply_message.image)
			return await message.send('⭐*SPKings*⭐\n\n*Markiere ein Bild.*')
		await message.updateProfilePicture(
			await message.reply_message.downloadMediaMessage(),
			message.jid
		)
		return await message.send('⭐*SPKings*⭐\n\n_Gruppenbild aktualisiert_')
	}
)
