import "/lib/object-extensions";
import { api } from '/api';
import { warehouse } from '/warehouse';
import { router } from '/router';
import { operator } from "/operator";
import * as util from '/lib/util';
import _ from 'lodash';

console.log('app running');

/*
  Common variables:

  station :    ~zod/club
  circle  :    club
  host    :    zod
*/

console.log(window.urb);
console.log(window.ship);

api.setAuthTokens({
  ship: window.ship
});

router.start();
operator.start();

window.util = util;
window._ = _;
