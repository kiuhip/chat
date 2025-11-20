export function createWelcomeEmailTemplate(name, clientURL) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Chatify</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f3f4f6; color: #1f2937;">
      
      <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
        
        <div style="text-align: center; padding: 40px 0 20px 0;">
          <img src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png" alt="Chat Icon" style="width: 64px; height: 64px; margin-bottom: 10px;">
        </div>
  
        <div style="padding: 0 40px 40px 40px; text-align: center;">
          <h1 style="margin: 0 0 10px 0; font-size: 26px; font-weight: 700; color: #111827;">Welcome to the Community!</h1>
          <p style="margin: 0 0 25px 0; font-size: 16px; color: #6b7280; line-height: 1.6;">
            Hi <strong>${name}</strong>, thank you for joining us! <br>
            You are now ready to connect with friends, create lively groups, and share moments in real-time.
          </p>
  
          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; text-align: left; margin-bottom: 30px;">
            <p style="margin: 0 0 10px 0; font-weight: 600; color: #374151;">Here is what you can do:</p>
            <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 15px; line-height: 1.8;">
              <li> <strong>Instant Messaging:</strong> Chat 1-1 with zero latency.</li>
              <li> <strong>Group Chats:</strong> Create rooms for your team or friends.</li>
              <li> <strong>Secure:</strong> Your conversations are private.</li>
            </ul>
          </div>
  
          <a href="${clientURL}" style="display: inline-block; background-color: #4F46E5; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; padding: 14px 32px; border-radius: 8px; transition: background-color 0.3s ease;">
            Start Chatting Now
          </a>
          
          <p style="margin-top: 30px; font-size: 14px; color: #9ca3af;">
            Button not working? Copy this link to your browser:<br>
            <a href="${clientURL}" style="color: #4F46E5; text-decoration: none; word-break: break-all;">${clientURL}</a>
          </p>
        </div>
  
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; font-size: 12px; color: #9ca3af;">
            © 2025 Chat App System. All rights reserved.<br>
            You received this email because you signed up on our platform.
          </p>
        </div>
  
      </div>
    </body>
    </html>
    `;
  }