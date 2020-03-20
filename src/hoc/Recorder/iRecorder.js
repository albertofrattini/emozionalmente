// var mic, recorder, soundFile;
var sampleRate = 44100;

// module.exports.startRecording = function () {

//     mic = new p5.AudioIn();
//     mic.start();
//     recorder = new p5.SoundRecorder();
//     recorder.setInput(mic);
//     soundFile = new p5SoundFile();
//     recorder.record(soundFile);
    
// }


// module.exports.stopRecording = function () {

//     recorder.stop();
//     let view = convertToWav(soundFile);
//     let blob = new Blob([view], { type: 'audio/wav' });
//     return {
//         url: URL.createObjectURL(blob),
//         blob: blob
//     };

// }


module.exports.convertToWav = function (audioBuffer) {

    var leftChannel, rightChannel;
    leftChannel = audioBuffer.getChannelData(0);

    // handle mono files
    if (audioBuffer.numberOfChannels > 1) {
      rightChannel = audioBuffer.getChannelData(1);
    } else {
      rightChannel = leftChannel;
    }

    var interleaved = interleave(leftChannel, rightChannel);

    // create the buffer and view to create the .WAV file
    var buffer = new window.ArrayBuffer(44 + interleaved.length * 2);
    var view = new window.DataView(buffer);

    // RIFF chunk descriptor
    writeUTFBytes(view, 0, 'RIFF');
    view.setUint32(4, 36 + interleaved.length * 2, true);
    writeUTFBytes(view, 8, 'WAVE');
    // FMT sub-chunk
    writeUTFBytes(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    // stereo (2 channels)
    view.setUint16(22, 2, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 4, true);
    view.setUint16(32, 4, true);
    view.setUint16(34, 16, true);
    // data sub-chunk
    writeUTFBytes(view, 36, 'data');
    view.setUint32(40, interleaved.length * 2, true);

    // write the PCM samples
    var lng = interleaved.length;
    var index = 44;
    var volume = 1;
    for (var i = 0; i < lng; i++) {
      view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
      index += 2;
    }

    return view;

  }

  function interleave(leftChannel, rightChannel) {
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


  function writeUTFBytes(view, offset, string) {
    var lng = string.length;
    for (var i = 0; i < lng; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }





