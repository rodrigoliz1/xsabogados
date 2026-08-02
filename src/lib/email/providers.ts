import { Resend } from "resend";

import type { EmailMessage, EmailProvider } from "@/lib/email/types";

export class MockEmailProvider implements EmailProvider {
  readonly name = "mock" as const;

  async send() {
    return { providerId: `mock-${crypto.randomUUID()}` };
  }
}

export class ResendEmailProvider implements EmailProvider {
  readonly name = "resend" as const;
  private readonly resend: Resend;

  constructor(
    apiKey: string,
    private readonly from: string,
  ) {
    this.resend = new Resend(apiKey);
  }

  async send(message: EmailMessage) {
    const result = await this.resend.emails.send({
      from: this.from,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
      headers: message.metadata,
    });
    if (result.error || !result.data?.id) {
      throw new Error(result.error?.message || "Resend no confirmó el envío.");
    }
    return { providerId: result.data.id };
  }
}
