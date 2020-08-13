var app=new Vue({
	el:"#app",
	data:{
		lastMouse:{
			x:0,
			y:0
		},
		minMoveLength:1,
		maxEyeMoveLength:25,
		leftMove:{
			x:0,
			y:0,
		},
		rightMove:{
			x:0,
			y:0
		}
	},
	computed:{
		leftEyeComputed(){
			return {transform:`translate(${this.leftMove.x}px,${this.leftMove.y}px)`}
		},
		rightEyeComputed(){
			return {transform:`translate(${this.rightMove.x}px,${this.rightMove.y}px)`}
		},
		leftEyelidComputed(){
			return  {transform:`translateY(${this.leftMove.y*100/84}%)`}
		},
		rightEyelidComputed(){
			return  {transform:`translateY(${this.rightMove.y*100/84}%)`}
		}
	},
	methods:{
		//鼠标移动
		mousemove(ev){
			let mouseX=mouseY=0;
			if('touchmove'==ev.type){
				mouseX=ev.changedTouches[0].clientX;
				mouseY=ev.changedTouches[0].clientY;
			}else{
				mouseX=ev.clientX;
				mouseY=ev.clientY;
			}
			
			if(Math.abs(mouseX -  this.lastMouse.x)>this.minMoveLength||Math.abs(mouseY - this.lastMouse.y)>this.minMoveLength){
				this.lastMouse={
					x:mouseX,
					y:mouseY
				};
			}else{
				console.log("滑动距离不足以触发移动");
				return;
			}
			//leftEyeW/leftEyeH 左侧眼睛box的宽高
			//rightEyeW/rightEyeH 右侧眼睛box的宽高
			//mouseX/mouseY 鼠标位置
			//leftEyeX/leftEyeY 左侧眼睛box在屏幕上的位置
			//rightEyeX/rightEyeY 右侧眼睛box在屏幕上的位置
			let {offsetWidth:leftEyeW,offsetHeight:leftEyeH}=this.$refs.left_eye,
				{offsetWidth:rightEyeW,offsetHeight:rightEyeH}=this.$refs.right_eye,
				{left:leftEyeX,top:leftEyeY,}=this.$refs.left_eye.getBoundingClientRect(),
				{left:rightEyeX,top:rightEyeY}=this.$refs.right_eye.getBoundingClientRect();
			
			//left_eye_center / right_eye_center 圆心坐标
			let left_eye_center={x:leftEyeX + leftEyeW/2,y:leftEyeY + leftEyeH/2},
				right_eye_center={x:rightEyeX + rightEyeW/2,y:rightEyeY + rightEyeH/2};
				
			this.eyesMove(this.lastMouse,left_eye_center,0);
			this.eyesMove(this.lastMouse,right_eye_center,1);
			
		},
		//眼睛移动
		eyesMove(mousePoint,centralPoint,index){
			//鼠标位置与eye中心位置的差值
			let differenceX = mousePoint.x - centralPoint.x,
				differenceY = mousePoint.y - centralPoint.y;
			//距离
			let distance=Math.sqrt(Math.pow(differenceX,2) + Math.pow(differenceY,2));
			//角度
			// let rotate=Math.atan(Math.abs(differenceY)/Math.abs(differenceX))*180/Math.PI;
			let rotate=Math.atan(Math.abs(differenceY)/Math.abs(differenceX));
			if(differenceX>=0&&differenceY<0){
				//右上
				if(distance>this.maxEyeMoveLength){
					// 鼠标在眼睛之外
					this.ouerEyeDirection(this.maxEyeMoveLength,rotate,1,index);
				}else{
					// 鼠标移入眼睛
					this.innerEyeDirection(differenceX,differenceY,index);
				}
				
			}else if(differenceX<0&&differenceY<0){
				//左上
				if(distance>this.maxEyeMoveLength){
					// 鼠标在眼睛之外
					this.ouerEyeDirection(this.maxEyeMoveLength,rotate,2,index);
				}else{
					// 鼠标移入眼睛
					this.innerEyeDirection(differenceX,differenceY,index);
				}
			}else if(differenceX<0&&differenceY>=0){
				//左下
				if(distance>this.maxEyeMoveLength){
					// 鼠标在眼睛之外
					this.ouerEyeDirection(this.maxEyeMoveLength,rotate,3,index);
				}else{
					// 鼠标移入眼睛
					this.innerEyeDirection(differenceX,differenceY,index);
				}
			}else if(differenceX>=0&&differenceY>=0){
				//右下
				if(distance>this.maxEyeMoveLength){
					// 鼠标在眼睛之外
					this.ouerEyeDirection(this.maxEyeMoveLength,rotate,4,index);
				}else{
					// 鼠标移入眼睛
					this.innerEyeDirection(differenceX,differenceY,index);
				}
			}
		},
		//outer eye 移动方向
		//length 直线距离 rotate  角度 directino 鼠标所在方向 index 眼睛标识
		ouerEyeDirection(length,rotate,direction,index){
			let [x,y]=[Math.abs(Math.cos(rotate)*length),Math.abs(Math.sin(rotate)*length)];
			switch(direction*1){
				case 1:
					x=x;
					y=-1*y;
				break;
				case 2:
					x=-1*x;
					y=-1*y;
				break;
				case 3:
					x=-1*x;
					y=y;
				break;
				case 4:
					x=x;
					y=y;
				break;
			}
			if(index==0){
				//left 
				this.leftMove={x,y};
			}else{
				//right
				this.rightMove={x,y};
			}
		},
		//inner eye 移动
		//differenncecX/differenceY 坐标差值
		innerEyeDirection(differenceX,differenceY,index){
				if(index==0){
					this.leftMove={x:differenceX,y:differenceY};
				}else{
					this.rightMove={x:differenceX,y:differenceY};
				}
		},
		//test
		test(ev){
			console.log(ev);
			console.log("touch");
		}
	}
})
