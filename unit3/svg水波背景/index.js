var app = new Vue({
	el: "#app",
	data: {
		sw: window.innerWidth,
		sh: window.innerHeight,
		viewBox: '',
		//初始波纹
		initCircles: [{
			stroke: {
				from: 'hsla(0,0%,0%,0.4)',
				to: 'hsla(0,0%,0%,0)'
			},
			r: {
				from: 4,
				to: 60
			}
		}, {
			stroke: {
				from: 'hsla(0,0%,0%,0.4)',
				to: 'hsla(0,0%,0%,0)'
			},
			r: {
				from: 14,
				to: 100
			}

		}, {
			stroke: {
				from: 'hsla(0,0%,0%,0.4)',
				to: 'hsla(0,0%,0%,0)'
			},
			r: {
				from: 24,
				to: 150
			}

		}, {
			stroke: {
				from: 'hsla(0,0%,0%,0.4)',
				to: 'hsla(0,0%,0%,0)'
			},
			r: {
				from: 34,
				to: 200
			}
		}],
		//每点击一次生成一个波纹
		gCircles: [],

	},
	created() {
		this.viewBox = `0 0 ${this.sw} ${this.sh}`;
	},
	methods: {
		//svg 点击 生成circles
		svgClick(ev) {
			let {
				clientX,
				clientY
			} = ev, {
				gCircles
			} = this,
			refName = `cbox-${gCircles.length}`;

			gCircles.push({
				refName,
				dur: '5s',
				stroke: 'hsla(0,0%,0%,0.4)',
				transform: `translate(${clientX},${clientY})`
			});

			this.gCircles = gCircles;

			this.$nextTick(() => {
				//波纹动画结束
				let currentIndex = this.gCircles.length - 1,
					animatedNum = 0,
					animateEnd = () => {
						animatedNum++;
						if (animatedNum >= animateNodes.length) {
							gCircles.splice(currentIndex, 1);
							animatedNum = 0;
							this.gCircles = gCircles;
							console.log("动画结束  " + animatedNum + "   " + animateNodes.length);
						} else {
							console.log("动画执行中  " + animatedNum + "   " + animateNodes.length);
						}
					}
				//异步 获取 animate ,开始动画
				let animateNodes = this.$refs[refName];
				for (let i = 0; i < animateNodes.length; i++) {
					animateNodes[i].beginElement();
					//onend 没找到立即触发的原因
					// animateNodes[i].onend = () => {
					// 	setTimeout(() => {
					// 		animateEnd();
					// 	}, this.gCircles[currentIndex].dur);
					// };
				}

			});
		},
	},
});
