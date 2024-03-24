import { createFileRoute, Link } from '@tanstack/react-router';
import { BeltData, whatsNewData } from '../belt';
import { NotionContent } from '../components';

export const Route = createFileRoute('/belt/whats-new')({
  component: BeltWhatsNew,
});

function BeltWhatsNew() {
  const beltData = whatsNewData as BeltData;
  beltData.sort((a, b) => b.version.localeCompare(a.version));

  return (
    <>
      <div id="whats-new" className="content">
        <div id="versions-container">
          {beltData.map(({ version, content }, i) => (
            <div className="whats-new-block" key={i}>
              <h2>{version}</h2>
              <NotionContent content={content} />
            </div>
          ))}
        </div>

        <Link to="/belt">Back</Link>
      </div>
    </>
  );
}
