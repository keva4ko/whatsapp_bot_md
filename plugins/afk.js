const { bot } = require('../lib/')

global.AFK = {
	isAfk: false,
	reason: false,
	lastseen: 0,
}

bot(
	{
		pattern: 'afk ?(.*)',
		fromMe: true,
		desc: 'Wenn nicht erreichbar',
		type: 'misc',
	},
	async (message, match) => {
		if (!global.AFK.isAfk && !match)
			return await message.send(
				'⭐     _*SPKings*_     ⭐\n\nIst aktuell nicht erreichbar\nZuletzt gesehen: #zuletztgesehen'
			)
		if (!global.AFK.isAfk) {
			if (match) global.AFK.reason = match
			global.AFK.isAfk = true
			global.AFK.lastseen = Math.round(new Date().getTime() / 1000)
			return await message.send(
				match.replace(
					'#zuletztgesehen',
					Math.round(new Date().getTime() / 1000) - global.AFK.lastseen
				)
			)
		}
	}
)
