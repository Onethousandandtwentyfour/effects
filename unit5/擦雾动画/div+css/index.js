var app = new Vue({
	el: '#app',
	data: {
		showType: 'dom', //擦除类型  dom 新建dom  boxshadow  新建阴影
		isDown: false, //鼠标是否被按下
		circleNodes: [], //多次点击生成的circle集合
		curCircleNodes: [], //单次点击生成的额circle集合
		curCircleNodesIndex: -1, //curCircleNodes  填充到 circleNodes 的位置
	},
	computed: {
		// dom
		circleStyleComputed() {
			return (temp, index) => {
				return {
					transform: (temp && temp.transform) || '',
					'--animation-index-': index * 1
				}
			}
		},
		circleClassComputed() {
			return (temp) => {
				return {
					'hide-circle': (temp && temp.aniStart) || false
				}
			}
		},
		// box-shadow 
		circleBSStyleComputed() {
			return (temp, index) => {
				let boxShadowArr = [],
					i;
				for (i = 0; i < temp.length; i++) {
					boxShadowArr.push(`${temp[i].x}px ${temp[i].y}px 40px #000000`);
				}
				return {
					'box-shadow': boxShadowArr.join(','),
					'--animation-index-': index * 1,
				};
			}
		},
		circleBSClassComputed(){
			return (item)=>{
				return {
					'hide-circle': (item[0] && item[0].aniStart) || false
				}
			}
		},
	},
	created() {
		let showType = localStorage.getItem('showType');
		this.showType = showType || 'dom';
	},
	mounted() {
		window.oncontextmenu = (ev) => {
			ev = ev || window.event;
			ev.preventDefault();
			let tips = ('dom' == this.showType && 'box-shadow') || 'dom';
			localStorage.setItem('showType', tips);
			alert(`即将切换到${tips}`);
			window.location.reload();
		}
	},
	methods: {
		//鼠标被按下
		startDraw(ev) {
			this.isDown = true;
			this.curCircleNodesIndex += 1;
		},
		//鼠标移动中
		drawContinue(ev) {
			if (this.isDown) {
				let {
					curCircleNodes
				} = this, //本次滑动生成的circle集合
				cur = curCircleNodes.length, {
						clientX: x,
						clientY: y
					} = ev,
					lastCircle = curCircleNodes[cur - 1], //最近一次填充的circle
					incrementArr = [];
				if (cur > 0) {
					//补齐空白
					let botnDistance = Math.ceil(this.bothParticleDistance({
							x,
							y
						}, lastCircle)),
						incrementX = ((x * 1 - curCircleNodes[cur - 1].x * 1) / botnDistance).toFixed(1),
						incrementY = ((y * 1 - curCircleNodes[cur - 1].y * 1) / botnDistance).toFixed(1); //单次增量x/y
					//增加个数,每1px增加一个circle
					for (let i = 0; i < botnDistance; i += 40) {
						let newCircle = {
							x: lastCircle.x + incrementX * (i + 1),
							y: lastCircle.y + incrementY * (i + 1),
							show: true,
							aniStart: false,
						};
						incrementArr.push({
							...newCircle,
							transform: `translate(${newCircle.x}px,${newCircle.y}px)`
						});
					}
				}
				//最新添加的一定是鼠标移动的点
				incrementArr.push({
					x,
					y,
					show: true,
					aniStart: false,
					transform: `translate(${x}px,${y}px)`
				});
				// console.log("incrementArr",incrementArr);
				this.curCircleNodes = curCircleNodes.concat(incrementArr);
				// console.log("this.curCircleNodes",this.curCircleNodes);
				this.$set(this.circleNodes, this.curCircleNodesIndex, this.curCircleNodes);
				// console.log("this.circleNodes",this.circleNodes);
			}
		},
		//鼠标被松开
		endDraw() {
			this.isDown = false;
			let {
				curCircleNodes
			} = this;
			for (let i = 0; i < curCircleNodes.length; i++) {
				curCircleNodes[i].aniStart = true;
			}
			this.$set(this.circleNodes, this.curCircleNodesIndex, curCircleNodes);
			this.curCircleNodes = [];

		},
		//计算两点之间的直线距离
		bothParticleDistance(p1, p2) {
			let xDifference = Math.abs(p1.x - p2.x),
				yDifferrnce = Math.abs(p1.y - p2.y);
			return Math.sqrt(Math.pow(xDifference, 2) + Math.pow(yDifferrnce, 2));
		},
		//动画结束 计数
		animateEnd(ev) {
			const {
				target: {
					dataset: {
						outer,
						inner
					}
				}
			} = ev;
			let curArr = this.circleNodes[outer * 1];
			// delete curArr[inner*1]//删除数组性能太差
			curArr[inner * 1].show = false;
			this.$set(this.circleNodes, outer * 1, curArr);
		},
	},
});
