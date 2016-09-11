/// <reference path="jquery.d.ts" />
var CountingTrainer = (function () {
    function CountingTrainer(startLength) {
        this.currentLength = startLength;
    }
    CountingTrainer.prototype.begin = function () {
        this.currentTrainingData = new RandomNumber(this.currentLength);
        return this.currentTrainingData;
    };
    CountingTrainer.prototype.checkAnswer = function (answer) {
        return this.currentTrainingData.validate(answer);
    };
    CountingTrainer.prototype.next = function (answer) {
        if (this.checkAnswer(answer)) {
            this.currentLength = this.currentLength + 1;
            return this.begin();
        }
        else {
            if (this.currentLength == 1) {
                return this.begin();
            }
            else {
                this.currentLength = this.currentLength - 1;
                return this.begin();
            }
        }
    };
    return CountingTrainer;
}());
var RandomNumber = (function () {
    function RandomNumber(length) {
        this.endNum = 0;
        this.startNum = Math.pow(10, length - 1);
        for (var i = 0; i < length; i++) {
            this.endNum = this.endNum * 10 + 9;
        }
        this.first = this.randomNumberUptoMax();
        this.second = this.randomNumberUptoMax();
    }
    RandomNumber.prototype.randomNumberUptoMax = function () {
        return Math.floor(Math.random() * (this.endNum - this.startNum + 1)
            + this.startNum);
    };
    RandomNumber.prototype.validate = function (answer) {
        if (answer == (this.first + this.second)) {
            return true;
        }
        return false;
    };
    return RandomNumber;
}());
$(document).ready(function () {
    var trainer = new CountingTrainer(1);
    var rData = trainer.begin();
    var intervalID;
    function load(rData, first) {
        if (!first) {
            window.clearInterval(intervalID);
        }
        $("#first").text(rData.first);
        $("#second").text(rData.second);
        $("#answer").val("");
        intervalID = setInterval(intervalNext, 10000);
    }
    function showSuccess(message) {
        $("#message").removeClass("text-warning").addClass("text-success");
        $("#message").text(message);
    }
    function showWarning(message) {
        $("#message").removeClass("text-success");
        $("#message").addClass("text-warning");
        $("#message").text(message);
    }
    function showMessage(answer) {
        if (trainer.checkAnswer(answer)) {
            showSuccess("Your answer is correct! Try the next one.");
        }
        else {
            showWarning("Wrong answer. Try again.");
        }
    }
    function intervalNext() {
        showWarning("Your time to answer is up. Values have changed.");
        next(true);
    }
    load(rData, true);
    function next(intervalClear) {
        var rD;
        var answer = $("#answer").val();
        if (answer == "") {
            rD = trainer.next(-1);
        }
        else {
            if (!intervalClear) {
                showMessage(answer);
            }
            rD = trainer.next(answer);
        }
        load(rD, false);
    }
    $("#next").click(function () { next(false); });
    $("#answer").keypress(function (e) {
        if (e.which == 13) {
            next(false);
        }
    });
});
