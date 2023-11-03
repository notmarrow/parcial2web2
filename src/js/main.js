// CODIGO PARA BALANCE FACIL
let allowed_offset = 15; 
// se usa para setear cuanto se puede pasar el jugador del
// vertice de una figura para que cuente como hit

// CODIGO PARA LA FIGURA / TIPO DE DIBUJO
const shape_enum = {
    square: 'square',
    triangle: 'triangle',
    circle: 'circle',
    line: 'line',
    free: 'freeform'
};
let shape_style;// variables para seleccion de figura a dibujar
if(shape_style === undefined){
    shape_style = shape_enum.free;
}


const shapes_button = document.getElementById("shapes_button");
const shapes_picker = document.getElementById("shapes_picker");

shapes_button.addEventListener("click", () => {
    if (shapes_picker.style.display === "none" || shapes_picker.style.display === "") {
        shapes_picker.style.display = "block";
    } else {
        shapes_picker.style.display = "none";
    }
}); // abre el menu de figuras

// cambiar el tipo de figura segun el estilo
const square_button = document.getElementById("square_choice");
square_button.addEventListener("click", () =>{
    if(shapes_picker.style.display === "block"){
        shapes_picker.style.display = "none";
    }
    shape_style = shape_enum.square;
});

const triangle_button = document.getElementById("triangle_choice");
triangle_button.addEventListener("click", () =>{
    if(shapes_picker.style.display === "block"){
        shapes_picker.style.display = "none";
    }
    shape_style = shape_enum.triangle;
});

const circle_button = document.getElementById("circle_choice");
circle_button.addEventListener("click", () =>{
    if(shapes_picker.style.display === "block"){
        shapes_picker.style.display = "none";
    }
    shape_style = shape_enum.circle;
});

const line_button = document.getElementById("line_choice");
line_button.addEventListener("click", () =>{
    if(shapes_picker.style.display === "block"){
        shapes_picker.style.display = "none";
    }
    shape_style = shape_enum.line;
});

const freeform_button = document.getElementById("freeform_choice");
freeform_button.addEventListener("click", () =>{
    if(shapes_picker.style.display === "block"){
        shapes_picker.style.display = "none";
    }
    shape_style = shape_enum.free;
});

// CODIGO PARA EL COLOR
const color_picker = document.getElementById("color_picker");
let color = color_picker.value;

color_picker.addEventListener("input", (event) => {
    color = event.target.value;
}); 

function randColor(){
    const hex = "23456789ABCDEF";
    let r = '';

    for(let i = 0; i < 6; ++i){
        r += hex.charAt(Math.floor(Math.random() * hex.length));
    }

    r = "#" + r;
    
    return r;
}

// CODIGO PARA LA SELECCION DE DIBUJO DE LA PC
const pc_canvas = document.getElementById('pc-canvas');
const pc_ctx = pc_canvas.getContext('2d'); 

// LISTA DE COORDENADAS PARA CALCULO DE PUNTUACION
const Coordinates = {
    x: 0,
    y: 0,
};

let pc_vertex_list = [];


function startGame(){
    const figure_count = Math.floor(Math.random() * 5) + 1;
    
    console.log(figure_count);

    for (let i = 0; i < figure_count; i++){
        let pc_shape = Math.floor(Math.random() * 3);
        let pc_x = Math.floor(Math.random() * 400) + 10;
        let pc_y = Math.floor(Math.random() * 400) + 10;

        let pc_stroke_size = Math.floor(Math.random() * 70) + 20;

        pc_ctx.fillStyle = randColor();
        
        switch (pc_shape){
            case 0:

                pc_ctx.beginPath();
                pc_ctx.moveTo(pc_x, pc_y);
                pc_ctx.lineTo(pc_x + pc_stroke_size, pc_y + pc_stroke_size);
                pc_ctx.lineTo(pc_x + pc_stroke_size, pc_y);
                pc_ctx.closePath();  
                pc_ctx.fill();

                pc_vertex_list.push({x: pc_x, y: pc_y});
                pc_vertex_list.push({x: pc_x + pc_stroke_size, y: pc_y});
                pc_vertex_list.push({x: pc_x + pc_stroke_size, y: pc_y + pc_stroke_size});

                break;

            case 1: 
                pc_ctx.rect(pc_x, pc_y, pc_stroke_size, pc_stroke_size);
                pc_ctx.closePath();
                pc_ctx.fill();

                pc_vertex_list.push({x: pc_x, y: pc_y});
                pc_vertex_list.push({x: pc_x + pc_stroke_size, y: pc_y});
                pc_vertex_list.push({x: pc_x, y: pc_y + pc_stroke_size});
                pc_vertex_list.push({x: pc_x + pc_stroke_size, y: pc_y + pc_stroke_size});

                break;
        
            case 2:
                const pc_radius = Math.sqrt(Math.pow(pc_stroke_size, 2) + Math.pow(pc_stroke_size, 2));

                pc_ctx.beginPath();
                pc_ctx.arc(pc_x, pc_y, pc_radius, 0, 2 * Math.PI);
                pc_ctx.fill();

                pc_vertex_list.push({x: pc_x, y: pc_y});

                break;
        }
    }

    
}

