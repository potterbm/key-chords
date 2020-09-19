const TIMEOUT = 25;

export default function debounceCollect(callback, timeout = TIMEOUT) {
  const calledWith = [];
  let timeoutID = null;

  return (param) => {
    if (timeoutID === null) {
      timeoutID = window.setTimeout(() => {
        callback(calledWith);
        calledWith.length = 0; // Clear array
        timeoutID = null;
      }, timeout);
    }

    calledWith.push(param);
  };
}
