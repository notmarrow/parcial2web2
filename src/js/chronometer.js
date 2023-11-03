let interv;
let remainingTime = 60; 

function timer() {
    if (remainingTime > 0) {
        remainingTime--;

        let min = Math.floor(remainingTime / 60);
        let sec = remainingTime % 60;

        min = min.toString().padStart(2, '0');
        sec = sec.toString().padStart(2, '0');

        postMessage(min + ":" + sec);
    } else {
        postMessage("00:00");
        clearInterval(interv);
    }
}

onmessage = function (ev) {
    if (ev.data === 'start') {
        interv = setInterval(timer, 1000); // Update every second
        remainingTime = 60;
    } else if (ev.data === 'end') {
        clearInterval(interv);
    }
};