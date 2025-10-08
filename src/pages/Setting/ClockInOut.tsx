import React, { useEffect } from "react";
import { useUserStore } from "@/store/zustandStores";
import type { UserProfile } from "@/store/zustandStores";
import PowerIcon from "@/icons/PowerIcon";

function RecentActivities() {
  const activities = useUserStore((s) => s.activities);
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Recent Activities</h2>
      <div className="flex flex-col gap-4">
        {activities.map((a, i) => (
          <div
            key={i}
            className="flex items-center bg-white rounded-lg shadow p-4 gap-4"
          >
            <div className="flex flex-col items-center justify-center bg-primary-gradient text-white rounded-md w-14 h-14 font-extrabold text-lg">
              <span>{a.date.split(" ")[0]}</span>
              <span className="text-xs">{a.date.split(" ")[1]}</span>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-base">{a.text}</div>
              <div className="text-xs text-gray-500 mt-1">{a.ago}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const infoBoxes = [
  (user: UserProfile | null) => ({
    content: (
      <>
        <img
          src={user?.profilePic}
          alt="avatar"
          className="w-14 h-14 rounded-full mr-2 inline-block align-middle"
        />
        <div className="flex flex-col justify-around">
          <span className="align-middle font-medium">{user?.name}</span>
          <span className="text-sm  font-normal">{user?.role}</span>
        </div>
      </>
    ),
    className: "min-w-[120px] flex items-center flex-row",
  }),
  () => ({
    content: (
      <div className="flex flex-col justify-center items-center">
        <span className="font-bold">8:00 am</span>
        <span className="text-xs">Clock in</span>
      </div>
    ),
    className: "",
  }),
  (user: UserProfile | null) => ({
    content: (
      <>
        <span className="font-bold">
          {user?.workSummary?.today?.workedTime || "00"}
        </span>
        <span className="text-xs">hrs <br/>Worked today</span>
      </>
    ),
    className: "",
  }),
  () => ({
    content: (
      <>
        <span className="font-bold">
            00
            </span>
        <span className="text-xs">mins <br/>Break</span>
      </>
    ),
    className: "",
  }),
  () => ({
    content: (
      <>
        <span className="font-bold">--</span>
        <span className="text-xs">mins<br/> Break</span>
      </>
    ),
    className: "",
  }),
  (user: UserProfile | null) => ({
    content: (
      <>
        <span className="font-bold">
          {user?.workDetails?.leavesLeft ?? "--"}
        </span>
        <span className="text-xs">Leaves Left</span>
      </>
    ),
    className: "",
  }),
];

const ClockInOut: React.FC = () => {
  const user = useUserStore((s) => s.user);
  const isClockedIn = useUserStore((s) => s.isClockedIn);
  const clockIn = useUserStore((s) => s.clockIn);
  const clockOut = useUserStore((s) => s.clockOut);
  const fetchActivities = useUserStore((s) => s.fetchActivities);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleClock = async () => {
    if (isClockedIn) {
      await clockOut();
    } else {
      await clockIn();
    }
  };

  return (
    <div className=" m-6 px-2 sm:px-6 md:px-10 py-6 w-full">
      <h1 className="text-3xl sm:text-2xl font-bold mb-6">
        Employee Clock in / out
      </h1>
      <div className="flex  items-center justify-center mb-8  ">
        <div className=" flex flex-col items-center bg-white custom-shadow px-12 py-10 rounded-lg">

        <div className=" rounded-full shadow-lg">
          <div
            className={`w-24 h-24 md:w-32 md:h-32 flex justify-center items-center rounded-full  ${
              isClockedIn ? "bg-primary-gradient" : "bg-primary-gradient-light"
            }`}
          >
            {isClockedIn ? <PowerIcon color="white" /> : <PowerIcon />}
          </div>
        </div>
        <div className="gradient-border mt-6 w-[150px] text-center">
          <button
            className={`   transition-all duration-200 w-[148px]  ${
              isClockedIn
                ? " text-black gradient-border-inner bg-white" // clocked out style
                : "bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F]  text-white p-3 rounded-xl " // clocked in style
            }`}
            onClick={handleClock}
          >
            {isClockedIn ? "Clock out" : "Clock in"}
          </button>
        </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {infoBoxes.map((fn, i) => (
          <div
            key={i}
            className={`rounded-lg px-4 py-3 flex flex-col items-center justify-center text-center ${
              i === 0
                ? "bg-primary-gradient-light text-primary"
                : "bg-primary-gradient text-white"
            } ${fn(user).className}`}
            style={{ minWidth: 110 }}
          >
            {fn(user).content}
          </div>
        ))}
      </div>
      <RecentActivities />
    </div>
  );
};

export default ClockInOut;
