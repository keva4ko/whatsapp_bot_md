const {
	bot,
	genButtonMessage,
	mentionMessage,
	enableMention,
	clearFiles,
	getMention,
} = require('../lib/')

bot(
	{
		pattern: 'mention ?(.*)',
		fromMe: true,
		desc: 'To set and Manage mention (NOCH NICHT NUTZEN!)',
		type: 'misc',
	},
	async (message, match) => {
		if (!match) {
			const mention = await getMention()
			const onOrOff = mention && mention.enabled ? 'aus' : 'an'
			const button = await genButtonMessage(
				[
					{ id: 'mention get', text: 'HOLEN' },
					{ id: `mention ${onOrOff}`, text: onOrOff.toUpperCase() },
				],
				'Example\nhttps://github.com/lyfe00011//whatsapp-bot-md/wiki/mention_example',
				'Mention'
			)
			return await message.send(button, {}, 'button')
			// return await message.send(
			// 	await genHydratedButtons(
			// 		[
			// 			{
			// 				urlButton: {
			// 					text: 'beispiel',
			// 					url: 'https://github.com/lyfe00011//whatsapp-bot-md/wiki/mention_example',
			// 				},
			// 			},
			// 			{ button: { id: 'mention on', text: 'AN' } },
			// 			{ button: { id: 'mention off', text: 'AUS' } },
			// 			{ button: { id: 'mention get', text: 'HOLEN' } },
			// 		],
			// 		'Mention Msg Manager'
			// 	),
			// 	{},
			// 	'template'
			// )
		}
		if (match == 'get') {
			const msg = await mentionMessage()
			if (!msg) return await message.send('⭐*SPKings*⭐\n\nAntwort an Mention ist nicht aktiviert.')
			return await message.send(msg)
		} else if (match == 'an' || match == 'aus') {
			await enableMention(match == 'an')
			return await message.send(
				`_Reply to mention ${match == 'an' ? 'AKTIVIERT' : 'Deaktiviert'}_`
			)
		}
		await enableMention(match)
		clearFiles()
		return await message.send('_Mention geupdatet_')
	}
)
