'use strict';

export function isEmptyObject(obj) {
  for (var key in obj) {
    return false;
  }
  return true;
}

