document.addEventListener("DOMContentLoaded", function () {
    const app = document.getElementById('app');
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let showQuiz = false;
    let showResult = false;
  
    fetch("https://opentdb.com/api.php?amount=10&category=19&type=multiple")
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        questions = data.results;
        render();
      })
      .catch(error => {
        console.error("There was a problem with the fetch operation:", error);
      });
  
    function render() {
      if (!showQuiz) {
        app.innerHTML = `
          <div id="home" class="container">
            <div class="card">
              <h1 class="font-bold text-3xl">Welcome to the Quiz!</h1>
              <div class="bar"></div>
              <button class="btn-start" onclick="startQuiz()">Start Quiz</button>
            </div>
          </div>
          <div id="about" class="container hidden">
            <div class="card">
              <h1 class="font-bold text-3xl">About Us</h1>
              <p>This is a quiz app created to test your knowledge.</p>
            </div>
          </div>
          <div id="contact" class="container hidden">
            <div class="card">
              <h1 class="font-bold text-3xl">Contact Us</h1>
              <p>For any inquiries, please contact us at: support@quizapp.com</p>
            </div>
          </div>
        `;
        return;
      }
  
      if (showResult) {
        app.innerHTML = `
          <div class="container">
            <div class="card">
              <h2 class="text-2xl font-bold mb-4">Quiz Completed!</h2>
              <p class="score">Your score: ${score} / ${questions.length}</p>
              <button class="btn-start" onclick="window.location.reload()">Try Again</button>
            </div>
          </div>
        `;
        return;
      }
  
      const currentQuestion = questions[currentQuestionIndex];
      const answers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer]
        .sort(() => Math.random() - 0.5);
  
      app.innerHTML = `
        <div class="container">
          <div class="card">
            <h2 class="question">${currentQuestion.question}</h2>
            <div class="answers">
              ${answers.map((answer, index) => `
                <button onclick="handleAnswerClick(${answer === currentQuestion.correct_answer})">
                  ${answer}
                </button>
              `).join('')}
            </div>
            <div class="nav-buttons">
              <button onclick="handlePreviousQuestion()" ${currentQuestionIndex === 0 ? 'disabled' : ''}>Previous</button>
              <button onclick="handleNextQuestion()" ${currentQuestionIndex === questions.length - 1 ? 'disabled' : ''}>Next</button>
            </div>
          </div>
        </div>
      `;
    }
  
    window.startQuiz = function () {
      showQuiz = true;
      render();
    };
  
    window.handleNextQuestion = function () {
      if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
      } else {
        showResult = true;
      }
      render();
    };
  
    window.handlePreviousQuestion = function () {
      if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
      }
      render();
    };
  
    window.handleAnswerClick = function (isCorrect) {
      if (isCorrect) {
        score++;
      }
      handleNextQuestion();
    };
  
    window.navigateTo = function (page) {
      document.querySelectorAll('.container').forEach(container => container.classList.add('hidden'));
      document.getElementById(page).classList.remove('hidden');
    };
  
    render();
  });
  