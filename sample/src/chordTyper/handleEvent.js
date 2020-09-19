import debounceCollect from './debounceCollect';
import generateTextFromEvents from './generateTextFromEvents';

function handleKeyboardEvents(callback) {
  return function (eventGroup) {
    const chordOutput = generateTextFromEvents(eventGroup);
    return callback(chordOutput);
  }
}

export function getNewEventHandler(callback, timeout) {
  return debounceCollect(handleKeyboardEvents(callback), timeout);
}
