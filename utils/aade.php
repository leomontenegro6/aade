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
			1792=>array(
				'original'=>'Mia',
				'adapted'=>'Amélia'
			),
			6400=>array(
				'original'=>'Butz',
				'adapted'=>'Vário'
			),
			2048=>array(
				'original'=>'Judge',
				'adapted'=>'Juíz'
			),
			2560=>array(
				'original'=>'Payne',
				'adapted'=>'Errantes'
			),
			6656=>array(
				'original'=>'Sahwit',
				'adapted'=>'Vitudo'
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