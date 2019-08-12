// Copyright (C) 2019 Alina Inc. All rights reserved.

import React from 'react';
import { Button, Col, Input, Row } from 'reactstrap';

import { subwayGame } from '../../../messages';
import shapes from '../../../shapes';
import Ready from '../../components/Ready';
import Station from './Station';

const Play = ({ history, match: { params: { lineNum } } }) => {
  const defaultSecond = 10;
  const gameSeconds = 13;
  const inputRef = React.useRef();
  const intervalRef = React.useRef();
  const timeoutRef = React.useRef();
  const stationRef = React.useRef(Station[lineNum]);
  const [seconds, setSeconds] = React.useState(gameSeconds);
  const [disabled, setDisabled] = React.useState(false);
  const [answers, setAnswers] = React.useState([]);
  const [result, setResult] = React.useState();
  const [gameStart, setGameStart] = React.useState(false);

  React.useEffect(() => {
    if (!answers.length) {
      const loadSec = (gameSeconds - defaultSecond) * 1000;
      setTimeout(() => {
        setGameStart(true);
      }, loadSec);
    }
    if (stationRef.current.length < 1) {
      setDisabled(true);
      setResult(subwayGame.play.result.finish);
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    } else {
      intervalRef.current = setInterval(() => {
        setSeconds(s => s - 1);
      }, 1000);
      const sec = (answers.length ? defaultSecond : gameSeconds) * 1000;
      timeoutRef.current = setTimeout(() => {
        setDisabled(true);
        setResult(subwayGame.play.result.timeout);
        clearInterval(intervalRef.current);
      }, sec);
    }
  }, [defaultSecond, gameSeconds, answers]);

  const stop = (disabledButton, resultText, initSeconds) => {
    if (disabledButton) {
      setDisabled(disabledButton);
    }
    if (initSeconds) {
      setSeconds(initSeconds);
    }
    setResult(resultText);
    clearTimeout(timeoutRef.current);
    clearInterval(intervalRef.current);
  };

  const onClickButton = () => {
    const input = inputRef.current.value;
    const isExist = stationRef.current.indexOf(input);

    if ((isExist !== -1)) {
      stationRef.current.splice(isExist, 1);
      setAnswers([
        ...answers,
        {
          id: answers.length,
          value: input,
        },
      ]);
      stop(false, subwayGame.play.result.correct, 10);
    } else {
      stop(true, subwayGame.play.result.wrong);
    }

    inputRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
    inputRef.current.value = '';
  };

  const onInputPress = (e) => {
    if (e.charCode === 13) {
      onClickButton();
    }
  };
  return (
    <div className={!gameStart ? 'game-backdrop' : null}>
      {!gameStart
        && (
          <Ready
            description={subwayGame.description}
            seconds={seconds - defaultSecond}
            title={subwayGame.play.title}
          />
        )}
      <h1>{subwayGame.play.title}</h1>
      <h3>{`${subwayGame.selectLine.line[lineNum]}`}</h3>
      <ul>
        { answers.map(answer => (<li key={answer.id}>{answer.value}</li>))}
      </ul>
      <p>{`time: ${seconds}`}</p>
      <Row>
        <Col>
          <Input
            placeholder={subwayGame.play.input}
            innerRef={inputRef}
            onKeyPress={onInputPress}
            disabled={disabled}
          />
        </Col>
        <Col>
          <Button type="button" onClick={onClickButton} disabled={disabled}>
            {subwayGame.play.button}
          </Button>
        </Col>
      </Row>
      <p>{result}</p>
    </div>
  );
};

Play.propTypes = {
  history: shapes.history.isRequired,
  match: shapes.match.isRequired,
};

export default Play;
