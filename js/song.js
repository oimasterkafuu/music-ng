let loginStatus = await api('/login/status');
if (!loginStatus.data.profile) {
    console.debug('not logged in');
    window.location = 'login.html';
}

let querySong = getQueryVariable('id');
if (!querySong)
    window.history.back();

let detail = await api(`/song/detail`, { ids: querySong });
let songName = detail.songs[0].name;
console.debug('song name', songName);
let coverUrl = detail.songs[0].al.picUrl;
console.debug('cover url', coverUrl);

$('#name').text(songName);
$('#cover').attr('src', coverUrl);
$('body').css('background-image', `url(${coverUrl})`);
$('body').css('backdrop-filter', 'blur(50px)');
$('body').css('background-size', '150vw 150vh');

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
    // set class
    content.attr('class', 'lyric-row');
    $('#lyric').append(content);
}

let i = 0;
let move = 0;
audio.addEventListener('timeupdate', () => {
    if (i >= lrcJson.length)
        return;
    if (audio.currentTime >= lrcJson[i].time - 0.2) {
        for (let j = 0; j < lrcJson.length; ++j) {
            $(`#lyric-${j}`).css('transition', `all ${Math.max(200, Math.abs((i - 3) - j) * 100)}ms ease-in-out`);
        }
        for (let j = 0; j < lrcJson.length; ++j) {
            $(`#lyric-${j}`).css('opacity', Math.max(1 - Math.abs(i - j) / 3, 0.7));
            $(`#lyric-${j}`).css('filter', `blur(${Math.min(Math.abs(i - j), 10)}px)`);
            $(`#lyric-${j}`).css('box-shadow', `0 0 ${Math.max(30 - Math.abs(i - j) * 10, 10)}px 0 rgba(0, 0, 0, 0.5)`);
        }

        let lyric = $(`#lyric-${i}`);
        let top = lyric.offset().top;
        let middle = top + lyric.height() / 2;
        middle -= $(window).height() / 2;
        console.debug('move', middle);

        move += middle;

        for (let j = 0; j < lrcJson.length; ++j) {
            $(`#lyric-${j}`).css('transform', `translateY(${-move}px) scale(1)`);
        }

        $(`#lyric-${i}`).css('transform', `translateY(${-move}px) scale(1.2)`);

        ++i;
    }
});

audio.play();
$('#cover').css('animation', 'spin 10s linear infinite');
function bgStep() {
    // random bg position
    $('body').css('background-position-x', `${Math.random() * 100}%`);
    $('body').css('background-position-y', `${Math.random() * 100}%`);
}
setInterval(bgStep, 6000);
bgStep();