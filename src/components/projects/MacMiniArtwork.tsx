import styles from './projects.module.css';

// Separate vector parts let the actual enclosure open with the scroll story.
export function MacMiniArtwork({ alt }: { alt: string }) {
  return (
    <div className={styles.macDrawing}>
      <svg
        className={styles.macDesktop}
        viewBox="0 0 1200 800"
        fill="none"
        role="img"
        aria-label={alt}
      >
        <defs>
          <pattern
            id="access-ink-desktop"
            width="9"
            height="9"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(32)"
          >
            <rect width="9" height="9" fill="#e4d9c2" />
            <path d="M0 0V9" stroke="#24272a" strokeWidth="2" />
          </pattern>
          <pattern
            id="access-shadow-desktop"
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(55)"
          >
            <path d="M0 0V8" stroke="#24272a" strokeWidth="2" />
          </pattern>
        </defs>

        <circle
          cx="768"
          cy="378"
          r="300"
          fill="#e5532c"
          stroke="#24272a"
          strokeWidth="7"
        />
        <circle cx="768" cy="378" r="285" stroke="#24272a" strokeWidth="2" />
        <g stroke="#24272a" strokeWidth="1.6" opacity=".55">
          <path d="M1098.0 378.0l45.0 0.0" />
          <path d="M1096.7 406.8l44.8 3.9" />
          <path d="M1093.0 435.3l44.3 7.8" />
          <path d="M1086.8 463.4l43.5 11.6" />
          <path d="M1078.1 490.9l42.3 15.4" />
          <path d="M1067.1 517.5l40.8 19.0" />
          <path d="M1053.8 543.0l39.0 22.5" />
          <path d="M1038.3 567.3l36.9 25.8" />
          <path d="M1020.8 590.1l34.5 28.9" />
          <path d="M1001.3 611.3l31.8 31.8" />
          <path d="M980.1 630.8l28.9 34.5" />
          <path d="M957.3 648.3l25.8 36.9" />
          <path d="M933.0 663.8l22.5 39.0" />
          <path d="M907.5 677.1l19.0 40.8" />
          <path d="M880.9 688.1l15.4 42.3" />
          <path d="M853.4 696.8l11.6 43.5" />
          <path d="M825.3 703.0l7.8 44.3" />
          <path d="M796.8 706.7l3.9 44.8" />
          <path d="M768.0 708.0l0.0 45.0" />
          <path d="M739.2 706.7l-3.9 44.8" />
          <path d="M710.7 703.0l-7.8 44.3" />
          <path d="M682.6 696.8l-11.6 43.5" />
          <path d="M655.1 688.1l-15.4 42.3" />
          <path d="M628.5 677.1l-19.0 40.8" />
          <path d="M603.0 663.8l-22.5 39.0" />
          <path d="M578.7 648.3l-25.8 36.9" />
          <path d="M555.9 630.8l-28.9 34.5" />
          <path d="M534.7 611.3l-31.8 31.8" />
          <path d="M515.2 590.1l-34.5 28.9" />
          <path d="M497.7 567.3l-36.9 25.8" />
          <path d="M482.2 543.0l-39.0 22.5" />
          <path d="M468.9 517.5l-40.8 19.0" />
          <path d="M457.9 490.9l-42.3 15.4" />
          <path d="M449.2 463.4l-43.5 11.6" />
          <path d="M443.0 435.3l-44.3 7.8" />
          <path d="M439.3 406.8l-44.8 3.9" />
          <path d="M438.0 378.0l-45.0 0.0" />
          <path d="M439.3 349.2l-44.8 -3.9" />
          <path d="M443.0 320.7l-44.3 -7.8" />
          <path d="M449.2 292.6l-43.5 -11.6" />
          <path d="M457.9 265.1l-42.3 -15.4" />
          <path d="M468.9 238.5l-40.8 -19.0" />
          <path d="M482.2 213.0l-39.0 -22.5" />
          <path d="M497.7 188.7l-36.9 -25.8" />
          <path d="M515.2 165.9l-34.5 -28.9" />
          <path d="M534.7 144.7l-31.8 -31.8" />
          <path d="M555.9 125.2l-28.9 -34.5" />
          <path d="M578.7 107.7l-25.8 -36.9" />
          <path d="M603.0 92.2l-22.5 -39.0" />
          <path d="M628.5 78.9l-19.0 -40.8" />
          <path d="M655.1 67.9l-15.4 -42.3" />
          <path d="M682.6 59.2l-11.6 -43.5" />
          <path d="M710.7 53.0l-7.8 -44.3" />
          <path d="M739.2 49.3l-3.9 -44.8" />
          <path d="M768.0 48.0l-0.0 -45.0" />
          <path d="M796.8 49.3l3.9 -44.8" />
          <path d="M825.3 53.0l7.8 -44.3" />
          <path d="M853.4 59.2l11.6 -43.5" />
          <path d="M880.9 67.9l15.4 -42.3" />
          <path d="M907.5 78.9l19.0 -40.8" />
          <path d="M933.0 92.2l22.5 -39.0" />
          <path d="M957.3 107.7l25.8 -36.9" />
          <path d="M980.1 125.2l28.9 -34.5" />
          <path d="M1001.3 144.7l31.8 -31.8" />
          <path d="M1020.8 165.9l34.5 -28.9" />
          <path d="M1038.3 188.7l36.9 -25.8" />
          <path d="M1053.8 213.0l39.0 -22.5" />
          <path d="M1067.1 238.5l40.8 -19.0" />
          <path d="M1078.1 265.1l42.3 -15.4" />
          <path d="M1086.8 292.6l43.5 -11.6" />
          <path d="M1093.0 320.7l44.3 -7.8" />
          <path d="M1096.7 349.2l44.8 -3.9" />
        </g>
        <g transform="translate(34 -2)">
          <MacMiniDevice />
        </g>
        <g
          transform="translate(72 112)"
          stroke="#24272a"
          strokeWidth="6"
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          <path d="M0 0h205v158H0Z" fill="#f2e9d8" />
          <path d="M75 67V45a28 28 0 0 1 56 0v22" strokeWidth="8" />
          <rect
            x="61"
            y="67"
            width="84"
            height="62"
            rx="8"
            fill="url(#access-ink-desktop)"
          />
          <circle cx="103" cy="92" r="7" fill="#24272a" />
          <path d="M103 99v14" strokeWidth="5" />
        </g>
        <g
          transform="translate(193 328)"
          stroke="#24272a"
          strokeWidth="6"
          strokeLinejoin="round"
        >
          <rect width="108" height="178" rx="17" fill="#f2e9d8" />
          <path d="M9 26h90v121H9Z" fill="#e4d9c2" strokeWidth="2" />
          <path d="M36 12h36m-30 150h24" strokeWidth="3" />
          <path d="m33 78 16 15 30-36" stroke="#b73e1d" strokeWidth="7" />
        </g>
        <path
          d="M285 213c190-61 102 273 326 176"
          stroke="#24272a"
          strokeWidth="6"
          strokeDasharray="12 12"
        />
      </svg>
      <svg
        className={styles.macMobile}
        viewBox="0 0 600 900"
        fill="none"
        role="img"
        aria-label={alt}
      >
        <defs>
          <pattern
            id="access-ink-mobile"
            width="9"
            height="9"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(32)"
          >
            <rect width="9" height="9" fill="#e4d9c2" />
            <path d="M0 0V9" stroke="#24272a" strokeWidth="2" />
          </pattern>
          <pattern
            id="access-shadow-mobile"
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(55)"
          >
            <path d="M0 0V8" stroke="#24272a" strokeWidth="2" />
          </pattern>
        </defs>

        <circle
          cx="320"
          cy="305"
          r="240"
          fill="#e5532c"
          stroke="#24272a"
          strokeWidth="7"
        />
        <circle cx="320" cy="305" r="225" stroke="#24272a" strokeWidth="2" />
        <g stroke="#24272a" strokeWidth="1.6" opacity=".55">
          <path d="M590.0 305.0l45.0 0.0" />
          <path d="M589.0 328.5l44.8 3.9" />
          <path d="M585.9 351.9l44.3 7.8" />
          <path d="M580.8 374.9l43.5 11.6" />
          <path d="M573.7 397.3l42.3 15.4" />
          <path d="M564.7 419.1l40.8 19.0" />
          <path d="M553.8 440.0l39.0 22.5" />
          <path d="M541.2 459.9l36.9 25.8" />
          <path d="M526.8 478.6l34.5 28.9" />
          <path d="M510.9 495.9l31.8 31.8" />
          <path d="M493.6 511.8l28.9 34.5" />
          <path d="M474.9 526.2l25.8 36.9" />
          <path d="M455.0 538.8l22.5 39.0" />
          <path d="M434.1 549.7l19.0 40.8" />
          <path d="M412.3 558.7l15.4 42.3" />
          <path d="M389.9 565.8l11.6 43.5" />
          <path d="M366.9 570.9l7.8 44.3" />
          <path d="M343.5 574.0l3.9 44.8" />
          <path d="M320.0 575.0l0.0 45.0" />
          <path d="M296.5 574.0l-3.9 44.8" />
          <path d="M273.1 570.9l-7.8 44.3" />
          <path d="M250.1 565.8l-11.6 43.5" />
          <path d="M227.7 558.7l-15.4 42.3" />
          <path d="M205.9 549.7l-19.0 40.8" />
          <path d="M185.0 538.8l-22.5 39.0" />
          <path d="M165.1 526.2l-25.8 36.9" />
          <path d="M146.4 511.8l-28.9 34.5" />
          <path d="M129.1 495.9l-31.8 31.8" />
          <path d="M113.2 478.6l-34.5 28.9" />
          <path d="M98.8 459.9l-36.9 25.8" />
          <path d="M86.2 440.0l-39.0 22.5" />
          <path d="M75.3 419.1l-40.8 19.0" />
          <path d="M66.3 397.3l-42.3 15.4" />
          <path d="M59.2 374.9l-43.5 11.6" />
          <path d="M54.1 351.9l-44.3 7.8" />
          <path d="M51.0 328.5l-44.8 3.9" />
          <path d="M50.0 305.0l-45.0 0.0" />
          <path d="M51.0 281.5l-44.8 -3.9" />
          <path d="M54.1 258.1l-44.3 -7.8" />
          <path d="M59.2 235.1l-43.5 -11.6" />
          <path d="M66.3 212.7l-42.3 -15.4" />
          <path d="M75.3 190.9l-40.8 -19.0" />
          <path d="M86.2 170.0l-39.0 -22.5" />
          <path d="M98.8 150.1l-36.9 -25.8" />
          <path d="M113.2 131.4l-34.5 -28.9" />
          <path d="M129.1 114.1l-31.8 -31.8" />
          <path d="M146.4 98.2l-28.9 -34.5" />
          <path d="M165.1 83.8l-25.8 -36.9" />
          <path d="M185.0 71.2l-22.5 -39.0" />
          <path d="M205.9 60.3l-19.0 -40.8" />
          <path d="M227.7 51.3l-15.4 -42.3" />
          <path d="M250.1 44.2l-11.6 -43.5" />
          <path d="M273.1 39.1l-7.8 -44.3" />
          <path d="M296.5 36.0l-3.9 -44.8" />
          <path d="M320.0 35.0l-0.0 -45.0" />
          <path d="M343.5 36.0l3.9 -44.8" />
          <path d="M366.9 39.1l7.8 -44.3" />
          <path d="M389.9 44.2l11.6 -43.5" />
          <path d="M412.3 51.3l15.4 -42.3" />
          <path d="M434.1 60.3l19.0 -40.8" />
          <path d="M455.0 71.2l22.5 -39.0" />
          <path d="M474.9 83.8l25.8 -36.9" />
          <path d="M493.6 98.2l28.9 -34.5" />
          <path d="M510.9 114.1l31.8 -31.8" />
          <path d="M526.8 131.4l34.5 -28.9" />
          <path d="M541.2 150.1l36.9 -25.8" />
          <path d="M553.8 170.0l39.0 -22.5" />
          <path d="M564.7 190.9l40.8 -19.0" />
          <path d="M573.7 212.7l42.3 -15.4" />
          <path d="M580.8 235.1l43.5 -11.6" />
          <path d="M585.9 258.1l44.3 -7.8" />
          <path d="M589.0 281.5l44.8 -3.9" />
        </g>
        <g transform="translate(-304 34) scale(.85)">
          <MacMiniDevice />
        </g>
        <g
          transform="translate(42 609) scale(.9)"
          stroke="#24272a"
          strokeWidth="6"
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          <path d="M0 0h205v158H0Z" fill="#f2e9d8" />
          <path d="M75 67V45a28 28 0 0 1 56 0v22" strokeWidth="8" />
          <rect
            x="61"
            y="67"
            width="84"
            height="62"
            rx="8"
            fill="url(#access-ink-mobile)"
          />
          <circle cx="103" cy="92" r="7" fill="#24272a" />
          <path d="M103 99v14" strokeWidth="5" />
        </g>
        <g
          transform="translate(357 639) scale(.8)"
          stroke="#24272a"
          strokeWidth="6"
          strokeLinejoin="round"
        >
          <rect width="108" height="178" rx="17" fill="#f2e9d8" />
          <path d="M9 26h90v121H9Z" fill="#e4d9c2" strokeWidth="2" />
          <path d="M36 12h36m-30 150h24" strokeWidth="3" />
          <path d="m33 78 16 15 30-36" stroke="#b73e1d" strokeWidth="7" />
        </g>
        <path
          d="M236 720c25-38 63-31 107-14"
          stroke="#24272a"
          strokeWidth="6"
          strokeDasharray="12 12"
        />
      </svg>
    </div>
  );
}

