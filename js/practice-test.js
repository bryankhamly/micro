// Practice Test JavaScript
let questionsData = null;
let selectedQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let testStarted = false;

// DOM Elements
const setupSection = document.getElementById('setup-section');
const testSection = document.getElementById('test-section');
const resultsSection = document.getElementById('results-section');
const questionSlider = document.getElementById('question-slider');
const sliderValue = document.getElementById('slider-value');
const availableQuestionsText = document.getElementById('available-questions');
const startBtn = document.getElementById('start-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const testAgainBtn = document.getElementById('test-again-btn');

// Load questions from JSON
async function loadQuestions() {
    try {
        const response = await fetch('js/questions.json');
        questionsData = await response.json();
        updateAvailableQuestions();
    } catch (error) {
        console.error('Error loading questions:', error);
        availableQuestionsText.textContent = 'Error loading questions. Please refresh the page.';
    }
}

// Get selected chapters
function getSelectedChapters() {
    const checkboxes = document.querySelectorAll('.chapter-checkbox input:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

// Count available questions for selected chapters
function countAvailableQuestions() {
    if (!questionsData) return 0;

    const selectedChapters = getSelectedChapters();
    let count = 0;

    selectedChapters.forEach(chapter => {
        if (questionsData.chapters[chapter]) {
            count += questionsData.chapters[chapter].questions.length;
        }
    });

    return count;
}

// Update available questions display
function updateAvailableQuestions() {
    const available = countAvailableQuestions();
    availableQuestionsText.textContent = `Available questions: ${available}`;

    // Update slider max if needed
    const currentMax = Math.min(100, available);
    questionSlider.max = currentMax;

    // Adjust slider value if it exceeds max
    if (parseInt(questionSlider.value) > currentMax) {
        questionSlider.value = currentMax;
        sliderValue.textContent = currentMax;
    }

    // Disable start button if no questions available
    startBtn.disabled = available === 0 || getSelectedChapters().length === 0;
}

// Shuffle array (Fisher-Yates)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Select random questions
function selectRandomQuestions(numQuestions) {
    const selectedChapters = getSelectedChapters();
    let allQuestions = [];

    selectedChapters.forEach(chapter => {
        if (questionsData.chapters[chapter]) {
            const chapterQuestions = questionsData.chapters[chapter].questions.map((q, index) => ({
                ...q,
                chapter: chapter,
                chapterName: questionsData.chapters[chapter].name,
                originalIndex: index
            }));
            allQuestions = allQuestions.concat(chapterQuestions);
        }
    });

    // Shuffle and select
    const shuffled = shuffleArray(allQuestions);
    return shuffled.slice(0, Math.min(numQuestions, shuffled.length));
}

// Start the test
function startTest() {
    const numQuestions = parseInt(questionSlider.value);
    selectedQuestions = selectRandomQuestions(numQuestions);

    if (selectedQuestions.length === 0) {
        alert('No questions available. Please select at least one chapter.');
        return;
    }

    // Shuffle options for each question
    selectedQuestions = selectedQuestions.map(q => {
        const options = q.options.map((opt, idx) => ({ text: opt, originalIndex: idx }));
        const shuffledOptions = shuffleArray(options);
        return {
            ...q,
            shuffledOptions: shuffledOptions,
            correctShuffledIndex: shuffledOptions.findIndex(opt => opt.originalIndex === q.answer)
        };
    });

    currentQuestionIndex = 0;
    userAnswers = new Array(selectedQuestions.length).fill(null);
    testStarted = true;

    setupSection.style.display = 'none';
    testSection.style.display = 'block';
    resultsSection.style.display = 'none';

    displayQuestion();
}

// Display current question
function displayQuestion() {
    const question = selectedQuestions[currentQuestionIndex];

    // Update progress
    const progress = ((currentQuestionIndex + 1) / selectedQuestions.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;

    // Update question info
    document.getElementById('question-number').textContent = `Question ${currentQuestionIndex + 1} of ${selectedQuestions.length}`;
    document.getElementById('chapter-tag').textContent = `Chapter ${question.chapter}: ${question.chapterName}`;

    // Update question text
    document.getElementById('question-text').textContent = question.question;

    // Update options
    const optionsList = document.getElementById('options-list');
    optionsList.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D'];
    question.shuffledOptions.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';

        // Check if this option was selected
        if (userAnswers[currentQuestionIndex] === index) {
            button.classList.add('selected');
        }

        button.innerHTML = `
            <span class="option-letter">${letters[index]}</span>
            <span class="option-text">${option.text}</span>
        `;

        button.addEventListener('click', () => selectOption(index));
        optionsList.appendChild(button);
    });

    // Update navigation buttons
    prevBtn.disabled = currentQuestionIndex === 0;

    if (currentQuestionIndex === selectedQuestions.length - 1) {
        nextBtn.textContent = 'Finish';
    } else {
        nextBtn.textContent = 'Next';
    }
}

// Select an option
function selectOption(index) {
    userAnswers[currentQuestionIndex] = index;

    // Update UI
    const options = document.querySelectorAll('.option-btn');
    options.forEach((opt, i) => {
        opt.classList.remove('selected');
        if (i === index) {
            opt.classList.add('selected');
        }
    });
}

// Go to previous question
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

// Go to next question or finish
function nextQuestion() {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        finishTest();
    }
}

// Finish the test and show results
function finishTest() {
    let correctCount = 0;

    selectedQuestions.forEach((question, index) => {
        if (userAnswers[index] === question.correctShuffledIndex) {
            correctCount++;
        }
    });

    const totalQuestions = selectedQuestions.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);

    // Update results display
    document.getElementById('results-score').textContent = `${percentage}%`;
    document.getElementById('results-details').textContent = `You answered ${correctCount} out of ${totalQuestions} questions correctly.`;
    document.getElementById('correct-count').textContent = correctCount;
    document.getElementById('incorrect-count').textContent = totalQuestions - correctCount;

    // Update icon and title based on score
    const resultsIcon = document.getElementById('results-icon');
    const resultsTitle = document.getElementById('results-title');

    if (percentage >= 90) {
        resultsIcon.textContent = '🏆';
        resultsTitle.textContent = 'Excellent!';
    } else if (percentage >= 80) {
        resultsIcon.textContent = '🎉';
        resultsTitle.textContent = 'Great Job!';
    } else if (percentage >= 70) {
        resultsIcon.textContent = '👍';
        resultsTitle.textContent = 'Good Work!';
    } else if (percentage >= 60) {
        resultsIcon.textContent = '📚';
        resultsTitle.textContent = 'Keep Studying!';
    } else {
        resultsIcon.textContent = '💪';
        resultsTitle.textContent = 'Don\'t Give Up!';
    }

    testSection.style.display = 'none';
    resultsSection.style.display = 'block';

    // Generate inline review
    generateReviewQuestions('all');
}

