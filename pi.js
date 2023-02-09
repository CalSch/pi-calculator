function circleCurve(x) {
	return Math.sqrt(1-(x**2))
}
function dist(x1,y1,x2,y2) {
	return Math.sqrt( (x2-x1)**2 + (y2-y1)**2 )
}

/**
 * @param {number} verts
 */
function calcPi(verts) {
	let points=[];
	let distSum=0;
	let lastPoint=null;

	for (let i=0;i<verts;i++) {
		let x=-1+(i*2)/(verts-1)
		let y=circleCurve(x);
		points.push([x,y])
	}
	for (let p of points) {
		if (lastPoint===null) {
			lastPoint=p;
			continue;
		}
		let d=dist(p[0],p[1],lastPoint[0],lastPoint[1]);
		distSum+=d;
		lastPoint=p;
	}

	return distSum;
}