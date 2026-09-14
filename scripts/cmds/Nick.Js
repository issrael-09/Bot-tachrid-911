module.exports = {
	config: {
		name: "nick",
		version: "1.0",
		author: "YourName",
		countDown: 5,
		role: 1,
		description: "Change nicknames for all group members",
		category: "group",
		guide: {
			en: "{pn} all <nickname>\n{pn} delete all"
		}
	},

	onStart: async function ({ message, event, args, api }) {
		const threadID = event.threadID;

		if (!args.length) {
			return message.reply(
				"❌ الاستعمال:\n\n" +
				"nick all <الكنية>\n" +
				"مثال: nick all King\n\n" +
				"لحذف الكنيات:\n" +
				"nick delete all"
			);
		}

		// nick delete all
		if (
			args[0].toLowerCase() === "delete" &&
			args[1]?.toLowerCase() === "all"
		) {
			try {
				const threadInfo = await api.getThreadInfo(threadID);
				const participants = threadInfo.participantIDs || [];

				let success = 0;

				for (const uid of participants) {
					try {
						await api.changeNickname("", threadID, uid);
						success++;

						// تأخير بسيط بين كل عضو
						await new Promise(resolve => setTimeout(resolve, 1000));
					} catch (e) {}
				}

				return message.reply(
					`✅ تم حذف الكنيات.\n👥 عدد الأعضاء: ${success}`
				);
			} catch (error) {
				return message.reply("❌ حدث خطأ أثناء حذف الكنيات.");
			}
		}

		// nick all <nickname>
		if (args[0].toLowerCase() === "all") {
			const nickname = args.slice(1).join(" ");

			if (!nickname) {
				return message.reply(
					"❌ خاصك تكتب الكنية.\nمثال:\nnick all King"
				);
			}

			try {
				const threadInfo = await api.getThreadInfo(threadID);
				const participants = threadInfo.participantIDs || [];

				let success = 0;

				for (const uid of participants) {
					try {
						await api.changeNickname(nickname, threadID, uid);
						success++;

						// تأخير بسيط بين كل عضو
						await new Promise(resolve => setTimeout(resolve, 1000));
					} catch (e) {}
				}

				return message.reply(
					`✅ تم تغيير الكنية إلى: ${nickname}\n👥 عدد الأعضاء: ${success}`
				);
			} catch (error) {
				return message.reply(
					"❌ حدث خطأ أثناء تغيير الكنيات."
				);
			}
		}

		return message.reply(
			"❌ أمر غير صحيح.\n\n" +
			"nick all <الكنية>\n" +
			"nick delete all"
		);
	}
};
