/* eslint-disable no-unused-vars */
import React, {PureComponent} from 'react';
import {render} from 'react-dom';
import DeckGL from '@deck.gl/react';
import {COORDINATE_SYSTEM, OrbitView, LinearInterpolator} from '@deck.gl/core';
import {PointCloudLayer, ArcLayer, LineLayer} from '@deck.gl/layers';
import {LASWorkerLoader} from '@loaders.gl/las';

import {load, registerLoaders} from '@loaders.gl/core';

registerLoaders(LASWorkerLoader);

// Alternative: import json from local file -- might be slower than letting DeckGL do its job
const nodes_sample =
  'https://raw.githubusercontent.com/hoangvu01/deck.gl/master/examples/website/arc-test/utils/nodes.json';

const edges_sample =
  'https://raw.githubusercontent.com/hoangvu01/deck.gl/master/examples/website/arc-test/utils/edges.json';

const INITIAL_VIEW_STATE = {
  target: [0, 0, 0],
  rotationX: 0,
  rotationOrbit: 0,
  orbitAxis: 'Y',
  fov: 50,
  minZoom: 0,
  maxZoom: 10,
  zoom: 1
};

const transitionInterpolator = new LinearInterpolator(['rotationOrbit']);

export default class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      viewState: INITIAL_VIEW_STATE,
      hoveredNode: null,
    };

    this._onLoad = this._onLoad.bind(this);
    this._onViewStateChange = this._onViewStateChange.bind(this);
    this._rotateCamera = this._rotateCamera.bind(this);
    this._renderTooltip = this._renderTooltip.bind(this);
  }

  _onViewStateChange({viewState}) {
    this.setState({viewState});
  }

  _rotateCamera() {
    const {viewState} = this.state;
    this.setState({
      viewState: {
        ...viewState,
        rotationOrbit: viewState.rotationOrbit + 120,
        transitionDuration: 2400,
        transitionInterpolator,
        onTransitionEnd: this._rotateCamera
      }
    });
  }

  _onLoad({header, loaderData, progress}) {
    // metadata from LAZ file header
    const {mins, maxs} = loaderData.header;

    if (mins && maxs) {
      // File contains bounding box info
      this.setState(
        {
          viewState: {
            ...this.state.viewState,
            target: [(mins[0] + maxs[0]) / 2, (mins[1] + maxs[1]) / 2, (mins[2] + maxs[2]) / 2],
            /* global window */
            zoom: Math.log2(window.innerWidth / (maxs[0] - mins[0])) - 1
          }
        },
        this._rotateCamera
      );
    }

    if (this.props.onLoad) {
      this.props.onLoad({count: header.vertexCount, progress: 1});
    }
  }

  _renderTooltip() {
    const {x, y, hoveredCounty} = this.state;
    return (
      hoveredCounty && (
        <div className="tooltip" style={{left: x, top: y}}>
          {hoveredNode.label}
        </div>
      )
    );
  }

  _onHoverNode({x, y, object}) {
   this.setState({x, y, hoveredNode: object});
 }

  render() {
    const {viewState} = this.state;

    const layers = [
      new PointCloudLayer({
        id: 'laz-point-cloud-layer',
        data: nodes_sample,
        pickable: true,
        onDataLoad: this._onLoad,
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        radiusPixels: 1.4,
        getPosition: d => d.position,
        getNormal: d => d.normal,
        getColor: d => d.color,
        // onHover: this._onHoverNode
      }),
      new ArcLayer({
         id: 'arc-layer',
         data: edges_sample,
         coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
         pickable: true,
         getWidth: 0.05,
         getHeight: () => Math.random() * 2 - 1,
         getSourcePosition: d => d.from.coordinates,
         getTargetPosition: d => d.to.coordinates,
         getSourceColor: [0, 0 , 0],
         getTargetColor: [0, 0 , 0],
      }),
    ];

    return (
      <DeckGL
        views={new OrbitView()}
        viewState={viewState}
        controller={true}
        onViewStateChange={this._onViewStateChange}
        layers={layers}
        parameters={{
          clearColor: [0.93, 0.86, 0.81, 1]
        }}>
        {this._renderTooltip}
      </DeckGL>

    );
  }
}

export function renderToDOM(container) {
  render(<App />, container);
}
