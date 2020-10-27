import {
	Particle
} from './Particle.js';
var app = new Vue({
	el: '#app',
	data: {
		vw: window.innerWidth,
		vh: window.innerHeight,
		canvasText: {
			text: 'CANVAS',
			font: 200,
			grid: 5
		},
		ctx: null,
		particles: [], //可用像素点
		fps: 60,
		lastAnimationTime: 0,
		menuInfo: {
			hidden: false,
			width: 10,
			height: 10,
			top: 0,
			left: 0,
			opacity:0,
		}
	},
	computed: {
		canvasViewBoxComputed() {
			return `0  0 ${this.vw} ${this.vh}`;
		},
		menuTopLeftComputed() {
			return `width:${this.menuInfo.width}px;
					height:${this.menuInfo.height}px;
					top:${this.menuInfo.top}px;
					left:${this.menuInfo.left}px;}`
		},
	},
	mounted() {
		this.init();
		window.onresize = () => {
			this.vw = window.innerWidth;
			this.vh = window.innerHeight;
		}
		window.oncontextmenu = (ev) => {
			var ev = ev || window.event;
			ev.preventDefault();
			// this.menuInfo.hidden=false;
			this.showMenu(ev);
		}
		window.onclick = () => {
			this.hideMenu();
		}
	},
	methods: {
		//获取canvas
		init() {
			let canvasNode = this.$refs.canvas__a;
			this.ctx = canvasNode.getContext('2d');
			this.drawText();
			this.nextAanimtionFps();
		},
		//绘画
		drawText() {
			let text = this.canvasText;
			this.particles = [];
			let textCenter = {
				x: this.vw / 2,
				y: this.vh / 2
			};
			this.ctx.save();
			this.ctx.textAlign = 'center';
			this.ctx.textBaseline = 'middle';
			this.ctx.font = `bold  ${text.font}px Arial`;
			this.ctx.fillText(text.text, textCenter.x, textCenter.y);
			let ctxPxArr = this.ctx.getImageData(0, 0, this.vw, this.vh),
				buffer32 = new Uint32Array(ctxPxArr.data.buffer),
				prticles = [];
			for (let y = 0; y < this.vh; y += text.grid) {
				for (let x = 0; x < this.vw; x += text.grid) {
					if (buffer32[y * this.vw + x]) {
						prticles.push(new Particle(x, y, this));
					}
				}
			}
			this.particles = prticles;
			this.ctx.clearRect(0, 0, this.vw, this.vh);
			this.ctx.restore();
		},
		//下一帧
		nextAanimtionFps() {
			let nowDate = Date.now();
			if ((nowDate - this.lastAnimationTime) < (1000 / this.fps)) {
				requestAnimationFrame(this.nextAanimtionFps);
				return;
			}
			this.lastAnimationTime = nowDate;
			this.ctx.clearRect(0, 0, this.vw, this.vh);
			for (let i = 0; i < this.particles.length; i++) {
				this.particles[i].nextAnimationFps()
			}
			requestAnimationFrame(this.nextAanimtionFps);
		},
		//show menu
		showMenu(ev) {
			let {
				clientX: left,
				clientY: top
			} = ev, {
				menuInfo
			} = this;
			if ((left + menuInfo.width) > this.vw) {
				left -= menuInfo.width;
			}
			if ((top + menuInfo.height) > this.vh) {
				top -= menuInfo.height;
			}
			Object.assign(menuInfo, {
				hidden: true,
				left,
				top
			});
			this.menuInfo = menuInfo;
		},
		//hide menu
		hideMenu() {
			let {
				menuInfo
			} = this;
			Object.assign(menuInfo, {
				hidden: false,
				left: 0,
				top: 0
			});
			this.menuInfo = menuInfo;
		},

	},
});
