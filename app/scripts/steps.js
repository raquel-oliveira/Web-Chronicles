function step(data){
    var step;
    switch(data.type){
        case "riddle":
            step = new riddle(data);
    }
    return step;
}

function setTitleDescription(step, data){
    step.title = data.title;
    step.description = data.description;
}

function riddle(data){
    this.question = data.question;
    this.answer = data.hidden.answer;
    this.title = data.title;
    this.description = data.description;
    this.type = data.type;


    this.getHiddenStep = function(){
        return {
            question: this.question,
            title: this.title,
            description: this.description,
            type: data.type
        }
    };


}