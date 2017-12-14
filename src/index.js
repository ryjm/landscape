import "babel-polyfill";
import { UrbitRouter } from "./js/router.js";
import { UrbitApi } from "./js/urbit-api.js";

window.runapp = () => {
  var router = new UrbitRouter();
  var api = new UrbitApi();
}
