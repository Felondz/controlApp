<?php

return [
    'btn_home' => 'Back to Home',
    '500' => [
        'title' => 'Server Error',
        'message' => 'Oops! Something went wrong.',
        'description' => 'Our servers are having a momentary issue. We have been notified and are working to fix it. Please try again in a few minutes.'
    ],
    '404' => [
        'title' => 'Page Not Found',
        'message' => 'Page not found',
        'description' => 'Sorry, the page you are looking for does not exist, has been moved, or the link is incorrect. Please check the URL or go back to home.'
    ],
    '403' => [
        'title' => 'Access Denied',
        'message' => 'Restricted Access',
        'description' => 'Sorry, you do not have sufficient permissions to access this page. Contact the administrator if you believe this is an error.'
    ],
    '503' => [
        'title' => 'System Update',
        'message' => 'Implementing Improvements',
        'description' => 'We are working on important updates to improve your experience. We will be back online shortly. You can try going back to home or wait for the system to restore.',
        'auto_refresh' => 'Checking status automatically...'
    ],
];
