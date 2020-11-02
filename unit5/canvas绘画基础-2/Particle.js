import {
	randomInt,
	randomFloat,
	degreesToRads,
	lerp_easeInOutCubic,
	normal,
	easeInOutCubic
} from  './util.js';

class Particle{
	x=0;
	y=0;//位置
	vx=0;
	vy=0;//速度
	r=0;//半径
	color='';//填充色
	cvw=0;
	cvh=0;//画布尺寸
	
	//构造函数
	constructor(position){
		this.x=randomFloat(position.x[0],position.x[1]);
		this.y=randomFloat(position.y[0],position.y[1]);
		this.vx=randomFloat(position.vx[0],position.vx[1]);
		this.vy=randomFloat(position.vy[0],position.vy[1]);
		this.r=position.r;
		this.color=position.color;
	}
	
	// 下一帧
	nextAnimation(canvasNode){
		this.cvw=canvasNode.width;
		this.cvh=canvasNode.height;
		let {x,y,r,vx,vy}=this;
		x += vx;
		y += vy;
		//x轴移动方向
		if((x - r)<0){
			x=r;
			vx = Math.abs(vx);
		}else if((x + r)>this.cvw){
			x=this.cvw - r;
			vx = -1*Math.abs(vx);
		}                        
		//y轴移动方向
		if((y - r)<0){
			y=r;
			vy = Math.abs(vy);
		}else if((y + r)>this.cvh){
			y=this.cvh - r;
			vy = -1*Math.abs(vy);
		}
		Object.assign(this,{x,y,vx,vy});
	}
	
}
export {
	Particle
}