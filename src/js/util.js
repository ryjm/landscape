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
}

export let util = new Utilities();
