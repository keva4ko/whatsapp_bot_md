const { bot, apkMirror, genListMessage, genButtonMessage } = require('../lib')
bot(
	{
		pattern: 'apk ?(.*)',
		fromMe: true,
		desc: 'Apks aus apkmirror herunterladen',
		type: 'download',
	},
	async (message, match) => {
		if (!match) return await message.send('⭐*SPKings*⭐\n\nBeispiel: apk Link')
		const { result, status } = await apkMirror(match)
		if (status > 400) {
			if (!result.length)
				return await message.send(
					'⭐*SPKings*⭐\n\n_Deine Eingabe führt zu nichts_'
				)
			const list = []
			for (const { title, url } of result)
				list.push({ id: `apk ${status};;${url}`, text: title })
			return await message.send(
				genListMessage(list, 'Matching apps', 'DOWNLOAD'),
				{},
				'list'
			)
		}
		if (status > 200) {
			const button = []
			for (const apk in result)
				button.push({
					id: `apk ${status};;${result[apk].url}`,
					text: result[apk].title,
				})
			return await message.send(
				await genButtonMessage(button, 'Verfügbare Links'),
				{},
				'button'
			)
		}
		return await message.sendFromUrl(result)
	}
)
