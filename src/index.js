import "babel-polyfill";
import "./js/object-extensions";
import { UrbitRouter } from "./js/urbit-router";
import { api } from './js/urbit-api';

console.log('app running');

/*
  Common variables:

  station :    ~zod/club
  circle  :    club
  host    :    zod
*/

fetch('/~/auth.json',{credentials: "same-origin"}).then((res) => {
  return res.json();
})
.then((authTokens) => {
  api.setAuthTokens(authTokens);

  window.router = new UrbitRouter();
});
