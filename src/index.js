import "babel-polyfill";
import { UrbitRouter } from "./js/urbit-router";
import { api } from './js/urbit-api';

console.log('app running');

fetch('/~/auth.json',{credentials: "same-origin"}).then((res) => {
  return res.json();
})
.then((authTokens) => {
  api.setAuthTokens(authTokens);

  window.router = new UrbitRouter();
});
