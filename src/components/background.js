// @flow
/*
  Copyright(c) 2018 Uber Technologies, Inc.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

          http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import * as React from 'react';

type IBackgroundProps = {
  gridSize?: number,
  backgroundFillId?: string,
  renderBackground?: (gridSize?: number) => any,
  onMouseMove?: (event: any) => any,
  onMouseDown?: (event: any) => any,
  onMouseUp?: (event: any) => any,
};

class Background extends React.Component<IBackgroundProps> {
  static defaultProps = {
    backgroundFillId: '#grid',
    gridSize: 40960,
    onMouseMove: () => {},
    onMouseDown: () => {},
    onMouseUp: () => {},
  };

  render() {
    const { gridSize, backgroundFillId, renderBackground } = this.props;

    if (renderBackground != null) {
      return renderBackground(gridSize);
    }

    return (
      <rect
        className="background"
        x={-(gridSize || 0) / 4}
        y={-(gridSize || 0) / 4}
        width={gridSize}
        height={gridSize}
        fill={`url(${backgroundFillId || ''})`}
        onMouseDown={this.props.onMouseDown}
        onMouseMove={this.props.onMouseMove}
        onMouseUp={this.props.onMouseUp}
      />
    );
  }
}

export default Background;
