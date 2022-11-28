const {
	bot,
	isAdmin,
	setMute,
	addTask,
	genButtonMessage,
	c24to12,
	getMute,
} = require('../lib')

bot(
	{
		pattern: 'amute ?(.*)',
		fromMe: true,
		desc: 'Gruppenchat Zeitschalter',
		type: 'group',
		onlyGroup: true,
	},
	async (message, match) => {
		const participants = await message.groupMetadata(message.jid)
		const isImAdmin = await isAdmin(participants, message.client.user.jid)
		if (!isImAdmin) return await message.send(`⭐     _*SPKings*_     ⭐\n\n_Ich bin kein Admin_`)
		let msg = message.reply_message.text || 'null'
		const [hour, min] = match.split(' ')
		if (hour == 'info') {
			const task = await getMute(message.jid, 'mute')
			if (!task) return await message.send('⭐     _*SPKings*_     ⭐\n\n_AutoMute nicht gefunden🤷‍_')
			const { hour, minute, msg, enabled } = task
			return await message.send(
				`*Stunden:* ${hour}\n*Minute:* ${minute}\n*Zeit:* ${c24to12(
					`${hour}:${minute}`
				)}\n*Mute:* ${enabled ? 'an' : 'aus'}\nMessage : ${msg}`
			)
		}
		if (hour == 'an' || hour == 'aus') {
			const isMute = await setMute(message.jid, 'mute', hour == 'an')
			if (!isMute) return await message.send('⭐     _*SPKings*_     ⭐\n\n_AutoMute nicht gefunden_🤷')
			const task = await getMute(message.jid, 'mute')
			if (!task || !task.hour)
				return await message.send('⭐     _*SPKings*_     ⭐\n\n_AutoMute nicht gefunden_🤷')
			const isTask = addTask(
				message.jid,
				'mute',
				hour == 'aus' ? 'aus' : task.hour,
				task.minute,
				message.client,
				task.msg
			)
			if (!isTask)
				return await message.send('⭐     _*SPKings*_     ⭐\n\n_AutoMute ist schon aus_')
			return await message.send(
				`_AutoMute ${hour == 'an' ? 'Aktiviert' : 'Deaktiviert'}._`
			)
		}
		if (!hour || !min || isNaN(hour) || isNaN(min))
			return await message.send(
				await genButtonMessage(
					[
						{ id: 'amute an', text: 'AN' },
						{ id: 'amute aus', text: 'AUS' },
						{ id: 'amute info', text: 'INFO' },
					],
					'⭐     _*SPKings*_     ⭐\n\nBeispiel:\namute 6 0\namute info\namute an/aus\nMarkiere eine Nachricht'
				),
				{},
				'button'
			)
		await setMute(message.jid, 'mute', true, hour, min, msg)
		addTask(message.jid, 'mute', hour, min, message.client, msg)

		return await message.send(
			`_Group will Mute at ${c24to12(`${hour}:${min}`)}_${
				msg != 'null' ? `\n_Message: ${msg}_` : ''
			}`
		)
	}
)

bot(
	{
		pattern: 'aunmute ?(.*)',
		fromMe: true,
		desc: 'Gruppenunmute Zeitschalter',
		type: 'group',
		onlyGroup: true,
	},
	async (message, match) => {
		const participants = await message.groupMetadata(message.jid)
		const isImAdmin = await isAdmin(participants, message.client.user.jid)
		if (!isImAdmin) return await message.send(`⭐     _*SPKings*_     ⭐\n\nIch bin kein Admin.`)
		let msg = message.reply_message.text || 'null'
		const [hour, min] = match.split(' ')
		if (hour == 'info') {
			const task = await getMute(message.jid, 'unmute')
			if (!task || !task.hour)
				return await message.send('⭐*SPKings*⭐\n\n_AutoUnMute nicht gefunden_')
			const { hour, minute, msg, enabled } = task
			return await message.send(
				`*Hour :* ${hour}\n*Minute :* ${minute}\n*Time :* ${c24to12(
					`${hour}:${minute}`
				)}\n*unMute :* ${enabled ? 'on' : 'off'}\nMessage : ${msg}`
			)
		}
		if (hour == 'on' || hour == 'off') {
			const isMute = await setMute(message.jid, 'unmute', hour == 'on')
			if (!isMute) return await message.send('_Not Found AutoUnMute_')
			const task = await getMute(message.jid, 'unmute')
			if (!task) return await message.send('_Not Found AutoUnMute_')
			const isTask = addTask(
				message.jid,
				'unmute',
				hour == 'off' ? 'off' : task.hour,
				task.minute,
				message.client,
				task.msg
			)
			if (!isTask)
				return await message.send('_AutoUnMute Already Disabled_')
			return await message.send(
				`_AutoUnMute ${hour == 'on' ? 'Enabled' : 'Disabled'}._`
			)
		}
		if (!hour || !min || isNaN(hour) || isNaN(min))
			return await message.send(
				await genButtonMessage(
					[
						{ id: 'aunmute on', text: 'ON' },
						{ id: 'aunmute off', text: 'OFF' },
						{ id: 'aunmute info', text: 'INFO' },
					],
					'*Example : aunmute 6 0*\naunmute info\naunmute on/off\nReply to a text to set Msg'
				),
				{},
				'button'
			)
		await setMute(message.jid, 'unmute', true, hour, min, msg)
		addTask(message.jid, 'unmute', hour, min, message.client, msg)
		return await message.send(
			`_Group will unMute at ${c24to12(`${hour}:${min}`)}_${
				msg != 'null' ? `\n_Message: ${msg}_` : ''
			}`
		)
	}
)
