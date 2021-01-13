# 👾 Pixly App

[![gitmoji badge](https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat-square)](https://github.com/carloscuesta/gitmoji)

A real-time, pixel communication, experiment.

## What's this about?

This is a repository containing the frontend app for Pixly, a real-time, pixel communication experiment.

## Specific features

- Join rooms
- Choose a name and avatar
- Send real-time messages to other people on the room
- Move through the room by clicking around
- The closer you are to other users, the more emphasis your message will have

## Tech stack

Personal case study that could serve as a demo application for the following core tools.

- [React](https://reactjs.org/)
- [SocketIO](https://socket.io/)

## Related repositories

- [Pixly API](https://github.com/lifenautjoe/pixly-api): The frontend of the experiment
- [Pixly Core](https://github.com/lifenautjoe/pixly-core): The core shared between frontend and backend

## Demo

[You can see the live demo here.](https://pixly.ws)

## Happy flow

![Flow](demo.gif?raw=true "Flow")

## Architecture

![Architecture](architecture.png?raw=true "Architecture")

### Components encapsulation

The application was architecturally built to be as encapsulated as possible, however, being a realtime application, inevitably most core components have a dependency to a shared state.

### Directory structure

Common practices were followed.

- `pages` contains route pages
- `components` contains global components
- `hooks` contains custom hooks
- `stores` contains the mobx stores and its provider

### Global styles

While in a component driven development manner it is desired to have scoped styles, in reality browsers themselves will bring global styles to the context of an application.

In order to have some normalization while also giving it a fun-twist, I added the micro library [NES.css](https://nostalgic-css.github.io/NES.css/)

### State management

MobX was utilised. Its simplicity means that we can remove a layer of complexity to the asynchronous nature of the application as compared to using Redux Thunk | Saga.

### PixlyClient

In order to facilitate the operation of the protocol commands and events, I created a PixlyClient which provides a typed interface for the PixlyServer along with data validation methods.

### Tests

Having only a couple of hours to build the application, I quickly came to the conclusion that it was unrealistic to try to build what was my end-goal-user-experience while testing every bit of it, therefore tests are not available.

### Notes

Given time limitations, some things were intentionally left out.

- Swapping rooms
- Reconnection and session recovery
- Handling of all sad flows

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
