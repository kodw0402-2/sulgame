// Copyright (C) 2019 Alina Inc. All rights reserved.

import firebase from 'firebase/app';
import React, { useEffect, useRef, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Spinner } from 'reactstrap';

import { FirebaseDatabaseMutation, FirebaseDatabaseNode } from '@react-firebase/database';

import { chooseGame } from '../../../messages';
import shapes from '../../../shapes';
import Ready from '../../components/Ready';
import ChoiceList from './ChoiceList';

const Play = ({ history, match: { params: { roomId, userId } } }) => {
  const [gameState, setGameState] = useState(false);
  const choiceRef = useRef(ChoiceList[Math.floor(Math.random() * ChoiceList.length)]);
  const resultRef = useRef(null);
  const gameSeconds = 3;
  const totalSeconds = 6;
  const [seconds, setSeconds] = useState(totalSeconds);
  const [gameStart, setGameStart] = useState(false);
  const choices = useRef(null);

  const getRandomInt = max => (Math.floor(Math.random() * max));

  useEffect(() => {
    if (userId === 'host') {
      firebase.database()
        .ref(`/rooms/${roomId}/players/host/`)
        .update({
          choice: choiceRef.current,
          gameData: null,
          order: choiceRef.current[Math.floor(Math.random() * 2)],
        });
    }
    firebase.database()
      .ref(`/rooms/${roomId}/players/${userId}/`)
      .update({ gameData: null });
  }, [roomId, userId]);
  useEffect(() => {
    // eslint-disable-next-line no-undef
    window.onpopstate = () => {
      history.push('');
    };

    const id = setInterval(() => {
      setSeconds(s => s - 1);
    }, 1000);

    const sec = totalSeconds * 1000;
    const loadSec = (totalSeconds - gameSeconds) * 1000;

    setTimeout(() => {
      setGameStart(true);
    }, loadSec);

    setTimeout(() => {
      setGameState(true);
      clearInterval(id);
    }, sec);
  }, []);

  const onButtonClick = ({ target: { value } }) => {
    resultRef.current = value;
  };

  const renderChoice = () => (
    <FirebaseDatabaseNode path={`/rooms/${roomId}/players/host/choice`}>
      {({ value }) => {
        if (!value) {
          return <Spinner color="primary" />;
        }
        choices.current = value[getRandomInt(2)];
        return (
          <div>
            <button type="button" value={value[0]} onClick={onButtonClick} id="choose-button">
              {value[0]}
            </button>
            <p id="verse">vs</p>
            <button type="button" value={value[1]} onClick={onButtonClick} id="choose-button">
              {value[1]}
            </button>
          </div>
        );
      }}
    </FirebaseDatabaseNode>
  );

  if (gameState) {
    return (
      <>
        <FirebaseDatabaseMutation path={`/rooms/${roomId}/players/host/`} type="update">
          {({ runMutation }) => {
            runMutation({ replay: 0 });
            return null;
          }}
        </FirebaseDatabaseMutation>
        <FirebaseDatabaseMutation path={`/rooms/${roomId}/players/${userId}`} type="update">
          {({ runMutation }) => {
            runMutation({ gameData: resultRef.current || choices.current });
            if (userId === 'host') {
              return <Redirect to={`/platform/ranking/${roomId}/user/host`} />;
            }
            return <Redirect to={`/platform/ranking/${roomId}/user/${userId}`} />;
          }}
        </FirebaseDatabaseMutation>
      </>
    );
  }

  return (
    <div className={!gameStart ? 'game-backdrop' : 'game-container'}>
      {!gameStart
        ? (
          <Ready
            description={chooseGame.description}
            gameStart={gameStart}
            seconds={seconds - gameSeconds}
            title={chooseGame.title}
          />
        )
        : null
      }
      <div className="game">
        <h1>{chooseGame.title}</h1>
        <p className="description">{chooseGame.description}</p>
        <p className="time">
          {`${chooseGame.time}: ${seconds > gameSeconds ? gameSeconds : seconds}`}
        </p>
        <div>
          {renderChoice()}
        </div>
      </div>
    </div>
  );
};

Play.propTypes = {
  history: shapes.history.isRequired,
  match: shapes.match.isRequired,
};

export default Play;
