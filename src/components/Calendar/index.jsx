/* eslint-disable no-alert, no-new, react/jsx-one-expression-per-line,react/no-array-index-key */
import React, { useState, useEffect, useRef } from 'react';

import useScrollFadeIn from '../../hooks/useScrollFadeIn';
import heartIcon from '../../assets/icons/heart.png';

function Calendar() {
  const calendarRef = useRef(null);
  const [calendarArray, setCalendarArray] = useState([]);

  useScrollFadeIn(calendarRef);

  const makeCalendarGrid = () => {
    const temp = [];
    for (let i = 0; i < 30; i += 1) {
      const a = Math.floor(i / 7);
      // const b = i % 7;
      const index = a;

      if (temp[index]) {
        temp[index].push(i + 1);
      } else {
        temp.push([i + 1]);
      }
    }
    return temp;
  };

  useEffect(() => {
    setCalendarArray(makeCalendarGrid());
  }, []);

  return (
    <div className="calendar" ref={calendarRef}>
      <div className="month">
        <span className="month-subtext">March</span>
        <span className="month-text">3월</span>
      </div>
      <div className="calendar-wrapper">
        <div className="dayname">
          <div>일</div>
          <div>월</div>
          <div>화</div>
          <div>수</div>
          <div>목</div>
          <div>금</div>
          <div>토</div>
        </div>
        <div className="grid">
          {calendarArray.map((week) => (
            <div className="week" key={week}>
              {week.map((day, index) => (
                <div key={`day_${index}`} className="day">
                  <span className={day === 28 ? 'wedding' : ''}>{day}</span>
                  {day === 28 && <img src={heartIcon} alt="" />}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Calendar;
