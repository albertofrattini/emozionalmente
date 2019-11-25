// import { worker } from 'cluster';

// stream from getUserMedia()
var gumStream;
// WebAudioRecorder object
var recorder;
var input;
var encondingType = 'wav';
var audioContext = new AudioContext();

function createDownloadLink(blob, encoding) {
    var recordingsList = document.getElementById('recordingsList');
    var url = URL.createObjectURL(blob);
    var au = document.createElement('audio');
    var li = document.createElement('li');
    var link = document.createElement('a');
    //add controls to the "audio" element 
    au.controls = true;
    au.src = url; //link the a element to the blob 
    link.href = url;
    link.download = new Date().toISOString() + '.' + encoding;
    link.innerHTML = link.download;
    //add the new audio and a elements to the li element 
    li.appendChild(au);
    li.appendChild(link); //add the li element to the ordered list 
    recordingsList.appendChild(li);
}


module.exports.startRecording = function () {

    console.log('startRecording() called');

    // TODO: find more constraints
    var constraints = {
        audio: true,
        video: false
    }

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {

            gumStream = stream;
            input = audioContext.createMediaStreamSource(stream);
            input.connect(audioContext.destination);
            recorder = new window.WebAudioRecorder(input, {
                workerDir: 'src/',
                encoding: encondingType,
                onEncoderLoading: function(recorder, encoding) {
                    console.log('Loading ' + encoding + recorder + ' encoder...');
                },
                onEncoderLoaded: function(recorder, encoding) {
                    console.log(encoding + ' encoder loaded');
                }
            });
            recorder.onComplete = function(recorder, blob) {
                console.log('Inside onComplete');
                createDownloadLink(blob, recorder.encoding);
            }
            recorder.setOptions({
                timeLimit: 120,
                encodeAfterRecord: true
            });
            recorder.startRecording();
        })
        .catch(function (err) {
            console.log(err);
        });
    
    

}

module.exports.stopRecording = function () {

    console.log("stopRecording() called");
    //stop microphone access 
    gumStream.getAudioTracks()[0].stop();
    //disable the stop button 
    // stopButton.disabled = true;
    // recordButton.disabled = false;
    //tell the recorder to finish the recording (stop recording + encode the recorded audio) 
    recorder.finishRecording();
    console.log('Recording stopped');

}