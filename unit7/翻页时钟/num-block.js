const numBlock = {
	name: 'numBlock',
	props: {
		nextNum: {
			type: Number,
			default: 0,
		}
	},
	data() {
		return {
			bgNum: 0,
			flipNum: 0,
			aniActive: false,
			topNumRefName: (function() {
				return `topNumBlock_${(Math.random()*100).toFixed(0)}`
			})(),
			bottomNumRefName: (function() {
				return `bottomNumBlock_${(Math.random()*100).toFixed(0)}`
			})(),
			numPosition: {
				top: {
					x: 0,
					y: 0,
				},
				bottom: {
					x: 0,
					y: 0,
				}
			},
		}
	},
	computed: {
		aniActiveClass() {
			return this.aniActive ? 'active' : ''
		},
		bgPositionStyle() {
			return (position) => {
				return {
					'background-position-x': `-${this.numPosition[position].x}px`,
					'background-position-y': `-${this.numPosition[position].y}px`,
				}
			}
		},
	},
	watch: {
		nextNum(newVal) {
			this.aniActive = true;
			this.flipNum = this.nextNum;
		}
	},
	mounted() {
		// this.initWindowVisibility();
		this.updateBgPosition();
	},
	methods: {
		initWindowVisibility() {
			//监听网页可见||不可见
			let hiddenProperty = 'hidden' in document ? 'hidden' :
				'webkitHidden' in document ? 'webkitHidden' :
				'mozHidden' in document ? 'mozHidden' :
				null;
			let visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
			let onVisibilityChange = () => {
				if (!document[hiddenProperty]) {
					this.onShow();
				} else {
					this.onHide();
				}
			}
			document.addEventListener(visibilityChangeEvent, onVisibilityChange)
		},
		onShow() {
			console.log("show");
		},
		onHide() {
			console.log("hide");
		},
		updateBgPosition() {
			const {
				x: tx,
				y: ty
			} = this.$refs[this.topNumRefName].getBoundingClientRect(), {
				x: bx,
				y: by
			} = this.$refs[this.bottomNumRefName].getBoundingClientRect();
			this.numPosition = {
				top: {
					x: tx,
					y: ty,
				},
				bottom: {
					x: bx,
					y: by,
				}
			};
		},
		numAnimationEnd(ev) {
			if ('flip-down' == ev.animationName) {
				this.aniActive = false;
				this.bgNum = this.flipNum;
			}
		},
	},
	template: `<div class="num-outer-box"  :class="aniActiveClass">
					<div class="num-box top-num" :style="bgPositionStyle('top')" :ref="topNumRefName">
						<div class="num-inner-box top-num-text">{{flipNum}}</div>
					</div>
					<!-- <div class="num-box top-shadow hide-shadow-ani"></div>-->
					<div class="num-box top-center flip-up-ani" :style="bgPositionStyle('top')">
						<div class="num-inner-box top-num-text" >{{bgNum}}</div>
					</div>
					<div class="num-box bottom-num" :style="bgPositionStyle('bottom')" :ref="bottomNumRefName">
						<div class="num-inner-box bottom-num-text">{{bgNum}}</div>
					</div>
					<!-- <div class="num-box bottom-shadow show-shadow-ani"></div>-->
					<div class="num-box bottom-center flip-down-ani" @animationend="numAnimationEnd" :style="bgPositionStyle('bottom')">
						<div class="num-inner-box bottom-num-text">{{flipNum}}</div>
					</div>
				</div>`,
};
export default numBlock;
