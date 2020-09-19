import { META_KEYS } from './constants';
import bindings from '../data/bindings';

function alphabetize(word) {
  let array = word;
  if (typeof word === 'string') array = word.split('');

  return array.sort((a, b) => a.localeCompare(b));
}

function getNewText(eventGroup) {
  const identifier = [];

  let meta = false;
  let ctrl = false;
  let shift = false;
  let alt = false;

  if (eventGroup.length === 1) {
    if (META_KEYS.includes(eventGroup[0].key)) return { newText: '', raw: true };
    return { newText: eventGroup[0].key, raw: true };
  }

  eventGroup.forEach(event => {
    if (META_KEYS.includes(event.key)) return;
    identifier.push(event.key);
  });

  const rawIdentifier = identifier.slice();

  alphabetize(identifier);

  if (shift) identifier.unshift('shift-');
  if (alt) identifier.unshift('alt-');
  if (ctrl) identifier.unshift('ctrl-');
  if (meta) identifier.unshift('⌘-');

  const output = bindings[identifier.join('')];
  if (output !== undefined) return { newText: output, raw: false };

  return { newText: `${rawIdentifier.join('').split('-').pop()} `, raw: true };
}

let fullText = '';
export default function generateTextFromEvents(eventGroup) {
  const { newText, raw } = getNewText(eventGroup);

  if (raw && newText === 'Backspace') {
    fullText = fullText.slice(0, fullText.length - 1);
    return fullText;
  }

  if (raw && newText === 'Enter') {
    fullText = `${fullText}\n`;
    return fullText;
  }

  if (newText.length === 0) return fullText;

  let spacePrefix = '';
  let spaceSuffix = '';

  if (!raw) {
    if (fullText.length > 0 && !/\s/.test(fullText[fullText.length - 1])) spacePrefix = ' ';
    spaceSuffix = ' ';
  }

  fullText = `${fullText}${spacePrefix}${newText}${spaceSuffix}`;

  return fullText;
}
