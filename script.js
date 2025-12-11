// DOM Elements
const subjectIcon = document.getElementById('subject-icon');
const subjectName = document.getElementById('subject-name');
const subjectContainer = document.getElementById('subject-container');
const sunIcon = document.getElementById('sun-icon');
const toggle = document.getElementById('toggle');
const moonIcon = document.getElementById('moon-icon');

// Screen Elements
const welcomeScreen = document.getElementById('welcome-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');

// Quiz Button Elements
const htmlQuizBtn = document.getElementById('html-quiz-btn');
const cssQuizBtn = document.getElementById('css-quiz-btn');
const jsQuizBtn = document.getElementById('js-quiz-btn');
const a11yQuizBtn = document.getElementById('a11y-quiz-btn');

// Quiz Elements
const questionNumber = document.getElementById('question-number');
const totalQuestionsEl = document.getElementById('total-questions');
const quizQuestion = document.getElementById('quiz-question');
const progressBar = document.getElementById('progress');
const errorMessage = document.getElementById('error-message');

// Answer Elements
const answerBtns = [
  document.getElementById('answer-a'),
  document.getElementById('answer-b'),
  document.getElementById('answer-c'),
  document.getElementById('answer-d'),
];
const submitAnswerBtn = document.getElementById('submit-answer');

// Results Elements
const resultsIcon = document.getElementById('results-icon');
const resultsSubject = document.getElementById('results-subject');
const finalScore = document.getElementById('final-score');
const resultsTotalEl = document.getElementById('results-total');
const playAgainBtn = document.getElementById('play-again-btn');

// Quiz State
let quizState = {
  currentQuiz: null,
  currentQuestionIndex: 0,
  score: 0,
  selectedAnswerIndex: null,
  answerSubmitted: false,
  quizData: null,
};

// Initialize app
const initApp = () => {
  toggleMode();
  showScreen('welcome');
  hideSubjectHeader();
};

// Theme Toggle
const toggleMode = () => {
  const mode = toggle.checked ? 'light' : 'dark';
  document.body.classList.toggle('dark-mode', toggle.checked);
  sunIcon.src = `./assets/images/icon-sun-${mode}.svg`;
  moonIcon.src = `./assets/images/icon-moon-${mode}.svg`;
};

// Screen Management
const showScreen = (screenName) => {
  welcomeScreen.classList.add('hidden');
  quizScreen.classList.add('hidden');
  resultsScreen.classList.add('hidden');

  switch (screenName) {
    case 'welcome':
      welcomeScreen.classList.remove('hidden');
      break;
    case 'quiz':
      quizScreen.classList.remove('hidden');
      break;
    case 'results':
      resultsScreen.classList.remove('hidden');
      break;
  }
};

// Subject Header Management
const hideSubjectHeader = () => {
  subjectContainer.classList.add('hidden');
};

const showSubjectHeader = (title, icon) => {
  subjectContainer.classList.remove('hidden');
  subjectIcon.src = icon;
  subjectName.textContent = title;

  // Set background color based on subject
  const bgColors = {
    HTML: 'var(--color-orange-50)',
    CSS: 'var(--color-green-100)',
    JavaScript: 'var(--color-blue-50)',
    Accessibility: 'var(--color-purple-100)',
  };
  subjectIcon.style.backgroundColor = bgColors[title] || '';
};

// Fetch and Start Quiz
const fetchQuizData = async (quizTitle) => {
  try {
    const response = await fetch('data.json');
    const data = await response.json();

    const quiz = data.quizzes.find((q) => q.title === quizTitle);

    if (!quiz) {
      throw new Error(`Quiz "${quizTitle}" not found`);
    }

    // Initialize quiz state
    quizState = {
      currentQuiz: quiz,
      currentQuestionIndex: 0,
      score: 0,
      selectedAnswerIndex: null,
      answerSubmitted: false,
      quizData: quiz,
    };

    // Show quiz screen and subject header
    showSubjectHeader(quiz.title, quiz.icon);
    showScreen('quiz');
    displayQuestion();
  } catch (error) {
    console.error('Error fetching quiz:', error);
    alert('Failed to load quiz. Please try again.');
  }
};

