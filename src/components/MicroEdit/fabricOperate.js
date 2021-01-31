import FontFaceObserver from "fontfaceobserver";
import initAligningGuidelines from "./guideLines.js";
import "fabric";
import rotateIcon from "@/assets/images/rotate-icon.svg";
import lockIcon from "@/assets/images/lock-icon.svg";
import lockOpenIcon from "@/assets/images/lock-open-icon.svg";
const rotateImg = new Image();
rotateImg.src = rotateIcon;
const lockImage = new Image();
lockImage.src = lockIcon;
const lockOpenImage = new Image();
lockOpenImage.src = lockOpenIcon;
const fabric = window.fabric;
let fabricObject = function(that, id = "canvas") {
  /* 默认fabric配置 */
  let _fabricConfig = {
    backgroundColor: "#F7F8FF",
    preserveObjectStacking: true,
    selection: false, //取消框选
  };
  // 设置复制itext文本不带格式
  fabric.disableStyleCopyPaste = true;

  fabric.Object.prototype.set({
    borderColor: "rgba(0,0,0,0.8)",
    cornerColor: "rgba(0,0,0,0.8)", //激活状态角落图标的填充颜色
    cornerStrokeColor: "rgba(0,0,0,0.8)", //激活状态角落图标的边框颜色
    borderOpacityWhenMoving: 1,
    borderScaleFactor: 1,
    cornerSize: 8,
    cornerStyle: "circle", //rect,circle
    centeredScaling: false, //角落放大缩小是否是以图形中心为放大原点
    centeredRotation: true, //旋转按钮旋转是否是左上角为圆心旋转
    transparentCorners: false, //激活状态角落的图标是否透明
    rotatingPointOffset: 20, //旋转距旋转体的距离
    originX: "center",
    originY: "center",
    lockUniScaling: false, //只显示四角的操作
    hasRotatingPoint: true, //是否显示旋转按钮
    showLock: true, // 控制是否显示lock
  });

  // 不显示m
  const notShowControls = ["ml", "mr", "mb", "mt"];
  notShowControls.forEach((control) => {
    fabric.Object.prototype.controls[control].visible = false;
  });

  // 重写mtr 的render函数
  fabric.Object.prototype.controls.mtr.render = function(
    ctx,
    left,
    top,
    styleOverride,
    fabricObject
  ) {
    styleOverride = styleOverride || {};
    const transparentCorners =
      typeof styleOverride.transparentCorners !== "undefined"
        ? styleOverride.transparentCorners
        : fabricObject.transparentCorners;
    const stroke =
      !transparentCorners &&
      (styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor);
    ctx.save();
    ctx.fillStyle = styleOverride.cornerColor || fabricObject.cornerColor;
    ctx.strokeStyle =
      styleOverride.strokeCornerColor || fabricObject.strokeCornerColor;
    ctx.lineWidth = 1;
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    if (stroke) {
      ctx.drawImage(rotateImg, -10, -12, 22, 22);
    }
    ctx.restore();
  };

  const lockIcon = {
    width: 22,
    height: 22,
  };
  // 扩展 增加lock操作图标 可以在controls中增加自定义control
  fabric.Object.prototype.controls.lock = new fabric.Control({
    visible: true,
    x: -0.5,
    y: -0.5,
    offsetX: +lockIcon.width + 5,
    offsetY: +lockIcon.height + 5,
    sizeX: lockIcon.width,
    sizeY: lockIcon.height,
    actionName: "lockgroup",
    mouseDownHandler: function(eventData, transformData, x, y) {
      const current = transformData.target;
      const lockStatus = current.get("lockStatus");
      if (lockStatus === 1) {
        current.set("lockStatus", 0);
      } else {
        current.set("lockStatus", 1);
      }
    },
    cursorStyle: "pointer",
    render: function(ctx, left, top, styleOverride, fabricObject) {
      if (!fabricObject.showLock) {
        return;
      }
      styleOverride = styleOverride || {};
      const transparentCorners =
        typeof styleOverride.transparentCorners !== "undefined"
          ? styleOverride.transparentCorners
          : fabricObject.transparentCorners;
      const stroke =
        !transparentCorners &&
        (styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor);
      ctx.save();
      ctx.fillStyle = styleOverride.cornerColor || fabricObject.cornerColor;
      ctx.strokeStyle =
        styleOverride.strokeCornerColor || fabricObject.strokeCornerColor;
      ctx.lineWidth = 1;
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
      if (stroke) {
        ctx.drawImage(
          fabricObject.lockStatus === 1 ? lockOpenImage : lockImage,
          -lockIcon.width / 2,
          -lockIcon.height / 2,
          lockIcon.width,
          lockIcon.height
        );
      }
      ctx.restore();
    },
  });

  //重绘旋转按钮

  //是否是初始状态
  let isInitialStatus = true;

  /* fabric对象 */
  let _fabricObj = new fabric.Canvas(id, _fabricConfig);
  //添加辅助线
  initAligningGuidelines(_fabricObj);

  //对fabric.Canvas扩展
  fabric.Canvas.prototype.setZoomByCenter = function(value) {
    this.zoomToPoint(
      new fabric.Point(_fabricObj.width / 2, _fabricObj.height / 2),
      value
    );
    return this;
  };

  //最后一次鼠标滑到的对象--用于鼠标移动到的元素边框显示--用于鼠标移动到元素展示虚线
  let lastMoved = {};

  /* 导出json时需要导出的自定义字段 */
  let _toJsonWithParams = [];

  /* 初始化 */
  const _initConfig = function(config = {}) {
    Object.assign(_fabricConfig, config);
    fabricObj.setOptions(_fabricConfig);
  };

  /* 创建图片 */
  const _createImage = function(
    url,
    imgConfig,
    centerObject = false,
    hasControls = true
  ) {
    return new Promise((resolve, reject) => {
      try {
        let imgInstance = new fabric.Image.fromURL(url, function(img) {
          img.set(imgConfig);
          img
            .set({
              scaleX: imgConfig.bboxWidth
                ? parseInt(imgConfig.bboxWidth) / img.width
                : 1,
              scaleY: imgConfig.bboxHeight
                ? parseInt(imgConfig.bboxHeight) / img.height
                : 1,
              realWidth: imgConfig.bboxWidth
                ? parseInt(imgConfig.bboxWidth)
                : parseInt(img.width),
              realHeight: imgConfig.bboxHeight
                ? parseInt(imgConfig.bboxHeight)
                : parseInt(img.height),
              oldWidth: parseInt(img.width),
              oldHeight: parseInt(img.height),
            })
            .setCoords();
          if (!hasControls) {
            img.hasControls = hasControls;
            img.set("lockRotation", true);
            img.set("lockScalingX", true);
            img.set("lockScalingY", true);
            img.set("lockMovementX", true);
            img.set("lockMovementY", true);
          }
          if (centerObject) {
            _fabricObj.centerObject(img);
          }
          resolve(img);
          _fabricObj.add(img);
          _fabricObj.renderAll();
        });
      } catch (e) {
        reject();
      }
    });
  };

  /* 创建文本 */
  const _createItext = function(title, txtConfig, centerObject = false) {
    let textInstance = new fabric.IText(title, txtConfig);
    if (centerObject) {
      _fabricObj.centerObject(textInstance);
    }
    _fabricObj.add(textInstance);
    _fabricObj.renderAll();
    return textInstance;
  };

  /* 画虚线框相关开始 */
  //画虚线的列表--用于鼠标移动到的元素边框显示
  let _dottedLineList = [];
  //画曲线--用于鼠标移动到的元素边框显示
  let _drawDottedLine = function(fromX, fromY, toX, toY) {
    let canvasObject = new fabric.Line([fromX, fromY, toX, toY], {
      strokeDashArray: [3, 1],
      stroke: "red",
      strokeWidth: 1,
    });
    _dottedLineList.push(canvasObject);
    _fabricObj.add(canvasObject);
    _fabricObj.renderAll();
  };

  //画一个对象的虚线边框--用于鼠标移动到的元素边框显示
  let _drawDottedBorder = function(aCoords) {
    _clearDotted();
    let fx = aCoords.tl.x;
    let fy = aCoords.tl.y;
    let tx = aCoords.tr.x;
    let ty = aCoords.tr.y;
    _drawDottedLine(fx, fy, tx, ty);
    fx = aCoords.tr.x;
    fy = aCoords.tr.y;
    tx = aCoords.br.x;
    ty = aCoords.br.y;
    _drawDottedLine(fx, fy, tx, ty);
    fx = aCoords.br.x;
    fy = aCoords.br.y;
    tx = aCoords.bl.x;
    ty = aCoords.bl.y;
    _drawDottedLine(fx, fy, tx, ty);
    fx = aCoords.bl.x;
    fy = aCoords.bl.y;
    tx = aCoords.tl.x;
    ty = aCoords.tl.y;
    _drawDottedLine(fx, fy, tx, ty);
  };

  //清除虚线框--用于鼠标移动到的元素边框显示
  let _clearDotted = function() {
    for (let i = 0; i < _dottedLineList.length; i++) {
      _fabricObj.remove(_dottedLineList[i]);
    }
    _dottedLineList = [];
  };
  /* 画虚线框相关结束 */

  /* 鼠标事件监听相关--开始 */
  _fabricObj.on("object:modified", function(e) {
    if (_config.isStart) updateCanvasState();
  });
  _fabricObj.on("object:added", function() {
    if (_config.isStart) updateCanvasState();
  });
  _fabricObj.on("object:removed", function() {
    updateCanvasState();
  });
  _fabricObj.on("object:rotating", function() {
    updateCanvasState();
  });
  _fabricObj.on("mouse:down", (e) => {
    if (e && e.target && e.target.selectable) {
    }
  });
  _fabricObj.on("mouse:move", function(e) {
    if (e && e.target) {
    }
  });
  _fabricObj.on("mouse:up", (e) => {
    if (e && e.target) {
    }
  });
  _fabricObj.on("object:selected", (e) => {
    if (e && e.target) {
    }
  });
  /* 鼠标监控相关--结束 */

  //撤销回退相关操作状态配置表
  let _config = {
    canvasState: [], //存储各状态的json数据
    currentStateIndex: -1,
    undoStatus: false, //撤销
    redoStatus: false, //回退
    undoFinishedStatus: 1, //撤销中的状态
    redoFinishedStatus: 1, //回退中的状态
    undoBtnStatus: false, //撤销按钮可点击状态
    redoBtnStatus: false, //回退按钮可点击状态
    initialNum: 0,
    isStart: false,
  };
  //记录每步操作,用户撤销和回退操作
  let updateCanvasState = function() {
    if (_config.undoStatus == false && _config.redoStatus == false) {
      let jsonData = _fabricObj.toJSON(_toJsonWithParams);
      let canvasAsJson = JSON.stringify(jsonData);
      if (_config.currentStateIndex < _config.canvasState.length - 1) {
        //回退操作更新
        let oldData = JSON.parse(JSON.stringify(_config.canvasState));
        _config.canvasState = oldData.splice(0, _config.currentStateIndex + 1);
        _config.canvasState.push(canvasAsJson);
      } else {
        _config.canvasState.push(canvasAsJson);
      }
      _config.currentStateIndex = _config.canvasState.length - 1;
      updateUnRedoBtnStatus();
      if (
        _config.currentStateIndex == _config.canvasState.length - 1 &&
        _config.currentStateIndex == 0
      ) {
        return;
      }
      if (isInitialStatus) {
        isInitialStatus = false;
        updateInitialStatus(isInitialStatus);
      }
    }
  };

  //更新撤销/回退的操作状态
  let updateUnRedoBtnStatus = function() {
    if (!that.updateUnRedoStatus) {
      return;
    }
    //撤销按钮状态更新
    if (_config.currentStateIndex <= 0) {
      _config.undoBtnStatus = false;
    } else {
      _config.undoBtnStatus = true;
    }
    //回退按钮状态更新
    if (
      _config.canvasState.length > _config.currentStateIndex + 1 &&
      _config.canvasState.length > 1
    ) {
      _config.redoBtnStatus = true;
    } else {
      _config.redoBtnStatus = false;
    }
    let btnStatus = {
      undoStatus: _config.undoBtnStatus,
      redoStatus: _config.redoBtnStatus,
    };
    //更新主页面的btn状态
    that.updateUnRedoStatus(btnStatus);
  };

  //撤销
  let undo = function() {
    let currentTarget = _fabricObj.getActiveObject();
    if (_config.undoFinishedStatus) {
      if (_config.currentStateIndex == 0) {
        _config.undoStatus = false;
      } else {
        if (_config.canvasState.length >= 2) {
          _config.undoFinishedStatus = 0;
          _config.undoStatus = true;
          _fabricObj.loadFromJSON(
            _config.canvasState[_config.currentStateIndex - 1],
            function() {
              _fabricObj.renderAll();
              _config.undoStatus = false;
              _config.currentStateIndex -= 1;
              _config.undoFinishedStatus = 1;
              _fabricObj.renderAll.bind(_fabricObj);
              undoFinish();
            },
            canvasLoadFromJsonTxtLoadFont
          );
        }
      }
    }
  };
  //恢复
  let redo = function() {
    if (_config.redoFinishedStatus) {
      if (_config.currentStateIndex < _config.canvasState.length - 1) {
        if (
          _config.canvasState.length > _config.currentStateIndex + 1 &&
          _config.canvasState.length > 1
        ) {
          _config.redoFinishedStatus = 0;
          _config.redoStatus = true;
          _fabricObj.loadFromJSON(
            _config.canvasState[_config.currentStateIndex + 1],
            function() {
              _fabricObj.renderAll();
              _config.redoStatus = false;
              _config.currentStateIndex += 1;
              _config.redoFinishedStatus = 1;
              _fabricObj.renderAll.bind(_fabricObj);
              undoFinish();
            },
            canvasLoadFromJsonTxtLoadFont
          );
        }
      }
    }
  };

  //获取最新的层级关系列表
  let getNewLevelList = function() {
    let list = [];
    let objList = _fabricObj.getObjects();
    for (let i = 0; i < objList.length; i++) {
      let obj = {};
      obj.visiable = objList[i].visible;
      obj.text = objList[i].title;
      obj.id = i + 1;
      obj.type = objList[i].realType;
      list.push(obj);
    }
    return list;
  };

  //撤销/回退操作完成回调
  let undoFinish = function() {
    //banner微编辑
    if (that.undoSuccess) {
      that.undoSuccess(getNewLevelList());
    }
    //gif动图微编辑
    that.initialSuccessCallback &&
      that.initialSuccessCallback(getNewEditLevelList());
    updateUnRedoBtnStatus();
  };

  //gif动图,更新可编辑图层信息
  const getNewEditLevelList = () => {
    let newObject = {};
    let txtList = [];
    let imgList = [];

    let objList = _fabricObj.getObjects();
    for (let i = 0; i < objList.length; i++) {
      if (!objList[i].layerIsEdit || objList[i].layerIsEdit == "0") {
        continue;
      }
      if (objList[i].realType.indexOf("3-") < 0) {
        let obj = {
          type: objList[i].realType,
          order: objList[i].order,
          layerPictureUrl: objList[i].layerPictureUrl,
        };
        imgList.push(obj);
      } else {
        let obj = {
          type: objList[i].realType,
          order: objList[i].order,
          title: objList[i].text,
        };
        txtList.push(obj);
      }
    }
    newObject.imgList = imgList;
    newObject.txtList = txtList;
    return newObject;
  };

  //调整层级关系
  let updateLevel = function(moveOrder, movedOrder) {
    moveOrder = parseInt(moveOrder);
    movedOrder = parseInt(movedOrder);
    let upLevels = _fabricObj.getObjects();
    let currentUpdate = {};
    if (moveOrder < movedOrder) {
      //往外层移动
      for (let i = moveOrder; i <= movedOrder; i++) {
        if (upLevels[i].order > moveOrder) {
          upLevels[i].order = parseInt(upLevels[i].order) - 1;
        } else if (upLevels[i].order == moveOrder) {
          upLevels[i].order = movedOrder;
          currentUpdate = upLevels[i];
        }
      }
      //移动图层,向外移动多少层
      for (let i = moveOrder; i < movedOrder; i++) {
        _fabricObj.bringForward(currentUpdate); //上移
      }
    } else {
      //往内层移动
      for (let i = movedOrder; i <= moveOrder; i++) {
        if (upLevels[i].order < moveOrder) {
          upLevels[i].order = parseInt(upLevels[i].order) + 1;
        } else if (upLevels[i].order == moveOrder) {
          upLevels[i].order = movedOrder;
          currentUpdate = upLevels[i];
        }
      }
      //移动图层,向内移动多少层
      for (let i = movedOrder; i < moveOrder; i++) {
        _fabricObj.sendBackwards(currentUpdate); //下移
      }
    }
    _fabricObj.renderAll();
    updateCanvasState();
  };

  //重新加载相关数据初始化
  let initialize = function() {
    if (isInitialStatus) {
      return;
    }
    let json = _config.canvasState[0];
    _fabricObj.clear();
    _config.isStart = false;
    _config.currentStateIndex = -1;
    _config.canvasState = [];
    isInitialStatus = true;
    _fabricObj.loadFromJSON(
      json,
      () => {
        firstAddToState(true);
        updateCanvasState();
        undoFinish();
      },
      canvasLoadFromJsonTxtLoadFont
    );
    updateInitialStatus(isInitialStatus);
  };

  //更新是否是初始状态
  let updateInitialStatus = function() {
    if (that.updateInitialStatus) {
      that.updateInitialStatus(isInitialStatus);
    }
  };

  //获取画布图片的base64
  let getImgBase64Url = function() {
    let currentActive = _fabricObj.getObjects()[0];
    let width = currentActive.oldWidth * currentActive.scaleX;
    let height = currentActive.oldHeight * currentActive.scaleY;
    let zoom = _fabricObj.getZoom();
    if (zoom != 1) {
      setZoom(1);
    }
    //转换成base64
    let imgURL = _fabricObj.toDataURL({
      format: "jpeg",
      quality: 1,
      multiplier: 1,
      left: 0,
      top: 0,
      width: width,
      height: height,
    });
    setZoom(zoom);
    return imgURL;
  };

  //设置缩放
  let setZoom = function(num) {
    _fabricObj.setZoomByCenter(num);
  };

  //设置导出json时需要导出的自定义字段
  let setToJsonWithParams = function(list) {
    _toJsonWithParams = _toJsonWithParams.concat(list);
  };

  //设置是否显示
  let toggleVisiable = function(order, value) {
    let objs = _fabricObj.getObjects().filter((e) => {
      return e && e.order == order;
    });
    if (objs && objs.length > 0) {
      objs[0].set("visible", value);
      _fabricObj.renderAll();
      updateCanvasState();
    }
  };

  //删除元素
  let delItem = function(order) {
    let objs = _fabricObj.getObjects().filter((e) => {
      return e && e.order == order;
    });
    if (objs && objs.length > 0) {
      _fabricObj.remove(objs[0]);
      _fabricObj.renderAll();
      resetOrderToMapper(order);
    }
  };

  //删除时候用,删除层级以上的全部降一,已于当前getobjects()的层级相对应
  let resetOrderToMapper = function(order) {
    order = parseInt(order);
    for (let i = order; i < _fabricObj.getObjects().length; i++) {
      if (parseInt(_fabricObj.getObjects()[i].order) > order) {
        _fabricObj.getObjects()[i].order = i;
      }
    }
  };

  //开始记录操作,用于撤销回退
  let firstAddToState = function(isStart = false) {
    _config.isStart = isStart;
  };

  //设置选中项
  let setActiveSelect = function(order) {
    return new Promise((resolve, reject) => {
      let objs = _fabricObj.getObjects().filter((e) => {
        return e && e.order == order;
      });
      if (objs && objs.length > 0) {
        _fabricObj.setActiveObject(objs[0]);
        resolve();
      } else {
        reject();
      }
    });
  };

  //获取当前选中的元素
  let getActiveObj = function() {
    return _fabricObj.getActiveObject();
  };

  //设置元素属性值
  let setActiveObjCss = function(obj) {
    let currentActive = getActiveObj();
    if (currentActive) {
      // currentActive.setOptions(obj)
      currentActive.set(obj.cssName, obj.cssVlaue).setCoords();
      _fabricConfig.renderAll();
    }
  };

  //翻转元素,flip=flipX,水平翻转,flip=flipY垂直旋转
  let _flipActiveObj = function(flip) {
    let activeObj = getActiveObj();
    if (activeObj) {
      let fX = activeObj[flip];
      activeObj.set(flip, fX).setCoords();
    }
  };

  //加载json到canvas时加载每个元素的事件,用于异步加载字体
  let canvasLoadFromJsonTxtLoadFont = function(o, object) {
    if (
      object.isType("i-text") &&
      o.fontFamily == "" &&
      o.realFontFamily != ""
    ) {
      _loadFont(object, o.realFontFamily);
    }
  };

  //加载字体文件
  let _loadFont = function(instance, fontFamily) {
    let font = fontFamily;
    var myfont = new FontFaceObserver(font);
    myfont
      .load(null, 100000)
      .then(function() {
        console.log(instance, font);
        instance.set("fontFamily", font);
        _fabricObj.requestRenderAll();
        _loadFontSuccess(instance);
      })
      .catch(function(e) {
        console.log(e);
      });
  };

  //加载字体成功事件回调
  let _loadFontSuccess = function(currentActive) {
    let text = currentActive.text;
    currentActive.set("text", "").setCoords();
    currentActive.set("text", text).setCoords();
    _fabricObj.renderAll();
  };

  return {
    initFabricConfig: _initConfig,
    fabricInstance: _fabricObj,
    updateLevel: updateLevel,
    initialize: initialize,
    getImgBase64Url: getImgBase64Url,
    setZoom: setZoom,
    setToJsonWithParams: setToJsonWithParams,
    toggleVisiable: toggleVisiable,
    delItem: delItem,
    firstAddToState: firstAddToState,
    createImage: _createImage,
    createItext: _createItext,
    flipActiveObj: _flipActiveObj,
    updateCanvasState: updateCanvasState,
    setActiveSelect: setActiveSelect,
    getActiveObj: getActiveObj,
    setActiveObjCss: setActiveObjCss,
    undo: undo,
    redo: redo,
    loadFont: _loadFont,
  };
};
export { fabricObject };
