const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const livesElement = document.getElementById('lives');
const restartButton = document.getElementById('restartButton');

const lionImages = ['./assets/lion1.png', './assets/lion2.png'];
const dogImages = ['./assets/dog1.png', './assets/dog2.png'];
const catImages = [
  './assets/cat-rigth.png',
  './assets/cat-left.png',
  './assets/cat-up.png',
  './assets/cat-minus-level.png',
];

let animationId
let isGameOver = false;
let isCatImmune = false; // Флаг, указывающий, имеет ли кот иммунитет
let immuneDuration = 2000; // Длительность иммунитета в миллисекундах (5 секунд)
let lives = 9; // Начальное количество жизней
let currentLionImageIndex = 0;
let lionX = canvas.width; // Начальная позиция льва справа
const lionY = canvas.height - 70; // Высота нижней части холста

let currentDogImageIndex = 0;
let dogX = canvas.width; // Начальная позиция собаки справа
const dogY = canvas.height - 40; // Высота нижней части холста

let currentCatImageIndex = 0;
let catX = 10; // Начальная позиция кота по горизонтали (левый нижний угол)
let catY = canvas.height - 33; // Начальная позиция кота по вертикали
let catJumping = false; // Флаг, указывающий, что кот прыгает
let jumpHeight = 160; // Высота прыжка
let jumpSpeed = 5; // Скорость поднимающегося и опускающегося движения при прыжке
let gravity = 1; // Гравитация
const catWidth = 35; // Ширина кота

let isStalactiteFalling = false; // Флаг, указывающий, падает ли сталактит в данный момент
const stalactiteFallSpeed = 2; // Скорость падения сталактита

const backgroundImage = new Image();
backgroundImage.src = './assets/cave.png'; // Путь к фоновому изображению

const stalactiteImage = new Image();
stalactiteImage.src = './assets/stalactite.png'; // Путь к изображению сталактита

const stalactiteWidth = 50; // Ширина сталактита
const stalactiteHeight = 50; // Высота сталактита
const numberOfStalactites = 20; // Количество сталактитов

// Создайте массив для хранения позиций сталактитов
const stalactites = [];

// Функция для создания случайного числа в заданном диапазоне
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Рассчитайте начальные позиции для сталактитов
for (let i = 0; i < numberOfStalactites; i++) {
  const x = (i * canvas.width) / numberOfStalactites; // Равномерное распределение по ширине холста
  const y = 0; // Наверху холста
  stalactites.push({ x, y });

  // console.log("stalactites",stalactites)
}

// Функция для отрисовки сталактитов
function drawStalactites() {
  stalactites.forEach((stalactite) => {
    context.drawImage(
      stalactiteImage,
      stalactite.x,
      stalactite.y,
      stalactiteWidth,
      stalactiteHeight
    );
  });
}

function drawBackground() {
  context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

function drawLion() {
  const lionImage = new Image();
  lionImage.src = lionImages[currentLionImageIndex];
  context.drawImage(lionImage, lionX, lionY, 100, 100); // Размер и позиция льва на холсте
}

function drawDog() {
  const dogImage = new Image();
  dogImage.src = dogImages[currentDogImageIndex];
  context.drawImage(dogImage, dogX, dogY, 50, 50); // Размер и позиция собаки на холсте
}

function drawCat() {
  const catImage = new Image();
  catImage.src = catImages[currentCatImageIndex];
  if (isCatImmune) catImage.src = catImages[3];
  context.drawImage(catImage, catX, catY, catWidth, 35); // Размер и позиция кота на холсте
}

function changeCatImage(index) {
  currentCatImageIndex = index;
}

function jump() {
  if (!catJumping) {
    catJumping = true;
    let jumpHeightRemaining = jumpHeight;
    let jumpInterval = setInterval(function () {
      if (jumpHeightRemaining > 0) {
        catY -= jumpSpeed;
        jumpHeightRemaining -= jumpSpeed;
      } else {
        clearInterval(jumpInterval);
        let fallInterval = setInterval(function () {
          catY += jumpSpeed;
          if (catY >= canvas.height - 33) {
            catY = canvas.height - 33;
            clearInterval(fallInterval);
            catJumping = false;
          }
        }, 20);
        changeCatImage(0);
      }
    }, 20);
  }
}

document.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowLeft' && catX > 0) {
    changeCatImage(1); // Лево
    catX -= 7; // Смещение кота влево
  } else if (event.key === 'ArrowRight' && catX < canvas.width - catWidth) {
    changeCatImage(0); // Право
    catX += 7; // Смещение кота вправо
  } else if (event.key === 'ArrowUp') {
    changeCatImage(2); // Вверх
    jump();
  }
});

