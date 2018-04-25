import React, { Component } from 'react';
import { Modal, Button } from 'antd';

import CalendarDate from './CalendarDate';
import MapComponent from './MapComponent';

export default class ChatMessageListItem extends Component {
  state = { visible: false };
  showModal = () => {
    this.setState({
      visible: true
    });
  };
  handleOk = (e) => {
    this.setState({
      visible: false
    });
  };
  handleCancel = (e) => {
    this.setState({
      visible: false
    });
  };
  render() {
    const {
      from, text, createdAt, coords
    } = this.props;
    return (
      <li className="message">
        <div className="message__title">
          <h4 className={from === 'Admin' && 'admin'}>{from}</h4>
          <CalendarDate createdAt={createdAt} />
        </div>
        <div className="message__body">
          {text ? (
            <p>{text}</p>
          ) : (
            <div>
              <div className="message__location-message">
                <p>{`${from} sent his position.`}</p>
                <button onClick={this.showModal}>Check it</button>
              </div>

              <Modal
                title={`${from}'s position`}
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                width="50vw"
                footer={null}
              >
                <MapComponent isMarkerShown coords={coords} />
              </Modal>
            </div>
          )}
        </div>
      </li>
    );
  }
}
