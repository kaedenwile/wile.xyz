import { HomeLayout } from './HomeLayout.tsx';

export const NotFound = () => {
  return (
    <HomeLayout>
      <div id="not-found">
        <div className="title">404 - Page Not Found</div>
        <div className="body">
          The page you were looking for could not be found. Go back to <a href="/">wile.xyz</a>.
        </div>
      </div>
    </HomeLayout>
  );
};
