class ParticleGroup {
 	defaultBg = 'radial-gradient(#ff5000 20%, rgba(255, 80, 0, 0) 70%)';//粒子背景
 	defaultTotal = 100;//生成数量,如果修改这里，animation-delay与 animation-time都需要按比例修改
 	particles = [];//生成结果
	defaultIncrement=40;//偏移基础 

 	constructor(styles) {
		this.defaultBg=styles.defaultBg||this.defaultBg;
		this.initParticles(styles);
 	}

 	initParticles = styles => {
 		this.particles = [];
 		for (let i = 0; i < this.defaultTotal; i++) {
 			this.particles.push({
				id:`${i}_particle`,
 				width: `${styles.size}px`,
 				height: `${styles.size}px`,
 				background: this.defaultBg,
				position:'absolute',
				left:`${this.randomNumByMinAndMax(-1*this.defaultIncrement,this.defaultIncrement) - styles.size/2}px`,
				bottom:'0px',
				'--particle-x':this.randomNumByMinAndMax(-15,15),
				'--particle-y':-200,
				'animation-delay':`${i*0.01}s`,
				'animation-play-state':'paused',
 			});
 		}
 	}
	
	
	randomNumByMinAndMax=(min,max)=>{
		return min + (Math.random()*(max - min));
	}
 }

 export default ParticleGroup;
