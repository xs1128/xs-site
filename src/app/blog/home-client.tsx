'use client';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import FunnyMarqueeWrapper from '@/components/blog/FunnyMarqueeWrapper';
import RecentBlogsGrid from '@/components/blog/RecentBlogsGrid';
import BlogExpandedContent from '@/components/blog/BlogExpandedContent';
import AnimatedButton from '@/components/blog/ui/AnimatedButton';
import { ArrowUp, ArrowDown } from 'lucide-react';
import FullScreenNav from '@/components/blog/ui/FullScreenNav';

const useBeforePaintEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

const MARQUEE_RESIZE_MS = 620;

export default function HomePageClient({
  heroImageUrl,
  heroBlurDataURL,
}: {
  heroImageUrl: string;
  heroBlurDataURL: string | null;
}) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isSwapped, setIsSwapped] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [navDroppedIn, setNavDroppedIn] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isMarqueeCollapsed, setIsMarqueeCollapsed] = useState(true);
  const [isMarqueeResizing, setIsMarqueeResizing] = useState(false);
  const [skipTransitions, setSkipTransitions] = useState(false);
  const marqueeResizeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // border-box: the nav resizes by padding alone, which a content-box observer never sees.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const observer = new ResizeObserver(() => {
      document.documentElement.style.setProperty(
        '--nav-h',
        `${nav.offsetHeight}px`,
      );
    });
    observer.observe(nav, { box: 'border-box' });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (marqueeResizeTimer.current) clearTimeout(marqueeResizeTimer.current);
    };
  }, []);

  const toggleMarquee = () => {
    setIsMarqueeCollapsed((previous) => !previous);
    setIsMarqueeResizing(true);
    if (marqueeResizeTimer.current) clearTimeout(marqueeResizeTimer.current);
    marqueeResizeTimer.current = setTimeout(
      () => setIsMarqueeResizing(false),
      MARQUEE_RESIZE_MS,
    );
  };

  // ?expanded=true is a deep link: land on the expanded state instead of
  // travelling there, so kill the transitions for the commit that flips it.
  useBeforePaintEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('expanded') !== 'true') return;

    setSkipTransitions(true);
    setIsSwapped(true);
    setIsExpanded(true);
    setNavDroppedIn(true);

    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setSkipTransitions(false));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 480);
    };

    const checkScroll = () => {
      setIsAtTop(window.scrollY === 0);
    };

    checkScreenSize();
    checkScroll();
    window.addEventListener('resize', checkScreenSize);
    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', checkScreenSize);
      window.removeEventListener('scroll', checkScroll);
    };
  }, []);

  const triggerCardSwap = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (isSwapped) {
      // Going back: collapse and swap simultaneously
      setNavDroppedIn(false);
      setIsExpanded(false);
      setIsSwapped(false);
      setTimeout(() => setIsAnimating(false), 800);
    } else {
      // Going forward: swap and expand simultaneously
      setIsSwapped(true);
      setIsExpanded(true);
      setTimeout(() => {
        setNavDroppedIn(true);
        setTimeout(() => setIsAnimating(false), 400);
      }, 800);
    }
  };

  const transition = (value: string) => (skipTransitions ? 'none' : value);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
    overflowX: 'hidden',
  };

  const cardContainerStyle: React.CSSProperties = {
    position: 'relative',
    width: isExpanded ? '100%' : 'clamp(300px, 90vw, 1100px)',
    height: isExpanded ? '100vh' : 'clamp(400px, 80vh, 750px)',
    overflow: 'hidden',
    overflowX: 'hidden',
    borderRadius: isExpanded ? '0' : '12px',
    transition: transition(
      'width 0.8s ease, height 0.8s ease, border-radius 0.8s ease',
    ),
    willChange: isAnimating ? 'width, height, border-radius' : 'auto',
  };

  // Auto margins, not translateX(-50%): Safari freezes a percentage transform at
  // the layer's pre-animation width while the container's width transitions.
  const cardBaseStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    marginInline: 'auto',
    width: '100%',
    height: '100%',
    borderRadius: '0px',
    transition: transition('transform 0.8s ease'),
  };

  const navStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: isExpanded
      ? 'clamp(10px, 1.5vh, 20px) clamp(30px, 5vw, 60px)'
      : 'clamp(20px, 3vh, 40px) clamp(30px, 5vw, 60px)',
    zIndex: 9999,
    backgroundColor: isExpanded ? 'var(--color-background)' : 'transparent', // Use vintage yellow from color scheme
    transition: transition(
      isExpanded
        ? 'background-color 0.3s ease 0.8s, padding 0.3s ease 0.8s, transform 0.4s var(--ease-out-back) 0.8s'
        : 'background-color 0.8s ease, padding 0.8s ease, opacity 0.2s ease',
    ),
    opacity: navDroppedIn ? 1 : isSwapped ? 0 : isAtTop ? 1 : 0,
    pointerEvents: navDroppedIn
      ? 'auto'
      : isSwapped
        ? 'none'
        : isAtTop
          ? 'auto'
          : 'none',
    transform: 'translateY(0)',
    transformOrigin: 'top',
    willChange: isAnimating
      ? 'padding, background-color, transform, opacity'
      : 'auto',
  };

  const navRightStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(20px, 3vw, 40px)',
  };

  const backButtonTextStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(18px, 2.5vw, 24px)',
    fontWeight: 700,
    color: '#2A2F35',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: transition(
      'opacity 0.2s ease, color 0.3s ease, transform 0.4s var(--ease-out-back) 0.8s',
    ),
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(4px, 0.5vw, 8px)',
    opacity: navDroppedIn ? 1 : 0,
    pointerEvents: navDroppedIn ? 'auto' : 'none',
    transform: navDroppedIn
      ? 'translateY(0)'
      : isSwapped
        ? 'translateY(0)'
        : 'translateY(-20px)',
    transformOrigin: 'top',
  };

  const brandStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(18px, 2.5vw, 24px)',
    fontWeight: 700,
    color: '#2A2F35',
    letterSpacing: '0.05em',
    opacity: !isSwapped || navDroppedIn ? 1 : 0,
    transition: transition(
      'opacity 0.2s ease, color 0.3s ease, transform 0.4s var(--ease-out-back) 0.8s',
    ),
    pointerEvents: navDroppedIn
      ? 'auto'
      : isSwapped
        ? 'none'
        : isAtTop
          ? 'auto'
          : 'none',
    transform: navDroppedIn
      ? 'translateY(0)'
      : isSwapped
        ? 'translateY(0)'
        : 'translateY(10px)',
    transformOrigin: 'top',
  };

  const menuLinkStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(18px, 2.5vw, 24px)',
    fontWeight: 700,
    color: '#2A2F35',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: transition(
      'color 0.3s ease, opacity 0.2s ease, transform 0.4s var(--ease-out-back) 0.8s',
    ),
    opacity: !isSwapped || navDroppedIn ? 1 : 0,
    pointerEvents: navDroppedIn
      ? 'auto'
      : isSwapped
        ? 'none'
        : isAtTop
          ? 'auto'
          : 'none',
    transform: navDroppedIn
      ? 'translateY(0)'
      : isSwapped
        ? 'translateY(0)'
        : 'translateY(10px)',
    transformOrigin: 'top',
    display: 'flex',
    alignItems: 'center',
  };

  const mainStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: isExpanded ? 'flex-start' : 'center',
    alignItems: 'center',
    flex: 1,
    padding: isExpanded ? '0' : '0',
    transition: transition('padding 0.3s ease'),
    width: '100%',
    overflowX: 'hidden',
  };

  const contentBlockStyle: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '0',
    width: 'clamp(300px, 80vw, 1100px)',
    height: 'clamp(400px, 80vh, 750px)',
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  };

  const heroCardStyle: React.CSSProperties = {
    ...cardBaseStyle,
    ...contentBlockStyle,
    transform: isSwapped ? 'translateY(-100%)' : 'translateY(0)',
    backgroundColor: '#FFFFFF',
    zIndex: 1,
    transition: transition('transform 0.8s ease'),
    willChange: isAnimating ? 'transform' : 'auto',
  };

  const contentCardStyle: React.CSSProperties = {
    ...cardBaseStyle,
    backgroundColor: '#2A2F35',
    display: 'grid',
    gridTemplateColumns: isSmallScreen
      ? '100%'
      : isMarqueeCollapsed
        ? '40px 1fr'
        : '30% 70%',
    overflow: 'hidden',
    zIndex: 1,
    paddingTop: isExpanded ? 'var(--nav-h, 64px)' : '0',
    transform: isSwapped ? 'translateY(0)' : 'translateY(100%)',
    transition: transition(
      'transform 0.8s ease, grid-template-columns 0.4s ease',
    ),
    willChange:
      isAnimating || isMarqueeResizing
        ? 'transform, grid-template-columns'
        : 'auto',
  };

  const tapAreaStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '60px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'clamp(120px, 20vw, 200px)',
    height: 'clamp(60px, 10vh, 100px)',
    cursor: 'pointer',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'clamp(4px, 1vh, 8px)',
    transition: 'transform 0.2s ease',
  };

  const tapAreaTextStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(10px, 1.5vw, 14px)',
    fontWeight: 600,
    color: '#E5532C',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    textAlign: 'center',
  };

  const tapAreaDotStyle: React.CSSProperties = {
    width: 'clamp(40px, 6vw, 60px)',
    height: 'clamp(40px, 6vw, 60px)',
    borderRadius: '50%',
    border: '2px solid #E5532C',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'clamp(18px, 3vw, 24px)',
    color: '#E5532C',
    fontWeight: 700,
  };

  const imageStyle: React.CSSProperties = {
    objectFit: 'cover',
    objectPosition: 'center',
    filter: 'grayscale(100%) brightness(0.7) contrast(1.2)',
    zIndex: 0,
  };

  const headlineStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: 700,
    color: '#E5532C',
    margin: '0',
    padding: 'clamp(16px, 3vh, 32px)',
    letterSpacing: '-0.02em',
    lineHeight: '1.2',
    position: 'relative',
    zIndex: 1,
  };

  return (
    <>
      {/* Container */}
      <div style={containerStyle}>
        {/* Navigation */}
        <nav ref={navRef} style={navStyle}>
          <div style={brandStyle}>BLOG</div>
          <div style={navRightStyle}>
            <AnimatedButton
              variant="underline"
              reverse
              onClick={triggerCardSwap}
              style={backButtonTextStyle}
            >
              <span
                style={{
                  fontSize: 'clamp(20px, 3vw, 28px)',
                  display: 'inline-flex',
                }}
              >
                <ArrowUp size="1em" strokeWidth={2.5} />
              </span>
              {!isSmallScreen && ' BACK'}
            </AnimatedButton>
            <AnimatedButton
              variant="underline"
              reverse
              onClick={() => setIsNavOpen(true)}
              style={menuLinkStyle}
            >
              <span
                style={{
                  fontSize: 'clamp(22px, 3vw, 28px)',
                  transform: 'translateY(-3px)',
                  display: 'inline-block',
                }}
              >
                ☰
              </span>
              {isSmallScreen ? '' : ' MENU'}
            </AnimatedButton>
          </div>
        </nav>

        {/* Main Content */}
        <main style={mainStyle}>
          {/* 3D Card Container */}
          <div style={cardContainerStyle}>
            {/* Hero Card (Front) */}
            <div style={heroCardStyle}>
              {/* Monochrome Background Image */}
              {heroImageUrl && (
                <Image
                  src={heroImageUrl}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1375px) 80vw, 1100px"
                  style={imageStyle}
                  placeholder={heroBlurDataURL ? 'blur' : 'empty'}
                  blurDataURL={heroBlurDataURL ?? undefined}
                />
              )}

              {/* Headline */}
              <h1 style={headlineStyle}>SHARING & LOGGING</h1>

              {/* Tap Area */}
              <div
                style={tapAreaStyle}
                onClick={triggerCardSwap}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    'translateX(-50%) scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(-50%) scale(1)';
                }}
              >
                <span style={tapAreaDotStyle}>
                  <ArrowDown size="1em" strokeWidth={2.5} />
                </span>
                <span style={tapAreaTextStyle}>Tap to explore</span>
              </div>
            </div>

            {/* Content Card (Back) */}
            <div style={contentCardStyle}>
              {/* Left Marquee */}
              {!isSmallScreen && (
                <FunnyMarqueeWrapper
                  isCollapsed={isMarqueeCollapsed}
                  isResizing={isMarqueeResizing}
                  onToggleCollapse={toggleMarquee}
                />
              )}

              {/* Right Content */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  height: '100%',
                  borderLeft: isSmallScreen
                    ? 'none'
                    : '1px solid rgba(255, 255, 255, 0.2)',
                  position: 'relative',
                  padding: isExpanded ? '0' : 'clamp(16px, 3vh, 32px)',
                  gap: isExpanded ? '0' : 'clamp(16px, 3vh, 32px)',
                  contain: 'layout paint',
                }}
              >
                {/* RECENT BLOGS Section */}
                <RecentBlogsGrid
                  isExpanded={isExpanded}
                  isSmallScreen={isSmallScreen}
                />

                {/* FEATURED SERIES & 3D ANIMATION Sections */}
                <BlogExpandedContent
                  isSmallScreen={isSmallScreen}
                  isResizing={isMarqueeResizing || isAnimating}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Full-Screen Navigation */}
      <FullScreenNav isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
    </>
  );
}
