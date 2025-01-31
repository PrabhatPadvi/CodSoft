const quizContainer = document.getElementById("quiz");
const questionEl = document.getElementById("question");
const optionA = document.getElementById("optionA");
const optionB = document.getElementById("optionB");
const optionC = document.getElementById("optionC");
const optionD = document.getElementById("optionD");
const answerEls = document.querySelectorAll(".answer");
const submitBtn = document.getElementById("submit");


const addQuestionBtn = document.getElementById("add-question-btn");
const newQuestionForm = document.getElementById("new-question-form");
const deleteContainer = document.getElementById("delete-questions-container");
const manageQuestionsBtn = document.getElementById("manage-questions-btn");


let questions = JSON.parse(localStorage.getItem("questions")) || [
    {
        question: "Which of the following is the correct HTML5 doctype declaration?",
        a: "<DOCTYPE html >",
        b: "<!DOCTYPE HTML5>",
        c: "<!DOCTYPE html>",
        d: "<doctype html>",
        correct: "c"
    },
    {
        question: "Which HTML tag is used to define an internal style sheet?",
        a: "<script>",
        b: "<style>",
        c: "<css>",
        d: "<link>",
        correct: "b"
    },
    {
        question: "Which property is used to change the text color of an element?",
        a: "color",
        b: "text-color",
        c: "font-color",
        d: "background-color",
        correct: "a"
    }
];


let currentQuiz = 0;
let score = 0;


function saveQuestions() {
    localStorage.setItem("questions", JSON.stringify(questions));
}


function loadQuiz() {
    if (questions.length === 0) {
        quizContainer.innerHTML = `<h2>No questions available. Please add new questions.</h2>`;
        return;
    }
    deselectAnswers();
    const currentQuizData = questions[currentQuiz];
    displayQuestion(currentQuizData);
}

function displayQuestion(questionData) {
    questionEl.innerText = questionData.question;
    optionA.innerText = questionData.a;
    optionB.innerText = questionData.b;
    optionC.innerText = questionData.c;
    optionD.innerText = questionData.d;
}


function deselectAnswers() {
    answerEls.forEach(answerEl => (answerEl.checked = false));
}


function getSelected() {
    let answer;
    answerEls.forEach(answerEl => {
        if (answerEl.checked) {
            answer = answerEl.id;
        }
    });
    return answer;
}


submitBtn.addEventListener("click", () => {
    const answer = getSelected();
    if (answer) {
        if (answer === questions[currentQuiz].correct) {
            score++;
        }
        currentQuiz++;
        if (currentQuiz < questions.length) {
            loadQuiz();
        } else {
            showScore();
        }
    }
});


function showScore() {
    quizContainer.innerHTML = `
        <h2>You answered ${score}/${questions.length} questions correctly</h2>
        <button onclick="location.reload()">Try Again</button>
    `;
}


addQuestionBtn.addEventListener("click", () => {
    newQuestionForm.classList.toggle("hidden");
});


document.getElementById("submit-new-question").addEventListener("click", () => {
    const newQuestion = getNewQuestionDetails();
    if (newQuestion) {
        questions.push(newQuestion);
        saveQuestions();
        alert("Question added successfully!");
        newQuestionForm.classList.add("hidden");
        loadQuiz();
        loadDeleteOptions();
    }
});


function getNewQuestionDetails() {
    const newQuestion = document.getElementById("new-question").value.trim();
    const newOptionA = document.getElementById("new-optionA").value.trim();
    const newOptionB = document.getElementById("new-optionB").value.trim();
    const newOptionC = document.getElementById("new-optionC").value.trim();
    const newOptionD = document.getElementById("new-optionD").value.trim();
    const newCorrect = document.getElementById("new-correct").value.trim();

    if (!newQuestion || !newOptionA || !newOptionB || !newOptionC || !newOptionD || !newCorrect) {
        alert("Please fill in all fields.");
        return null;
    }

    if (!["a", "b", "c", "d"].includes(newCorrect)) {
        alert("Correct answer must be 'a', 'b', 'c', or 'd'.");
        return null;
    }

    return {
        question: newQuestion,
        a: newOptionA,
        b: newOptionB,
        c: newOptionC,
        d: newOptionD,
        correct: newCorrect
    };
}


manageQuestionsBtn.addEventListener("click", () => {
    deleteContainer.classList.toggle("hidden");
    loadDeleteOptions();
});


function loadDeleteOptions() {
    deleteContainer.innerHTML = "";
    if (questions.length === 0) {
        deleteContainer.innerHTML = `<p>No questions available to delete.</p>`;
        return;
    }

    questions.forEach((q, index) => {
        createDeleteButton(q, index);
    });
}


function createDeleteButton(question, index) {
    const questionItem = document.createElement("div");
    questionItem.innerHTML = `
        <p>${index + 1}. ${question.question} <button class="delete-btn" data-index="${index}">Delete</button></p>
    `;
    deleteContainer.appendChild(questionItem);

    
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            deleteQuestion(index);
        });
    });
}


function deleteQuestion(index) {
    if (confirm("Are you sure you want to delete this question?")) {
        questions.splice(index, 1);
        saveQuestions();
        loadQuiz();
        loadDeleteOptions();
        alert("Question deleted successfully!");
    }
}


loadQuiz();
loadDeleteOptions();
