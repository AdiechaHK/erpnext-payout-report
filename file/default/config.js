function getFileName() {
	return process.env.FILENAME || "{CURRENT_TIMESTAMP}.txt";
}

module.exports = {
	filename: getFileName()
}