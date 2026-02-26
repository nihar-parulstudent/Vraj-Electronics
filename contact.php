<?php
// Simple PHP handler for a contact form
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';

    // log to file or send email
    $logLine = "Name: $name | Email: $email | Message: $message" . PHP_EOL;
    file_put_contents('contact.log', $logLine, FILE_APPEND);

    // mail example (make sure mail is configured on your server)
    // $to = 'yourbusiness@example.com';
    // $subject = 'New contact form submission';
    // $body = "Name: $name\nEmail: $email\nMessage: $message";
    // $headers = "From: $email";
    // mail($to, $subject, $body, $headers);

    // redirect back with success flag
    header('Location: ' . $_SERVER['HTTP_REFERER'] . '?success=true');
    exit;
}
?>