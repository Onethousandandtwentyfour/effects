import {
	CanvasControls
} from './canvas.js';
import {
	Particle
} from './Particle.js';
import {
	easeInOutCubic
} from './util.js';
var app = new Vue({
	el: '#app',
	data: {
		vw: window.innerWidth,
		vh: window.innerHeight,
		bothCanvasScaleRatio: 10, //离屏canvas 和 展示canvas 的尺寸比例
		hideCtx: null,
		showCtx: null,
		drawText: {
			text: 'HELLO WORD',
			font: 20,
			grid: 1,
			color: 'red',
			fill: false,
			r: 0,
			g: 0,
			b: 0,
			abs: 1,
		},
		animationInfo: {
			duration: 1000, //动画最大时间
			delay: 500, //动画延迟最大时间
		},
		particleList: [], //随机生成的像素点集合
		fps: 60,
		lastTime: 0,
		animationHandler: 'particleCollect', //下一步动画处理
	},
	mounted() {
		//初始化
		this.hideCtx = new CanvasControls(this, 'hide_canvas', true, this.drawText);
		this.showCtx = new CanvasControls(this, 'show_canvas', false);
		this.createParticles();
		this.particleCollect();
		this.frameAnimation();
	},
	methods: {
		//生成像素点
		createParticles() {
			let num = this.hideCtx.getEffectiveParticleList().length;
			num = (this.drawText.fill && ((num * 3 / 2).toFixed())) || num;
			let particleArr = [],
				i = 0;
			for (i = 0; i < num; i++) {
				//生成随机坐标实例
				particleArr.push(new Particle(this.hideCtx.getCanvasSize(), this.animationInfo));
			}
			this.particleList = particleArr;
		},
		//聚集
		particleCollect() {
			//合并文案像素点=>设置点的最终坐标为文案坐标
			//获取有文案的像素点集合
			let textParticleList = this.hideCtx.getEffectiveParticleList(),
				i, x, y;
			//将可以组成文案的例子集合  合并  到随机生成的像素点集合中
			for (i = 0; i < textParticleList.length; i++) {
				x = textParticleList[i].x;
				y = textParticleList[i].y;
				this.particleList[i].reset(x, y, this.animationInfo.delay, this.animationInfo.duration, true);
			}
			setTimeout(this.particleDisperse, 2000);
		},
		//分散
		particleDisperse(ev) {
			//分散=> 所有点的最终坐标随机
			for (let i = 0; i < this.particleList.length; i++) {
				this.particleList[i].reset();
			}
			setTimeout(this.particleCollect, 2000);
		},
		//color
		updateColor() {
			let {
				drawText
			} = this;
			drawText.b += drawText.abs;

			if (drawText.b >= 255) {
				drawText.g += 1;
				drawText.b = 255;
			} else if (drawText.b <= 0) {
				drawText.g -= 1;
				drawText.b = 0;
			}

			if (drawText.g >= 255) {
				drawText.r += 1;
				drawText.g = 255;
			} else if (drawText.b <= 0) {
				drawText.r -= 1;
				drawText.g = 0;
			}

			if (drawText.r >= 255) {
				drawText.abs = -1;
				drawText.r = 255;
			} else if (drawText.r <= 0) {
				drawText.abs = 1;
				drawText.r = 0;
			}
			this.drawText = drawText;
			return `rgb(${drawText.r},${drawText.g},${drawText.b})`;
		},
		//帧动画
		/**
		 * @param {Object} t   requestAnimation 距离第一次requestAnimation开始执行的时间间隔
		 */
		frameAnimation(t) {
			let nowTime = Date.now();
			if ((nowTime - this.lastTime) < (1000 / this.fps)) {
				requestAnimationFrame(this.frameAnimation);
				return;
			}
			this.lastTime = nowTime;

			this.particleList.forEach(item => {
				item.nextAnimatinFps(t || 0);
			});
			//绘制particle
			this.showCtx.drawCircleByPoints(this.particleList, this.bothCanvasScaleRatio, this.updateColor());
			requestAnimationFrame(this.frameAnimation);
		},

	}
});
