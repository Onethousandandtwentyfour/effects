import {CanvasHandler} from './canvas.js';
import {Particle} from './Particle.js';
import {randomInt} from './util.js'
var app = new Vue({
	el: '#app',
	data: {
		vw: window.innerWidth,
		vh: window.innerHeight,
		config: { //小球配置项
			base: {
				r: 2,
				color: 'gold',
				maxSpeed: 1,
				minSpeed: 0.1,
				particleNum: 300,
			},
			line:{
				min:100,
				lineWidth:1,
				color:'gold',
			},
			mouse:{
				color:'silver',
				r:4,//鼠标点 半径
				min:100,//自由点距鼠标点 触发 集合/分散 的最小距离
			},
			position: null, //初始位置区间及速度区间选项
		},
		canvasInstance:null,
		particleList: null, //小球实例集合
		fps:60,
		lastTime:0,
	},
	mounted() {
		window.onresize = this.reSize;
		this.initCanvasInstance();
		this.initPosiotnConfig();
		this.createParticle();
		this.animationFrame();
	},
	methods: {
		//重置窗口尺寸
		reSize() {
			this.vw = window.innerWidth;
			this.vh = window.innerHeight;
			this.initCanvasInstance();
		},
		//初始化canvasInstance 
		initCanvasInstance(){
			this.canvasInstance=new CanvasHandler(this.$refs.canvas_box);
		},
		//初始化小球位置及速度区间配置项
		initPosiotnConfig() {
			const {
				config: {
					base
				}
			} = this;
			//4个方向 0-3 => 上下左右
			this.config.position = [{ //上  小球位于顶部上方，向下方移动
					x: [0, this.vw],
					y: [-1 * base.r, -1 * base.r],
					vx: [-1 * base.maxSpeed, base.maxSpeed], //x轴方向随机
					vy: [base.minSpeed, base.maxSpeed], //y轴方向必须向下 =>  vy>0
				},
				{ //下  小球位于底部下方，向上方移动
					x: [0, this.vw],
					y: [(this.vh + base.r), (this.vh + base.r)],
					vx: [-1 * base.maxSpeed, base.maxSpeed], //x轴方向随机
					vy: [-1 * base.maxSpeed, -1 * base.minSpeed], //y轴方向必须向上 =>  vy<0
				},
				{ //左  小球位于左边缘左侧，向右侧移动
					x: [-1 * base.r, -1 * base.r],
					y: [0, this.vh],
					vx: [base.minSpeed, base.maxSpeed], //x轴方向上必须向右  =>  vx>0
					vy: [-1 * base.maxSpeed, base.maxSpeed], //y轴方向随机
				},
				{ //右  小球位于右边缘右侧，向左侧移动
					x: [(this.vw + base.r), (this.vw + base.r)],
					y: [0, this.vh],
					vx: [-1 * base.maxSpeed, -1 * base.minSpeed], //x轴方向上必须向左  =>  vx<0
					vy: [-1 * base.maxSpeed, base.maxSpeed], //y轴方向随机
				},
			];
		},
		//创建小球
		createParticle() {
			//鼠标滑动小球
			let mouseInfo={
				x:[-10,-10],
				y:[-10,-10],
				vx:[0,0],
				vy:[0,0],
				r:0,
				color:this.config.mouse.color,
			},
			mouseParticle=new Particle(mouseInfo);
			//自由运动小球
			let particleList = [mouseParticle],
				position={...this.config.base},
				i;
			for (i = 0; i < this.config.base.particleNum; i++) {
				Object.assign(position,this.config.position[randomInt(0, 3)]);
				particleList.push(new Particle(position));
			}
			this.particleList=particleList;
		},
		// 帧动画
		animationFrame(){
			const nowTime=Date.now();
			if((nowTime - this.lastTime)<(1000/this.fps)){
				requestAnimationFrame(this.animationFrame);
				return;
			}
			this.lastTime=nowTime;
			this.active();
			for(let i=0;i<this.particleList.length;i++){
				this.particleList[i].nextAnimation(this.$refs.canvas_box);
			}
			let lineList=this.bothParticleIsLine();
			this.canvasInstance.draw(this.particleList,lineList);
			requestAnimationFrame(this.animationFrame);
		},
		//判断任意两个小球之间是否要划线
		bothParticleIsLine(){
			let {particleList,config:{line:{color,lineWidth}}}=this,i,j,opacity,lineList=[];
			for(i=0;i<particleList.length;i++){
				//每一个小球要与除了自己外所有小球做判断
				for(j=i + 1;j<particleList.length;j++){
					let disTanceRotita=this.bothParticleDistance(particleList[i],particleList[j])/this.config.line.min;
					if(disTanceRotita<1){
						opacity=1 - disTanceRotita;
						lineList.push({
							begin:particleList[i],
							end:particleList[j],
							opacity,
							color,
							lineWidth,
						});
					}
				}
			}
			return lineList;
		},
		//计算任意两个小球之间的距离
		bothParticleDistance(p1,p2){
			let xDifference=Math.abs(p1.x - p2.x),
				yDifferrnce=Math.abs(p1.y - p2.y);
			return Math.sqrt(Math.pow(xDifference,2) + Math.pow(yDifferrnce,2));
		},
		//鼠标悬浮点 小球
		drawMouseParticle(ev){
			let {clientX:x,clientY:y}=ev;
			Object.assign(this.particleList[0],{x,y,r:this.config.mouse.r});
		},
		//鼠标移出屏幕
		hideMouseParticle(){
			Object.assign(this.particleList[0],{x:-10,y:-10,r:0});
		},
		//自由点 向 鼠标点靠拢
		active(){
			if(this.particleList[0].r!=0){
				//鼠标点坐标
				let {x,y}=this.particleList[0],i;
				for(i=1;i<this.particleList.length;i++){
					let distance=this.bothParticleDistance(this.particleList[0],this.particleList[i]);
					if(distance<=this.config.mouse.min){
						//x轴偏移
						if(this.particleList[i].x - x>0){
							this.particleList[i].vx = -1*Math.abs(this.particleList[i].vx);
						}else{
							this.particleList[i].vx = Math.abs(this.particleList[i].vx);
						}
						//y轴偏移
						if(this.particleList[i].y - y>0){
							this.particleList[i].vy = -1*Math.abs(this.particleList[i].vy);
						}else{
							this.particleList[i].vy = Math.abs(this.particleList[i].vy);
						}
					}
				}
			}
		},
	},
});
