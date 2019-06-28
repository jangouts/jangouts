import React from 'react';
import { connect } from 'react-redux';

import { addParticipant, removeParticipant } from '../../redux/actionCreators';
import Participant from '../Participant';

import './Participants.css';

const Participants = ({ participants }) => (
  <div className="Participants">
    {Object.keys(participants).map(key => (
      <Participant key={key} {...participants[key]} />
    ))}
  </div>
);

const mapStateToProps = state => ({ participants: state.participants });

export default connect(mapStateToProps)(Participants);
