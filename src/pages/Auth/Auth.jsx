import { Outlet } from "react-router-dom";

const Auth = () => {
  return (
    <div>
      <h1>Auth Page</h1>
      <Outlet />
    </div>
  );
};

export default Auth;
