var app = new Vue({
	el: '#app',
	data() {
		return {
			focusX:50,
			focusY:50,
			centerOfCircleX:50,
			centerOfCircleY:50,
		}
	},
	computed:{
		radialGradientSettings(){
			return (dataName)=>{
				return `${this[dataName]}%`
			}
		},
	},
});
