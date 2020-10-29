import {
	randomInt,
	randomFloat,
	degreesToRads,
	lerp_easeInOutCubic,
	normal,
	easeInOutCubic
} from './util.js';


class Particle {
	x = 0;
	y = 0; //当前位置
	startX = 0;
	startY = 0; //开始位置
	endX = 0;
	endY = 0; //结束位置
	duration = 1000; //持续时间 默认1s
	delay = 500; //延迟时间 默认0.5s
	color = ''; //小球颜色
	t = 0;//单次动画已执行时间
	old = 0;//当前时间 距离第一次requestAnimationFrame的callback被执行时的时间 的时间间隔
	positionArea = null; //像素点范围
	isAuto=false;//是否是自由像素点，不参与文案的组成，在动画结束后用来判定新动画的初始值
	//构造函数
	constructor(positionArea,animationInfo) {
		this.positionArea = positionArea;
		this.duration=(animationInfo&&animationInfo.duration)||this.duration;
		this.delay=(animationInfo&&animationInfo.delay)||this.delay;
		this.reset();
	}

	//重置单次动画参数
	/**
	 * ex/ey  本次动画结束坐标
	 * delay 本次动画开始延迟时间
	 * duration 本次动画持续时间
	 */
	reset = (ex, ey, delay, duration,isAuto=false) => {
		this.isAuto=isAuto;//默认为自由像素点
		this.t = 0;
		this.old = 0;
		//若delay有值，在0到delay之间区随机整数，否则在0到3000之间取随机整数
		this.delay = (delay && randomInt(0, delay)) || randomInt(0, 1000);
		this.duration = duration || this.duration;
		this.x = this.x || randomInt(0, this.positionArea.width);
		this.y = this.y || randomInt(0, this.positionArea.height);
		this.startX = this.x;
		this.startY = this.y;
		this.endX = ex || randomInt(0, this.positionArea.width);
		this.endY = ey || randomInt(0, this.positionArea.height);
	}

	//下一帧
	nextAnimatinFps = (t) => {
		if (!this.old) {
			//old 在一段动画结束后会被重置为0，当重新被赋值时代表下一次动画开始
			this.old = t;
		}
		this.t = t - this.old;//本次动画已经执行的时间
		if (this.t >= this.delay) {//为true 表示当前已经超过延迟时间，开始移动particle
			if (this.t > (this.duration + this.delay)) {
				//当前动画执行执行结束
				if(!this.isAuto){
					this.reset();
				}
			} else {
				//动画执行中=> particle移动中
				this.lerp();
			}
		}
	}

	/**
	 * nor 当前时间 占 本次动画总时间duration(不包括delay) 的百分比
	 */
	lerp = () => {
		let nor;
		if (this.t > this.delay) {//动画开始移动
			nor = normal(this.t - this.delay, 0, this.duration);
			this.x = lerp_easeInOutCubic(nor, this.startX, this.endX);
			this.y = lerp_easeInOutCubic(nor, this.startY, this.endY);
		}
	}

}

export {
	Particle
}
