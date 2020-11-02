class CanvasHandler {
	ctx = null; //canvas  画布实例
	cvw = 0;
	cvh = 0; //画布尺寸

	//构造函数
	constructor(canvasNode) {
		this.ctx = canvasNode.getContext('2d');
		this.cvw = canvasNode.width;
		this.cvh = canvasNode.height;
	}

	//绘制小球和线段
	draw(particleList, lineList) {
		this.ctx.clearRect(0, 0, this.cvw, this.cvh);
		this.drawParticleByList(particleList);
		this.drawLineByList(lineList);
	}

	//绘制小球
	/**
	 * @param {Object} list 小球实例的集合
	 */
	drawParticleByList(list) {
		for (let i = 0; i < list.length; i++) {
			this.ctx.save();
			this.ctx.beginPath();
			this.ctx.arc(list[i].x, list[i].y, list[i].r, 0, 2 * Math.PI);
			this.ctx.fillStyle = list[i].color;
			this.ctx.fill();
			this.ctx.restore();
		}
	}

	//绘制线段
	/**
	 * @param {Object} list 线段端点集合
	 */
	drawLineByList(list) {
		for (let i = 0; i < list.length; i++) {
			this.ctx.strokeStyle = list[i].color;
			this.ctx.lineWidth = list[i].opacity;
			this.ctx.beginPath();
			this.ctx.moveTo(list[i].begin.x, list[i].begin.y);
			this.ctx.lineTo(list[i].end.x, list[i].end.y);
			this.ctx.stroke();
			this.ctx.closePath();
		}
	}



}

export {
	CanvasHandler
}
