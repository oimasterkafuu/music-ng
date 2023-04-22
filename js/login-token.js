$('#text').dblclick(() => {
    console.debug('activated cookie login');
    let input = prompt('Cookie 什么的，一点也不甜，我才不要呢!!', localStorage.getItem('cookie'));
    localStorage.setItem('cookie', input);
    window.location.reload();
});