<?php
class aade{
	
	public static function getSandboxBackgroundImages(){
		return array(
			'judge'=>'Juíz',
			'phoenix_objecting'=>'Veríssimo protestando',
			'miles_argumenting'=>'Spada argumentando',
			'butz_scorning'=>'Vário desdenhando',
			'alphabet_test'=>'Teste de alfabetos',
			'accent_test'=>'Teste de acentos'
		);
	}
	
	public static function getEquivalenceTable(){
		return array(
			0=>array(
				'original'=>'---',
				'adapted'=>'---'
			),
			512=>array(
				'original'=>'Phoenix',
				'adapted'=>'Roberto'
			),
			768=>array(
				'original'=>'Police',
				'adapted'=>'Polícia'
			),
			1024=>array(
				'original'=>'Maya',
				'adapted'=>'Alice'
			),
			1536=>array(
				'original'=>'Alarm Clock',
				'adapted'=>'Alarme'
			),
			1792=>array(
				'original'=>'Mia',
				'adapted'=>'Amélia'
			),
			2048=>array(
				'original'=>'Judge',
				'adapted'=>'Juíz'
			),
			2304=>array(
				'original'=>'Edgeworth',
				'adapted'=>'Spada'
			),
			2560=>array(
				'original'=>'Payne',
				'adapted'=>'Errantes'
			),
			2816=>array(
				'original'=>'Interphone',
				'adapted'=>'Interfone'
			),
			3072=>array(
				'original'=>'Grossberg',
				'adapted'=>'Beaumont'
			),
			3328=>array(
				'original'=>'Cellphone',
				'adapted'=>'Celular'
			),
			4096=>array(
				'original'=>'Penny',
				'adapted'=>'Sionadora'
			),
			4352=>array(
				'original'=>'Oldbag',
				'adapted'=>'Savelha'
			),
			4608=>array(
				'original'=>'Manella',
				'adapted'=>'Nella'
			),
			4864=>array(
				'original'=>'TV',
				'adapted'=>'TV'
			),
			5120=>array(
				'original'=>'Gumshoe',
				'adapted'=>'Gaspar'
			),
			5376=>array(
				'original'=>'White',
				'adapted'=>'Alvino'
			),
			5632=>array(
				'original'=>'April',
				'adapted'=>'Abril'
			),
			5888=>array(
				'original'=>'Bellboy',
				'adapted'=>'Camareiro'
			),
			6144=>array(
				'original'=>'Vasquez',
				'adapted'=>'Valquez'
			),
			6400=>array(
				'original'=>'Butz',
				'adapted'=>'Vário'
			),
			6656=>array(
				'original'=>'Sahwit',
				'adapted'=>'Vitudo'
			),
			6912=>array(
				'original'=>'Will',
				'adapted'=>'Vidal'
			),
			7168=>array(
				'original'=>'Cody',
				'adapted'=>'Caio'
			),
			7936=>array(
				'original'=>'Lotta',
				'adapted'=>'Sheila'
			),
			8192=>array(
				'original'=>'Yogi',
				'adapted'=>'Iogue'
			),
			8448=>array(
				'original'=>'Karma',
				'adapted'=>'Karma'
			),
			8704=>array(
				'original'=>'Parrot',
				'adapted'=>'Papagaio'
			),
			8960=>array(
				'original'=>'Missile',
				'adapted'=>'Míssil'
			),
			9216=>array(
				'original'=>'Uncle',
				'adapted'=>'Tio'
			),
			9472=>array(
				'original'=>'Guard',
				'adapted'=>'Guarda'
			),
			9728=>array(
				'original'=>'Teacher',
				'adapted'=>'Professor'
			),
			9984=>array( // Possivelmente não-usado
				'original'=>'Edgeworth',
				'adapted'=>'Spada'
			),
			10240=>array( // Possivelmente não-usado
				'original'=>'Butz',
				'adapted'=>'Vário'
			),
			11008=>array(
				'original'=>'Chief',
				'adapted'=>'Chefe'
			),
			11264=>array(
				'original'=>'Ema',
				'adapted'=>'Ema'
			),
			11520=>array(
				'original'=>'Lana',
				'adapted'=>'Lana'
			),
			11776=>array(
				'original'=>'Marshall',
				'adapted'=>'Lampião'
			),
			12032=>array(
				'original'=>'Meekins',
				'adapted'=>'Mido'
			),
			12288=>array(
				'original'=>'Goodman',
				'adapted'=>'Bonfim'
			),
			12544=>array(
				'original'=>'Gant',
				'adapted'=>'Gentili'
			),
			12800=>array(
				'original'=>'Angel',
				'adapted'=>'Ângela'
			),
			13056=>array(
				'original'=>'Guard',
				'adapted'=>'Guarda'
			),
			13312=>array(
				'original'=>'Officer',
				'adapted'=>'Oficial'
			),
			13568=>array(
				'original'=>'Patrolman',
				'adapted'=>'Patrulheiro'
			)
		);
	}
	
	public static function startsWith($haystack, $needle){
		$length = strlen($needle);
		return (substr($haystack, 0, $length) === $needle);
	}

	public static function endsWith($haystack, $needle){
		$length = strlen($needle);
		if ($length == 0) {
			return true;
		}

		return (substr($haystack, -$length) === $needle);
	}
	
}