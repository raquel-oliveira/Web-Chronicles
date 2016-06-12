
function step(data){
    var stp;
    switch(data.type){
        case "riddle":
            stp = new riddle(data);
    }
    return stp;
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
