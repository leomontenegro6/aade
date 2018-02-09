<?php
class aade{
	
	public static function getSandboxBackgroundImages(){
		return array(
			'judge'=>'Juiz',
			'phoenix_objecting'=>'Veríssimo protestando',
			'miles_argumenting'=>'Spada argumentando',
			'butz_scorning'=>'Vário desdenhando',
			'alphabet_test'=>'Teste de alfabetos',
			'accent_test'=>'Teste de acentos'
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
	
	public static function checkAlphanumeric($text) {
		$convert = array(
			// Acentos maiúsculos
			"À" => "A", "Á" => "A", "Ã" => "A", "Â" => "A",
			"Ç" => "C", "É" => "E", "Ê" => "E", "Í" => "I",
			"Ï" => "I", "Ó" => "O", "Ô" => "O", "Õ" => "O",
			"Ú" => "U", "Ü" => "U", "Ñ" => "N",
			// Acentos minúsculos
			"à" => "a", "á" => "a", "ã" => "a", "â" => "a",
			"ç" => "c", "é" => "e", "ê" => "e", "í" => "i",
			"ï" => "i", "ó" => "o", "ô" => "o", "õ" => "o",
			"ú" => "u", "ü" => "u", "ñ" => "n"
		);
		return ctype_alnum(strtr($text, $convert));
	}
	
	public static function getTextWithoutTags($text){
		$text = preg_replace('/{(.*?)}/', '', $text);
		$text = preg_replace('/\n/', ' ', $text);
		return trim($text);
	}

}