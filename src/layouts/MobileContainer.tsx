import { Outlet } from "react-router-dom";

function MobileContainer() {
  return (
    <div className="min-h-screen bg-base-300 flex justify-center">
      <div className="w-full max-w-md bg-base-200 min-h-screen shadow-lg">
        <Outlet />
      </div>
    </div>
  );
}

export default MobileContainer;
