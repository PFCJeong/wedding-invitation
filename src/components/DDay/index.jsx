/* eslint-disable no-alert, no-new, react/jsx-one-expression-per-line */
import React, { useState } from 'react';

function DDay() {
  const [diffDay, setDiffDay] = useState({});

  const makeDiffDay = () => {
    const masTime = new Date('2026-03-28 13:30:00');
    const todayTime = new Date();

    const diff = masTime - todayTime;

    const tempDay = String(Math.floor(diff / (1000 * 60 * 60 * 24)));
    const diffHour = String(
      Math.floor((diff / (1000 * 60 * 60)) % 24),
    ).padStart(2, '0');
    const diffMin = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(
      2,
      '0',
    );
    const diffSec = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
    setDiffDay((curDay) => {
      const newDay = { ...curDay };
      newDay.day = tempDay;
      newDay.hour = diffHour;
      newDay.min = diffMin;
      newDay.sec = diffSec;
      return newDay;
    });
  };

  setTimeout(makeDiffDay, 1000);

  return (
    <div className="dday">
      <div className="text">
        원식&nbsp;
        <span>♥</span> 세인의 결혼식까지 <span>{diffDay.day}일</span>{' '}
      </div>
      <div className="count">
        <div className="count-item">
          <div>{diffDay.day}</div>
          <div>days</div>
        </div>
        <span>:</span>
        <div className="count-item">
          <div>{diffDay.hour}</div>
          <div>hour</div>
        </div>
        <span>:</span>
        <div className="count-item">
          <div>{diffDay.min}</div>
          <div>min</div>
        </div>
        <span>:</span>
        <div className="count-item">
          <div>{diffDay.sec}</div>
          <div>sec</div>
        </div>
      </div>
    </div>
  );
}

export default DDay;
