import { api } from '/api';
// import { operator } from '/operator';
// import { router } from '/router';
import { warehouse } from '/warehouse';

export function createDMStation(station, foreign) {
  let circle = station.split("/")[1];
  let everyoneElse = circle.split(".").filter((ship) => ship !== api.authTokens.ship);

  api.hall({
    create: {
      nom: circle,
      des: "dm",
      sec: "village"
    }
  });

  warehouse.pushCallback("circles", (rep) => {
    api.hall({
      source: {
        nom: 'inbox',
        sub: true,
        srs: [`~${api.authTokens.ship}/${rep.data.cir}`]
      }
    })
  });

  warehouse.pushCallback("circle.config.dif.full", (rep) => {
    api.permit(circle, everyoneElse, !foreign);
  });

  if (foreign) {
    warehouse.pushCallback("circle.config.dif.full", (rep) => {
      api.hall({
        source: {
          nom: circle,
          sub: true,
          srs: [station]
        }
      })
    });
  }
}
