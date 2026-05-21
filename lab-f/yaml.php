<?php // I:\ptw\lab-f\yaml.php


$data = [
    'name' => 'Bartosz Pestka',
    'index' => '57885',
    'date' => date(DATE_ATOM),
];


$yaml = yaml_emit($data);


echo $yaml;

