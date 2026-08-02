export type EmailMessage = {
  to: string;
  subject: string;
  template: string;
  text: string;
  html: string;
  metadata?: Record<string, string>;
};

export interface EmailProvider {
  readonly name: "mock" | "resend";
  send(message: EmailMessage): Promise<{ providerId: string }>;
}
