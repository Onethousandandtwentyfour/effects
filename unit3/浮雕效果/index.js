var app = new Vue({
	el: '#app',
	data: {
		blur: 0, //高斯模糊
		grayscale: 0, //饱和度
		dropShadow: 0, //投影
		sepia: 0, //褐色效果
		brightness: 0.9, //亮度 可以超过1
		contrast: 1, //对比度
		hueRotate: 0, //旋转色相
		invert: 0, //反相
		saturate: 1, //饱和度
		opacity: 1, //透明度0
		backgroundBlendModeValue:'normal',
		mixBlendModeValue:'normal',
		selects:[
			'normal',
			'darken',
			'lighten',
			'multiply',
			'screen',
			'color-burn',
			'color-dodge',
			'overlay',
			'hard-light',
			'soft-light',
			'difference',
			'exclusion',
			'hue',
			'saturation',
			'color',
			'luminosity',
		],
	},
	computed: {
		topImgFilter() {
			const dropShadow=this.dropShadow!=0?`drop-shadow(0 0 ${this.dropShadow}px gold)`:'';
			return {
				'filter': `blur(${this.blur}px) 
				grayscale(${this.grayscale}) 
				${dropShadow}
				sepia(${this.sepia}) 
				brightness(${this.brightness}) 
				contrast(${this.contrast}) 
				hue-rotate(${this.hueRotate}deg) 
				invert(${this.invert}) 
				saturate(${this.saturate}) 
				opacity(${this.opacity})`
			};
		},
	},
	methods: {

	},
});
