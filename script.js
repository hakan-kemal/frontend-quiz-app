const htmlQuizBtn = document.getElementById('html-quiz-btn');
const cssQuizBtn = document.getElementById('css-quiz-btn');
const jsQuizBtn = document.getElementById('js-quiz-btn');
const a11yQuizBtn = document.getElementById('a11y-quiz-btn');

const questionNumber = document.getElementById('question-number');
const quizQuestion = document.getElementById('quiz-question');
const quizCategoryIcon = document.getElementById('quiz-category-icon');
const quizCategory = document.getElementById('quiz-category');

const answerABtn = document.getElementById('answer-a');
const answerBBtn = document.getElementById('answer-b');
const answerCBtn = document.getElementById('answer-c');
const answerDBtn = document.getElementById('answer-d');

const submitAnswerBtn = document.getElementById('submit-answer');
const progressBar = document.getElementById('progress');

let quizData = null;

const fetchQuizData = async (quizTitle) => {
  try {
    const response = await fetch('data.json');
    const data = await response.json();

    const quiz = data.quizzes.filter((q) => q.title === quizTitle);
    quizData = quiz.length > 0 ? quiz[0] : null;

    questionNumber.textContent = quizData ? 1 : 0;
    quizQuestion.textContent = quizData
      ? quizData.questions[0].question
      : 'Quiz not found.';

    quizCategoryIcon.src = quizData
      ? `./assets/images/icon-${quizData.title.toLowerCase()}.svg`
      : '';
    quizCategory.textContent = quizData ? quizData.title : '';

    const answerBtns = [answerABtn, answerBBtn, answerCBtn, answerDBtn];
    answerBtns.forEach((btn, index) => {
      btn.textContent = quizData?.questions[0].options[index] ?? '';
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
  }
};

htmlQuizBtn.addEventListener('click', () => fetchQuizData('HTML'));
cssQuizBtn.addEventListener('click', () => fetchQuizData('CSS'));
jsQuizBtn.addEventListener('click', () => fetchQuizData('JavaScript'));
a11yQuizBtn.addEventListener('click', () => fetchQuizData('Accessibility'));
