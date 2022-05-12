import { Link, useMatch } from "react-router-dom";

import "./styles.css";

const Navigation = ({ title, path }) => {
  const match = useMatch(path);

  return (
    <li className={`${match ? "active" : ""}`}>
      <Link to={path}>{title}</Link>
    </li>
  );
};

export default Navigation;
