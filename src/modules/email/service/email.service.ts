export class EmailService {
 
  async sendEmail(emailData: {
    to: string;
    subject: string;
    body: string;
  }): Promise<void> {
    try {
      console.log(
        `Sending email to ${emailData.to} with subject "${emailData.subject}"`
      );
      console.log(`Email body: ${emailData.body}`);
    } catch (error: any) {
      console.error("Error sending email:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}
