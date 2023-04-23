const ncmaUrl = 'https://ncma.oimaster.cf';

if (!localStorage.getItem('cookie'))
    localStorage.setItem('cookie', '');
if (!localStorage.getItem('clientIP')){
    let ip = $.ajax({
        url: 'https://api.ipify.org?format=json',
        async: false
    }).responseJSON.ip;
    localStorage.setItem('clientIP', ip);
}

var clientIP = localStorage.getItem('clientIP');

async function api(url, params = {}, cache = true) {
    if(!cache)
        params.timestamp = Date.now();
    if (!clientIP) {
        clientIP = await fetch('https://api.ipify.org?format=json').then(res => res.json());
        clientIP = clientIP.ip;
    }
    params.realIP = clientIP;
    if(localStorage.getItem('cookie'))
        params.cookie = localStorage.getItem('cookie');

    let query = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
    let res = await fetch(`${ncmaUrl}${url}?${query}`).then(res => res.json());
    if (res.cookie) {
        console.debug('cookie', res.cookie);
        localStorage.setItem('cookie', res.cookie);
    }
    return res;
}