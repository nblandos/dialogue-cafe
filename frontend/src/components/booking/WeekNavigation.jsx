import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';

const WeekNavigation = ({ onPrevWeek, onNextWeek, onCurrentWeek }) => (
  <div className="flex gap-2">
    <button
      onClick={onPrevWeek}
      className="rounded-md bg-gray-200 p-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
      aria-label="Previous Week"
    >
      <FaCaretLeft size={20} />
    </button>
    <button
      onClick={onCurrentWeek}
      className="rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
    >
      Current Week
    </button>
    <button
      onClick={onNextWeek}
      className="rounded-md bg-gray-200 p-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
      aria-label="Next Week"
    >
      <FaCaretRight size={20} />
    </button>
  </div>
);

export default WeekNavigation;
