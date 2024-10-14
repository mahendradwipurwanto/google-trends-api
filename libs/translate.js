const translator = require("open-google-translator");

async function translate_text(string, from, to = "en") {

    translator.supportedLanguages();

    const res = await translator
        .TranslateLanguageData({
            listOfWordsToTranslate: [string],
            fromLanguage: from,
            toLanguage: to,
        })
        .then((data) => {
            return data;
        });

    return res[0].translation
}

module.exports = {translate_text};