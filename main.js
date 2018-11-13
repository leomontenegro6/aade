const electron = require('electron')
const fs = require('fs')
const scriptsFolder = './scripts/'

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const ipc = electron.ipcMain
const globalShortcut = electron.globalShortcut
const dialog = electron.dialog

const path = require('path')
const url = require('url')

// Keep a global reference of the variables below, if you don't, the app may
// be affected by javascript garbage collection routines
let mainWindow
let menu
let aboutWindow

app.showExitPrompt = false

function createWindow () {
	// Create windows
	mainWindow = new BrowserWindow({
		width: 1280,
		height: 768,
		minWidth: 1024,
		minHeight: 600,
		title: app.getName(),
		icon: __dirname + '/favicons/favicon-196x196.png',
	})

	// and load the index.html of the app.
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}))

	// Open the DevTools, and maximize window if needed
	//mainWindow.webContents.openDevTools()
	//mainWindow.maximize();
	
	// Injecting custom CSS for changing styles in electron
	mainWindow.webContents.on('did-finish-load', function() {
		fs.readFile(__dirname + '/css/css-electron.css', "utf-8", function(error, data) {
			if (!error){
				var formatedData = data.replace(/\s{2,10}/g, ' ').trim()
				mainWindow.webContents.insertCSS(formatedData)
			}
		})
	})
	
	// Emitted when the window is closing
	mainWindow.on('close', (e) => {
		if (app.showExitPrompt) {
			e.preventDefault() // Prevents the window from closing 
			showExitConfirmationDialog(function(response){
				if (response) { // Runs the following if 'Yes' is clicked
					app.showExitPrompt = false
					
					mainWindow.close()
				}
			})
		}
	});

	// Emitted when the window is closed.
	mainWindow.on('closed', (e) => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		aboutWindow = null
		mainWindow = null
	})

	// Instantiating menus
	const menuTemplate = [
		{
			id: 'file',
			label: 'Arquivo',
			submenu: [
				{
					id: 'newScript',
					label: 'Novo Script',
					accelerator: 'CmdOrCtrl+N',
					click () {
						if (app.showExitPrompt) {
							showExitConfirmationDialog(function(response){
								if (response) {
									app.showExitPrompt = false
									
									toggleScriptMenus(false)
									mainWindow.reload()
								}
							})
						} else {
							toggleScriptMenus(false)
							mainWindow.reload()
						}
					}
				},
				{
					id: 'saveScripts',
					label: 'Salvar Scripts',
					accelerator: 'CmdOrCtrl+S',
					enabled: false,
					click () {
						mainWindow.webContents.executeJavaScript("aade.saveScriptsOnElectron()")
					}
				},
				{
					id: 'exportScript',
					label: 'Exportar Scripts',
					accelerator: 'CmdOrCtrl+E',
					enabled: false,
					click () {
						mainWindow.webContents.executeJavaScript("aade.showScriptExportSettings()")
					}
				},
				{
					id: 'exit',
					label: 'Sair',
					role: 'close'
				}
			]
		},
		{
			id: 'edit',
			label: 'Editar',
			submenu: [
				{
					id: 'goto',
					label: 'Ir Para',
					accelerator: 'CmdOrCtrl+G',
					enabled: false,
					click () {
						mainWindow.webContents.executeJavaScript("aade.showGotoRowFilters()")
					}
				}
			]
		},
		{
			id: 'tools',
			label: 'Ferramentas',
			submenu: [
				{
					id: 'previewScripts',
					label: 'Gerar Prévia dos Scripts',
					accelerator: 'CmdOrCtrl+P',
					enabled: false,
					click () {
						mainWindow.webContents.executeJavaScript("aade.previewScripts()")
					}
				},
				{
					id: 'analyzeScript',
					label: 'Analisar Scripts',
					accelerator: 'CmdOrCtrl+Shift+A',
					enabled: false,
					click () {
						mainWindow.webContents.executeJavaScript("aade.showScriptAnalysisSettings()")
					}
				},
				{
					id: 'configSettings',
					label: 'Configurações',
					accelerator: 'CmdOrCtrl+Shift+C',
					click () {
						mainWindow.webContents.executeJavaScript("aade.showScriptConfigSettings()")
					}
				}
			]
		},
		{
			id: 'help',
			label: 'Ajuda',
			submenu: [
				{
					id: 'instructions',
					label: 'Instruções de Uso',
					accelerator: 'F1',
					click () {
						mainWindow.webContents.executeJavaScript("aade.showInstructions()")
					}
				},
				{
					id: 'about',
					label: 'Sobre',
					click () {
						// Creating about window, and setting it as child of main window
						aboutWindow = new BrowserWindow({
							width: 640,
							height: 384,
							title: 'Sobre o programa',
							parent: mainWindow,
							resizable: false,
							fullscreenable: false,
							minimizable: false,
							maximizable: false,
							center: true,
							modal: true
						})
						
						// Loading "about.html" inside the window
						aboutWindow.loadURL(url.format({
							pathname: path.join(__dirname, 'about.html'),
							protocol: 'file:',
							slashes: true
						}))
						
						// Open the DevTools for the about window.
						//aboutWindow.webContents.openDevTools()
						
						// Removing menubar from about window
						aboutWindow.setMenu(null)
					}
				}
			]
		}
	];
	menu = Menu.buildFromTemplate(menuTemplate)
	Menu.setApplicationMenu(menu)
}

