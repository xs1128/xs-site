import type { CSSProperties, ReactNode } from 'react';
import { Device, Layer, Stage, type Box } from './Layer';
import styles from './projects.module.css';

const INK = '#24272a';
const PAPER = '#f2e9d8';
const SAND = '#e4d9c2';
const DUNE = '#d4c6ac';
const CHARCOAL = '#353a39';
const ORANGE = '#e5532c';
const RUST = '#b73e1d';
const MUTED = '#a99c7f';
const MONO = { fontFamily: 'var(--font-roboto-mono), monospace' };
const DISPLAY = { fontFamily: 'var(--font-hubot-sans), sans-serif' };
const DESKTOP: Box = [0, 0, 1200, 800];
const MOBILE: Box = [0, 0, 600, 900];

// Each layer is drawn flat on a 360 x 240 page, then laid into the same
// isometric plane. `corner` mirrors the matrix for the slab edges.
const PLANE = [0.78, 0.24, -0.74, 0.44, 724, 262] as const;
const plane = `matrix(${PLANE.join(' ')})`;
// Labels hang off the page's far-right corner.
const TAG_Y = PLANE[5] + PLANE[1] * 360;
const corner = (x: number, y: number, drop = 0) =>
  `${(PLANE[4] + PLANE[0] * x + PLANE[2] * y).toFixed(1)} ${(PLANE[5] + PLANE[1] * x + PLANE[3] * y + drop).toFixed(1)}`;

// The page as a web page is built: each layer sits a little lower at rest
// and lifts apart with the scroll (see the site-* keyframes).
export function SiteArtwork({ alt }: { alt: string }) {
  return (
    <div className={styles.macDrawing}>
      <Stage
        view={DESKTOP}
        className={styles.macDesktop}
        label={alt}
        back={
          <>
            <Sun cx={768} cy={378} r={300} />
            <SiteShadow />
          </>
        }
        front={
          <>
            <AdminCard transform="translate(72 112)" />
            <Envelope transform="translate(990 615) scale(.8)" />
            <path
              d="M285 200c150-40 110 236 296 214"
              stroke={INK}
              strokeWidth="6"
              strokeDasharray="12 12"
            />
          </>
        }
      >
        <Device view={DESKTOP}>
          <SitePage id="site-desktop" tags />
        </Device>
      </Stage>
      <Stage
        view={MOBILE}
        className={styles.macMobile}
        label={alt}
        back={
          <>
            <Sun cx={320} cy={305} r={240} />
            <g transform="translate(-339 26) scale(.85)">
              <SiteShadow />
            </g>
          </>
        }
        front={
          <>
            <AdminCard transform="translate(42 640) scale(.9)" />
            <Envelope transform="translate(380 670) scale(.85)" />
            <path
              d="M236 740c25-38 63-31 140-10"
              stroke={INK}
              strokeWidth="6"
              strokeDasharray="12 12"
            />
          </>
        }
      >
        <Device view={MOBILE} offset={[-339, 26]} scale={0.85}>
          <SitePage id="site-mobile" />
        </Device>
      </Stage>
    </div>
  );
}

