/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React, { useEffect, useState } from 'react';
import { Maximize2 as Maximize, Minimize2 as Minimize } from 'react-feather';
import { classNames } from '../../../utils/common';

function ToggleFullscreen({elementRef, className}) {
  const [usingFullscreen, setUsingFullscreen] = useState(false);

  const Icon = usingFullscreen ? Minimize : Maximize;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      elementRef.current.requestFullscreen()
        .then(() => setUsingFullscreen(true))
        .catch(err => {
          alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
      document.exitFullscreen();
    }
  }

  useEffect(() => {
    elementRef.current.addEventListener('fullscreenchange', () => {
      setUsingFullscreen(document.fullscreenElement)
    });
  })


  return(
    <button
      title={usingFullscreen ? "Exit from fullscren mode" : "Fullscreen"}
      onClick={() => toggleFullscreen()}
    >
      <Icon
        className={classNames(
          "p-1",
          usingFullscreen ? "bg-white text-primary-dark" : "bg-gray-400 text-white",
          "hover:bg-gray-600",
          className
        )}
      />
    </button>
  );
}

export default ToggleFullscreen;
