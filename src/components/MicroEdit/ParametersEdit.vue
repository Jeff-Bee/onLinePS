<template>
    <div class="parameter_edit">
        <div class="micro_editors_title cl_both"><span class="big cl_l">画布尺寸</span><span class="small cl_l">{{matherSetSize.width+'*'+matherSetSize.height}}</span></div>
        <div class="micro_line clear_bottom"></div>
        <div class="micro_editors_title cl_both"><span class="big cl_l">图层名称</span><span class="small cl_l">{{selectObj.title}}</span></div>
        <div class="micro_line"></div>
        <el-form label-width="75px" label-position="left" size="mini">
          <el-form-item label="坐标" v-show="selectObj.order!=0" class="line_bottom">
            <div>
                <div class="right_item">
                    <el-input-number  v-model="selectObj.realLeft" :disabled="selectObj.lockMovementX==true" :precision="0" @change='updateCanvas("left")' controls-position="right"></el-input-number>
                    X
                </div>
                <div class="toggle-lock">
                    <i :class="{'lock-icon el-icon-lock':selectObj.lockMovementX!=true,'unlock-icon el-icon-unlock':selectObj.lockMovementX==true}" @click="toggleLockOrFlip('lockMovementX')"></i>
                </div>
                <div class="right_item">
                    <el-input-number  v-model="selectObj.realTop" :precision="0" :disabled="selectObj.lockMovementY==true" @change='updateCanvas("top")' controls-position="right"></el-input-number>
                    Y
                </div>
                <div class="toggle-lock">
                   <i :class="{'lock-icon el-icon-lock':selectObj.lockMovementY!=true,'unlock-icon el-icon-unlock':selectObj.lockMovementY==true}" @click="toggleLockOrFlip('lockMovementY')"></i>
                </div>
            </div>
    
          </el-form-item>
          <!--图片 start~~~~~~~~~~~~~~~~~~-->
          <el-form-item v-show="selectObj.type=='image'&&selectObj.order!=0" label="尺寸">
            <div>
                <div class="right_item">
                    <el-input-number  v-model="selectObj.realWidth" controls-position="right" :disabled="selectObj.lockScalingY==true" :min="1" :precision="0" @change='updateCanvas("width")'></el-input-number>
                    宽
                </div>
                <div class="toggle-lock">
                </div>
                <div class="right_item">
                   <el-input-number  v-model="selectObj.realHeight" controls-position="right" :min="1" :disabled="selectObj.lockScalingY==true" :precision="0" @change='updateCanvas("height")'></el-input-number>
                    高
                </div>
                <div class="toggle-lock">
                   <i :class="{'lock-icon el-icon-lock':selectObj.lockScalingY!=true,'unlock-icon el-icon-unlock':selectObj.lockScalingY==true}" @click="toggleLockOrFlip('lockScalingY')"></i>
                </div>
            </div>
          </el-form-item>
          <!--图片 end~~~~~~~~~~~~~~~~~~-->
          <div class="micro_line" v-show="selectObj.order!=0"></div>
          <el-form-item label="旋转" v-show="selectObj.order!=0">
            <el-col :span="9" style="text-align:center">
              <el-input-number  v-model="selectObj.angle" controls-position="right" :precision="0" @change='updateCanvas("angle")'></el-input-number>
              角度
            </el-col>
          </el-form-item>
          <div class="micro_line" v-show="selectObj.order!=0"></div>
            <!-- 翻转 -->
           <el-form-item label="翻转" v-show="selectObj.type=='image'&&selectObj.order!=0">
            <el-col :span="11" class="flex-box-normal flip-row">
                <i class="flip_horizontal el-icon-d-caret" @click="toggleLockOrFlip('flipX')" title="垂直翻转"></i><i class="flip_vertical el-icon-d-caret" title="水平翻转" @click="toggleLockOrFlip('flipY')"></i>
            </el-col>
          </el-form-item>
          <!-- <div class="micro_line" v-show="selectObj.order!=0"></div> -->
          <!--图片 start~~~~~~~~~~~~~~~~~~-->
         <!-- <el-form-item label="图片" v-show="selectObj.type=='image'">
            <el-button type="primary" class="pic-btn between_btn" @click="updateImgToFather">替换图片</el-button>
            <el-button @click="resetImg" class="pic-btn">恢复原图</el-button>
          </el-form-item> -->
          <!--图片 end~~~~~~~~~~~~~~~~~~-->
        </el-form>
        <el-form label-width="75px" label-position="left" size="mini" v-show="selectObj.type!='image'">
         
          <!--文字 start~~~~~~~~~~~~~~~~~~~-->
          <el-form-item label="文字" class="line_bottom">
              <textarea class="txt_area" rows="3" cols="20" v-model="selectObj.text" :maxLength="maxLen" @input='updateCanvas("text")'></textarea>
          </el-form-item>
          <div class="micro_line"></div>
          <el-form-item label="" class="flex-right">
            <div class="flex-box-normal flex-box-between">
                <el-col :span="14" class="flex-box-normal" style="text-align:center">
                    <el-button-group>
                        <!-- 颜色 -->
                        <el-color-picker style="vertical-align: middle" v-model="selectObj.fill" @change='updateCanvas("fill")'></el-color-picker>
                        <el-button :type="selectObj.fontWeight == 'bold'?'primary':''" @click='updateCanvas("fontWeight")'>B</el-button>
                        <el-button :type="selectObj.fontStyle == 'italic'?'primary':''" @click='updateCanvas("fontStyle")'>I</el-button>
                        <el-button :type="underline?'primary':''" @click='updateCanvas("underline")'>U</el-button>
                    </el-button-group>
                <!-- 字符设置 -->
                </el-col>
                <el-col :span="10" style="text-align:center">
                <el-input-number  v-model="selectObj.fontSize" controls-position="right" @change='updateCanvas("fontSize")'></el-input-number>
                <!-- 大小 -->
                </el-col>
            </div>
          </el-form-item>
          <!--文字 end~~~~~~~~~~~~~~~~~~~~~~~-->
          <!-- <div class="micro_line"></div> -->
        </el-form>
    </div>
