let scrollY = 0;
let numeroImagen = 0;
let imagenes = [];
let imagenActual = null;
let imagenAnterior = null;
let posicion = 0;
let animando = false;
let direccionAnimacion = -1;
let velocidad = 30;

function esBuena(id) { return id >= 0 && id <= 7; }
function esMala(id) { return id >= 8 && id <= 14; }

let secuenciaEtapas = [
  0, 1, 2, 3, 4,
  8, 5, 9, 6, 10, 7,
  8, 9, 10, 11, 12, 13, 14
];

let inicioEtapa3 = 11;

let pasoSecuencia = 0; 

let grietas = { radiales: [], anillos: [], centro: { x: 0, y: 0 } };
let progresoImagen = 0; 
let scrollsRequeridos = 1; 
let deslizadasCompletadas = 0; 
let nivelDificultadMala = 1;

let posicionTouchInicial = 0;
let iniciado = false;
let contadorScrolls = 0;
let valorRandom = 0;
let reparacion = 600;
let disminuirScroll = 60;
let boton;
let seguir = false;

function preload() {
  imagenes[0] = loadImage("0.jpg");
  imagenes[1] = loadImage("1.jpg");
  imagenes[2] = loadImage("2.jpg");
  imagenes[3] = loadImage("3.jpg");
  imagenes[4] = loadImage("4.jpg");
  imagenes[5] = loadImage("5.jpg");
  imagenes[6] = loadImage("6.jpg");
  imagenes[7] = loadImage("7.png");
  imagenes[8] = loadImage("8.jpg");
  imagenes[9] = loadImage("9.jpg");
  imagenes[10] = loadImage("10.jpg");
  imagenes[11] = loadImage("11.jpg");
  imagenes[12] = loadImage("12.png");
  imagenes[13] = loadImage("13.jpg");
  imagenes[14] = loadImage("14.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  document.body.style.margin = "0";
  document.body.style.padding = "0";
  document.body.style.overflow = "hidden";
  document.body.style.background = "black";

  boton = createButton("Follow");
  boton.position(width - 80, 90);
  boton.style("background", "black");
  boton.style("color", "white");
  boton.style("border", "none");
  boton.style("padding", "6px 12px");
  boton.style("border-radius", "4px");
  boton.mousePressed(botonSeguir);
}

function draw() {
  background(0);
  animacion();
  
  if (!iniciado) {
    cargarImagenActual();
    iniciado = true;
  }
  
  animarPantallaRota();
  reparar();

  if (contadorScrolls > 40) {
    fill(0, 200);
    rect(0, 0, windowWidth, windowHeight);
  } else {
    fill(0, contadorScrolls * 5);
    rect(0, 0, windowWidth, windowHeight);
  }

  interfaz();
}

function botonSeguir() {
  seguir = !seguir;
  boton.html(seguir ? "Following" : "Follow");
}

function interfaz() {
  noStroke();
  fill(0);
  rect(0, 0, windowWidth, 75);

  fill(255);
  textAlign(LEFT, CENTER);
  textSize(18);
  textStyle(BOLD);
  text("Doomscrolling", 20, 30);

  fill(255);
  textSize(12);
  textStyle(NORMAL);
  text("Para vos", 20, 55);

  fill(0);
  rect(0, 75, windowWidth, 60);

  fill(225);
  circle(35, 105, 35);

  fill(255);
  textSize(13);
  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  text("Usuario_Desconocido", 60, 99);

  fill(255);
  textSize(10);
  textStyle(NORMAL);
  text("Ahora", 60, 116);
}

function reparar() {
  reparacion--;
  if (reparacion <= 0) {
    disminuirScroll--;
    if (disminuirScroll <= 0) {
      if (contadorScrolls > 0) {
        contadorScrolls--;
      }
      progresoImagen = max(0, progresoImagen - 0.1);
      disminuirScroll = 30;
    }
  }
}

function obtenerNivelMala(pasoObjetivo) {
  let conteoMalas = 0;
  for (let i = 0; i <= pasoObjetivo; i++) {
    if (esMala(secuenciaEtapas[i])) {
      conteoMalas++;
    }
  }
  return conteoMalas;
}

function generarGrietas() {
  grietas = { radiales: [], anillos: [], centro: { x: 0, y: 0 } };

  let centroX = width / 2 + random(-20, 20);
  let centroY = height / 2 + random(-20, 20);
  grietas.centro = { x: centroX, y: centroY };

  let numGrietas = 5 + nivelDificultadMala * 3;
  let numAnillos = 1 + nivelDificultadMala * 2;
  let angulosBase = [];

  for (let i = 0; i < numGrietas; i++) {
    let angulo = (TWO_PI / numGrietas) * i + random(-0.25, 0.25);
    angulosBase.push(angulo);

    let pasoX = centroX;
    let pasoY = centroY;
    let puntos = [{ x: pasoX, y: pasoY }];
    let ramificaciones = [];
    let largoGrieta = random(width * 0.35, max(width, height) * 0.9);
    let dist = 0;

    while (dist < largoGrieta) {
      let paso = random(12, 35);
      angulo += random([-0.4, -0.2, 0, 0.2, 0.4]); 
      pasoX += cos(angulo) * paso;
      pasoY += sin(angulo) * paso;
      puntos.push({ x: pasoX, y: pasoY });
      dist += paso;

      if (random() < 0.35 && dist > 40) {
        let anguloRama = angulo + random([-1, 1]) * random(0.5, 0.9);
        let largoRama = random(25, 90);
        let ramaPuntos = [{ x: pasoX, y: pasoY }];
        let rx = pasoX, ry = pasoY;
        let rDist = 0;

        while (rDist < largoRama) {
          let rPaso = random(10, 22);
          anguloRama += random(-0.2, 0.2);
          rx += cos(anguloRama) * rPaso;
          ry += sin(anguloRama) * rPaso;
          ramaPuntos.push({ x: rx, y: ry });
          rDist += rPaso;
        }
        ramificaciones.push(ramaPuntos);
      }
    }
    grietas.radiales.push({ puntos, ramificaciones });
  }

  for (let a = 1; a <= numAnillos; a++) {
    let radio = a * random(25, 45);
    let puntosAnillo = [];
    for (let i = 0; i < angulosBase.length; i++) {
      let ang = angulosBase[i];
      let rJitter = radio + random(-10, 10);
      let ax = centroX + cos(ang) * rJitter;
      let ay = centroY + sin(ang) * rJitter;
      puntosAnillo.push({ x: ax, y: ay });
    }
    grietas.anillos.push(puntosAnillo);
  }
}

function animarPantallaRota() {
  if (progresoImagen <= 0) return;

  function dibujarTrazado(puntosArray, limite) {
    let maxIdx = floor(map(limite, 0, 1, 1, puntosArray.length));
    if (maxIdx < 2) return;

    stroke(0, 160);
    strokeWeight(map(progresoImagen, 0, 1, 2, 4.5));
    noFill();
    beginShape();
    for (let i = 0; i < maxIdx; i++) {
      vertex(puntosArray[i].x + 1, puntosArray[i].y + 1);
    }
    endShape();

    stroke(240, 250, 255, map(progresoImagen, 0, 1, 140, 240));
    strokeWeight(map(progresoImagen, 0, 1, 0.8, 2.2));
    beginShape();
    for (let i = 0; i < maxIdx; i++) {
      vertex(puntosArray[i].x, puntosArray[i].y);
    }
    endShape();
  }

  for (let g of grietas.radiales) {
    dibujarTrazado(g.puntos, progresoImagen);
    for (let rama of g.ramificaciones) {
      if (progresoImagen > 0.3) {
        dibujarTrazado(rama, map(progresoImagen, 0.3, 1, 0, 1, true));
      }
    }
  }

  for (let i = 0; i < grietas.anillos.length; i++) {
    let umbralAparicion = (i + 1) * 0.12;
    if (progresoImagen > umbralAparicion) {
      let progAnillo = map(progresoImagen, umbralAparicion, 1, 0, 1, true);
      let anillo = grietas.anillos[i];
      let maxPuntos = floor(map(progAnillo, 0, 1, 2, anillo.length));
      
      stroke(0, 140);
      strokeWeight(2.5);
      noFill();
      beginShape();
      for (let j = 0; j < maxPuntos; j++) {
        vertex(anillo[j].x + 1, anillo[j].y + 1);
      }
      endShape();

      stroke(245, 255, 255, 210);
      strokeWeight(1.2);
      beginShape();
      for (let j = 0; j < maxPuntos; j++) {
        vertex(anillo[j].x, anillo[j].y);
      }
      endShape();
    }
  }

  fill(255, map(progresoImagen, 0, 1, 150, 230));
  noStroke();
  circle(grietas.centro.x, grietas.centro.y, map(progresoImagen, 0, 1, 4, 18));
  
  stroke(255, 200);
  strokeWeight(0.8);
  noFill();
  circle(grietas.centro.x, grietas.centro.y, map(progresoImagen, 0, 1, 8, 35));
}

function animacion() {
  if (animando) {
    let yAnterior = direccionAnimacion * posicion;
    let yActual = direccionAnimacion * (posicion - height);

    if (imagenAnterior) {
      drawContain(imagenAnterior, 0, yAnterior, width, height);
    }

    if (imagenActual) {
      drawContain(imagenActual, 0, yActual, width, height);
    }

    posicion += velocidad;
    if (posicion >= height) {
      posicion = 0;
      animando = false;
    }
  } else {
    if (imagenActual) {
      drawContain(imagenActual, 0, 0, width, height);
    }
  }
}

function drawContain(img, x, y, w, h) {
  let imgRatio = img.width / img.height;
  let canvasRatio = w / h;
  let drawW, drawH;

  if (imgRatio > canvasRatio) {
    drawW = w;
    drawH = w / imgRatio;
  } else {
    drawH = h;
    drawW = h * imgRatio;
  }

  let drawX = x + (w - drawW) / 2;
  let drawY = y + (h - drawH) / 2;

  image(img, drawX, drawY, drawW, drawH);
}

function cargarImagenActual() {
  numeroImagen = secuenciaEtapas[pasoSecuencia];
  imagenActual = imagenes[numeroImagen];
}

function cambiarPaso(direccion, pasoObjetivo) {
  if (animando) return;

  let nuevoPaso = pasoObjetivo !== undefined ? pasoObjetivo : pasoSecuencia + direccion;

  if (nuevoPaso >= secuenciaEtapas.length) {
    nuevoPaso = inicioEtapa3;
  }
  if (nuevoPaso < 0) nuevoPaso = 0;

  if (nuevoPaso === pasoSecuencia) return;

  imagenAnterior = imagenActual;

  pasoSecuencia = nuevoPaso;
  numeroImagen = secuenciaEtapas[pasoSecuencia];
  imagenActual = imagenes[numeroImagen];

  progresoImagen = 0;
  deslizadasCompletadas = 0;

  direccionAnimacion = direccion === 1 ? -1 : 1;
  posicion = 0;

  if (contadorScrolls < 100) {
    imagenActual.filter(BLUR, contadorScrolls / 25);
  } else {
    imagenActual.filter(BLUR, 4);
  }
  
  animando = true;
}

function touchStarted() {
  if (!fullscreen()) {
    fullscreen(true);
  }
  posicionTouchInicial = mouseY;
}

function touchEnded() {
  let movimiento = mouseY - posicionTouchInicial;

  if (abs(movimiento) > 50) {
    let direccion = movimiento < -50 ? 1 : -1;
    let siguientePaso = pasoSecuencia + direccion;
    
    if (siguientePaso >= secuenciaEtapas.length) {
      siguientePaso = inicioEtapa3;
    }
    if (siguientePaso < 0) siguientePaso = 0;

    if (siguientePaso === pasoSecuencia) return false;

    let imgSiguienteId = secuenciaEtapas[siguientePaso];

    if (esMala(imgSiguienteId)) {
      nivelDificultadMala = obtenerNivelMala(siguientePaso);
      scrollsRequeridos = min(6, 1 + nivelDificultadMala * 2);
      
      if (deslizadasCompletadas === 0) {
        generarGrietas();
      }

      deslizadasCompletadas++;
      contadorScrolls++;
      progresoImagen = deslizadasCompletadas / scrollsRequeridos;

      if (deslizadasCompletadas >= scrollsRequeridos) {
        cambiarPaso(direccion, siguientePaso);
      }
    } else {
      scrollsRequeridos = 1;
      progresoImagen = 0;
      contadorScrolls++;
      
      cambiarPaso(direccion, siguientePaso);
    }
  }
  
  reparacion = 600;
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}