document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-button");
    const questionsSection = document.getElementById("questions-section");
    const questionsContainer = document.getElementById("questions-container");
    const resultsSection = document.getElementById("results-section");
    const viewResultsButton = document.getElementById("view-results");
    const retryButton = document.getElementById("retry-button");
    const startOverButton = document.getElementById("start-over-button");
    const scoreElement = document.getElementById("score");

    let questions = {};
    let translatedQuestions = {};
    let answers = {};
    let missedQuestions = [];
    let correctAnswers = 0;

    // Start button click handler
    startButton.addEventListener("click", () => {
        const language = document.getElementById("language").value;
        const category = document.getElementById("category").value;
        const mainQuestionsPath = `resources/questions/translations/${category}/de.json`;
        const translatedQuestionsPath = `resources/questions/translations/${category}/de.json`;
        const answersPath = `resources/questions/general.json`;

        fetch(answersPath)
        .then((response) => response.json()
        .then((data) => {
            answers = data
        }));

        fetch(translatedQuestions)
        .then((response) => response.json()
        .then((data)=> {
            translatedQuestions = data
        }))

        fetch(mainQuestionsPath)
            .then((response) => response.json())
            .then((data) => {
                questions = data
                loadQuestions(questions, answers, translatedQuestions);
                document.getElementById("selection-section").style.display = "none";
                questionsSection.style.display = "block";
            });
    });

    // Load all questions dynamically
    const loadQuestions = (questions, answers, translatedQuestions) => {
        questionsContainer.innerHTML = ""; // Clear existing questions
        var index = 0
        for (const [q_id, question_object] of Object.entries(questions)) {
            const questionDiv = document.createElement("div");
            questionDiv.className = "question";
            questionDiv.innerHTML = `
                <h3>Question ${index + 1} </h3>
                <p>${question_object.question}</p>
                ${
                    question_object.image
                        ? `<img src="images/${question_object.image}" alt="Question Image">`
                        : ""
                }
                <div class="options">
                    ${question_object.options
                        .map(
                            (option, i) =>
                                `<button class="option-button" data-correct="${answers[q_id].correct}" data-index="${i}">${option}</button></br>`
                        )
                        .join("")}
                </div>
                <p class="feedback" style="display:none;"></p>
            `;
            questionsContainer.appendChild(questionDiv);
            index+=1;
        }

        attachOptionListeners();
    };

    // Attach event listeners to options
    const attachOptionListeners = () => {
        const optionButtons = document.querySelectorAll(".option-button");
        optionButtons.forEach((button) => {
            button.addEventListener("click", (e) => {
                console.log(button)
                const correct = button.dataset.correct === button.dataset.index;
                const questionIndex = button.dataset.questionIndex;
                const feedback = button.parentElement.nextElementSibling;

                if (correct) {
                    button.style.backgroundColor = "green";
                    feedback.textContent = "Correct!";
                    correctAnswers++;
                } else {
                    button.style.backgroundColor = "red";
                    feedback.textContent = `Incorrect. Correct option is ${Number(button.dataset.correct)+1}`;
                    missedQuestions.push(questions[questionIndex]);
                }
                feedback.style.display = "block";

                // Disable all options for this question
                const options = button.parentElement.querySelectorAll(".option-button");
                options.forEach((btn) => (btn.disabled = true));
            });
        });

        viewResultsButton.style.display = "block";
        viewResultsButton.addEventListener("click", showResults);
    };

    // Show results
    const showResults = () => {
        questionsSection.style.display = "none";
        resultsSection.style.display = "block";
        scoreElement.textContent = `You answered ${correctAnswers} out of ${Object.keys(questions).length} questions correctly.`;
        retryButton.style.display = missedQuestions.length > 0 ? "block" : "none";

        retryButton.addEventListener("click", () => {
            loadQuestions(missedQuestions, document.getElementById("language").value);
            resultsSection.style.display = "none";
            questionsSection.style.display = "block";
            missedQuestions = [];
        });

        startOverButton.addEventListener("click", () => {
            location.reload();
        });
    };
});
