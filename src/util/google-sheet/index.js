const { GoogleSpreadsheet } = require('google-spreadsheet');
const config = require('./config.json')

const initGoogleSheet = async (sheetURL) => {
	return new Promise((resolve, reject) => {
		try {
			const sheetID = new RegExp("/spreadsheets/d/([a-zA-Z0-9-_]+)").exec(sheetURL)?.[1]
			if (!sheetID) {
				return reject("Sheet URL is incorrect")
			}

			const doc = new GoogleSpreadsheet(sheetID)
			const { client_email, private_key } = config

			doc.useServiceAccountAuth({
				client_email,
				private_key
			}).then(() => [
				doc.loadInfo().then(() => {
					resolve(doc)
				}).catch(err => reject(err.message))
			]).catch(err => reject(err.message))
		} catch (err) {
			reject(err.message)
		}
	})
}

const getAllDataGoogleSheet = (doc) => {
	const promises = []

	try {
		const sheets = Object.values(doc._rawSheets).map(sheet => sheet._rawProperties.title)

		for (const sheet of sheets) {
			const sheetData = doc.sheetsByTitle[sheet]
			promises.push(
				new Promise((resolve, reject) => {
					sheetData.getRows().then(res => {
						const header = sheetData.headerValues
						const data = res.map(val => val._rawData)
						resolve({ sheet, header, data })
					}).catch(err => reject(err))
				})
			)
		}

		return Promise.all(promises)
	} catch (err) {
		return Promise.reject(err.message)
	}
}

const getDataGoogleSheetBySheetName = (doc, sheetList) => {
	const promises = []

	try {
		const sheets = Object.values(doc._rawSheets).map(sheet => sheet._rawProperties.title)

		for (const sheet of sheetList) {
			if (sheets.includes(sheet)) {
				const sheetData = doc.sheetsByTitle[sheet]
				promises.push(
					new Promise((resolve, reject) => {
						sheetData.getRows().then(res => {
							const header = sheetData.headerValues
							const data = res.map(val => val._rawData)
							resolve({ sheet, header, data })
						}).catch(err => reject(err))
					})
				)
			}
		}

		return Promise.all(promises)
	} catch (err) {
		return Promise.reject(err.message)
	}
}

const updateDataGoogleSheetBySheetName = (doc, sheetName, inputs, isAppend) => {
	return new Promise((resolve, reject) => {
		try {
			let sheet = null
			const sheets = Object.values(doc._rawSheets).map(sheet => sheet._rawProperties.title)

			if (!sheets.includes(sheetName)) {
				doc.addSheet({ headerValues: Object.keys(inputs[0]), title: sheetName }).then(newSheet => {
					newSheet.addRows(inputs).then(res => resolve(res))
				})
			} else {
				sheet = doc.sheetsByTitle[sheetName]
				if (!isAppend) {
					sheet.clear().then(() => {
						sheet.setHeaderRow(Object.keys(inputs[0])).then(() => {
							sheet.addRows(inputs).then(res => resolve(res))
						})
					})
				} else {
					sheet.addRows(inputs).then(res => resolve(res))
				}
			}
		} catch (err) {
			reject(err.message)
		}
	})
}

export {
	initGoogleSheet,
	getAllDataGoogleSheet,
	getDataGoogleSheetBySheetName,
	updateDataGoogleSheetBySheetName
};

