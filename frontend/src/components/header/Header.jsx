import { useState, useEffect } from 'react';
import { FaUniversalAccess, FaTimes } from 'react-icons/fa';
import NavLinks from './NavLinks';
import HighContrastToggle from './HighContrastToggle';
import DyslexicFontToggle from './DyslexicFontToggle';
import FontSizeAdjuster from './FontSizeAdjuster';
import ScreenReaderToggle from './ScreenReaderToggle';

const Header = () => {
  const [isHighContrast, setIsHighContrast] = useState(() => {
    return localStorage.getItem('highContrast') === 'true';
  });
  const [isDyslexicFont, setIsDyslexicFont] = useState(() => {
    return localStorage.getItem('dyslexicFont') === 'true';
  });
  const [isScreenReaderOn, setIsScreenReaderOn] = useState(() => {
    return localStorage.getItem('screenReader') === 'true';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', isHighContrast);
    localStorage.setItem('highContrast', isHighContrast);
  }, [isHighContrast]);

  useEffect(() => {
    document.documentElement.classList.toggle('dyslexic-font', isDyslexicFont);
    localStorage.setItem('dyslexicFont', isDyslexicFont);
  }, [isDyslexicFont]);

  return (
    <nav className="fixed inset-x-0 top-0 z-10 bg-orange-500 px-4 shadow-xl xl:px-16">
      <div className="flex h-24 items-center justify-between">
        <div
          className="mr-6 text-2xl font-bold text-white xl:text-4xl"
          data-screen-reader-text="Dialogue Cafe"
        >
          Dialogue Cafe
        </div>

        <div className="flex items-center gap-4 xl:gap-6">
          {/* Nav Links */}
          <div className="flex items-center gap-6 xl:mr-16 xl:gap-12">
            <NavLinks />
          </div>

          {/* Desktop Accessibility Toggles */}
          <div className="hidden items-center gap-4 xl:flex">
            <HighContrastToggle
              isHighContrast={isHighContrast}
              setIsHighContrast={setIsHighContrast}
            />
            <DyslexicFontToggle
              isDyslexicFont={isDyslexicFont}
              setIsDyslexicFont={setIsDyslexicFont}
            />
            <ScreenReaderToggle
              isScreenReaderOn={isScreenReaderOn}
              setIsScreenReaderOn={setIsScreenReaderOn}
            />
            <FontSizeAdjuster />
          </div>

          {/* Mobile Menu Toggle Button with Accessibility Icon */}
          <button
            className="text-white xl:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={
              isMobileMenuOpen
                ? 'Close accessibility menu'
                : 'Open accessibility menu'
            }
            aria-expanded={isMobileMenuOpen}
            data-screen-reader-text={
              isMobileMenuOpen
                ? 'Close accessibility menu'
                : 'Open accessibility menu'
            }
          >
            {isMobileMenuOpen ? (
              <FaTimes size={24} />
            ) : (
              <FaUniversalAccess size={24} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown: Accessibility Menu */}
      <div
        className={`absolute left-0 right-0 top-24 flex flex-col bg-orange-500 p-4 shadow-xl transition-all duration-300 xl:hidden ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 overflow-hidden opacity-0'} `}
      >
        <div className="flex justify-center gap-6">
          <HighContrastToggle
            isHighContrast={isHighContrast}
            setIsHighContrast={setIsHighContrast}
          />
          <DyslexicFontToggle
            isDyslexicFont={isDyslexicFont}
            setIsDyslexicFont={setIsDyslexicFont}
          />
          <ScreenReaderToggle
            isScreenReaderOn={isScreenReaderOn}
            setIsScreenReaderOn={setIsScreenReaderOn}
          />
        </div>
        <div className="mt-4 flex justify-center">
          <FontSizeAdjuster />
        </div>
      </div>
    </nav>
  );
};

export default Header;
