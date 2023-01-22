const saveBtn = document.getElementById("save");
const textInput = document.getElementById("text");
const fileInput=document.getElementById("file");
const modeBtn=document.getElementById("mode-btn");
const destroyBtn=document.getElementById("destroy-btn");
const eraserBtn = document.getElementById("eraser-btn");
const eraserWidth =document.getElementById("eraser-width");
const brshType=document.getElementById("brsh");
const textView=document.getElementById("text-view");
const stampType=document.querySelector("#stampMain div");

//htmlcollection 형식으로 넘어오는 데이터를 배열 형식으로 변환해줌
const colorOptions=Array.from(
    document.getElementsByClassName("color-option")
);
const canvas =document.querySelector("canvas");
const lineWidth=document.getElementById("line-width");
const color=document.getElementById("color");
const ctx=canvas.getContext("2d");
const stampWidth=document.getElementById("stamp-width");
const fontMain=document.getElementById("font-main");
const fonts=['PyeongChangPeace-Bold','ChosunCentennial','TTCrownMychewR','Ansungtangmyun-Bold','KIMM_Bold'];

canvasWidth=800;
canvasHeight=800;

canvas.width=canvasWidth;
canvas.height=canvasHeight;
// 사용자가 지정한 두께의 그림을 그림
ctx.lineWidth=lineWidth.value;
// 브러시 모양을 라운딩처리하기 "butt" | "round" | "square";
ctx.lineCap= "round";

let isPainting=false;
let isFilling=false;
let mode="painting";
let iseraser=false;
let ERASERWIDTH = eraserWidth.value;
let BRSHTYPE=false;
let STAMP=false;
let FONT='KIMM_Bold';



function onMove(event){
    const x=event.offsetX;
    const y=event.offsetY;
    if (iseraser && mode==="eraser"){
        ctx.clearRect(x,y,ERASERWIDTH,ERASERWIDTH);
    }else if(isPainting && mode==="painting"){
        ctx.lineTo(event.offsetX,event.offsetY);
        if(BRSHTYPE){
            ctx.fill();
        }else{
            ctx.stroke();
        }
        
        
        return;
    }
    ctx.moveTo(event.offsetX,event.offsetY);
}
// 마우스를 눌렀을때 유저가 그림을 그릴수 있도록함
function startPainting(){
    // 유저가 마우스를 눌렀는지를 확인함
    isPainting=true;
    iseraser=true;
}
function cancelPainting(){
    isPainting=false;
    iseraser=false;
    ctx.beginPath();

}
function onLineWidthChange(event){
    ctx.lineWidth=event.target.value;
}

function onColorChange(event){   
    ctx.strokeStyle=event.target.value;
    ctx.fillStyle=event.target.value;
}

// 어떤 컬러가 클릭되었는지 알아내기
function onColorClick(event){
    ctx.strokeStyle=event.target.dataset.color;
    ctx.fillStyle=event.target.dataset.color;
    // 사용자에게 색상 알려주기
    color.value=event.target.dataset.color;
}
// 그리기/채우기 모드 확인하기
function onModeClick(){
    if(isFilling){
        isFilling=false;
        modeBtn.classList.toggle("changeColor");
    }else{
        isFilling=true;
        modeBtn.classList.toggle("changeColor");
    }

}
function onCanvasClick(){
    if(isFilling && mode ==="painting"){
        // 캔버스 전체에 해당 색상을 채워줌
        ctx.fillRect(0,0,canvasWidth,canvasHeight);
    }
}
function onDestroyClick(){
    // 지우기
    destroyBtn.classList.toggle("changeColor");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    setTimeout(function() {
        destroyBtn.classList.toggle("changeColor");
    }, 300); 
}
function onEraserClick(){
    console.log(mode);
    if( mode==="eraser"){
        mode="painting";
    }else{
        mode="eraser";
    }
    
    eraserBtn.classList.toggle("changeColor");
    
}

