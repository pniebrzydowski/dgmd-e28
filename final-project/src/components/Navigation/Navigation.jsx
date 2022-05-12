import { Link } from "react-router-dom"

import './styles.css';

const Navigation = () => (
  <nav className="mainNavigation">
    <ul>
      <li><Link to="/">Game Board</Link></li>
      <li><Link to="/score">Scoresheet</Link></li>
      <li><Link to="/players">Players</Link></li>
    </ul>
  </nav>
);

export default Navigation;