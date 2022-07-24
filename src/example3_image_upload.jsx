import React from 'react';
import {uploadImage} from './utils'

function Example3() {
  const [image, setImage] = React.useState("")

  return (<>
    <div className="top_box" >
      <h2>Example3</h2>
      <div>
        image = {image}
      </div>
      <input type="file"
          onChange={(e) => uploadImage(e.target.files[0], setImage)} />
      <hr/>
      <div>
        {image.length > 0 && <img height="100" src={image} />}
      </div>
    </div>
  </>
  );
}

export default Example3;
