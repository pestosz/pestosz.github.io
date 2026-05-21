<?php //ciastka
require __DIR__ . '/autoload.php';

use App\encoder\CsvEncoder;
use App\encoder\JsonEncoder;
use App\encoder\YamlEncoder;
use App\Serializer;

$inputData = $_COOKIE['last_input'] ?? '';
$inputFormat = $_COOKIE['last_input_format'] ?? 'csv';
$outputFormat = $_COOKIE['last_output_format'] ?? 'json';
$outputData = '';
$cookieOptions = [
        'expires' => time() + (86400 * 30),
        'path' => '/',
        'samesite' => 'Lax'
];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputData = $_POST['input_data'] ?? '';
    $inputFormat = $_POST['input_format'] ?? 'csv';
    $outputFormat = $_POST['output_format'] ?? 'json';
    setcookie('last_input', $inputData, $cookieOptions);
    setcookie('last_input_format', $inputFormat, $cookieOptions);
    setcookie('last_output_format', $outputFormat, $cookieOptions);
    try {
        $serializer = new Serializer([
                new CsvEncoder(),
                new JsonEncoder(),
                new YamlEncoder()
        ]);
        $outputData = $serializer->convert($inputData, $inputFormat, $outputFormat);
    } catch (Exception $e) {
        $outputData = "err: " . $e->getMessage();
    }
}
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bartosz Pestka (57885) - PTW LAB F</title>
    <link rel="stylesheet" href="styles.css" type="text/css">
</head>
<body>
<form method="POST">
    <div class="container">
        <div class="box">
            <label>Input:</label>
            <select name="input_format">
                <option value="csv" <?= ($inputFormat === 'csv') ? 'selected' : '' ?>>CSV</option>
                <option value="ssv" <?= ($inputFormat === 'ssv') ? 'selected' : '' ?>>SSV</option>
                <option value="tsv" <?= ($inputFormat === 'tsv') ? 'selected' : '' ?>>TSV</option>
                <option value="json" <?= ($inputFormat === 'json') ? 'selected' : '' ?>>JSON</option>
                <option value="yml" <?= ($inputFormat === 'yml') ? 'selected' : '' ?>>YML</option>
            </select>
            <textarea name="input_data"><?= htmlspecialchars($inputData ?? '') ?></textarea>
        </div>

        <div class="box">
            <label>Output:</label>
            <select name="output_format">
                <option value="csv" <?= ($outputFormat === 'csv') ? 'selected' : '' ?>>CSV</option>
                <option value="ssv" <?= ($outputFormat === 'ssv') ? 'selected' : '' ?>>SSV</option>
                <option value="tsv" <?= ($outputFormat === 'tsv') ? 'selected' : '' ?>>TSV</option>
                <option value="json" <?= ($outputFormat === 'json') ? 'selected' : '' ?>>JSON</option>
                <option value="yml" <?= ($outputFormat === 'yml') ? 'selected' : '' ?>>YML</option>
            </select>
            <pre><?= htmlspecialchars($outputData ?? '') ?></pre>
        </div>
    </div>
    <button type="submit">Konwertuj</button>
</form>
</body>
</html>