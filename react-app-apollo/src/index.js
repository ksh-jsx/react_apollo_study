import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { ApolloProvider } from "@apollo/react-hooks";
import { ParallaxProvider } from 'react-scroll-parallax';
import client from "./apollo";

ReactDOM.render(
    <ApolloProvider client={client}>
      <ParallaxProvider>
        <App />
      </ParallaxProvider>
    </ApolloProvider>,
    document.getElementById("root")
);