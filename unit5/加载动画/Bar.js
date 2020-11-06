class Bar{
	rw=0;
	rh=0;//比例大小  0~100%
	rx=0;
	ry=0;//比例位置 0~100%
	cvw=0;
	cvh=0;//容器尺寸
	width=0;
	height=0;//真实大小
	x=0;
	y=0;//真实位置
	bgColor='rgba(0,0,0,0.2)';//底色
	progressBgColor={
		begin:'black',//'#d4fcff',
		end:'white',//'#fcd3db',
	};//进度渐变色
	progress=0;//进度
	isReal=false;//true 不使用比例尺寸，rw,rh,rx,ry既是width,height,x,y
	
	constructor(canvasNode,rw,rh,rx,ry,isReal){
		this.cvw=canvasNode.width;
		this.cvh=canvasNode.height;
		this.rw=rw;
		this.rh=rh;
		this.rx=rx;
		this.ry=ry;
		
		this.isReal=isReal;
		this.sizeRatioChange();
	}
	
	//比例尺寸转换
	sizeRatioChange(){
		const {isReal,cvw,cvh}=this;
		if(isReal){
			cvw=1;
			cvh=1;
		}
		this.width=cvw*this.rw;
		this.height=cvh*this.rh;
		this.x=cvw*this.rx;
		this.y=cvh*this.ry;
		
	}
	
	//容器尺寸更新
	resize(newSize){
		this.cvw=newSize.vw;
		this.cvh=newSize.vh;
		this.sizeRatioChange();
	}
	
	// progress 更新
	progressUpdate(increment=0.0001){
		if(this.progress>=this.width){
			this.progress=0;
		}
		this.progress = (this.progress*1 + increment*1*this.width).toFixed(4);
	}
	
	
	
	
	
	
}

export {
	Bar
}