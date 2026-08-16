export const colors = {
  // Existing site colors
  background: '#F2E9D8',
  text: '#2A2F35',
  accent: '#E5532C',
  darkBackground: '#2A2F35',
  darkText: '#F2E9D8',
  navBackground: '#363D44',
  navButtonPanel: '#444C55',
  card: '#E4D9C2',
  border: '#D6CBB3',

  // New template colors
  contentBlockBg: '#FFFFFF',
  navText: '#666666',
} as const;

export type Color = keyof typeof colors;
