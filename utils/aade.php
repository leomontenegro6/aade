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
	
}