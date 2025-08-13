export const generateRoomId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const isValidRoomId = (roomId: string): boolean => {
  return /^[A-Z0-9]{6}$/.test(roomId);
};

export const formatRoomUrl = (roomId: string, baseUrl: string = 'https://your-app-domain.com'): string => {
  return `${baseUrl}/?roomId=${roomId}`;
};