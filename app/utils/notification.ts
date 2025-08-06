import { type NotificationData, notifications } from '@mantine/notifications';

const commonNotificationData: Omit<NotificationData, 'message' | 'title' | 'color'> = {
  autoClose: 5000,
  position: 'bottom-center',
};

export function showErrorNotification(message: string): void {
  notifications.show({
    title: 'Error',
    message,
    color: 'red',
    ...commonNotificationData,
  });
}

export function showSuccessNotification(message: string): void {
  notifications.show({
    title: 'Success',
    message,
    color: 'green',
    ...commonNotificationData,
  });
}
