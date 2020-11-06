class CanvasHandler{
	ctx=null;//canvas实例
	cvw=0;
	cvh=0;//canvas尺寸
	app=null;//vue实例
	constructor(app,canvasNode){
		this.app=app;
		this.ctx=canvasNode.getContext('2d');
		this.cvw=canvasNode.width;
		this.cvh=canvasNode.height;
	}
	//canvas尺寸更新
	resize(newSize){
		this.cvw=newSize.vw;
		this.cvh=newSize.vh;
	}
	//绘制图案
	draw(barInfo,particleInfo){
		this.ctx.clearRect(0,0,this.cvw,this.cvh);
		this.drawBg();
		this.drawBarByBatch(barInfo,particleInfo);
	}
	//绘制canvas渐变背景
	drawBg(){
		let gradient=this.ctx.createLinearGradient(0,0,this.cvw,this.cvh);
			gradient.addColorStop(0,'#fcd3db');
			gradient.addColorStop(1,'#d4fcff');
		this.ctx.save();
		this.ctx.fillStyle=gradient;
		this.ctx.fillRect(0,0,this.cvw,this.cvh);
		this.ctx.restore();
	}
	//单个绘制bar
	drawBarBySingle(bar){
		this.ctx.save();
		//bar
		this.ctx.fillStyle=bar.bgColor;
		this.ctx.fillRect(bar.x,bar.y,bar.width,bar.height);
		//progress 
		let gradient=this.ctx.createLinearGradient(bar.x,bar.y,bar.x + bar.width,bar.y + bar.height);
			gradient.addColorStop(0,bar.progressBgColor.begin);
			gradient.addColorStop(1,bar.progressBgColor.end);
		this.ctx.fillStyle=gradient;
		this.ctx.fillRect(bar.x,bar.y,bar.progress,bar.height);
		this.ctx.restore();
	}
	//批量绘制bar
	drawBarByBatch(barList,particleList){
		for(let i=0;i<barList.length;i++){
			//bar
			this.drawBarBySingle(barList[i]);
			//particle
			this.drawParticleByBatch(particleList[i]);
		}
	}
	//单个绘制prticle
	drawParticleBySingle(particle){
		let gradient=this.ctx.createLinearGradient(0,0,this.cvw,this.cvh);
			gradient.addColorStop(0,particle.progressBgColor.begin);
			gradient.addColorStop(1,particle.progressBgColor.end);
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.arc(particle.x,particle.y, particle.r, 0, 2 * Math.PI);
		this.ctx.fillStyle=gradient;
		this.ctx.fill();
		this.ctx.restore();
	}
	//批量绘制particle
	drawParticleByBatch(particleList){
		for(let i=0;i<particleList.length;i++){
			this.drawParticleBySingle(particleList[i]);
		}
	}
}

export {
	CanvasHandler
}