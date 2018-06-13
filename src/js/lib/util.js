import _ from 'lodash';

export function getQueryParams() {
  if (window.location.search !== "") {
    return JSON.parse('{"' + decodeURI(window.location.search.substr(1).replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}');
  } else {
    return {};
  }
}

export function collectionAuthorization(stationDetails, usership) {
  if (stationDetails.host === usership) {
    return "write";
  } else if (_.has(stationDetails, "config.con.sec")) {
    let sec = _.get(stationDetails, "config.con.sec", null);
    if (sec === "journal") {
      return "write";
    }
  }

  return "read";
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

export function parseCollCircle(st) {
  let collMeta = /(.*)\/collection_~(~[a-z,\.,0-9]*)(:?_~)?(:?~.*)?/.exec(st);
  let r;
  // console.log('regex', collMeta);
  if (collMeta) {
    r = {
      ship: collMeta[1],
      coll: collMeta[2],
      top: collMeta[4]
    }
  }
  return r;
}

export function daToDate(st) {
  var dub = function(n) {
    return parseInt(n) < 10 ? "0" + parseInt(n) : n.toString();
  };
  var da = st.split('..');
  var bigEnd = da[0].split('.');
  var lilEnd = da[1].split('.');
  var ds = `${bigEnd[0].slice(1)}-${dub(bigEnd[1])}-${dub(bigEnd[2])}T${dub(lilEnd[0])}:${dub(lilEnd[1])}:${dub(lilEnd[2])}Z`;
  return new Date(ds);
}

  // ascending for clarity
export function sortSrc(circleArray, topic=false){
  let sc = circleArray.map((c) => util.parseCollCircle(c)).filter((pc) => typeof pc != 'undefined' && typeof pc.top == 'undefined');
  return sc.map((src) => src.coll).sort((a, b) => util.daToDate(a) - util.daToDate(b));
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

export function isDMStation(station) {
  let host = station.split('/')[0].substr(1);
  let circle = station.split('/')[1];

  return (
    station.indexOf('.') !== -1 &&
    circle.indexOf(host) !== -1
  );
}

export function calculateStations(configs) {
  let numSubs = Object.keys(configs).filter((sta) => !isDMStation(sta) && !sta.includes("inbox")).length;
  let numDMs = Object.keys(configs).filter((sta) => isDMStation(sta)).length;

  let numString = [];
  if (numSubs) numString.push(`${numSubs} subscriptions`);
  if (numDMs) numString.push(`${numDMs} DMs`);

  numString = numString.join(", ");

  return numString;
}

export function getStationDetails(station, config = {}, usership) {
  let host = station.split("/")[0].substr(1);

  let ret = {
    type: "none",
    station: station,
    config: config,
    host: host,
    cir: station.split("/")[1],
    hostProfileUrl: `/~~/~${host}/==/web/pages/nutalk/profile`
  };

  let collParts = parseCollCircle(station);

  if (station.includes("inbox")){
    ret.type = "inbox";
  } else if (isDMStation(station)) {
    ret.type = "dm";
  } else if ((station.includes("collection") && collParts.top)) {
    ret.type = "text-topic";
  } else if ((station.includes("collection") && !collParts.top)) {
    ret.type = "text";
  } else {
    ret.type = "chat";
  }

  switch (ret.type) {
    case "inbox":
      ret.stationUrl = "/~~/pages/nutalk";
      ret.stationTitle = ret.cir;
      break;
    case "chat":
      ret.stationUrl = `/~~/pages/nutalk/stream?station=${station}`;
      ret.stationTitle = ret.cir;
      break;
    case "dm":
      if (config.con) {
        ret.stationTitle = ret.cir
          .split(".")
          .filter((mem) => mem !== usership)
          .map((mem) => `~${mem}`)
          .join(", ");;
      } else {
        ret.stationTitle = "unknown";
      }

      ret.stationUrl = `/~~/pages/nutalk/stream?station=${station}`;
      break;
    case "text":
      ret.collId = collParts.coll;
      ret.stationUrl = `/~~/~${ret.host}/==/web/collections/${collParts.coll}`;
      ret.stationTitle = config.cap;
      break;
    case "text-topic":
      ret.collId = collParts.coll;
      ret.stationUrl = `/~~/~${ret.host}/==/web/collections/${collParts.coll}`;
      ret.stationTitle = config.cap;
      ret.postUrl = `/~~/~${ret.host}/==/web/collections/${collParts.coll}/${collParts.top}`;
      ret.postId = collParts.top;
      ret.postTitle = null;  // TODO: Should be able to determine this from the station metadata alone.
      break;
  }

  return ret;
}

export function getMessageContent(msg, stationDetails) {
  let ret = {};

  switch (stationDetails.type) {
    case "inbox":
      if (_.has(msg, 'sep.app.sep.fat')) {
        ret.type = "app";
        ret.content = msg.sep.app.sep.fat.sep.lin.msg;
      } else if (_.has(msg, 'sep.url')) {
        ret.type = "url";
        ret.content = msg.sep.url;
      } else if (_.has(msg, 'sep.app.sep.lin')) {
        ret.type = "app";
        ret.content = msg.sep.app.sep.lin.msg;
      } else if (_.has(msg, 'sep.inv')) {
        ret.type = "inv";
        ret.content = `invite to ${msg.sep.inv.cir}...`;
        ret.station = msg.sep.inv.cir;
      }
      break;
    // do these need to be all separate?
    case "chat":
      if (_.has(msg, 'sep.url')) {
        ret.type = "url";
        ret.content = msg.sep.url;
      } else {
        ret.content = msg.sep.lin.msg;
      }
      break;
    case "dm":
      if (_.has(msg, 'sep.url')) {
        ret.type = "url";
        ret.content = msg.sep.url;
      } else {
        ret.content = msg.sep.lin.msg;
      }
      break;
    case "text":
      if (_.has(msg, 'sep.lin.msg')) {
        ret.content = msg.sep.lin.msg
      } else if (_.has(msg, 'sep.fat.sep.lin.msg')) {
        let metadata = msg.sep.fat.sep.lin.msg.split("|");
        ret.content = msg.sep.fat.tac.text.substr(0, 500);
        ret.postId = metadata[0];
        ret.postTitle = metadata[1] || ret.content.substr(0, 20);
        ret.postUrl = `${stationDetails.stationUrl}/${metadata[0]}`;
      }
      break;
    case "text-topic":
      ret.content = msg.sep.fat.tac.text;
      break;
  }

  return ret;
}

// maybe do fancier stuff later
export function isUrl(string) {
  const r = /^http|^www|\.com$/.exec(string)
  if (r) {
    return true
  }
  else {
    return false
  }
}
