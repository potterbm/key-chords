import { getNewEventHandler } from '../../chordTyper/handleEvent';
import bindings from '../../data/bindings';
import React, { useState, useCallback } from 'react';

import './styles.scss';

function App() {
  const [text, setText] = useState('');

  const collectEvents = useCallback(getNewEventHandler(setText), [])

  function handleKeyDown(event) {
    const eventData = {
      timeStamp: event.timeStamp,
      charCode: event.charCode,
      key: event.key,
      keyCode: event.keyCode,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      shiftKey: event.shiftKey,
      repeat: event.repeat,
    };

    collectEvents(eventData);
  }

  return (
    <div className="Root">
      <h1 className="Title">Type anything using the chords shown</h1>

      <dl className="Bindings">
        {Object.keys(bindings).map((key) => (
          <div key={key}>
            <dt>{key}</dt>
            <dd>{bindings[key]}</dd>
          </div>
        ))}
      </dl>

      <div className="TextOutput"></div>

      <textarea className="TypingArea" placeholder="Type something here…" onKeyDown={handleKeyDown} value={text} />
    </div>
  );
}

export default App;
