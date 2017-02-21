import React from 'react';

import './style';

class Default extends React.Component {
  render() {
    return (
      <div className="main-content">
        <button>bbb</button>
      </div>
    );
  }
}

let route = {
  component: Default
};

export default route;