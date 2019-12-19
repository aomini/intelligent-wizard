#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const figlet = require('figlet');
const inquirer = require('inquirer');
const ejs = require('ejs')
const chalk = require('chalk')

inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'))
inquirer
.prompt([
	{
		name : 'file_name', "message" : "File name:"
	},
	{
		type: 'fuzzypath',
		name : 'file_location', 
		message: 'File location:',
		itemType: 'directory',
      	rootPath: 'views',
      	default: 'views',
      	suggestOnly: false,
      	depthLimit: 5,
	},
	{
		name : 'file_ext', default: '.blade.php', message : 'Wizard file extension:'
	},
	{
		name : 'wizard_id', message : 'Wizard id:',default: 'formWizard', validate: function(input){
			if(!input){ // check for spaces
				console.log(`/n Wizard id resolved to formWizard`)
			}
			return true;
		}
	},
	{
		name:'steps', message : 'How many steps wizard do you need? :'
	},
	{
		name : 'init', type: 'confirm', message: 'Do you want to Initialize?', 
	}
])
.then(answers => {
	console.log(chalk.blue.bold("Setting up wizard files..."))
	let {wizard_id, file_name, file_location, file_ext, init, steps} = answers;
	console.log(answers)
	createWizardFile(wizard_id, file_location,file_name+file_ext, steps)
	console.log(
	    chalk.green(
	      figlet.textSync("Completed", {
	        horizontalLayout: "default",
	        verticalLayout: "default"
	      })
	    )
  	);
});	
 
 const createWizardFile = (wizard, target, filename) => { 	
 	console.log(filename)
 	fs.writeFileSync(path.join(target, filename), templateWithInputs(wizard), {encoded : 'utf-8'});
 }

 const templateWithInputs = (wizard, steps = 3) => {
 	const template = fs.readFileSync(path.join('template/wizard-template.html')).toString();
 	const data = {
 		wizard,
 		steps
 	}
 	return ejs.render(template, data)
 }
