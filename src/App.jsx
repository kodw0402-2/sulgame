// Copyright (C) 2019 Alina Inc. All rights reserved.

import firebase from 'firebase/app';
import 'firebase/database';
import React from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { FirebaseDatabaseProvider } from '@react-firebase/database';

import config from './firebase.config';
import MainPage from './pages/MainPage';
import ClickGame from './pages/clickGame';
import Game from './pages/games';
import Platform from './pages/platform';

import './stylesheets/main.scss';
// import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => (
  <FirebaseDatabaseProvider firebase={firebase} {...config}>
    <ToastContainer />
    <BrowserRouter>
      <Switch>
        <Route path="/games" component={Game} />
        <Route path="/platform" component={Platform} />
        <Route path="/clickgame" component={ClickGame} />
        <Route component={MainPage} />
      </Switch>
    </BrowserRouter>
  </FirebaseDatabaseProvider>
);

export default App;
