import "babel-polyfill";
import { UrbitRouter } from "./js/urbit-router.js";
import { api } from './js/urbit-api.js';

console.log('app running');

fetch('/~/auth.json',{credentials: "same-origin"}).then((res) => {
  return res.json();
})
.then((authTokens) => {
  api.setAuthTokens(authTokens);

  var router = new UrbitRouter();
});
