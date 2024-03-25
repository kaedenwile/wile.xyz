import './home.css';
import { useState } from 'react';
import { Battleground } from '@wile/battleground';

import homeData from './data.json';
import { HomeData } from './types.gen';
import { NotionContent } from '../components';
import { Link } from '@tanstack/react-router';

export const Home = () => {
  const tabs = homeData as HomeData[];
  tabs.sort((a, b) => a.order! - b.order!);

  const [activeTab, setActiveTab] = useState(-1);

  return (
    <>
      <Battleground className="battleground" />
      <div id="website">
        <h1 className="no-select">wile.xyz</h1>

        <div id="body">
          <div id="links">
            {tabs.map(({ name, link }, i) => {
              const commonProps = {
                key: i,
                children: name,
              };

              if (link?.startsWith('https://')) {
                return <a {...commonProps} href={link} />;
              } else if (link) {
                return <Link {...commonProps} to={link} />;
              } else {
                const isActive = i === activeTab;
                return (
                  <a
                    {...commonProps}
                    onClick={() => setActiveTab(isActive ? -1 : i)}
                    className={isActive ? 'active' : ''}
                  />
                );
              }
            })}
          </div>
          <div className="content-container">
            <div className="content">
              <NotionContent content={tabs[activeTab]?.content} />
            </div>
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
