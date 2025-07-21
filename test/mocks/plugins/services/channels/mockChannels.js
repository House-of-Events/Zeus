// Mock channels data - centralized for reuse across tests
const mockChannels = [
  {
    id: 1,
    name: "ESPN",
    description: "Sports channel",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Fox Sports",
    description: "Another sports channel",
    is_active: false,
    created_at: "2024-01-02T00:00:00Z",
  },
  {
    id: 3,
    name: "NBC Sports",
    description: "NBC sports network",
    is_active: true,
    created_at: "2024-01-03T00:00:00Z",
  },
];

export default mockChannels;
