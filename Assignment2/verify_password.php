<?php
// Verify if the password hash matches "Alice123"

// The hash from users.sql
$hash = '$2y$10$vgF7eA10P89eT7daEEnbOuZT7I5N5f5m0C0fiILgZz3nEQzDAu1h2';

// Test password
$password = 'Alice123';

echo "Testing password: '$password'\n";
echo "Hash: $hash\n\n";

if (password_verify($password, $hash)) {
    echo "✓ SUCCESS: Password '$password' MATCHES the hash!\n";
} else {
    echo "✗ FAILED: Password '$password' does NOT match the hash!\n";
    echo "\nThe hash was created with a different password.\n";
}

// Also test some other common passwords
echo "\n--- Testing other common passwords ---\n";
$testPasswords = ['password', 'Password123', 'admin', 'Admin123', 'alice', 'Alice', '12345678'];

foreach ($testPasswords as $testPwd) {
    if (password_verify($testPwd, $hash)) {
        echo "✓ Found match: '$testPwd'\n";
        break;
    }
}
?>

