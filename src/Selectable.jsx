import React from 'react'
import { render, useFrame } from '@react-three/fiber'

const UnselectAllEventTarget = new EventTarget();

const useUnselectAll = () => {
  return () => {
    UnselectAllEventTarget.dispatchEvent(new Event("unselectAll"));
  };
};

class Selectable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
      hover: false
    }

    UnselectAllEventTarget.addEventListener("unselectAll", () => {
      this.setState((state, props) => {
        active: false
      });
    })
  }

  handleClick = (e) => {
    this.setState((state, props) => ({
      active: !state.active
    }));
  }

  render() {
    return (
      <group
        // onPointerOver={(event) => setHover(true)}
        // onPointerOut={(event) => setHover(false)}
        onClick={this.handleClick}>
        {this.props.children}
      </group>
    )
  }
}

export { Selectable, useUnselectAll }
