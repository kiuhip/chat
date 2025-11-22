import { resendClient, sender } from "../lib/resend.js"
import { createWelcomeEmailTemplate } from "../emails/emailTemplates.js"

export const sendWelcomeEmail = async (email, name, clientURL) => {
    const { data, error } = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: "Welcome to Messenger",
        html: createWelcomeEmailTemplate(name, clientURL)
    });
    if (error) {
        if (error.statusCode === 403 && error.name === 'validation_error') {
            console.error("Original Error:", error.message);
        } else {
            console.error("Error sending welcome email:", error);
        }
        throw new Error("Failed to send welcome email");
    }

    console.log("Welcome Email sent", data);
};