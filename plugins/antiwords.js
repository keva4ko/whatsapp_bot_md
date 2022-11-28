const { bot, setWord, getWord, genButtonMessage } = require('../lib')

const actions = ['null', 'warn', 'kick']

bot(
	{
		pattern: 'antiword ?(.*)',
		fromMe: true,
		desc: 'Wortfilter im Gruppenchat',
		onlyGroup: true,
		type: 'group',
	},
	async (message, match) => {
		if (
			!match ||
			(match != 'an' && match != 'aus' && !match.startsWith('action'))
		) {
			const { enabled, action } = await getWord(message.jid)
			const buttons = actions
				.filter((e) => e != action)
				.map((button) => ({
					text: button,
					id: `antiword action/${button}`,
				}))
			buttons.push({
				text: enabled ? 'AUS' : 'AN',
				id: `antiword ${enabled ? 'aus' : 'an'}`,
			})
			return await message.send(
				await genButtonMessage(
					buttons,
					'⭐*SPKings*⭐\n\nBeispiele: antiword an/aus\nantiword action/null oder kick oder warn\nsetvar ANTIWORDS:wort1,wort2,...'
				),
				{},
				'button'
			)
		}
		if (match.startsWith('action/')) {
			const action = match.replace('action/', '')
			if (!actions.includes(action))
				return await message.send(`⭐*SPKings*⭐\n\n {action} _ist eine ungültige Eingabe_`)
			await setWord(message.jid, action)
			return await message.send(`⭐*SPKings*⭐\n\n_Eingabe aktualisiert! ${action}_`)
		}
		await setWord(message.jid, match == 'an')
		await message.send(
			`_AntiWord ${match == 'an' ? '_Aktiviert_' : '_Deaktiviert_'}_`
		)
	}
)
