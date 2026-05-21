<?php
namespace App\encoder;

class YamlEncoder implements EncoderInterface {
    public function supports(string $format): bool { // sprawdza czy format jest obsługiwany przez enkoder
        return $format === 'yml' || $format === 'yaml';
    }
    public function decode(string $data, string $format): array { // konwertuje tekst na tablicę
        return yaml_parse($data) ?? [];
    }
    public function encode(array $data, string $format): string { // konwertuje tablicę na tekst
        return yaml_emit($data);
    }
}