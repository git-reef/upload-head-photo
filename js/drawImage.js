var limitWidth = 0, //图片放置之后的真实宽高，对于裁剪圆动作过程中限制其范围时有用
	limitHeight = 0;

/*显隐头像处理窗口*/
function displayDealBox(isShow){
	if(typeof isShow === 'boolean'){
		if(isShow){
			document.getElementById('has_img_id').style.display = "none";
			document.getElementById('empty_img_id').style.display = "block";
		}
		document.getElementById('select_img_box_id').style.display = isShow ? 'inline-flex' : 'none';
	}
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
	
	var errMsg = '';
	if(file.files[0].size / 1.0 / 1024 / 1024 > 1){
		errMsg = "图片大小不能超过1M";
		alert(errMsg);
		return false;
	}
	//读取图片的数据
	var reader = new FileReader();
	reader.onload = function(evt){
		//加载图片获取图片真实宽度和高度
		var img = new Image();
		img.onload = function(){
			if(this.width <= 50){
				errMsg = "图片宽度必须大于50";
			}
			if(this.height <= 50){
				errMsg = errMsg ? "图片的宽高必须大于50" : "图片高度必须大于50";
			}
			if(errMsg){
				alert(errMsg);
		        return false;
			}
			displayImage(evt.target.result, this.width, this.height);
		}
		img.src = evt.target.result;
	}
	reader.readAsDataURL(file.files[0]);
}

/*根据上传的图片调整样式*/
function displayImage(imgUrl, imgWidth, imgHeight){
	var selectImgList = document.getElementsByClassName('selected_img');
	var hasImg = document.getElementById('has_img_id');
	var emptyImg = document.getElementById('empty_img_id');
	var mask = document.getElementById('mask_id');
	var circle = document.getElementById('dynamic_circle_box_id');
	if(imgUrl){
		//根据图片真实宽高调整图片、遮罩和裁剪圆的样式
		var width = 0, height = 0;//图片实际显示宽高
		var ratio = imgWidth * 1.0 / imgHeight;
		if(imgWidth > imgHeight){
			width = imgWidth > 360 ? 360 : imgWidth;
			height = width / ratio;
		}else if(imgWidth < imgHeight) {
			height = imgHeight > 360 ? 360 : imgHeight;
			width = height * ratio;
		}else {
			width = 360;
			height = 360;
		}
		for(var i = 0, len = selectImgList.length; i < len; i++){
			selectImgList[i].src = imgUrl;
			selectImgList[i].style.width = width >= height ? width + 'px' : 'auto';
			selectImgList[i].style.height = height >= width ? height + 'px' : 'auto';
			selectImgList[i].style.left = '0px';
			selectImgList[i].style.top = '0px';
		}
		
		mask.style.width = width >= height ? width + 'px' : '100%';
		mask.style.height = height >= width ? height + 'px' : '100%';
		
		//重置截取圆的位置，并取最小值最为宽高
		var minLength = width > height ? height : width;
		circle.style.width = minLength + 'px';
		circle.style.height = minLength + 'px';
		circle.style.left = '0px';
		circle.style.top = '0px';
		limitWidth = width;
		limitHeight = height;
		
		hasImg.style.display = 'grid';
		emptyImg.style.display = 'none';
	}else {
		hasImg.style.display = 'none';
		emptyImg.style.display = 'block';
	}
	previewImage()
}

/*根据当前图片的选中区域预览裁剪部分*/
function previewImage(){
	var dynamicCircleEl = document.getElementById('dynamic_circle_box_id');
	var sourceImg = document.getElementById('dynamic_image_id');
	var ratio = sourceImg.naturalHeight / sourceImg.clientHeight;//注意：图片的原始尺寸/放置的尺寸
	
	var dest_100 = document.getElementById('canvas_100_id');
	var ctx_100 = dest_100.getContext("2d");
	ctx_100.drawImage(sourceImg,dynamicCircleEl.offsetLeft * ratio, dynamicCircleEl.offsetTop * ratio, dynamicCircleEl.clientWidth * ratio, dynamicCircleEl.clientHeight * ratio, 0, 0, 100, 100);
	
	var dest_50 = document.getElementById('canvas_50_id');
	var ctx_50 = dest_50.getContext("2d");
	ctx_50.drawImage(sourceImg,dynamicCircleEl.offsetLeft * ratio, dynamicCircleEl.offsetTop * ratio, dynamicCircleEl.clientWidth * ratio, dynamicCircleEl.clientHeight * ratio, 0, 0, 50, 50);
}

/*剪裁图片绘制，此处封装成方法会出错，待探究*/
function drawCanvas(sourceId, destId, sx, sy, swidth, sheight, x, y, width, height){
	var destCanvas = document.getElementById(destId);
	var ctx = destCanvas.getContext("2d");
	var sourceImg = document.getElementById(sourceId);
	ctx.drawImage(sourceImg,  x, y, width, height);
}

/*
 * 裁剪合适尺寸的图片放到相应大小的canvas上，否则100*100的裁剪区域放到150*150的区域上会出现模糊现象
 */
function uploadImage(){
	var dynamicCircleEl = document.getElementById('dynamic_circle_box_id');
	var sourceImg = document.getElementById('dynamic_image_id');
	var ratio = sourceImg.naturalHeight / sourceImg.clientHeight;
	var dest_150 = document.createElement('canvas');
	dest_150.width = 150;
	dest_150.height = 150;
	var ctx_150 = dest_150.getContext("2d");
	ctx_150.drawImage(sourceImg,dynamicCircleEl.offsetLeft * ratio, dynamicCircleEl.offsetTop * ratio, dynamicCircleEl.clientWidth * ratio, dynamicCircleEl.clientHeight * ratio, 0, 0, 150, 150);
	
	var head_photo = document.getElementById('header_photo_id');
	var _image = new Image();
	_image = dest_150.toDataURL("image/png");
	head_photo.src = _image;
	head_photo.style.display = 'block';
	displayDealBox(false);
	
	/*如果传给服务器，可以封装成FormData
	// dataURL 的格式为 “data:image/png;base64,****”,逗号之前都是一些说明性的文字，我们只需要逗号之后的就行了
	var data=canvas_100.toDataURL();
	data=data.split(',')[1];
	data=window.atob(data);
	var ia = new Uint8Array(data.length);
	for (var i = 0; i < data.length; i++) {
	    ia[i] = data.charCodeAt(i);
	};
	// canvas.toDataURL 返回的默认格式就是 image/png
	var blob=new Blob([ia], {type:"image/png"});
	var fd=new FormData();
	fd.append('file',blob);*/
}
