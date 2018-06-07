import React, { Component } from 'react';
import { Button } from '/components/lib/button';
import { getQueryParams, getStationDetails } from '/lib/util';
import { Elapsed } from '/components/lib/elapsed';
import { TRANSITION_LOADING } from '/lib/constants';
import _ from 'lodash';

export class TopicCreatePage extends Component {
  constructor(props) {
    super(props);

    this.createTopic = this.createTopic.bind(this);
    this.valueChange = this.valueChange.bind(this);
    this.state = {
      topicContent: props.text ? props.text : '',
    };
    this.pageShip= `~${getQueryParams().station.split("/")[0].substr(1)}`;
    console.log('pageShip', this.pageShip);
    //
  }

  titleExtract(s) {
    const r = s.split('\n').filter(x =>
      x.startsWith('# ')
    );
    if (r.length > 0) {
      return r[0].slice(2);
    }
    return '';
  }

  isEdit() {
    return 'top' in this.props;
  }

  createTopic() {
    let dat = {};

    let collId, hostship;

    if (this.isEdit()) {
      collId = this.props.coll;
      hostship = this.props.ship.substr(1);
    } else {
      let stationDetails = getStationDetails(getQueryParams().station);
      collId = stationDetails.collId;
      hostship = stationDetails.host;
    }

    if (this.isEdit()) {
      dat = {
        resubmit: {
          col: collId,
          top: this.props.top,
          tit: this.titleExtract(this.state.topicContent),
          wat: this.state.topicContent,
          hos: this.pageShip
        }
      }
    } else {
      dat = {
        submit: {
          col: collId,
          tit: this.titleExtract(this.state.topicContent),
          wat: this.state.topicContent,
          hos: this.pageShip
        }
      }
    };

    this.props.api.coll(dat);

    this.props.pushCallback("circles", (rep) => {
      api.hall({
        source: {
          nom: 'inbox',
          sub: true,
          srs: [`~${hostship}/${rep.data.cir}`]
        }
      })
    });

    this.props.storeReports([{
      type: "transition",
      data: TRANSITION_LOADING
    }]);

    this.props.pushCallback("circle.gram", (rep) => {
      let content = _.get(rep.data, "gam.sep.fat.tac.text", null);
      let postId = _.get(rep.data, "gam.sep.fat.sep.lin.msg", null);
      postId = postId ? postId.split("|")[0] : null;

      if (content && content === this.state.topicContent) {
        this.props.transitionTo(`/~~/~${hostship}/==/web/collections/${collId}/${postId}`);
        return true;
      }

      return false;
    });
  }

  valueChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({
      [name]: value
    });
  }

  render() {
    // TODO:  Fill these out
    let date = new Date(1527184451038).toISOString();
    let id = "~2018.5.29..20.15.59..55ec/~2018.5.29..20.17.09..79a8";
    let hostship;

    if (this.isEdit()) {
      hostship = this.props.ship.substr(1);
    } else {
      let stationDetails = getStationDetails(getQueryParams().station);
      hostship = stationDetails.host;
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-offset-2 col-sm-10">
            <div className="mb-5 mt-12">
              <Elapsed timestring={date} classes="collection-date text-black mr-4" />
              <span className="collection-date">{date}</span>
            </div>
            <div className="collection-edit">
              <textarea
                className="text-code collection-post-edit mb-4"
                name="topicContent"
                placeholder="New post"
                value={this.state.topicContent}
                onChange={this.valueChange}
                />
              <div className="collection-post-actions">
                <a href={`/~~/~${hostship}/==/web/collections/${id}`} className="header-link mr-6">Cancel</a>
                <Button
                  content="Save"
                  classes="btn btn-sm btn-primary"
                  action={this.createTopic}
                  responseKey="circle.config.dif.full"
                  pushCallback={this.props.pushCallback} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
