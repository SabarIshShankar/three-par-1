import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useSpring } from "@react-spring/core";
import { a } from "@react-spring/web";
import "./styles.css";
import { Scene } from "./Canvas";

function App() {
  const [toggle, set] = useState(0);
  const [{ x }] = useSpring(
    {
      x: toggle,
      config: { mass: 5, tension: 1000, friction: 50, precision: 0.0001 }
    },
    [toggle]
  );
  return (
    <a.div
      class="container"
      style={{
        backgroundColor: x.to([0, 1], ["#834eff", "#ff2525"]),
        color: x.to([0, 1], ["#92aaff", "#c70f0f"])
      }}
    >
      <h1 class="open" children="META" />
      <h1 class="close" children="SPACE" />
      <a.h1>{x.to((x) => (x + 1).toFixed(2))}</a.h1>
      <Scene x={x} set={set} />
    </a.div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
