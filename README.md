# MD-Zukas Travels Website

A clean, modern, and fully responsive website for MD-Zukas Travels, specializing in study and work abroad opportunities.

## Features

- **Responsive Design**: Mobile-first layout that works on all devices.
- **Modern UI**: Clean typography, smooth animations, and a professional color palette.
- **Image Carousel**: Custom-built slider for featured destinations.
- **Contact Form**: Functional integration with EmailJS for direct email inquiries.

## Setup Instructions

To get the website fully functional, especially the contact form, follow these steps:

### 1. EmailJS Configuration

This website uses [EmailJS](https://www.emailjs.com/) to send emails directly from the frontend without a backend server.

1.  **Create an Account**: Sign up for a free account at EmailJS.
2.  **Add Email Service**:
    *   Go to the "Email Services" tab.
    *   Add a new service (e.g., Gmail).
    *   Connect your account.
    *   Copy the **Service ID** (e.g., `service_xxxxx`).
3.  **Create Email Template**:
    *   Go to the "Email Templates" tab.
    *   Create a new template.
    *   Use the following variable names in your template design:
        *   `{{to_email}}` (set this to `10eduaso7@gmail.com` or use the "To Email" field in settings)
        *   `{{from_name}}`
        *   `{{from_email}}`
        *   `{{phone_number}}`
        *   `{{intended_country}}`
        *   `{{travel_purpose}}`
        *   `{{message}}`
    *   Save and copy the **Template ID** (e.g., `template_xxxxx`).
4.  **Get Public Key**:
    *   Go to the "Account" page.
    *   Copy your **Public Key** (e.g., `user_xxxxx`).

### 2. Update Code

Open the project files and update the placeholders with your credentials:

**In `index.html` (Line ~18):**
```javascript
emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your Public Key
```

**In `script.js` (Line ~155-158):**
```javascript
const isConfigured = true; // Set this to true
emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams) // Replace with your Service ID and Template ID
```

## Deployment

You can deploy this website for free using static hosting services like Netlify, Vercel, or GitHub Pages.

### Netlify (Recommended)
1.  Drag and drop the project folder onto the Netlify dashboard.
2.  Your site will be live instantly.

### Vercel
1.  Install Vercel CLI: `npm i -g vercel`
2.  Run `vercel` in the project directory.

## Project Structure

- `index.html`: Main HTML structure.
- `style.css`: All styles and responsive design rules.
- `script.js`: Logic for the slider, mobile menu, and form handling.
