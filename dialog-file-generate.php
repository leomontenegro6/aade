<?php
$filename = $_POST['filename'];
$dialogs = $_POST['dialog'];

$new_filename = $filename . '.' . date('Ymd-His') . '.txt';

header("Content-type: text/plain");
header("Content-Disposition: attachment; filename=$new_filename");

// TODO: Order dialogues by order.
// This way, even if user change table ordering, file generation won't be affected
//$dialogs = sort_array_multidim($dialogs, 'order ASC');

foreach($dialogs as $section_number=>$blocks){
	echo '{{' . $section_number . '}}' . PHP_EOL;
	foreach($blocks as $block_number=>$block){
		echo $block;
		echo PHP_EOL;
	}
	echo PHP_EOL;
}