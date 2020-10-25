var app = new Vue({
	el: '#app',
	data: {
		vw: window.innerWidth,
		vh: window.innerHeight,
		animate: false,
		lastMouse: {
			x: 0,
			y: 0,
		},
		minMouseMove: 10,
		//白色渐变位置
		radialPosition: {
			x: '50%',
			y: '50%',
		},
		//图片碎片信息
		price: {
			nums: 200, //碎片数量
			styles: [], //碎片 位置/大小/背景位置/层级.. 信息
			animateClasses: [],
			levels: 5, //碎片分级
			bgIndex:1,
		},
		//鼠标移动导致碎片的偏移
		offset: {
			x: 0,
			y: 0,
		},
		animateEndNum: 0,
	},
	computed: {
		//price
		priceList() {
			return this.price.styles;
		},
		//白色渐变 位置computed
		radialPositionComputed() {
			return {
				'--box-radial-x-': this.radialPosition.x,
				'--box-radial-y-': this.radialPosition.y
			}
		},
		//屏幕长宽比
		bgBoxSizeComputed() {
			if (this.vw / this.vh > 1) {
				return {};
			} else {
				return {
					'--bg-size-': '350px'
				};
			}
		},
		//碎片偏移 computed
		priceStyleComputed() {
			return (index) => {
				if (!!this.price.styles[index]) {
					let z = this.price.styles[index]['z-index'];
					this.price.styles[index].transform = `translate(${this.offset.x*z*(0.02)}px,${this.offset.y*z*(0.02)}px)`;
					return this.price.styles[index];
				} else {
					return {};
				}
			}
		},
		//price-outer  class
		priceOuterClassComputed() {
			if(this.vw / this.vh > 1){
				return this.animate?'price-outer-show-pc':'price-outer-hide-pc';
			}else{
				return this.animate?'price-outer-show-mobile':'price-outer-hide-mobile';
			}
		},
		priceOuterDelay(){
			return (index)=>{
				return this.animate?(this.price.styles.length - index*1):index*1;
			}
		},
	},
	watch: {
		priceList(newVal) {
			if (newVal.length > 0) {
				this.animateStart();
			}
		}
	},
	mounted() {
		this.createPriceList();
	},
	methods: {
		//mousemove 事件
		mousemove(ev) {
			const {
				clientX,
				clientY
			} = ev;
			if (Math.abs(clientX - this.lastMouse.x) > this.minMouseMove || Math.abs(clientY - this.lastMouse.y) > this.minMouseMove) {
				//bg radial 
				let {
					radialPosition,
					lastMouse,
					offset
				} = this;
				radialPosition.x = `${(clientX/this.vw)*100}%`;
				radialPosition.y = `${(clientY/this.vh)*100}%`;
				lastMouse.x = clientX;
				lastMouse.y = clientY;
				//鼠标偏移距离
				let [px, py] = [clientX - this.vw / 2, clientY - this.vh / 2];
				offset.x = px;
				offset.y = py;
			}
		},
		//生成碎片
		createPriceList() {
			//boxWidth/boxHeight box盒子宽高
			let {
				offsetWidth: boxWidth,
				offsetHeight: boxHeight
			} = this.$refs.price_box,
				priceMaxSize = boxWidth / 2,
				minR = maxR = pw = 0,
				priceList = [];
				totalCopies=(this.price.levels + 1)*this.price.levels/2;
			//划分层级
			for (let i = 0; i < this.price.levels; i++) {
				//单一层级内price styles,  层级内  位置由中心向周围扩散，宽高由大渐小，z-index有小渐大
				for (let j = 0; j < (this.price.nums * (i + 1) / totalCopies); j++) {
					//单一层级内偏移范围
					minR = i / this.price.levels * priceMaxSize;
					maxR = (i + 1) / this.price.levels * priceMaxSize;
					//price的层级越高，尺寸越小
					pw = priceMaxSize / (i + 1);
					//存放 price具体styles 的list 
					priceList.push(this.createPriceStyle({
						boxWidth,
						boxHeight
					}, minR, maxR, pw, i + 1));
				}
			}
			this.$set(this.price, 'styles', priceList);
		},
		//生成碎片大小，样式，背景图偏移
		createPriceStyle(box, minR, maxR, w, z) {
			//生成具体的price的styles
			let styles = {
					'background-image': `url(bg${this.price.bgIndex}.jpg)`,
					'z-index': z,
					'animateClass': ''
				},
				deg = this.random(0, 360), //碎片所处位置 距离 中心点的角度
				r = this.random(minR, maxR), //碎片所处位置 距离 中心点的直线距离
				width = this.random(w * 0.8, w),
				height = this.random(w * 0.8, w),
				left = (box.boxWidth - width) / 2 + Math.cos(deg) * r,
				top = (box.boxHeight - height) / 2 + Math.sin(deg) * r;

			styles.width = width + 'px';
			styles.height = height + 'px';
			styles.left = left + 'px';
			styles.top = top + 'px';
			styles.backgroundPosition = (-1 * left) + 'px ' + (-1 * top) + 'px';
			return styles;
		},
		//随机数
		random(min, max) {
			return Math.random() * (max * 1 - min * 1) + min * 1;
		},
		//动画开始
		animateStart() {
			this.animate=true;
		},
		//动画结束
		animationEnd() {
			this.animateEndNum += 1;
			if(this.animateEndNum>=this.price.styles.length&&!this.animate){
				this.animateEndNum=0;
				this.price.styles=[];
				if(this.price.bgIndex>=3){
					this.price.bgIndex = 1;
				}else{
					this.price.bgIndex += 1;
				}
				this.createPriceList();
			}
		},
		//点击切换图片
		change(){
			if(this.animateEndNum<this.price.styles.length||!this.animate){
				return;
			}
			this.animateEndNum=0;
			this.animate=false;
		},
	},
})