function toggleScriptMenus(enabled=true){
	let saveScriptsMenu = menu.getMenuItemById('saveScripts')
	let exportScriptMenu = menu.getMenuItemById('exportScript')
	let gotoMenu = menu.getMenuItemById('goto')
	let previewScriptsMenu = menu.getMenuItemById('previewScripts')
	let analyzeScriptMenu = menu.getMenuItemById('analyzeScript')
	
	saveScriptsMenu.enabled = enabled
	exportScriptMenu.enabled = enabled
	gotoMenu.enabled = enabled
	previewScriptsMenu.enabled = enabled
	analyzeScriptMenu.enabled = enabled
	
	Menu.setApplicationMenu(menu)
}

function showExitConfirmationDialog(callback){
	return dialog.showMessageBox({
		type: 'question',
		buttons: ['Não', 'Sim'],
		title: 'Confirmação',
		message: 'Há um ou mais arquivos abertos no programa. Se prosseguir sem salvar, as alterações nos scripts serão perdidas.\nTem certeza que quer continuar?'
	}, function (response) {
		if(response === 0){
			response = false
		} else {
			response = true
		}
		if(callback) callback(response)
	})
}

function getScriptsListInFolder(){
	if (!fs.existsSync(scriptsFolder)){
		fs.mkdirSync(scriptsFolder);
	}
	
	return fs.readdirSync(scriptsFolder);
}

function getContentsOfScriptInFolder(filename, encoding='latin1'){
	return fs.readFileSync(scriptsFolder + filename, encoding);
}

function writeContentsOfScriptInFolder(filename, contents, encoding='latin1'){
	try{
		fs.writeFileSync(scriptsFolder + filename, contents, encoding);
		return true;
	} catch(e){
		return false;
	}
}

function registerMainTabsShortcuts(){
	globalShortcut.register('CmdOrCtrl+PageDown', () => {
		mainWindow.webContents.executeJavaScript("aade.switchMainTab(true)")
	})
	globalShortcut.register('CmdOrCtrl+PageUp', () => {
		mainWindow.webContents.executeJavaScript("aade.switchMainTab(false)")
	})
}

function registerScriptsTabsShortcuts(totalScriptsTabs){
	for(let i=1; i<=totalScriptsTabs; i++){
		globalShortcut.register('CmdOrCtrl+'+i, () => {
			mainWindow.webContents.executeJavaScript("aade.triggerClickOnScriptTabByNumber(" + i + ")")
		})
	}
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', function () {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow()
	}
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipc.on('getTitle', (e) => {
	e.returnValue = mainWindow.getTitle()
})
ipc.on('setTitle', (e, title) => {
	mainWindow.setTitle(title)
})
ipc.on('getScriptsListInFolder', (e) => {
	e.returnValue = getScriptsListInFolder();
})
ipc.on('getContentsOfScriptInFolder', (e, filename, encoding) => {
	e.returnValue = getContentsOfScriptInFolder(filename, encoding);
})
ipc.on('writeContentsOfScriptInFolder', (e, filename, contents, encoding) => {
	e.returnValue = writeContentsOfScriptInFolder(filename, contents, encoding);
})
ipc.on('registerMainTabsShortcuts', (e) => {
	registerMainTabsShortcuts();
})
ipc.on('registerScriptsTabsShortcuts', (e, totalScriptsTabs) => {
	registerScriptsTabsShortcuts(totalScriptsTabs);
})
ipc.on('activateScriptMenus', () => {
	toggleScriptMenus(true)
})
ipc.on('showExitPromptBeforeDiscard', () => {
	app.showExitPrompt = true
})
ipc.on('closeAboutWindow', () => {
	aboutWindow.close()
})