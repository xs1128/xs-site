import { recentPosts } from "@/lib/mockPosts";

export default function RecentLogs() {
  const containerStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    minHeight: 0,
  };

  const headerStyle: React.CSSProperties = {
    fontFamily: "'Hubot Sans', sans-serif",
    fontSize: "clamp(12px, 1.8vw, 18px)",
    fontWeight: 700,
    color: "#FFFFFF",
    padding: "clamp(8px, 1.5vh, 16px)",
    margin: "0",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderTop: "1px solid rgba(255, 255, 255, 0.2)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
    flexShrink: 0,
  };

  const listContainerStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "clamp(8px, 1.5vh, 16px)",
    padding: "clamp(8px, 1.5vh, 16px)",
    overflowY: "auto",
    overflowX: "hidden",
    minHeight: 0,
  };

  const emptyStyle: React.CSSProperties = {
    fontFamily: "'Hubot Sans', sans-serif",
    fontSize: "clamp(10px, 1.3vw, 14px)",
    fontWeight: 400,
    color: "#666666",
    textAlign: "center",
    padding: "clamp(20px, 3vh, 40px)",
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Recent</h2>
      <div style={listContainerStyle}>
        <p style={emptyStyle}>No recent posts yet</p>
      </div>
    </div>
  );
}
