<?php
namespace App\encoder;

class JsonEncoder implements EncoderInterface {
    public function supports(string $format): bool { // sprawdza czy format jest obsługiwany przez enkoder
        return $format === 'json';
    }
    public function decode(string $data, string $format): array { // konwertuje tekst na tablicę
        return json_decode($data, true) ?? [];
    }
    public function encode(array $data, string $format): string { // konwertuje tablicę na tekst
        return json_encode($data, JSON_PRETTY_PRINT);
    }
}