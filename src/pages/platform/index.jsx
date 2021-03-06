// Copyright (C) 2019 Alina Inc. All rights reserved.

import PropTypes from 'prop-types';
import React from 'react';
import { Route, Switch } from 'react-router';

import shapes from '../../shapes';
import Demo from '../games/sequence/Demo';
import Entry from './entries';
import Ranking from './rankings';
import Rating from './ratings';
import WaitingRoom from './waitingRooms';

const Platform = ({ localeCallback, match }) => (
  <Switch>
    <Route
      path={`${match.url}/entry`}
      component={props => (
        <Entry
          {...props}
          localeCallback={localeCallback}
          key="Entry"
        />
      )}
    />
    <Route path={`${match.url}/ranking`} component={Ranking} />
    <Route path={`${match.url}/rating`} component={Rating} />
    <Route path={`${match.url}/waiting_room`} component={WaitingRoom} />
    <Route path={`${match.url}/demo`} component={Demo} />
  </Switch>
);

Platform.propTypes = {
  localeCallback: PropTypes.func.isRequired,
  match: shapes.match.isRequired,
};

export default Platform;
