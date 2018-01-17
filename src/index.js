import "babel-polyfill";
import { UrbitRouter } from "./js/urbit-router.js";
import { UrbitApi } from "./js/urbit-api.js";

window.runapp = () => {
  if (!window.loaded) {
    console.log('app running');
    var router = new UrbitRouter();
    window.loaded = true;
  }
}
