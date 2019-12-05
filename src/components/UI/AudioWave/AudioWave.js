var context, 
    analyser, 
    canvas, 
    ctx, 
    audio, 
    source,
    fbc_array, 
    bars, 
    bar_x, 
    bar_width, 
    bar_height, 
    grd,
    stop;

function frameLooper() {

    if (!stop) {
        window.requestAnimationFrame(frameLooper);
    }
    fbc_array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(fbc_array);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = grd;
    bars = 1024;
    for (var i=0; i<bars; i++) {
        bar_x = i * 1;
        bar_width = 1;
        bar_height = -(fbc_array[i] / 4);
        ctx.fillRect(bar_x, canvas.height / 2 - 1, bar_width, bar_height);
        ctx.fillRect(bar_x, canvas.height / 2 + 1 , bar_width, -bar_height);
    }
        

}

module.exports.createAnalyser = () => {

    stop = false;
    context = new AudioContext();
    analyser = context.createAnalyser();
    canvas = document.getElementById('voicesignal');
    ctx = canvas.getContext('2d');
    grd = ctx.createLinearGradient(0, 0, 170, 0);
    grd.addColorStop(0, '#8c93d8');
    grd.addColorStop(1, '#89c8e5');
    audio = document.getElementById('voicesample');
    source = context.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(context.destination);
    frameLooper();

}

module.exports.killWave = () => {
    stop = true;
}