const { GoogleSpreadsheet } = require('google-spreadsheet');
const config = require('./gg.json')

const initGoogleSheet = async (sheetURL) => {
	const sheetID = new RegExp("/spreadsheets/d/([a-zA-Z0-9-_]+)").exec(sheetURL)?.[1]
	if(sheetID){
		throw new Error("")
	}
	const doc = new GoogleSpreadsheet(sheetID)

	const {client_email, private_key} = config

	await doc.useServiceAccountAuth({
		client_email,
		private_key
	})
	await doc.loadInfo();

	return doc
}

const getAllSheetsTitle = (doc) => {
	return Object.values(doc._rawSheets).map(sheet => sheet._rawProperties.title)
}

const getDataFromSheet = (data) => data.map(val => val._rawData)

const clearSheet = async (sheet) => {
	await sheet.clear()
}

const deleteSheet = async (sheet) => {
	await sheet.delete()
}

const getAll = async (sheetURL) => {
	const doc = await initGoogleSheet(sheetURL)
	const sheets = getAllSheetsTitle(doc)

	for(let sheet of sheets) {
		const sheetData = doc.sheetsByTitle[sheet]
		const data = getDataFromSheet(await sheetData.getRows())
		const header = sheetData.headerValues
		console.log(header, data)
	}
}

const getBySheetName = async (sheetURL, sheetName) => {
	const doc = await initGoogleSheet(sheetURL)
	const sheets = getAllSheetsTitle(doc)

	if(!sheets.includes(sheetName)){
		console.log("Sheet not found")
		return
	}

	const sheetData = doc.sheetsByTitle[sheetName]
	const data = getDataFromSheet(await sheetData.getRows())
	const header = sheetData.headerValues
	console.log(header, data)
}

const writeToSheet = async (sheetURL, sheetName, input, isAppend) => {
	const doc = await initGoogleSheet(sheetURL)
	const sheets = getAllSheetsTitle(doc)
	let sheet = null

	if(!sheets.includes(sheetName)){
		sheet = await doc.addSheet({ headerValues: Object.keys(input[0]), title: sheetName })
	}else{
		sheet = doc.sheetsByTitle[sheetName]
		if(!isAppend){
			await clearSheet(sheet)
			await sheet.setHeaderRow(Object.keys(input[0]))
		}
	}

	await sheet.addRows(input)
	console.log(sheet, Object.keys(input[0]))
}

export {
	getAll,
	getBySheetName,
	clearSheet,
	deleteSheet,
	writeToSheet
}

