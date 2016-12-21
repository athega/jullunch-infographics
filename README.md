# Jullunch Infographics

https://athega.github.io/jullunch-infographics/

## Prerequisites

Node.js and git


## Setup

Checkout

`git clone https://github.com/athega/jullunch-infographics.git`

Install dependencies, which are 'babel-cli', 'babel-preset-es2015', 'eventsource' and 'nats'.

`npm install`


## Build scripts

Build style, 'libs' and 'app' script bundles:

`npm run build`

Watch 'styles' and 'src' folders for changes and build style and 'app' script bundle:

`npm run watch`


## Event test scripts:

First copy `events/nats-config.js.sample` to `events/nats-config.js` and edit 'token'.

`node events/nats-publish.js`

`node events/nats-subscribe.js`

`node events/eventsource-listen.js`
