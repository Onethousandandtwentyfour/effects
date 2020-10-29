let randomInt=( min, max )=>{
	return Math.round(randomFloat(min, max));
}
let randomFloat=( min, max )=>{
	return Math.random() * ( max - min ) + min;
}
let degreesToRads=(degrees)=>{
	return degrees / 180 * Math.PI;
}
let lerp_easeInOutCubic=(normal,min,max)=>{
  normal = easeInOutCubic(normal);
  return min + (max - min)*normal;
}
let normal=(value,min,max)=>{
  return (value - min)/(max - min);
}
let easeInOutCubic=(nor)=>{
    if ((nor/=0.5) < 1)
			return 0.5*Math.pow(nor,3);
    else
    	return 0.5 * (Math.pow((nor-2),3) + 2);
}

export {
	randomInt,
	randomFloat,
	degreesToRads,
	lerp_easeInOutCubic,
	normal,
	easeInOutCubic
}