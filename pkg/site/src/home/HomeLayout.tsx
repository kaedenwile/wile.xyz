import { ReactNode } from 'react';
import { Battleground } from '@wile/battleground';

import './home.css';

export type HomeLayoutProps = {
  showBattleground?: boolean;
  children: ReactNode;
};

export const HomeLayout = ({ showBattleground, children }: HomeLayoutProps) => {
  return (
    <>
      {showBattleground && <Battleground className="battleground" />}
      <div id="website">
        <h1>wile.xyz</h1>

        {children}

        <div id="footer">
          <div id="copyright">
            <a href="https://github.com/kaedenwile/XYZWebsite">Code</a>
            (c) 2024, Kaeden Wile
          </div>

          <img id="logo" src="/img/kw-logo.png" alt="KW Logo" />
        </div>
      </div>
    </>
  );
};
