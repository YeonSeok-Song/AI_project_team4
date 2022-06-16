import React from 'react';
// import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import './styles.css';

class App extends React.Component {
  videoRef = React.createRef();
  canvasRef = React.createRef();

  componentDidMount() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const webCamPromise = navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            facingMode: 'user',
          },
        })
        .then((stream) => {
          window.stream = stream;
          this.videoRef.current.srcObject = stream;
          return new Promise((resolve, reject) => {
            this.videoRef.current.onloadedmetadata = () => {
              resolve();
            };
          });
        });
      const modelPromise = cocoSsd.load();
      Promise.all([modelPromise, webCamPromise])
        .then((values) => {
          this.detectFrame(this.videoRef.current, values[0]);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  detectFrame = (video, model) => {
    model.detect(video).then((predictions) => {
      this.renderPredictions(predictions);
      requestAnimationFrame(() => {
        this.detectFrame(video, model);
      });
    });
  };

  renderPredictions = (predictions) => {
    const ctx = this.canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Font options.
    const font = '16px sans-serif';
    ctx.font = font;
    ctx.textBaseline = 'top';
    predictions.forEach((prediction) => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      // Draw the bounding box.
      ctx.strokeStyle = '#00FFFF';
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, width, height);
      // Draw the label background.
      ctx.fillStyle = '#00FFFF';
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt(font, 10); // base 10
      ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
    });

    predictions.forEach((prediction) => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      // Draw the text last to ensure it's on top.
      ctx.fillStyle = '#000000';
      ctx.fillText(prediction.class, x, y);
      // 웹캠에서 person을 인식할 경우
      if (prediction.class === 'person') {
        console.log('person');
      } else {
        console.log('Not person!');
      }
    });
    if (predictions.length === 0) {
      console.log('No class');
    }
  };

  render() {
    return (
      <div>
        <video
          className='size'
          autoPlay
          playsInline
          muted
          ref={this.videoRef}
          width='600'
          height='500'
        >
          <canvas
            className='size'
            ref={this.canvasRef}
            width='600'
            height='500'
          />
        </video>
      </div>
    );
  }
}

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(<App />);