// Copyright (C) 2019 Alina Inc. All rights reserved.

import PropTypes from 'prop-types';
import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button, Col, Container, Row } from 'reactstrap';

import { button, waitingRoom } from '../../../messages';

const UrlCopy = ({ roomId }) => (
  <Container className="section">
    <Row className="bar">{`${waitingRoom.url}`}</Row>
    <Row>
      <Col>
        <textarea defaultValue={`localhost:3000/platform/entry/${roomId}`} disabled />
      </Col>
      <Col>
        <CopyToClipboard text={`localhost:3000/platform/entry/${roomId}`}>
          <Button>{button.copy}</Button>
        </CopyToClipboard>
      </Col>
    </Row>
  </Container>
);

UrlCopy.propTypes = {
  roomId: PropTypes.string,
};
UrlCopy.defaultProps = {
  roomId: 'host',
};
export default UrlCopy;
