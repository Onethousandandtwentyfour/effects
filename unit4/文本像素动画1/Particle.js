//像素点
class Particle{
	app=null;
	initPoint=[0,0];
	x=0;//x坐标
	y=0;//y坐标
	r=1;//小球半径
	maxR=0;//最大半径
	rSpeed=0.2;//r增长速度
	isMaxR=false;//r是否已经增长到maxR
	vx=0;//x轴单位距离
	vy=0;//y轴单位距离
	g=0.05;//模拟重力加速度
	resistance=0.99;//阻力
	color='';//小球颜色
	_colors=[
      '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
      '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50',
      '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
      '#FF5722'
    ];//小球可选颜色
	//更新小球颜色
	setColor=()=>{
		this.color=this._colors[(Math.random()*16).toFixed(0)];
	}
	//更新vx，vy
	setSpeed=(speed,moveAngle)=>{
		this.vx = Math.cos(moveAngle) * speed;
		this.vy = Math.sin(moveAngle) * speed;
	}
	//有参构造函数
	constructor(x,y,app){
		this.app=app;
		this.initPoint=[x,y];
		this.reset();
	}
	
	//下一帧
	nextAnimationFps=()=>{
		this.x += this.vx;
		this.y += this.vy;
		this.vy += this.g;
		this.vy *= this.resistance;
		this.vx *= this.resistance;
		if(this.isMaxR){
			this.r += this.rSpeed;
			if(this.r>this.maxR){
				this.isMaxR=false;
			}
		}else{
			this.r -= this.rSpeed;
		}
		//绘画
		this.app.ctx.beginPath();
		this.app.ctx.fillStyle = this.color;
		this.app.ctx.arc(this.x,this.y,this.r,Math.PI*2,false);
		this.app.ctx.fill();
		
		if(this.r<1){
			this.reset();
		}
	}
	
	
	// 重置
	reset=()=>{
		this.x=this.initPoint[0];
		this.y=this.initPoint[1];
		this.r=1;
		this.isMaxR=true;
		this.setColor();
		this.setSpeed(randomFloat(0.1,1),randomInt(degreesToRads(0), degreesToRads(360)));
		this.maxR = randomInt(this.r + 1, this.r + 4);
	}
}

function randomInt( min, max ) {
	return Math.round(randomFloat(min, max));
}
function randomFloat( min, max ) {
	return Math.random() * ( max - min ) + min;
}
function degreesToRads(degrees) {
	return degrees / 180 * Math.PI;
}
 
export {Particle}