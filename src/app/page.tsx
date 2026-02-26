const marqueeContent = `UNDER CONSTRUCTION\u00A0\u00A0\u00A0\u00A0-\u00A0\u00A0\u00A0\u00A0`.repeat(12).trim();

export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: "2rem",
        padding: "1rem",
      }}
    >
      <div className="marquee-container">
        <div className="marquee-track">
          <span className="marquee-text">
            {marqueeContent} - {marqueeContent}
          </span>
        </div>
      </div>
      <img
        src="/smoking_elizabeth.jpg"
        alt="Under Construction"
        style={{
          maxWidth: "100%",
          maxHeight: "70vh",
          objectFit: "contain",
          borderRadius: "0.5rem",
        }}
      />
    </main>
  );
}
