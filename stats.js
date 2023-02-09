/** @type {Object<number,{verts:number,pi:number,time:number}>} */
let runStats={};
// data=[]
function run(verts) {
	let start=Date.now();
	let res=calcPi(verts);
	let end=Date.now();

	return {
		pi: res,
		time: end-start
	}
}
let lastId=0;
function genData() {
	// data=[];
	for (let i=0;i<25;i++,lastId++) {
		let v=100+i*100000;
		let calc=run(v);

		runStats[lastId]={
			verts: v,
			pi: calc.pi,
			time: calc.time
		}

		data.push({
			x: i*1,
			y: calc.time,
			id: lastId
		})
	}
	draw();
}