class Utilities {
  getQueryParams() {
    if (window.location.search !== "") {
      return JSON.parse('{"' + decodeURI(window.location.search.substr(1).replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}');
    } else {
      return {};
    }
  }

  uuid() {
    let str = "0v"
    str += Math.ceil(Math.random()*8)+"."
    for (var i = 0; i < 5; i++) {
      let _str = Math.ceil(Math.random()*10000000).toString(32);
      _str = ("00000"+_str).substr(-5,5);
      str += _str+".";
    }

    return str.slice(0,-1);
  }

  arrayEqual(a, b) {
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
}

export let util = new Utilities();
