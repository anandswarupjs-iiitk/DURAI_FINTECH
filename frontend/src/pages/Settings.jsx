import DashboardLayout from "../layouts/DashboardLayout";

import ProfileCard from "../components/settings/ProfileCard";
import PasswordForm from "../components/settings/PasswordForm";
import TwoFactorSettings from "../components/settings/TwoFactorSettings";

const Settings = () => {
  return (

    <DashboardLayout>

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Profile & Settings
        </h1>

        <p className="text-gray-400 mt-2">
          Manage your profile and security preferences.
        </p>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        <div>
          <ProfileCard />
        </div>

        <div className="xl:col-span-2 space-y-6">

          <PasswordForm />

          <TwoFactorSettings />

        </div>

      </div>

    </DashboardLayout>

  );
};

export default Settings;