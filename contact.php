<?php
/**
 * Secure contact form handler using native PHP mail()
 * Accepts POST: name, email, message (and optional phone, country, purpose)
 * Sends to multiple recipients
 * Basic sanitization and validation
 * Proper headers: From, Reply-To, MIME-Version, Content-Type (HTML)
 * Returns JSON responses
 */

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(['ok' => false, 'error' => 'Method Not Allowed']);
    exit;
}

// Recipients
$recipients = [
    'kbresearch23@gmail.com',
    'mdzukas2020@gmail.com'
];

// Sender (use an address on your domain for deliverability)
$fromName    = 'MD-Zukas Travels';
$fromAddress = '10eduaso7@gmail.com';

// Gather POST data (support multiple naming conventions)
$name    = $_POST['from_name']        ?? $_POST['name']          ?? '';
$email   = $_POST['from_email']       ?? $_POST['email']         ?? '';
$message = $_POST['message']          ?? '';
$phone   = $_POST['phone_number']     ?? $_POST['phone']         ?? '';
$country = $_POST['intended_country'] ?? $_POST['country']       ?? '';
$purpose = $_POST['travel_purpose']   ?? $_POST['purpose']       ?? '';

// Basic sanitization
$stripHeader = static function (string $v): string {
    return preg_replace('/[\r\n]+/', ' ', $v);
};

$name    = $stripHeader(trim(strip_tags($name)));
$email   = $stripHeader(trim($email));
$phone   = $stripHeader(trim(strip_tags($phone)));
$country = $stripHeader(trim(strip_tags($country)));
$purpose = $stripHeader(trim(strip_tags($purpose)));
$message = trim($message);

// Validate required fields
if ($name === '' || $email === '' || $message === '') {
    http_response_code(400);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(['ok' => false, 'error' => 'Missing required fields (name, email, message)']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(['ok' => false, 'error' => 'Invalid email address']);
    exit;
}

if (strlen($message) < 2 || strlen($message) > 5000) {
    http_response_code(422);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(['ok' => false, 'error' => 'Message length is out of bounds']);
    exit;
}

// Compose subject and HTML body
$subject = 'New Application from ' . $name;

$bodyHtml = '<!doctype html>' .
'<html lang="en">' .
'<head><meta charset="UTF-8"></head>' .
'<body style="font-family:Arial, sans-serif; color:#333;">' .
'  <h2 style="margin:0 0 10px;">New Application Details</h2>' .
'  <p><strong>Name:</strong> ' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . '</p>' .
'  <p><strong>Email:</strong> ' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '</p>' .
  ($phone   !== '' ? '<p><strong>Phone:</strong> '   . htmlspecialchars($phone,   ENT_QUOTES, 'UTF-8') . '</p>' : '') .
  ($country !== '' ? '<p><strong>Country:</strong> ' . htmlspecialchars($country, ENT_QUOTES, 'UTF-8') . '</p>' : '') .
  ($purpose !== '' ? '<p><strong>Purpose:</strong> ' . htmlspecialchars($purpose, ENT_QUOTES, 'UTF-8') . '</p>' : '') .
'  <p><strong>Message:</strong></p>' .
'  <div style="white-space:pre-wrap; line-height:1.5;">' . nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8')) . '</div>' .
'  <hr style="margin:20px 0; border:0; border-top:1px solid #ddd;">' .
'  <p style="font-size:12px; color:#666;">This email was sent from the MD-Zukas Travels contact form.</p>' .
'</body></html>';

// Headers
$headers = [
    'From: ' . sprintf('%s <%s>', $fromName, $fromAddress),
    'Reply-To: ' . sprintf('%s <%s>', $name, $email),
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
];

$to = implode(', ', $recipients);
$sent = @mail($to, $subject, $bodyHtml, implode("\r\n", $headers));

header('Content-Type: application/json; charset=UTF-8');
if ($sent) {
    http_response_code(200);
    echo json_encode(['ok' => true, 'message' => 'Email sent']);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Failed to send email']);
}

