import React, { useState } from 'react';
import { render } from 'react-dom';

export const Popup = () => {
  const [content, setContent] = useState('N/A');

  return <div>'Hello'</div>;
};

render(<Popup />, document.getElementById('option'));
