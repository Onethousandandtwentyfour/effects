import NumBlock from './num-block.js';
var app = new Vue({
	el: '#app',
	components: {
		"num-block": NumBlock,
	},
	data() {
		return {
			dateTimeSettings: {
				year: [0, 0, 0, 0],
				month: [0, 0],
				date: [0, 0],
				hours: [0, 0],
				minutes: [0, 0],
				seconds: [0, 0],
			},
			animationFrameSettings: {
				state:'paused',
				fps: 1000 / 1,
				lastTime: 0,
				iterationCount: 'infinite', //执行次数
				hasBeenExecuted: 0, //已执行
			},
			beforeClickTime:0,
			bgSkins:[
				'imgs/clock-bg.png',
				'imgs/clock-bg-2.png',
				'imgs/clock-bg-3.png',
				'imgs/clock-bg-4.png',
			],
			bgSkinsIndex:0,
		}
	},
	computed:{
		numKey(){
			return (num,flag)=>{
				return `numKey_${num}_${flag}`;
			}
		},
		aniStateText(){
			return 'running'==this.animationFrameSettings.state?'关闭':'开启';
		},
		skinsBgStyle(){
			return {
				'--clock-bg-url':`url(${this.bgSkins[this.bgSkinsIndex]})`,
			}
		},
		skinsBtnsStyle(){
			return (src,index)=>{
				return {
					'top':`${60 + index*30}px`,
					'background-image':`url(${src})`,
					'border':`2px solid ${index==this.bgSkinsIndex?'green':'transparent'}`,
				}
			}
		},
	},
	mounted() {
		this.animationFrame();
	},
	methods: {
		changeAniState(){
			let nowDateTime = Date.now();
			if((nowDateTime - this.beforeClickTime)<1000){
				return;
			}
			this.beforeClickTime = nowDateTime;
			'running'==this.animationFrameSettings.state?(this.animationFrameSettings.state='paused',this.resetDateTime()):this.animationFrameSettings.state='running';
		},
		changeBgSkin(ev){
			this.bgSkinsIndex = ev.currentTarget.dataset.index;
		},
		animationFrame() {
			if ('strring' != (typeof this.animationFrameSettings.iterationCount) && this.animationFrameSettings.hasBeenExecuted >=
				this.animationFrameSettings.iterationCount) {
				return;
			}
			if('paused'==this.animationFrameSettings.state){
				requestAnimationFrame(this.animationFrame);
				return;
			}
			let nowTime = Date.now();
			if ((nowTime - this.animationFrameSettings.lastTime) < (this.animationFrameSettings.fps)) {
				requestAnimationFrame(this.animationFrame);
				return;
			}
			this.animationFrameSettings.lastTime = nowTime;
			this.updateDateTime();
			this.animationFrameSettings.hasBeenExecuted += 1;
			requestAnimationFrame(this.animationFrame);
		},
		updateDateTime() {
			const nowDateTime = new Date(),
				nowDay = nowDateTime.getDay();
			this.dateTimeSettings = {
				year: this.numFillZeroByLengthToArr(nowDateTime.getFullYear(), 4),
				month: this.numFillZeroByLengthToArr(nowDateTime.getMonth() + 1, 2),
				date: this.numFillZeroByLengthToArr(nowDateTime.getDate(), 2),
				hours: this.numFillZeroByLengthToArr(nowDateTime.getHours(), 2),
				minutes: this.numFillZeroByLengthToArr(nowDateTime.getMinutes(), 2),
				seconds: this.numFillZeroByLengthToArr(nowDateTime.getSeconds(), 2),
			};
		},
		resetDateTime(){
			this.dateTimeSettings={
				year: [0, 0, 0, 0],
				month: [0, 0],
				date: [0, 0],
				hours: [0, 0],
				minutes: [0, 0],
				seconds: [0, 0],
			};
		},
		numFillZeroByLengthToArr(num, length) {
			return (num + '').padStart(length, '0').split('');
		}
	},
});
