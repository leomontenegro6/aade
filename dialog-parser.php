<?php
$arquivo = file('scripts/1.txt');

// Separando script em seções
$numero = -1;
$secoes = $secoes_blocos = array();
foreach($arquivo as $linha){
	$checkMudouDialogo = preg_match('/\{\{[0-9]+\}\}/', $linha);
	if($checkMudouDialogo){
		$expressao = preg_match('/\{\{[0-9]+\}\}/', $linha, $resultados);
		$numero = str_replace(array('{', '}'), '', $resultados[0]);
		$numero = (int)$numero;
	}
	
	if($numero > -1){
		$linha = str_replace('{{' . $numero . '}}', '', $linha);
		
		if(!isset($secoes[$numero])){
			$secoes[$numero] = $linha;
		} else {
			$secoes[$numero] .= $linha;
		}
	}
}

$tag = false;
$texto_tag = '';
$i = 0;

// Percorrendo seções, de modo a separá-los em blocos
foreach($secoes as $numero=>$secao){
	$array_secao = str_split($secao);
	
	// Percorrendo seção atual, caractere a caractere
	foreach($array_secao as $caractere){
		if($caractere == '{'){
			$tag = true;
		} elseif($caractere == '}'){
			$tag = false;
		}
		
		if(!isset($secoes_blocos[$numero])){
			$secoes_blocos[$numero] = array();
		}
		if(!isset($secoes_blocos[$numero][$i])){
			$secoes_blocos[$numero][$i] = $caractere;
		} else {
			$secoes_blocos[$numero][$i] .= $caractere;
		}
		
		if($tag){
			if($caractere != '{'){
				$texto_tag .= $caractere;
			}
		} else {
			$checkQuebraDetectada = in_array($texto_tag, array('p', 'nextpage_button', 'nextpage_nobutton'));
			if($checkQuebraDetectada){
				$i++;
			}
			$texto_tag = '';
		}
	}
}

foreach($secoes_blocos as $numero=>$blocos){
	?>
	<h1>{{<?php echo $numero ?>}}</h1>
	<?php
	foreach($blocos as $bloco){
		?>
		<p style='border: 1px solid #444'><?php echo $bloco ?></p>
		<?php
	}
}
