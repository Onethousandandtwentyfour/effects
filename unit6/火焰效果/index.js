import ParticleGroup from './particleGroup.js';
const defaultSize={
	size:80,
};
const globalSize={
	size:20,
	defaultBg:'radial-gradient(rgba(0,0,255,0.8) 20%, rgba(0,0,255,0.1) 70%)',
};
var app = new Vue({
	el:'#app',
	data(){
		return {
			particleList:(new ParticleGroup(defaultSize)).particles,
			globalParticleList:(new ParticleGroup(globalSize)).particles,
			play:false,
			triangePlay:false,
		}
	},
	computed:{
		particleStyle(){
			return this.play?"particle-play":"";
		},
		triangeStyle(){
			return this.triangePlay?"particle-play":"";
		},
	},
	methods:{
		particlePlayTap(){
			this.play=!this.play;
		},
		triangePlayTap(){
			this.triangePlay=!this.triangePlay;
		},
	},
});