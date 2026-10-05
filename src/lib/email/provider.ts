export interface EmailPayload {
  to: string;
  from?: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailProvider {
  send(
    payload: EmailPayload,
  ): Promise<{ success: boolean; messageId?: string; error?: string }>;
}

export class StandardEmailProvider implements EmailProvider {
  private apiKey?: string;
  private defaultFrom: string;

  constructor() {
    this.apiKey = process.env.EMAIL_API_KEY;
    this.defaultFrom = process.env.EMAIL_FROM?.trim() || "";
  }

  async send(
    payload: EmailPayload,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const from = payload.from || this.defaultFrom;

    if (!from && (!this.apiKey || this.apiKey.trim() === "")) {
      console.warn(
        "[Email] No SMTP sender address is configured. Skipping outbound email delivery.",
      );
      return { success: false, error: "No sender address configured." };
    }

    if (!this.apiKey || this.apiKey.trim() === "") {
      // Safe development logger
      console.log(`[Email Simulation]
  To: ${payload.to}
  From: ${from}
  Subject: ${payload.subject}
  Content: ${payload.text || payload.html.slice(0, 150)}...
      `);
      return { success: true, messageId: `sim-${Date.now()}` };
    }

    try {
      // If Resend / SendGrid / Generic API key is configured, post to provider
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: payload.to,
          subject: payload.subject,
          html: payload.html,
          text: payload.text,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, messageId: data.id };
      } else {
        const errText = await response.text();
        console.warn("[Email] Provider responded with error:", errText);
        return { success: false, error: errText };
      }
    } catch (err: any) {
      console.error("[Email] Failed to dispatch email:", err.message);
      return { success: false, error: err.message };
    }
  }
}
