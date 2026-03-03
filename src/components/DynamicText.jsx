import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DynamicText = ({ slides, isTitle }) => {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const intervalId = setInterval(() => {
      setSlideIndex(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(intervalId);
  }, [slides]);

  const currentSlide = slides && slides[slideIndex] ? slides[slideIndex] : { title: '', subtitle: '' };
  const textToRender = isTitle ? currentSlide.title : currentSlide.subtitle;

  if (!textToRender) return null;

  const parts = textToRender.split(/\{gradient\}(.*?)\{\/gradient\}/g);

  const sentenceVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={slideIndex}
        variants={sentenceVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {parts.map((part, index) => {
          const isGradient = index % 2 === 1;
          return (
            <span key={index} className={isGradient ? 'gradient-text' : ''}>
              {part.split('').map((char, charIndex) => (
                <motion.span key={charIndex} variants={letterVariants} style={{ display: 'inline-block' }}>
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </span>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
};

export default DynamicText;