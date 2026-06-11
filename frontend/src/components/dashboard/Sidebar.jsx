import {
  FiGrid,
  FiActivity,
  FiCreditCard,
  FiPieChart,
  FiSettings,
} from "react-icons/fi";

import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {

  const location = useLocation();

  return (
    <div
      className="fixed left-0 top-0 h-screen w-[250px]
      bg-[#0B1120] border-r border-orange-500/10 p-6"
    >

      <div className="mb-12">

        <h1 className="text-3xl font-bold">
          <span className="text-orange-500">Fraud</span>Guard
        </h1>

        <p className="text-xs text-orange-400 tracking-widest mt-1">
          AI FRAUD DETECTION
        </p>

      </div>

      <nav className="space-y-4">

        <Link to="/dashboard">
          <SidebarItem
            icon={<FiGrid />}
            title="Dashboard"
            active={location.pathname === "/dashboard"}
          />
        </Link>

        <Link to="/fraud-monitor">
          <SidebarItem
            icon={<FiActivity />}
            title="Fraud Monitor"
            active={location.pathname === "/fraud-monitor"}
          />
        </Link>

        <Link to="/transactions">
       <SidebarItem
        icon={<FiCreditCard />}
         title="Transactions"
          active={location.pathname === "/transactions"}
         />
        </Link>

        <Link to="/analytics">
        <SidebarItem
        icon={<FiPieChart />}
         title="Analytics"
        active={location.pathname === "/analytics"}
        />
        </Link>

       <Link to="/settings">
          <SidebarItem
          icon={<FiSettings />}
           title="Settings"
            active={location.pathname === "/settings"}
           />
         </Link>

      </nav>

    </div>
  );
};

const SidebarItem = ({ icon, title, active }) => {

  return (

    <div
      className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all
      ${
        active
          ? "bg-orange-500 text-black"
          : "text-gray-400 hover:bg-[#131C31] hover:text-white"
      }`}
    >

      <span className="text-xl">{icon}</span>

      <span>{title}</span>

    </div>

  );
};

export default Sidebar;