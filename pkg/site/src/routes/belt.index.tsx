import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/belt/')({
  component: Belt,
});

function Belt() {
  const [isShowingHome, setIsShowingHome] = useState(true);

  return (
    <>
      {isShowingHome ? (
        <div id="landing" className="content">
          <div className="scene">
            <div className="bullet"></div>
            <div className="ship">
              <img draggable="false" className="shuttle" src="/img/belt_ship.png" alt="spaceship" />
              <img draggable="false" className="exhaust" src="/img/belt_exhaust.gif" alt="exhaust" />
            </div>
          </div>

          <a className="download" href="https://apps.apple.com/app/id1574113584">
            <img src="/img/download_ios_white.png" alt="Download on the Apple App Store" />
          </a>

          <a onClick={() => setIsShowingHome(false)}>Learn More</a>
        </div>
      ) : (
        <div id="discover" className="content">
          <p>
            BELT is a space adventure game for iOS. Pilot your ship through a dangerous asteroid field, expertly weave
            your way between precarious openings, and collect extra fuel, valuable Helium-3, or experimental power-ups
            to increase your high-score!
          </p>
          <p>BELT features custom music and sound effects created by Kaeden Wile.</p>
          <p>
            BELT started out as a college project for Kaeden Wile and Matt Vredevoogd, and was previously released under
            the name LANDR. Matt has become a real rocket scientist and Kaeden went to work for Amazon Web Services. The
            game has undergone many changes including being completely rewritten.
          </p>

          <a onClick={() => setIsShowingHome(true)}>Back</a>
        </div>
      )}
    </>
  );
}
