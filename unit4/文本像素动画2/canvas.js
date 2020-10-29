class CanvasControls {
	isParsing = 'Uint32Array'; //解析ImgDate的方式
	app = null; //vue 实例
	ctx = null; //canvas 画布实例
	cvw = 0; //画布width
	cvh = 0; //画布height
	effectivePxArr = null; //有效的像素点集合
	drawTextInfo = { //绘制的文案信息
		text: 'CANVAS', //文案内容
		font: 20, //文案大小
		grid: 5, //像素点间距 单位1px
		color: 'black', //填充色
	};
	/**
	 * 有参构造函数
	 * app vue 实例
	 * canvasRef vue 节点钩子
	 * nowInit 是否在初始化后立即绘制文案(即立即获取有效像素点)
	 * drawTextInfo 将要绘制的文案信息
	 */
	constructor(app, canvasRef, nowInit, drawTextInfo = null) {
		this.app = app;
		this.ctx = this.app.$refs[canvasRef].getContext('2d');
		this.cvw = this.app.$refs[canvasRef].width;
		this.cvh = this.app.$refs[canvasRef].height;
		this.drawTextInfo = drawTextInfo || this.drawTextInfo;
		if (nowInit) {
			this.drawToGetEffectivePX();
		}
	}

	//更新文案 => 更新effectivePxArr
	init(text) {
		if (!text) return;
		Object.assign(this.drawTextInfo, {
			text
		});
		this.drawToGetEffectivePX();
	}

	//绘制文案，获取有效像素点
	drawToGetEffectivePX() {
		//首先清空最近一次的像素点
		this.effectivePxArr = [];
		//清空画布
		this.ctx.clearRect(0, 0, this.vw, this.vh);
		//重新绘制文案
		this.ctx.save();
		this.ctx.textAlign = 'center';
		this.ctx.textBaseline = 'middle';
		this.ctx.fillStyle = this.drawTextInfo.color;
		this.ctx.font = `bold  ${this.drawTextInfo.font}px Arial`;
		this.ctx.fillText(this.drawTextInfo.text, this.cvw / 2, this.cvh / 2);
		//获取画布上像素集合
		let pxArr = this.ctx.getImageData(0, 0, this.cvw, this.cvh);
		//保存最新的有效像素点
		this.effectivePxArr = 'Uint32Array' == this.isParsing ? this.parsingImgDataByUint32Array(pxArr) : this.parsingImgDataByCycle(
			pxArr);
		this.ctx.restore();
	}

	//解析像素点集合
	// plane 1 Uint32Array
	parsingImgDataByUint32Array(imgData) {
		let prticles = [];
		if (ImageData && ImageData.length > 0) {
			let buffer32 = new Uint32Array(imgData.data.buffer);
			for (let y = 0; y < this.cvh; y += this.drawTextInfo.grid) {
				for (let x = 0; x < this.cvw; x += this.drawTextInfo.grid) {
					if (buffer32[y * this.cvw + x]) {
						//文案所在的像素点坐标
						prticles.push({
							x,
							y
						});
					}
				}
			}
		}
		return prticles
	}

	// plane 2 cycle
	parsingImgDataByCycle(imgData) {
		let prticles = [];
		if (ImageData && ImageData.length > 0) {
			for (let i = 0; i < imgData.data.length; i += 4) {
				if (imgData.data[i] !== 0 || imgData.data[i + 1] !== 0 || imgData.data[i + 2] !== 0) {
					let x = (i / 4) % this.cvw,
						y = Math.floor(i / 4 / this.cvw);
					if (x % this.drawTextInfo.grid == 0 && y % this.drawTextInfo.grid == 0) {
						prticles.push({
							x,
							y
						});
					}
				}
			}
		}
		return prticles;
	}

	//获取canvas width&height
	getCanvasSize(){
		return {width:this.cvw,height:this.cvh};
	}

	//获取有效像素点集合
	getEffectiveParticleList(){
		return this.effectivePxArr;
	}

	//drw by particle instances list
	drawCircleByPoints(list, ratio,colors, r = 2) {
		this.ctx.clearRect(0,0,this.cvw,this.cvh);
		for (let i = 0; i < list.length; i++) {
			this.ctx.save();
			this.ctx.beginPath();
			this.ctx.arc(list[i].x * ratio, list[i].y * ratio, r, 0, 2 * Math.PI);
			this.ctx.fillStyle = colors;
			this.ctx.fill();
			this.ctx.restore();
		}
	}

}


export {
	CanvasControls
}