function onFileChange(event){
    // 파일의 url가져오기
    const file= event.target.files[0];
    const url=URL.createObjectURL(file);
    // html 에서 <img src=""></img>와 동일
    const image=new Image()
    image.src=url;
    image.onload=function(){
        // (이미지, x좌표,y좌표, w,h)
        ctx.drawImage(image,0,0,canvasWidth,canvasHeight);
        //사진을 다시 가져오기 위해 이미지 비우기
        file.value=null;
    }


}

function onDoubleClick(event){
    // 현재 ctx의 모든 요소를 저장함(색상, 크기 등등)

    const text=textInput.value;
    

    if(text !=="" ){
        const width=stampWidth.value;
        ctx.save()
        ctx.lineWidth=1;
        console.log(FONT);
        // 폰트와 사이즈 
        ctx.font=`${width}px ${FONT}`;
        if(STAMP){
            ctx.fillText(text,event.offsetX,event.offsetY );

        }else{
            ctx.strokeText(text,event.offsetX,event.offsetY );

        }
        
        // 수정을 완료하고 ctx의 변경되었던 것들을 이전에 저장한 내용으로 변경함
        ctx.restore();

    }
    
}
function onSaveClick() {
    const url = canvas.toDataURL();
    const a = document.createElement("a");
    a.href = url;
    a.download = "myDrawing.png";
    a.click();
}
function eraserWidthChange(){
    ERASERWIDTH = eraserWidth.value;
}
function brshTypeChange(){
    if(BRSHTYPE){
        BRSHTYPE=false;
    }else{
        BRSHTYPE= true;
    }
    brshType.classList.toggle("changeColor");
}

function stampTypechange(){
    if(STAMP){
        STAMP=false;
    }else{
        STAMP=true;
    }
    stampType.classList.toggle("changeColor");

}
function changeFont(event){
    console.dir(event.target.value);
    FONT=fonts[event.target.value];
    console.log(FONT);
    fontMain.style.fontFamily=FONT;

}
// 캔버스가 더블클릭되면 텍스트 박스를 추가함 더블클릭 => 마우스 없과 마우스다운이 매우 빠르게 일어날때 발생
canvas.addEventListener("dblclick",onDoubleClick);
// user가 마우스를 클릭한 채로 움직일 때마다 그림 그리기
//클릭은 마우스를 눌렀다 땟을 때 발생
//canvas.onmousemove=function onMove(){} 다른 방식을 작성하기
canvas.addEventListener("mousemove", onMove);
// 마우스 다운은 마우스를 눌렀을때를 감지
canvas.addEventListener("mousedown",startPainting);
canvas.addEventListener('click',onCanvasClick);
// 마우스 업은 마우스를 뗐을때를 감지
canvas.addEventListener("mouseup",cancelPainting);
// 마우스를 누른채 영역밖으로 나가면 cancelPainting이 실행되지 않아 마우스를 때도 계속 그려짐
canvas.addEventListener("mouseleave",cancelPainting);


lineWidth.addEventListener("change",onLineWidthChange);
color.addEventListener("change",onColorChange);

// 색상배열을 하나씩 넘겨주면서 그 중에 클릭 이벤트가 발생한 색상은 함수를 시행시킴
colorOptions.forEach(color=>color.addEventListener('click',onColorClick));

modeBtn.addEventListener("click",onModeClick);
destroyBtn.addEventListener("click", onDestroyClick);
eraserBtn.addEventListener("click",onEraserClick);
fileInput.addEventListener("change", onFileChange);
saveBtn.addEventListener("click", onSaveClick);
eraserWidth.addEventListener("change", eraserWidthChange);
brshType.addEventListener("click",brshTypeChange );
stampType.addEventListener("click", stampTypechange);
document.getElementById("font1").addEventListener("click",changeFont);
document.getElementById("font2").addEventListener("click",changeFont);
document.getElementById("font3").addEventListener("click",changeFont);
document.getElementById("font4").addEventListener("click",changeFont);
document.getElementById("font5").addEventListener("click",changeFont);
fontMain.addEventListener("click",()=> document.getElementById("font-list").classList.toggle("hidden"))