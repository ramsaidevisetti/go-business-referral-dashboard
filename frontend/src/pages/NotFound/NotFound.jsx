import { Link } from "react-router-dom";

import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found">

      <h1>404</h1>

      <h2>Page not found</h2>

      <Link to="/">
        Back to dashboard
      </Link>

    </div>
  );
};

export default NotFound;