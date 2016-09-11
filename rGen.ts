/// <reference path="jquery.d.ts" />

class CountingTrainer {
    currentLength: number;
    currentTrainingData: RandomNumber;
    constructor(startLength: number) {
        this.currentLength = startLength;
    }

    begin() {
        this.currentTrainingData = new RandomNumber(this.currentLength);
        return this.currentTrainingData;
    }

    checkAnswer(answer: number) {
        return this.currentTrainingData.validate(answer);
    }

    next(answer: number) {
        if(this.checkAnswer(answer)) {
            this.currentLength = this.currentLength + 1;
            return this.begin();
        } else {
            if(this.currentLength == 1) {
                return this.begin();
            } else {
                this.currentLength = this.currentLength - 1;
                return this.begin();
            }
        }
    }
}

class RandomNumber {
    first: number;
    second: number;
    endNum: number;
    startNum: number;
    
    constructor(length: number) {
        this.endNum = 0;
        this.startNum = Math.pow(10, length - 1);

        for(var i = 0; i < length; i++) {
            this.endNum = this.endNum*10 + 9;
        }

        this.first = this.randomNumberUptoMax();
        this.second = this.randomNumberUptoMax();
    }

    randomNumberUptoMax() {
        return Math.floor(Math.random() * (
            this.endNum - this.startNum+1)
                          + this.startNum);
    }

    validate(answer: number) {
        if(answer == (this.first+this.second)) {
            return true;
        }
        return false;
    }
}

$(document).ready(function() {
    var trainer = new CountingTrainer(1);
    var rData = trainer.begin();
    var intervalID;
    
    function load(rData: RandomNumber, first: boolean) {
        if(!first) {
            window.clearInterval(intervalID);
        }
        $("#first").text(rData.first);
        $("#second").text(rData.second);
        $("#answer").val("");
        intervalID = setInterval(intervalNext, 15000);
    }

    function showSuccess(message: string) {
        $("#message").removeClass("text-warning").addClass("text-success");
        $("#message").text(message);
    }

    function showWarning(message: string) {
        $("#message").removeClass("text-success");
        $("#message").addClass("text-warning");
        $("#message").text(message);
    }

    function showMessage(answer: number) {
        if(trainer.checkAnswer(answer)) {
            if(trainer.currentLength == 7) {
                showSuccess("Success! You are able to add up to 7 digits in 15 seconds!");
            } else {
                showSuccess("Your answer is correct! Try the next one.");
            }
        } else {
            showWarning("Wrong answer. Try again.");
        }
    }

    function intervalNext() {
        showWarning("Your time to answer is up. Values have changed.");
        next(true);
    }

    load(rData, true);
    function next(intervalClear: boolean) {
        var rD;
        var answer = $("#answer").val();
        
        if(answer == "") {
            rD = trainer.next(-1);
        } else {
            if(!intervalClear) {
                showMessage(answer);
            }
            rD = trainer.next(answer);
        }
        
        load(rD, false);
    }
    $("#next").click(function() { next(false); });

    $("#answer").keypress(function (e) {
        if (e.which == 13) {
            next(false);
        }
    });

});
