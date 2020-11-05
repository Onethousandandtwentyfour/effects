var app=new Vue({
	el:'#app',
	data:{
		vw:window.innerWidth,
		vh:window.innerHeight,
		animationDur:3,//单位 s
		animaionFill:'hsl(320,60%,50%)',
		lgAnimationState:'paused',
	},
	computed:{
		xAnimationDurComputed(){
			return `${this.animationDur}s`;
		},
		waterAnimationDurComputed(){
			return `${this.animationDur*3}s`;
		},
		yAnimationDurComputed(){
			let numStr=this.waterAnimationDurComputed.split('s')[0]*1;
			return `${numStr*2}s`;
		},
		waterFill(){
			return (index)=>{
				return {
					'stroke':'none',
					'fill':(index==1&&this.animaionFill)||'hsl(200,60%,50%)',
				}
			}
		},
		lgAnimationComputed(){
			return {
				'animation-play-state':this.lgAnimationState,
				'animation-duration':this.yAnimationDurComputed
			}
		},
	},
	methods:{
		animationStateChange(){
			this.lgAnimationState=('paused'==this.lgAnimationState&&'running')||'paused';
		}
	},
});