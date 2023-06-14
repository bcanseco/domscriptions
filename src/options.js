import {DEFAULT_TINT_COLOR, SAVED_TINT_COLOR_NAME} from './constants';

const colorPicker = document.querySelector('#picker');
colorPicker.addEventListener('input', (e) => chrome.storage.local.set({
  [SAVED_TINT_COLOR_NAME]: e.target.value,
}));

chrome.storage.local.get(SAVED_TINT_COLOR_NAME, ({[SAVED_TINT_COLOR_NAME]: tint}) => {
  colorPicker.value = tint || DEFAULT_TINT_COLOR;
});
