import NumTube from './tube.js';
var app = new Vue({
	el: '#app',
	components: {
		'num-tube': NumTube
	},
	data() {
		return {
			state: 'time', //time 时间 date 日期
			clockState: [], //设置闹钟 时间段
			animationFrameSetting: {
				fps: 1000 / 1,
				lastDateTime: 0,
			},
			timeSettings: {
				week: 0,
				hours: {
					one: 0,
					ten: 0,
				},
				minutes: {
					one: 0,
					ten: 0,
				},
				seconds: {
					one: 0,
					ten: 0,
				}
			},
			alarmClock: {
				hasBeenSet: false,
				hours: {
					one: 0,
					ten: 0,
				},
				minutes: {
					one: 0,
					ten: 0,
				},
				seconds: {
					one: 0,
					ten: 0,
				}
			},
			clockStart:false,
			dateTimeout: 0,
			clockTimeout:0,
		}
	},
	computed: {
		hoursParse() {
			return (this.timeSettings.hours.ten * 10 + this.timeSettings.hours.one) > 12 ? 'PM' : 'AM';
		},
		weekParse() {
			return (index) => {
				return this.timeSettings.week == index ? 'setting-week' : ''
			}
		},
		alarmClockParse() {
			return this.alarmClock.hasBeenSet ? "setting-clock" : "cancel-clock";
		},
		alarmClockIconParse() {
			return "clock" == this.state ? "opacity-animation" : "";
		},
		setAlarmClockParse() {
			return (position) => {
				return 'clock' == this.state && this.clockState.includes(position) ? 'opacity-animation' : '';
			}
		},
		startClockParse(){
			return this.clockStart?"clock-content-box-start-clock":"";
		},
	},
	watch:{
		clockStart(newVal){
			if(newVal){
				clearTimeout(this.clockTimeout);
				this.clockTimeout=setTimeout(()=>{
					this.clockStart=false;
					clearTimeout(this.clockTimeout);
				},60000);
			}
		}
	},
	mounted() {
		this.animationFrame();
	},
	methods: {
		clockTap(ev) {
			clearTimeout(this.dateTimeout);
			const {
				type
			} = ev.currentTarget.dataset;
			if ('time' == this.state) {
				this.state = 'date';
				this.updateDate();
				//日期状态在3s后切换到时间状态
				this.dateTimeout = setTimeout(() => {
					this.state = 'time';
					clearTimeout(this.dateTimeout);
				}, 3000);
			} else if ('date' == this.state) {
				this.state = 'time';
				this.updateTime();
			} else if ('clock' == this.state) {
				if (this.clockState.length == 3) {
					//退出设置闹钟
					this.state = 'time';
					if ('last' == type) {
						//仅退出
					} else {
						//退出且取消闹钟
						this.alarmClock.hasBeenSet = false;
					}
					this.clockState = [];
					this.updateTime();
				} else {
					//设置闹钟
					let temp = this.clockState[0],
						num = this.timeSettings[temp].ten * 10 + this.timeSettings[temp].one;
					if ('last' == type) {
						//减少
						num -= 1;
					} else {
						//增加
						num += 1;
					}
					if ('hours' == temp) {
						if (num < 0) num = 23;
						if (num > 23) num = 0;
					} else {
						if (num < 0) num = 59;
						if (num > 59) num = 0;
					}
					this.setTimeSettingNumByNumAndPosition(num, temp);
				}
			}
		},
		setClockTap() {
			this.clockStart=false;
			this.state = 'clock';
			this.alarmClock.hasBeenSet = true;
			if (this.clockState.length == 0) {
				this.clockState = ['hours', 'minutes', 'seconds'];
				Object.assign(this.timeSettings, this.alarmClock);
				return;
			} else if (this.clockState.length == 3) {
				this.clockState = ['hours'];
				return;
			}else if(this.clockState.length==1&&'hours'==this.clockState[0]){
				this.clockState = ['minutes'];
				return;
			}else if(this.clockState.length==1&&'minutes'==this.clockState[0]){
				this.clockState = ['seconds'];
				return;
			}else if(this.clockState.length==1&&'seconds'==this.clockState[0]){
				this.timeSettings.hasBeenSet=true;
				Object.assign(this.alarmClock,this.timeSettings);
				this.clockState=[];
				this.state='time';
				return;
			}
		},
		animationFrame() {
			let nowDateTime = Date.now();
			if ((nowDateTime - this.animationFrameSetting.lastDateTime) < this.animationFrameSetting.fps) {
				requestAnimationFrame(this.animationFrame);
				return;
			}
			this.animationFrameSetting.lastDateTime = nowDateTime;
			this.updateTime();
			requestAnimationFrame(this.animationFrame);
		},
		updateTime() {
			let timeSettings = JSON.parse(JSON.stringify(this.timeSettings)),
				nowDateTime = new Date(),
				hours = nowDateTime.getHours(),
				minutes = nowDateTime.getMinutes(),
				seconds = nowDateTime.getSeconds(),
				week = nowDateTime.getDay();
			timeSettings.week = week;
			// 时 
			timeSettings.hours.ten = this.getNumByIndex(hours, 1);
			timeSettings.hours.one = this.getNumByIndex(hours, 0);
			// 分 
			timeSettings.minutes.ten = this.getNumByIndex(minutes, 1);
			timeSettings.minutes.one = this.getNumByIndex(minutes, 0);
			// 秒
			timeSettings.seconds.ten = this.getNumByIndex(seconds, 1);
			timeSettings.seconds.one = this.getNumByIndex(seconds, 0);
			
			if(timeSettings.hours.ten==this.alarmClock.hours.ten&&
			timeSettings.hours.one==this.alarmClock.hours.one&&
			timeSettings.minutes.ten==this.alarmClock.minutes.ten&&
			timeSettings.minutes.one==this.alarmClock.minutes.one&&
			timeSettings.seconds.ten==this.alarmClock.seconds.ten&&
			timeSettings.seconds.one==this.alarmClock.seconds.one&&
			this.alarmClock.hasBeenSet
			){
				this.clockStart=true;
			}
			if ('time' == this.state) {
				this.timeSettings = timeSettings;
			}
		},
		updateDate() {
			let timeSettings = JSON.parse(JSON.stringify(this.timeSettings)),
				nowDateTime = new Date(),
				year = nowDateTime.getFullYear(),
				month = nowDateTime.getMonth() + 1,
				date = nowDateTime.getDate(),
				week = nowDateTime.getDay();
			timeSettings.week = week;
			//年
			timeSettings.hours.ten = this.getNumByIndex(year, 1);
			timeSettings.hours.one = this.getNumByIndex(year, 0);
			//月
			timeSettings.minutes.ten = this.getNumByIndex(month, 1);
			timeSettings.minutes.one = this.getNumByIndex(month, 0);
			//日
			timeSettings.seconds.ten = this.getNumByIndex(date, 1);
			timeSettings.seconds.one = this.getNumByIndex(date, 0);
			this.timeSettings = timeSettings;
		},
		setTimeSettingNumByNumAndPosition(num, position) {
			this.timeSettings[position].ten = this.getNumByIndex(num, 1);
			this.timeSettings[position].one = this.getNumByIndex(num, 0);
		},
		getNumByIndex(num, index) {
			num = num + '';
			if (!num) return 0;
			let numArr = num.split('').reverse();
			return numArr[index] && numArr[index] * 1 || 0;
		},
	},
});
