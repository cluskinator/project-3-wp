'use strict';

var ADJECTIVES = [
  'user', 'language partner'
];

var FIRST_NAMES = [
  '1',
];

var LAST_NAMES = [
  '1', '5', '6', '2', '3', '4', '7', '8', '9' 
];

function randomItem(array) {
  var randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

module.exports = function randomName() {
  return randomItem(ADJECTIVES) +
    randomItem(FIRST_NAMES) +
    randomItem(LAST_NAMES);
};
