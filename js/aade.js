/* Javascript library containing methods related to Ace Attorney Dialogue Editor
 * 
 */

function aade(){
	
	// Properties
	this.destinationTool = 'dhh';
	this.lastName = '???';
	this.lastColor = '';
	this.equivalenceTable = {};
	this.dialogParserTableTextareas = {};
	this.processingProgressbars = {
		'default': $(),
		'analysisScripts': $(),
		'analysisScriptsPages': $()
	};
	this.saveFormat = 'ansi';
	this.automaticPageChange = false;
	this.openedFiles = [];
	this.originOfOpenedFiles = '';
	this.configs = {};
	this.defaultConfigs = {
		'game': 'aa1',
		'nameType': 'o',
		'platform': '3ds',
		'invalidateLargeLines': true,
		'theme': 'light',
		'highlightingColors': {
			'light': {
				'tags': 'lightsalmon',
				'originalNames': 'lightgreen',
				'adaptedNames': 'khaki',
				'lineBreak': 'aquamarine',
				'endSection': '#aaa',
				'wait': 'lightblue'
			},
			'dark': {
				'tags': '#005F85',
				'originalNames': '#6F116F',
				'adaptedNames': '#0F1973',
				'lineBreak': '#80002B',
				'endSection': '#555',
				'wait': '#522719'
			}
		}
	};
	
	// Methods
	this.loadMainAppRoutines = function(){
		var that = this;
		
		that.loadModalWindows(function(){
			that.showLoadingIndicator();
			that.loadConfigs();
			that.loadTheme();
			that.loadTabContents(function(){
				that.setDefaultOptionsInFileForm();
				that.setDefaultValuesSandboxField("Juiz", "Sua conduta durante este\njulgamento decidirá o\ndestino de seu cliente.");
				that.instantiateSelect2Fields();
				that.showTestScriptOptions();
				that.removeTitleAttributeOnElectron();
				that.showOptionScriptsFolderOnElectron();
				that.hideLoadingIndicator();
				that.focusOnFirstMainOption();
				that.calculateMainTabsConteinersHeight();
				that.instantiateOnTabClickEvents();
				that.registerMainTabsShortcutsOnElectron();
			});
		});
	}
	
	this.loadConfigs = function(){
		var game = stash.get('game');
		var nameType = stash.get('nameType');
		var platform = stash.get('platform');
		var invalidateLargeLines = stash.get('invalidateLargeLines');
		var theme = stash.get('theme');
		var highlightingColors = stash.get('highlightingColors');
		
		if(typeof game == 'undefined') game = this.defaultConfigs.game;
		if(typeof nameType == 'undefined') nameType = this.defaultConfigs.nameType;
		if(typeof platform == 'undefined') platform = this.defaultConfigs.platform;
		if(typeof invalidateLargeLines == 'undefined') invalidateLargeLines = this.defaultConfigs.invalidateLargeLines;
		if(typeof theme == 'undefined') theme = this.defaultConfigs.theme;
		if(typeof highlightingColors == 'undefined') highlightingColors = this.defaultConfigs.highlightingColors;
		
		this.configs = {
			'game': game,
			'nameType': nameType,
			'platform': platform,
			'invalidateLargeLines': invalidateLargeLines,
			'theme': theme,
			'highlightingColors': highlightingColors
		}
	}
	
	this.loadTheme = function(){
		var theme = this.configs.theme;
		$('body').addClass(theme);
	}
	
	this.changeTheme = function(element){
		var $element = $(element);
		var $body = $('body');
		var $dialogParserTables = $('table.dialog-parser-table');
		
		var previousTheme = ($body.hasClass('dark')) ? ('dark') : ('light');
		var theme;
		if($element.is('a')){
			theme = ( $element.attr('href') ).replace('#', '');
		} else {
			theme = $element.val();
		}
		
		stash.set('theme', theme);
		$body.removeClass('light dark').addClass(theme);
		
		// Update table if the dialog parser table is loaded,
		// and the selected theme is different than the previous one
		if(($dialogParserTables.length > 0) && (theme != previousTheme)){
			$dialogParserTables.each(function(){
				var tableObject = $(this).DataTable();
				tableObject.draw(false);
			});
		}
		
		// Reloading configs after saving the new theme
		this.loadConfigs();
	}
	
	this.loadModalWindows = function(callback){
		var $divMainContainer = $('#main-container');
		
		$.when(
			$.get('modal-instructions.html'),
			$.get('modal-loading.html'),
			$.get('modal-processing.html'),
			$.get('modal-analysis.html'),
			$.get('modal-analysis-processing.html'),
			$.get('modal-analysis-results.html'),
			$.get('modal-export.html'),
			$.get('modal-config.html'),
			$.get('modal-text-preview.html'),
			$.get('modal-save.html'),
			$.get('modal-goto.html')
		).done(function(r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11){
			var results = [r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11];
			for(var i in results){
				var result = results[i][0];
				
				$divMainContainer.append(result);
			}
			
			if(callback) callback();
		});
	}
	
	this.loadTabContents = function(callback){
		var $divDialogFileFormContainer = $('#dialog-file-form-container');
		var $divEquivalenceTableTab = $('#equivalence-table-tab');
		var $divSandboxTab = $('#sandbox-tab');
		
		var that = this;
		
		$divDialogFileFormContainer.load('dialog-file-form.html', function(){
			$divEquivalenceTableTab.load('equivalence-table.html', function(){
				$divSandboxTab.load('sandbox.html', function(){
					that.validateSelectedPlatformFromFileForm();
					that.loadSandboxBackgroundImageOptions();
					if(callback) callback();
				});
			});
		});
	}
	
	this.switchMainTab = function(nextTab){
		if(typeof nextTab == 'undefined') nextTab = false;
		
		var $ulMainTabs = $('#main-tabs');
		var $liActiveMainTab = $ulMainTabs.children('li.active');
		
		var $tabToSwitch;
		if(nextTab){
			$tabToSwitch = $liActiveMainTab.next();
		} else {
			$tabToSwitch = $liActiveMainTab.prev();
		}
		var $aToSwitch = $tabToSwitch.children('a');
		
		$aToSwitch.trigger('click')
	}
	
	this.triggerClickOnFirstMainTab = function(){
		var $aFirstTab = $("a[href='#dialog-parser-tab']");
		
		$aFirstTab.trigger('click');
	}
	
	this.triggerClickOnScriptTab = function(scriptTabId){
		if(typeof scriptTabId == 'undefined') scriptTabId = this.getCurrentlyActiveScriptTabId();
		
		var $ulScriptsTabs = $('#scripts-tabs');
		
		var $aScriptTab = $ulScriptsTabs.find("a[href='#" + scriptTabId + "']");
		
		$aScriptTab.trigger('click');
	}
	
	this.triggerClickOnScriptTabByNumber = function(tabNumber){
		var $ulScriptsTabs = $('#scripts-tabs');
		var $aScriptTab = $ulScriptsTabs.find("a").eq(tabNumber - 1);
		
		var scriptTabId = ( $aScriptTab.attr('href') ).replace('#', '');
		
		return this.triggerClickOnScriptTab(scriptTabId);
	}
	
	this.getCurrentlyActiveScriptTabId = function(){
		var $aActiveScriptTab = $('#scripts-tabs').children('li.active').first().children('a');
		
		return $aActiveScriptTab.attr('aria-controls');
	}
	
	this.setDefaultOptionsInFileForm = function(){
		var $selectGameField = $('#game-field');
		var $selectNameType = $('#name-type');
		var $selectPlatform = $('#platform');
		
		// Checking default options for each field
		$selectGameField.val(this.configs.game).trigger('change');
		$selectNameType.val(this.configs.nameType).trigger('change');
		$selectPlatform.val(this.configs.platform).trigger('change');
	}
	
	this.instantiateSelect2Fields = function(){
		var $selectFields = $('select.form-control').filter(':visible').not("[data-instantiated='true']");
		
		$selectFields.each(function(){
			var $select = $(this);
			
			var checkHasFilter = $select.is("[data-has-filter='true']");
			
			var parameters = [];
			if(checkHasFilter){
				parameters.minimumResultsForSearch = 1;
			} else {
				parameters.minimumResultsForSearch = Infinity;
			}
			var templateFunction = function(repo){
				var $element = $(repo.element);
				var description = $element.attr('data-description');
				if(typeof description == 'undefined') description = '';
				
				var markup;
				if(description == '' || $element.is('optgroup')){
					markup = repo.text;
				} else {
					description = description.replace('<', '&lt;');
					description = description.replace('>', '&gt;');
					
					markup = $("<span>" + repo.text + "</span>&nbsp;<small>" + description + "</small>");
				}

				return markup;
			}

			parameters.templateResult = templateFunction;
			parameters.templateSelection = templateFunction;
			
			$select.on({
				// Select2 open event
				'select2:open': function(e, a, b, c){
					// Adicionando atributo "id" ao contêiner do campo, para permitir
					// personalizações específicas adicionais
					var $dropdown = $select.data()['select2']['$dropdown'];
					
					if($select.is("[name^='DataTables_Table_']") && $select.is("[name$='_length']")){
						$dropdown.addClass('no-overflow');
					}
				},
			});
			
			$select.select2(parameters);
			
			$select.attr('data-instantiated', 'true');
		})
	}
	
	this.reinstantiateSelect2Fields = function(select){
		var $select2Fields;
		if(select){
			$select2Fields = $(select).filter("[data-instantiated='true']");
		} else {
			$select2Fields = $("select.form-control[data-instantiated='true']");
		}
		
		$select2Fields.each(function(){
			var $select = $(this);
			
			$select.select2('destroy').removeAttr('data-instantiated');
		});
		
		this.instantiateSelect2Fields();
	}
	
	this.showTestScriptOptions = function(){
		var $divTestScriptsList = $('#test-scripts-list');
		
		var testScriptsFolder = 'test_scripts/';
		
		var testScripts = [
			{
				'filename': 'AAI1 Case 1 Beginning (DiegoHH and djmatheusito).txt',
				'label': 'AAI1 Caso 1 Início (DiegoHH e djmatheusito).txt'
			},
			{
				'filename': 'AAI2 Case 1 Beginning (DiegoHH and djmatheusito).txt',
				'label': 'AAI2 Caso 1 Início (DiegoHH e djmatheusito).txt'
			},
			{
				'filename': 'AA1 Accents (DiegoHH).txt',
				'label': 'AA1 Acentos (DiegoHH).txt'
			},
			{
				'filename': 'AA1 Tags in Chevron (OPF).txt',
				'label': 'AA1 Chevron (OPF).txt'
			},
			{
				'filename': 'AA1 Tags in Chevron (OPF).txt',
				'label': 'AA1 Chaves (OPF antigo).txt'
			}
		];
		
		$.get('dialog-file-form-test-scripts.html').then(function(response){
			var template = $.templates(response);
			
			for(var i in testScripts){
				var testScript = testScripts[i];
				var filename = testScriptsFolder + testScript.filename;
				var label = testScript.label;
				
				var rowInfo = {
					'iterator': i,
					'filename': filename,
					'label': label
				}
				var $newLabel = $( template.render(rowInfo) );
				
				$divTestScriptsList.append($newLabel);
			}
		})
	}
	
	this.readScriptFilesFromInput = function(inputFileField){
		var $inputFileField = $(inputFileField);
		var $radioFileOriginInput = $('#file-origin-input');
		var $form = $inputFileField.closest('form');
		
		if($inputFileField[0].files.length > 0){
			$radioFileOriginInput.prop('checked', true);
			setTimeout(function(){
				$form.submit();
			}, 25);
		}
	}
	
	this.readTestScriptFile = function(radioTestScript){
		var $radioTestScript = $(radioTestScript);
		var $form = $radioTestScript.closest('form');
		
		setTimeout(function(){
			$form.submit();
		}, 25);
	}
	
	this.showOptionScriptsFolderOnElectron = function(){
		var that = this;
		
		if(that.checkOnElectron()){
			var $dialogFileForm = $('form.dialog-file-form');
			
			var $btnGroupMainOptions = $('#main-options');
			var $firstOption = $btnGroupMainOptions.children('label').first();
			var $optionLoadScriptsInFolder = $('<label />').addClass('btn btn-default btn-lg').attr({
				'tabindex': '0',
				'onkeyup': 'return aade.instantiateFileOriginKeyupBehaviours(this, event)'
			}).append(
				$('<input />').attr({
					'type': 'radio',
					'name': 'file-origin',
					'id': 'file-origin-load-scripts-in-folder',
					'value': 's',
					'onchange': 'aade.toggleFileOrigin(this)'
				})
			).append(
				$('<span />').addClass('glyphicon glyphicon-open-file')
			).append('<br />Carregar arquivos da pasta "scripts"');
			var $divScriptsFolderList = $('#scripts-folder-list');
			
			$firstOption.after($optionLoadScriptsInFolder).remove();
			
			// Obtaining scripts list in folder
			var scriptsListInFolder = that.getScriptsListInFolder();

			// If there's at least one script file in the folder, show all
			// files below the option
			if(scriptsListInFolder.length > 0){
				for(var j in scriptsListInFolder){
					var filename = scriptsListInFolder[j];

					// Showing each script as a checkbox, already checked
					// by default
					$divScriptsFolderList.append(
						$('<label />').addClass('btn btn-default').attr({
							'tabindex': '0',
							'onkeyup': 'return aade.setTestScriptKeyupBehaviours(this, event)'
						}).append(
							$('<input />').attr({
								'type': 'checkbox',
								'name': 'scripts-folder[]',
								'id': 'scripts-folder-' + j
							}).val(filename)
						).append(
							$('<span />').addClass('checkbox')
						).append(filename)
					);
				}
				
				// Adding "Load" button below the files' checkboxes
				$divScriptsFolderList.append(
					$('<label />').addClass('btn btn-default submit').attr({
							'tabindex': '0',
							'onkeyup': 'return aade.setTestScriptKeyupBehaviours(this, event)'
						}).append(
						$('<input />').attr({
							'type': 'checkbox',
							'id': 'scripts-folder-submit'
						}).addClass('submit')
					).append(
						$('<span />').addClass('glyphicon glyphicon-open-file')
					).append('Carregar').click(function(){
						return that.readScriptFiles($dialogFileForm[0]);
					})
				);

				// Marking that option by default
				that.focusOnFirstMainOption();
				that.toggleFileOrigin( $optionLoadScriptsInFolder.children("input[name='file-origin']") );
			}
		}
	}
	
	this.getScriptsListInFolder = function(){
		if( this.checkOnElectron() ){
			var ipc = require('electron').ipcRenderer;
			return ipc.sendSync('getScriptsListInFolder');
		}
	}
	
	this.getContentsOfScriptInFolder = function(filename, encoding){
		if( this.checkOnElectron() ){
			if((typeof encoding == 'undefined') || (encoding == 'iso-8859-1')) encoding = 'latin1';
			
			var ipc = require('electron').ipcRenderer;
			return ipc.sendSync('getContentsOfScriptInFolder', filename, encoding);
		}
	}
	
	this.writeContentsOfScriptInFolder = function(filename, contents, encoding){
		if( this.checkOnElectron() ){
			if((typeof encoding == 'undefined') || (encoding == 'iso-8859-1')) encoding = 'latin1';
			
			var ipc = require('electron').ipcRenderer;
			return ipc.sendSync('writeContentsOfScriptInFolder', filename, contents, encoding);
		}
	}
	
	this.readScriptFiles = function(dialogFileForm){
		var $radioFileOrigin = $("[name='file-origin']:checked");
		var $inputFileField = $('#file-field');
		var $checkboxesScriptsFolder = $("[name^='scripts-folder']:checked");
		var $radioTestScriptList = $("[name='test-script']:checked");
		var $selectDestinationTool = $("#destination-tool");
		
		var fileOrigin = $radioFileOrigin.val();
		var selectedTestScript = $radioTestScriptList.val();
		var destinationTool = $selectDestinationTool.val();
		var that = this;
		var encoding;
		if(destinationTool == 'dhh'){
			that.saveFormat = 'ansi';
			encoding = 'iso-8859-1';
		} else {
			that.saveFormat = 'utf-8_with_bom';
			encoding = 'utf-8';
		}
		var files = [];
		
		if(fileOrigin == 'f'){ // File input
			var uploadedFiles = [];
			$.each($inputFileField[0].files, function(){
				uploadedFiles.push(this);
			})
			
			// Reading files recursively, in order to
			var readFileFromInput = function(){
				var file = uploadedFiles.shift();
				var filename = file.name;
					
				var reader = new FileReader();
				reader.readAsText(file, encoding);
				reader.onload = function (evt) {
					var fileContents = evt.target.result;

					files.push({
						'filename': filename,
						'fileContents': fileContents
					});

					// Checking if there's at least one more file to read
					if(uploadedFiles.length > 0){
						readFileFromInput();
					} else {
						// All files readed, so proceed with the script parsing
						that.showLoadingIndicator();
						that.parseScriptFiles(files, function(){
							that.instantiatePaginationDialogParsing();
							that.registerScriptsTabsShortcutsOnElectron();
						});
					}
				}
			}
			readFileFromInput();
		} else if(fileOrigin == 's'){ // Scripts in folder (Electron.js only)
			if($checkboxesScriptsFolder.length == 0){
				that.showPopover($('#scripts-folder-list'), 'Pelo menos um script precisa ser marcado!');
				return false;
			}
			
			$checkboxesScriptsFolder.each(function(){
				var filename = this.value;
				var fileContents = that.getContentsOfScriptInFolder(filename, encoding);
				
				files.push({
					'filename': filename,
					'fileContents': fileContents
				});
			});
			
			that.showLoadingIndicator();
			that.parseScriptFiles(files, function(){
				that.instantiatePaginationDialogParsing();
				that.registerScriptsTabsShortcutsOnElectron();
			});
		} else if(fileOrigin == 't'){ // Test scripts
			var filename = selectedTestScript.split('/').pop();
			
			that.showLoadingIndicator();
			
			$.ajax({
				url: selectedTestScript,
				type: 'GET',
				contentType: 'Content-type: text/plain; charset=' + encoding,
				beforeSend: function(jqXHR) {
					jqXHR.overrideMimeType('text/html;charset=' + encoding);
				},
				success: function(fileContents){
					files.push({
						'filename': filename,
						'fileContents': fileContents
					});
					
					that.parseScriptFiles(files, function(){
						that.instantiatePaginationDialogParsing();
						that.registerScriptsTabsShortcutsOnElectron();
					});
				}
			});
		}
		
		// Saving origin of opened files in a specific property, in order to use it later
		that.originOfOpenedFiles = fileOrigin;
		
		return false;
	}
	
	this.parseScriptFiles = function(files, callback){
		var $divDialogFileFormContainer = $('#dialog-file-form-container');
		var $divDialogParsedScriptsContainer = $('#dialog-parsed-scripts-container');
		
		var that = this;
		var destinationTool = that.destinationTool;
		var game = that.game;
		
		// Loading needed html files, before parsing the scripts
		$.when(
			$.get('dialog-parsed-scripts-tabs.html'),
			$.get('dialog-parser-table.html'),
			$.get('dialog-parser-row.html')
		).done(function(dpst, dpt, dpr){
			$divDialogParsedScriptsContainer.html(dpst[0]);
			
			var $ulScriptsTabs = $('#scripts-tabs');
			var $divTabContent = $ulScriptsTabs.next();
			
			// Loading tab component for each parsed script
			for(var i in files){
				var file = files[i];
				var filename = file.filename;
				var fileContents = file.fileContents;

				var scriptTabId = 'script-tab-' + i;

				// Creating tab elements for the current file
				var $liTab = $('<li />').attr('role', 'presentation').append(
					$('<a />').attr({
						'href': '#' + scriptTabId,
						'aria-controls': scriptTabId,
						'role': 'tab',
						'data-toggle': 'tab',
						'title': filename
					}).html(filename).on('shown.bs.tab', function(){
						var $a = $(this);
						var clickedScriptTabId = $a.attr('aria-controls');
						
						// Instantiating select2 fields in each script tab
						that.instantiateSelect2Fields();
						
						// Highlighting words in textareas after clicking a script tab,
						// since it won't work properly on hidden elements.
						var $visibleTextareas = $('#' + clickedScriptTabId).find('textarea.text-field');
						that.highlightWordsTextareas($visibleTextareas, false);
					})
				).append(
					$('<span />').addClass('glyphicon glyphicon-remove remove-script').attr({
						'tabindex': '0',
						'title': 'Fechar script',
						'onclick': "aade.closeScriptFile('" + scriptTabId + "')"
					})
				);
				var $divTabpanel = $('<div />').attr({
					'id': scriptTabId,
					'role': 'tabpanel'
				}).addClass('tab-pane').html(dpt[0]);
				if(i == 0){
					$liTab.add($divTabpanel).addClass('active');
				}

				// Adding tab elements to the component
				$ulScriptsTabs.append($liTab);
				$divTabContent.append($divTabpanel);
				
				// Saving scripts info in a specific property, in order to use it later
				that.openedFiles.push({
					'scriptTabId': scriptTabId,
					'filename': filename
				});

				// Separating strings in blocks
				var number = -1;
				var sections = [];
				var lines = fileContents.split("\n");

				// Separating strings in sections
				for(var j in lines){
					var line = lines[j] + "\n";

					var regexSection;
					if(destinationTool == 'opf'){
						regexSection = line.match(/\<\<[0-9]+\>\>/g);
					} else {
						regexSection = line.match(/\{\{[0-9]+\}\}/g);
					}

					var checkDialogueChanged = (regexSection != null && regexSection.length > 0);
					if(checkDialogueChanged){
						if(destinationTool == 'opf'){
							number = regexSection[0].replace(/</g, '').replace(/>/g, '');
						} else {
							number = regexSection[0].replace(/{/g, '').replace(/}/g, '');
						}
						number = parseInt(number, 10);
					}

					if(number > -1){
						if(destinationTool == 'opf'){
							line = line.replace('<<' + number + '>>', '');
						} else {
							line = line.replace('{{' + number + '}}', '');
						}

						if(typeof sections[number] == 'undefined'){
							sections[number] = line;
						} else {
							sections[number] += line;
						}
					}
				}

				var sectionBlocks = [];
				var tag = false;
				var characterCode = '';
				var tagText = '';
				var color = '';
				var checkFirstAlphanumericChar = false;

				// Iterating into sections to separate them into blocks	
				for(var sectionNumber in sections){
					var section = sections[sectionNumber];
					var blockNumber = 1;

					for(var j = 0; j < section.length; j++){
						var char = section[j];

						if(destinationTool == 'opf'){
							if(char == '<'){
								tag = true;
							} else if(char == '>'){
								tag = false;
							}
						} else {
							if(char == '{'){
								tag = true;
							} else if(char == '}'){
								tag = false;
							}
						}

						// Detecting first alphanumeric char in a text block
						var checkCharacterAlphanumeric = /^[a-zA-Z0-9ÀÁÃÂÇÉÊÍÏÓÔÕÚÜÑàáãâçéêíïóôõúüñ().]*$/.test(char);
						if(checkFirstAlphanumericChar){
							// Suppressing all line breaks after the first alphanumeric character
							// That's done in order to have line breaks only after {b} tags
							if(char == "\n" || char == "\r"){
								char = '';
							}
						} else if(checkCharacterAlphanumeric && !tag){
							checkFirstAlphanumericChar = true;
						}

						// Creating additional variables in section_blocks array, in order to
						// mount the table with textarea fields below
						if(typeof sectionBlocks[sectionNumber] == 'undefined'){
							sectionBlocks[sectionNumber] = [];
						}
						if(typeof sectionBlocks[sectionNumber][blockNumber] == 'undefined'){
							sectionBlocks[sectionNumber][blockNumber] = [];
						}
						if(typeof sectionBlocks[sectionNumber][blockNumber]['characterCode'] == 'undefined'){
							sectionBlocks[sectionNumber][blockNumber]['characterCode'] = characterCode;
						}
						if(typeof sectionBlocks[sectionNumber][blockNumber]['text'] == 'undefined'){
							sectionBlocks[sectionNumber][blockNumber]['text'] = char;
						} else {
							sectionBlocks[sectionNumber][blockNumber]['text'] += char;
						}
						if(typeof sectionBlocks[sectionNumber][blockNumber]['color'] == 'undefined'){
							sectionBlocks[sectionNumber][blockNumber]['color'] = color;
						}
						if(typeof sectionBlocks[sectionNumber][blockNumber]['hasEndjmp'] == 'undefined'){
							sectionBlocks[sectionNumber][blockNumber]['hasEndjmp'] = false;
						}

						if(tag){
							if(destinationTool == 'opf'){
								if(char != '<'){
									tagText += $.trim( char );
								}
							} else {
								if(char != '{'){
									tagText += $.trim( char );
								}
							}
						} else {// Adding line break after {b}
							if((tagText == 'b')){
								sectionBlocks[sectionNumber][blockNumber]['text'] += "\n";
							}

							// Obtaining character code from {name} tags
							if(tagText.startsWith('name:')){
								var tmp = tagText.split(':');
								var characterCode = $.trim( tmp.pop() );
								sectionBlocks[sectionNumber][blockNumber]['characterCode'] = characterCode;
							}

							// Obtaining last color change from {color} tags
							if(tagText.startsWith('color:')){
								var tmp = tagText.split(':');
								var color = $.trim( tmp.pop() );

								sectionBlocks[sectionNumber][blockNumber]['color'] = color;
							}

							// Checking if block has {endjmp} tag
							var checkHasEndjmpTag = (tagText == 'endjmp');
							if(checkHasEndjmpTag){
								color = '';
								sectionBlocks[sectionNumber][blockNumber]['hasEndjmp'] = true;
							}

							// Checking if block has a break generated by {p}, {nextpage_button} or {nextpage_nobutton} tags
							var checkBreakDetected = ((tagText == 'p') || (tagText.startsWith('nextpage_button')) || (tagText.startsWith('nextpage_nobutton')));
							if(checkBreakDetected){
								checkFirstAlphanumericChar = false;
								blockNumber++;
								
							}

							tagText = '';
						}
					}
				}
				
				// If the game is AAI1, then delete empty blocks between each section
				// in order to avoid visual pollution
				if(game == 'aai1'){
					for(var sectionNumber in sectionBlocks){
						var section = sectionBlocks[sectionNumber];
						
						for(var blockNumber in section){
							var block = section[blockNumber];
							
							var text = $.trim( block['text'] );
							if(text == ''){
								delete sectionBlocks[sectionNumber][blockNumber];
							}
						}
					}
				}
				
				// Loading dialog parser table
				var $dialogParserTable = $divTabpanel.children('table');
				var $tbody = $dialogParserTable.children('tbody');

				$divDialogFileFormContainer.hide();
				$dialogParserTable.attr('data-filename', filename);

				// Loading dialog parser table's row template
				var template = $.templates(dpr[0]);

				var order = 1;
				var totalSections = 0;
				var totalDialogBlocks = 0;
				
				// Iterating into section blocks to create a table row for each
				for(var sectionNumber in sectionBlocks){
					totalSections++;

					// Iterating through all section blocks, in order to mount the table rows.
					var section = sectionBlocks[sectionNumber];
					for(var blockNumber in section){
						totalDialogBlocks++;

						var block = section[blockNumber];
						var text = $.trim( block['text'] );
						var characterCode = block['characterCode'];
						var color = block['color'];
						var textWithoutTags = that.getTextWithoutTags(text);
						var dialogId = scriptTabId + '-s-' + sectionNumber + '-b-' + blockNumber + '-dialog';

						var checkHasEndjmpTag = block['hasEndjmp'];

						var rowInfo = {
							'order': order,
							'section': sectionNumber,
							'blockNumber': blockNumber,
							'dialogId': dialogId,
							'characterCode': characterCode,
							'color': color,
							'textWithoutTags': textWithoutTags
						}
						var $tr = $( template.render(rowInfo) );
						var $textarea = $tr.find('textarea.text-field');

						$tbody.append($tr);
						$textarea.html(text);

						// Removing "add new block" button on some specific contexts:
						// 1. if there's an end tag inside the block
						// 2. if the game is AAI1
						if(checkHasEndjmpTag || that.configs.game == 'aai1'){
							$tr.find('button.add-new-block').remove();
						}

						order++;
					}
				}

				// Updating total counters in table footer
				$dialogParserTable.attr({
					'data-total-sections': totalSections,
					'data-total-dialog-blocks': totalDialogBlocks
				});
			}

			// Hiding loading indicator and calling callback after all files
			// area loaded
			that.hideLoadingIndicator();
			
			// Implementing jQuery UI Sortable plugin on the script tabs,
			// in order to make them draggable
			$ulScriptsTabs.sortable();
			$ulScriptsTabs.disableSelection();
			
			// Calculating scripts tabs' conteiner height, based on the user's device height
			that.calculateScriptTabsConteinerHeight();
			
			// Executing callback after all scripts are parsed
			if(callback) callback();
		});
	}
	
	this.registerMainTabsShortcutsOnElectron = function(){
		if( this.checkOnElectron() ){
			var ipc = require('electron').ipcRenderer;
			return ipc.send('registerMainTabsShortcuts');
		}
	}
	
	this.registerScriptsTabsShortcutsOnElectron = function(){
		if( this.checkOnElectron() ){
			var $ulScriptsTabs = $('#scripts-tabs');
			var $lisScriptsTabs = $ulScriptsTabs.children('li');
			
			var totalScriptTabs = $lisScriptsTabs.length;
			var ipc = require('electron').ipcRenderer;
			return ipc.send('registerScriptsTabsShortcuts', totalScriptTabs);
		}
	}
	
	this.calculateScriptTabsConteinerHeight = function(){
		var $ulScriptsTabs = $('#scripts-tabs');
		if($ulScriptsTabs.length == 0) return this.calculateMainTabsConteinersHeight();
		var $divTabContent = $ulScriptsTabs.next();
		
		var windowHeight = $(window).height();
		var scriptTabsHeight = $ulScriptsTabs.height();
		var scriptTabsOffset = $ulScriptsTabs.offset();
		var finalHeight = (windowHeight - scriptTabsHeight - scriptTabsOffset.top) * (0.995);
		
		$divTabContent.css('height', finalHeight);
		
		$(window).on('resize.calculateScriptTabsConteinerHeight', this.calculateScriptTabsConteinerHeight);
	}
	
	this.calculateMainTabsConteinersHeight = function(){
		var $divMainTabsConteiner = $('#main-tabs-conteiner');
		var $divActiveTabpanel = $divMainTabsConteiner.children('div.col-xs-11').children('div.tab-content').children('div.tab-pane.active');
		var $divTabPaneDialogParserTabPanel = $('#dialog-file-form-container').children('form.dialog-file-form').children('div.panel');
		var $divTabPaneEquivalenceTablePanel = $('#equivalence-table-tab').children('div.panel');
		var $divTabPaneSandboxPanel = $('#sandbox-tab').children('div.panel');
		
		var windowHeight = $(window).height();
		var activeTabpanelOffset = $divActiveTabpanel.offset();
		var finalHeight = (windowHeight - activeTabpanelOffset.top) * (0.95);
		
		$divTabPaneDialogParserTabPanel.css('height', finalHeight);
		$divTabPaneEquivalenceTablePanel.css('height', finalHeight);
		$divTabPaneSandboxPanel.css('height', finalHeight);
		
		$(window).on('resize.calculateMainTabsConteinersHeight', this.calculateMainTabsConteinersHeight);
	}
	
	this.instantiateOnTabClickEvents = function(){
		var $ulMainTabs = $('#main-tabs');
		var $buttonTabs = $ulMainTabs.find('a');
		
		var that = this;
		
		$buttonTabs.each(function(){
			var $buttonTab = $(this);
			
			var tabName = $buttonTab.attr('aria-controls');
			
			$buttonTab.on('shown.bs.tab', function(){
				if(tabName == 'dialog-parser-tab'){
					that.calculateScriptTabsConteinerHeight();
				} else {
					that.instantiateSelect2Fields();
					that.calculateMainTabsConteinersHeight();
				}
			});
		})
	}
	
	this.getTextWithoutTags = function(text){
		var destinationTool = this.destinationTool;
		
		if(destinationTool == 'opf'){
			text = text.replace(/<(.*?)>/g, '');
		} else {
			text = text.replace(/{(.*?)}/g, '');
		}
		text = text.replace(/\n/g, ' ');
		text = $.trim( text );
		return text;
	}
	
	this.instantiatePaginationDialogParsing = function(){
		var $dialogParserTables = $('table.dialog-parser-table');
		
		if($dialogParserTables.length == 0){
			return;
		}
		
		var that = this;
		
		$dialogParserTables.each(function(){
			var $dialogParserTable = $(this);
			
			var confirmLengthySearch = false;
			var limitRows = 5;
			var originalPage = 0;
			var originalLimitRows = limitRows;
			var filename = $dialogParserTable.attr('data-filename');

			// Instantiation
			var object = $dialogParserTable.on({
				// Table draw event
				'draw.dt': function(){
					var $dialogParserTableWrapper = $dialogParserTable.closest('div.dataTables_wrapper');
					var $tbody = $dialogParserTable.children('tbody');
					var $trs = $tbody.children('tr');
					var $spanTotalSections = $dialogParserTableWrapper.find('span.total-sections');
					var $spanTotalDialogBlocks = $dialogParserTableWrapper.find('span.total-dialog-blocks');
					
					var checkNoValidRows = (($trs.length == 0) || (($trs.length == 1) && ($trs.find('td.dataTables_empty').length == 1)));
					var totalSections = $dialogParserTable.attr('data-total-sections');
					var totalDialogBlocks = $dialogParserTable.attr('data-total-dialog-blocks');
					
					// Updating totals in the table footer
					$spanTotalSections.html(totalSections);
					$spanTotalDialogBlocks.html(totalDialogBlocks);

					// If there's no valid rows, there's no need
					// to instantiate the components below
					if(checkNoValidRows){
						return;
					}

					// Saving selector with all textareas in an property, in order to
					// accessing it faster afterwards
					if(typeof that.dialogParserTableTextareas[filename] == 'undefined'){
						that.dialogParserTableTextareas[filename] = $();
					}
					if(that.dialogParserTableTextareas[filename].length == 0){
						var tableObject = $dialogParserTable.DataTable();
						that.dialogParserTableTextareas[filename] = $( tableObject.rows().nodes() ).find("textarea.text-field");
					}

					// Iterating over each visible row, instantiate "copy to clipboard"
					// buttons and update the preview
					$trs.each(function(){
						var $tr = $(this);
						var $textareaTextField = $tr.find('textarea.text-field');
						var $divDialogPreview = $tr.find('div.dialog-preview');
						var $buttonsCopyClipboard = $tr.find('button.copy-clipboard');

						var previewFieldId = $divDialogPreview.attr('id');

						that.updatePreview($textareaTextField, previewFieldId, 't', false);
						that.instantiateCopyClipboardButtons($buttonsCopyClipboard, $textareaTextField);
					});
					
					// Instantiating word highlighting on all visible textareas
					var $visibleTextareas = $tbody.find('textarea.text-field:visible');
					that.highlightWordsTextareas($visibleTextareas);
				},
				// Pagination change event
				'page.dt': function(){
					var $dialogParserTableWrapper = $dialogParserTable.closest('div.dataTables_wrapper');
					
					var info = object.page.info();
					var currentPage = (info.page + 1);
					var previousPage;
					if($dialogParserTable.is("[data-current-page]")){
						previousPage = parseInt($dialogParserTable.attr('data-current-page'), 10);
					} else {
						previousPage = currentPage;
					}
					$dialogParserTable.attr('data-current-page', currentPage);

					if(currentPage < previousPage){
						that.lastColor = '';
					}

					// Scrolling to top of page, if not an automatic page change
					if(!that.automaticPageChange){
						var offset = $dialogParserTableWrapper.offset().top;
						if(offset > 0) offset = 0;
						
						$('#scripts-tabs').next().animate({
							scrollTop: offset
						}, 'slow');
					}
				},
				// Length change event ("Show" field)
				'length.dt': function(e, s){
					var $dialogParserTableWrapper = $dialogParserTable.closest('div.dataTables_wrapper');
					var $lengthField = $dialogParserTableWrapper.find('div.dataTables_length select');

					var length = s._iDisplayLength;
					var totalRows = object.data().length;

					// If user is trying to show all rows, and current script
					// has more than 500 rows, ask confirmation from user first.
					if(length == -1 && totalRows > 500 && !confirmLengthySearch){
						var confirm_message = "Esta pesquisa retornará muitos blocos e pode demorar um pouco.\n\n";
						confirm_message += 'Existe inclusive a possibilidade do seu navegador ficar congelado por alguns minutos, ';
						confirm_message += "dependendo da potência do seu computador, e/ou da quantidade de blocos desse script.\n\n";
						confirm_message += 'Deseja continuar?';
						var r = confirm(confirm_message);

						confirmLengthySearch = false;
						s._iDisplayStart = originalPage;
						s._iDisplayLength = originalLimitRows;

						if(r == true){
							confirmLengthySearch = true;
							originalPage = s._iDisplayStart;
							originalLimitRows = length;

							// Showing all rows, between a loading indicator
							that.showLoadingIndicator();
							setTimeout(function(){
								object.page.len(-1).draw();
								that.hideLoadingIndicator();
							}, 250);
						} else {
							setTimeout(function(){
								$lengthField.val(originalLimitRows);
							}, 250);
						}
					} else {
						originalLimitRows = length;
					}
				}
			}).DataTable({
				'order': [[0, 'asc']],
				'colReorder': true,
				'autoWidth': false,
				'lengthMenu': [
					[1, 2, 3, 5, 7, 10, 15, 25, 50, 75, 100, 150, 200, 300, 400, 500, -1],
					[1, 2, 3, 5, 7, 10, 15, 25, 50, 75, 100, 150, 200, 300, 400, 500, 'Todos']
				],
				'pageLength': 5,
				'pagingType': 'input',
				"dom":  "<'row'<'col-sm-6'lf><'col-sm-6 paginate_col'p>>" +
						"<'row'<'col-sm-12'tr>>" +
						"<'row'<'col-sm-6'i><'col-sm-6 paginate_col'p>>",
				'language': {
					'sEmptyTable': 'Nenhum registro encontrado',
					'sInfo': 'Total de seções: <span class="total-sections">...</span> - Total de diálogos: <span class="total-dialog-blocks">...</span>',
					'sInfoEmpty': '(Sem resultados)',
					'sInfoFiltered': '',
					'sInfoPostFix': '',
					'sInfoThousands': '.',
					'sLengthMenu': 'Exibir: _MENU_',
					'sLoadingRecords': 'Carregando...<br />Por favor, aguarde!',
					'sProcessing': 'Processando...<br />Por favor, aguarde!',
					'sZeroRecords': 'Nenhum registro encontrado',
					'sSearch': 'Pesquisar:',
					'oPaginate': {
						'sFirst': '<span class="glyphicon glyphicon-step-backward"></span>',
						'sPrevious': '<span class="glyphicon glyphicon-backward"></span>',
						'sNext': '<span class="glyphicon glyphicon-forward"></span>',
						'sLast': '<span class="glyphicon glyphicon-step-forward"></span>'
					},
					'oAria': {
						'sSortAscending': ': Ordenar colunas de forma ascendente',
						'sSortDescending': ': Ordenar colunas de forma descendente'
					}
				}
			});
			
			// Instantiating select2 for table filter field
			that.instantiateSelect2Fields();
			
			// Updating window title in order to prepend filename on it
			if($dialogParserTables.length == 1){
				var title = that.getTitle();
				that.setTitle(filename + ' - ' + title);
			}
		});

		// Doing additional customizations, based on electron or web version
		if( that.checkOnElectron() ){
			// Enabling script menus that was previously disabled
			var ipc = require('electron').ipcRenderer;
			ipc.send('activateScriptMenus');

			// Showing exit prompt before discarding changes
			ipc.send('showExitPromptBeforeDiscard');
		} else {
			// Showing the rest of the options in the global actions menu
			var $dropdownGlobalActions = $('#global-actions-dropdown');
			$dropdownGlobalActions.children('li').show();

			// Asking user to save script before exiting
			$(window).on("beforeunload", function() { 
				return 'Há um ou mais arquivos abertos na aba "Tradutor de Diálogos". É recomendável salvá-los antes de sair.\nTem certeza que quer continuar?'; 
			});
		}
	}
	
	this.triggerFocusOnVisibleTableSearchField = function(){
		$('div.dataTables_filter').find("input[type='search']:visible").first().focus();
	}
	
	this.closeScriptFile = function(scriptTabId){
		var $liScriptTab = $("a[href='#" + scriptTabId + "']").closest('li');
		var $divScriptTab = $('#' + scriptTabId);
		var $closestLiScriptTab = $liScriptTab.siblings().first();
		
		var closestScriptTabId = $closestLiScriptTab.children('a').attr('aria-controls');
		var totalScripts = this.openedFiles.length;
		
		// Showing confirmation messages, before closing the script
		if(totalScripts > 1){
			if( !confirm("Alterações não-salvas serão perdidas.\nFechar script?") ){
				return;
			}
		} else {
			if( this.checkOnElectron() ){
				this.reloadMainWindowOnElectron();
			} else {
				if( confirm('Alterações não-salvas serão perdidas.\nFechar script e voltar à página inicial?') ){
					$(window).off("beforeunload");
					location.reload();
				}
			}
			return;
		}
		
		// Checking if current script file tab is active
		var checkActive = $liScriptTab.hasClass('active');
		
		// Deleting script from DOM
		$liScriptTab.add($divScriptTab).remove();

		// Deleting script from "openedFiles" main property
		for(var i in this.openedFiles){
			var openedFile = this.openedFiles[i];
			var currentScriptTabId = openedFile.scriptTabId;

			if(currentScriptTabId == scriptTabId){
				this.openedFiles.splice(i, 1);
			}
		}
		
		// If current script file tab is active, then click on the
		// closest neighbor tab
		if(checkActive){
			this.triggerClickOnScriptTab(closestScriptTabId);
		}
	}
	
	this.highlightWordsTextareas = function(textareas, reinstantiate){
		if(typeof reinstantiate == 'undefined') reinstantiate = true;
		
		var $textareas = $(textareas);
		var $equivalenceTable = $('#equivalence-table');
		var $inputsOriginalNames = $equivalenceTable.find('input.original-name');
		var $inputsAdaptedNames = $equivalenceTable.find('input.adapted-name');
		
		var that = this;
		var theme = that.configs.theme;
		var themeColors = that.configs.highlightingColors[theme];
		var destinationTool = that.destinationTool;
		var originalNames = [], adaptedNames = [];
		
		$inputsOriginalNames.each(function(){
			originalNames.push(this.value);
		});
		$inputsAdaptedNames.each(function(){
			adaptedNames.push(this.value);
		});
		
		$textareas.each(function(){
			var $textarea = $(this);
			
			if($textarea.is("[data-highlight-instantiated='true']")){
				if(reinstantiate) {
					that.destroyHighlightWordTextarea($textarea);
				} else {
					// Continue to next element, avoiding component reinstantiation
					return true;
				}
			}
			
			$textarea.highlightTextarea({
				'words': [{
					'color': themeColors['tags'],
					'words': (destinationTool == 'opf') ? (['<(.+?)>']) : (['{(.+?)}'])
				}, {
					'color': themeColors['originalNames'],
					'words': originalNames
				}, {
					'color': themeColors['adaptedNames'],
					'words': adaptedNames
				}, {
					'color': themeColors['lineBreak'],
					'words': (destinationTool == 'opf') ? (['<b>']) : (['{b}'])
				}, {
					'color': themeColors['endSection'],
					'words': (destinationTool == 'opf') ? (['<endjmp>']) : (['{endjmp}'])
				}, {
					'color': themeColors['wait'],
					'words': (destinationTool == 'opf') ? (['<wait: [0-9]*>']) : (['{wait: [0-9]*}'])
				}]
			}).attr('data-highlight-instantiated', 'true');
		});
	}
	
	this.destroyHighlightWordTextarea = function(textarea){
		var $textarea = $(textarea);
		var $tdFormFields = $textarea.closest('td.form-fields');

		$textarea.appendTo($tdFormFields);
		$tdFormFields.find('div.highlightTextarea').remove();
		delete $textarea.data()['highlighter'];
	}
	
	this.instantiateCopyClipboardButtons = function(buttons, textarea){
		var $buttons = $(buttons);
		var $textarea = $(textarea);
		
		var destinationTool = this.destinationTool;
		
		$buttons.each(function(){
			var $button = $(this);
			
			$button.tooltip({
				'trigger': 'click',
				'placement': 'top'
			});

			var clipboard = new Clipboard(this, {
				'text': function(){
					var regex_tags;
					if(destinationTool == 'opf'){
						regex_tags = /<(.*?)>/g;
					} else {
						regex_tags = /{(.*?)}/g;
					}
					
					var text = $textarea.val();
					text = $.trim( text.replace(regex_tags, '').replace(/\n/g, ' ') );
					return text;
				}
			});

			clipboard.on('success', function(e) {
				$button.attr('data-original-title', 'Copiado para a área de transferência').tooltip('show');
				setTimeout(function(){
					$button.tooltip('hide');
				}, 3000);
			});
		})
	}
	
	this.updatePreview = function(field, previewFieldId, textType, sandbox, event, game, platform){
		if(typeof textType == 'undefined') textType = 't';
		if(typeof sandbox == 'undefined') sandbox = true;
		if(typeof game == 'undefined') game = this.configs.game;
		if(typeof platform == 'undefined') platform = this.configs.platform;
		
		var checkPlatformDS = (platform == 'ds_jacutemsabao' || platform == 'ds_american' || platform == 'ds_european');
		var checkGameIsAAI1 = (game == 'aai1');
		
		var keyCode;
		if(typeof event != 'undefined'){
			keyCode = (typeof event.which != 'undefined') ? (event.which) : (0);
		} else {
			keyCode = 0;
		}
		
		var invalidKeycodes = [9, 16, 17, 18, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 91, 92, 93, 144, 145, 225];
		var checkKeycodeInvalid = ($.inArray(keyCode, invalidKeycodes) !== -1);
		if(checkKeycodeInvalid){
			return;
		}
		
		var $field = $(field);
		var $dialogParserTable = $field.closest('table.dialog-parser-table');
		var $divTextWithoutTags = $field.closest('td').children('div.text-without-tags');
		var $divPreview = $('#' + previewFieldId);
		
		var $previousField;
		if($dialogParserTable.length > 0){
			var filename = $dialogParserTable.attr('data-filename');
			$previousField = this.dialogParserTableTextareas[filename].filter("[data-order='" + (parseInt($field.attr('data-order'), 10) - 1) + "']");
		} else {
			$previousField = $();
		}
		
		var text = $field.val();
		var tag = false;
		var hasNameTag = false;
		var tagText = '';
		var checkFirstField = ($previousField.length == 0);
		var fieldSection = parseInt($field.attr('data-section'), 10);
		var previousFieldSection = parseInt($previousField.attr('data-section'), 10);
		var destinationTool = this.destinationTool;
		
		// Adding parent class for DS platform detection
		if(checkPlatformDS){
			$divPreview.addClass('ds');
		} else {
			$divPreview.removeClass('ds');
		}
		
		if(textType == 'c'){
			var $divCharacterName = $divPreview.children('div.character-name');
			$divCharacterName.html(text);
		} else if(textType == 't'){
			var $divTextWindow = $divPreview.children('div.text-window');
			var $divCharacterName = $divPreview.children('div.character-name');
			$divTextWindow.html('');
			
			// Setting platform for preview
			$divTextWindow.removeClass('n3ds ds_jacutemsabao ds_american ds_european');
			if(checkPlatformDS){
				$divTextWindow.addClass(platform);
			} else {
				$divTextWindow.addClass('n3ds');
			}
			
			// Inserting {b} when user presses enter
			if(keyCode == 13 && !sandbox){
				var cursorPos = $field.prop('selectionStart') - 1;
				var textBefore = text.substring(0,  cursorPos);
				var textAfter  = $.trim( text.substring(cursorPos, text.length) );
				if(destinationTool == 'opf'){
					text = textBefore + '<b>\n' + textAfter;
				} else {
					text = textBefore + '{b}\n' + textAfter;
				}
				
				$field.val(text).prop('selectionEnd', cursorPos + 4).trigger('input');
			}
			
			// Defining last color, if from second field onwards
			if(!checkFirstField){
				// Setting color of previous field as last used color.
				// However, if the section changes, color must be resetted.
				var lastColor;
				if((fieldSection == previousFieldSection)){
					lastColor = parseInt($previousField.attr('data-color'), 10);
				} else {
					lastColor = 0;
				}
				
				// if selected game is AAI2, all text starts with color 0.
				if(game == 'aai2')
				{
					lastColor = 0;
				}
				
				this.lastColor = this.getColorClass(lastColor);
			}
			
			// Iterating over all characters inside text field
			for (var i = 0, size = text.length; i < size; i++) {
				var char = text[i];
				
				if(sandbox && char == '\n'){
					$divTextWindow.append('<br />');
					continue;
				}
				
				if(destinationTool == 'opf'){
					if(char == "<"){
						tag = true;
					} else if(char == ">"){
						tag = false;
					}
				} else {
					if(char == "{"){
						tag = true;
					} else if(char == "}"){
						tag = false;
					}
				}
				
				if(tag){
					if(destinationTool == 'opf'){
						if(char != '<'){
							tagText += char;
						}
					} else {
						if(char != '{'){
							tagText += char;
						}
					}
				} else {
					// Tags for all contexts
					if(tagText == 'b'){
						$divTextWindow.append('<br />');
					} else if(((destinationTool == 'opf' && char != '>') || (destinationTool != 'opf' && char != '}')) && char != '\n'){
						var newChar = this.formatChar(char);

						$divTextWindow.append(
							$('<span />').addClass('letter ' + newChar + ' ' + this.lastColor).html('&nbsp;')
						);
					} else if(!sandbox){
						// Specific tags for dialog parsing
						if(tagText.startsWith('name:')){
							hasNameTag = true;

							var tmp = tagText.split(':');
							var characterCode = parseInt(tmp.pop(), 10);
							this.lastName = this.getName(characterCode);
						} else if(tagText.startsWith('color:')){
							var tmp = tagText.split(':');
							var colorCode = parseInt(tmp.pop(), 10);
							
							this.lastColor = this.getColorClass(colorCode);
						} else if(tagText.startsWith('center_text:')){
							var tmp = tagText.split(':');
							var centerCode = parseInt(tmp.pop(), 10);
							if(centerCode == 1){
								$divTextWindow.addClass('centered');
							} else {
								$divTextWindow.removeClass('centered');
							}
						} else if(checkGameIsAAI1 && tagText.startsWith('margem:')){
							var tmp = tagText.split(':');
							var margin = parseInt(tmp.pop(), 10);
							
							$divTextWindow.append(
								$('<span />').addClass('letter space ' + this.lastColor).html('&nbsp;').css('marginLeft', margin - 16)
							);
						} else if(tagText == 'p' || tagText == 'nextpage_button'){
							$divTextWindow.remove('span.caret').append(
								$('<span />').addClass('caret').html('&nbsp;')
							);
						}
					}
					tagText = '';
				}
			}
			
			if(!sandbox){
				if(!hasNameTag){
					var code_server = $divCharacterName.attr('data-character-code');
					this.lastName = this.getName(code_server);
				}
				
				$divCharacterName.html(this.lastName);
				
				var regex_tag;
				if(destinationTool == 'opf'){
					regex_tag = /<(.*?)>/g;
				} else {
					regex_tag = /{(.*?)}/g;
				}
				$divTextWithoutTags.html( $.trim( text.replace(regex_tag, '').replace(/\n/g, ' ') ) );
				
				// Analysing current block
				var returnAnalysis = this.analyzeScriptBlock($divTextWindow);
				if(returnAnalysis !== true){
					$divTextWindow.closest('div.dialog-preview').addClass('invalid').attr('title', returnAnalysis.message);
				} else {
					$divTextWindow.closest('div.dialog-preview').removeClass('invalid').removeAttr('title');
				}
			}
		}
	}
	
	this.updateRow = function(field){
		var $field = $(field);
		var $trField = $field.closest('tr');
		var $dialogParserTable = $trField.closest('table.dialog-parser-table');
		var tableObject = $dialogParserTable.DataTable();
		
		tableObject.row($trField).invalidate();
	}
	
	this.getName = function(code){
		var $equivalenceTable = $('#equivalence-table');
		var $tbodyEquivalenceTable = $equivalenceTable.children('tbody');
		var $inputName;
		
		if(this.configs.nameType == 'a'){
			$inputName = $tbodyEquivalenceTable.find("[name='character[" + code + "][adapted_name]']");
		} else {
			$inputName = $tbodyEquivalenceTable.find("[name='character[" + code + "][original_name]']");
		}
		
		if($inputName.length > 0){
			return $inputName.val();
		} else {
			return '???';
		}
	}
	
	this.showScriptConfigSettings = function(){
		var $divConfigSettings = $('#config-settings');
		var $divColorpickerFields = $('div.colorpicker-component');
		
		// Showing modal
		$divConfigSettings.modal('show');
		
		// Instantiating colorpicker components
		$divColorpickerFields.colorpicker();
		
		// Loading configs into form
		this.loadConfigsForm();
		
		// Validate "Platform" field
		this.validateSelectedPlatformFromConfigSettings();
	}
	
	this.loadConfigsForm = function(){
		var $radioGameFieldAA1 = $('#config-game-field-aa1');
		var $radioGameFieldAA2 = $('#config-game-field-aa2');
		var $radioGameFieldAA3 = $('#config-game-field-aa3');
		var $radioGameFieldAA4 = $('#config-game-field-aa4');
		var $radioGameFieldAAI1 = $('#config-game-field-aai1');
		var $radioGameFieldAAI2 = $('#config-game-field-aai2');
		var $radioNameTypeOriginal = $('#config-name-type-original');
		var $radioNameTypeAdapted = $('#config-name-type-adapted');
		var $radioPlatform3DS = $('#config-platform-3ds');
		var $radioPlatformDSJTS = $('#config-platform-ds-jacutemsabao');
		var $radioPlatformDSAmerican = $('#config-platform-ds-american');
		var $radioPlatformDSEuropean = $('#config-platform-ds-european');
		var $radioInvalidateLargeLinesTrue = $('#invalidate-large-lines-true');
		var $radioInvalidateLargeLinesFalse = $('#invalidate-large-lines-false');
		var $radioThemeLight = $('#config-theme-light');
		var $radioThemeDark = $('#config-theme-dark');
		var $divColorpickerFields = $('div.colorpicker-component');
		
		// Checking default options for each field
		if(this.configs.game == 'aai1'){
			$radioGameFieldAAI1.prop('checked', true);
		} else if(this.configs.game == 'aa4'){
			$radioGameFieldAA4.prop('checked', true);
		} else if(this.configs.game == 'aa3'){
			$radioGameFieldAA3.prop('checked', true);
		} else if(this.configs.game == 'aa2'){
			$radioGameFieldAA2.prop('checked', true);
		} else if(this.configs.game == 'aai2'){
			$radioGameFieldAAI2.prop('checked', true);
		} 
		else {
			$radioGameFieldAA1.prop('checked', true);
		}
		
		if(this.configs.nameType == this.defaultConfigs.nameType){
			$radioNameTypeOriginal.prop('checked', true);
		} else {
			$radioNameTypeAdapted.prop('checked', true);
		}
		
		if(this.configs.platform == 'ds_jacutemsabao'){
			$radioPlatformDSJTS.prop('checked', true);
		} else if(this.configs.platform == 'ds_american'){
			$radioPlatformDSAmerican.prop('checked', true);
		} else if(this.configs.platform == 'ds_european'){
			$radioPlatformDSEuropean.prop('checked', true);
		} else {
			$radioPlatform3DS.prop('checked', true);
		}
		
		if(this.configs.invalidateLargeLines == this.defaultConfigs.invalidateLargeLines){
			$radioInvalidateLargeLinesTrue.prop('checked', true);
		} else {
			$radioInvalidateLargeLinesFalse.prop('checked', true);
		}
		
		if(this.configs.theme == this.defaultConfigs.theme){
			$radioThemeLight.prop('checked', true);
		} else {
			$radioThemeDark.prop('checked', true);
		}
		
		// Loading default highlighting colors
		var that = this;
		$divColorpickerFields.each(function(){
			var $div = $(this);
			var $input = $div.children('input');
			
			var name = $input.attr('name');
			var dataInBrackets = name.match(/\[(.*?)\]\[(.*?)\]/);
			var theme = dataInBrackets[1];
			var type = dataInBrackets[2];
			var color = that.configs.highlightingColors[theme][type];
			
			$input.val(color).trigger('change');
		});
		
		// Avoid form resetting default behaviour
		return false;
	}
	
	this.loadDefaultConfigs = function(){
		var $radioGameFieldAA1 = $('#config-game-field-aa1');
		var $radioGameFieldAA2 = $('#config-game-field-aa2');
		var $radioGameFieldAA3 = $('#config-game-field-aa3');
		var $radioGameFieldAA4 = $('#config-game-field-aa4');
		var $radioGameFieldAAI1 = $('#config-game-field-aai1');
		var $radioGameFieldAAI1 = $('#config-game-field-aai2');
		var $radioNameTypeOriginal = $('#config-name-type-original');
		var $radioNameTypeAdapted = $('#config-name-type-adapted');
		var $radioPlatform3DS = $('#config-platform-3ds');
		var $radioPlatformDSJTS = $('#config-platform-ds-jacutemsabao');
		var $radioPlatformDSAmerican = $('#config-platform-ds-american');
		var $radioPlatformDSEuropean = $('#config-platform-ds-european');
		var $radioInvalidateLargeLinesTrue = $('#invalidate-large-lines-true');
		var $radioInvalidateLargeLinesFalse = $('#invalidate-large-lines-false');
		var $radioThemeLight = $('#config-theme-light');
		var $radioThemeDark = $('#config-theme-dark');
		var $divColorpickerFields = $('div.colorpicker-component');
		
		// Checking default options for each field
		if(this.defaultConfigs.game == 'aai1'){
			$radioGameFieldAAI1.prop('checked', true);
		} else if(this.defaultConfigs.game == 'aa4'){
			$radioGameFieldAA4.prop('checked', true);
		} else if(this.defaultConfigs.game == 'aa3'){
			$radioGameFieldAA3.prop('checked', true);
		} else if(this.defaultConfigs.game == 'aa2'){
			$radioGameFieldAA2.prop('checked', true);
		} else {
			$radioGameFieldAA1.prop('checked', true);
		}
		if(this.defaultConfigs.nameType == 'o'){
			$radioNameTypeOriginal.prop('checked', true);
		} else {
			$radioNameTypeAdapted.prop('checked', true);
		}
		if(this.defaultConfigs.platform == 'ds_jacutemsabao'){
			$radioPlatformDSJTS.prop('checked', true);
		} else if(this.defaultConfigs.platform == 'ds_american'){
			$radioPlatformDSAmerican.prop('checked', true);
		} else if(this.defaultConfigs.platform == 'ds_european'){
			$radioPlatformDSEuropean.prop('checked', true);
		} else {
			$radioPlatform3DS.prop('checked', true);
		}
		if(this.defaultConfigs.invalidateLargeLines){
			$radioInvalidateLargeLinesTrue.prop('checked', true);
		} else {
			$radioInvalidateLargeLinesFalse.prop('checked', true);
		}
		if(this.defaultConfigs.theme == 'light'){
			$radioThemeLight.prop('checked', true);
		} else {
			$radioThemeDark.prop('checked', true);
		}
		
		// Loading default highlighting colors
		var that = this;
		$divColorpickerFields.each(function(){
			var $div = $(this);
			var $input = $div.children('input');
			
			var name = $input.attr('name');
			var dataInBrackets = name.match(/\[(.*?)\]\[(.*?)\]/);
			var theme = dataInBrackets[1];
			var type = dataInBrackets[2];
			var color = that.defaultConfigs.highlightingColors[theme][type];
			
			$input.val(color).trigger('change');
		});
		
		// Avoid form resetting default behaviour
		return false;
	}
	
	this.validateSelectedPlatformFromConfigSettings = function(){
		var $radioGameFields = $("[name='config-game-field']");
		var $radioPlatformFields = $("[name='config-platform']");
		var $radioInvalidateLargeLinesFields = $("[name='invalidate-large-lines']");
		var $checkedRadioGameField = $radioGameFields.filter(':checked');
		var $checkedRadioPlatformField = $radioPlatformFields.filter(':checked');
		var $radioPlatform3DS = $('#config-platform-3ds');
		var $radioPlatformDSJTS = $('#config-platform-ds-jacutemsabao');
		
		var checkedGame = $checkedRadioGameField.val();
		var checkedPlatform = $checkedRadioPlatformField.val();
		
		if(checkedGame == 'aai1' || checkedGame == 'aai2'){
			$radioInvalidateLargeLinesFields.attr('disabled', 'disabled').prop('checked', false);
			if(checkedPlatform == '3ds') $radioPlatformDSJTS.prop('checked', true);
			$radioPlatform3DS.attr('disabled', 'disabled');
		} 
		else {
			$radioPlatform3DS.removeAttr('disabled', 'disabled');
			$radioInvalidateLargeLinesFields.removeAttr('disabled').first().prop('checked', true);
		}
	}
	
	this.hideScriptConfigSettings = function(){
		$('#config-settings').modal('hide');
	}
	
	this.saveConfigs = function(){
		var $radioGameField = $("input[name='config-game-field']:checked");
		var $radioNameType = $("input[name='config-name-type']:checked");
		var $radioPlatform = $("input[name='config-platform']:checked");
		var $radioInvalidateLargeLines = $("input[name='invalidate-large-lines']:checked");
		var $radioTheme = $("input[name='config-theme']:checked");
		var $divColorpickerFields = $('div.colorpicker-component');
		
		var checkGameFieldChanged = ($radioGameField.val() != this.configs.game);
		var checkNameTypeChanged = ($radioNameType.val() != this.configs.nameType);
		var checkPlatformChanged = ($radioPlatform.val() != this.configs.platform);
		var checkInvalidateLargeLinesChanged = (/^true$/i.test($radioInvalidateLargeLines.val()) != this.configs.invalidateLargeLines);
		var checkThemeChanged = ($radioTheme.val() != this.configs.theme);
		
		this.hideScriptConfigSettings();
		this.showLoadingIndicator();
		
		var that = this;
		setTimeout(function(){
			if(checkGameFieldChanged) that.loadEquivalenceTableFromFileForm( $radioGameField.val() );
			if(checkNameTypeChanged) that.changeDefaultNameTypes( $radioNameType[0] );
			if(checkPlatformChanged) that.changePreviewPlatform( $radioPlatform[0] );
			if(checkInvalidateLargeLinesChanged) that.toggleLargeLinesInvalidation( $radioInvalidateLargeLines[0] );
			if(checkThemeChanged) that.changeTheme( $radioTheme[0] );
			that.updateHighlightingColors( $divColorpickerFields );

			that.hideLoadingIndicator();
		}, 25);
		
		// Needed to avoid form submission
		return false;
	}
	
	this.updateHighlightingColors = function(divColorpickerFields){
		var that = this;
		var checkAtLeastOneColorChanged = false;
		
		// Updating colors and detecting if at least one change was made
		var $divColorpickerFields = $(divColorpickerFields);
		$divColorpickerFields.each(function(){
			var $input =  $(this).children('input');
			
			var name = $input.attr('name');
			var dataInBrackets = name.match(/\[(.*?)\]\[(.*?)\]/);
			var theme = dataInBrackets[1];
			var type = dataInBrackets[2];
			var newColor = $input.val();
			var previousColor = that.configs.highlightingColors[theme][type];
			
			if(newColor != previousColor){
				checkAtLeastOneColorChanged = true;
				that.configs.highlightingColors[theme][type] = newColor;
			}
		});
		
		// Update table, since there's at least one color change
		if(checkAtLeastOneColorChanged){
			var $dialogParserTables = $('table.dialog-parser-table');
			$dialogParserTables.each(function(){
				var tableObject = $(this).DataTable();
				tableObject.draw(false);
			});
		}
	}
	
	this.showScriptSaveSettings = function(){
		var $dialogParserTables = $('table.dialog-parser-table');
		var $divSaveSettings = $('#save-settings');
		var $saveNameField = $('#save-name-field');
		var $saveFileFormat = $('#save-file-format');
		var $spanFilenameExtension = $('#filename-extension');
		
		var filename;
		if($dialogParserTables.length > 1){
			filename = 'teste';
		} else {
			filename = $dialogParserTables.first().attr('data-filename');
		}
		filename = filename.replace(/\..+$/, '');
		var saveFormat = this.saveFormat;
		var totalOpenedFiles = this.openedFiles.length;
		var extension;
		if(totalOpenedFiles > 1){
			extension = '.zip';
		} else {
			extension = '.txt';
		}
		
		// Appending current date / time into the filename
		var data = new Date();
		data = new Date(data.getTime() - (data.getTimezoneOffset() * 60000)).toJSON();
		data = data.slice(0, 19).replace(/T/g, '-').replace(/:/g, '-');
		filename += ' (' + data + ')';
		
		// Triggering click on first main tab, in case of the user has clicked
		// on another tab
		this.triggerClickOnFirstMainTab();
		
		// Showing save settings modal window, and filling the form fields afterwards
		$divSaveSettings.modal('show');
		$saveNameField.val(filename).focus();
		$saveFileFormat.val(saveFormat);
		$spanFilenameExtension.html(extension);
		
		// Instantiating select2 field inside modal
		this.instantiateSelect2Fields();
	}
	
	this.hideScriptSaveSettings = function(){
		$('#save-settings').modal('hide');
	}
	
	this.showScriptAnalysisSettings = function(){
		var $divAnalysisSettings = $('#analysis-settings');
		var $selectScript = $('#analysis-script');
		
		// Loading options for script field, based on the opened files
		$selectScript.html(
			$('<option />').val('').html('Todos')
		);
		for(var i in this.openedFiles){
			var file = this.openedFiles[i];
			
			$selectScript.append(
				$('<option />').val(file.scriptTabId).html(file.filename)
			);
		}
		
		var $tbodyAnalysisResultsTable = $('#analysis-results-table').children('tbody');
		
		// Triggering click on first main tab, in case of the user has clicked
		// on another tab
		this.triggerClickOnFirstMainTab();
		
		// If there's previous analysis results, show them instead
		var checkHasPreviousAnalysisResults = ($tbodyAnalysisResultsTable.children('tr').not('.empty').length > 0);
		if(checkHasPreviousAnalysisResults){
			this.changeTitleScriptAnalysisResults('Resultados da Última Análise');
			this.showScriptAnalysisResults();
			return;
		}
		
		// Showing analysis settings modal, and filling form fields afterwards
		$divAnalysisSettings.modal('show');
		if(this.configs.invalidateLargeLines){
			$('#analysis-invalidate-large-lines-true').prop('checked', true);
		} else {
			$('#analysis-invalidate-large-lines-false').prop('checked', true);
		}
		
		// Instantiating select2 field inside modal
		this.instantiateSelect2Fields();
	}
	
	this.hideScriptAnalysisSettings = function(){
		$('#analysis-settings').modal('hide');
	}
	
	this.startNewScriptAnalysis = function(){
		if(confirm('Os resultados da última análise serão perdidos. Confirmar?') == true){
			var $tbodyAnalysisResultsTable = $('#analysis-results-table').children('tbody');
			$tbodyAnalysisResultsTable.html('');

			this.hideScriptAnalysisResults();
			this.showScriptAnalysisSettings();
		}
	}
	
	this.showScriptAnalysisResults = function(){
		$('#analysis-results').modal('show');
	}
	
	this.changeTitleScriptAnalysisResults = function(title){
		if(typeof title == 'undefined') title = 'Resultados da Análise';
		$('#analysis-results').find('h4.modal-title').html(title);
	}
	
	this.hideScriptAnalysisResults = function(){
		$('#analysis-results').modal('hide');
	}
	
	this.showScriptExportSettings = function(){
		var $divExportSettings = $('#export-settings');
		var $selectScript = $('#export-script');
		var $inputNameField = $('#export-name-field');
		
		// Loading options for script field, based on the opened files
		var currentlyActiveScriptTabId = this.getCurrentlyActiveScriptTabId();
		var filename = '';
		$selectScript.html('');
		for(var i in this.openedFiles){
			var file = this.openedFiles[i];
			
			var $option = $('<option />').val(file.scriptTabId).html(file.filename);
			if(file.scriptTabId == currentlyActiveScriptTabId){
				$option.attr('selected', 'selected');
				filename = (file.filename).replace(/\..+$/, '');
			}
			
			$selectScript.append($option);
		}
		
		// Adding current date time in the filename
		var data = new Date();
		data = new Date(data.getTime() - (data.getTimezoneOffset() * 60000)).toJSON();
		data = data.slice(0, 19).replace(/T/g, '-').replace(/:/g, '-');
		filename += ' (' + data + ')';
		
		// Triggering click on first main tab, in case of the user has clicked
		// on another tab
		this.triggerClickOnFirstMainTab();
		
		// Showing export settings modal, and filling the form fields afterwards
		$divExportSettings.modal('show');
		$inputNameField.val(filename).focus();
		
		// Instantiating select2 field inside modal
		this.instantiateSelect2Fields();
	}
	
	this.hideScriptExportSettings = function(){
		$('#export-settings').modal('hide');
	}
	
	this.openAboutPage = function(){
		var url_github = 'https://github.com/leomontenegro6/aade';
		if( this.checkOnElectron() ){
			var shell = require('electron').shell;
			shell.openExternal(url_github);
		} else {
			window.open(url_github);
		}
	}
	
	this.focusOnFirstMainOption = function(){
		var $divMainOptions = $('#main-options');
		var $firstMainOption = $divMainOptions.children('label').first();
		var $secondMainOption = $firstMainOption.next();
		
		$firstMainOption.focus();
		if( this.checkOnElectron() ){
			var e = jQuery.Event('keyup');
			e.which = 37;
			$secondMainOption.trigger(e);
		}
	}
	
	this.instantiateFileOriginKeyupBehaviours = function(label, event){
		var $label = $(label);
		var $radioOption = $label.children("input[type='radio']");
		var $newlyFocusedLabel;
		
		var keyCode = event.which;
		
		if(keyCode == 13){
			// Enter, so select the main option
			$radioOption.trigger('click');
		} else if((keyCode == 37) || (keyCode == 39)){
			// Left / Right arrow keys, so set focus on the next or preview main option
			if(keyCode == 37){
				$newlyFocusedLabel = $label.prev();
			} else {
				$newlyFocusedLabel = $label.next();
			}
			var $radioOptionNewlyFocusedLabel = $newlyFocusedLabel.children("input[type='radio']");
			
			$newlyFocusedLabel.trigger('focus');
			$radioOptionNewlyFocusedLabel.trigger('click');
			if($radioOptionNewlyFocusedLabel.is("[id='file-origin-load-scripts-in-folder']")){
				$('#scripts-folder-submit').parent().focus();
			} else if($radioOptionNewlyFocusedLabel.is("[id='file-origin-select-test-scripts']")){
				$('#test-script-0').parent().focus();
			}
		}
	}
	
	this.setTestScriptKeyupBehaviours = function(label, event){
		var $label = $(label);
		var $radioCheckboxOption = $label.children("input[type='radio'], input[type='checkbox']");
		var $newlyFocusedLabel;
		
		var keyCode = event.which;
		if(keyCode == 13){
			// Enter pressed, so open the selected test script
			$radioCheckboxOption.trigger('click').trigger('blur');
		} else if((keyCode == 38) || (keyCode == 40)){
			// Up / Down arrow keys, so set focus to the next or preview test script
			if(keyCode == 38){
				$newlyFocusedLabel = $label.prev();
			} else {
				$newlyFocusedLabel = $label.next();
			}
			
			$newlyFocusedLabel.trigger('focus');
			
			event.preventDefault();
			return false;
		} else if(keyCode == 37){
			// Left arrow key, so set focus to the previous main option
			var e = jQuery.Event('keyup');
			e.which = keyCode;
			$('#file-origin-select-test-scripts').parent().trigger(e);
		} else if(keyCode == 39 && this.checkOnElectron()){
			// Right arrow key on electron, so set focus on the next main option
			var e = jQuery.Event('keyup');
			e.which = keyCode;
			$('#file-origin-load-scripts-in-folder').parent().trigger(e);
		}
	}
	
	this.toggleFileOrigin = function(radio){
		var $radio = $(radio);
		var $inputFileField = $('#file-field');
		var $divTestScriptsList = $('#test-scripts-list');
		var $divScriptsFolderList = $('#scripts-folder-list');
		
		var fileOrigin = $radio.val();
		if(fileOrigin == 'f'){ // File input
			$inputFileField.removeAttr('disabled').attr('required', 'required');
			
			$divScriptsFolderList.hide().find("[type='checkbox']").not('.submit').prop('checked', false).removeAttr('required').closest("label").removeClass('active');
			
			$divTestScriptsList.hide().find("[type='radio']").prop('checked', false).removeAttr('required').closest("label").removeClass('active');
			
			$inputFileField.trigger('click');
			setTimeout(function(){
				$radio.prop('checked', false).parent().removeClass('active');
				$inputFileField.attr('disabled', 'disabled').removeAttr('required');
			}, 25);
		} else if(fileOrigin == 's'){ // Scripts in folder
			$inputFileField.attr('disabled', 'disabled').removeAttr('required');
			
			$divScriptsFolderList.show().find("[type='checkbox']").not('.submit').attr('required', 'required').prop('checked', true).closest("label").addClass('active');
			
			$divTestScriptsList.hide().find("[type='radio']").prop('checked', false).removeAttr('required').closest("label").removeClass('active');
		} else if(fileOrigin == 't'){ // Test scripts
			$inputFileField.attr('disabled', 'disabled').removeAttr('required');
			
			$divScriptsFolderList.hide().find("[type='checkbox']").not('.submit').prop('checked', false).removeAttr('required');
			
			$divTestScriptsList.show().find("[type='radio']").attr('required', 'required');
		}
	}
	
	this.changePreviewPlatform = function(select){
		var $select = $(select);
		
		var platform = $select.val();
		stash.set('platform', platform);
		
		this.loadConfigs();
		
		this.updatePreviewVisibleTextareas();
	}
	
	this.changeDefaultGame = function(select){
		var $select = $(select);
		
		var game = $select.val();
		stash.set('game', game);
		
		this.loadConfigs();
		
		this.updatePreviewVisibleTextareas();
	}
	
	this.changeDefaultNameTypes = function(select){
		var $select = $(select);
		
		var nameType = $select.val();
		stash.set('nameType', nameType);
		
		this.loadConfigs();
		
		this.updatePreviewVisibleTextareas();
	}
	
	this.changeDestinationTool = function(select){
		var $select = $(select);
		
		var destinationTool = $select.val();
	
		this.destinationTool = destinationTool;
	}
	
	this.changeSaveFormat = function(select){
		var $select = $(select);
		
		var saveFormat = $select.val();	
	
		this.saveFormat = saveFormat;
	}
	
	this.toggleLargeLinesInvalidation = function(radio){
		var $radio = $(radio);
		
		var invalidateLargeLines = $radio.val();
		
		stash.set('invalidateLargeLines', (invalidateLargeLines == 'true'));
		
		this.loadConfigs();
	}
	
	this.updatePreviewVisibleTextareas = function(){
		var $dialogParserTable = $('table.dialog-parser-table:visible');
		var $textareas = $dialogParserTable.find('textarea');
		$textareas.trigger('keyup');
	}
	
	this.addNewDialogBlock = function(button){
		var $button = $(button);
		var $tr = $button.closest('tr');
		var $divDialogPreview = $button.closest('div.dialog-preview');
		var $divCharacterName = $divDialogPreview.children('div.character-name');
		var $dialogParserTable = $tr.closest('table.dialog-parser-table');
		var $divTabPane = $dialogParserTable.closest('div.tab-pane');
		
		var tableObject = $dialogParserTable.DataTable();
		var filename = $dialogParserTable.attr('data-filename');
		var scriptTabId = $divTabPane.attr('id');
		
		var that = this;
		var characterCode = $divCharacterName.attr('data-character-code');
		var destinationTool = that.destinationTool;
		var regex_brackets;
		if(destinationTool == 'opf'){
			regex_brackets = /\&[A-z]*;/g;
		} else {
			regex_brackets = /[{}]/g;
		}
		var currentOrder = parseFloat( $tr.find('.order').first().html() );
		var currentSection = ( $tr.find('.section').first().html() ).replace(regex_brackets, '');
		var currentBlockNumber = parseFloat( $tr.find('.block-number').first().html() );
		
		var newOrder = (currentOrder + 0.01).toFixed(2);
		var newBlockNumber = (currentBlockNumber + 0.01).toFixed(2);
		var newDialogId = scriptTabId + '-s-' + currentSection + '-b-' + (newOrder.toString().replace(/\./g, '_')) + '-dialog';
		
		$.get('dialog-parser-row.html').then(function(response){
			var template = $.templates(response);
			
			var rowInfo = {
				'order': newOrder,
				'section': currentSection,
				'blockNumber': newBlockNumber,
				'dialogId': newDialogId,
				'characterCode': '',
				'textWithoutTags': ''
			}
			var $newTr = $( template.render(rowInfo) );
			var $newTdPreviewConteiners = $newTr.children('td.preview-conteiners');
			var $newTdFormFields = $newTr.children('td.form-fields');
			var $newTextarea = $newTdFormFields.find('textarea');
			var $newDivCharacterName = $newTdPreviewConteiners.find('div.character-name');

			// Setting name from previous block into the new one
			$newDivCharacterName.attr('data-character-code', characterCode);
			
			// Updating selector property with all textareas in an property
			tableObject.row.add($newTr);
			that.dialogParserTableTextareas[filename] = $( tableObject.rows().nodes() ).find("textarea.text-field");
			tableObject.draw(false);

			// Adding end block tag in the new block, according to the script format.
			if(destinationTool == 'opf'){
				$newTdFormFields.find('textarea').val('<p>');
			} else {
				$newTdFormFields.find('textarea').val('{p}');
			}
			
			// Adding remove button
			var $newButtonGroups = $newTdPreviewConteiners.find('div.btn-group');
			var $newButtonRemoveDialogBlock = $('<button />').addClass('btn btn-danger remove-block').attr({
				'tabindex': '-1',
				'title': 'Remover bloco de diálogo',
				'onclick': 'aade.removeDialogBlock(this)'
			}).html('<span class="glyphicon glyphicon-minus"></span>');
			$newButtonGroups.append($newButtonRemoveDialogBlock[0].outerHTML);
			
			// Removing add button if the game is AAI1
			if(that.configs.game = 'aai1'){
				$newTdPreviewConteiners.find('button.add-new-block').remove();
			}

			// Incrementing row counter in the footer of the table
			that.changeTotalDialogsFooter('i');

			// Focusing new textarea and placing cursor at beginning of the field
			$newTextarea.focus();
			$newTextarea[0].setSelectionRange(0, 0);
		});
	}
	
	this.removeDialogBlock = function(button){
		var $button = $(button);
		var $tr = $button.closest('tr');
		var $dialogParserTable = $tr.closest('table.dialog-parser-table');
		
		var tableObject = $dialogParserTable.DataTable();
		var filename = $dialogParserTable.attr('data-filename');
		
		// Updating selector property with all textareas in an property
		tableObject.row($tr).remove();
		this.dialogParserTableTextareas[filename] = $( tableObject.rows().nodes() ).find("textarea.text-field");
		tableObject.draw(false);
		
		this.changeTotalDialogsFooter('d');
	}
	
	this.changeTotalDialogsFooter = function(operation){
		if(typeof operation == 'undefined') operation = 'i';
		
		var $dialogParserTable = $('table.dialog-parser-table:visible');
		var $divTabpanel = $dialogParserTable.closest('div.tab-pane');
		var $spanTotalSections = $divTabpanel.find('span.total-sections');
		var $spanTotalDialogBlocks = $divTabpanel.find('span.total-dialog-blocks');
		
		var totalSections = parseInt($dialogParserTable.attr('data-total-sections'), 10);
		var totalDialogBlocks = parseInt($dialogParserTable.attr('data-total-dialog-blocks'), 10);
		if(operation == 'i'){
			totalDialogBlocks++;
		} else {
			totalDialogBlocks--;
		}
		$dialogParserTable.attr('data-total-dialog-blocks', totalDialogBlocks);
		
		$spanTotalSections.html(totalSections);
		$spanTotalDialogBlocks.html(totalDialogBlocks);
	}
	
	this.toggleValueFields = function(selectFilterType){
		var $selectFilterType = $(selectFilterType);
		var $divOrder = $('#div-goto-row-order');
		var $divBlockNumber = $('#div-goto-row-block-number');
		var $divSection = $('#div-goto-row-section');
		var $inputOrder = $('#goto-row-order');
		var $inputBlockNumber = $('#goto-row-block-number');
		var $inputSection = $('#goto-row-section');
		
		var filterType = $selectFilterType.val();
		
		if(filterType == 'o'){
			$divOrder.show();
			$divSection.add($divBlockNumber).hide();
			$inputSection.add($inputBlockNumber).val('');
		} else {
			$divOrder.hide();
			$divSection.add($divBlockNumber).show();
			$inputOrder.val('');
		}
	}
	
	this.maskFilterInput = function(event){
		// Allow: backspace, delete, tab, escape and enter
		if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
			 // Allow: Ctrl+A, Command+A
			(event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true)) || 
			 // Allow: home, end, left, right, down, up
			(event.keyCode >= 35 && event.keyCode <= 40)) {
				 // let it happen, don't do anything
				 return true;
		}
		// Ensure that it is a number and stop the keypress
		if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
			return false;
		} else {
			return true;
		}
	}
	
	this.maskFilenameInput = function(event){
		var keyCode = event.which;
		
		var invalidKeycodes = [106, 111, 188, 191, 192, 220, 221, 225];
		var checkKeycodeInvalid = ($.inArray(keyCode, invalidKeycodes) !== -1);
		if(checkKeycodeInvalid){
			return false;
		} else {
			return true;
		}
	}
	
	this.previewScripts = function(){
		var that = this;
		
		var $divTextPreview = $('#text-preview');
		var $modalBodyTextPreview = $divTextPreview.find('div.modal-body');
		var $ulScriptsTabs = $modalBodyTextPreview.children('ul.nav-tabs');
		var $divTabContent = $ulScriptsTabs.next();
		
		$ulScriptsTabs.add( $divTabContent ).html('');
		
		that.triggerClickOnFirstMainTab();
		that.showLoadingIndicator();
		
		setTimeout(function(){
			for(var i in that.openedFiles){
				var file = that.openedFiles[i];
				var scriptTabId = file.scriptTabId;
				var filename = file.filename;
				var previewScriptTabId = 'preview-' + scriptTabId;
				var scriptText = that.generateScriptText(scriptTabId);
				
				// Creating tab elements for each opened file
				var $liTab = $('<li />').attr('role', 'presentation').append(
					$('<a />').attr({
						'href': '#' + previewScriptTabId,
						'aria-controls': previewScriptTabId,
						'role': 'tab',
						'data-toggle': 'tab'
					}).html(filename)
				);
				var $divTabpanel = $('<div />').attr({
					'id': previewScriptTabId,
					'role': 'tabpanel'
				}).addClass('tab-pane').html("<textarea class='form-control' readonly>" + scriptText + "</textarea>");
				if(i == 0){
					$liTab.add($divTabpanel).addClass('active');
				}

				// Adding tab elements to the component
				$ulScriptsTabs.append($liTab);
				$divTabContent.append($divTabpanel);
			}
			
			// Hiding loading indicator and showing text preview modal
			that.hideLoadingIndicator();
			$divTextPreview.modal('show');
		}, 25);
	}
	
	this.saveScripts = function(saveFileForm){
		var $saveNameField = $('#save-name-field');
		
		var that = this;
		that.hideScriptSaveSettings();
		that.showLoadingIndicator();
		
		var scriptsToSave = ( this.openedFiles ).slice(0);
		var totalScriptsToSave = scriptsToSave.length;
		var currentScriptNumber = 0;
		var saveFormat = that.saveFormat;
		var scriptsTexts = [];
		
		var saveScript = function(scriptsToSave){
			setTimeout(function(){
				// Getting first script from the list and remove it from the main array
				var currentScript = scriptsToSave.shift();
				
				scriptsTexts.push({
					'filename': currentScript.filename,
					'text': that.generateScriptText(currentScript.scriptTabId)
				});
				
				// Updating processing indicator with the current progress percentage
				var percentage = Math.ceil( (currentScriptNumber / totalScriptsToSave) * 100 );
				that.updateProcessingIndicator('default', percentage);
				currentScriptNumber++;
				
				// Checking if there's at least one more script to save
				if(scriptsToSave.length > 0){
					// More than one script to save, so call the recursive function
					// again, passing the main array of scripts as parameter
					saveScript(scriptsToSave);
				} else {
					// All scripts saved, so proceed with the generation of the files
					var finalFilename = $saveNameField.val();
					
					// Checking which file format to generate
					if(totalScriptsToSave > 1){
						// Zip file
						finalFilename += '.zip';
						var zip = new JSZip();
						var blobs = [];
						
						// Function for generating file blobs from script texts,
						// based on the save format
						var generateFileBlobs = function(scriptsTexts, callback){
							var scriptText = scriptsTexts.shift();
							var filename = scriptText.filename;
							var text = scriptText.text;
							var blob;

							// Change file encoding based on the save format
							if(saveFormat == 'ansi'){
								// ANSI encoding
								var scriptBinary = new Uint8Array(text.length);
								for(var i = 0; i < scriptBinary.length; i++) {
									var charCode = text.charCodeAt(i);

									scriptBinary[i] = charCode;
								}

								generateBlobInANSI(scriptBinary, function(blob){
									blobs.push({
										'filename': filename,
										'blob': blob
									});
									
									// Check if there's at least one more file blob to generate
									if(scriptsTexts.length > 0){
										// There's still file blobs to generate, so call the
										// function again, recursively
										generateFileBlobs(scriptsTexts, callback);
									} else {
										// All file blobs generated, so run the callback
										// passing them as parameter
										if(callback) callback(blobs);
									}
								});
							} else if((saveFormat == 'utf-8_without_bom') || (saveFormat == 'utf-8_with_bom')){
								if(saveFormat == 'utf-8_without_bom'){
									// UTf-8 Without BOM
									blob = new Blob([text], {type: 'text/plain;charset=utf-8'});
								} else {
									// UTf-8 With BOM
									blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), text], {type: 'text/plain;charset=utf-8'});
								}
								
								blobs.push({
									'filename': filename,
									'blob': blob
								});
								
								// Check if there's at least one more file blob to generate
								if(scriptsTexts.length > 0){
									// There's still file blobs to generate, so call the
									// function again, recursively
									generateFileBlobs(scriptsTexts, callback);
								} else {
									// All file blobs generated, so run the callback
									// passing them as parameter
									if(callback) callback(blobs);
								}
							}
						}
						generateFileBlobs(scriptsTexts, function(blobs){
							for(var i in blobs){
								var filename = blobs[i].filename;
								var blob = blobs[i].blob;
								
								zip.file(filename, blob);
							}
							
							// Generating zip file with all scripts inside
							zip.generateAsync({type: "blob"}).then(function(content){
								that.hideLoadingIndicator();
								saveAs(content, finalFilename);
							});
						});
					} else {
						// TXT file
						finalFilename += '.txt';
						var scriptText = scriptsTexts[0];
						var text = scriptText.text;
						
						if(saveFormat == 'ansi'){
							// Saving script in ANSI encoding
							var scriptBinary = new Uint8Array(text.length);
							for(var i = 0; i < scriptBinary.length; i++) {
								var charCode = text.charCodeAt(i);

								scriptBinary[i] = charCode;
							}

							safeSave(finalFilename, scriptBinary);
						} else if(saveFormat == 'utf-8_without_bom'){
							// Saving script in UTF-8 without BOM
							saveAs(new Blob([text], {type: 'text/plain;charset=utf-8'}), finalFilename, true);
						} else {
							// Saving script in UTF-8 with BOM
							saveAs(new Blob([text], {type: 'text/plain;charset=utf-8'}), finalFilename, false);
						}
						
						that.hideLoadingIndicator();
					}
				}
			}, 1);
		}
		saveScript(scriptsToSave);
		
		// Needed to avoid form submission
		return false;
	}
	
	this.saveScriptsOnElectron = function(callback){
		var that = this;
		
		// If not on electron.js, abort
		if( !that.checkOnElectron() ){
			return;
		}
		
		// If file origin is different than 's' (scripts in folder), then
		// proceed with the script saving routine from web version.
		var fileOrigin = that.originOfOpenedFiles;
		if(fileOrigin != 's'){
			return that.showScriptSaveSettings();
		}
		
		// If in here, then proceed with script saving in the "scripts" folder
		that.showProcessingIndicator();
		
		// Getting needed variables, before doing the operation
		var scriptsToSave = ( that.openedFiles ).slice(0);
		var totalScriptsToSave = scriptsToSave.length;
		var currentScriptNumber = 0;
		var encoding;
		if(that.destinationTool == 'dhh'){
			encoding = 'iso-8859-1';
		} else {
			encoding = 'utf-8';
		}
		
		var saveScript = function(scriptsToSave){
			setTimeout(function(){
				// Getting first script from the list and remove it from the main array
				var currentScript = scriptsToSave.shift();
				var filename = currentScript.filename;
				var scriptTabId = currentScript.scriptTabId;
				var scriptText = that.generateScriptText(scriptTabId);
				
				var returnOperation = that.writeContentsOfScriptInFolder(filename, scriptText, encoding);
				if(returnOperation === true){
					// Updating processing indicator with the current progress percentage
					var percentage = Math.ceil( (currentScriptNumber / totalScriptsToSave) * 100 );
					that.updateProcessingIndicator('default', percentage);
					currentScriptNumber++;
					
					// Checking if there's at least one more script to save
					if(scriptsToSave.length > 0){
						// More than one script to save, so call the recursive function
						// again, passing the main array of scripts as parameter
						saveScript(scriptsToSave);
					} else {
						// All scripts saved, so proceed with the generation of the files
						that.hideProcessingIndicator();
						
						var msg = totalScriptsToSave;
						if(totalScriptsToSave > 1){
							msg += ' scripts salvos';
						} else {
							msg += ' script salvo';
						}
						msg += ' com sucesso!';
						
						that.showNotify(msg);
						if(callback) callback(true);
					}
				} else {
					that.hideProcessingIndicator();
					that.showNotify('Erro ao salvar o arquivo "' + filename + '"!', 'danger');
					if(callback) callback(false);
				}
			}, 1);
		}
		saveScript(scriptsToSave);
	}
	
	this.showNotify = function(message, type){
		if(typeof type == 'undefined') type = 'info';
		var icon;
		if(type == 'warning' || type == 'danger'){
			icon = 'warning-sign';
		} else {
			icon = 'info-sign';
		}
		
		$.notify({
			icon: 'glyphicon glyphicon-' + icon,
			message: message
		}, {
			type: type
		});
	}
	
	this.exportScript = function(){
		var $selectScript = $('#export-script');
		var $inputNameField = $('#export-name-field');
		var $selectFormatField = $('#export-format-field');
		
		var scriptTabId = $selectScript.val();
		var filename = $inputNameField.val();
		var format = $selectFormatField.val();
		
		var that = this;
		
		that.hideScriptExportSettings();
		that.showLoadingIndicator();
		
		setTimeout(function(){
			var exportedScriptText = convertHtmlToRtf( that.generateExportedScriptText(scriptTabId) );
			
			that.hideLoadingIndicator();
			
			var filenameWithFormat = filename + '.' + format;
			
			var blob = new Blob([exportedScriptText], {type: "text/plain"});
			saveAs(blob, filenameWithFormat, true);
		}, 25);
		
		// Needed to avoid form submission
		return false;
	}
	
	this.generateScriptText = function(scriptTabId){
		if(typeof scriptTabId == 'undefined') scriptTabId = this.getCurrentlyActiveScriptTabId();
		
		var $divScriptTab = $('#' + scriptTabId);
		var $dialogParserTable = $divScriptTab.find('table.dialog-parser-table');
		var tableObject = $dialogParserTable.DataTable();
		
		var destinationTool = this.destinationTool;
		var scriptText = '';
		var scriptSections = [];

		$( tableObject.rows().nodes() ).find('textarea.text-field').sort(function(a, b){
			// Sort all textareas by id attribute, to avoid messing
			// with the order of dialogues
			return parseFloat( $(a).attr('data-order') ) - parseFloat( $(b).attr('data-order') );
		}).each(function(i){
			var $textarea = $(this);
			var section = $textarea.attr('data-section');
			var text = $textarea.val();

			var checkSectionInserted = ($.inArray(section, scriptSections) !== -1);
			if(!checkSectionInserted){
				scriptSections.push(section);
				
				if(destinationTool == 'opf'){
					if(i > 0){
						scriptText += ('\n<<' + section + '>>\n');
					} else {
						scriptText += ('<<' + section + '>>\n');
					}
				} else {
					if(i > 0){
						scriptText += ('\n{{' + section + '}}\n');
					} else {
						scriptText += ('{{' + section + '}}\n');
					}
				}
			}

			scriptText += (text + '\n');
		});
		
		return scriptText;
	}
	
	this.generateExportedScriptText = function(scriptTabId){
		if(typeof scriptTabId == 'undefined') scriptTabId = this.getCurrentlyActiveScriptTabId();
		
		var $divScriptTab = $('#' + scriptTabId);
		var $dialogParserTable = $divScriptTab.find('table.dialog-parser-table');
		var tableObject = $dialogParserTable.DataTable();
		
		var destinationTool = this.destinationTool;
		var scriptText = "<b>SCRIPT DUMPADO APENAS PARA FINS DE ANÁLISE E REVISÃO</b><br />";
		scriptText += "<b>NÃO TRADUZA O SCRIPT POR AQUI, MAS SIM PELO PRÓPRIO AADE!</b><br /><br />";
		var scriptSections = [];
		var that = this;
		var characterCode = null;

		$( tableObject.rows().nodes() ).find('textarea.text-field').sort(function(a, b){
			// Sort all textareas by id attribute, to avoid messing
			// with the order of dialogues
			return parseFloat( $(a).attr('data-order') ) - parseFloat( $(b).attr('data-order') );
		}).each(function(){
			var $textarea = $(this);
			var order = $textarea.attr('data-order');
			var section = $textarea.attr('data-section');
			var block = $textarea.attr('data-block');
			var text = $textarea.val();
			
			// Getting character name
			var characterTags;
			if(destinationTool == 'opf'){
				characterTags = text.match(/<name:[ ]*[0-9]*>/g);
			} else {
				characterTags = text.match(/{name:[ ]*[0-9]*}/g);
			}
			if(characterTags != null && characterTags.length > 0){
				var tagText = characterTags[0];
				var tmp = tagText.split(':');
				characterCode = parseInt(tmp.pop(), 10);
			}
			var characterName = that.getName(characterCode);
			
			// Formatting text, in order to remove all tags
			if(destinationTool == 'opf'){
				text = $.trim( text.replace(/<b>/g, '|').replace(/<(.*?)>/g, '').replace(/\n/g, '').replace(/\|/g, '<br />') );
			} else {
				text = $.trim( text.replace(/{b}/g, '|').replace(/{(.*?)}/g, '').replace(/\n/g, '').replace(/\|/g, '<br />') );
			}
			text = '<b>Ordem: ' + order + ' - Número: ' + block + ' - Personagem: ' + characterName + '</b><br />' + text;

			var checkSectionInserted = ($.inArray(section, scriptSections) !== -1);
			if(!checkSectionInserted){
				scriptSections.push(section);

				scriptText += ('<b>SEÇÃO ' + section + '</b><br /><br />');
			}

			scriptText += (text + '<br /><br />');
		});
		
		return scriptText;
	}
	
	this.analyzeScripts = function(){
		var $selectScript = $('#analysis-script');
		
		var that = this;
		var selectedScriptTabId = $selectScript.val();
		
		that.hideScriptAnalysisSettings();
		that.showScriptAnalysisProcessingIndicator();
		that.automaticPageChange = true;
		
		var scriptsToAnalyze = [];
		if(selectedScriptTabId != ''){
			for(var i in that.openedFiles){
				var file = that.openedFiles[i];
				
				if(file.scriptTabId == selectedScriptTabId){
					scriptsToAnalyze.push(file);
				}
			}
		} else {
			scriptsToAnalyze = ( that.openedFiles ).slice(0);
		}
		var totalScriptsToAnalyze = scriptsToAnalyze.length;
		var invalidBlocks = [];
		var currentScriptNumber = 0;
		
		// Recursive function for analysing each script
		var analyzeScript = function(scriptsToAnalyze){
			setTimeout(function(){
				// Getting first script from the list and remove it from the main array
				var currentScript = scriptsToAnalyze.shift();
				var scriptTabId = currentScript.scriptTabId;

				var $divScriptTab = $('#' + scriptTabId);
				var $dialogParserTable = $divScriptTab.find('table.dialog-parser-table');

				var tableObject = $dialogParserTable.DataTable();

				var totalPages = tableObject.page.info().pages;
				var pages = [];
				for(var page=0; page<totalPages; page++){
					pages.push(page);
				}

				that.triggerClickOnScriptTab(scriptTabId);

				// Updating processing indicator with the current progress percentage
				var scriptsPercentage = Math.ceil( (currentScriptNumber / totalScriptsToAnalyze) * 100 );
				that.updateProcessingIndicator('analysisScripts', scriptsPercentage);
				currentScriptNumber++;
				
				// Updating processing indicator label, according to the total of scripts to be analyzed
				var messageLabel;
				if(totalScriptsToAnalyze > 1){
					// Multiple scripts to analyze, so fill the message label with the current script
					// number and the total scripts to analyze
					messageLabel = 'Script ' + currentScriptNumber + ' / ' + totalScriptsToAnalyze;
				} else {
					// Only one script to analyze, so change the label back to the default message
					// number and the total scripts to analyze
					messageLabel = 'Scripts';
				}
				that.updateLabelScriptAnalysisProcessingIndicator(messageLabel);

				// Recursive function for analysing each page
				var analyzeScriptPage = function(pages){
					setTimeout(function(){
						// Getting first page from the list, and remove it from the main array
						var currentPage = pages.shift();

						tableObject.page(currentPage).draw(false);
						$dialogParserTable.find('div.text-window').each(function(){
							var $divTextWindow = $(this);
							var returnAnalysis = that.analyzeScriptBlock($divTextWindow);

							if(returnAnalysis !== true){
								invalidBlocks.push(returnAnalysis);
							}
						});

						// Updating processing indicator with the current progress percentage
						var pagesPercentage = Math.ceil( (currentPage / totalPages) * 100 );
						that.updateProcessingIndicator('analysisScriptsPages', pagesPercentage);

						// Checking if there's at least one more page to analyze
						if(pages.length > 0){
							// More than one page to analyze, so call the recursive function again,
							// passing the main array of pages as parameter
							analyzeScriptPage(pages);
						} else {
							// All pages analyzed, so proceed with the analysis of the next files.
							// Checking if there's at least one more script to analyze
							if(scriptsToAnalyze.length > 0){
								// More than one script to analyze, so call the recursive function again,
								// passing the main array of pages as parameter

								analyzeScript(scriptsToAnalyze);
							} else {
								// All scripts analyzed, so proceed with the exhibition of results
								that.hideScriptAnalysisProcessingIndicator();
								that.changeTitleScriptAnalysisResults();
								that.showScriptAnalysisResults();

								var $analysisResultsTable = $('#analysis-results-table');
								var $tbody = $analysisResultsTable.children('tbody');
								var $spanTotalInvalidBlocks = $analysisResultsTable.find('span.total-invalid-blocks');

								$tbody.html('');

								var totalInvalidBlocks = invalidBlocks.length;
								if(totalInvalidBlocks > 0){
									for(var i in invalidBlocks){
										var invalidBlock = invalidBlocks[i];
										
										var scriptTabId = invalidBlock.scriptTabId;
										var filename = invalidBlock.filename;
										var order = invalidBlock.order;
										var section = invalidBlock.section;
										var blockNumber = invalidBlock.blockNumber;
										var $invalidBlock = $(invalidBlock.invalidBlock).clone();
										var message = invalidBlock.message;

										var $previewElement = $('<div />').addClass('dialog-preview text-only invalid').css('marginTop', '0').html(
											$invalidBlock
										);
										if($invalidBlock.hasClass('ds_jacutemsabao') || $invalidBlock.hasClass('ds_american') || $invalidBlock.hasClass('ds_european')){
											$previewElement.addClass('ds');
										}

										$tbody.append(
											$('<tr />').append(
												$('<td />').html(filename)
											).append(
												$('<td />').html(order)
											).append(
												$('<td />').html(section)
											).append(
												$('<td />').html(blockNumber)
											).append(
												$('<td />').html($previewElement)
											).append(
												$('<td />').html(message)
											).append(
												$('<td />').html(
													$('<button />').attr({
														'type': 'button',
														'title': 'Ir para este bloco',
														'onclick': 'aade.gotoRow("' + scriptTabId + '", ' + order + ')'
													}).addClass('btn btn-sm btn-primary').html(
														$('<span />').addClass('glyphicon glyphicon-arrow-right')
													)
												)
											)
										);
									}

									$spanTotalInvalidBlocks.html(totalInvalidBlocks).closest('tfoot').show();
								} else {
									$tbody.append(
										$('<tr />').addClass('empty').append(
											$('<td />').attr('colspan', '7').addClass('text-center').html('Nenhum bloco inválido encontrado!')
										)
									);
									$spanTotalInvalidBlocks.html('...').closest('tfoot').hide();
								}

								that.automaticPageChange = false;
							}
						}
					}, 1);
				}
				analyzeScriptPage(pages);
			}, 1);
		}
		analyzeScript(scriptsToAnalyze);
		
		// Needed to avoid form submission
		return false;
	}
	
	this.analyzeScriptBlock = function(divTextWindow){
		var $divTextWindow = $(divTextWindow);
		var $divTabPane = $divTextWindow.closest('div.tab-pane');
		var $dialogParserTable = $divTextWindow.closest('table.dialog-parser-table');
		var $tr = $divTextWindow.closest('tr');
		var $tdOrder = $tr.children('td.order');
		var $tdSection = $tr.children('td.section');
		var $tdBlockNumber = $tr.children('td.block-number');
		
		var scriptTabId = $divTabPane.attr('id');
		var filename = $dialogParserTable.attr('data-filename');
		var order = $tdOrder.html();
		var section = $tdSection.html();
		var blockNumber = $tdBlockNumber.html();
		var blockWidth = $divTextWindow.outerWidth();
		var caretRightPadding = 0;
		var lineNumber = 1;
		var lineWidth = 10;
		var charactersPerLine = 0;
		var message = '';
		var that = this;
		var platform = that.configs.platform;
		var game = that.configs.game;
		var checkPlatformDS = (platform == 'ds_jacutemsabao' || platform == 'ds_american' || platform == 'ds_european');
		var checkGameIsAAI1 = (game == 'aai1');
		
		var checkValidBlock = true;
		var checkBlockWidthLastLineReduced = false;
		var checkCenteredBlock = $divTextWindow.hasClass('centered');
		var checkHasCaret = ($divTextWindow.children('span.caret').length > 0);

		$divTextWindow.children('*').each(function(){
			var $elem = $(this);
			
			var checkAtLeastOneCharacterInLine = false;
			
			if($elem.is('span.letter')){
				// Counting line width and characters on each line
				lineWidth += $elem.width();
				charactersPerLine++;
				checkAtLeastOneCharacterInLine = true;
			} else if($elem.is('br')){
				// Counting each line break
				lineNumber++;
				lineWidth = 10;
				charactersPerLine = 0;
				checkAtLeastOneCharacterInLine = false;
			}
			
			// For blocks with three lines, defining caret right padding
			// and reducing block width with its value
			if((checkGameIsAAI1 || (checkHasCaret && lineNumber == 3)) && !checkBlockWidthLastLineReduced){
				if(checkCenteredBlock){
					if(checkPlatformDS){
						caretRightPadding = 15;
					} else {
						caretRightPadding = 23;
					}
				} else {
					if(checkPlatformDS){
						caretRightPadding = 13;
					} else {
						caretRightPadding = 17;
					}
				}
				blockWidth -= caretRightPadding;
				if(checkGameIsAAI1) blockWidth -= 2;
				checkBlockWidthLastLineReduced = true;
			}
			
			// Validating block
			if(lineNumber > 3 && checkAtLeastOneCharacterInLine){
				checkValidBlock = false;
				message = 'Bloco com mais de 3 linhas!';
				return false; // Exit $.each
			}
			if(lineWidth > blockWidth){
				var checkInsideCaretArea;
				if(checkHasCaret && lineNumber == 3){
					var caret_start = blockWidth;
					var caret_ending = (blockWidth + caretRightPadding);
					if(checkCenteredBlock){
						caret_ending += 5;
					}
					
					if((lineWidth >= caret_start) && (lineWidth <= caret_ending)){
						checkInsideCaretArea = true;
					} else {
						checkInsideCaretArea = false;
					}
				} else {
					checkInsideCaretArea = false;
				}
				
				checkValidBlock = false;
				if(checkInsideCaretArea && !checkGameIsAAI1){
					message = 'Texto sobrepondo a área do cursor da terceira linha!';
				} else {
					message = 'Largura da linha ultrapassa limite do bloco!';
				}
			}
			if((that.configs.invalidateLargeLines && !checkGameIsAAI1) && (charactersPerLine > 32)){
				checkValidBlock = false;
				message = 'Contém linhas com mais de 32 caracteres!';
				return false; // Exit $.each
			}
		});
		
		// Returning true if block is valid, or an array containing the block element
		// and the message being returned
		if(checkValidBlock){
			return true;
		} else {
			return {
				'scriptTabId': scriptTabId,
				'filename': filename,
				'order': order,
				'section': section,
				'blockNumber': blockNumber,
				'invalidBlock': $divTextWindow,
				'message': message
			}
		}
	}
	
	this.showPopover = function(element, message){
		var $template = $("<div />").addClass('popover danger').attr('role', 'tooltip').append(
			$('<div />').addClass('arrow')
		).append(
			$('<h3 />').addClass('popover-title')
		).append(
			$('<div />').addClass('popover-content')
		);
		
		element.popover({
			'html': true,
			'placement': 'auto left',
			'template': $template,
			'content': message,
			'delay': 200,
			'trigger': 'manual'	
		});
		element.popover('show');
		
		element.add($template).click(function(){
			element.closest('div.dialog-preview').removeClass('invalid');
			element.popover('hide');
		});
	}
	
	this.hidePopover = function(element){
		element.popover('hide');
	}
	
	this.showGotoRowFilters = function(){
		var $divGotoRowSettings = $('#goto-row-settings');
		var $selectScript = $('#goto-row-script');
		var $selectFilterType = $('#goto-row-filter-type');
		var $divOrder = $('#div-goto-row-order');
		var $divBlockNumber = $('#div-goto-row-block-number');
		var $divSection = $('#div-goto-row-section');
		var $inputOrder = $('#goto-row-order');
		var $inputBlockNumber = $('#goto-row-block-number');
		var $inputSection = $('#goto-row-section');
		
		// Loading options for script field, based on the opened files
		var currentlyActiveScriptTabId = this.getCurrentlyActiveScriptTabId();
		$selectScript.html('');
		for(var i in this.openedFiles){
			var file = this.openedFiles[i];
			
			var $option = $('<option />').val(file.scriptTabId).html(file.filename);
			if(file.scriptTabId == currentlyActiveScriptTabId) $option.attr('selected', 'selected');
			
			$selectScript.append($option);
		}
		
		// Selecting default option in filter type field
		var filterType = 'o';
		$selectFilterType.val(filterType);
		
		// Triggering click on first main tab, in case of the user has clicked
		// on another tab
		this.triggerClickOnFirstMainTab();
		
		// Showing modal
		$divGotoRowSettings.modal('show');
		
		// Resetting all text fields
		$inputOrder.add($inputSection).add($inputBlockNumber).val('');
		
		// Toggling text fields based on filter type
		if(filterType == 'o'){
			$divOrder.show();
			$divSection.add($divBlockNumber).hide();
		} else {
			$divOrder.hide();
			$divSection.add($divBlockNumber).show();
		}
		
		// Instantiating select2 field inside modal
		this.instantiateSelect2Fields();
		
		// Focusing filter type
		$inputOrder.focus();
	}
	
	this.hideGotoRowFilters = function(){
		$('#goto-row-settings').modal('hide');
	}
	
	this.gotoRow = function(scriptTabId, order){
		var $divScriptTab = $('#' + scriptTabId);
		var $dialogParserTable = $divScriptTab.find('table.dialog-parser-table');
		
		var tableObject = $dialogParserTable.DataTable();
		var pageLength = tableObject.page.info().length;
		var that = this;
		
		that.hideScriptAnalysisResults();
		that.showLoadingIndicator();
		
		setTimeout(function(){
			var destinationPage = Math.ceil( order / pageLength ) - 1;
			var checkRowFound = !isNaN(destinationPage);
			if(checkRowFound){
				that.triggerClickOnScriptTab(scriptTabId);
				
				tableObject.page(destinationPage).draw(false);
				
				var $trFound = $dialogParserTable.find('td.order:contains("' + order + '")').closest('tr');
				
				$('#scripts-tabs').next().animate({
					scrollTop: $trFound.offset().top
				}, 'slow');

				$trFound.addClass('highlight');
				setTimeout(function(){
					$trFound.removeClass('highlight');
				}, 5000);
			} else {
				alert('Linha não encontrada!');
			}

			that.hideLoadingIndicator();
		}, 25)
	}
	
	this.gotoRowByFilters = function(gotoRowForm){
		var $selectScript = $('#goto-row-script');
		var $selectFilterType = $('#goto-row-filter-type');
		var $inputOrder = $('#goto-row-order');
		var $inputBlockNumber = $('#goto-row-block-number');
		var $inputSection = $('#goto-row-section');
		
		var scriptTabId = $selectScript.val();
		var filterType = $selectFilterType.val();
		var order = $inputOrder.val();
		var section = $inputSection.val();
		var blockNumber = $inputBlockNumber.val();
		
		var $divScriptTab = $('#' + scriptTabId);
		var $dialogParserTable = $divScriptTab.find('table.dialog-parser-table');
		var tableObject = $dialogParserTable.DataTable();
		var currentPage = tableObject.page();
		var pageLength = tableObject.page.info().length;
		
		var checkOrderProvided = (order != '');
		var checkSectionProvided = (section != '');
		var checkBlockNumberProvided = (blockNumber != '');
		
		this.hideGotoRowFilters();
		this.showLoadingIndicator();
		var that = this;
		
		setTimeout(function(){
			var checkRowFound = false;
			var destinationPage;
			
			var $trFound;
			
			that.automaticPageChange = true;
			
			var checkFormValid = true;
			var invalidFormMessage = '';
			if(filterType == 'o' && !checkOrderProvided){
				checkFormValid = false;
				invalidFormMessage = 'Ordem não fornecida!';
			} else if(filterType == 'sn' && (!checkSectionProvided && !checkBlockNumberProvided)){
				checkFormValid = false;
				invalidFormMessage = 'Nem a seção e nem o número do bloco foram fornecidos!';
			}
			
			if(checkFormValid){
				that.triggerClickOnScriptTab(scriptTabId);
				
				$( tableObject.rows().nodes() ).each(function(i){
					var $tr = $(this);
					var $tdOrder = $tr.children('td.order');
					var $tdSection = $tr.children('td.section');
					var $tdBlockNumber = $tr.children('td.block-number');

					var checkOrderFound = false;
					var checkSectionAndOrBlockNumberFound = false;

					if(filterType == 'o'){
						if(checkOrderProvided){
							if($.trim( order ) == ($.trim( $tdOrder.html() ))){
								checkOrderFound = true;
							}
						} else {
							// No value provided, so abort
							return false;
						}
					} else if(filterType == 'sn'){
						if(checkSectionProvided && checkBlockNumberProvided){
							// Section and block filled
							if((('{{' + $.trim( section ) + '}}') == $.trim( $tdSection.html() )) && ($.trim( blockNumber ) == $.trim( $tdBlockNumber.html() ))){
								checkSectionAndOrBlockNumberFound = true;
							}
						} else if(checkSectionProvided && !checkBlockNumberProvided){
							// Only section provided
							if(('{{' + $.trim( section ) + '}}') == $.trim( $tdSection.html() )){
								checkSectionAndOrBlockNumberFound = true;
							}
						} else if(!checkSectionProvided && checkBlockNumberProvided){
							// Only block number provided
							if($.trim( blockNumber ) == $.trim( $tdBlockNumber.html() )){
								checkSectionAndOrBlockNumberFound = true;
							}
						} else {
							// No value provided, so abort
							return false;
						}
					}

					if(checkSectionAndOrBlockNumberFound || checkOrderFound){
						$trFound = $tr;
						destinationPage = Math.ceil((i + 1) / pageLength) - 1;
						checkRowFound = true;
						return false;
					}
				});
				
				that.hideLoadingIndicator();
			
				if(checkRowFound){
					tableObject.page(destinationPage).draw(false);
					
					$('#scripts-tabs').next().animate({
						scrollTop: $trFound.offset().top
					}, 'slow');

					$trFound.addClass('highlight');
					setTimeout(function(){
						$trFound.removeClass('highlight');
					}, 5000);
				} else {
					alert('Linha não encontrada!');
					tableObject.page(currentPage).draw(false);
				}

				that.automaticPageChange = false;
			} else {
				that.hideLoadingIndicator();
				
				alert(invalidFormMessage);
			}
		}, 25);
		
		// Needed to avoid form submission
		return false;
	}
	
	this.loadEquivalenceTable = function(game){
		if(game == ''){
			return;
		}
		
		this.game = game;
		
		var that = this;
		$.getScript('js/aade.et.' + game + '.js', function(){
			var $tableEquivalenceTable = $('#equivalence-table');
			var $tbody = $tableEquivalenceTable.children('tbody');
			
			$tbody.children('tr.default').remove();
			var $firstTr = $tbody.children('tr').first();
			
			for(var code in that.equivalenceTable){
				var name = that.equivalenceTable[code];
				var originalName = name.original;
				var adaptedName = name.adapted;
				
				var $newTr = $('<tr />').addClass('default').append(
					$('<td />').addClass('code').html(code)
				).append(
					$('<td />').append(
						$('<input />').attr({
							'type': 'text',
							'name': 'character[' + code + '][original_name]',
							'placeholder': 'Digite o nome original'
						}).val(originalName).addClass('form-control original-name').on({
							'keyup': that.updatePreviewVisibleTextareas
						})
					)
				).append(
					$('<td />').append(
						$('<input />').attr({
							'type': 'text',
							'name': 'character[' + code + '][adapted_name]',
							'placeholder': 'Digite o nome adaptado'
						}).val(adaptedName).addClass('form-control adapted-name').on({
							'keyup': that.updatePreviewVisibleTextareas
						})
					)
				).append(
					$('<td />').append(
						$('<button />').attr({
							'type': 'button',
							'onclick': 'aade.removeCharacterEquivalenceTable(this)',
							'disabled': 'disabled'
						}).addClass('btn btn-danger').html(
							$('<span />').addClass('glyphicon glyphicon-remove')
						)
					)
				);
				
				if($firstTr.length > 0){
					$firstTr.before($newTr);
				} else {
					$tbody.append($newTr)
				}
			}
			
			that.updatePreviewVisibleTextareas();
		})
	}
	
	this.loadEquivalenceTableFromFileForm = function(game){
		var $selectEquivalenceTable = $('#equivalence-table-field');
		$selectEquivalenceTable.val(game).trigger('change');
		
		this.changeDefaultGame($selectEquivalenceTable);
	}
	
	this.validateSelectedPlatformFromFileForm = function(){
		var $selectPlatform = $('#platform');
		
		var game = this.configs.game;
		var platform = this.configs.platform;
		
		if(!platform) platform = this.defaultConfigs.platform;
		
		if(game == 'aai1' || game == 'aai2'){
			if(platform == '3ds') $selectPlatform.val('ds_jacutemsabao');
			$selectPlatform.find("option[value='3ds']").attr('disabled', 'disabled');
		} else {
			$selectPlatform.find("option[value='3ds']").removeAttr('disabled');
		}
		$selectPlatform.trigger('change');
		this.reinstantiateSelect2Fields($selectPlatform);
	}
	
	this.addCharacterEquivalenceTable = function(){
		var code = prompt('Digite o código do personagem');
		if(code == null){
			return;
		}
		
		var $equivalenceTable = $('#equivalence-table');
		var $tbody = $equivalenceTable.children('tbody');
		var codes = [];

		$tbody.find('td.code').each(function(){
			var code = this.innerHTML;
			codes.push(code);
		});
		
		if($.inArray(code, codes) !== -1){
			alert('Esse código já está sendo usado.');
			return;
		}
		
		var $clonedTr = $tbody.find('tr').last().clone().removeClass('default');
		var $tdCode = $clonedTr.find('td.code');
		var $inputOriginalName = $clonedTr.find('input.original-name');
		var $inputAdaptedName = $clonedTr.find('input.adapted-name');
		var $buttonRemove = $clonedTr.find('button');
		
		$tdCode.html(code);
		$inputOriginalName.attr('name', 'character[' + code + '][original_name]').val('');
		$inputAdaptedName.attr('name', 'character[' + code + '][adapted_name]').val('');
		$buttonRemove.removeAttr('disabled');
		
		$clonedTr.appendTo($tbody);
		$inputOriginalName.focus();
	}
	
	this.removeCharacterEquivalenceTable = function(button){
		var $button = $(button);
		var $tr = $button.closest('tr');
		$tr.remove();
	}
	
	this.showInstructions = function(){
		$('#instructions').modal('show');
	}
	
	this.hideInstructions = function(){
		$('#instructions').modal('hide');
	}
	
	this.showLoadingIndicator = function(){
		$('#loading-indicator').modal('show');
	}
	
	this.hideLoadingIndicator = function(){
		$('#loading-indicator').modal('hide');
	}
	
	this.showProcessingIndicator = function(){
		$('#processing-indicator').modal('show');
		
		this.processingProgressbars['default'] = $('#processing-progress-bar');
		
		this.processingProgressbars['default'].addClass('active');
		this.updateProcessingIndicator('default', 0);
	}
	
	this.updateProcessingIndicator = function(progressbarType, percentage){
		if((typeof percentage == 'undefined') || (percentage < 0)){
			percentage = 0;
		} else if(percentage > 100) {
			percentage = 100;
		}
		
		var $progressBar = this.processingProgressbars[progressbarType];
		
		$progressBar.attr('aria-valuenow', percentage).css('width', percentage + '%').html(percentage + '%');
		if(percentage == 100) $progressBar.removeClass('active');
	}
	
	this.hideProcessingIndicator = function(){
		this.updateProcessingIndicator('default', 100);
		$('#processing-indicator').modal('hide');
	}
	
	this.showScriptAnalysisProcessingIndicator = function(){
		$('#analysis-processing-indicator').modal('show');
		
		this.processingProgressbars['analysisScripts'] = $('#scripts-progress-bar');
		this.processingProgressbars['analysisScriptsPages'] = $('#pages-progress-bar');
		
		this.processingProgressbars['analysisScripts'].addClass('active');
		this.processingProgressbars['analysisScriptsPages'].addClass('active');
		
		this.updateProcessingIndicator('analysisScripts', 0);
		this.updateProcessingIndicator('analysisScriptsPages', 0);
	}
	
	this.updateLabelScriptAnalysisProcessingIndicator = function(message){
		var $pLabelScriptAnalysis = $('#label-scripts-progress-bar');
		
		$pLabelScriptAnalysis.html(message);
	}
	
	this.hideScriptAnalysisProcessingIndicator = function(){
		this.updateProcessingIndicator('analysisScripts', 100);
		this.updateProcessingIndicator('analysisScriptsPages', 100);
		
		$('#analysis-processing-indicator').modal('hide');
	}
	
	this.loadSandboxBackgroundImageOptions = function(){
		var $selectSandboxBackgroundField = $('#sandbox-background-field');
		
		var options = {
			'judge': 'Juiz',
			'phoenix_objecting': 'Veríssimo protestando',
			'miles_argumenting': 'Spada argumentando',
			'butz_scorning': 'Vário desdenhando',
			'alphabet_test': 'Teste de alfabetos',
			'accent_test': 'Teste de acentos'
		};
		
		for(var value in options){
			var description = options[value];
			
			$selectSandboxBackgroundField.append(
				$('<option />').val(value).html(description)
			);
		}
	}
	
	this.getSandboxPlatform = function(){
		var $selectPlatformSandbox = $('#sandbox-platform');
		return $selectPlatformSandbox.val();
	}
	
	this.updateBackgroundsSandbox = function(field){
		var $field = $(field);
		var $selectPlatformSandbox = $('#sandbox-platform');
		var $divSandboxPreview = $('#sandbox');
		var $divSandboxTextWindow = $divSandboxPreview.children('div.text-window');
		var $imgComparativeImage = $('#sandbox-comparative-image');
		
		var image = $field.val();
		var platform = $selectPlatformSandbox.val();
		var checkPlatformDS = (platform == 'ds_jacutemsabao' || platform == 'ds_american' || platform == 'ds_european');
		
		$divSandboxTextWindow.removeClass('n3ds ds_jacutemsabao ds_american ds_european');
		if(checkPlatformDS){
			image += '_ds';
			$divSandboxPreview.addClass('ds');
			$divSandboxTextWindow.addClass(platform);
		} else {
			$divSandboxPreview.removeClass('ds');
			$divSandboxTextWindow.addClass('n3ds');
		}
		$divSandboxPreview.css('background', "url('images/" + image + ".png')");
		$imgComparativeImage.attr('src', 'images/' + image + '_filled.png');
	}
	
	this.updatePlatformSandbox = function(field){
		var $field = $(field);
		var $selectBackgroundSandbox = $('#sandbox-background-field');
		var $textFieldSandbox = $('#sandbox-text-field');
		
		this.updateBackgroundsSandbox($selectBackgroundSandbox[0]);
		$textFieldSandbox.trigger('keyup');
	}
	
	this.formatChar = function(char){
		var charTable = {
			// Symbols
			' ': 'space', '!': 'exclamation', '"': 'double-quotes', '#': 'cerquilha',
			'$': 'money-sign', '%': 'percent', '&': 'ampersand', "'": 'quotes',
			"(": 'open-parenthesis', ")": 'close-parenthesis', '*': 'asterisk',
			'+': 'plus', ',': 'comma', '-': 'minus', '.': 'dot', '/': 'slash',
			':': 'colon', ';': 'semicolon', '=': 'equal',
			'?': 'interrogation', '@': 'at-sign',
			'©': 'copyright', '[': 'open-square-brackets', ']': 'close-square-brackets',
			'_': 'underscore', '¡': 'inverted-exclamation',
			'¿': 'inverted-interrogation', 'º': 'o-ordinal', 'ª': 'a-ordinal',
			
			// Numbers
			'0': 'n0', '1': 'n1', '2': 'n2', '3': 'n3', '4': 'n4', '5': 'n5',
			'6': 'n6', '7': 'n7', '8': 'n8', '9': 'n9',
			
			// Uppercase accents
			'À': 'A-grave', 'Á': 'A-acute', 'Â': 'A-circumflex', 'Ã': 'A-tilde',
			'Ä': 'A-diaeresis', 'Ç': 'C-cedilla', 'È': 'E-grave', 'É': 'E-acute', 
			'Ê': 'E-circumflex', 'Ë': 'E-diaeresis', 'Ẽ': 'E-tilde', 'Ì': 'I-grave',
			'Í': 'I-acute', 'Ï': 'I-diaeresis', 'Î': 'I-circumflex', 'Ò': 'O-grave',
			'Ó': 'O-acute', 'Ô': 'O-circumflex', 'Õ': 'O-tilde', 'Ö': 'O-diaeresis',
			'Ù': 'U-grave', 'Ú': 'U-acute', 'Û': 'U-circumflex', 'Ü': 'U-diaeresis',
			'Ñ': 'N-tilde', 'Ÿ': 'Y-diaeresis',
			
			// Lowercase accents
			'à': 'a-grave', 'á': 'a-acute', 'â': 'a-circumflex', 'ã': 'a-tilde',
			'ä': 'a-diaeresis', 'ç': 'c-cedilla', 'è': 'e-grave', 'é': 'e-acute', 
			'ê': 'e-circumflex', 'ẽ': 'e-tilde', 'ë': 'e-diaeresis', 'ì': 'i-grave',
			'í': 'i-acute', 'ï': 'i-diaeresis', 'î': 'i-circumflex', 'ò': 'o-grave',
			'ó': 'o-acute', 'ô': 'o-circumflex', 'õ': 'o-tilde', 'ö': 'o-diaeresis',
			'ù': 'u-grave', 'ú': 'u-acute', 'û': 'u-circumflex', 'ü': 'u-diaeresis',
			'ñ': 'n-tilde', 'ÿ': 'y-diaeresis'
			
		}
		var destinationTool = this.destinationTool;
		if(destinationTool == 'dhh'){
			charTable['<'] = 'less-than';
			charTable['>'] = 'greater-than';
		}
		
		var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
		for(var i in alphabet){
			var letter = alphabet[i];
			
			charTable[letter] = letter;
		}
		
		var key, newChar;
		for (key in charTable) {
			if(key == char){
				var newValue = charTable[key];
				newChar = char.replace(key, newValue);
				break;
			}
		}
		if(typeof newChar == 'string'){
			return newChar;
		} else {
			return 'unknown';
		}
	}
	
	this.getColorClass = function(colorCode){
		if(this.configs.game == 'aai1'){
			if(colorCode == 32770 || colorCode == 1){
				return 'color-orange';
			} else if(colorCode == 32772 || colorCode == 2){
				return 'color-blue';
			} else if(colorCode == 32774 || colorCode == 3){
				return 'color-green';
			} else {
				return '';
			}
		} else {
			if(colorCode == 1){
				return 'color-orange';
			} else if(colorCode == 2){
				return 'color-blue';
			} else if(colorCode == 3){
				return 'color-green';
			} else {
				return '';
			}
		}
	}
	
	this.setDefaultValuesSandboxField = function(character, text){
		var $characterField = $('#sandbox-character-field');
		var $textField = $('#sandbox-text-field');
		
		$characterField.val(character).trigger('keyup');
		$textField.val(text).trigger('keyup');
	}
	
	this.renderSandboxImageOnBrowser = function(characterFieldId, textFieldId, previewFieldId, callback){
		var $characterField = $('#' + characterFieldId);
		var $textField = $('#' + textFieldId);
		var $previewField = $('#' + previewFieldId);
		
		var filename = ( $characterField.val() + '-' + $textField.val() ).replace(/\n/g, ' ');
		
		html2canvas($previewField, {
			'onrendered': function(canvas) {
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
	
	this.getTitle = function(){
		if( this.checkOnElectron() ){
			var ipc = require('electron').ipcRenderer;
			return ipc.sendSync('getTitle');
		} else {
			return $('title').html();
		}
	}
	
	this.setTitle = function(title){
		if( this.checkOnElectron() ){
			var ipc = require('electron').ipcRenderer;
			ipc.send('setTitle', title);
		} else {
			$('title').html(title);
		}
	}
	
	this.reloadMainWindowOnElectron = function(){
		if( this.checkOnElectron() ){
			var ipc = require('electron').ipcRenderer;
			return ipc.send('reloadMainWindow');
		}
	}
	
	this.removeTitleAttributeOnElectron = function(){
		if( this.checkOnElectron() ){
			var $title = $('title');
			var title = $title.html();
			
			$title.remove();
			this.setTitle(title);
		}
	}
	
	this.closeAboutWindowOnEscEvent = function(){
		if( this.checkOnElectron() ){
			document.addEventListener('keydown', function(e){
				if(e.which == 27){
					var ipc = require('electron').ipcRenderer;
					ipc.send('closeAboutWindow');
				}
			});
		}
	}
	
	this.renderPreviewImageOnBrowser = function(button){
		var $button = $(button);
		var $tdPreviewConteiners = $button.closest('td.preview-conteiners');
		var $previewField = $tdPreviewConteiners.children('div.dialog-preview');
		var $btnGroup = $previewField.children('div.btn-group');
		var $td = $button.closest('td.preview-conteiners');
		
		var previewFieldId = $previewField.attr('id');
		var filename = 'preview-' + previewFieldId;
		
		$btnGroup.hide();
		html2canvas($td, {
			'onrendered': function(canvas) {
				var width = 320, height = 104;
				var ctx = canvas.getContext('2d');
				var imageData = ctx.getImageData(7, 2, width, height);
				
				canvas.width = width;
				canvas.height = height;
				ctx.putImageData(imageData, 0, 0);
				
				var a = document.createElement('a');
				a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
				a.download = filename + '.png';
				var $a = $(a);
				$('body').append($a);
				a.click();
				$a.remove();
				
				$btnGroup.show();
			}
		});
	}
	
	this.checkOnElectron = function(){
		return (typeof process == 'object');
	}
}

// Instantiating objct for class above
var aade = new aade();

// Disabling cache for all ajax requests
$.ajaxSetup ({
	cache: false
});
