function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

sleep(2000)