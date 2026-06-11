const suggestions = [
  "Enable multi-factor authentication immediately.",
  "Block transactions from suspicious IP regions.",
  "Force password reset for high-risk accounts.",
  "Review recent device login history.",
];

const SecuritySuggestions = () => {
  return (
    <div className="bg-[#0B1120]
    border border-orange-500/10
    rounded-2xl p-6">

      <h3 className="text-xl font-semibold mb-6">
        AI Security Recommendations
      </h3>

      <div className="space-y-4">

        {suggestions.map((item, index) => (

          <div
            key={index}
            className="bg-[#131C31]
            rounded-xl p-4 flex items-start gap-3"
          >

            <div className="w-3 h-3 rounded-full
            bg-orange-500 mt-2"></div>

            <p className="text-gray-300">
              {item}
            </p>

          </div>

        ))}

      </div>
    </div>
  );
};

export default SecuritySuggestions;