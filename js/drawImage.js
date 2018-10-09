/*显隐头像处理窗口*/
function displayDealBox(isShow){
	if(typeof isShow === 'boolean'){
		var dealBoxEl = document.getElementById('select_img_box_id');
		dealBoxEl.style.display = isShow ? 'inline-flex' : 'none';
	}
}

/*根据图片路径判断是否展示图像*/
function displayImage(imgUrl){
	var selectImgList = document.getElementsByClassName('selected_img');
	var hasImg = document.getElementById('has_img_id');
	var emptyImg = document.getElementById('empty_img_id');
	if(imgUrl){
		for(var i = 0, len = selectImgList.length; i < len; i++){
			selectImgList[i].src = imgUrl;
		}
		hasImg.style.display = 'block';
		emptyImg.style.display = 'none';
	}else {
		hasImg.style.display = 'none';
		emptyImg.style.display = 'block';
	}
	previewImage()
}

/*打开图片选择框*/
function openFile(){
	var openFileEl = document.getElementById('open_input_file_id');
	openFileEl.click();
}

/*选中图片确定后触发*/
function selectImage(file){
	if(!file.files || !file.files.length){
		return false;
	}
	var reader = new FileReader();
	reader.onload = function(evt){
		displayImage(evt.target.result)
	}
	reader.readAsDataURL(file.files[0]);
}

/*根据当前图片的选中区域预览裁剪部分*/
function previewImage(){
	var dynamicCircleEl = document.getElementById('dynamic_circle_box_id');
	var sourceImg = document.getElementById('dynamic_image_id');
	var ratio = sourceImg.naturalHeight / sourceImg.clientHeight;//注意：图片的原始尺寸/放置的尺寸
	drawImage('dynamic_image_id', 'canvas_100_id', dynamicCircleEl.offsetLeft * ratio, dynamicCircleEl.offsetTop * ratio, sourceImg.clientHeight, sourceImg.clientHeight, 0, 0, 100, 100);
	drawImage('dynamic_image_id', 'canvas_50_id', dynamicCircleEl.offsetLeft * ratio, dynamicCircleEl.offsetTop * ratio, sourceImg.clientHeight, sourceImg.clientHeight, 0, 0, 50, 50);
}

function drawImage(sourceId, destId, sx, sy, swidth, sheight, x, y, width, height){
	var destCanvas = document.getElementById(destId);
	var ctx = destCanvas.getContext("2d");
	var sourceImg = document.getElementById(sourceId);
	ctx.drawImage(sourceImg, sx, sy, swidth, sheight, x, y, width, height);
}
