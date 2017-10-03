var inquirer = require('inquirer');
var BasicCard = require('./BasicCard');
var ClozeCard = require('./ClozeCard');
var cardFile = require('./cardFile');
var fs = require('fs');


function askWhatKind(mssg) {
	inquirer.prompt([
	{
		type: 'list',
		message: '------- ' + mssg + ' -------',
		choices: ['Make a basic card', 'Make a cloze card', 'Take a basic quiz', 'Take a cloze quiz', 'Take a mixed quiz', 'Quit'],
		name: 'choice'
	}
		]).then(function(inquireResponse){
			switchIt(inquireResponse.choice);
		});
} // end of askWhatKind()


function switchIt(choice){
	switch(choice){

	case 'Make a basic card':
	console.log('You chose ' + choice);
	makeBasicCard();
	break;

	case 'Make a cloze card':
	console.log('You chose ' + choice);
	makeClozeCard();
	break;

	case 'Take a basic quiz':
	console.log('You chose ' + choice);
	var basicIndex = 0;
	basicQuiz(basicIndex, 0, 0);
	break;

	case 'Take a cloze quiz':
	console.log('You chose ' + choice);
	var clozeIndex = 0;
	clozeQuiz(clozeIndex, 0, 0);
	break;

	case 'Take a mixed quiz':
	console.log('You chose ' + choice);
	var mixedIndex = 0;
	mixedQuiz(mixedIndex, 0, 0);
	break;

	case 'Quit':
	console.log('You chose to quit.  See you later, bub.');
	break;
	}
} // end of switchIt()


function makeBasicCard(){
	inquirer.prompt([ 
	{
		type: 'input',
		message: 'Enter a question for the card\'s front.',
		name: 'front'
	},
	{
		type: 'input',
		message: 'Enter the answer for the card\'s back.',
		name: 'back'
	}
	])
	.then(function(inquireResponse) {
		var front = inquireResponse.front;
		var back = inquireResponse.back;
		if(front.length<5 || back.length === 0){
			console.log('Your entry was invalid.  Try again.');
			makeBasicCard();
		}else{
		// console.log('the front looks like this: ' + front);
		// console.log('the back looks like this: ' + back);
		var basicCard = new BasicCard(front, back);
		appendCardFile('basic', basicCard.front, basicCard.back);
		}
	});
}


function makeClozeCard(){
	inquirer.prompt([ 
	{
		type: 'input',
		message: 'To make a cloze card, enter a statement or sentence:',
		name: 'statement'
	},
	{
		type: 'input',
		message: 'Enter the text to be removed.',
		name: 'cloze'
	}
	])
	.then(function(inquireResponse) {
		var statement = inquireResponse.statement;
		var cloze = inquireResponse.cloze;
		if(statement.length < 5 || cloze.length === 0){
			console.log('Your entry was invalid. Try again.');
			makeClozeCard();
		}else {
			var clozeCard = new ClozeCard(statement, cloze);
			if(clozeCard.checkCloze()){
				appendCardFile('cloze', clozeCard.getClozeFront(), clozeCard.cloze);
			}else{console.log('The cloze you entered does not occur exactly in the sentence. Try again, bub.');
			makeClozeCard();
			}
		}

	});
}


function appendCardFile (type, front, back) {
	var cardObject = {
		type: type,
		date: Date.now(),
		front: front,
		back: back
	}
	cardFile.push(cardObject);
	fs.writeFile('cardFile.json', JSON.stringify(cardFile, null, 2), function(err){
		if (err){
			console.log('The card file was not appended: ' + err);
		}else {
			askWhatKind('You\'ve successfully added a ' + type + ' card.  Now what would you like to do?');
		}
	});
}


function basicQuiz(basicIndex, rightAnswers, wrongAnswers){
	// for loop that goes through the cards
	if (basicIndex < cardFile.length) {
		if (cardFile[basicIndex].type === 'basic'){
			inquirer.prompt([
			{
				type: 'input',
				message: cardFile[basicIndex].front,
				name: 'answer'
			}
				]).then(function (inquireResponse){
					if(inquireResponse.answer.toLowerCase() === cardFile[basicIndex].back.toLowerCase()){
						rightAnswers++;
						console.log('That is correct! :).');
						console.log('Correct Answers: ' + rightAnswers + ' \ \ Incorrect Answers: ' + wrongAnswers);
						basicIndex++;
						basicQuiz(basicIndex, rightAnswers, wrongAnswers);
					} else{
						wrongAnswers++;
						console.log('Nope. :( The answer is ' + cardFile[basicIndex].back);
						console.log('Correct Answers: ' + rightAnswers + ' \ \ Incorrect Answers: ' + wrongAnswers);
						basicIndex++;
						basicQuiz(basicIndex, rightAnswers, wrongAnswers);
					}
				});
		} else{
			basicIndex++;
			basicQuiz(basicIndex, rightAnswers, wrongAnswers);
		}
	}else {
		askWhatKind('That\'s all the basic cards. Now what would you like to do?');
	}
} // end of basicQuiz()


function clozeQuiz(clozeIndex, rightAnswers, wrongAnswers){
	// for loop that goes through the cards
	if (clozeIndex < cardFile.length) {
		if (cardFile[clozeIndex].type === 'cloze'){
			inquirer.prompt([
			{
				type: 'input',
				message: cardFile[clozeIndex].front,
				name: 'answer'
			}
				]).then(function (inquireResponse){
					if(inquireResponse.answer.toLowerCase() === cardFile[clozeIndex].back.toLowerCase()){
						rightAnswers++;
						console.log('That is correct! :)');
						console.log('Correct Answers: ' + rightAnswers + ' \ \ Incorrect Answers: ' + wrongAnswers);
						clozeIndex++;
						clozeQuiz(clozeIndex, rightAnswers, wrongAnswers);
					} else{
						wrongAnswers++;
						console.log('Nope. :( The answer is ' + cardFile[clozeIndex].back);
						console.log('Correct Answers: ' + rightAnswers + ' \ \ Incorrect Answers: ' + wrongAnswers);
						clozeIndex++;
						clozeQuiz(clozeIndex, rightAnswers, wrongAnswers);
					}
				});
		} else{
			clozeIndex++;
			clozeQuiz(clozeIndex, rightAnswers, wrongAnswers);
		}
	}else {
		askWhatKind('That\'s all the cloze cards. Now what would you like to do?');
	}
} // end of clozeQuiz()


function mixedQuiz(mixedIndex, rightAnswers, wrongAnswers){
	if (mixedIndex < cardFile.length){
		inquirer.prompt([
		{
			type: 'input',
			message: cardFile[mixedIndex].front,
			name: 'answer'
		}]).then(function (inquireResponse){
			if(inquireResponse.answer.toLowerCase() === cardFile[mixedIndex].back.toLowerCase()){
				rightAnswers++;
				console.log('That is correct! :)');
				console.log('Correct Answers: ' + rightAnswers + ' \ \ Incorrect Answers: ' + wrongAnswers);
				mixedIndex++;
				mixedQuiz(mixedIndex, rightAnswers, wrongAnswers);
			} else{
				wrongAnswers++;
				console.log('Nope. :( The answer is ' + cardFile[mixedIndex].back);
				console.log('Correct Answers: ' + rightAnswers + ' \ \ Incorrect Answers: ' + wrongAnswers);
				mixedIndex++;
				mixedQuiz(mixedIndex, rightAnswers, wrongAnswers);
			}
		});
	} else {
		askWhatKind('That\'s all the flash cards. Now what would you like to do?');
	}
} // end of mixedQuiz()


askWhatKind('Welcome to the FlashCard app.  What would you like to do?');
