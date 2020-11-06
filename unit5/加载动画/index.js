import {CanvasHandler} from "./CanvasHandler.js";
import {Bar} from "./Bar.js";
import {Particle} from "./Particle.js";
var app=new Vue({
	el:'#app',
	data:{
		vw:window.innerWidth,
		vh:window.innerHeight,
		canvasHandlerInstance:null,
		barInstanceList:[],
		particleInstanceList:[[]],//每个bar都有自己的粒子
		fps:30,
		lastTime:0,
		showMenu:'',
	},
	computed:{
		btnClassComputed(){
			return `btn-${this.showMenu}`;
		},
		listBoxClassCompted(){
			return `list-box-${this.showMenu}`;
		},
	},
	mounted(){
		window.onresize=this.resize;
		window.oncontextmenu=this.contentMenu;
		this.initBar();
		// this.draw();
		this.animationFrame();
	},
	methods:{
		resize(){
			// this.vw=window.innerWidth;
			// this.vh=window.innerHeight;
			// this.canvasHandlerInstance.resize({vw:this.vw,vh:this.vh});
			// for(let i=0;i<this.barInstanceList.length;i++){
			// 	this.barInstanceList[i].resize({vw:this.vw,vh:this.vh});
			// }
			// this.draw();
		},
		//获取canvas实例，bar实例
		initInstance(barNum=[]){
			//canvas
			this.canvasHandlerInstance= (!this.canvasHandlerInstance&&(new CanvasHandler(this,this.$refs.show_canvas)))||this.canvasHandlerInstance;
			//bar
			let barInstanceList=[],i;
			for(i=0;i<barNum.length;i++){
				if(barNum[i].show){
					barInstanceList.push(new Bar(this.$refs.show_canvas,barNum[i].rw,barNum[i].rh,barNum[i].rx,barNum[i].ry,barNum[i].isReal));
				}
			}
			this.barInstanceList=barInstanceList;
		},
		//定义bar大小，位置...&实例化
		initBar(){
			let bar=[{
				rw:0.8,
				rh:0.1,
				rx:0.1,
				ry:0.45,
				isReal:false,
				show:true,
			},
			{
				rw:0.8,
				rh:0.1,
				rx:0.1,
				ry:0.25,
				isReal:false,
				show:true,
			},
			{
				rw:0.8,
				rh:0.1,
				rx:0.1,
				ry:0.85,
				isReal:false,
				show:true,
			}
			];
			this.particleInstanceList=[[]];
			this.initInstance(bar);
		},
		//绘制图形
		draw(){
			//bar 进度更新
			let {particleInstanceList}=this,//已创建粒子集合
				increment=0.005,//progresss 增量
				i;
			for(i=0;i<this.barInstanceList.length;i++){
				this.barInstanceList[i].progressUpdate(increment);
				//每一帧生成particleNum个粒子，回收不可用粒子（isActive)
				let particleNum=10,
					newParticleList=[],//新生成的粒子
					curParticleList=particleInstanceList[i],//当前bar已有粒子
					filterParticleList=[],//过滤结束动画的粒子
					j;
				for(j=0;j<particleNum;j++){
					newParticleList.push(new Particle((this.barInstanceList[i].x*1 + this.barInstanceList[i].progress*1),this.barInstanceList[i].y,Math.random(),this.barInstanceList[i].progressBgColor));
				}
				//过滤已结束动画的粒子
				curParticleList.forEach(item=>{
					if(item.isActive){
						item.nextAnimationFps();
						filterParticleList.push(item);
					}
				});
				this.$set(this.particleInstanceList,i,filterParticleList.concat(newParticleList));
			}
			this.canvasHandlerInstance.draw(this.barInstanceList,this.particleInstanceList);
		},
		//动画帧
		animationFrame(){
			if(this.showMenu){
				requestAnimationFrame(this.animationFrame);
				return;
			}
			let nowTime=Date.now();
			if((nowTime - this.lastTime)<(1000/this.fps)){
				requestAnimationFrame(this.animationFrame);
				return;
			}
			this.lastTime=nowTime;
			this.draw();
			requestAnimationFrame(this.animationFrame);
		},
		//右键菜单
		contentMenu(ev){
			var ev = ev || window.event;
			ev.preventDefault();
			this.showMenu='show';
		},
		//关闭菜单
		closeMenu(){
			this.showMenu='hide';
		},
		menuAnimationEnd(){
			if('hide'==this.showMenu){
			console.log("动画结束",this.showMenu);
				this.showMenu='';
			}
		},
		//是否开启bar
		openBar(ev){
			const {index}=ev.target.dataset;
			
		},
	},
});
