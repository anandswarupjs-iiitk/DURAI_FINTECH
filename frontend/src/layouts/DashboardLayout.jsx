import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex bg-[#050816] min-h-screen text-white">
      
      <Sidebar />

      <div className="flex-1 ml-[250px]">
        <Topbar />

        <main className="p-6">
          {children}
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;