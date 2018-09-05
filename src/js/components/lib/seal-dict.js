import React, { Component } from 'react';
import { pour } from '/vendor/sigils-0.1.1';
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

  getSeal(patp, size) {
    let key = `${patp}+${size}`;

    if (!this.dict[key]) {
      this.dict[key] = pour({patp, size, renderer: ReactSVGComponents})
    }

    return this.dict[key];
  }
}

const sealDict = new SealDict;
export { sealDict }
