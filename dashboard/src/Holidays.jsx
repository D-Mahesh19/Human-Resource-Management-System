import React from 'react'
import { useHolidays } from './HolidayContex';

export default function Holidays() {
    const {holidayList}  = useHolidays();

  return (
    <div className='Holidays'>
            <div className="holidays-container">
                <h1 className="title1">National Holidays</h1>
                <div className="holidays-section">
                    <ul className="holiday-list">
                        {holidayList.map((holiday, index) => (
                            <li key={index} className="holiday-item">
                                <span className="holiday-date">{holiday.date}</span>
                                <span className="holiday-name">{holiday.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            </div>
  )
}



