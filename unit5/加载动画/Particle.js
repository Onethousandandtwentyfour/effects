class Particle{
	x=0;
	y=0;
	r=1;
	vx=0;
	vy=0;
	//默认左上角
	xd=false;//true  x轴正方向 false  x轴反方向
	yd=false;//true  y轴正方向 false  y轴反方向
	g=0.1;
	opacity=1;
	opacityRedutionSpeed=0.01;//透明度 衰减量
	progressBgColor={
		begin:'#d4fcff',
		end:'#fcd3db',
	};//背景渐变色
	isActive=true;
	
	constructor(x,y,r,progressBgColor){
		this.reset(x,y,r,progressBgColor);
	}
	
	
	//下一帧
	nextAnimationFps(){
		//抛物线
		//水平方向匀速
		this.x += this.vx;
		//垂直方向匀加速
		this.y += this.vy;
		this.vy += this.g;
		//透明度
		this.opacity=Math.max(0,this.opacity - this.opacityRedutionSpeed);
		if(this.opacity==0){
			this.isActive=false;//动画结束，在下一帧开始前会被过滤掉
		}
	}
	
	
	//重置
	reset(x,y,r,progressBgColor){
		this.x=x;
		this.y=y;
		this.r=r||this.r;
		this.opacity=1;
		this.progressBgColor=progressBgColor;
		this.vx = ((this.xd&&1)||-1)*(0.8 + Math.random()*1);
		this.vy = ((this.yd&&1)||-1)*(1 + Math.random()*3);
	}
}

export {
	Particle
}