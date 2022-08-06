import { useEffect, useRef, useState } from "react";
import "./App.css";
import "./settimer.css";
import Counter from "./Counter";

function App() {
  const searchParam = window.location.search;
  const searchParams = new URLSearchParams(searchParam);

  return (
    <div className="App">
      {searchParam ? (
        <CounterWrapper
          time={searchParams.get("time") ?? "00:00:00"}
          msg={searchParams.get("msg") ?? "Short break! Back in.."}
        />
      ) : (
        <SetTimer />
      )}
    </div>
  );
}

const SetTimer = () => {
  // state
  const [time, setTime] = useState("00:00:00");
  const [msg, setMessage] = useState("Short break! Back in..");

  // helpers
  function dateFromStr(date: string) {
    let tempTime = date.split(":");
    let dt = new Date();
    dt.setHours(+tempTime[0]);
    dt.setMinutes(+tempTime[1]);
    dt.setSeconds(+tempTime[2]);
    return dt;
  }

  const timerClickHandler = () => {
    const setTime = dateFromStr(time);
    const tmp = setTime.getTime() - new Date().getTime();
    const timeDiff = new Date(tmp).toISOString().substring(11, 19);
    return timeDiff;
  };

  return (
    <div className="wrapper-timer">
      <input
        type="time"
        onChange={(e) => setTime(e.target.value)}
        defaultValue={"00:00:00"}
        step={1}
        style={{ width: "300px", fontSize: "1.5rem", textAlign: "center" }}
      />
      <input
        type="text"
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "300px", fontSize: "1.5rem", textAlign: "center" }}
        placeholder="Short break! Back in.."
        defaultValue={msg}
      />
      <div className="wrapper-buttons">
        <button
          onClick={() => {
            const time = timerClickHandler();
            location.href = `/?time=${time}&msg=${msg}`;
          }}
        >
          Set Countdown
        </button>
        <span>or</span>
        <button
          onClick={() => {
            location.href = `/?time=${time}&msg=${msg}`;
          }}
        >
          Set Timer
        </button>
      </div>
    </div>
  );
};

const CounterWrapper = ({ time, msg }: { time: string; msg: string }) => {
  // state
  const totalSecs = time.split(":").reduce((acc, time) => 60 * acc + +time, 0);
  const [count, setCount] = useState(totalSecs);
  const interval = useRef<ReturnType<typeof setTimeout>>();

  // effects
  useEffect(() => {
    interval.current = setInterval(() => {
      setCount((count) => count - 1);
    }, 1000);
    return () => clearInterval(interval.current);
  }, []);

  // helpers
  if (count < 0) {
    clearTimeout(interval.current);
    setCount(0);
  }

  return (
    <>
      <h1>{msg}</h1>
      <div className="wrapper">
        <Counter value={count} variant="hours" />
        <Counter value={count} variant="minutes" />
        <Counter value={count} variant="seconds" />
      </div>
      <div className="wrapper">
        <a href="/">reset</a>
      </div>
    </>
  );
};

export default App;
