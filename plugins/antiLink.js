const { getAntiLink, bot, genButtonMessage, setAntiLink } = require('../lib/')

bot(
	{
		pattern: 'antilink ?(.*)',
		fromMe: true,
		desc: 'AntiLink an oder aus',
		type: 'group',
		onlyGroup: true,
	},
	async (message, match) => {
		const antilink = await getAntiLink(message.jid)
		if (!match) {
			const onOrOff = antilink.enabled ? 'aus' : 'an'
			const button = await genButtonMessage(
				[
					{ id: 'antilink info', text: 'INFO' },
					{ id: `antilink ${onOrOff}`, text: onOrOff.toUpperCase() },
				],
				'⭐*SPKings*⭐\n\nBeispiel:\nhttps://github.com/lyfe00011/whatsapp-bot-md/wiki/antilink',
				'Antilink'
			)
			return await message.send(button, {}, 'button')
			// return await message.send(
			// 	await genHydratedButtons(
			// 		[
			// 			{
			// 				urlButton: {
			// 					text: 'Beispiel',
			// 					url: 'https://github.com/lyfe00011/whatsapp-bot-md/wiki/antilink',
			// 				},
			// 			},
			// 			{
			// 				button: {
			// 					id: `antilink ${antilink.enabled ? 'aus' : 'an'}`,
			// 					text: antilink.enabled ? 'AUS' : 'AN',
			// 				},
			// 			},
			// 			{ button: { id: 'antilink info', text: 'INFO' } },
			// 		],
			// 		'AntiLink'
			// 	),
			// 	{},
			// 	'template'
			// )
		}
		if (match == 'an' || match == 'aus') {
			if (match == 'aus' && !antilink)
				return await message.send('⭐*SPKings*⭐\n\nAntiLink ist noch deaktiviert.')
			await setAntiLink(message.jid, match == 'an')
			return await message.send(
				`*SPKings*\n ${match == 'an' ? 'Aktiviert' : 'Deaktiviert.'}`
			)
		}
		if (match == 'info')
			return await message.send(
				`*SPKings*\nAntiLink ${antilink.enabled ? 'an' : 'aus'}\n*Erlaubte Links:* ${
					antilink.allowedUrls
				}\n*Eingabe:* ${antilink.action}`
			)
		if (match.startsWith('action/')) {
			await setAntiLink(message.jid, match)
			const action = match.replace('action/', '')
			if (!['warn', 'kick', 'null'].includes(action))
				return await message.send('⭐*SPKings*⭐\n\n_Ungültige Eingabe_')
			return await message.send(`⭐*SPKings*⭐\n\n_Eingabe aktualisiert!_ ${action}`)
		}
		await setAntiLink(message.jid, match)
		return await message.send(`⭐*SPKings*⭐\n\nErlaubte Links: ${match}`)
	}
)
