/* Javascript library containing methods related to Ace Attorney Dialogue Previewer
 * 
 */

function aadp(){
	
	// Properties
	//this.prop = 0;
	
	// Methods
	this.updatePreview = function(field, previewFieldId, textType){
		if(typeof textType == 'undefined') textType == 't';
		
		var $field = $(field);
		var $divPreview = $('#' + previewFieldId);
		
		var text = $field.val();
		
		if(textType == 'p'){
			var $divCharacterName = $divPreview.children('div.character-name');
			$divCharacterName.html(text);
		} else if(textType == 't'){
			var $divTextWindow = $divPreview.children('div.text-window');
			$divTextWindow.html('');
			
			for (var i = 0, size = text.length; i < size; i++) {
				var char = text[i];
				
				if(char == '\n'){
					$divTextWindow.append('<br />');
				} else {
					if(char == ' ') char = 'space';
						
					$divTextWindow.append(
						$('<span />').addClass('letter ' + char).html('&nbsp;')
					);
				}
			}
		}
	}
	
	this.setDefaultValuesSandboxField = function(character, text){
		var $characterField = $('#sandbox-character-field');
		var $textField = $('#sandbox-text-field');
		
		$characterField.val(character).trigger('keyup');
		$textField.val(text).trigger('keyup');
	}
	
	this.renderImageOnBrowser = function(characterFieldId, textFieldId, previewFieldId, callback){
		var $characterField = $('#' + characterFieldId);
		var $textField = $('#' + textFieldId);
		var $previewField = $('#' + previewFieldId);
		
		var filename = ( $characterField.val() + '-' + $textField.val() ).replace(/\n/g, ' ');
		
		html2canvas($previewField, {
			onrendered: function(canvas) {
				var a = document.createElement('a');
				a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
				a.download = filename + '.png';
				var $a = $(a);
				$('body').append($a);
				a.click();
				$a.remove();
				
				if(callback) callback();
			}
		});
	}
}

// Instantiating objct for class above
var aadp = new aadp();
