import React, { Component } from 'react';
import classes from './Recording.css';

class Recording extends Component {

    startRecording = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();

                const audioChunks = [];

                mediaRecorder.addEventListener("dataavailable", event => {
                    audioChunks.push(event.data);
                });

                mediaRecorder.addEventListener("stop", () => {
                    var audioBlob = new Blob(audioChunks, {type: 'audio/mpeg-3'});
                    var audioUrl = URL.createObjectURL(audioBlob);
                    var audio = new Audio(audioUrl);
                    // let link = document.createElement('a');
                    // link.href = audioUrl;
                    // link.click();
                    audio.play();
                    // URL.revokeObjectURL(audioUrl);
                });

                setTimeout(() => {
                    mediaRecorder.stop();
                }, 10000);
            });
    } 


    /*
    componentDidMount() {
        // inserting script into index.html
        const script = document.createElement('script');
        script.src = audioRec;
        script.async = true;
        document.body.appendChild(script);
    }
    */

    render() {

        return (
            <div style={{ margin: '92px' }}>
                <button className={classes.Start} 
                    onClick={this.startRecording}>Record</button>
                <button className={classes.Stop}>Stop</button>
                <h3>Recordings</h3>
                <ol id="recordingsList"></ol>
            </div>
        );


    }
}

export default Recording;