let loginStatus = await api('/login/status');
if (loginStatus.data.profile) {
    console.debug('already logged in', loginStatus.data.profile);
    window.location = 'favorite.html';
}

let key = await api('/login/qr/key');
console.debug('key', key.data.unikey);
let qr = await api('/login/qr/create', { key: key.data.unikey, qrimg: true });
console.debug('qr', qr.data.qrimg);

let canvas = document.getElementById('qr');
let ctx = canvas.getContext('2d');

let img = new Image();
img.src = qr.data.qrimg;

img.onload = () => {
    console.debug('loaded qr image');
    ctx.drawImage(img, 0, 0);

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i + 3] = 0;
    }
    ctx.putImageData(imageData, 0, 0);
    $('#text').html('笨蛋！<br>这个才不是为你找的！');
    
    let p = 0;
    const step = () => {
        console.debug('step');
        p += 5;

        for (let i = 0; i < data.length; i += 4) {
            if (data[i] == 255 && data[i + 1] == 255 && data[i + 2] == 255)
                continue;
            let x = (i / 4) % canvas.width;
            let y = Math.floor((i / 4) / canvas.width);

            let dx = x - canvas.width / 2;
            let dy = y - canvas.height / 2;
            let d = Math.sqrt(dx * dx + dy * dy);

            if (d < p)
                data[i + 3] = 255 * (1 - d / p);
        }

        ctx.putImageData(imageData, 0, 0);

        if (p < canvas.width * 5)
            requestAnimationFrame(step);
        else {
            console.debug('done');
            for (let i = 0; i < data.length; i += 4) {
                if (data[i + 3])
                    data[i + 3] = 255;
            }
            ctx.putImageData(imageData, 0, 0);
        }
    }
    step();
}

let interval = setInterval(async () => {
    let status = await api('/login/qr/check', { key: key.data.unikey });
    console.debug('status', status);
    if (status.code == 803) {
        clearInterval(interval);
        console.debug('logged in');
        $('.container').animate({
            boxShadow: '0 0 30px rgba(0, 255, 0, 0.5)'
        }, 500);
        $('#text').html('才、才没有高兴呢！<br>哼！');
        setTimeout(() => {
            window.location = 'favorite.html';
        }, 1000);
    } else if (status.code == 802) {
        $('.container').animate({
            boxShadow: '0 0 20px rgba(255, 255, 0, 0.5)'
        }, 1000);
        $('#text').html('笨蛋笨蛋笨蛋！<br>怎么连授权都不会！');
    } else if (status.code == 800) {
        clearInterval(interval);
        console.debug('qr expired');
        window.location.reload();
    }
}, 5000);