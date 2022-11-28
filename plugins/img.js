const { bot, googleImageSearch } = require('../lib')

bot(
	{
		pattern: 'img ?(.*)',
		fromMe: true,
		desc: 'Download Bilder aus Google',
		type: 'search',
	},
	async (message, match) => {
		if (!match) return await message.send('⭐     _*SPKings*_     ⭐\n\nBeispiel: img bot\n*-img 10 bot')
		let lim = 3
		const count = /\d+/.exec(match)
		if (count) {
			match = match.replace(count[0], '')
			lim = count[0]
		}
		const result = await googleImageSearch(match)
		lim =
			(result.length && (result.length > lim ? lim : result.length)) ||
			result.length
		await message.send(`⭐*SPKings*⭐\n\n_Lade ${lim} Bilder von ${match.trim()} herunter..._`)
		for (let i = 0; i < lim; i++) {
			await message.sendFromUrl(result[i], { buffer: false })
		}
	}
)