document.addEventListener('keyup', function (event) {
  if (event.key === 'ArrowDown') {
    // При отпускании клавиши вниз вернуть изображение вправо (по умолчанию)
    changeCatImage(0);
  }
});



restartButton.addEventListener('click', () => {
  isGameOver = false;
  lives = 9; // Восстановите количество жизней или другие начальные значения
  // Дополнительные действия для перезапуска игры
  cancelAnimationFrame(animationId);
  gameLoop()
});

function changeLionImage() {
  currentLionImageIndex = (currentLionImageIndex + 1) % lionImages.length;
}

function changeDogImage() {
  currentDogImageIndex = (currentDogImageIndex + 1) % dogImages.length;
}

let randomStalactiteIndex = getRandomNumber(0, stalactites.length - 1);

// Функция для падения одного сталактита
function dropStalactite(stalactiteIndex) {
  const stalactite = stalactites[stalactiteIndex];
  stalactite.y += stalactiteFallSpeed;

  // Проверьте, достиг ли сталактит нижней границы холста
  if (stalactite.y > canvas.height) {
    // Если достиг, верните его вверху
    stalactite.y = 0;
    randomStalactiteIndex = getRandomNumber(0, stalactites.length - 1);
  }
}

function checkCollisions() {
  if (isCatImmune) {
    return; // Если кот иммунен, прервать проверку столкновений
  }
  // Проверка столкновения кота с львом
  if (
    catX + catWidth > lionX + 20 &&
    catX < lionX + 80 && // Ширина льва
    catY + 15 > lionY &&
    catY < lionY + 50 // Высота льва
  ) {
    // Столкновение кота с львом
    lives--; // Уменьшение количества жизней
    // Дополнительная логика при столкновении с львом, если нужно
    isCatImmune = true;
    setTimeout(() => {
      isCatImmune = false; // Отключить иммунитет после истечения времени
    }, immuneDuration);
  }

  // Проверка столкновения кота с собакой
  if (
    catX + catWidth > dogX + 20 &&
    catX < dogX + 10 && // Ширина собаки
    catY + 15 > dogY &&
    catY < dogY + 50 // Высота собаки
  ) {
    // Столкновение кота с собакой
    lives--; // Уменьшение количества жизней
    isCatImmune = true;
    setTimeout(() => {
      isCatImmune = false; // Отключить иммунитет после истечения времени
    }, immuneDuration);
  }

  // Проверка столкновения кота с каждым сталактитом
  stalactites.forEach((stalactite) => {
    if (
      catX + catWidth > stalactite.x - 10 &&
      catX < stalactite.x + stalactiteWidth - 10 &&
      catY + 35 > stalactite.y &&
      catY < stalactite.y + stalactiteHeight
    ) {
      // Столкновение кота с сталактитом
      lives--; // Уменьшение количества жизней
      isCatImmune = true;
      setTimeout(() => {
        isCatImmune = false; // Отключить иммунитет после истечения времени
      }, immuneDuration);
    }
  });
}

function endGame() {
  isGameOver = true;
  cancelAnimationFrame(animationId);
  // Дополнительные действия при завершении игры, например, вывод сообщения о завершении
  // и кнопки перезапуска
}

function gameLoop() {
  if (isGameOver) {
    return;
  }

  drawBackground();
  drawLion();
  drawDog();
  drawCat();
  drawStalactites();
  (lionX -= 1), 5; // Скорость движения льва
  dogX -= 2.5; // Скорость движения собаки (можете настроить по своему усмотрению)

  if (lionX < -100) {
    lionX = canvas.width; // Вернуть льва справа после достижения левого края
    changeLionImage(); // Сменить изображение льва
  }

  if (dogX < -100) {
    dogX = canvas.width; // Вернуть собаку справа после достижения левого края
    changeDogImage(); // Сменить изображение собаки
  }

  dropStalactite(randomStalactiteIndex);

  checkCollisions();

  livesElement.textContent = `Жизни: ${lives}`;

  if (lives === 0) {
    // cancelAnimationFrame(animationId);
    endGame()
  }

  animationId = requestAnimationFrame(gameLoop);
  // requestAnimationFrame(gameLoop); // Запуск следующего кадра анимации
}

backgroundImage.onload = function () {
  gameLoop(); // Начать анимацию после загрузки фонового изображения
  setInterval(changeLionImage, 500); // Смена изображения льва каждые 0.5 секунды
  setInterval(changeDogImage, 500); // Смена изображения собаки каждые 0.5 секунды
};
