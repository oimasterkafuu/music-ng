let loginStatus = await api('/login/status');
if(loginStatus.data.profile) {
    console.debug('already logged in', loginStatus.data.profile);
    window.location = 'favorite.html';
}

let key = await api('/login/qr/key');
console.debug('key', key.data.unikey);
let qr = await api('/login/qr/create', { key: key.data.unikey, qrimg: true });
console.debug('qr', qr.data.qrimg);

$('#qr').attr('src', qr.data.qrimg);
let interval = setInterval(async () => {
    let status = await api('/login/qr/check', { key: key.data.unikey });
    console.debug('status', status);
    if(status.code == 803) {
        clearInterval(interval);
        console.debug('logged in');
        // window.location = 'favorite.html';
    } else if(status.code == 800) {
        clearInterval(interval);
        console.debug('qr expired');
        // window.location.reload();
    }
}, 5000);