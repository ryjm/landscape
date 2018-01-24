class Utilities {
  getQueryParams() {
    if (window.location.search !== "") {
      return JSON.parse('{"' + decodeURI(window.location.search.substr(1).replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}');
    } else {
      return {};
    }
  }
}

export let util = new Utilities();
