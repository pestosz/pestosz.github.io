<?php
namespace App\encoder;

class CsvEncoder implements EncoderInterface {
    private array $delimiters = [ // formaty *SV i ich separatory
        'csv' => ',',
        'ssv' => ';',
        'tsv' => "\t"
    ];
    public function supports(string $format): bool { // sprawdza czy format jest obsługiwany przez enkoder
        return isset($this->delimiters[$format]);
    }
    public function decode(string $data, string $format): array { // konwertuje tekst na tablicę
        if (empty($data)) return []; // jeśli pole tekstowe było puste, to zwraca pustą tablicę
        $delimiter = $this->delimiters[$format]; // separator wybranego formatu
        $lines = explode("\n", trim($data)); // podział na linie
        $header = str_getcsv(array_shift($lines), $delimiter, '"', "\\"); // oddzielenie nagłówka i parsowanie na tablicę
        $result = [];
        foreach ($lines as $line) { // dla każdej linii
            $trimmedLine = trim($line); // usuwa spacje i nowe linie na początku i końcu
            if ($trimmedLine === '') continue; // pomija puste linie
            $row = str_getcsv($trimmedLine, $delimiter, '"', "\\"); // parsowanie linii na tablicę
            if (count($header) === count($row)) { // sprawdza poprawność wymiarów
                $result[] = array_combine($header, $row); // łączy nagłówek z linią w tablicę asocjacyjną i dodaje do tablicy wynikowej
            }
        }
        return $result;
    }
    public function encode(array $data, string $format): string { // konwertuje tablicę na tekst
        if (empty($data)) return '';
        $delimiter = $this->delimiters[$format];
        $output = '';
        $output .= implode($delimiter, array_keys($data[0])) . "\n"; // odbudowuje nagłówek
        foreach ($data as $row) {
            $output .= implode($delimiter, $row) . "\n"; // odbudowuje resztę linii
        }
        return rtrim($output); // zwraca dane w odpowiednim już formacie
    }
}