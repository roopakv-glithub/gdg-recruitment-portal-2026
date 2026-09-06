"use client";
import React, { useState, useEffect } from "react";

const CountdownTimer = ({ targetDate = "2026-08-23T23:59:59+05:30", className = "" }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const TimeUnit = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className=" ">
          <div className="font-bold text-white tracking-wider">
            {value.toString().padStart(2, "0")}
          </div>
        </div>
      </div>
      <div className="text-gray-400 text-[10px] uppercase tracking-wide">
        {label}
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="flex gap-3">
        <TimeUnit value={timeLeft.days} label="Days" />
        <div className="flex items-center text-2xl text-gray-500 font-bold">
          :
        </div>
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <div className="flex items-center text-2xl text-gray-500 font-bold">
          :
        </div>
        <TimeUnit value={timeLeft.minutes} label="Minutes" />
        <div className="flex items-center text-2xl text-gray-500 font-bold">
          :
        </div>
        <TimeUnit value={timeLeft.seconds} label="Seconds" />
      </div>
    </div>
  );
};

export default CountdownTimer;
