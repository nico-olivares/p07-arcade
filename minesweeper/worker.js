onmessage = function(e) {
<<<<<<< HEAD
    if (e.data === 'start') {
        isActive = true;
        timer();
    }
    if (e.data === 'stop') {
        isActive = false;
    }

};

let isActive = true;


function timer() {
    let theTimer = setInterval(tictoc, 1000);
    let counter = 0;

    function tictoc() {
        if (isActive) {
        counter += 1;
        postMessage(counter);
        } else {
            counter = 0;
            clearInterval(theTimer);
        }
    }
}
=======
    timer(e.data);
};

/**
 * Second counter that begins with message sent. Ends when worker is terminated.
 * @param {String} message 
 */
function timer(message) {
    let theTimer = setInterval(tictoc, 1000);
    let counter = 0;
    
    function tictoc() {
        counter += 1;
        postMessage(counter);
    }
}
>>>>>>> adcb3d31b472541563991abb727cc903b1ea31b7
