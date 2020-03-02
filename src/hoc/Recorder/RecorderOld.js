var recorder = null;
var recordingLength = 0;
var mediaStream = null;
var sampleRate = 44100;
var context = null;
var blob = null;
var recBuffers = [];
var numChannels = 2;
var bufferSize = 4096;

module.exports.startRecording = function () {

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            context = new AudioContext();
            sampleRate = context.sampleRate;
            mediaStream = context.createMediaStreamSource(stream);

            if (context.createScriptProcessor) {
                recorder = context.createScriptProcessor(bufferSize, numChannels, numChannels);
            } else {
                recorder = context.createJavaScriptNode(bufferSize, numChannels, numChannels);
            }

            initBuffers();

            recorder.onaudioprocess = function (e) {
                var buf;
                for (var channel = 0; channel < numChannels; channel++) {
                    buf = new Float32Array(e.inputBuffer.getChannelData(channel));
                    recBuffers[channel].push(buf);
                }
                recordingLength += buf.length;
            }
            
            mediaStream.connect(recorder);
            recorder.connect(context.destination);
        })
        .catch(error => {
            console.log('An error occured while trying to record the sample:');
            console.log(error);
        });
}

module.exports.stopRecording = function () {

    recorder.disconnect(context.destination);
    mediaStream.disconnect(recorder);

    let buffers = [];
    for (var channel = 0; channel < numChannels; channel++) {
        buffers.push(flattenArray(recBuffers[channel], recordingLength));
    }
    let interleaved;
    if (numChannels === 2) {
        interleaved = interleave(buffers[0], buffers[1]);
    } else {
        interleaved = buffers[0];
    }

    var buffer = new ArrayBuffer(44 + interleaved.length * 2);
    var view = new DataView(buffer);

    writeUTFBytes(view, 0, 'RIFF');
    view.setUint32(4, 36 + interleaved.length * 2, true);
    writeUTFBytes(view, 8, 'WAVE');
    writeUTFBytes(view, 12, 'fmt ');
    view.setUint32(16, 16, true); 
    view.setUint16(20, 1, true); 
    view.setUint16(22, numChannels, true); 
    view.setUint32(24, sampleRate, true); 
    view.setUint32(28, sampleRate * 4, true); 
    view.setUint16(32, numChannels * 2, true); 
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, interleaved.length * 2, true);

    floatTo16BitPCM(view, 44, interleaved);

    blob = new Blob([view], { type: 'audio/wav' });

    initializeVariables();

    return blob;
}




function initBuffers() {
    for (let channel = 0; channel < numChannels; channel++) {
        recBuffers[channel] = [];
    }
}

function flattenArray (channelBuffer, recordingLength) {
    var result = new Float32Array(recordingLength);
    var offset = 0;
    for (var i = 0; i < channelBuffer.length; i++) {
        result.set(channelBuffer[i], offset);
        offset += channelBuffer[i].length;
    }
    return result;
}

function interleave (leftChannel, rightChannel) {
    var length = leftChannel.length + rightChannel.length;
    var result = new Float32Array(length);
    var inputIndex = 0;
    for (var index = 0; index < length;) {
        result[index++] = leftChannel[inputIndex];
        result[index++] = rightChannel[inputIndex];
        inputIndex++;
    }
    return result;
}

function writeUTFBytes (view, offset, string) {
    for (var i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

function initializeVariables () {
    recorder = null;
    recordingLength = 0;
    mediaStream = null;
    context = null;
}

function floatTo16BitPCM(output, offset, input) {
    for (let i = 0; i < input.length; i++, offset += 2) {
        let s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
}



// var leftchannel = [];
// // var rightchannel = [];
// var recorder = null;
// var recordingLength = 0;
// var mediaStream = null;
// var sampleRate = 44100;
// var bufferSize = 4096;
// var context = null;
// var blob = null;
// var numberOfInputChannels = 1;
// var numberOfOutputChannels = 1;

// module.exports.startRecording = function () {
//     navigator.mediaDevices.getUserMedia({ audio: true })
//         .then(stream => {
//             console.log("Start recording...");
//             window.AudioContext = window.AudioContext || window.webkitAudioContext;
//             context = new AudioContext();
//             mediaStream = context.createMediaStreamSource(stream);
            
//             if (context.createScriptProcessor) {
//                 recorder = context.createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels);
//             } else {
//                 recorder = context.createJavaScriptNode(bufferSize, numberOfInputChannels, numberOfOutputChannels);
//             }
            
//             recorder.onaudioprocess = function (e) {
//                 leftchannel.push(new Float32Array(e.inputBuffer.getChannelData(0)));
//                 // rightchannel.push(new Float32Array(e.inputBuffer.getChannelData(1)));
//                 recordingLength += bufferSize;
//             }

//             mediaStream.connect(recorder);
//             recorder.connect(context.destination);
//         })
//         .catch(error => {
//             console.log('An error occured while trying to record the sample:');
//             console.log(error);
//         });
// }

// module.exports.stopRecording = function () {

//     recorder.disconnect(context.destination);
//     mediaStream.disconnect(recorder);

//     var leftBuffer = flattenArray(leftchannel, recordingLength);
//     // var rightBuffer = flattenArray(rightchannel, recordingLength);

//     // var interleaved = interleave(leftBuffer, rightBuffer);
//     var interleaved = leftBuffer;

//     var buffer = new ArrayBuffer(44 + interleaved.length * 2);
//     var view = new DataView(buffer);

//     writeUTFBytes(view, 0, 'RIFF');
//     view.setUint32(4, 36 + interleaved.length * 2, true);
//     writeUTFBytes(view, 8, 'WAVE');
//     writeUTFBytes(view, 12, 'fmt ');
//     view.setUint32(16, 16, true); 
//     view.setUint16(20, 1, true); 
//     view.setUint16(22, numberOfInputChannels, true); 
//     view.setUint32(24, sampleRate, true); 
//     view.setUint32(28, sampleRate * 4, true);
//     view.setUint16(32, numberOfInputChannels * 2, true); 
//     view.setUint16(34, 16, true); 

//     writeUTFBytes(view, 36, 'data');
//     view.setUint32(40, interleaved.length * 2, true);

//     var index = 44;
//     var volume = 1;
//     for (var i = 0; i < interleaved.length; i++) {
//         view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
//         index += 2;
//     }

//     blob = new Blob([view], { type: 'audio/wav' });
//     initializeVariables();
//     return blob;
// }

// var flattenArray = function (channelBuffer, recordingLength) {
//     var result = new Float32Array(recordingLength);
//     var offset = 0;
//     for (var i = 0; i < channelBuffer.length; i++) {
//         var buffer = channelBuffer[i];
//         result.set(buffer, offset);
//         offset += buffer.length;
//     }
//     return result;
// }

// var interleave = function (leftChannel, rightChannel) {
//     var length = leftChannel.length + rightChannel.length;
//     var result = new Float32Array(length);
//     var inputIndex = 0;
//     for (var index = 0; index < length;) {
//         result[index++] = leftChannel[inputIndex];
//         result[index++] = rightChannel[inputIndex];
//         inputIndex++;
//     }
//     return result;
// }

// var writeUTFBytes = function (view, offset, string) {
//     for (var i = 0; i < string.length; i++) {
//         view.setUint8(offset + i, string.charCodeAt(i));
//     }
// }

// var initializeVariables = function () {
//     leftchannel = [];
//     // rightchannel = [];
//     recorder = null;
//     recordingLength = 0;
//     mediaStream = null;
//     context = null;
// }