// Display Current Question
const displayQuestion = () => {
  const { currentQuiz, currentQuestionIndex } = quizState;
  const question = currentQuiz.questions[currentQuestionIndex];

  // Update question info
  questionNumber.textContent = currentQuestionIndex + 1;
  totalQuestionsEl.textContent = currentQuiz.questions.length;
  quizQuestion.textContent = question.question;

  // Update progress bar
  const progress =
    ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
  progressBar.value = progress;

  // Display answers
  answerBtns.forEach((btn, index) => {
    const answerText = btn.querySelector('.answer-text');
    answerText.textContent = question.options[index];
    btn.classList.remove('selected', 'correct', 'incorrect', 'disabled');
    btn.disabled = false;
  });

  // Reset state
  quizState.selectedAnswerIndex = null;
  quizState.answerSubmitted = false;
  errorMessage.classList.add('hidden');
  submitAnswerBtn.textContent = 'Submit Answer';
};

// Handle Answer Selection
const selectAnswer = (index) => {
  if (quizState.answerSubmitted) return;

  quizState.selectedAnswerIndex = index;
  errorMessage.classList.add('hidden');

  // Update UI
  answerBtns.forEach((btn, i) => {
    if (i === index) {
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
  });
};

// Submit Answer
const submitAnswer = () => {
  const {
    selectedAnswerIndex,
    answerSubmitted,
    currentQuiz,
    currentQuestionIndex,
  } = quizState;

  // If no answer selected, show error
  if (selectedAnswerIndex === null) {
    errorMessage.classList.remove('hidden');
    return;
  }

  // If already submitted, move to next question
  if (answerSubmitted) {
    moveToNextQuestion();
    return;
  }

  // Check answer
  const currentQuestion = currentQuiz.questions[currentQuestionIndex];
  const selectedAnswer = currentQuestion.options[selectedAnswerIndex];
  const correctAnswer = currentQuestion.answer;
  const correctIndex = currentQuestion.options.indexOf(correctAnswer);

  const isCorrect = selectedAnswer === correctAnswer;

  if (isCorrect) {
    quizState.score++;
  }

  // Show feedback
  answerBtns.forEach((btn, index) => {
    btn.disabled = true;
    btn.classList.add('disabled');

    if (index === correctIndex) {
      btn.classList.add('correct');
    }

    if (index === selectedAnswerIndex && !isCorrect) {
      btn.classList.add('incorrect');
    }
  });

  quizState.answerSubmitted = true;
  submitAnswerBtn.textContent = 'Next Question';
};

// Move to Next Question
const moveToNextQuestion = () => {
  const { currentQuiz, currentQuestionIndex } = quizState;

  if (currentQuestionIndex < currentQuiz.questions.length - 1) {
    quizState.currentQuestionIndex++;
    displayQuestion();
  } else {
    showResults();
  }
};

// Show Results
const showResults = () => {
  const { currentQuiz, score } = quizState;

  resultsIcon.src = currentQuiz.icon;
  resultsSubject.textContent = currentQuiz.title;
  finalScore.textContent = score;
  resultsTotalEl.textContent = currentQuiz.questions.length;

  // Set icon background color
  const bgColors = {
    HTML: 'var(--color-orange-50)',
    CSS: 'var(--color-green-100)',
    JavaScript: 'var(--color-blue-50)',
    Accessibility: 'var(--color-purple-100)',
  };
  resultsIcon.style.backgroundColor = bgColors[currentQuiz.title] || '';

  showScreen('results');
};

// Play Again
const playAgain = () => {
  hideSubjectHeader();
  showScreen('welcome');
  quizState = {
    currentQuiz: null,
    currentQuestionIndex: 0,
    score: 0,
    selectedAnswerIndex: null,
    answerSubmitted: false,
    quizData: null,
  };
};

// Event Listeners
toggle.addEventListener('click', toggleMode);
htmlQuizBtn.addEventListener('click', () => fetchQuizData('HTML'));
cssQuizBtn.addEventListener('click', () => fetchQuizData('CSS'));
jsQuizBtn.addEventListener('click', () => fetchQuizData('JavaScript'));
a11yQuizBtn.addEventListener('click', () => fetchQuizData('Accessibility'));

answerBtns.forEach((btn, index) => {
  btn.addEventListener('click', () => selectAnswer(index));
});

submitAnswerBtn.addEventListener('click', submitAnswer);
playAgainBtn.addEventListener('click', playAgain);

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
  // Answer selection with A, B, C, D keys
  if (
    !quizState.answerSubmitted &&
    quizScreen.classList.contains('hidden') === false
  ) {
    const keyMap = { a: 0, b: 1, c: 2, d: 3 };
    const index = keyMap[e.key.toLowerCase()];

    if (index !== undefined) {
      selectAnswer(index);
    }
  }

  // Submit with Enter key
  if (e.key === 'Enter' && !quizScreen.classList.contains('hidden')) {
    submitAnswer();
  }
});

// Initialize app
initApp();
