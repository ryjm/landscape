export function getQueryParams() {
  if (window.location.search !== "") {
    return JSON.parse('{"' + decodeURI(window.location.search.substr(1).replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}');
  } else {
    return {};
  }
}

export function uuid() {
  let str = "0v"
  str += Math.ceil(Math.random()*8)+"."
  for (var i = 0; i < 5; i++) {
    let _str = Math.ceil(Math.random()*10000000).toString(32);
    _str = ("00000"+_str).substr(-5,5);
    str += _str+".";
  }

  return str.slice(0,-1);
}

export function arrayEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function deSig(ship) {
  return ship.replace('~', '');
}

// use urbit.org proxy if it's not on our ship
export function foreignUrl(shipName, own, urlFrag) {
  if (deSig(shipName) != deSig(own)) {
    return `http://${deSig(shipName)}.urbit.org${urlFrag}`
  } else {
    return urlFrag
  }
}

// shorten comet names
export function prettyShip(ship) {
  const sp = ship.split('-');
  return sp.length == 9 ? `${sp[0]}_${sp[8]}`: ship;
}


