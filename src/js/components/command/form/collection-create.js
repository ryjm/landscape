import React, { Component } from 'react';
import { CommandForm } from '/components/command/form';
import { getStationDetails } from '/lib/util';
import { TRANSITION_LOADING } from '/lib/constants';
import _ from 'lodash';
import urbitOb from 'urbit-ob';

export class CommandFormCollectionCreate extends Component {
  getCollectionCreateForm() {
    return {
      fields: [{
        name: "name",
        type: "text",
        placeholder: "Deep Thoughts",
        errorMsg: "Name can't be blank",
        validate: (value) => value !== ""
      }, {
        name: "invites",
        type: "textarea",
        placeholder: `~ship-name\n~ship-name`,
        errorMsg: "Invites must be of form ~ship-name \\n ~ship-name",
        validate: (value) => {
          if (value === "") return true;
          let tokens = value.trim().split("\n").map(t => t.trim());
          return tokens.reduce((valid, s) => valid && urbitOb.isShip(s) && s.includes("~"), true);
        }
      }, {
        name: "visible",
        type: "text",
        placeholder: "'yes' or 'no'",
        errorMsg: "Visibility must be either 'yes' or 'no'",
        validate: (value) => value === "yes" || value === "no"
      }],
      submit: function() {
        this.props.storeReports([{
          type: "transition",
          data: TRANSITION_LOADING
        }]);

        this.props.api.coll({
          create: {
            desc: this.state.formData.name,
            publ: true,
            visi: this.state.formData.visible === "yes",
            comm: true,
            xeno: true,
            ses: ""
          }
        });

        this.props.pushCallback("circles", (rep) => {
          let station = `~${this.props.api.authTokens.ship}/${rep.data.cir}`;
          let details = getStationDetails(station);

          this.props.api.hall({
            source: {
              nom: 'inbox',
              sub: true,
              srs: [station]
            }
          });

          if (this.state.formData.invites.length > 0) {
            let inviteArray = this.state.formData.invites.trim().split("\n").map(t => t.trim());
            let audInboxes = inviteArray.map((aud) => `${aud}/inbox`);
            let inviteMessage = {
              aud: audInboxes,
              ses: [{
                inv: {
                  inv: true,
                  cir: station
                }
              }]
            };

            this.props.api.hall({
              phrase: inviteMessage
            });
          }

          this.props.transitionTo(details.stationUrl);
        });
      }
    }
  }

  render() {
    let form = this.getCollectionCreateForm();

    return (<CommandForm
              api={this.props.api}
              store={this.props.store}
              pushCallback={this.props.pushCallback}
              storeReports={this.props.storeReports}
              transitionTo={this.props.transitionTo}
              form={form}
              cancel={this.props.cancel}
            />);

  }
}
