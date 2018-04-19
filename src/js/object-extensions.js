Object.arrayify = function (obj) {
  let ret = [];
  Object.keys(obj).forEach((key) => {
    ret.push({key, value: obj[key]});
  })

  return ret;
}
