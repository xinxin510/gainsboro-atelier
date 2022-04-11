import React from 'react';
import styled from 'styled-components';

const Bar = styled.div`
  width: ${props => props.barWidth}px;
  height: 10px;
  position: relative;
  background-color: #ebebeb;
  margin-bottom: 50px;
`;

const Segment = styled.span`
  display: inline-block;
  width: ${props => props.segmentWidth}px;
  height: 10px;
  background-color: red;
  position: absolute;
  top: 0;
  left:${props => props.segmentLeft}px;
  background-color: #ffffff;
`;

const Pointer = styled.span`
  & {
    display: inline-block;
    width: 20px;
    height: 10px;
    position: absolute;
    top: -2px;
    // left: 10px;
    left:${props => props.pointerLeft}px;
  }

  &:before {
    content: "▼";
    color: #ffc107;
  }
`;

const Label = styled.div`
  width: ${props => props.labelWidth}px;
  display: flex;
  justify-content: space-between;
`;

export default function characters({characteristics}) {
  var segWidth = 5;
  var barWidth = 275;
  var labels = {
    Size: ['Too small', 'Too wide'],
    Width: ['Too narrow', 'Too wide'],
    Comfort: ['Uncomfortable', 'Perfect'],
    Quality: ['Poor', 'Perfect'],
    Length: ['Runs Short', 'Runs long'],
    Fit: ['Runs tight', 'Runs long']}
  return(
    <div>
      {Object.keys(characteristics).map(charactersName =>
        <div key={charactersName}>
          <h4>{charactersName}</h4>
          <Bar barWidth={barWidth}>
            {[1, 2].map(num => <Segment
              key={num}
              segmentLeft={Math.round((num - 1) * segWidth + (barWidth - segWidth * 2) / 3 * num)}
              segmentWidth={segWidth}>
            </Segment>)}
            <Pointer pointerLeft={Math.round(Number(characteristics[charactersName].value) / 5 * barWidth)}></Pointer>
            <Label labelWidth={barWidth}>
              <p>{labels[charactersName][0]}</p>
              <p>{labels[charactersName][1]}</p>
            </Label>
          </Bar>
        </div>
      )}
    </div>
  )
}