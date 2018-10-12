import React, { Component } from 'react';
import { pour } from '/vendor/urb-sigils';
import _ from 'lodash';

const ReactSVGComponents = {
  svg: p => {
    return (
      <svg {...p.attr} version={'1.1'} xmlns={'http://www.w3.org/2000/svg'}>
       { _.map(_.get(p, 'children', []), child => ReactSVGComponents[child.tag](child)) }
      </svg>
    )
  },
  circle: p => {
    return (
      <circle {...p.attr}>
      { _.map(_.get(p, 'children', []), child => ReactSVGComponents[child.tag](child)) }
      </circle>
    )
  },
  rect: p => {
    return (
      <rect {...p.attr}>
      { _.map(_.get(p, 'children', []), child => ReactSVGComponents[child.tag](child)) }
      </rect>
    )
  },
  path: p => {
    return (
      <path {...p.attr}>
      { _.map(_.get(p, 'children', []), child => ReactSVGComponents[child.tag](child)) }
      </path>
    )
  },
  g: p => {
    return (
      <g {...p.attr}>
        { _.map(_.get(p, 'children', []), child => ReactSVGComponents[child.tag](child)) }
      </g>
    )
  },
  polygon: p => {
    return (
      <polygon {...p.attr}>
      { _.map(_.get(p, 'children', []), child => ReactSVGComponents[child.tag](child)) }
      </polygon>
    )
  },
  line: p => {
    return (
      <line {...p.attr}>
      { _.map(_.get(p, 'children', []), child => ReactSVGComponents[child.tag](child)) }
      </line>
    )
  },
  polyline: p => {
    return (
      <polyline {...p.attr}>
      { _.map(_.get(p, 'children', []), child => ReactSVGComponents[child.tag](child)) }
      </polyline>
    )
  }
}

export class SealDict {
  constructor() {
    this.dict = {};
  }

  getSuffix(patp) {
    return patp.length === 3 ? patp : patp.substr(-3, 3);
  }

  getSeal(patp, size) {
    let suffix = this.getSuffix(patp);
    let key = `${suffix}+${size}`;

    if (!this.dict[key]) {
      this.dict[key] = pour({size: size, patp: suffix, renderer: ReactSVGComponents, margin: 0, colorway: ["#000", "#fff"]})
    }

    return this.dict[key];
  }
}

const sealDict = new SealDict;
export { sealDict }
