import "babel-polyfill";
import "/lib/object-extensions";
import { UrbitRouter } from "/router";
import { api } from '/api';

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
