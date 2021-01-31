import 'glfx.js__temp'
//canvas操作相关
let fabricCommon = function (fabricObject,that) {
    //tojson包含自定义的属性内容
    let toJsonWithParams = [
        "realLeft",
        "realTop",
        "realType",
        "realWidth",
        "realHeight",
        "order",
        "oldSrc",
        "oldId",
        "oldPictureName",
        "oldPictureNum",
        "oldPictType",
        "oldUserId",
        "lockUniScaling",
        "PictureName",
        "PictureNum",
        "id",
        "pictType",
        "userId",
        "aCoords",
        "oldWidth",//图片本身真实宽度
        "oldHeight", //图片本身真实高度
        "title",
        "oldRealUrl",
        "realUrl",
        "bboxWidth",//图片要显示的宽度
        "bboxHeight", //图片要显示的高度
        "realFontFamily",//用于存储选中的字体,在字体文件加载完成之后替换到fontFamiy
        'lockScalingY',
        'lockScalingX',
        'lockMovementY',
        'lockMovementX',
        'layerIsEdit',
        'isGif'
      ];
    let _fabricInstance = fabricObject;
    _fabricInstance.setToJsonWithParams(toJsonWithParams);
    let _canvasObject = _fabricInstance.fabricInstance;
    
    //记录偏移量x,y的值
    let _offsetObj = {offsetX:0,offsetY:0};

    //文本类型
    let txtList = ["3-1", "3-2", "3-3"];
    //数据渲染
    let addObject = function (bannerMergeDataList) {
        //判断宽度是否大于1000或者高度是否大于600
        let objs = bannerMergeDataList.filter(e => {
            return e.type == "1-1";
        });
        if (objs && objs.length > 0) {
            
            // if (objs[0].bboxWidth > 1000 || objs[0].bboxHeight > 600) {
            //     // setZoom(0.5);
            //     if (that.initZoom)
            //     {
            //         that.initZoom(0.5);
            //     }
            //     _offsetObj.offsetX = (1000 - objs[0].bboxWidth) / 2;
            //     _offsetObj.offsetY = (600 - objs[0].bboxHeight) / 2;
            // } else {
            //     _offsetObj.offsetX = Math.abs((1000 - objs[0].bboxWidth) / 2);
            //     _offsetObj.offsetY = Math.abs((600 - objs[0].bboxHeight) / 2);
            // }
        }
        console.log(_offsetObj);
        let cloneJson = JSON.parse(JSON.stringify(bannerMergeDataList));
        loadDataToCanvas(cloneJson);
        _canvasObject.renderAll();
    };

    //创建图片,dataList不传则为新增
    let createImage = function (obj, dataList) {
        let order=(_canvasObject.getObjects()&&_canvasObject.getObjects().length)||0
        let item = obj;
        let url = '/static/'+item.layerPictureUrl;
        let top, left;
        if (item.type!="1-1")
        {
            left = parseInt(item.bboxX1) + parseInt(item.bboxWidth) / 2 + _offsetObj.offsetX;
            top = parseInt(item.bboxY1) + parseInt(item.bboxHeight) / 2 + _offsetObj.offsetY;
        }
        else{
            left = parseInt(item.bboxWidth) / 2 + _offsetObj.offsetX;
            top = parseInt(item.bboxHeight) / 2 + _offsetObj.offsetY;
        }
        let imgConfig = {
            left: left,
            top: top,
            order: order,
            id: item.id,
            PictureName: item.PictureName,
            PictureNum: item.motherSetNumRef,
            userId: item.userId,
            pictType: item.pictType,
            angle: 0,
            realLeft: parseInt(item.bboxX1),
            realTop: parseInt(item.bboxY1),
            realType: item.type,
            title: item.title,
            realUrl: item.layerPictureUrl,
            bboxWidth: item.bboxWidth,
            bboxHeight: item.bboxHeight,
            lockScalingY:false,
            lockScalingX:false,
            lockMovementY:false,
            lockMovementX:false,
            layerIsEdit:item.layerIsEdit,
            isGif:item.isGif
        }
        _fabricInstance.createImage(url, imgConfig, !item.bboxWidth, item.type!='1-1').then(img=>{
            if(!item.bboxWidth)
            {
                setActiveSelect(order);
                canvasObjectSelected();
            }
            if(dataList)
            {
                loadDataCallback(dataList);
            }
        });
        
    }

    //创建文本,dataList不传则为新增/或者替换
    let createTxt = function (item, dataList) {
        let order=(_canvasObject.getObjects()&&_canvasObject.getObjects().length)||0;
        if(that.getFont)
        {
            let result = that.getFont(item.fontType);
            if(!result)
            {
                item.fontType='FZZCHJW--GB1-0';
            }
        }
        let scale=(!item.fontSize||item.fontSize>=12)?1:item.fontSize/12
        let txtConfig = {
            left: parseInt(item.bboxX1) + parseInt(item.bboxWidth) / 2 + _offsetObj.offsetX, //+parseInt(item.bboxWidth)/2
            top: parseInt(item.bboxY1) + parseInt(item.bboxHeight) / 2 + _offsetObj.offsetY, //+parseInt(item.bboxWidth)/2
            order: order,
            fill: item.color, //content.color
            fontSize: item.fontSize ? item.fontSize:20,
            angle: 0,
            fontFamily: "", //content.fontFamily
            realFontFamily: item.fontType,
            fontWeight: item.fontBold=="1" ? "bold" : "normal",
            fontStyle: item.fontItalic == "0" ? "normal" : "italic",
            userId: item.userId,
            realLeft: parseInt(item.bboxX1),
            realTop: parseInt(item.bboxY1),
            realType: item.type,
            title: item.title,
            realWidth: parseInt(item.bboxWidth),
            realHeight: parseInt(item.bboxHeight),
            // lockScalingY: true,
            // lockScalingX: true,
            lockMovementY: false,
            lockMovementX: false,
            width: parseInt(item.bboxWidth),
            height: parseInt(item.bboxHeight),
            scaleX:scale,
            scaleY:scale,
            layerIsEdit:item.layerIsEdit,
            isGif:item.isGif
        }
        let txtInstabce= _fabricInstance.createItext(item.text, txtConfig, !item.bboxWidth);
        if (item.fontType) {
            _fabricInstance.loadFont(txtInstabce,item.fontType);
        }
        txtInstabce.on("editing:exited", function () {
            let obj = _canvasObject.getActiveObject();
            checkTxt(obj);
        })
        if(!item.bboxWidth)
        {
            setActiveSelect(order);
            canvasObjectSelected();
        }
        if(dataList)
        {
            loadDataCallback(dataList);
        }
    }

    //检查编辑的时候文本内容长度是否符合要求
    let checkTxt=function(obj){
        if (obj && obj.text && obj.realType && that.copyRightLengthCheck)
        {
            that.copyRightLengthCheck({txt:obj.text,type: obj.realType});
        }
        
    }

    //加载数据到画布的回调函数,适用于loadDataToCanvas方法
    let loadDataCallback = function (list) {
        list.shift();
        loadDataToCanvas(list);
    }

    //处理加载过来的数据,递归加载
    let loadDataToCanvas = function (dataList) {
        if (dataList && dataList.length > 0) {
            let obj = dataList[0];
            if (obj.type == "0-1") {
                loadDataCallback(dataList);
                return;
            }
            if (txtList.indexOf(obj.type) < 0) {
                //图片
                createImage(obj, dataList);
            } else {
                //文字
                createTxt(obj, dataList);
            }
        } else {
            _fabricInstance.firstAddToState(true);
            _fabricInstance.updateCanvasState();
        }
    }

    //新增/修改文案信息
    let modifyCopyright = function (list) {
        let objectList = _canvasObject.getObjects();
        for (let i = 0; i < list.length; i++) {
            let mainObj = objectList.filter(e => {
                return e.realType == list[i].type;
            });
            if (mainObj && mainObj.length > 0) { //已有
                 let title = list[i].text;
                 let obj = {
                   cssName: 'text',
                   cssValue: title
                 };
                updateTxtCss(obj, mainObj[0]);
                _canvasObject.renderAll();
                _fabricInstance.updateCanvasState();
            } else {
                createTxt(list[i]);
            }
        }
    }

    let isMouseUp=true;

    //是否开启整体移动
    let isOpenAllMove=false;

    //用于整体拖动,记录拖动开始位置
    let point={x:0,y:0};

    let selectedObj={};
    _canvasObject.on("mouse:down", e => {
        if(isOpenAllMove)
        {
            Object.assign(point,e.absolutePointer);
        }
        isMouseUp=false;
        if (e && e.target && e.target.selectable) {
        //用于鼠标移动到的元素边框显示
        // isMouseUp=false;
        // clearDotted();
            if (selectedObj != e.target)
            {
                selectedObj = e.target;
            }
            console.log(selectedObj);
        }else if(e&&!e.target){//点击到canvas中无图片渲染区域,重置图层选中状态为未选中
            let currentActive={order:-1}
            that.setActiveObjectCallback(currentActive);
        }
    });
    _canvasObject.on("mouse:move", function (e) {
        if(isOpenAllMove&&!isMouseUp)
        {
            _canvasObject.relativePan({ x:e.absolutePointer.x- point.x, y: e.absolutePointer.y- point.y });
        }
        if (e && e.target && isMouseUp) {
        //用于鼠标移动到的元素边框显示
        // if (lastMoved != e.target)
        // {
        //   drawDottedBorder(e.target.aCoords);
        //   lastMoved = e.target;
        // }
        }
    });
    _canvasObject.on("mouse:up", e => {
        if (e && e.target) {
            canvasObjectSelected();
        }
        //用于鼠标移动到的元素边框显示
        isMouseUp = true;
    });
    _canvasObject.on("object:selected", e => {
        if (e && e.target) {
        }
    });
    _canvasObject.on("object:modified", function (e) {
        if(e&&e.target)
        {
            console.log('modified');
        }
        
    });
    _canvasObject.on("object:scaled", e => {
        //文本类放大完成事件,把缩放率更新到字体大小
        if (e && e.target&&e.target.isType('i-text')) {
            let scale = e.target.scaleX;
            let fontSize = e.target.fontSize ? e.target.fontSize:20;
            fontSize =Math.round(fontSize * scale);
            let obj={
                cssName:'scaleX',
                cssValue:1
            }
            updateTxtCss(obj,e.target);
             obj = {
              cssName: 'scaleY',
              cssValue: 1
            }
            updateTxtCss(obj, e.target);
             obj = {
              cssName: 'fontSize',
              cssValue: fontSize
            }
            updateTxtCss(obj, e.target);
        }
    });

    //选中元素事件,重置realLeft和realTop
    let canvasObjectSelected = function () {
        let currentActive =_fabricInstance.getActiveObj();
        if (currentActive) {
            let left, top, width, height;
            if (currentActive.type == "image") {
                //图片
                width = currentActive.oldWidth * currentActive.scaleX;
                height = currentActive.oldHeight * currentActive.scaleY;
                left = currentActive.left - _offsetObj.offsetX - currentActive.width * currentActive.scaleX / 2;
                top = currentActive.top - _offsetObj.offsetY - currentActive.height * currentActive.scaleY / 2;
                currentActive.realWidth = width;
                currentActive.realHeight = height;
            } else {
                //文本,不需要再去减二分之一的宽高
                left = currentActive.left - parseInt(currentActive.width) / 2 - _offsetObj.offsetX;
                top = currentActive.top - parseInt(currentActive.height) / 2 - _offsetObj.offsetY;
            }
            currentActive.realTop = top;
            currentActive.realLeft = left;
            _canvasObject.renderAll();
            that.setActiveObjectCallback(currentActive);
        }
    };

    //修改属性值
    let setCss = function (obj) {
        let currentActive = _canvasObject.getActiveObject();
        if (!currentActive) {
            return;
        }
        //是否是背景,是否是编辑修改图片功能
        if (currentActive.realType=='1-1')//背景,只能替换或者恢复图片
        {
            if (obj.cssName != "src" && obj.cssName != "resetSrc")
            {
                return;
            }
        }
        //图片和文字都有的操作,需要重置位置的
        if (obj.cssName == "left" || obj.cssName == "top") {
            updateLeftOrTop(obj, currentActive);
        } 
        else if (obj.cssName == "src") { //更换图片
            updatePic(obj, currentActive);
            return;
        } 
        else if (obj.cssName == "resetSrc") { //恢复图片
            resetPic(currentActive);
            return;
        } 
        else if (obj.cssName == "width" || obj.cssName == "height") {
           updateWidthOrHeight(obj, currentActive);
        } 
        else {
            if (currentActive.isType("i-text"))//剩下的就是文本类的操作
            {
                updateTxtCss(obj, currentActive);
            }
            else{
                currentActive.set(obj.cssName,obj.cssValue).setCoords();
            }
        }
        _canvasObject.renderAll();
        _fabricInstance.updateCanvasState();
    };

    //更新文本类属性值
    let updateTxtCss = function (obj, currentActive,isSetSelect=true) {
        //字体类的修改
        if (obj.cssName != "realFontFamily") { //不是修改字体样式
            currentActive.set(obj.cssName, obj.cssValue).setCoords();
            // if (obj.cssName == "fontSize"&&obj.cssValue<12) {//修改字体大小,且字体大小是小于12的
            //     let scale =obj.cssValue/12;
            //     console.log(scale);
            //     currentActive.scale(scale).setCoords();
            // }
            // 解决切换颜色值,字体大小,下划线,加粗等无法重绘文字内容的问题
            let stroke = currentActive.stroke;
            if(stroke !== '#000000'){
                currentActive.set('stroke','#000000');
            }else{
                currentActive.set('stroke','#ffffff');
            }
            currentActive.set('stroke',stroke);
            // if (currentActive.fontFamily == "黑体") {
            //     currentActive.set("fontFamily", "微软雅黑").setCoords();
            // } else {
            //     currentActive.set("fontFamily", "黑体").setCoords();
            // }
            // currentActive.set("fontFamily", oldValue).setCoords();
        }else { //修改字体样式
            currentActive.set(obj.cssName, obj.cssValue).setCoords();
            console.log('_fabricInstance.loadFont');
            _fabricInstance.loadFont(currentActive, obj.cssValue);
        }
        if (isSetSelect)
        {
            canvasObjectSelected();
        }
    }

    //更换图片
    let updatePic = function (obj, currentActive) {
        let src = currentActive.getSrc();
        //判断是否更换的同一张
        if (src == obj.cssValue) {
            return;
        }
        currentActive.set("oldSrc", src); //跨域转换后的url
        currentActive.set("oldId", currentActive.id);
        currentActive.set("oldPictureName", currentActive.PictureName);
        currentActive.set("oldPictureNum", currentActive.PictureNum);
        currentActive.set("oldPictType", currentActive.pictType);
        currentActive.set("oldUserId", currentActive.userId);
        let content = obj.cssValue;
        currentActive.set({
            id: content.id,
            PictureName: content.PictureName,
            PictureNum: content.motherSetNumRef,
            userId: content.userId,
            pictType: content.type,
            oldRealUrl: currentActive.realUrl, //替换前的真实url
            realUrl: content.layerPictureUrl //替换后的真实url
        });
        let width = currentActive.realWidth;
        let url = './app/bannerMaterialManager/getPicture?pictureUrl=' + content.layerPictureUrl; //跨域转换后的url
        currentActive.setSrc(url, function (e) {
            let scaleX = width / e.width;
            let scaleY = scaleX;
            if(currentActive.realType=='1-1')
            {
                scaleY=currentActive.realHeight/e.height;
            }
            currentActive.set("scaleX", scaleX).setCoords();
            currentActive.set("scaleY", scaleY).setCoords();
            currentActive.set("oldWidth", parseInt(e.width)).setCoords();
            currentActive.set("oldHeight", parseInt(e.height)).setCoords();
            _canvasObject.renderAll();
            _fabricInstance.updateCanvasState();
            canvasObjectSelected();
        });
        return;
    }

    //恢复图片
    let resetPic = function (currentActive) {
        let width = currentActive.realWidth;
        let height = currentActive.realHeight;
        currentActive.set({
          id: currentActive.oldId,
          PictureName: currentActive.oldPictureName,
          PictureNum: currentActive.oldPictureNum,
          userId: currentActive.oldUserId,
          pictType: currentActive.oldPictType,
          realUrl: currentActive.oldRealUrl
        });
        let url = currentActive.oldSrc;
        currentActive.set("oldSrc", "");
        currentActive.set("oldId", "");
        currentActive.set("oldPictureName", "");
        currentActive.set("oldPictureNum", "");
        currentActive.set("oldPictType", "");
        currentActive.set("oldUserId", "");
        currentActive.set("oldRealUrl", "");

        currentActive.setSrc(url, function (e) {
            let scaleX = width / e.width;
            let scaleY = scaleX;
            if(currentActive.realType=='1-1')
            {
                scaleY=currentActive.realHeight/e.height;
            }
            currentActive.set("scaleX", scaleX).setCoords();
            currentActive.set("scaleY", scaleY).setCoords();
            currentActive.set("oldWidth", parseInt(e.width)).setCoords();
            currentActive.set("oldHeight", parseInt(e.height)).setCoords();
            _canvasObject.renderAll();
            _fabricInstance.updateCanvasState();
            canvasObjectSelected();
        });
        return;
    }

    //更新left/top的值
    let updateLeftOrTop = function (obj, currentActive) {
        let value;
        if (currentActive.isType("image")) {
            if (obj.cssName == "top")
            {
                value = currentActive.realTop + currentActive.height * currentActive.scaleY / 2 + _offsetObj.offsetY;
            }
            else if (obj.cssName == 'left')
            {
                value = currentActive.realLeft + currentActive.width * currentActive.scaleX / 2 + _offsetObj.offsetX;
            }
        } 
        else {
            if (obj.cssName == "top") {
                value = currentActive.realTop + parseInt(currentActive.height) / 2 + _offsetObj.offsetY;
            } else if (obj.cssName == 'left') {
                value = currentActive.realLeft + parseInt(currentActive.width) / 2 + _offsetObj.offsetX;
            }
        }
        currentActive.set(obj.cssName, value).setCoords();
    }

    //更新width/height的值
    let updateWidthOrHeight = function (obj, currentActive) {
        if (obj.cssName == "width")
        {
            if (currentActive.isType("image")) {
                let scaleX = currentActive.realWidth / currentActive.oldWidth;
                let scaleY = scaleX * currentActive.scaleY / currentActive.scaleX;
                currentActive.set("scaleX", scaleX).setCoords();
                currentActive.set("scaleY", scaleY).setCoords();
                canvasObjectSelected();
            }
        }
        else{
            if (currentActive.isType("image")) {
                let scaleY = currentActive.realHeight / currentActive.oldHeight;
                let scaleX = scaleY * currentActive.scaleX / currentActive.scaleY;
                currentActive.set("scaleY", scaleY).setCoords();
                currentActive.set("scaleX", scaleX).setCoords();
                canvasObjectSelected();
            }
        }
        //文本类修改
        currentActive.set(obj.cssName, obj.cssValue).setCoords();
    }

    //设置选中项
    let setActiveSelect = function (order) {
        _fabricInstance.setActiveSelect(order).then(res=>{
            canvasObjectSelected();
        });
    };

    //导出json数据
    let toJSon = function () {
        stopEditing();
        let canvasList = _canvasObject.toJSON(toJsonWithParams).objects;
        let result=[];
        canvasList.forEach(item=>{
            console.log(item);
            let obj={};
            let width = 0;
            let height = 0;
            if(item.realType.indexOf('3-')<0)
            {
                width = item.oldWidth * item.scaleX;
                height = item.oldHeight * item.scaleY;
                obj.layerPictureUrl=item.realUrl
                obj.motherSetNumRef=item.PictureNum
                obj.pictType=item.pictType
                obj.PictureName=item.PictureName
                obj.id=item.id
                obj.PictureName=item.PictureName
            }else{
                width = item.width ? item.width : 0;
                height = item.height ? item.height : 0;
                obj.fontType=item.realFontFamily
                obj.color=item.fill
                obj.fontBold=item.fontWeight == "bold"?1:0
                obj.fontItalic=item.fontStyle != "normal"?1:0
                obj.fontSize=item.fontSize
                obj.text=item.text
            }
            obj.bboxWidth=width
            obj.bboxHeight=height
            obj.bboxX1=item.realLeft
            obj.bboxX2=item.realLeft+width
            obj.bboxY1=item.realTop
            obj.bboxY2=item.realTop+height
            obj.isGif=item.isGif
            obj.layerIsEdit=item.layerIsEdit
            obj.order=item.order
            obj.type=item.realType
            obj.userId=item.userId
            result.push(obj);
        });
        return result;
    };

    //导出图片
    let downLoadImage=function(){
        let imgURL = _fabricInstance.getImgBase64Url();
        dowmLoadFunc(imgURL);
        // glfxImg(imgURL).then(url=>{
        //     dowmLoadFunc(url);
        // });
    }

    //使用glfx.js给图片加亮度
    const glfxImg = img=>{
        return new Promise((resolve,reject)=>{
            let imgInstance=document.createElement('img');
            imgInstance.src=img;
            imgInstance.onload=()=>{
                let url='';
                try {
                    var canvas = fx.canvas();
                } catch (e) {
                    alert(e);
                    reject();
                }
                var texture = canvas.texture(imgInstance);
                canvas.draw(texture).unsharpMask(1, 1.5).update();
                url= canvas.toDataURL('image/png');
                console.log(url);
                resolve(url);
            }   
        })
    }

    //下载通用方法,模拟a标签
    const dowmLoadFunc=(url,MIME_TYPE='image/png')=>{
        //创建一个a链接，模拟点击下载
        let dlLink = document.createElement('a');
        let filename = '合成图_' + (new Date()).getTime() + '.png';
        dlLink.download = filename;
        dlLink.href = url;
        dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');
        document.body.appendChild(dlLink);
        dlLink.click();
        document.body.removeChild(dlLink);
    }

    //画布缩放
    let setZoom=function(value){
        _fabricInstance.setZoom(value);
    }

    //退出编辑模式
    let stopEditing =function(){
        if (selectedObj && selectedObj.isType && selectedObj.isType("i-text"))
        {
            if (selectedObj.exitEditing)
            {
                console.log('stopEditing');
                selectedObj.exitEditing();
            }
        }
    }

    return {
        addObject: addObject,
        toJSon: toJSon,
        setActiveSelect: setActiveSelect,
        setCss: setCss,
        setZoom: setZoom,
        createImage: createImage,
        createTxt: createTxt,
        modifyCopyright: modifyCopyright,
        downLoadImage: downLoadImage,
        undo: _fabricInstance.undo,
        redo: _fabricInstance.redo,
        initialize: _fabricInstance.initialize,
        toggleVisiable: _fabricInstance.toggleVisiable,
        updateLevel: _fabricInstance.updateLevel,
        delItem: _fabricInstance.delItem,
        flipActiveObj: _fabricInstance.flipActiveObj,
        stopEditing: stopEditing
    };
};
export {
    fabricCommon
}
