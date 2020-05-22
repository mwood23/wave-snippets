export const INDEX = `
import React from "react";
import ReactDOM from "react-dom";
import { RenderMDX } from './mdx'

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <RenderMDX />
  </React.StrictMode>,
  rootElement
);`
