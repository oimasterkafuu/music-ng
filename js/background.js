$(() => {
    setInterval(() => {
        // random bg position
        $('body').css('background-position-x', `${Math.random() * 100}%`);
        $('body').css('background-position-y', `${Math.random() * 100}%`);
    }, 6000);
});