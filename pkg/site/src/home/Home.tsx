import './home.css';
import { useState } from 'react';
import { Battleground } from '@wile/battleground';

import homeData from '../../data.json';
import { HomeData } from './types.ts';
import { HomeContent } from './HomeContent.tsx';

export const Home = () => {
  const tabs = homeData as HomeData;

  const [activeTab, setActiveTab] = useState(-1);

  return (
    <>
      <Battleground className="battleground" />
      <div id="website">
        <h1 className="no-select">wile.xyz</h1>

        <div id="body">
          <div id="links">
            {tabs.map(({ title, link }, i) => (
              <a
                key={i}
                href={link ?? undefined}
                onClick={() => setActiveTab((active) => (i === active ? -1 : i))}
                className={i === activeTab ? 'active' : ''}
              >
                {title}
              </a>
            ))}
          </div>
          <div className="content-container">
            <HomeContent content={tabs[activeTab]?.content} />
          </div>
        </div>

        <div id="footer">
          <div id="copyright">
            <a href="https://github.com/kaedenwile/XYZWebsite">Code</a>
            (c) 2024, Kaeden Wile
          </div>

          <img id="logo" src="/img/kw-logo.png" alt="KW Logo" className="no-select" />
        </div>
      </div>
    </>
  );
};
