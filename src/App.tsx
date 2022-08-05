import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(60 * 60 * 2 - 361);
  const interval = useRef<any>();
  useEffect(() => {
    interval.current = setInterval(() => {
      setCount((count) => count - 1);
    }, 1000);
    return () => clearInterval(interval.current);
  }, []);
  if (count === 0) {
    clearTimeout(interval.current);
  }
  return (
    <div className="App">
      <h1>Starting in</h1>
      <div className="wrapper">
        <Counter value={count} variant="hours" />
        <Counter value={count} variant="minutes" />
        <Counter value={count} variant="seconds" />
      </div>
    </div>
  );
}

export default App;

type Variant = "hours" | "minutes" | "seconds";
enum VariantEnum {
  hours = 24 * 60 * 60,
  minutes = 60 * 60,
  seconds = 60,
}
const Counter = ({ value, variant }: { value: number; variant: Variant }) => {
  const circle = useRef<SVGCircleElement>(null);
  let displayValue = value % 60;
  if (variant === "hours") {
    displayValue = Math.floor((24 * value) / VariantEnum.hours) % 24;
  } else if (variant === "minutes") {
    displayValue = Math.floor((60 * value) / VariantEnum.minutes) % 60;
  }
  // console.log(displayValue);
  useEffect(() => {
    if (!circle.current) return;
    const length =
      2 * Math.PI * parseInt(circle.current?.getAttribute("r") || "0");
    circle.current.style.strokeDasharray = `${length} ${length}`;
    const percentage = (value / VariantEnum[variant]) % 100;
    const offset = (1 - (percentage % 1)) * length;
    circle.current.style.strokeDashoffset = `${offset}`;
    // circle.current.getBoundingClientRect();
  }, [circle, value]);

  return (
    <div className="item">
      <span>{displayValue}</span>
      <>
        <svg width="160" height="160">
          <circle
            r="60"
            cx="80"
            cy="80 "
            strokeLinecap="round"
            strokeWidth="4"
            fill="none"
            stroke="#141414"
          ></circle>
        </svg>
        <svg width="160" height="160">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00bc9b" />
              <stop offset="100%" stopColor="#5eaefd" />
            </linearGradient>
          </defs>
          <g>
            <circle
              id="circle"
              ref={circle}
              r="60"
              cy="80"
              cx="80"
              strokeWidth="4"
              stroke="url(#gradient)"
              fill="none"
              style={{ transition: "stroke-dashoffset 1s ease-out" }}
            />
          </g>
        </svg>
      </>
    </div>
  );
};
