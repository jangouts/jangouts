/**
 * Copyright (c) [2015-2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import Participant from '../Participant';

/*
 * See setParticipantVars
 */
function getCssConfig(element, property, def) {
  const value = element.style.getPropertyValue(property);
  return value === "" ? def : Number(value);
}

/*
 * Calculates the optimal width for the participants inside the div and stores
 * the calculated values (size and number of squares) as CSS variables in the
 * given div.
 *
 * The calculation can be configured with some CSS variables in the div.
 *
 * The range of possible values for --partSlotWidth can be configured with
 * --partMaxSlotWidth, --partMinSlotWidth and --partStepSlotWidth.
 *
 * By default, the algorithm assumes a square representation for each
 * participant. That can be configured with the variables --partHeightFactor,
 * --partHeightExtra and --partWidthExtra.
 */
function setParticipantVars(div) {
  const totalWidth = div.offsetWidth;
  const totalHeight = div.offsetHeight;
  const qty = div.querySelectorAll(".participant").length;

  const max = getCssConfig(div, "--partMaxSlotWidth", 160);
  const min = getCssConfig(div, "--partMinSlotWidth", 80);
  const step = getCssConfig(div, "--partStepSlotWidth", 4);

  const heightFactor = getCssConfig(div, "--partHeightFactor", 1);
  const heightExtra = getCssConfig(div, "--partHeightExtra", 0);
  const widthExtra = getCssConfig(div, "--partWidthExtra", 0);

  let slotWidth, perRow, numRows, rowHeight;

  if (qty === 0) {
    div.style.setProperty("--partSlotWidth", max + "px");
    div.style.setProperty("--partSlotQty", qty);
    return;
  }

  // Do the calculations by trial and error
  for (slotWidth = max; slotWidth >= min; slotWidth -= step) {
    perRow = Math.floor(totalWidth / slotWidth);
    numRows = Math.ceil(qty / perRow);
    rowHeight = heightExtra + heightFactor * (slotWidth - widthExtra);
    // It fits already, we don't need to keep trying
    if (numRows * rowHeight <= totalHeight) {
      break;
    }
  }
  if (slotWidth < min) { slotWidth = min }

  div.style.setProperty("--partSlotWidth", slotWidth + "px");
  div.style.setProperty("--partSlotQty", qty);
}

const Participants = () => {
  const participants = useSelector((state) => state.participants);
  const mainRef = React.createRef();
  const observer = new ResizeObserver((entries) => {
    setParticipantVars(entries[0].target);
  });

  // TODO: allow to choose the order via prop.
  const orderedParticipants = Object.values(participants).sort((a, b) => {
    return a.display.localeCompare(b.display);
  });

  useEffect(() => {
    observer.observe(mainRef.current);
    return () => { observer.disconnect() };
  }, []);

  useEffect(() => {
    setParticipantVars(mainRef.current);
  }, [orderedParticipants.length]);

  return (
    <div
      ref={mainRef}
      className="h-full w-full flex flex-row flex-wrap content-start justify-evenly overflow-x-hidden overflow-y-auto"
      style={{"--partWidthExtra": 18, "--partHeightExtra": 46, "--partHeightFactor": 0.75}}>
      {orderedParticipants.map((participant) => {
        let {
          id,
          display,
          isPublisher,
          isLocalScreen,
          streamTimestamp,
          speaking,
          focus,
          video
        } = participant;

        return (
          <Participant
            key={id}
            id={id}
            username={display}
            isPublisher={isPublisher}
            isLocalScreen={isLocalScreen}
            streamReady={streamTimestamp}
            speaking={speaking}
            focus={focus}
            video={video}
          />
        );
      })}
    </div>
  );
};

export default Participants;
