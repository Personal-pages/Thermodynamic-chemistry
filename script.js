
// Fetch questions from external file
fetch('questions.json')
    .then(response => response.json())
    .then(data => initializeQuiz(data));

let currentPage = 0;
let questionsPerPage = 10;
let score = 0;
let attempted = 0;
let startTime = new Date();
let questions = [];

function initializeQuiz(data) {
    questions = data;
    renderPage();
}

function renderPage() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = "";

    const start = currentPage * questionsPerPage;
    const end = start + questionsPerPage;

    const currentQuestions = questions.slice(start, end);

    currentQuestions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question-container');

        const questionTitle = document.createElement('div');
        questionTitle.classList.add('question');
        questionTitle.textContent = `${start + index + 1}. ${q.question}`;
        questionDiv.appendChild(questionTitle);

        const optionsDiv = document.createElement('div');
        optionsDiv.classList.add('options');

        q.options.forEach((option, i) => {
            const optionButton = document.createElement('button');
            optionButton.classList.add('option');
            optionButton.textContent = option;
            optionButton.onclick = () => handleAnswer(start + index, i, optionButton);
            optionsDiv.appendChild(optionButton);
        });

        questionDiv.appendChild(optionsDiv);
        quizContainer.appendChild(questionDiv);
    });

    document.getElementById('prev-btn').style.display = currentPage === 0 ? 'none' : 'inline-block';
    document.getElementById('next-btn').style.display = end >= questions.length ? 'none' : 'inline-block';
}

function handleAnswer(questionIndex, selectedOption, button) {
    const question = questions[questionIndex];
    attempted++;

    if (selectedOption === question.correct) {
        button.classList.add('correct');
        score += 4;
    } else {
        button.classList.add('incorrect');
        const options = button.parentElement.children;
        options[question.correct].classList.add('correct');
        score -= 1;
    }

    // Disable all options for the current question
    const options = button.parentElement.children;
    for (let opt of options) {
        opt.disabled = true;
    }
}

function calculateScore() {
    const endTime = new Date();
    const totalTime = Math.floor((endTime - startTime) / 1000); // in seconds
    const avgTimePerQuestion = (totalTime / attempted).toFixed(2);

    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h3>Result Analysis</h3>
        <p>Total Questions: ${questions.length}</p>
        <p>Attempted Questions: ${attempted}</p>
        <p>Correct Answers: ${(score / 4)}</p>
        <p>Incorrect Answers: ${(attempted - (score / 4))}</p>
        <p>Total Score: ${score}</p>
        <p>Total Time: ${totalTime} seconds</p>
        <p>Average Time per Question: ${avgTimePerQuestion} seconds</p>
    `;
}

function nextPage() {
    currentPage++;
    renderPage();
}

function prevPage() {
    currentPage--;
    renderPage();
}
