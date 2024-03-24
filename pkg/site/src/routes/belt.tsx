import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import '../belt/belt.css';

export const Route = createFileRoute('/belt')({
  component: BeltLayout,
});

function BeltLayout() {
  return (
    <div className="belt">
      <h1>BELT</h1>
      <Outlet />
      <div id="footer">
        <a href="/pdf/belt-privacy-policy.pdf">Privacy Policy</a>
        <Link to="/belt/whats-new">What's New</Link>
        <Link to="/">wile.xyz</Link>
        <div>(c) 2021 Kaeden Wile</div>
      </div>
    </div>
  );
}