// Reset and go back to setup
function resetTest() {
    testStarted = false;
    selectedQuestions = [];
    currentQuestionIndex = 0;
    userAnswers = [];

    setupSection.style.display = 'block';
    testSection.style.display = 'none';
    resultsSection.style.display = 'none';
}

// Generate review questions HTML
function generateReviewQuestions(filter) {
    const reviewQuestionsContainer = document.getElementById('review-questions');
    reviewQuestionsContainer.innerHTML = '';

    selectedQuestions.forEach((question, index) => {
        const isCorrect = userAnswers[index] === question.correctShuffledIndex;
        const userAnswerIndex = userAnswers[index];
        const correctAnswerIndex = question.correctShuffledIndex;

        // Apply filter
        if (filter === 'correct' && !isCorrect) return;
        if (filter === 'incorrect' && isCorrect) return;

        const userAnswerText = userAnswerIndex !== null
            ? question.shuffledOptions[userAnswerIndex].text
            : 'No answer selected';
        const correctAnswerText = question.shuffledOptions[correctAnswerIndex].text;

        const questionDiv = document.createElement('div');
        questionDiv.className = `review-question ${isCorrect ? 'correct' : 'incorrect'}`;

        questionDiv.innerHTML = `
            <div class="review-question-header">
                <span class="review-question-number">Question ${index + 1}</span>
                <span class="review-question-chapter">Ch ${question.chapter}: ${question.chapterName}</span>
            </div>
            <div class="review-question-text">${question.question}</div>
            ${isCorrect ? `
                <div class="review-answer user-correct">
                    <svg class="review-answer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <span class="review-answer-label">Your Answer:</span>
                    <span class="review-answer-text">${userAnswerText}</span>
                </div>
            ` : `
                <div class="review-answer user-incorrect">
                    <svg class="review-answer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                    <span class="review-answer-label">Your Answer:</span>
                    <span class="review-answer-text">${userAnswerText}</span>
                </div>
                <div class="review-answer correct-answer">
                    <svg class="review-answer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <span class="review-answer-label">Correct Answer:</span>
                    <span class="review-answer-text">${correctAnswerText}</span>
                </div>
            `}
        `;

        reviewQuestionsContainer.appendChild(questionDiv);
    });

    // Show message if no questions match filter
    if (reviewQuestionsContainer.children.length === 0) {
        reviewQuestionsContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                No questions match this filter.
            </div>
        `;
    }
}

// Event Listeners
questionSlider.addEventListener('input', (e) => {
    sliderValue.textContent = e.target.value;
});

document.querySelectorAll('.chapter-checkbox input').forEach(checkbox => {
    checkbox.addEventListener('change', updateAvailableQuestions);
});

startBtn.addEventListener('click', startTest);
prevBtn.addEventListener('click', previousQuestion);
nextBtn.addEventListener('click', nextQuestion);
testAgainBtn.addEventListener('click', resetTest);

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        generateReviewQuestions(btn.dataset.filter);
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!testStarted) return;

    if (e.key === 'ArrowLeft' && currentQuestionIndex > 0) {
        previousQuestion();
    } else if (e.key === 'ArrowRight') {
        nextQuestion();
    } else if (e.key >= '1' && e.key <= '4') {
        const index = parseInt(e.key) - 1;
        if (index < selectedQuestions[currentQuestionIndex].shuffledOptions.length) {
            selectOption(index);
        }
    }
});

// Initialize
loadQuestions();
