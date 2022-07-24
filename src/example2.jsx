import './main.css';
import {Header} from './header';
import React from 'react';
import {api} from './library';


const T = (function ({input}) {
  console.log("T with input = ", input)
  const [x, setX] = React.useState(input)
  return (
    <div>Incoming input = {input}, x = {x}
    </div>);
})

const P = (function ({input}) {
  console.log("P with input = ", input)
  const [x, setX] = React.useState(input)
  return <div>Incoming input = {input}, x = {x}</div>
})

function Example2() {
  const [y, setY] = React.useState(0)
  const [z, setZ] = React.useState(0)

  return (<>
    <div >
      <h2>Example2</h2>
      <div>
        y = {y}, z = {z}
      </div>
      <div>
        <button onClick={() => setY(y + 1)} >Incr Y</button>
        <button onClick={() => setZ(z + 1)} >Incr Z</button>
      </div>
      <div>
        Subcomponent T with input={y}:
        <T input={y} />
      </div>
      <div>
        Subcomponent P with input={z}:
        <P input={z} />
      </div>
    </div>
  </>
  );
}

export default Example2;
