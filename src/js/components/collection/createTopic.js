import React, { Component } from 'react';
import { Button } from '/components/lib/button';
import { getQueryParams, getStationDetails, daToDate } from '/lib/util';
import { Elapsed } from '/components/lib/elapsed';
import { TRANSITION_LOADING } from '/lib/constants';
import _ from 'lodash';

export class TopicCreatePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      topicContent: props.text ? props.text : '',
    };

    this.createTopic = this.createTopic.bind(this);
    this.valueChange = this.valueChange.bind(this);
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

  getDetails() {
    let details = {};
    details.isEdit = 'top' in this.props;

    if (details.isEdit) {
      details.collId = this.props.coll;
      details.hostship = this.props.ship.substr(1);
      details.lastedit = this.props.lastedit;
      details.top = this.props.top;
    } else {
      let stationDetails = getStationDetails(getQueryParams().station);
      details.collId = stationDetails.collId;
      details.hostship = stationDetails.host;
    }

    return details;
  }

  createTopic() {
    let dat = {};

    let details = this.getDetails();

    if (details.isEdit) {
      dat = {
        resubmit: {
          col: details.collId,
          top: details.top,
          tit: this.titleExtract(this.state.topicContent),
          wat: this.state.topicContent,
          hos: `~${details.hostship}`
        }
      }
    } else {
      dat = {
        submit: {
          col: details.collId,
          tit: this.titleExtract(this.state.topicContent),
          wat: this.state.topicContent,
          hos: `~${details.hostship}`
        }
      }
    };

    this.props.api.coll(dat);

    this.props.pushCallback("circles", (rep) => {
      api.hall({
        source: {
          nom: 'inbox',
          sub: true,
          srs: [`~${details.hostship}/${rep.data.cir}`]
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
        this.props.transitionTo(`/~~/~${details.hostship}/==/web/collections/${details.collId}/${postId}`);
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
    let hostship, dateElem, id;

    let details = this.getDetails();

    if (details.isEdit) {
      let lastEditDate = daToDate(details.lastedit).toISOString();

      dateElem = (
        <div className="mb-5">
          <Elapsed timestring={lastEditDate} classes="collection-date text-black mr-4" />
          <span className="collection-date">{details.lastedit}</span>
        </div>
      );
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-offset-2 col-sm-10 pt-12">
            {dateElem}
            <div className="collection-edit">
              <textarea
                className="text-code collection-post-edit mb-4"
                name="topicContent"
                placeholder="New post"
                value={this.state.topicContent}
                onChange={this.valueChange}
                />
              <div className="collection-post-actions">
                <a href={`/~~/~${details.hostship}/==/web/collections/${details.collId}`} className="header-link mr-6">Cancel</a>
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
