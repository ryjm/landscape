import React, { Component } from 'react';
import { Button } from '/components/lib/button';
import { getQueryParams, getStationDetails, daToDate } from '/lib/util';
import { Elapsed } from '/components/lib/elapsed';
import { TRANSITION_LOADING, STATUS_READY, STATUS_LOADING } from '/lib/constants';
import _ from 'lodash';

export class TopicCreatePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      topicContent: props.text ? props.text : '',
      details: this.getDetails(props),
      status: STATUS_READY
    };

    this.createTopic = this.createTopic.bind(this);
    this.valueChange = this.valueChange.bind(this);
  }

  componentDidMount() {
    let path = `/circle/${this.state.details.cir}/config-l/grams/-10`;

    this.props.api.bind(path, "PUT", this.state.details.hostship);
  }

  componentWillUnmount() {
    let path = `/circle/${this.state.details.cir}/config-l/grams/-10`;

    this.props.api.bind(path, "DELETE", this.state.details.hostship);
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

  getDetails(conProps) {
    let props = this.props || conProps;

    let details = {};
    details.isEdit = 'top' in props;

    if (details.isEdit) {
      details.collId = props.coll;
      details.hostship = props.ship.substr(1);
      details.cir = `~${details.hostship}/collection_~${details.collId}`;
      details.lastedit = props.lastedit;
      details.top = props.top;
    } else {
      if (!getQueryParams().station) return {}; // TODO: Find source of this bug. Transitioning before render gets done.
      let stationDetails = getStationDetails(getQueryParams().station);
      details.collId = stationDetails.collId;
      details.hostship = stationDetails.host;
      details.cir = stationDetails.cir;
    }

    return details;
  }

  createTopic() {
    this.setState({ status: STATUS_LOADING });

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

    this.props.pushCallback("circle.config.dif.source", (rep) => {
      api.hall({
        source: {
          nom: 'inbox',
          sub: true,
          srs: [rep.data.src]
        }
      })
    });

    this.props.storeReports([{
      type: "transition",
      data: TRANSITION_LOADING
    }]);

    this.props.pushCallback("circle.gram", (rep) => {
      this.setState({ status: STATUS_READY });

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
                disabled={this.state.status === STATUS_LOADING}
                value={this.state.topicContent}
                onChange={this.valueChange}
                />
              <div className="collection-post-actions">
                <a href={`/~~/~${details.hostship}/==/web/collections/${details.collId}`}
                  className="header-link mr-6"
                  disabled={this.state.status === STATUS_LOADING}>Cancel</a>
                <Button
                  content="Save"
                  disabled={this.state.status === STATUS_LOADING}
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
