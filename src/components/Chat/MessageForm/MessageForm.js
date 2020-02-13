/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */
import React from 'react';
import { useDispatch } from 'react-redux';
import { actionCreators as chatActions } from '../../../state/ducks/messages';

function handleSubmit(event, dispatch, textInput) {
  event.preventDefault();

  const text = textInput.current.value;

  // TODO: validate data and give feedback
  dispatch(chatActions.send(text));
  textInput.current.value = '';
}

function MessageForm() {
  const textInput = React.createRef();
  const dispatch = useDispatch();

  return (
    <form
      data-testid="chatbox"
      className="MessageForm"
      onSubmit={(event) => handleSubmit(event, dispatch, textInput)}>
      <input
        type="text"
        autoComplete="off"
        id="text"
        placeholder="Enter your message here"
        ref={textInput}
      />
      <input type="submit" value="Send" />
    </form>
  );
}

export default MessageForm;
