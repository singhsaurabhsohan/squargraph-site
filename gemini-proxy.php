<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') exit;

$body = file_get_contents('php://input');
$decoded = json_decode($body, true);
$prompt = $decoded['prompt'] ?? '';

$apiKey = 'AQ.Ab8RN6KtfToDZEg_T-DuaP3Q64b6vP_yZXzb5uv9cLws5I2Zaw';
$url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' . $apiKey;

$payload = json_encode([
  'contents' => [['parts' => [['text' => $prompt]]]],
  'generationConfig' => ['temperature' => 0.4, 'maxOutputTokens' => 1200]
]);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
$text = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';
echo json_encode(['text' => $text]);
