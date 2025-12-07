const htmlQuizBtn = document.getElementById('html-quiz-btn');
const cssQuizBtn = document.getElementById('css-quiz-btn');
const jsQuizBtn = document.getElementById('js-quiz-btn');
const a11yQuizBtn = document.getElementById('a11y-quiz-btn');

const fetchQuizData = async (quizCategory) => {
  try {
    const response = await fetch('data.json');
    const data = await response.json();

    const quiz = data.quizzes.filter((q) => q.title === quizCategory);
    console.log(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
  }
};

htmlQuizBtn.addEventListener('click', () => fetchQuizData('HTML'));
cssQuizBtn.addEventListener('click', () => fetchQuizData('CSS'));
jsQuizBtn.addEventListener('click', () => fetchQuizData('JavaScript'));
a11yQuizBtn.addEventListener('click', () => fetchQuizData('Accessibility'));
