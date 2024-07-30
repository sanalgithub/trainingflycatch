export abstract class NotificationService {
  abstract sendUserMail(
    from: string,
    to: string,
    subject: string,
    text: string,
  );
}