startGame();

// CODIGO PARA EL CANVAS
const canvas = document.getElementById('draw-canvas');
const ctx = canvas.getContext('2d'); 

canvas.addEventListener('mousedown', clickStart);
canvas.addEventListener('mousemove', clickContinue);
canvas.addEventListener('mouseup', clickEnd);

canvas.addEventListener('touchstart', clickStart);
canvas.addEventListener('touchmove', clickContinue);
canvas.addEventListener('touchend', clickEnd);

ctx.lineWidth = 2;
ctx.lineJoin = "round";
ctx.lineCap = "round";

let hits = 0; 
// variable para el sistema de puntuación
// mide la cantidad de veces que el jugador ha entrado en los
// hitzones

let total_area = 0;
// variable para mantener el area total de las figuras
// para calcular que tanto dibujo el jugador y penalizar
// si dibuja de mas

function getMousePosition(event){
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return {x, y};
}

let clickStartX, clickStartY;
let clickEndX, clickEndY;
let drawing = false;
let lastX = 0;
let lastY = 0;

function clickStart(event){
    event.preventDefault();
    let ev;
    if(event.touches){
        ev = event.touches[0];
    }else{
        ev = event;
    }
    const mousePos = getMousePosition(ev);
    clickStartX = mousePos.x;
    clickStartY = mousePos.y;

    if(shape_style === shape_enum.free){
        drawing = true;
        [lastX, lastY] = [ev.offsetX, ev.offsetY];
    }

    ctx.fillStyle = color;
    ctx.strokeStyle = color;
}

function clickContinue(event){
    event.preventDefault();
    let ev;
    if(event.touches){
        ev = event.touches[0];
    }else{
        ev = event;
    }

    if(shape_style === shape_enum.free){
        if (!drawing) return;

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(ev.offsetX, ev.offsetY);
        ctx.stroke();

        [lastX, lastY] = [ev.offsetX, ev.offsetY];

        for(let i = 0; i < pc_vertex_list.length; i++){
            let comp = {x: lastX, y: lastY};

            if(lastX > (pc_vertex_list[i].x - allowed_offset) 
            && lastX < (pc_vertex_list[i].x + allowed_offset)
            && lastY > (pc_vertex_list[i].y - allowed_offset) 
            && lastY < (pc_vertex_list[i].y + allowed_offset)){
                hits++;
                pc_vertex_list.splice(i,1);
                i--;
            }
        }

        total_area += Math.sqrt(Math.pow(ev.offsetX - lastX, 2) + Math.pow(ev.offsetY - lastY, 2));

    }
}

