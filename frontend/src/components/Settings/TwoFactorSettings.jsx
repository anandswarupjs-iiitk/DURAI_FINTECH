const TwoFactorSettings = () => {
  return (

    <div className="bg-[#0B1120]
    border border-orange-500/10
    rounded-2xl p-6">

      <div className="flex items-center justify-between">

        <div>

          <h3 className="text-2xl font-semibold">
            Two-Factor Authentication
          </h3>

          <p className="text-gray-400 mt-2">
            Secure your account with 2FA verification.
          </p>

        </div>

        <button
          className="bg-green-500/20
          text-green-400 px-5 py-3
          rounded-xl"
        >

          Enabled

        </button>

      </div>

    </div>

  );
};

export default TwoFactorSettings;