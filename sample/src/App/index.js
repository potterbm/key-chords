import React, { useState, useCallback } from 'react';
import './styles.scss';

const bindings = {
  ex: 'export',
  cl: 'class',
  fn: 'function',
  ht: 'this',
  cst: 'const',
  rt: 'return',
  cnl: 'console',
};

const SPECIAL_KEYS = ['Space', 'Backspace', 'Enter'];
const META_KEYS = ['Shift', 'Meta', 'Alt', 'Control'];

const TIMEOUT = 25;

let fullText = '';

function alphabetize(word) {
  return word.split('').sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0)).join('');
}

function debounceCollect(timeout, callback) {
  const calledWith = [];
  let timeoutID = null;

  return (param) => {
    if (timeoutID === null) {
      timeoutID = window.setTimeout(() => {

        callback(calledWith);
        // Clear array
        calledWith.length = 0;
        timeoutID = null;
      }, timeout);
    }

    if (SPECIAL_KEYS.includes(param.key)) {
      callback(calledWith);
      // Clear array
      calledWith.length = 0;
      timeoutID = null;
    }

    calledWith.push(param);
  };
}

function compileChord(eventGroup) {
  const identifier = [];

  console.log('compiling', eventGroup.slice());

  if (eventGroup.length === 1) {
    if (META_KEYS.includes(eventGroup[0].key)) return '';
    return eventGroup[0].key;
  }

  eventGroup.forEach(event => {
    // if (event.metaKey) identifier.push('⌘', '-');
    // if (event.ctrlKey) identifier.push('ctrl', '-');
    // if (event.shiftKey) identifier.push('shift', '-');


    if (META_KEYS.includes(event.key)) return;
    identifier.push(event.key);
  });

  const output = bindings[alphabetize(identifier.join(''))];
  if (output !== undefined) return `${output} `;

  return `${identifier} `;
}

function App() {
  const [text, setText] = useState('');


  function handleChordEvents(eventGroup) {
    const chordOutput = compileChord(eventGroup);

    if (chordOutput === 'Backspace') {
      fullText = fullText.slice(0, fullText.length - 2);
      setText(fullText);
      return;
    }

    if (chordOutput === 'Enter') {
      fullText = `${fullText}\n`;
      setText(fullText);
      return;
    }

    fullText = `${fullText}${chordOutput}`;

    setText(fullText);
  }

  const collectEvents = useCallback(debounceCollect(TIMEOUT, handleChordEvents), [])

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
      <h1 className="Title">Type some stuff and see what happens</h1>

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
