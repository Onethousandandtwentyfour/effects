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
		animateState:'',// collect 聚集  disperse 分散
		animationHandlerName:'animateControl',
		drawText: {
			text: 'HELLO WORD',
			font: 20,
			grid: 1,
			color: 'red',
			fill: false,//是否只生成 文案所需的像素点
			r: 0,
			g: 0,
			b: 0,
			rf:1,
			gf:1,
			bf:1,
		},
		animationInfo: {
			duration: 1000, //动画最大时间
			delay: 500, //动画延迟最大时间
		},
		particleList: [], //随机生成的像素点集合
		fps: 60,
		lastTime: 0,
		isPause:false,//暂停动画
		pauseT:0,
		show:'',//是否展示控制面板
		textInput:'',
	},
	mounted() {
		window.oncontextmenu = (ev) => {
			var ev = ev || window.event;
			ev.preventDefault();
			this.show='show';
		}
		//初始化
		this.hideCtx = new CanvasControls(this, 'hide_canvas', true, this.drawText);
		this.showCtx = new CanvasControls(this, 'show_canvas', false);
		this.createParticles();
		this.frameAnimation();
	},
	methods: {
		//双击
		animationHandler(){
			if(this.animationHandlerName){
				this[this.animationHandlerName]();
			}
		},
		animateControl(){
			if('collect'==this.animateState){
				this.animateState='disperse';
				this.particleDisperse();
			}else if('disperse'==this.animateState){
				this.animateState='collect';
				this.particleCollect();
			}else{
				this.animateState='collect';
				this.particleCollect();
			}
			this.animationHandlerName='';
			setTimeout(()=>{
				this.animationHandlerName='animateControl';
			},2000);
		},
		// hideMenu
		hideMenu(){
			this.show='hide';
		},
		//更新文案像素点
		updateDrawText(){
			if(this.textInput){
				this.hideCtx.init(this.textInput);
				setTimeout(()=>{
					this.textInput='';
				},100);
			}
		},
		//暂停  继续
		pauseOrStart(){
			this.isPause=!this.isPause;
			if(!this.isPause){
				//继续 
				this.frameAnimation(this.pauseT);
				this.pauseT=0;
			}
		},
		//生成像素点
		createParticles() {
			let num = this.hideCtx.getEffectiveParticleList().length;
			num = (!this.drawText.fill && 2000) || num;
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
				{particleList}=this,
				i, x, y;
			//将可以组成文案的例子集合  合并  到随机生成的像素点集合中
			for (i = 0; i < particleList.length; i++) {
				if(i<textParticleList.length){
					x = textParticleList[i].x;
					y = textParticleList[i].y;
					particleList[i].reset(x, y, this.animationInfo.delay, this.animationInfo.duration, true);
				}else{
					particleList[i].reset();
				}
			}
			this.particleList=particleList;
		},
		//分散
		particleDisperse() {
			//分散=> 所有点的最终坐标随机
			for (let i = 0; i < this.particleList.length; i++) {
				this.particleList[i].reset();
			}
		},
		//color
		updateColor() {
			let {
				drawText
			} = this;
			drawText.b += drawText.bf;
			if(drawText.b>255){
				drawText.b=255;
				drawText.g += drawText.gf;
			}else if(drawText.b<100){
				drawText.b=100;
				drawText.g += drawText.gf;
			}
			
			if(drawText.g>255){
				drawText.g=255;
				drawText.r += drawText.rf;
			}else if(drawText.g<100){
				drawText.g=100;
				drawText.r += drawText.rf;
			}
			
			if(drawText.r>255){
				drawText.r=255;
				drawText.bf=-1*drawText.bf;
				drawText.gf=-1*drawText.gf;
				drawText.rf=-1*drawText.rf;
			}else if(drawText.r<100){
				drawText.r=100;
				drawText.bf=-1*drawText.bf;
				drawText.gf=-1*drawText.gf;
				drawText.rf=-1*drawText.rf;
			}
			
			this.drawText = drawText;
			return `rgb(${drawText.r},${drawText.g},${drawText.b})`;
		},
		//帧动画
		/**
		 * @param {Object} t   requestAnimation 距离第一次requestAnimation开始执行的时间间隔
		 */
		frameAnimation(t) {
			//暂停
			if(this.isPause){
				this.pauseT=t;
				return;
			}
			
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
