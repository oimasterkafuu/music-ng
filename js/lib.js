function formatDuration(duration) {
    let min = Math.floor(duration / 1000 / 60);
    let sec = Math.floor(duration / 1000 % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (pair[0] == variable) { return pair[1]; }
    }
    return null;
}

function lrc2json(lrc) {
    const lines = lrc.split('\n');
    console.debug(lines);
    const result = [];

    for (let i = 0; i < lines.length; ++i) {
        const line = lines[i];

        try {
            const time = line.match(/\[(\d+:\d+\.\d+)\]/)[1];
            const timeArray = time.split(':');
            const timeInMs = parseInt(timeArray[0]) * 60 + parseFloat(timeArray[1]);

            console.debug(time, timeArray, timeInMs);

            const lyric = line.match(/\](.*)/)[1];
            console.debug(lyric);

            result.push({
                time: timeInMs,
                lyric: lyric.trim()
            });
        } catch (e) {
            console.log(e);
        }
    }
    return result;
}
