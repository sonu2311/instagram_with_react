import './main.css';
import {Header} from './header';
import React from 'react';
import {api} from './library';


const T = React.memo(({id: {v: id}, f}) => {
  console.log("T with id = ", id)
  const [x, setX] = React.useState(id)
  return (
    <div>Incoming id = {id}, x = {x}
        <button onClick={f} >Call F</button>
    </div>);
})

const P = React.memo(({id: {v: id}, f}) => {
  console.log("P with id = ", id)
  const [x, setX] = React.useState(id)
  return <div>Incoming id = {id}, x = {x}</div>
})

function Example2() {
  const [y, setY] = React.useState({v: 0})
  const [z, setZ] = React.useState({v: 0})

  const IncrY = React.useCallback(function() {
    setY({v: y.v+1});
  }, [y])

  const IncrZ = React.useCallback(function() {
    setY({v: y.v+1});
  }, [z])

  return (<>
    <div >
      <h2>Example2</h2>
      <div>
        y = {y.v}, z = {z.v}
      </div>
      <div>
        <button onClick={() => setY({v: y.v+1})} >Incr Y</button>
        <button onClick={() => setZ({v: z.v+1})} >Incr Z</button>
      </div>
      <div>
        Subcomponent T with id={y.v}:
        <T id={y} f={IncrY} />
      </div>
      <div>
        Subcomponent P with id={z.v}:
        <P id={z} f={IncrZ} />
      </div>
    </div>
  </>
  );
}

export default Example2;
