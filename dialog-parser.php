<?php
$name = $_FILES['script-file']['name'];
$path = $_FILES['script-file']['tmp_name'];
$extension = explode('.', $name);
$extension = strtolower(end($extension));

if($extension != 'txt'){
	die('Formato inválido.');
}
if(!file_exists($path)){
	die('Erro ao carregar arquivo transferido para o servidor.');
}

$file = file($path);

// Separating strings in sections
$number = -1;
$sections = $sections_blocks = array();
foreach($file as $line){
	$checkDialogueChanged = preg_match('/\{\{[0-9]+\}\}/', $line);
	if($checkDialogueChanged){
		$expression = preg_match('/\{\{[0-9]+\}\}/', $line, $results);
		$number = str_replace(array('{', '}'), '', $results[0]);
		$number = (int)$number;
	}
	
	if($number > -1){
		$line = str_replace('{{' . $number . '}}', '', $line);
		
		if(!isset($sections[$number])){
			$sections[$number] = $line;
		} else {
			$sections[$number] .= $line;
		}
	}
}

$tag = false;
$tag_text = '';
$i = 0;

// Iterating into sections to separate them into blocks
foreach($sections as $number=>$section){
	$chars_section = str_split($section);
	
	// Iterating current section, char by char
	foreach($chars_section as $char){
		if($char == '{'){
			$tag = true;
		} elseif($char == '}'){
			$tag = false;
		}
		
		if(!isset($sections_blocks[$number])){
			$sections_blocks[$number] = array();
		}
		if(!isset($sections_blocks[$number][$i])){
			$sections_blocks[$number][$i] = $char;
		} else {
			$sections_blocks[$number][$i] .= $char;
		}
		
		if($tag){
			if($char != '{'){
				$tag_text .= $char;
			}
		} else {
			$checkBreakDetected = in_array($tag_text, array('p', 'nextpage_button', 'nextpage_nobutton'));
			if($checkBreakDetected){
				$i++;
			}
			$tag_text = '';
		}
	}
}
?>
<table id="dialog-parser-table" class="table table-striped table-bordered" cellspacing="0" width="100%">
	<thead>
		<tr>
			<th>Seção</th>
			<th>Número</th>
			<th>Bloco</th>
			<th>Prévia</th>
		</tr>
	</thead>
	<tbody>
		<?php
		$total_dialog_blocks = 0;
		$total_sections = 0;
		foreach($sections_blocks as $section=>$blocks){
			$total_sections++;
			foreach($blocks as $block){
				$total_dialog_blocks++;

				$dialogId = "s{$section}-b{$total_dialog_blocks}-dialog";
				?>
				<tr>
					<td>{{<?php echo $section ?>}}</td>
					<td><?php echo $total_dialog_blocks ?></td>
					<td><textarea class="form-control text-field" name="dialog[<?php echo $section ?>][<?php echo $total_dialog_blocks ?>]" rows="5" cols="100" onkeyup="aade.updatePreview(this, '<?php echo $dialogId ?>', 't', false)"><?php echo $block ?></textarea></td>
					<td>
						<div id="<?php echo $dialogId ?>" class="dialog-preview text-only">
							<div class="text-window"></div>
						</div>
					</td>
				</tr>
			<?php
			}
		} ?>
	</tbody>
	<tfoot>
		<tr>
			<td colspan="4">
				Total de seções: <?php echo $total_sections ?> - Total de diálogos: <?php echo $total_dialog_blocks ?>
				<button class="btn btn-primary pull-right" title="Gerar script após as edições" type="button" onclick="aade.generateScript()">
					<span class="glyphicon glyphicon-file"></span>
					Gerar Script
				</button>
			</td>
		</tr>
	</tfoot>
</table>
<form id="dialog-parser-form" action="dialog-file-generate.php" method="post" target="_blank"></form>