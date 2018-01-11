import "babel-polyfill";
import { UrbitRouter } from "./js/urbit-router.js";
import { UrbitApi } from "./js/urbit-api.js";

window.runapp = () => {
  console.log('app running');
  var router = new UrbitRouter();
}
