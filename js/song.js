let loginStatus = await api('/login/status');
if (!loginStatus.data.profile) {
    console.debug('not logged in');
    window.location = 'index.html';
}

let querySong = getQueryVariable('id');
if (!querySong)
    window.history.back();

let song = await api(`/song/url`, { id: querySong });
let url = song.data[0].url;
console.debug('audio url', url);
let audio = new Audio(url);

let lrc = await api(`/lyric`, { id: querySong });
let lrcText = lrc.lrc.lyric;
console.debug('lrc', lrcText);

let lrcJson = lrc2json(lrcText);
console.debug('lrc json', lrcJson);

for (let i = 0; i < lrcJson.length; i++) {
    lrcJson[i].lyric = await convert(lrcJson[i].lyric);
}
console.debug('parsed json', lrcJson);

for (let i = 0; i < lrcJson.length; i++) {
    let content = $('<div></div>');
    content.html(lrcJson[i].lyric);
    // set id
    content.attr('id', `lyric-${i}`);
    $('#lyric').append(content);
}

let i = 0;
audio.addEventListener('timeupdate', () => {
    if (i >= lrcJson.length)
        return;
    if (audio.currentTime >= lrcJson[i].time - 0.2) {
        // $('.active').removeClass('active');
        // $(`#lyric-${i}`).addClass('active');
        $(`#lyric-${i}`).attr('style', 'color: #fff; background-color: #000');
        $(`#lyric-${i - 1}`).attr('style', 'color: #000; background-color: #fff');
        ++i;
    }
});
audio.play();