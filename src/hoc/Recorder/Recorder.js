var recordingObject = {
    microphone: null,
    recorder: null,
    frequencyBins: null,
    jsNode: null,
    analyzerNode: null,
    audioContext: null,
    chunks: [],
    last: null
};

module.exports.startRecording = function () {

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {

            recordingObject.microphone = stream;
            var audioContext = new AudioContext();
            var sourceNode = audioContext.createMediaStreamSource(stream);
            var volumeNode = audioContext.createGain();
            var analyzerNode = audioContext.createAnalyser();
            var outputNode = audioContext.createMediaStreamDestination();

            sourceNode.channelCount = 1;
            volumeNode.channelCount = 1;
            analyzerNode.channelCount = 1;
            outputNode.channelCount = 1;

            sourceNode.connect(volumeNode);
            volumeNode.connect(analyzerNode);
            analyzerNode.connect(outputNode);

            recordingObject.recorder = new MediaRecorder(outputNode.stream);

            analyzerNode.fftSize = 128;
            analyzerNode.smoothingTimeConstant = 0.96;
            recordingObject.frequencyBins = new Uint8Array(analyzerNode.frequencyBinCount);

            recordingObject.jsNode = audioContext.createScriptProcessor(256, 1, 1);
            recordingObject.jsNode.connect(audioContext.destination);

            var beeperVolume = audioContext.createGain();
            beeperVolume.connect(audioContext.destination);

            recordingObject.analyzerNode = analyzerNode;
            recordingObject.audioContext = audioContext;


            recordingObject.chunks = [];
            recordingObject.recorder.ondataavailable = (e) => {
                recordingObject.chunks.push(e.data);
            };

            // recordingObject.jsNode.onaudioprocess = () => {
            //     recordingObject.analyzerNode.getByteFrequencyData(recordingObject.frequencyBins);
            //     let sum = 0;
            //     for (var i = 0; i < recordingObject.frequencyBins.length; i++) {
            //         sum += recordingObject.frequencyBins[i];
            //     }
            //     // let average = sum / recordingObject.frequencyBins.length;
            // }

            recordingObject.recorder.start(20000);


        })
        .catch(error => {
            console.log('An error occured while trying to record the sample:');
            console.log(error);
        });

}


module.exports.stopRecording = function () {

    return new Promise((res, rej) => {

        recordingObject.jsNode.onaudioprocess = undefined;

        recordingObject.recorder.onstop = (e) => {
            let blob = new Blob(recordingObject.chunks, { type: 'audio/wav' });
            // let blob2 = new Blob(recordingObject.chunks, { type: 'audio/ogg; codecs=opus' });
            recordingObject.last = {
                url: URL.createObjectURL(blob),
                blob: blob
            }
            // var a1 = document.createElement('a');
            // var a2 = document.createElement('a');
            // document.body.appendChild(a1);
            // document.body.appendChild(a2);
            // a1.href = URL.createObjectURL(blob);
            // a2.href = URL.createObjectURL(blob2);
            // a1.download = "blob";
            // a2.download = "blob2";
            // a1.click();
            // a2.click();
            res(recordingObject.last);
        }

        recordingObject.recorder.stop();

    });

}