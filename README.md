# Wine Tasting

An application for hosting a wine tasting party.

### Setup

#### Env variables

Create `variables.env` at the root and use it to set the `REACT_APP_APP_ID` env variable.

This value will be used at the AppId for the trystero web rtc lib.

`process.env.REACT_APP_APP_ID=<some-app-id>`

I use firebase: https://github.com/dmotz/trystero?tab=readme-ov-file#firebase-setup

#### https

WebRTC connection will not work unless server using https or on localhost.

`Cannot read properties of undefined (reading 'importKey')`

### Develop

`npm run serve` (to /dev)

### Build

`npm run build` (to /docs)
`npm run build-dev` (to /docs)
