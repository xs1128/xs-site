import Link from 'next/link';
import type { SeriesPost } from '@/types/post';
import { FONTS, clamp, spacing } from '@/styles/blog/typography';
import { colors } from '@/styles/blog/colors';
import { TRANSITIONS } from '@/styles/blog/animations';
import { useState, useEffect } from 'react';

interface SeriesPostCardProps {
  post: SeriesPost;
}

export default function SeriesPostCard({ post }: SeriesPostCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const hasImage = Boolean(post.featured_image);

  useEffect(() => {
    if (hasImage) {
      const img = new Image();
      img.src = post.featured_image!;
      img.onload = () => setImageLoaded(true);
    }
  }, [hasImage, post.featured_image]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const cardStyle: React.CSSProperties = {
    background: 'linear-gradient(to bottom, #3E454C 0%, #3A4047 100%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    transition: 'transform 0.3s ease, border-color 0.3s ease',
    display: 'block',
    overflow: 'hidden',
    position: 'relative',
  };

  return (
    <>
      <style jsx>{`
        .card-content {
          display: flex;
          flex-direction: row;
          min-height: 180px;
        }
        @media (max-width: 768px) {
          .card-content {
            flex-direction: column;
            min-height: auto;
          }
        }
        .image-wrapper {
          position: relative;
          flex-shrink: 0;
          width: clamp(180px, 25vw, 280px);
          align-self: stretch;
        }
        @media (max-width: 768px) {
          .image-wrapper {
            width: 100%;
            height: clamp(160px, 20vw, 220px);
            align-self: auto;
          }
        }
        .image {
          position: absolute;
          inset: 0;
          background-image: ${post.featured_image ? `url(${post.featured_image})` : 'none'};
          background-size: cover;
          background-position: center;
          background-color: #ffffff;
        }
        .skeleton {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            #3e454c 0%,
            #4a535c 50%,
            #3e454c 100%
          );
          background-size: 200% 100%;
          animation: blogShimmer 1.5s ease-in-out infinite;
        }
        @keyframes blogShimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        .text-wrapper {
          flex: 1;
          padding: clamp(24px, 5vh, 32px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-width: 0;
        }
        @media (max-width: 768px) {
          .text-wrapper {
            padding: clamp(20px, 4vh, 28px);
          }
        }
        .title {
          font-family: ${FONTS.primary};
          font-size: ${clamp.lg};
          font-weight: 700;
          color: ${colors.darkText};
          margin-bottom: clamp(12px, 2vh, 16px);
        }
        .meta {
          display: flex;
          gap: ${spacing.sm};
          align-items: center;
          font-family: ${FONTS.primary};
          font-size: ${clamp.sm};
          color: #cccccc;
          margin-bottom: clamp(12px, 2vh, 16px);
        }
        .excerpt {
          font-family: ${FONTS.primary};
          font-size: ${clamp.sm};
          color: #cccccc;
          line-height: 1.6;
        }
      `}</style>
      <Link
        href={`/blog/posts/${post.slug}`}
        style={{ textDecoration: 'none', display: 'block' }}
      >
        <div
          style={cardStyle}
          onMouseEnter={(e) => {
            const card = e.currentTarget;
            card.style.transform = 'translateY(-2px)';
            card.style.borderColor = colors.accent;
          }}
          onMouseLeave={(e) => {
            const card = e.currentTarget;
            card.style.transform = 'translateY(0)';
            card.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          <div className="card-content">
            {hasImage && (
              <div className="image-wrapper">
                <div className="image" />
                {!imageLoaded && <div className="skeleton" />}
              </div>
            )}
            <div className="text-wrapper">
              <h2 className="title">{post.title}</h2>
              <div className="meta">
                <span>{formatDate(post.date)}</span>
                {post.read_time && (
                  <>
                    <span>•</span>
                    <span>{post.read_time} min read</span>
                  </>
                )}
              </div>
              {post.summary && <p className="excerpt">{post.summary}</p>}
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}
