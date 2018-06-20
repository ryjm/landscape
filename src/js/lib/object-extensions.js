import Mousetrap from 'mousetrap';

Mousetrap.prototype.stopCallback = (e, element, combo) => {
  if (typeof element.dataset.mousetrap !== undefined) {
    return false
  }

  return element.tagName == 'INPUT' || element.tagName == 'SELECT' || element.tagName == 'TEXTAREA' || (element.contentEditable && element.contentEditable == 'true');
}

Object.arrayify = function (obj) {
  let ret = [];
  Object.keys(obj).forEach((key) => {
    ret.push({key, value: obj[key]});
  })

  return ret;
}

Array.prototype.uniq = function(key) {
  let ret = [];

  for (var i = 0; i < this.length; i++) {
    let exists = false;

    for (var j = 0; j < ret.length; j++) {
      if (ret[j][key] === this[i][key]) exists = true;
    }

    if (!exists) ret.push(this[i]);
  }

  return ret;
}
