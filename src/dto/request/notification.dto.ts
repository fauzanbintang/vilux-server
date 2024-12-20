export class NotificationDto {
  title: string;
  body: string;
  token: string;
  icon?: string;
}

export class MultipleNotificationDto {
  title: string;
  body: string;
  tokens: string[];
  data?: { [key: string]: string };
  icon?: string;
}
