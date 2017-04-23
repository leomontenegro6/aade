<?php
$dialogs = $_POST['dialog'];

echo '<pre>';
foreach($dialogs as $section_number=>$blocks){
	echo '{{' . $section_number . '}}' . PHP_EOL;
	foreach($blocks as $block_number=>$block){
		echo $block;
	}
}
echo '</pre>';