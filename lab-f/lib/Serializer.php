<?php
namespace App;
use App\encoder\EncoderInterface;

class Serializer {
    private array $encoders;
    public function __construct(array $encoders) { // konstruktor zapisuje do tablicy obsługiwane formaty
        $this->encoders = $encoders;
    }
    public function convert(string $data, string $from, string $to): string {
        if ($from === $to) return $data; // jeśli to ten sam format to konwersja nie zachodzi
        $inputEncoder = $this->getEncoder($from);
        $outputEncoder = $this->getEncoder($to);
        $decodedArray = $inputEncoder->decode($data, $from); // zamiana na tablicę
        return $outputEncoder->encode($decodedArray, $to); // zamiana z powrotem na tekst w odpowiednim formacie
    }
    private function getEncoder(string $format): EncoderInterface { // szuka odpowiedniego enkodera
        foreach ($this->encoders as $encoder) {
            if ($encoder->supports($format)) { // metody supports() zwracają True jeśli ich klasa obsługuje podany format
                return $encoder;
            }
        }
        throw new \Exception("Błędny format '{$format}'"); // jeśli jakimś sposobem doszło do przekazania nieobsługiwanego formatu, to rzuca wyjątkiem
    }
}
