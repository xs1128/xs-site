import React from 'react';

/**
 * Props for AnimatedHeadline component
 */
export interface AnimatedHeadlineProps {
  /** The headline text to animate word by word */
  text: string;
  /** Whether the element is visible */
  isVisible: boolean;
}

/**
 * Animated headline with word-by-word reveal effect
 * Each word animates in with staggered delay and highlights on hover
 * Automatically reverses when scrolling away
 *
 * @param props - Component props
 * @returns JSX element with animated words
 *
 * @example
 * ```tsx
 * <AnimatedHeadline
 *   text="I turn real problems into automated solutions."
 *   isVisible={isVisible}
 * />
 * ```
 */
export function AnimatedHeadline({ text, isVisible }: AnimatedHeadlineProps) {
  const words = text.split(' ');
  const accentWords = ['automated', 'solutions'];

  return (
    <h2 className={`about-content__headline ${isVisible ? 'about-content__headline--visible' : ''}`}>
      {words.map((word, index) => {
        const isAccent = accentWords.includes(word.replace('.', '').toLowerCase());
        const needsLineBreak = word.toLowerCase() === 'automated';

        return (
          <React.Fragment key={index}>
            {needsLineBreak && <br />}
            <span
              className={`about-content__word ${isAccent ? 'about-content__word--accent' : ''}`}
              style={{
                '--word-delay': isVisible ? `${index * 0.05}s` : '0s',
                marginRight: '0.25em'
              } as React.CSSProperties}
            >
              <span className="about-content__word-inner">{word}</span>
            </span>
          </React.Fragment>
        );
      })}
    </h2>
  );
}
