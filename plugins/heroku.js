const got = require('got')
const Heroku = require('heroku-client')
const {
	secondsToHms,
	isUpdate,
	updateNow,
	bot,
	genButtonMessage,
} = require('../lib/')
const Config = require('../config')
const heroku = new Heroku({ token: Config.HEROKU_API_KEY })
const baseURI = '/apps/' + Config.HEROKU_APP_NAME

if (Config.HEROKU_API_KEY && Config.HEROKU_APP_NAME) {
	bot(
		{
			pattern: 'restart',
			fromMe: true,
			desc: 'Restart Dyno',
			type: 'heroku',
		},
		async (message, match) => {
			await message.send(`_Restarting_`)
			await heroku.delete(baseURI + '/dynos').catch(async (error) => {
				await message.send(`HEROKU : ${error.body.message}`)
			})
		}
	)

	bot(
		{
			pattern: 'shutdown',
			fromMe: true,
			desc: 'Dyno off',
			type: 'heroku',
		},
		async (message, match) => {
			await heroku
				.get(baseURI + '/formation')
				.then(async (formation) => {
					await message.send(`_Shuttind down._`)
					await heroku.patch(baseURI + '/formation/' + formation[0].id, {
						body: {
							quantity: 0,
						},
					})
				})
				.catch(async (error) => {
					await message.send(`HEROKU : ${error.body.message}`)
				})
		}
	)

	bot(
		{
			pattern: 'dyno',
			fromMe: true,
			desc: 'Show Quota info',
			type: 'heroku',
		},
		async (message, match) => {
			try {
				heroku
					.get('/account')
					.then(async (account) => {
						const url = `https://api.heroku.com/accounts/${account.id}/actions/get-quota`
						headers = {
							'User-Agent': 'Chrome/80.0.3987.149 Mobile Safari/537.36',
							Authorization: 'Bearer ' + Config.HEROKU_API_KEY,
							Accept: 'application/vnd.heroku+json; version=3.account-quotas',
						}
						const res = await got(url, { headers })
						const resp = JSON.parse(res.body)
						const total_quota = Math.floor(resp.account_quota)
						const quota_used = Math.floor(resp.quota_used)
						const remaining = total_quota - quota_used
						const quota = `Total Quota : ${secondsToHms(total_quota)}
Used  Quota : ${secondsToHms(quota_used)}
Remaning    : ${secondsToHms(remaining)}`
						await message.send('```' + quota + '```')
					})
					.catch(async (error) => {
						return await message.send(`HEROKU : ${error.body.message}`)
					})
			} catch (error) {
				await message.send(error)
			}
		}
	)

	bot(
		{
			pattern: 'setvar ?(.*)',
			fromMe: true,
			desc: 'Gibt komplette Rechte über Bot',
			type: 'heroku',
		},
		async (message, match) => {
			if (!match)
				return await message.send(`⭐*SPKings*⭐\n\n_Beispiel:\nsetvar SUDO:491234567890`)
			const [key, value] = match.split(':')
			if (!key || !value)
				return await message.send(`⭐*SPKings*⭐\n\nBeispiel:\nsetvar SUDO:491234567890_`)
			heroku
				.patch(baseURI + '/config-vars', {
					body: {
						[key.toUpperCase().trim()]: value.trim(),
					},
				})
				.then(async () => {
					await message.send(`_${key.toUpperCase()}: ${value}_`)
				})
				.catch(async (error) => {
					await message.send(`HEROKU : ${error.body.message}`)
				})
		}
	)

	bot(
		{
			pattern: 'delvar ?(.*)',
			fromMe: true,
			desc: 'Delete Heroku env',
			type: 'heroku',
		},
		async (message, match) => {
			if (!match) return await message.send(`⭐*SPKings*⭐\n\nBeispiel:\ndelvar sudo`)
			heroku
				.get(baseURI + '/config-vars')
				.then(async (vars) => {
					const key = match.trim().toUpperCase()
					if (vars[key]) {
						await heroku.patch(baseURI + '/config-vars', {
							body: {
								[key]: null,
							},
						})
						return await message.send(`⭐*SPKings*⭐\n\n_ ${key} gelöscht_`)
					}
					await message.send(`⭐*SPKings*⭐\n\n_${key} nicht gefunden_`)
				})
				.catch(async (error) => {
					await message.send(`HEROKU : ${error.body.message}`)
				})
		}
	)

	bot(
		{
			pattern: 'getvar ?(.*)',
			fromMe: true,
			desc: 'Show heroku env',
			type: 'heroku',
		},
		async (message, match) => {
			if (!match) return await message.send(`⭐*SPKings*⭐\n\nBeispiel:\ngetvar sudo`)
			const key = match.trim().toUpperCase()
			heroku
				.get(baseURI + '/config-vars')
				.then(async (vars) => {
					if (vars[key]) {
						return await message.send(
							'_{} : {}_'.replace('{}', key).replace('{}', vars[key])
						)
					}
					await message.send(`⭐*SPKings*⭐\n\n${key} _nicht gefunden_`)
				})
				.catch(async (error) => {
					await message.send(`HEROKU : ${error.body.message}`)
				})
		}
	)

	bot(
		{
			pattern: 'allvar',
			fromMe: true,
			desc: 'Heroku all env',
			type: 'heroku',
		},
		async (message, match) => {
			let msg = '```⭐*SPKings*⭐\n\n Hier sind all deine Heroku vars\n\n'
			heroku
				.get(baseURI + '/config-vars')
				.then(async (keys) => {
					for (const key in keys) {
						msg += `${key} : ${keys[key]}\n\n`
					}
					return await message.send(msg + '```')
				})
				.catch(async (error) => {
					await message.send(`HEROKU : ${error.body.message}`)
				})
		}
	)
}

bot(
	{
		pattern: 'update$',
		fromMe: true,
		desc: 'Update.',
		type: 'heroku',
	},
	async (message, match) => {
		const update = await isUpdate()
		if (!update.length) return await message.send('⭐     _*SPKings*_     ⭐\n\n*Ich bin auf den aktuellsten Stand 👍.*')
		return await message.send(
			await genButtonMessage(
				[{ id: 'update now', text: 'JETZT UPDATEN' }],
				`*Updates*\n${update.join('\n').trim()}`,
				`${update.length} updates`
			),
			{},
			'button'
		)
	}
)

bot(
	{
		pattern: 'update now$',
		fromMe: true,
		desc: 'Zum aktualisieren.',
		type: 'heroku',
	},
	async (message, match) => {
		const isupdate = await isUpdate()
		if (!isupdate.length)
			return await message.send('⭐     _*SPKings*_     ⭐\n\n*Ich bin auf den aktuellsten Stand 👍.')
		await message.send('_Aktualisiere..._ ⏳')
		const e = await updateNow()
		if (e) return await message.send(e)
		return await message.send('_UPDATE ERFOLGREICH_')
	}
)
