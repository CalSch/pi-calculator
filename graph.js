/** @type {HTMLCanvasElement} */
let c=document.getElementById('graph');
let ctx=c.getContext('2d');

let width=700;
let height=400;

c.width=width;
c.height=height;



let gsxEl=document.getElementById("graphScaleX");
let gsyEl=document.getElementById("graphScaleY");

gsxEl.onchange=gsyEl.onchange=()=>{
	graphScaleX=gsxEl.value;
	graphScaleY=gsyEl.value;
	draw();
}


/** @type {{x:number;y:number,id:number}[]} */
let data=[];
// for (let i=0;i<100;i++) {
// 	data.push({
// 		x:i,
// 		y:Math.sin(i/10)*30+10,
// 		id:i
// 	})
// }

let graphOffsetX=40;
let graphOffsetY=40;
let graphScaleX=0.5;
let graphScaleY=0.5;
let pointSize=3;

let gridScaleX=()=>100/graphScaleX;
let gridScaleY=()=>100/graphScaleY;

// gridScaleX()*=graphScaleX;
// gridScaleY()*=graphScaleY;

let hoverPoint=-1;
let posBoxOffsetX=7;
let posBoxOffsetY=7;
let posBoxPad=3;
let posTextFontSize=15;

function getPointPos(p) {
	return {
		x:Math.floor((p.x*graphScaleX)+graphOffsetX),
		y:Math.floor(height-graphOffsetY-(p.y*graphScaleY)),
	}
}

async function draw() {
	ctx.clearRect(0,0,width,height);
	ctx.font=`${posTextFontSize}px monospace`;
	ctx.shadowColor="transparent";

	ctx.strokeStyle="grey";
	ctx.lineWidth=1;
	ctx.beginPath();
	ctx.moveTo(graphOffsetX,0);
	ctx.lineTo(graphOffsetX,height-graphOffsetY);
	ctx.lineTo(width,height-graphOffsetY);
	ctx.stroke();

	ctx.lineWidth=1;
	ctx.beginPath();
	for (let i=0;i<width/gridScaleX()/graphScaleX;i++) { // Vertical lines
		let j=Math.floor(i*gridScaleX())
		
		ctx.moveTo(0.5+graphOffsetX+j*graphScaleX,0);
		ctx.lineTo(0.5+graphOffsetX+j*graphScaleX,height-graphOffsetY);
	}
	for (let i=0;i<height/gridScaleY()/graphScaleY;i++) { // Horizontal lines
		let j=Math.floor(i*gridScaleY())

		ctx.moveTo(graphOffsetX,height-(0.5+graphOffsetY+j*graphScaleY));
		ctx.lineTo(width,       height-(0.5+graphOffsetY+j*graphScaleY));
	}
	ctx.stroke();
	ctx.fillStyle="black"
	for (let i=0;i<height/gridScaleY()/graphScaleY;i++) {
		let j=Math.floor(i*gridScaleY())

		let text=`${j}`
		let w=ctx.measureText(text).width;
		ctx.fillText(text,graphOffsetX-w-5,height-(graphOffsetY+j*graphScaleY)+5);
	}
	for (let i=0;i<width/gridScaleX()/graphScaleX;i++) {
		let j=Math.floor(i*gridScaleX())

		ctx.fillText(j,graphOffsetX+j*graphScaleX-5,height-graphOffsetY+15);
	}

	ctx.fillStyle="lightblue";
	ctx.strokeStyle="blue";
	ctx.lineWidth=0.5;
	for (let p of data) {
		let pos=getPointPos(p);
		ctx.beginPath();
		ctx.arc(
			pos.x,
			pos.y,
			pointSize,0,Math.PI*2);

		ctx.fill();
		ctx.stroke();
	}

	if (hoverPoint!==-1) {
		ctx.save();
		ctx.fillStyle="blue";
		ctx.strokeStyle="lightblue";
		ctx.lineWidth=2;
		ctx.shadowBlur=7;
		ctx.shadowColor="black"

		let p=data[hoverPoint];
		let pos=getPointPos(p);

		ctx.beginPath();
		ctx.arc(
			pos.x,
			pos.y,
			pointSize+3,0,Math.PI*2
		);
		

		ctx.fill();
		ctx.stroke();
		
		let text=`(${p.x.toFixed(2)},${p.y.toFixed(2)})`;

		let boxX=pos.x+posBoxOffsetX;
		let boxY=pos.y+posBoxOffsetY;
		let boxW=ctx.measureText(text).width+posBoxPad*2;
		let boxH=posTextFontSize+posBoxPad*4;
		boxX=Math.max(Math.min(boxX,width-boxW),0);
		boxY=Math.max(Math.min(boxY,height-boxH),0);

		ctx.fillStyle="#111";
		ctx.fillRect(
			boxX,
			boxY,
			boxW,
			boxH
		);
		ctx.fillStyle="#eee";
		ctx.shadowBlur=0;
		ctx.shadowOffsetX=ctx.shadowOffsetY=1.5;
		ctx.shadowColor="#777";
		ctx.fillText(
			text,
			boxX+posBoxPad,
			boxY+posBoxPad+posTextFontSize
		);

		ctx.restore();
	}
}

gsxEl.onchange();

c.onmousemove=(ev)=>{
	let point=-1;
	let dist=null;
	let mx=ev.offsetX;
	let my=ev.offsetY;
	let i=0;
	for (let p of data) {
		let pos=getPointPos(p)
		let d=Math.hypot(mx-pos.x,my-pos.y);
		if (d<100 && (!dist || d<dist)) {
			point=i;
			dist=d;
		}
		i++
	}
	if (point!==-1)hoverPoint=point;
	draw();

}