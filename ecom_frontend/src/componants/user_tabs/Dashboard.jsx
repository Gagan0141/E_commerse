import React from "react";

export default function Dashboard({ user, stats = [] }) {
  return (
    <>
      {/* Welcome Banner */}
      <div
        className="
          bg-gradient-to-r
          from-blue-500
          to-purple-600
          rounded-2xl
          p-6
          text-white
          shadow-lg
        "
      >
        <h1 className="text-2xl md:text-3xl font-bold">
          Welcome back, {user?.name}!
        </h1>

        <p className="mt-2 text-sm md:text-base opacity-90">
          Here is your live account overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-5
        "
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            className="
              bg-white
              rounded-2xl
              p-5
              shadow-sm
              border
              border-gray-100
              hover:shadow-md
              transition
            "
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>

                <h2 className="text-3xl font-bold text-gray-800 mt-2">
                  {stat.value}
                </h2>

                {stat.subtitle && (
                  <p className="text-xs text-gray-400 mt-1">{stat.subtitle}</p>
                )}
              </div>

              <div
                className="
                  w-12
                  h-12
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  bg-gray-100
                  text-2xl
                "
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
