const PasswordForm = () => {
  return (

    <div className="bg-[#0B1120]
    border border-orange-500/10
    rounded-2xl p-6">

      <h3 className="text-2xl font-semibold mb-6">
        Update Password
      </h3>

      <div className="space-y-5">

        <input
          type="password"
          placeholder="Current Password"
          className="w-full bg-[#131C31]
          rounded-xl p-4 outline-none"
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full bg-[#131C31]
          rounded-xl p-4 outline-none"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full bg-[#131C31]
          rounded-xl p-4 outline-none"
        />

        <button
          className="bg-orange-500 hover:bg-orange-400
          transition-all text-black font-semibold
          px-6 py-3 rounded-xl"
        >

          Update Password

        </button>

      </div>

    </div>

  );
};

export default PasswordForm;