const kuroshiro = new Kuroshiro();
const kuromojiAnalyzer = new KuromojiAnalyzer({ dictPath: '../dict/' });

var hasInit = false;

async function convert(text, to = 'hiragana') {
    if (!hasInit) {
        console.debug('init kuroshiro');
        await kuroshiro.init(kuromojiAnalyzer);
        hasInit = true;
    }
    return await kuroshiro.convert(text, {
        to,
        mode: 'furigana'
    });
}