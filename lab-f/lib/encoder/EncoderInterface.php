<?php
namespace App\encoder;
interface EncoderInterface {
    public function supports(string $format): bool; // sprawdza czy format jest obsługiwany przez enkoder
    public function decode(string $data, string $format): array; // konwertuje tekst na tablicę
    public function encode(array $data, string $format): string; // konwertuje tablicę na tekst
}