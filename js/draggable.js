var mouseX = 0, mouseY = 0;//鼠标的起始（点击）位置
var targetX = 0, targetY = 0;//dom元素的起始位置
var isMouseDown = false;//是否按下
function mouseDown(evt){
	if(!isOnResize){
		var el = evt.currentTarget;
		targetX = getNumberFormPixel(el.style.left);
		targetY = getNumberFormPixel(el.style.top);
		mouseX = evt.screenX;
		mouseY = evt.screenY;
		isMouseDown = true;
	}
	evt.preventDefault();
	return false;
}
function mouseMove(evt){
	if(isMouseDown){
		var el = evt.currentTarget;
		var offsetX = evt.screenX - mouseX, offsetY = evt.screenY - mouseY;
		el.style.left = (targetX + offsetX) + 'px';
		el.style.top = (targetY + offsetY) + 'px';
		console.log('left:'+el.style.left+'------top:'+el.style.top)
		
		var img = document.getElementById('dynamic_image_id');
		img.style.left = -(targetX + offsetX) + 'px';
		img.style.top = -(targetY + offsetY) + 'px';
		
		previewImage()
	}
}
function mouseUp(evt){
	isMouseDown = false;
}

function getNumberFormPixel(pixel){
	var result = 0;
	if(typeof pixel !== 'string' || pixel.lastIndexOf('px') < 2){
		return result;
	}
	result = Number(pixel.slice(0, pixel.length - 2));
	return typeof result === 'number' ? result : 0;
}



/*change circle size*/
var isOnResize = false;
function resize_mouseDown(evt){
	isOnResize = true;
	mouseX = evt.screenX;
	mouseY = evt.screenY;
//	evt.preventDefault();
//	return false;
}
function resize_mouseMove(evt){
	if(isOnResize){
		var offsetX = evt.screenX - mouseX, offsetY = evt.screenY - mouseY;//鼠标的偏移
		var offsetValue = Math.min(offsetX, offsetY);//取最小值
		var circleEl = document.getElementById('dynamic_circle_box_id');
		circleEl.style.width = circleEl.clientWidth + offsetValue + 'px';
		circleEl.style.height = circleEl.clientHeight + offsetValue + 'px';
		mouseX = evt.screenX;
		mouseY = evt.screenY;
	}
}
function resize_mouseUp(evt){
	isOnResize = false;
}

/*如果鼠标在遮罩上移动，则重置isOnResize*/
function clearMouseState(){
//	isOnResize = false;
}
