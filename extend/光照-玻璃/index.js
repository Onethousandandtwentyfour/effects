var app=new Vue({
	el:'#app',
	data:{
		glassBeforeRotate:-45,
		startMouseMove:false,
		vwSelf:window.innerWidth/2,
		vhSelf:window.innerHeight/2,
		last:{
			x:0,
			y:0,
		}
	},
	methods:{
		mouseDown(ev){
			console.log("mouse---down");
			this.startMouseMove=true;
			let {screenX:x,screenY:y}=ev;
			this.last={x,y};
		},
		mouseMove(ev){
			if(!this.startMouseMove) return;
			console.log("mouse---move");
			let {screenX,screenY}=ev;
			if(Math.abs(screenX-this.last.x)>5||Math.abs(screenY-this.last.y)>5){
				this.last={
					x:screenX,
					y:screenY,
				};
				this.changeMoveRotate();
			}
		},
		mouseUp(ev){
			console.log("mouse---up");
			this.startMouseMove=false;
			this.last={x:0,y:0};
		},
		//计算移动 rotate
		changeMoveRotate(){
			let lW=this.last.x*1 - this.vwSelf*1,
				lH=this.last.y*1 - this.vhSelf*1;
			this.glassBeforeRotate = (Math.atan(lH/lW)*180/Math.PI)%360;
			console.log(this.glassBeforeRotate);
		},
	}
});
