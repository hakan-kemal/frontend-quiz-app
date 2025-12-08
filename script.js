const subjectIcon = document.getElementById('subject-icon');
const subjectName = document.getElementById('subject-name');
const sunIcon = document.getElementById('sun-icon');
const toggle = document.getElementById('toggle');
const moonIcon = document.getElementById('moon-icon');

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

const toggleMode = () => {
  const mode = toggle.checked ? 'light' : 'dark';

  document.body.classList.toggle('dark-mode', toggle.checked);
  sunIcon.src = `./assets/images/icon-sun-${mode}.svg`;
  moonIcon.src = `./assets/images/icon-moon-${mode}.svg`;
};

const toggleHeaderSubject = (token, force, subject) => {
  subjectIcon.classList.toggle(token, force);
  subjectName.classList.toggle(token, force);

  if (!subject) return;

  switch (subject.toLowerCase()) {
    case 'html':
      subjectIcon.style.backgroundColor = 'var(--color-orange-50)';
      break;
    case 'css':
      subjectIcon.style.backgroundColor = 'var(--color-green-100)';
      break;
    case 'javascript':
      subjectIcon.style.backgroundColor = 'var(--color-blue-50)';
      break;
    case 'accessibility':
      subjectIcon.style.backgroundColor = 'var(--color-purple-100)';
      break;
    default:
      break;
  }
};

const fetchQuizData = async (quizTitle) => {
  try {
    const response = await fetch('data.json');
    const data = await response.json();

    const quiz = data.quizzes.filter((q) => q.title === quizTitle);
    quizData = quiz.length > 0 ? quiz[0] : null;

    toggleHeaderSubject('hidden', false, quizData.title);
    subjectIcon.src = quizData ? quizData.icon : '';
    subjectName.textContent = quizData ? quizData.title : 'Quiz';

    questionNumber.textContent = quizData ? 1 : 0;
    quizQuestion.textContent = quizData
      ? quizData.questions[0].question
      : 'Quiz not found.';

    quizCategoryIcon.src = quizData ? quizData.icon : '';
    quizCategory.textContent = quizData ? quizData.title : '';

    const answerBtns = [answerABtn, answerBBtn, answerCBtn, answerDBtn];
    answerBtns.forEach((btn, index) => {
      btn.textContent = quizData?.questions[0].options[index] ?? '';
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
  }
};

const initQuizState = () => {
  toggleMode();
  toggleHeaderSubject('hidden', true);
};

toggle.addEventListener('click', () => toggleMode());
htmlQuizBtn.addEventListener('click', () => fetchQuizData('HTML'));
cssQuizBtn.addEventListener('click', () => fetchQuizData('CSS'));
jsQuizBtn.addEventListener('click', () => fetchQuizData('JavaScript'));
a11yQuizBtn.addEventListener('click', () => fetchQuizData('Accessibility'));

initQuizState();
