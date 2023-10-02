const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

const lionImages = ['./assets/lion1.png', './assets/lion2.png'];
const dogImages = ['./assets/dog1.png', './assets/dog2.png'];
const catImages = [
  './assets/cat-rigth.png',
  './assets/cat-left.png',
  './assets/cat-up.png',
];
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
let jumpHeight = 100; // Высота прыжка
let jumpSpeed = 5; // Скорость поднимающегося и опускающегося движения при прыжке
let gravity = 1; // Гравитация
const catWidth = 35; // Ширина кота



const backgroundImage = new Image();
backgroundImage.src = './assets/cave.png'; // Путь к фоновому изображению

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
  context.drawImage(catImage, catX, catY, catWidth, 35); // Размер и позиция кота на холсте
}

function changeCatImage(index) {
  currentCatImageIndex = index;
}


function jump() {
  if (!catJumping) {
    catJumping = true;
    let jumpInterval = setInterval(function () {
      catY -= jumpSpeed;
      if (catY <= canvas.height - jumpHeight) {
        clearInterval(jumpInterval);
        let fallInterval = setInterval(function () {
          catY += jumpSpeed;
          if (catY >= canvas.height - 100) {
            catY = canvas.height - 100;
            clearInterval(fallInterval);
            catJumping = false;
          }
        }, 20);
      }
    }, 20);
  }
}

document.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowLeft' && catX > 0) {
    changeCatImage(1); // Лево
    catX -= 5; // Смещение кота влево
  } else if (event.key === 'ArrowRight' && catX < canvas.width - catWidth) {
    changeCatImage(0); // Право
    catX += 5; // Смещение кота вправо
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

function changeLionImage() {
  currentLionImageIndex = (currentLionImageIndex + 1) % lionImages.length;
}

function changeDogImage() {
  currentDogImageIndex = (currentDogImageIndex + 1) % dogImages.length;
}

function gameLoop() {
  drawBackground();
  drawLion();
  drawDog();
  drawCat();
  lionX -= 1; // Скорость движения льва
  dogX -= 1.5; // Скорость движения собаки (можете настроить по своему усмотрению)

  if (lionX < -100) {
    lionX = canvas.width; // Вернуть льва справа после достижения левого края
    changeLionImage(); // Сменить изображение льва
  }

  if (dogX < -100) {
    dogX = canvas.width; // Вернуть собаку справа после достижения левого края
    changeDogImage(); // Сменить изображение собаки
  }

  requestAnimationFrame(gameLoop); // Запуск следующего кадра анимации
}

backgroundImage.onload = function () {
  gameLoop(); // Начать анимацию после загрузки фонового изображения
  setInterval(changeLionImage, 500); // Смена изображения льва каждые 0.5 секунды
  setInterval(changeDogImage, 500); // Смена изображения собаки каждые 0.5 секунды
};
