import NavLink from "./NavLink";

import "./styles.css";

const Navigation = () => (
  <nav className="mainNavigation">
    <ul>
      <NavLink path="/" title="Game Board" />
      <NavLink path="/score" title="Scoresheet" />
      <NavLink path="/players" title="Players" />
      <NavLink path="/rules" title="Rules" />
    </ul>
  </nav>
);

export default Navigation;
