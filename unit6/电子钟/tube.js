let numTube = {
 	name: 'numTube',
	props:{
		num:{
			type:Number,
			default:8,
		}
	},
 	data() {
 		return {
			currSetting:{
				'middleCenter':'light-tube',
				'upLeft':'light-tube',
				'upRight':'light-tube',
				'upCenter':'light-tube',
				'downLeft':'light-tube',
				'downRight':'light-tube',
				'downCenter':'light-tube',
			},
 			tubeSettings:[
				{
					'middleCenter':'dark-tube',
					'upLeft':'light-tube',
					'upRight':'light-tube',
					'upCenter':'light-tube',
					'downLeft':'light-tube',
					'downRight':'light-tube',
					'downCenter':'light-tube',
				},
				{
					'middleCenter':'dark-tube',
					'upLeft':'dark-tube',
					'upRight':'light-tube',
					'upCenter':'dark-tube',
					'downLeft':'dark-tube',
					'downRight':'light-tube',
					'downCenter':'dark-tube',
				},
				{
					'middleCenter':'light-tube',
					'upLeft':'dark-tube',
					'upRight':'light-tube',
					'upCenter':'light-tube',
					'downLeft':'light-tube',
					'downRight':'dark-tube',
					'downCenter':'light-tube',
				},
				{
					'middleCenter':'light-tube',
					'upLeft':'dark-tube',
					'upRight':'light-tube',
					'upCenter':'light-tube',
					'downLeft':'dark-tube',
					'downRight':'light-tube',
					'downCenter':'light-tube',
				},
				{
					'middleCenter':'light-tube',
					'upLeft':'light-tube',
					'upRight':'light-tube',
					'upCenter':'dark-tube',
					'downLeft':'dark-tube',
					'downRight':'light-tube',
					'downCenter':'dark-tube',
				},
				{
					'middleCenter':'light-tube',
					'upLeft':'light-tube',
					'upRight':'dark-tube',
					'upCenter':'light-tube',
					'downLeft':'dark-tube',
					'downRight':'light-tube',
					'downCenter':'light-tube',
				},
				{
					'middleCenter':'light-tube',
					'upLeft':'light-tube',
					'upRight':'dark-tube',
					'upCenter':'light-tube',
					'downLeft':'light-tube',
					'downRight':'light-tube',
					'downCenter':'light-tube',
				},
				{
					'middleCenter':'dark-tube',
					'upLeft':'dark-tube',
					'upRight':'light-tube',
					'upCenter':'light-tube',
					'downLeft':'dark-tube',
					'downRight':'light-tube',
					'downCenter':'dark-tube',
				},
				{
					'middleCenter':'light-tube',
					'upLeft':'light-tube',
					'upRight':'light-tube',
					'upCenter':'light-tube',
					'downLeft':'light-tube',
					'downRight':'light-tube',
					'downCenter':'light-tube',
				},
				{
					'middleCenter':'light-tube',
					'upLeft':'light-tube',
					'upRight':'light-tube',
					'upCenter':'light-tube',
					'downLeft':'dark-tube',
					'downRight':'light-tube',
					'downCenter':'light-tube',
				},
			],
 		}
 	},
	watch:{
		num(newVal){
			!!newVal,this.currSetting=this.tubeSettings[newVal];
		},
	},
	mounted(){
		this.currSetting=this.tubeSettings[this.num];
	},
 	template: `<div class="number-tube-outer">
				<div class="tube middle-center-tube" :class="currSetting.middleCenter"></div>
				<div class="tube up-left-tube" :class="currSetting.upLeft"></div>
				<div class="tube up-right-tube" :class="currSetting.upRight"></div>
				<div class="tube up-center-tube" :class="currSetting.upCenter"></div>
				<div class="tube down-left-tube" :class="currSetting.downLeft"></div>
				<div class="tube down-right-tube" :class="currSetting.downRight"></div>
				<div class="tube down-center-tube" :class="currSetting.downCenter"></div>
			</div>`,
 }
 export default numTube;
