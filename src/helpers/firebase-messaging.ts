import * as admin from 'firebase-admin';
import { ViluxIconURL } from 'src/assets/constants';
import { MultipleNotificationDto } from 'src/dto/request/notification.dto';

export const sendNotificationToMultipleTokens = async ({
  tokens,
  title,
  body,
  data,
}: MultipleNotificationDto) => {
  const message = {
    notification: {
      title,
      body,
      icon: ViluxIconURL,
    },
    data: data || {},
    tokens,
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log('Successfully sent messages:', response);
    return {
      success: true,
      message: `Successfully sent ${response.successCount} messages; ${response.failureCount} failed.`,
    };
  } catch (error) {
    console.log('Error sending messages:', error);
    return { success: false, message: 'Failed to send notifications' };
  }
};

export const tokenToArrayString = (tokens: { token: string }[]) => {
  return tokens.map((e) => e.token);
};