</template>
<script>
    // import {lockWithOutInputSelect } from '@/utils/index.js';
    export default {
        name:'ParametersEdit',
        props:{
            /* 选中元素对象 */
            selectObj:{
                type:Object,
                default:{}
            },
            /* 修改元素属性值,回调方法 */
            canvasUpdate:{
                type:Function,
                default:function(){}
            },
            /* 替换图片操作 */
            updateImgToFather:{
                type:Function,
                default:function(){}
            },
            /* 母版尺寸 */
            matherSetSize:{
                type:Object,
                default:{}
            },
            /* 修改文本类text时回调 */
            copyRightLengthCheck:{
                type:Function,
                default:function(){}
            },
            //文案是否需要检测长度
            isCopyRightCheck:{
                type:Boolean,
                default:false
            }
        },
        data(){
            return{
                font_data:[],
                fontFamily: "",
                underline: false, //下划线
                fontUrl:'',//选择字体之后对应的url
            }
        },
        computed:{
            maxLen:function(){
                if(this.isCopyRightCheck&&[3,4,5].indexOf(this.selectObj.realType)>=0){
                    return this.selectObj.realType==3?16:this.selectObj.realType==4?20:10;
                }
                return 10000
            }
        },
        methods:{
            //元素属性修改同步事件
            updateCanvas(type) {
                let num,
                 obj = {};
                if(type=="text")
                {
                    num = this.selectObj[type];
                    let newTxt=this.copyRightLengthCheck({txt:num,type:this.selectObj.realType});
                    this.selectObj.text=newTxt;
                    this.selectObj[type]=newTxt;
                    return;
                }
                switch (type) {
                    case "fontWeight":
                        num = this.selectObj.fontWeight == "bold" ? "normal" : "bold";
                        obj.cssName = type;
                        obj.cssValue = num;
                        break;
                    case "fontStyle":
                        num = this.selectObj.fontStyle == "italic" ? "normal" : "italic";
                        obj.cssName = type;
                        obj.cssValue = num;
                        break;
                    case "underline":
                        num = !this.selectObj.underline;
                        obj.cssName = type;
                        obj.cssValue = num;
                        this.underline = !this.selectObj.underline;
                        break;
                    case "fontFamily":
                        num = this.fontFamily;
                        obj.cssName = 'realFontFamily';
                        obj.cssValue = num;
                        obj.url=this.fontUrl;
                        break;
                    default:
                        num = this.selectObj[type];
                        obj.cssName = type;
                        obj.cssValue = num;
                        break;
                }
                this.canvasUpdate(obj);
            },
            //字体选择事件
            fontChange(fontType){
                let obj=this.font_data.filter(res=>{
                    return res.fontType==fontType;
                });
                if(obj&&obj.length>0)
                {
                    this.fontUrl=obj[0].fontUrl;
                }
                this.updateCanvas("fontFamily");
            },
            //恢复图片
            resetImg: function() {
                if (this.selectObj && this.selectObj.oldSrc) {
                    var src = this.selectObj.oldSrc;
                    var obj = { cssName: "resetSrc", cssValue: src };
                    this.canvasUpdate(obj);
                }
            },
            //加载字体文件
            loadFont(list){
                this.font_data.push(...list);
            },
            //激活元素事件--canvas选中元素,同时同步到本页面展示对应的属性值
            setAvtiveObject: function(obj) {
                this.underline = obj.underline;
                this.fontFamily=obj.realFontFamily;
            },
            //锁定/解锁/翻转操作
            toggleLockOrFlip(name){
                let obj={};
                obj.cssName=name;
                obj.cssValue=this.selectObj[name]==true?false:true;
                console.log(obj);
                this.canvasUpdate(obj);
            }
        },
        mounted(){
            //禁用非文本框内容的选中状态
            // lockWithOutInputSelect();
        }
    }
