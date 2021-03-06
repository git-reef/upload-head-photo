var mouseX = 0, mouseY = 0;//鼠标的起始（点击）位置
var targetX = 0, targetY = 0;//dom元素的起始位置
var isMouseDown = false;//true为可以改变裁剪圆位置
var minRadius = 15; //最小圆半径为15
var isOnResize = false;//true为可以改变裁剪圆大小

/*
 * 裁剪圆上按下事件，开始拖拽改变位置
 */
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
/*
 * 图片框上的移动事件，可以触发裁剪圆的拖拽和缩放动作
 */
function mouseMove(evt){
	if(!isMouseDown && !isOnResize){
		return false;
	}
	if(isMouseDown){
		moveCircle(evt);
	}
	if(isOnResize){
		resizeCircle(evt);
	}
	previewImage()
}
/*
 * 图片框上的抬起事件，表示动作结束
 */
function mouseUp(){
	isMouseDown = false;
	isOnResize = false;
}

/*
 * 将像素改变为数字
 */
function getNumberFormPixel(pixel){
	var result = 0;
	if(typeof pixel !== 'string' || pixel.lastIndexOf('px') < 2){
		return result;
	}
	result = Number(pixel.slice(0, pixel.length - 2));
	return typeof result === 'number' ? result : 0;
}

/*
 * 缩放圆上的按下事件，表示开始缩放裁剪圆
 */
function resize_mouseDown(evt){
	mouseX = evt.screenX;
	mouseY = evt.screenY;
	isOnResize = true;
	isMouseDown = false;
	evt.preventDefault();
	return false;
}

/*移动裁剪圆位置*/
function moveCircle(evt){
	var el = document.getElementById('dynamic_circle_box_id');
	var offsetX = evt.screenX - mouseX, offsetY = evt.screenY - mouseY;
	/*上边界*/
	if(targetY + offsetY < 0){
		offsetY = - targetY;
	}
	/*右边界*/
	if(el.clientWidth + targetX + offsetX > limitWidth){
        offsetX = limitWidth - (el.clientWidth + targetX);
	}
	/*下边界*/
	if(el.clientHeight + targetY + offsetY > limitHeight){
		offsetY = limitHeight - (el.clientHeight + targetY);
	}
	/*左边界*/
	if(targetX + offsetX < 0){
		offsetX = -targetX;
	}
	el.style.left = (targetX + offsetX) + 'px';
	el.style.top = (targetY + offsetY) + 'px';
	console.log('left:'+el.style.left+'------top:'+el.style.top)
	
	var img = document.getElementById('dynamic_image_id');
	img.style.left = -(targetX + offsetX) + 'px';
	img.style.top = -(targetY + offsetY) + 'px';
}
/*改变裁剪圆大小*/
function resizeCircle(evt){
	var circleEl = document.getElementById('dynamic_circle_box_id');
	var maskEl = document.getElementById('mask_id');
	var offsetX = evt.screenX - mouseX, offsetY = evt.screenY - mouseY;
	var offsetRadius = 0;
	
	mouseX = evt.screenX;
	mouseY = evt.screenY;
	
	//计算增加或减少的半径
	switch (true){
		case offsetX > 0 && offsetY > 0:
			offsetRadius = Math.max(offsetX, offsetY);
			break;
		case offsetX < 0 && offsetY < 0:
			offsetRadius = Math.min(offsetX, offsetY);
			break;
		case offsetX > 0 && offsetY < 0:
			offsetRadius = Math.min(offsetX, offsetY);
			break;
		case offsetX < 0 && offsetY > 0:
			offsetRadius = Math.max(offsetX, offsetY);
			break;
		default:
			break;
	}
	//最小圆半径控制
	if(offsetRadius < 0 && circleEl.clientWidth + offsetRadius < minRadius){
		circleEl.style.width = minRadius + 'px';
		circleEl.style.height = minRadius + 'px';
		return true;
	}
	//边界处理
	if(circleEl.offsetLeft + circleEl.clientWidth + offsetRadius <= maskEl.clientWidth && circleEl.offsetTop + circleEl.clientHeight + offsetRadius <= maskEl.clientHeight){
		circleEl.style.width = circleEl.clientWidth + offsetRadius + 'px';
		circleEl.style.height = circleEl.clientHeight + offsetRadius + 'px';
	}else if(circleEl.offsetLeft + circleEl.clientWidth + offsetRadius > maskEl.clientWidth){
		circleEl.style.width = maskEl.clientWidth - circleEl.offsetLeft + 'px';
	}else if(circleEl.offsetTop + circleEl.clientHeight + offsetRadius > maskEl.clientHeight){
		circleEl.style.height = maskEl.clientHeight - circleEl.offsetTop + 'px';
	}
}
