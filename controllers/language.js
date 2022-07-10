async function getLanguage(path) {
  //console.log(path)
}

async function setLanguage(path) {
    const language = path
    const langString = language.toString()
    return langString
}

module.exports = { getLanguage, setLanguage };