function clickEnd(event){
    event.preventDefault();
    let ev;
    if(event.changedTouches){
        ev = event.changedTouches[0];
    }else{
        ev = event;
    }
    const mousePos = getMousePosition(ev);

    console.log(mousePos.x, mousePos.y);

    clickEndX = mousePos.x;
    clickEndY = mousePos.y;

    ctx.beginPath();
    switch(shape_style){
        case shape_enum.square:
            ctx.rect(clickStartX, clickStartY, clickEndX - clickStartX, clickEndY - clickStartY);
            ctx.closePath();
            ctx.fill();

            for(let i = 0; i < pc_vertex_list.length; i++){

               if(pc_vertex_list[i].x >= clickStartX - allowed_offset 
                && pc_vertex_list[i].x <= clickEndX + allowed_offset
                && pc_vertex_list[i].y >= clickStartY - allowed_offset
                && pc_vertex_list[i].y <= clickEndY + allowed_offset) {
                    hits++;
                    pc_vertex_list.splice(i,1);
                    i--;
                }
            }

            total_area += (clickEndX - clickStartX) * (clickEndY - clickStartY);
            break;

        case shape_enum.triangle:
            const sideLength = Math.sqrt(Math.pow(clickEndX - clickStartX, 2) + Math.pow(clickEndY - clickStartY, 2));

            ctx.beginPath();
            ctx.moveTo(clickStartX, clickStartY);
            ctx.lineTo(clickEndX, clickEndY);
            ctx.lineTo(clickStartX + sideLength, clickStartY);
            ctx.closePath();  
            ctx.fill();

            // TODO: CAMBIAR PARA USAR SISTEMA DEDICADO A TRIANGULOS
            // el siguiente codigo actualmente checa si la coordenada
            // se encuentra dentro del area del tamaño del cuadrado
            // formaado por dos triangulos unidos por la diagonal que
            // lo divide en lugar de checar el triangulo
            // probar con coordenadas baricentricas para arreglar
            for(let i = 0; i < pc_vertex_list.length; i++){
                if(pc_vertex_list[i].x >= clickStartX - allowed_offset 
                && pc_vertex_list[i].x <= clickEndX + allowed_offset
                && pc_vertex_list[i].y >= clickStartY - allowed_offset
                && pc_vertex_list[i].y <= clickEndY + allowed_offset) {
                    hits++;
                    pc_vertex_list.splice(i,1);
                    i--;
                }
            }

            total_area += ((clickEndX - clickStartX) * (clickEndY - clickStartY)) / 2;
            break;

        case shape_enum.circle:
            const radius = Math.sqrt(Math.pow(clickEndX - clickStartX, 2) + Math.pow(clickEndY - clickStartY, 2));

            ctx.beginPath();
            ctx.arc(clickStartX, clickStartY, radius, 0, 2 * Math.PI);
            ctx.fill();

            for(let i = 0; i < pc_vertex_list.length; i++){
                let distance = Math.sqrt(Math.pow(pc_vertex_list[i].x - clickStartX, 2) + Math.pow(pc_vertex_list[i].y - clickStartY, 2));
                if(distance <= radius){
                    hits++;
                    pc_vertex_list.splice(i,1);
                    i--;
                }
            }
            
            total_area += Math.PI * Math.pow(radius, 2); 
            break;

        case shape_enum.line:
            ctx.moveTo(clickStartX, clickStartY);
            ctx.lineTo(clickEndX, clickEndY);
            ctx.stroke();
            ctx.closePath();  

            for(let i = 0; i < pc_vertex_list.length; i++){
                let distance_from_start =   Math.sqrt(Math.pow(pc_vertex_list[i].x - clickStartX, 2) + Math.pow(pc_vertex_list[i].y - clickStartY, 2));
                let distance_from_end = Math.sqrt(Math.pow(pc_vertex_list[i].x - clickEndX, 2) + Math.pow(pc_vertex_list[i].y - clickEndY, 2));
                if (distance_from_end < allowed_offset || distance_from_start < allowed_offset){
                    hits++;
                    pc_vertex_list.splice(i,1);
                    i--;        
                }
            }

            total_area += Math.sqrt(Math.pow(clickEndX - clickStartX, 2) + Math.pow(clickEndY - clickStartY, 2));
            break;

        case shape_enum.free:
            drawing = false;
            break;
    }  
}

// TODO: CODIGO PARA EL CRONOMETRO
let finished = false;
let chrono = null;

if(typeof(Worker) !== "undefined"){
    if(chrono == null){
        chrono = new Worker("js/chronometer.js");
        chrono.postMessage("start");
    }
    if(!finished){
        chrono.onmessage = function (ev){
            document.getElementById("timer").innerHTML = ev.data;

            if(ev.data === "00:00"){
                chrono.postMessage("end");
                finished = true;
                gameEnd();
            }
        }
    }
}

const restart_button = document.getElementById("restart-button");
const win_screen = document.getElementById("win-screen");
const score_text = document.getElementById("score-text");

// CODIGO PARA LA PUNTUACION
function gameEnd(){
    let score = hits * 1000;
    score -= Math.floor(total_area / 100);
    
    score_text.textContent = "Score:" + score;
    win_screen.style.display = "block";
}

restart_button.addEventListener("click", function(){
    finished = false;
    drawing = false;
    total_area = 0;
    hits = 0;
    pc_vertex_list.length = 0;
    ctx.clearRect(0,0,canvas.width, canvas.height);
    pc_ctx.clearRect(0,0,pc_canvas.width, pc_canvas.height);
    win_screen.style.display = "none";
    chrono.postMessage("start");
    startGame();
});

// TODO: CODIGO PARA EL GUARDADO DE PUNTUACION Y EL DISPLAY CON CLICK