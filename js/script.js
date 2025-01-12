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
    let translateCounter = 0; // Counter for translate button usage
    let hasRetried = false; // Track if the retry button has been used
    let totalQuestions = 0; // Track the total number of questions attempted

    // Start button click handler
    startButton.addEventListener("click", () => {
        const language = document.getElementById("language").value;
        const category = document.getElementById("category").value;
        const mainQuestionsPath = `resources/questions/translations/${category}/de.json`;
        const translatedQuestionsPath = `resources/questions/translations/${category}/${language}.json`;
        const answersPath = `resources/questions/answers/${category}.json`;

        Promise.all([
            fetch(answersPath).then(response => response.json()),
            fetch(translatedQuestionsPath).then(response => response.json()),
            fetch(mainQuestionsPath).then(response => response.json())
        ]).then(([answersData, translatedQuestionsData, questionsData]) => {
            answers = answersData;
            translatedQuestions = translatedQuestionsData;
            questions = questionsData;
            totalQuestions = Object.keys(questions).length; // Set total questions for the initial try
            loadQuestions(questions, answers, translatedQuestions);
            document.getElementById("selection-section").style.display = "none";
            questionsSection.style.display = "block";
        }).catch(error => {
            console.error('Error loading data:', error);
        });
    });

    // Load all questions dynamically
    const loadQuestions = (questions, answers, translatedQuestions) => {
        questionsContainer.innerHTML = ""; // Clear existing questions
        let index = 0;
        for (const [q_id, question_object] of Object.entries(questions)) {
            const questionDiv = document.createElement("div");
            questionDiv.className = "question";
            questionDiv.innerHTML = `
                <div class="question">
                    <h3>Question ${index + 1}</h3>
                    <p class="original-question">${question_object.question}</p>
                    ${answers[q_id].image_source ? `<img src="images/${answers[q_id].image_source}" alt="Question Image">` : ""}
                    <div class="options">
                        ${question_object.options.map(
                            (option, i) =>
                                `<button class="option-button" data-correct="${answers[q_id]?.correct}" data-qid="${q_id}" data-index="${i}">${option}</button></br>`
                        ).join("")}
                    </div>
                    <button class="translate-button" data-qid="${q_id}"><i class="fas fa-language"></i> Translate</button>
                    <div class="translated-content">
                        <p class="translated-question"></p>
                        <div class="translated-options"></div>
                    </div>
                    <p class="correctness-feedback" style="display:none;"></p>
                    <p class="feedback" style="display:none;"></p>
                </div>
            `;
            questionsContainer.appendChild(questionDiv);
            index += 1;
        }

        attachOptionListeners();
        attachTranslateListeners(translatedQuestions);
    };

    // Attach event listeners to options
    const attachOptionListeners = () => {
        const optionButtons = document.querySelectorAll(".option-button");
        optionButtons.forEach((button) => {
            button.addEventListener("click", (e) => {
                const correct = button.dataset.correct === button.dataset.index;
                const questionDiv = button.closest(".question");
                const feedback = questionDiv.querySelector(".feedback");
                const correctnessFeedback = questionDiv.querySelector(".correctness-feedback");

                // Disable all options for this question
                const options = questionDiv.querySelectorAll(".option-button");
                options.forEach((btn) => (btn.disabled = true));

                // Mark the selected option as correct or incorrect
                if (correct) {
                    button.classList.add("correct");
                    correctnessFeedback.textContent = "Correct!";
                    correctnessFeedback.classList.add("correct");
                    correctAnswers++;
                } else {
                    button.classList.add("incorrect");
                    correctnessFeedback.textContent = `Incorrect. Correct option is ${Number(button.dataset.correct) + 1}`;
                    correctnessFeedback.classList.add("incorrect");
                    // Add the question to missedQuestions if it hasn't been added yet
                    const qid = button.dataset.qid;
                    if (!missedQuestions.some(question => question.qid === qid)) {
                        missedQuestions.push({ qid, question: questions[qid] });
                    }
                }

                // Show the correctness feedback
                correctnessFeedback.style.display = "block";
            });
        });

        viewResultsButton.style.display = "block";
        viewResultsButton.addEventListener("click", () => showResults(totalQuestions));
    };

    // Attach event listeners to translate buttons
    const attachTranslateListeners = (translatedQuestions) => {
        const translateButtons = document.querySelectorAll(".translate-button");
        translateButtons.forEach((button) => {
            button.addEventListener("click", (e) => {
                const qid = button.dataset.qid;
                const translatedContent = button.nextElementSibling;

                // Toggle visibility of the translated content
                translatedContent.classList.toggle("visible");

                // If the content is visible, populate it with the translated question and options
                if (translatedContent.classList.contains("visible")) {
                    translateCounter += 1;
                    const translatedQuestionElement = translatedContent.querySelector(".translated-question");
                    const translatedOptionsElement = translatedContent.querySelector(".translated-options");
                    const translatedQuestion = translatedQuestions[qid]?.question;
                    const translatedOptions = translatedQuestions[qid]?.options;

                    if (translatedQuestion && translatedOptions) {
                        translatedQuestionElement.innerHTML = translatedQuestion;
                        translatedOptionsElement.innerHTML = translatedOptions
                            .map(
                                (option, i) =>
                                    `<p>${option}</p>`
                            )
                            .join("");
                    } else {
                        translatedQuestionElement.innerHTML = "Translation not available.";
                        translatedOptionsElement.innerHTML = "";
                    }
                }
            });
        });
    };

    // Show results
    const showResults = (totalQuestions) => {
        questionsSection.style.display = "none";
        resultsSection.style.display = "block";
        scoreElement.textContent = `You answered ${correctAnswers} out of ${totalQuestions} questions correctly.`;
        scoreElement.innerHTML += `<br>You used the Translate feature ${translateCounter} times.`; // Display translate counter

        // Show the retry button only if there are missed questions and it hasn't been used yet
        retryButton.style.display = missedQuestions.length > 0 && !hasRetried ? "inline-block" : "none";

        retryButton.addEventListener("click", () => {
            // Convert missedQuestions array back into an object for loadQuestions
            const retryQuestionsObject = missedQuestions.reduce((acc, question) => {
                acc[question.qid] = question.question;
                return acc;
            }, {});

            // Update totalQuestions to the number of missed questions
            totalQuestions = missedQuestions.length;

            // Load the missed questions
            loadQuestions(retryQuestionsObject, answers, translatedQuestions);
            resultsSection.style.display = "none";
            questionsSection.style.display = "block";
            // correctAnswers = 0; // Reset correct answers for the retry session
            hasRetried = true; // Mark the retry button as used
            retryButton.style.display = "none"; // Hide the retry button after use
        });

        startOverButton.addEventListener("click", () => {
            location.reload();
        });
    };
});