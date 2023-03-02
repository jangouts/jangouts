/**
 * Copyright (c) [2015-2020] SUSE Linux
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
      className="flex absolute bottom-0 w-full h-12 p-1 bg-gray-100 border-t"
      onSubmit={(event) => handleSubmit(event, dispatch, textInput)}>
      <input
        id="text"
        type="text"
        autoComplete="off"
        className="appearance-none rounded w-full mr-2 px-2 py-4 focus:border-secondary focus:outline-none focus:shadow"
        placeholder="Enter your message here"
        ref={textInput}
      />
      <input
        type="submit"
        className="appearance-none rounded px-4 font-bold border-none text-white uppercase bg-secondary"
        value="Send"
      />
    </form>
  );
}

export default MessageForm;