function Sun({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const inner = r + 30;
  return (
    <>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={ORANGE}
        stroke={INK}
        strokeWidth="7"
      />
      <circle cx={cx} cy={cy} r={r - 15} stroke={INK} strokeWidth="2" />
      <g stroke={INK} strokeWidth="1.6" opacity=".55">
        {Array.from({ length: 72 }, (_, index) => {
          const angle = (index * Math.PI) / 36;
          const [x, y] = [Math.cos(angle), Math.sin(angle)];
          return (
            <path
              key={index}
              d={`M${(cx + x * inner).toFixed(1)} ${(cy + y * inner).toFixed(1)}l${(x * 45).toFixed(1)} ${(y * 45).toFixed(1)}`}
            />
          );
        })}
      </g>
    </>
  );
}

function Sheet({
  part,
  rest,
  depth,
  face,
  edge,
  tag,
  over,
  children,
}: {
  part: string;
  rest: number;
  depth: number;
  face: string;
  edge: string;
  tag?: string;
  over?: (box: Box) => ReactNode;
  children: ReactNode;
}) {
  const [bl, br, tr] = [corner(0, 240), corner(360, 240), corner(360, 0)];
  const left = PLANE[4] + PLANE[2] * 240;
  const right = PLANE[4] + PLANE[0] * 360;
  const tagWidth = tag ? tag.length * 11 + 26 : 0;
  const box: Box = [
    left,
    PLANE[5] + rest,
    (tag ? 1031 + tagWidth : right) - left,
    PLANE[1] * 360 + PLANE[3] * 240 + depth,
  ];
  return (
    <Layer
      data-part={part}
      box={box}
      over={
        <>
          {over?.(box)}
          {tag && (
            <Layer
              className={styles.siteTag}
              box={[right, TAG_Y + rest - 17, 1031 + tagWidth - right, 34]}
              within={box}
            >
              <g
                stroke={INK}
                strokeLinejoin="round"
                transform={`translate(0 ${rest})`}
              >
                <path d={`M${tr}h26`} strokeWidth="3" />
                <rect
                  x="1031"
                  y={TAG_Y - 17}
                  width={tagWidth}
                  height="34"
                  fill={PAPER}
                  strokeWidth="3"
                />
                <text
                  x="1044"
                  y={TAG_Y + 7}
                  fill={INK}
                  stroke="none"
                  fontSize="21"
                  style={DISPLAY}
                >
                  {tag}
                </text>
              </g>
            </Layer>
          )}
        </>
      }
    >
      <g
        stroke={INK}
        strokeWidth="5"
        strokeLinejoin="round"
        transform={`translate(0 ${rest})`}
      >
        <path
          d={`M${bl} L${br} L${tr} L${corner(360, 0, depth)} L${corner(360, 240, depth)} L${corner(0, 240, depth)}Z`}
          fill={edge}
        />
        <g transform={plane}>
          <rect width="360" height="240" rx="12" fill={face} />
          {children}
        </g>
      </g>
    </Layer>
  );
}

function SiteShadow() {
  return (
    <ellipse
      cx="770"
      cy="532"
      rx="250"
      ry="36"
      fill={INK}
      fillOpacity=".12"
      stroke="none"
    />
  );
}

function SitePage({ id, tags = false }: { id: string; tags?: boolean }) {
  return (
    <>
      {/* Engine: what the whole site runs on. */}
      <Sheet
        part="engine"
        rest={40}
        depth={26}
        face={SAND}
        edge={DUNE}
        tag={tags ? 'Engine' : undefined}
      >
        <g strokeWidth="4">
          <circle cx="80" cy="120" r="36" fill={INK} />
          <text
            x="80"
            y="134"
            textAnchor="middle"
            fontSize="40"
            fontWeight="700"
            fill={PAPER}
            stroke="none"
            style={DISPLAY}
          >
            N
          </text>
          <path d="M186 78 150 128h30l-8 44 40-58h-31Z" fill={RUST} />
          <path d="M282 88 320 154H244Z" fill={INK} />
        </g>
        {Array.from({ length: 9 }, (_, index) => (
          <path
            key={index}
            d={`M${40 + index * 34} 210v14`}
            stroke={MUTED}
            strokeWidth="3"
          />
        ))}
      </Sheet>

      {/* Blog: Markdown, code, the reading bar, and the terminal cube. */}
      <Sheet
        part="blog"
        rest={30}
        depth={8}
        face={PAPER}
        edge={DUNE}
        tag={tags ? 'Blog' : undefined}
      >
        <rect y="2" width="150" height="6" fill={ORANGE} stroke="none" />
        <text
          x="24"
          y="50"
          fontSize="24"
          fontWeight="700"
          fill={INK}
          stroke="none"
          style={DISPLAY}
        >
          <tspan fill={RUST}>#</tspan> Notes
        </text>
        <path
          d="M24 70h170M24 84h150M24 98h162"
          stroke={MUTED}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <rect
          x="24"
          y="112"
          width="180"
          height="70"
          rx="6"
          fill={INK}
          strokeWidth="3"
        />
        <path
          d="M40 132h48M40 168h30"
          stroke={ORANGE}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M96 132h40M52 150h84"
          stroke={SAND}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <rect
          x="24"
          y="196"
          width="48"
          height="18"
          rx="9"
          fill={SAND}
          strokeWidth="2"
        />
        <rect
          x="80"
          y="196"
          width="62"
          height="18"
          rx="9"
          fill={SAND}
          strokeWidth="2"
        />
        <g strokeWidth="3">
          <path d="M282 70 326 92 282 114 238 92Z" fill={ORANGE} />
          <path d="M238 92 282 114V164L238 142Z" fill={CHARCOAL} />
          <path d="M326 92 282 114V164L326 142Z" fill={INK} />
        </g>
        <text
          x="246"
          y="134"
          fontSize="10"
          fill={PAPER}
          stroke="none"
          style={MONO}
        >
          POSTS
        </text>
      </Sheet>

      {/* Contact: the spinning ring of my name around a plus. */}
      <Sheet
        part="contact"
        rest={20}
        depth={8}
        face={SAND}
        edge={DUNE}
        tag={tags ? 'Contact' : undefined}
        over={(box) => <Ring id={`${id}-ring`} rest={20} within={box} />}
      >
        <path d="M170 106h20M180 96v20" strokeWidth="4" />
        <text
          x="180"
          y="214"
          textAnchor="middle"
          fontSize="14"
          fill={INK}
          stroke="none"
          style={MONO}
        >
          hi@xsooi.com
        </text>
      </Sheet>

      {/* About: three numbered pillars on charcoal. */}
      <Sheet
        part="about"
        rest={10}
        depth={8}
        face={CHARCOAL}
        edge={INK}
        tag={tags ? 'About' : undefined}
      >
        <path
          d="M120 30v180M240 30v180"
          stroke={PAPER}
          strokeOpacity=".25"
          strokeWidth="1.5"
        />
        {[22, 142, 262].map((x, index) => (
          <g key={x} stroke="none">
            <text
              x={x}
              y="72"
              fontSize="36"
              fontWeight="500"
              fill={PAPER}
              fillOpacity=".22"
              style={MONO}
            >
              0{index + 1}
            </text>
            <rect
              x={x}
              y="140"
              width="70"
              height="7"
              rx="3.5"
              fill={PAPER}
              fillOpacity=".85"
            />
            <rect
              x={x}
              y="158"
              width="84"
              height="5"
              rx="2.5"
              fill={PAPER}
              fillOpacity=".35"
            />
            <rect
              x={x}
              y="170"
              width="60"
              height="5"
              rx="2.5"
              fill={PAPER}
              fillOpacity=".35"
            />
          </g>
        ))}
        <g stroke={PAPER} strokeWidth="2.5">
          <circle cx="36" cy="112" r="12" />
          <ellipse cx="36" cy="112" rx="5" ry="12" />
          <path d="M24 112h24" />
          <rect x="144" y="100" width="28" height="10" rx="3" />
          <rect x="144" y="114" width="28" height="10" rx="3" />
          <path d="M264 104l8 8-8 8M276 122h12" strokeLinecap="round" />
        </g>
      </Sheet>

      {/* Front page: the browser, my name, and the section links. */}
      <Sheet
        part="landing"
        rest={0}
        depth={8}
        face={PAPER}
        edge={DUNE}
        tag={tags ? 'Front page' : undefined}
      >
        <path d="M0 30h360" strokeWidth="3" />
        <circle cx="18" cy="15" r="5" fill={ORANGE} strokeWidth="2" />
        <circle cx="34" cy="15" r="5" fill={SAND} strokeWidth="2" />
        <circle cx="50" cy="15" r="5" fill={SAND} strokeWidth="2" />
        <rect
          x="112"
          y="6"
          width="136"
          height="18"
          rx="9"
          fill={SAND}
          strokeWidth="2"
        />
        <text
          x="180"
          y="19"
          textAnchor="middle"
          fontSize="11"
          fill={INK}
          stroke="none"
          style={MONO}
        >
          xsooi.com
        </text>
        <g
          fontSize="50"
          fontWeight="700"
          letterSpacing="-2"
          stroke="none"
          style={MONO}
        >
          <text x="43" y="109" fill={DUNE}>
            Xinsheng
          </text>
          <text x="43" y="157" fill={DUNE}>
            Ooi
          </text>
          <text x="40" y="106" fill={INK}>
            Xinsheng
          </text>
          <text x="40" y="154" fill={INK}>
            Ooi
          </text>
        </g>
        <path
          d="M40 176h190"
          stroke={MUTED}
          strokeWidth="5"
          strokeLinecap="round"
        />
        <g fontSize="11" fill={INK} stroke="none" style={MONO}>
          <text x="24" y="226">
            ABOUT
          </text>
          <text x="336" y="226" textAnchor="end">
            CONTACT
          </text>
        </g>
      </Sheet>
    </>
  );
}

// The ring turns within the page's plane. Its layer is laid out flat, then
// skewed into the plane: `--plane` moves the ring's centre to where the
// matrix puts it, so it can still spin about its own middle.
const RING: Box = [101, 27, 158, 158];
function Ring({ id, rest, within }: { id: string; rest: number; within: Box }) {
  const [x, y, w, h] = RING;
  const [cx, cy] = [x + w / 2, y + h / 2];
  const shift = [
    PLANE[0] * cx + PLANE[2] * cy - cx,
    PLANE[1] * cx + PLANE[3] * cy - cy,
  ];
  return (
    <Layer
      className={styles.siteRing}
      box={[PLANE[4] + x, PLANE[5] + rest + y, w, h]}
      within={within}
      style={
        {
          '--plane': `translate(${(shift[0] / w) * 100}%, ${(shift[1] / h) * 100}%) matrix(${PLANE.slice(0, 4).join(', ')}, 0, 0)`,
        } as CSSProperties
      }
    >
      <g transform={`translate(${PLANE[4]} ${PLANE[5] + rest})`}>
        <defs>
          <path
            id={id}
            d="M180 106m-64 0a64 64 0 1 1 128 0a64 64 0 1 1-128 0"
          />
        </defs>
        <text
          fontSize="13"
          fill={INK}
          stroke="none"
          letterSpacing="2"
          style={MONO}
        >
          <textPath href={`#${id}`} textLength="396" lengthAdjust="spacing">
            XINSHENG OOI • XINSHENG OOI • XINSHENG OOI •
          </textPath>
        </text>
      </g>
    </Layer>
  );
}

// The admin app where posts are written before they reach the blog.
function AdminCard({ transform }: { transform: string }) {
  return (
    <g
      transform={transform}
      stroke={INK}
      strokeWidth="6"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <path d="M0 0h205v158H0Z" fill={PAPER} />
      <path d="M0 34h205" strokeWidth="4" />
      <text x="16" y="24" fontSize="16" fill={INK} stroke="none" style={MONO}>
        admin
      </text>
      <path d="M22 62h120M22 84h96M22 106h110" stroke={MUTED} strokeWidth="5" />
      <g transform="translate(118 112) rotate(-38)">
        <rect
          x="0"
          y="-9"
          width="78"
          height="18"
          fill={ORANGE}
          strokeWidth="4"
        />
        <rect
          x="-16"
          y="-9"
          width="16"
          height="18"
          fill={SAND}
          strokeWidth="4"
        />
        <path d="M78-9 102 0 78 9Z" fill={PAPER} strokeWidth="4" />
        <path d="M94-3 102 0 94 3Z" fill={INK} stroke="none" />
      </g>
    </g>
  );
}

// The contact form's mail, on its way out.
function Envelope({ transform }: { transform: string }) {
  return (
    <g
      transform={transform}
      stroke={INK}
      strokeWidth="6"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <path d="M-56 30h36M-70 52h44M-50 74h28" strokeWidth="4" />
      <rect width="150" height="104" rx="6" fill={PAPER} />
      <path d="M4 6 75 62 146 6" fill={SAND} />
      <circle cx="122" cy="80" r="13" fill={RUST} strokeWidth="4" />
    </g>
  );
}
