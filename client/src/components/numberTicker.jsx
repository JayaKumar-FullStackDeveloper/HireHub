import React, { useState, useEffect } from "react";

const NumberTicker = ({ count }) => {
  const [displayedCount, setDisplayedCount] = useState(0);

  useEffect(() => {
    const step = Math.ceil(count / 100); 
    const intervalTime = Math.max(10, 1000 / count); 

    const interval = setInterval(() => {
      setDisplayedCount((prev) => {
        if (prev + step >= count) {
          clearInterval(interval);
          return count;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [count]);

  return (
    <div className="number-ticker flex items-center justify-center rounded-lg">
      <div className="relative text-3xl font-bold">
        <div className="fade-in">{displayedCount}</div>
      </div>
    </div>
  );
};

export default NumberTicker;
