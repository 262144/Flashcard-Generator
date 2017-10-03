function ClozeCard(statement, cloze) {
	this.statement = statement;
	this.cloze = cloze;
}


ClozeCard.prototype.checkCloze = function() {
	//function that checks that the cloze is in the sentence
	if(this.statement.indexOf(this.cloze) === -1 ){
		//Go back to where the user inputs the cloze
		return(0);
	}else
	return(1);
};

ClozeCard.prototype.getClozeFront = function() {
	front = this.statement.replace(this.cloze, '\"...\"');
	return(front);
};

module.exports = ClozeCard;


