import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DateTimePicker({ value, onChange }: { value: Date | null, onChange: (date: Date | null) => void }) {
  return (
    <div className="w-full flex flex-col items-center">
      <DatePicker
        selected={value}
        onChange={onChange}
  showTimeSelect
        timeFormat="HH:mm:ss"
        timeIntervals={1}
        dateFormat="MMMM d, yyyy h:mm:ss aa"
        placeholderText="Select exact date & time"
        className="w-full p-4 mb-10 border-2 border-fuchsia-400 rounded-3xl focus:outline-none focus:ring-4 focus:ring-fuchsia-400 transition shadow-2xl bg-gradient-to-r from-fuchsia-100 via-blue-100 to-cyan-100 text-lg font-extrabold text-blue-700 drop-shadow-xl animate-zoomInOut"
        popperClassName="rounded-3xl shadow-[0_16px_48px_0_rgba(31,38,135,0.37),0_3px_12px_0_rgba(0,0,0,0.18)] bg-gradient-to-br from-fuchsia-50 via-blue-50 to-cyan-50 border-2 border-fuchsia-300 border-opacity-80 backdrop-blur-2xl p-4"
        calendarClassName="rounded-3xl shadow-xl bg-gradient-to-br from-fuchsia-100 via-blue-100 to-cyan-100 border border-blue-200 border-opacity-60"
      />
    </div>
  );
}
