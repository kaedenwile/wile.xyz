import './colony.css';
import { Link } from '@tanstack/react-router';

export const Colony = () => {
  return (
    <>
      <h1>Colony</h1>
      <h2>By Kaeden Wile</h2>

      <img className="planet" src="/img/planet.png" alt="planet" draggable="false" />

      <div className="content">
        <a className="download" draggable="false" href="https://apps.apple.com/app/colony-a-space-rpg/id1611404300">
          <img src="/img/download_ios.svg" alt="Download on the Apple App Store" />
        </a>

        <a className="download" href="https://apps.apple.com/app/colony-a-space-rpg/id1611404300">
          <img src="/img/download_mac.svg" alt="Download on the Mac App Store" />
        </a>
      </div>

      <div id="footer">
        <a href="/pdf/colony-privacy-policy.pdf">Privacy Policy</a>
        <Link to="/">wile.xyz</Link>
        <div>(c) 2022 Kaeden Wile</div>
      </div>
    </>
  );
};
