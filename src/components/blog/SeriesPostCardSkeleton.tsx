import { FONTS, clamp } from '@/styles/blog/typography'
import { colors } from '@/styles/blog/colors'

export default function SeriesPostCardSkeleton() {
  const cardStyle: React.CSSProperties = {
    background: 'linear-gradient(to bottom, #3E454C 0%, #3A4047 100%)',
    border: 'none',
    borderRadius: '8px',
    display: 'block',
    overflow: 'hidden',
    position: 'relative',
  }

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
        .skeleton {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, #3E454C 0%, #4A535C 50%, #3E454C 100%);
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
          gap: clamp(12px, 2vh, 16px);
        }
        @media (max-width: 768px) {
          .text-wrapper {
            padding: clamp(20px, 4vh, 28px);
          }
        }
        .title {
          width: 70%;
          height: ${clamp.lg};
          position: relative;
        }
        .meta {
          width: 40%;
          height: ${clamp.sm};
          position: relative;
        }
        .excerpt {
          width: 100%;
          height: ${clamp.sm};
          position: relative;
        }
        .excerpt-2 {
          width: 80%;
          height: ${clamp.sm};
          position: relative;
        }
      `}</style>
      <div style={cardStyle}>
        <div className="card-content">
          <div className="image-wrapper">
            <div className="skeleton" />
          </div>
          <div className="text-wrapper">
            <div className="title">
              <div className="skeleton" />
            </div>
            <div className="meta">
              <div className="skeleton" />
            </div>
            <div className="excerpt">
              <div className="skeleton" />
            </div>
            <div className="excerpt-2">
              <div className="skeleton" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