</script>
<style scoped lang="less">
    .parameter_edit{
        color: #333;
        font-size: 14px;
    }
    .micro_editors_title {
        .small{
            font-size: 12px;
            color: #000000;
            margin-left: 17px;
        }
        line-height: 66px;
    }
    .micro_line {
        border-top: 1px solid #E4E4E4;
        margin-bottom: 14px;
    }
    /deep/ .el-input-number.is-controls-right .el-input__inner{
        padding-left: 5px;
        padding-right: 25px;
    }
    .toggle-lock{
        line-height: 30px;
        width: 13px;
        height: 30px;
        float: left;
        margin-right: 5px;
    }
    .toggle-lock i{
        font-size: 10px;
        margin-left: 5px;
    }
    .right_item{
        width: 60px;
        float: left;
    }
    /deep/ .el-input-number--mini .el-input-number__decrease,/deep/ .el-input-number--mini .el-input-number__increase{
        width: 20px;
        background: #3786FF;
        color: #fff;
    }
    /deep/ .el-input-number.is-controls-right .el-input-number__increase{
        border-bottom:1px solid #3786FF;
    }
    /deep/ .el-input--mini .el-input__inner{
        height: 24px;
        line-height: 24px;
    }
    /deep/ .el-input-number--mini{
        width: 60px;
    }
    .pic-btn{
        width: 70px;
        padding: 7px 10px;
    }
    /deep/ .el-button+.el-button{
        margin-left: 0;
    }
    .flip{
        margin-right: 13px;
        font-size: 24px;
    }
    /deep/ .el-button--mini, .el-button--mini.is-round{
        padding: 5px 10px;
    }
    .el-button-group{
        width: 100%;
        text-align: center;
        margin: 0 auto;
    }
    /deep/ .el-color-picker--mini .el-color-picker__trigger{
        height: 24px;
        line-height: 24px;
        width: 25px;
    }
    /deep/ .el-color-picker--mini{
        width: 24px;
    }
    .font-select{
        width: 120px;
        margin-right: 6px;
    }
    .flex-right{
        text-align: left;
        line-height: 24px;
    }
    .right_icon{
        width: 8px;
        height: 10px;
    }
    .flex-box-normal{
         display: -webkit-box;
        display: -moz-box;
        display: -webkit-flex; 
        display: -moz-flex; 
        display: -ms-flexbox; 
        display: flex;
        -webkit-align-items: center;
    }
    .flex-box-between{
        -webkit-justify-content: space-between;
        justify-content: space-between;
    }
    .lock-icon{
        width: 8px;
        height: 10px;
        display: inline-block;
        // background: url(../../assets/images/micro/lock-operator.png) no-repeat;
    }
    .unlock-icon{
        width: 8px;
        height: 10px;
        display: inline-block;
        // background: url(../../assets/images/micro/unlock-operator.png) no-repeat;
    }
    .flip_vertical{
        width: 18px;
        height: 18px;
        display: inline-block;
        transform: rotate(90deg);
        font-size: 20px;
        // background: url('../../assets/images/micro/flip-vertical.png') no-repeat;
    }
    .flip_horizontal{
        width: 18px;
        height: 18px;
        display: inline-block;
        font-size: 20px;
        // background: url('../../assets/images/micro/flip-horizontal.png') no-repeat;
        margin-right: 10px;
    }
    .flip-row{
        height: 28px;
        line-height: 28px;
    }
    .font-family-style{
        margin-bottom: 6px;
    }
    .line_bottom{
        margin-bottom: 10px;
    }
    .clear_bottom{
        margin-bottom: 0;
    }
    /deep/ .el-form-item__label{
        font-size: 14px;
        color: #333;
    }
    .between_btn{
        margin-right: 10px;
    }
    
    .txt_area{
        display: block;
        resize: vertical;
        padding: 5px 15px;
        line-height: 1.5;
        box-sizing: border-box;
        width: 100%;
        font-size: inherit;
        color: #606266;
        background-color: #fff;
        background-image: none;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        word-break: break-all;
    }
</style>


