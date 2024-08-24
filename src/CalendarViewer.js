// src/CalendarViewer.js
import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addYears,
  subYears,
} from 'date-fns';
import './CalendarViewer.css';

const CalendarViewer = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [view, setView] = useState('month');

  const renderHeader = () => {
    const dateFormat = "MMMM yyyy";
    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={prevYear}>«</div>
          <div className="icon" onClick={prevMonth}>‹</div>
        </div>
        <div className="col col-center">
          <span>{format(currentDate, dateFormat)}</span>
        </div>
        <div className="col col-end">
          <div className="icon" onClick={nextMonth}>›</div>
          <div className="icon" onClick={nextYear}>»</div>
        </div>
        <div className="col col-end">
          <button onClick={toggleView}>
            {view === 'month' ? 'Week View' : 'Month View'}
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = "EEE";
    let startDate = startOfWeek(currentDate);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="days row">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        const dayEvents = events[format(day, 'yyyy-MM-dd')] || [];
        days.push(
          <div
            className={`col cell ${
              !isSameMonth(day, monthStart)
                ? "disabled"
                : isSameDay(day, new Date()) ? "selected" : ""
            }`}
            key={day}
            onClick={() => onDateClick(cloneDay)}
          >
            <span className="number">{formattedDate}</span>
            {dayEvents.length > 0 && <span className="event-indicator">•</span>}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  };

  const onDateClick = day => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const newEvent = prompt('Enter event details:');
    if (newEvent) {
      setEvents(prevEvents => ({
        ...prevEvents,
        [dateKey]: [...(prevEvents[dateKey] || []), newEvent]
      }));
    }
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextYear = () => {
    setCurrentDate(addYears(currentDate, 1));
  };

  const prevYear = () => {
    setCurrentDate(subYears(currentDate, 1));
  };

  const toggleView = () => {
    setView(view === 'month' ? 'week' : 'month');
  };

  return (
    <div className="calendar">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default CalendarViewer;
