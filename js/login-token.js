$('#text').dblclick(() => {
    console.debug('activated cookie login');
    let input = prompt('Cookie 什么的，一点也不甜，我才不要呢!!', localStorage.getItem('cookie'));
    localStorage.setItem('cookie', input);
    $('.container').css({
        boxShadow: '0 0 40px rgba(255, 255, 0, 0.5)'
    }, 1000);
    setTimeout(() => {
        window.location.reload();
    }, 2000);
});