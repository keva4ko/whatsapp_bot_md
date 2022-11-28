const { getFilter, bot, setFilter, deleteFilter, lydia } = require('../lib/')
const fm = true

bot(
	{
		pattern: 'stop ?(.*)',
		fromMe: fm,
		desc: 'Delete filters in chat',
		type: 'group',
		onlyGroup: true,
	},
	async (message, match) => {
		if (!match) return await message.send(`⭐*SPKings*⭐\n\nBeispiel:\nstop hi`)
		const isDel = await deleteFilter(message.jid, match)
		if (!isDel)
			return await message.send(`⭐*SPKings*⭐\n\n_${match} nicht in Filter gefunden_`)
		return await message.send(`⭐*SPKings*⭐\n\n_${match} gelöscht._`)
	}
)

bot(
	{
		pattern: 'filter ?(.*)',
		fromMe: fm,
		desc: 'filter in groups',
		type: 'group',
		onlyGroup: true,
	},
	async (message, match) => {
		match = match.match(/[\'\"](.*?)[\'\"]/gms)
		if (!match) {
			const filters = await getFilter(message.jid)
			if (!filters)
				return await message.send(
					`⭐*SPKings*⭐\n\n_Es wurde kein Filter gesetzt_\nBeispiel:\nfilter 'hi' 'hello'`
				)
			let msg = ''
			filters.map(({ pattern }) => {
				msg += `=> ${pattern} \n`
			})
			return await message.send(msg.trim())
		} else {
			if (match.length < 2) {
				return await message.send(`⭐*SPKings*⭐\n\nBeispiel:\nfilter 'hi' 'hello'`)
			}
			await setFilter(
				message.jid,
				match[0].replace(/['"]+/g, ''),
				match[1].replace(/['"]+/g, ''),
				match[0][0] === "'" ? true : false
			)
			await message.send(
				`⭐*SPKings*⭐\n\n_${match[0].replace(/['"]+/g, '')}_ wurde im Filter hinzugefügt.`
			)
		}
	}
)

bot(
	{ on: 'text', fromMe: false, type: 'filterOrLydia' },
	async (message, match) => {
		const filters = await getFilter(message.jid)
		if (filters)
			filters.map(async ({ pattern, regex, text }) => {
				pattern = new RegExp(regex ? pattern : `\\b(${pattern})\\b`, 'gm')
				if (pattern.test(message.text)) {
					await message.send(text, {
						quoted: message.data,
					})
				}
			})

		const isLydia = await lydia(message)
		if (isLydia)
			return await message.send(isLydia, { quoted: message.data })
	}
)

bot({ on: 'text', fromMe: true, type: 'lydia' }, async (message, match) => {
	const isLydia = await lydia(message)
	if (isLydia)
		return await message.send(isLydia, { quoted: message.data })
})
