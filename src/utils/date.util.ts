export function formatChatLastMessage(date: string): string {
  const receivedDate = new Date(date);
  const actualDate = new Date();

  if (
    receivedDate.getUTCDate() === actualDate.getUTCDate() &&
    receivedDate.getUTCMonth() === actualDate.getUTCMonth() &&
    receivedDate.getUTCFullYear() === actualDate.getUTCFullYear()
  ) {
    const hour = receivedDate.getUTCHours().toString().padStart(2, '0');
    const minute = receivedDate.getUTCMinutes().toString().padStart(2, '0');
    return `${hour}:${minute}`;
  } else {
    const day = receivedDate.getUTCDate().toString().padStart(2, '0');
    const month = (receivedDate.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = receivedDate.getUTCFullYear().toString();

    return `${day}/${month}/${year}`;
  }
}
