# Mahin Ahmad Emon — Portfolio

A responsive portfolio inspired by the structure and interaction style of the supplied reference site, customized to Mahin Ahmad Emon's CV.

## Stack
- HTML5
- CSS3
- Vanilla JavaScript
- PHP (optional PHP-hosted version/contact handler)

## Netlify deployment
Netlify does **not** execute PHP files at runtime. The root `index.html` is therefore the production entry point and the contact form is configured with Netlify Forms.

1. Push this folder to a GitHub repository (recommended), or drag the folder into Netlify Drop.
2. Set publish directory to `.` if Netlify asks.
3. Deploy.
4. After the first deploy, submit the contact form once and check **Forms** in the Netlify dashboard.

## PHP version
The `php-version/` folder contains:
- `index.php` — PHP-rendered version of the portfolio.
- `contact.php` — validated PHP contact handler.

Run it on XAMPP/WAMP/MAMP or deploy it to a host that supports runtime PHP. The PHP `mail()` function also requires mail transport to be configured by the host; SMTP via PHPMailer is a stronger production choice.

## Before publishing
- Add a professional profile photo if desired.
- Replace generic GitHub project links with direct repository links when available.
- Add LinkedIn when available.
- Consider exporting the CV as PDF and replacing the DOCX download for recruiter convenience.
- If you use the PHP mail handler, replace the placeholder `From` domain with a domain you control.