// M4-family anatomy referenced against iFixit's 2024 teardown and CT scans:
// https://www.ifixit.com/News/104302/all-hail-the-return-of-upgradeable-storage-mac-mini-2024-teardown
// This is an exploded cutaway; Apple opens the physical enclosure from below.
function MacMiniDevice() {
  const plane = 'matrix(.71 .22 -.686 .414 710 266)';
  return (
    <g stroke="#24272a" strokeWidth="5" strokeLinejoin="round">
      <ellipse
        cx="748"
        cy="577"
        rx="213"
        ry="33"
        fill="#24272a"
        fillOpacity=".12"
        stroke="none"
      />
      <g data-part="chassis">
        <path
          d="M562 352Q552 347 552 360V483Q552 501 571 509L763 570Q782 576 799 566L922 489Q936 481 936 466V344L792 434Z"
          fill="#e4d9c2"
          strokeWidth="6.75"
        />
        <path
          d="M789 431 936 344V466Q936 481 922 489L799 566Q792 570 783 571V438Z"
          fill="#d4c6ac"
        />
        {Array.from({ length: 15 }, (_, i) => (
          <path
            key={i}
            d={`M${797 + i * 8} ${432 - i * 4.7}v117`}
            strokeWidth="1.3"
            opacity=".6"
          />
        ))}
        <path d="M580 510 765 567Q783 574 799 563L919 486" strokeWidth="3" />
        <path
          d="M602 522 758 571Q780 581 800 570L900 506V516L802 580Q783 592 759 581L602 533Z"
          fill="#24272a"
          stroke="none"
        />
        <path
          d="m610 446 18 6v9l-18-6Zm42 13 18 6v9l-18-6Z"
          fill="#24272a"
          strokeWidth="2"
        />
        <ellipse
          cx="706"
          cy="480"
          rx="4"
          ry="5"
          fill="#24272a"
          strokeWidth="2"
        />
        <ellipse
          cx="755"
          cy="535"
          rx="2.5"
          ry="2"
          fill="#f9faf5"
          stroke="none"
        />
        <path d="m895 431 18-11v14l-18 11Z" fill="#24272a" strokeWidth="3" />
        <path
          d="M906 431c36-17 52-6 46 23-7 36 52 39 64 8"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </g>
      <g data-part="cooling">
        <g transform={plane}>
          <rect x="12" y="12" width="276" height="186" rx="32" fill="#353a39" />
          <circle cx="150" cy="108" r="87" fill="#24272a" />
          <path
            d="M71 139a88 88 0 0 0 158 0"
            stroke="#b73e1d"
            strokeWidth="12"
          />
          {Array.from({ length: 32 }, (_, i) => (
            <path
              key={i}
              d="M150 17v20"
              transform={`rotate(${(i * 360) / 32} 150 108)`}
              stroke="#a99c7f"
              strokeWidth="2.5"
            />
          ))}
          <circle cx="150" cy="108" r="61" fill="#353a39" />
          {Array.from({ length: 18 }, (_, i) => (
            <path
              key={i}
              d="M156 91q26-25 36-9"
              transform={`rotate(${(i * 360) / 18} 150 108)`}
              stroke="#a99c7f"
              strokeWidth="2.5"
            />
          ))}
          <circle cx="150" cy="108" r="20" fill="#e4d9c2" />
          <circle cx="150" cy="108" r="6" fill="#24272a" stroke="none" />
          <path d="M64 132q-14-61 45-67h86" stroke="#24272a" strokeWidth="16" />
          {[
            [30, 30],
            [270, 30],
            [30, 178],
            [270, 178],
          ].map(([x, y]) => (
            <circle
              key={`${x}-${y}`}
              cx={x}
              cy={y}
              r="6"
              fill="#e4d9c2"
              strokeWidth="2"
            />
          ))}
        </g>
      </g>
      <g data-part="internals">
        <g transform={plane}>
          <path
            d="M20 14H278Q290 14 290 27V176Q290 194 274 194H26Q10 194 10 178V31Q10 14 20 14Z"
            fill="#353a39"
          />
          <rect x="142" y="79" width="88" height="70" rx="3" fill="#e4d9c2" />
          <rect x="160" y="93" width="53" height="42" rx="2" fill="#b73e1d" />
          <path
            d="M155 69h66m-66 91h66M132 85v59m107-59v59"
            stroke="#a99c7f"
            strokeWidth="3"
          />
          <rect x="24" y="65" width="100" height="100" rx="8" fill="#24272a" />
          <rect
            x="157"
            y="25"
            width="74"
            height="33"
            rx="3"
            fill="#24272a"
            stroke="#a99c7f"
            strokeWidth="2"
          />
          <path
            d="M168 31h24v21h-24Zm30 0h24v21h-24Z"
            fill="#e4d9c2"
            strokeWidth="2"
          />
          {Array.from({ length: 12 }, (_, i) => (
            <path
              key={i}
              d={`M${139 + i * 11} 171v12M${30 + i * 7} 38v12`}
              stroke="#a99c7f"
              strokeWidth="3"
            />
          ))}
          {[
            [24, 24],
            [275, 24],
            [24, 182],
            [275, 182],
          ].map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <circle cx={x} cy={y} r="7" fill="#e4d9c2" />
              <path d={`M${x - 3} ${y}h6`} strokeWidth="2" />
            </g>
          ))}
          <path
            d="M115 60h18v-25M244 70h21v46M124 154v16h25"
            stroke="#a99c7f"
            strokeWidth="2"
          />
          <path
            d="M45 184h37v17H45Zm72 0h40v17h-40Zm85 0h38v17h-38Z"
            fill="#e4d9c2"
            strokeWidth="3"
          />
        </g>
      </g>
      <g data-part="power">
        <g transform={plane}>
          <rect x="16" y="20" width="268" height="167" rx="20" fill="#353a39" />
          <rect x="119" y="62" width="57" height="71" rx="6" fill="#e4d9c2" />
          <path
            d="M127 73h41m-41 9h41m-41 9h41m-41 9h41m-41 9h41m-41 9h41"
            stroke="#b73e1d"
            strokeWidth="4"
          />
          <ellipse cx="62" cy="82" rx="18" ry="22" fill="#e4d9c2" />
          <ellipse cx="94" cy="120" rx="15" ry="19" fill="#e4d9c2" />
          <ellipse cx="224" cy="98" rx="24" ry="28" fill="#b73e1d" />
          <ellipse cx="224" cy="98" rx="13" ry="15" fill="#e4d9c2" />
          <path
            d="M50 82h24m-12-12v24M84 120h20M188 46h56v17h-56ZM39 147h57v18H39Z"
            fill="#24272a"
            strokeWidth="2"
          />
          <path
            d="M109 47h-23v19M187 145h53v17M145 144v18h22"
            stroke="#a99c7f"
            strokeWidth="3"
          />
          {[
            [32, 36],
            [267, 36],
            [32, 170],
            [267, 170],
          ].map(([x, y]) => (
            <circle
              key={`${x}-${y}`}
              cx={x}
              cy={y}
              r="6"
              fill="#e4d9c2"
              strokeWidth="2"
            />
          ))}
        </g>
      </g>
      <g data-part="lid">
        <path
          d="M564 337 693 263Q709 254 729 259L922 319Q950 328 929 344L801 424Q785 434 765 427L567 366Q540 357 564 337Z"
          fill="#f2e9d8"
          strokeWidth="6.75"
        />
        <path d="M564 354 767 417Q785 423 800 415L930 336" strokeWidth="2.2" />
        <g
          transform="translate(737 336) rotate(17) skewX(-24)"
          fill="#24272a"
          stroke="none"
        >
          <path d="M0-12c-8-8-20-4-20 8 0 12 9 24 15 24 3 0 5-3 9-3s6 3 9 3c5 0 10-7 13-14-10-5-12-18-2-23-6-8-16-6-24 5Z" />
          <path d="M2-15c-1-8 5-14 12-15 1 8-4 14-12 15Z" />
        </g>
      </g>
    </g>
  );
}
