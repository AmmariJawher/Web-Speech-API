import { useState } from 'react';
import { CircleNotch, Smiley } from '@phosphor-icons/react';
import './App.css';

const recognition = new window.webkitSpeechRecognition();
recognition.continuous = false;
recognition.interimResults = true;
recognition.lang = "en-US";
recognition.maxAlternatives = 0;

function App() {
  const [finalTranscript, setFinalTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingColor, setLoadingColor] = useState('#0693e3');


  recognition.onresult = (event) => {
    let finalTranscript = '';
    let interimTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript = event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    setFinalTranscript(finalTranscript);
    setInterimTranscript(interimTranscript);
  };
  
  // Start loading animation when app start recording user audio
  recognition.onaudiostart = () => {
    setIsLoading(true)
  };

  // App stops recording but keeps on analysing the audio.
  recognition.onaudioend = () => {
    setLoadingColor('#9b51e0');
  };

  // when user click stop recording
  recognition.onstop = () => {
    setIsLoading(false)
  };
  
  // Prompt error
  recognition.onerror = () => {
    setIsLoading(false)
  };
  
  // Ask user to repeat
  recognition.onnomatch = () => {
    setIsLoading(false)
  };
  
  // Hide loading app finish the final transcript
  recognition.onend = () => {
    setIsLoading(false)
    setLoadingColor('#0693e3');
  };


  return (
    <div className="App">
      <div className="card">
          <div className="result">
              {isLoading?
                <CircleNotch className='spin' size="100" weight='regular' color={loadingColor} />
                :
                <Smiley size="100" weight='regular' color='#0693e3' />
              }
          </div>
          <div className="output-box">
              <p className="interim">{interimTranscript}</p>
              <p className="output">{finalTranscript}</p>
          </div>
          <div className="controlls">
              <button
                className="start"
                type="button"
                disabled={isLoading}
                onClick={() => recognition.start()}
                >
                  <i className="ph-fill ph-play"></i>
                  Start Record
              </button>
              <button 
                className="stop"
                type="button"
                disabled={!isLoading}
                onClick={() => recognition.stop()}
              >
                  <i className="ph-fill ph-square"></i>
                  Stop Record
              </button>
          </div>
      </div>
    </div>
  );
}

export default App;
