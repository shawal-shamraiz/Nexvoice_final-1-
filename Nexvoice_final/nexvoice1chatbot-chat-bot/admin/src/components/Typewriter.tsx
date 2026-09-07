import React, { useEffect, useState } from 'react';

interface TypewriterProps {
  words: string[];
  speed?: number;
  delay?: number;
  className?: string;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  words,
  speed = 100,
  delay = 2000,
  className = '',
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (words.length === 0) return undefined;

    const word = words[currentWordIndex % words.length] ?? '';
    const duration = !isDeleting && currentText.length === word.length
      ? delay
      : isDeleting
        ? speed / 2
        : speed;

    const timeout = window.setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < word.length) {
          setCurrentText(word.slice(0, currentText.length + 1));
        } else {
          setIsDeleting(true);
        }
        return;
      }

      if (currentText.length > 0) {
        setCurrentText(word.slice(0, currentText.length - 1));
      } else {
        setIsDeleting(false);
        setCurrentWordIndex((previous) => (previous + 1) % words.length);
      }
    }, duration);

    return () => window.clearTimeout(timeout);
  }, [currentText, currentWordIndex, isDeleting, words, speed, delay]);

  return (
    <span className={className} aria-live="polite">
      {currentText}
      <span
        className="inline-block w-0.5 h-6 align-middle bg-[#4F46E5] ml-0.5 animate-pulse"
        aria-hidden="true"
      />
    </span>
  );
};

export default Typewriter;
