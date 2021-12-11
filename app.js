const inquirer = require("inquirer");
const { writeFile, copyFile } = require("./utils/generate-site.js");
const generatePage = require("./src/page-template.js");

const promptUser = () => {
    return inquirer
    .prompt([
        {
            type: "input",
            name: "name",
            message: "What is your name?",
            validate: nameInput => {
                if (nameInput){
                    return true;
                } else {
                    console.log("Please enter your name!");
                    return false;
                }
            }
        },
        {
            type: "input",
            name: "github",
            message: "Enter your GitHub Username",
            validate: gitUsername => {
                if (gitUsername){
                    return true;
                } else {
                    console.log("Please enter your GitHub username!");
                    return false;
                }
            }
        },
        {
            type: "confirm",
            name: "confirmAbout",
            message: "Would you like to enter some information about yourself for an 'About' section?",
            default: true
        },
        {
            type: "input",
            name: "about",
            message: "Provide some information about yourself:",
            when: ({ confirmAbout }) => {
                if (confirmAbout) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    ]);
};

const promptProject = portfolioData => {
    // If there's no 'projects' array property, create one
    if (!portfolioData.projects){
        portfolioData.projects = [];
    }
    
    console.log(`
=================
Add a New Project
=================
    `);
    return inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the name of your project?",
            validate: projectName => {
                if (projectName){
                    return true;
                } else {
                    console.log("Please enter your Project name!");
                    return false;
                }
            }
        },
        {
            type: "input",
            name: "description",
            message: "Provide a description of the project (Required)",
            validate: projectDesc => {
                if (projectDesc){
                    return true;
                } else {
                    console.log("Please enter your Project description!");
                    return false;
                }
            }
        },
        {
            type: "checkbox",
            name: "languages",
            message: "What did you build this project with? (Check all that apply)",
            choices: ["JavaScript", "HTML", "CSS", "ES6", "jQuery", "Bootstrap", "Node"]
        },
        {
            type: "input",
            name: "link",
            message: "Enter the GitHub link to your project. (Required)",
            validate: gitLink => {
                if (gitLink){
                    return true;
                } else {
                    console.log("Please enter your Project's GitHub link!");
                    return false;
                }
            }
        },
        {
            type: "confirm",
            name: "feature",
            message: "Would you like to feature this project?",
            default: false
        },
        {
            type: "confirm",
            name: "confirmAddProject",
            message: "Would you like to enter another project?",
            default: false
        }
    ])
    .then(projectData => {
        portfolioData.projects.push(projectData);
        if (projectData.confirmAddProject) {
            return promptProject(portfolioData);
        } else {
            return portfolioData;
        }
    });
};

promptUser()
    .then(promptProject)
    .then(portfolioData => {
        return generatePage(portfolioData);
    })
    .then(pageHTML => {
        return writeFile(pageHTML);
    })
    .then(writeFileResponse => {
        console.log(writeFileResponse);
        return copyFile();
    })
    .then(copyFileResponse => {
        console.log(copyFileResponse);
    })
    .catch(err => {
        console.log(err);
    });