import type { RegistrationData } from './types';

// This function formats your data into a clean text message
export function formatDataForWhatsApp(
  dataType: 'Division' | 'College',
  sortedData: [string, RegistrationData[]][]
): string {
  
  let message = `*ProfSummit Registration Summary*\n\n`;
  message += `*Top ${dataType}s by Registration Count:*\n`;

  sortedData.forEach(([name, data], index) => {
    message += `${index + 1}. ${name} - *${data.length}*\n`;
  });

  message += `\n_Summary generated on ${new Date().toLocaleString()}_`;

  return message;
}

// This function takes the message, encodes it, and opens WhatsApp
export function shareToWhatsApp(text: string) {
  const encodedText = encodeURIComponent(text);
  const url = `https://wa.me/?text=${encodedText}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}