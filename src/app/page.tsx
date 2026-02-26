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
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: 300,
          color: "#3b82f6",
          textAlign: "center",
        }}
      >
        Under Construction
      </h1>
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
