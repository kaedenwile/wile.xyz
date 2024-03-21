import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/belt/whats-new')({
  component: BeltWhatsNew,
});

function BeltWhatsNew() {
  return (
    <>
      <div id="whats-new" className="content">
        <div id="versions-container">
          <div className="version">
            <h2>2.4.2</h2>
            <ul>
              <li>Various bug fixes</li>
            </ul>
          </div>

          <div className="version">
            <h2>2.4.1</h2>
            <ul>
              <li>Added App Store video</li>
            </ul>
          </div>

          <div className="version">
            <h2>2.4.0</h2>
            <ul>
              <li>Added new ships!</li>
              <li>Redesigned home screen</li>
              <li>Various bug fixes</li>
            </ul>
          </div>

          <div className="version">
            <h2>2.3.0</h2>
            <ul>
              <li>Introducing new Hard Mode!</li>
              <li>Updated Stats page to show all game modes</li>
              <li>Various bug fixes</li>
            </ul>
          </div>

          <div className="version">
            <h2>2.2.2</h2>
            <ul>
              <li>Redesigned game-over screen</li>
              <li>Made game-over graphics interactive</li>
            </ul>
          </div>

          <div className="version">
            <h2>2.2.1</h2>
            <ul>
              <li>Merry Christmas!</li>
              <li>Added some holiday cheer</li>
            </ul>
          </div>

          <div className="version">
            <h2>2.2.0</h2>
            <ul>
              <li>Updated Stats page, with native UI for leaderboard rank</li>
              <li>Added images to Game Center leaderboards</li>
              <li>Added Game Center achievements</li>
            </ul>
          </div>

          <div className="version">
            <h2>2.1.2</h2>
            <ul>
              <li>Show fuel bar instead of number</li>
              <li>Update tutorial with fuel bar</li>
              <li>Update screenshots in app store listing</li>
            </ul>
          </div>

          <div className="version">
            <h2>2.1.1</h2>
            <p>This update features minor changes:</p>
            <ul>
              <li>Tapping upgrades list shows upgrade card</li>
              <li>Update links in app store listing</li>
            </ul>
          </div>

          <div className="version">
            <h2>2.1.0</h2>
            <p>This update adds various popups throughout the game:</p>
            <ul>
              <li>Tutorial popup shows at app launch</li>
              <li>Re-enable the tutorial from the Menu</li>
              <li>What's New popup now shows whenever the game updates</li>
              <li>Add popup asking for user feedback</li>
            </ul>
          </div>

          <div className="version">
            <h2>2.0.4</h2>
            <p>This update features multiple game improvements:</p>
            <ul>
              <li>Re-balance the Charge Beam powerup</li>
              <li>Add powerup upgrades related to duration</li>
              <li>Add upgrades list interface</li>
            </ul>
          </div>

          <div className="version">
            <h2>2.0.3</h2>
            <p>General feature improvements and bug fixes. Thanks for playing and keep blasting asteroids!</p>
          </div>

          <div className="version">
            <h2>2.0.2</h2>
            <p>General feature improvements and bug fixes. Thanks for playing and keep blasting asteroids!</p>
          </div>
        </div>

        <Link to="/belt">Back</Link>
      </div>
    </>
  );
}
