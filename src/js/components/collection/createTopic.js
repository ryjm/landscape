import React, { Component } from 'react';
import { Button } from '/components/lib/button';
import { getQueryParams, daToDate } from '/lib/util';
import { getStationDetails } from '/services';
import { Elapsed } from '/components/lib/elapsed';
import { PAGE_STATUS_PROCESSING, PAGE_STATUS_READY, REPORT_PAGE_STATUS } from '/lib/constants';
import _ from 'lodash';
import classnames from 'classnames';

export class TopicCreatePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: props.title ? props.title : '',
      topicContent: props.content ? props.content : '',
      details: this.getDetails(props)
    };

    this.createTopic = this.createTopic.bind(this);
    this.valueChange = this.valueChange.bind(this);
  }

  componentDidMount() {
    let path = `/circle/${this.state.details.namedCircle}/config-l/grams/-10`;

    this.props.api.bind(path, "PUT", this.state.details.hostship);
  }

  componentWillUnmount() {
    let path = `/circle/${this.state.details.namedCircle}/config-l/grams/-10`;

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
    details.isEdit = (props.show == 'edit');

    if (details.isEdit) {
      details.clayPath = props.claypath.split('/').slice(1);
      details.hostship = props.ship.substr(1);
      details.circle = `~${details.hostship}/c${[''].concat(details.clayPath.slice(2, -1)).join('-')}`;
      details.namedCircle = "c".concat([''].concat(details.clayPath.slice(2, -1)).join('-'));
      details.lastedit = props.lastedit;
      details.title = details.clayPath.slice(-1)[0];
      details.body = props.content;
    } else {
//      if (!getQueryParams().station) return {}; // TODO: Find source of this bug. Transitioning before render gets done.
//      let stationDetails = getStationDetails(getQueryParams().station);
//      details.collId = stationDetails.collId;
//      details.hostship = stationDetails.host;
//      details.cir = stationDetails.cir;
      details.clayPath = props.claypath.split('/').slice(1);
      details.hostship = props.ship.substr(1);
      details.circle = `~${details.hostship}/c${[''].concat(details.clayPath.slice(2)).join('-')}`;
      details.namedCircle = "c".concat([''].concat(details.clayPath.slice(2, -1)).join('-'));
    }

    return details;
  }

  createTopic() {
    let dat = {};
    let details = this.getDetails();

    if (details.isEdit) {
      dat = {
        ship: details.hostship,
        desk: 'home',
        acts: [{
          post: {
            path: '/' + details.clayPath.join('/'), // TODO: should be web/collections/~2018.9.11..17.41.40..6823/~2018.9.11..20.21.42..607c
            name: details.title,
            comments: true,  // XX TODO Get this value from user or parent
            type: 'blog',
            content: this.state.topicContent,
            edit: true
          }
        }]
      }
    } else {
      dat = {
        ship: details.hostship,
        desk: 'home',
        acts: [{
          post: {
            path: '/' + details.clayPath.join('/'),
            name: this.titleExtract(this.state.topicContent),
            comments: true,  // XX TODO Get this value from user or parent
            type: 'blog',
            content: this.state.topicContent,
            edit: false
          }
        }]
      }
    };
    this.props.api.coll(dat);

    this.props.storeReports([{
      type: REPORT_PAGE_STATUS,
      data: PAGE_STATUS_PROCESSING
    }]);

    if (details.isEdit) {
      this.props.pushCallback("circle.gram", rep => {
        let gramType = _.get(rep, 'data.gam.sep.fat.tac.text', null);
        if (gramType && gramType === "edited item") {
          this.props.storeReports([{
            type: REPORT_PAGE_STATUS,
            data: PAGE_STATUS_READY
          }]);

          this.props.transitionTo(`/~~/~${details.hostship}/==/${details.clayPath.join('/')}`);
          return true;
        }

        return false;
      });
    } else {
      this.props.pushCallback("circles", (rep) => {
        this.props.storeReports([{
          type: REPORT_PAGE_STATUS,
          data: PAGE_STATUS_READY
        }]);

        let station = `${rep.from.path.split('/')[2]}/${rep.data.cir}`;
        let stationDetails = getStationDetails(station);

        api.hall({
          source: {
            nom: 'inbox',
            sub: true,
            srs: [station]
          }
        })

        this.props.transitionTo(stationDetails.stationUrl);
      });
    }
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
      let lastEditDate = (details.lastedit == 'missing-date') ?
        '' :
        daToDate(details.lastedit).toISOString();

      dateElem = (
        <div className="mb-5">
          <Elapsed timestring={lastEditDate} classes="collection-date text-black mr-4" />
          <span className="collection-date">{details.lastedit}</span>
        </div>
      );
    }

    return (
      <div className="row">
        <div className="flex-col-x">
          {dateElem}
          <h3 className="text-500">Title</h3>
          <input
            type="text"
            name="title"
            className={`h3 mt-0 mb-0 text-500 collection-title ${this.state.title.length > 0 && 'collection-value-filled'}`}
            value={this.state.title}
            onChange={this.valueChange}
            disabled={this.props.store.views.transition !== PAGE_STATUS_READY} />
          <h3 className="text-500 mt-6">Post</h3>
          <textarea
            className={`text-code collection-post-edit mb-6 ${this.state.topicContent.length > 0 && 'collection-value-filled'}`}
            name="topicContent"
            disabled={this.props.store.views.transition !== PAGE_STATUS_READY}
            value={this.state.topicContent}
            onChange={this.valueChange}
            />
          <div>
            <Button
              content="Publish"
              disabled={this.props.store.views.transition !== PAGE_STATUS_READY}
              classes="btn btn-sm btn-secondary mr-1"
              action={this.createTopic}
              responseKey="circle.config.dif.full"
              pushCallback={this.props.pushCallback} />
            <a
              href={`/~~/~${details.hostship}/==/${details.clayPath.join('/')}`}
              className="vanilla btn btn-default">
              Cancel</a>
          </div>
        </div>
        <div className="flex-col-2"></div>
      </div>
    )
  }
}
