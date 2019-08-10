<template>
    <div :class="['micro_editors_box',{'clear-paddingtop':!isShowTitle}]">
        <div class="micro_editors_top_box" v-if="isShowTitle">
            <div class="micro_editors_top_ctrl">
                在线PS
            </div>
        </div>
        <div class="canvasEdit_container">
            <!--头部浮动操作栏-->
            <TopOperate
                :zoom="zoom"
                :unRedoStatus="unRedoStatus"
                :initialStatus="initialStatus"
                @undoButton="undoButton"
                @redoButton="redoButton"
                @changeZoom="changeZoom"
                @initializeDataMethod="initializeDataMethod"
                >
            </TopOperate>
            <el-container>
                <!--左侧栏-->
                <el-aside width="215px" class="left-aside">
                    <!--图层~~~~~~~~~~~~~~~~~~~~~~-->
                    <MicroLayer ref="MicroLayer" 
                        :toggleVisiable="toggleVisiable" 
                        :setActiveObj="setActiveObject" 
                        :changeLevel="changeLevel" 
                        @delItem="delItem" 
                        :micro_layer_data="micro_layer_data"
                        :addImage="addImage"
                        :addLayer="addLayer"
                        :addTxt="addTxt"
                        >
                    </MicroLayer>
                </el-aside>
                <!--主体内容canvas-->
                <el-main>
                    <div class="main_content" id="main_content">
                        <div class="canvas_row" id="canvas_row">
                            <canvas id="canvas" width="1000" height="600">
                            </canvas>
                        </div>
                    </div>
                </el-main>
                <!--右侧功能栏-->
                <el-aside width="260px" class="params_aside">
                    <!--属性值~~~~~~~~~~~~~~~~~~~~~~-->
                    <ParametersEdit :selectObj="selectObj" :canvasUpdate="canvasUpdate" :matherSetSize="matherSetSize" ref="ParametersEdit" :copyRightLengthCheck="copyRightLengthCheck" :isCopyRightCheck="isCopyRightCheck"></ParametersEdit>
                </el-aside>
            </el-container>
        </div>
        <!--底部浮动操作栏-->
        <BottomOperate
            :isPutInShow="isPutInShow"
            @close="close"
            @clickDownOrPutOutBtn="clickDowmOrPutOutBtn"
            >
        </BottomOperate>
    </div>
</template>
<script>
import {fabricObject} from "@/components/MicroEdit/fabricOperate.js";
import { fabricCommon } from "@/components/MicroEdit/bannerEditCommon.js";
import AddMaterials from '@/components/MicroEdit/AddMaterials.vue'
import MicroLayer from '@/components/MicroEdit/MicroLayer.vue'
import ParametersEdit from '@/components/MicroEdit/ParametersEdit.vue'
import TopOperate from '@/components/MicroEdit/TopOperate'
import BottomOperate from '@/components/MicroEdit/BottomOperate'

let canvasDemo={};
let initialZoom=100;//初始状态的zoom
export default {
    name: "BannerEdit",
    components: {
        AddMaterials,
        MicroLayer,
        ParametersEdit,
        TopOperate,
        BottomOperate
    },
    props:{
        //banner图层信息,已经格式化之后的
        bannerJson:{
            type:Array,
            required:true
        },
        //文案是否需要检测长度
        isCopyRightCheck:{
            type:Boolean,
            default:false
        },
        //是否显示微编辑的title
        isShowTitle:{
            type:Boolean,
            default:true
        }
    },
    data() {
        return {
            selectObj: {},
            zoom: 100,
            micro_layer_data:[],
            unRedoStatus:{
                undoStatus:false,
                redoStatus:false
            },//撤销/回退的可操作状态
            initialStatus:true,//是否是初始状态
            matherSetSize:{width:0,height:0},
            isPutInShow:false,//是否显示投放按钮
        };
    },
    methods: {
        initData:function(){
            let list=JSON.parse(JSON.stringify(this.bannerJson));
             //取背景图尺寸作为母版大小渲染
            let matherSetObj=list.filter(e => {
                return e.type == "1-1";
            });
            let matherSetSize={width:0,height:0};
            if(matherSetObj&&matherSetObj.length>0)
            {
                let obj=matherSetObj[0];
                matherSetSize.width=parseInt(obj.bboxWidth);
                matherSetSize.height=parseInt(obj.bboxHeight);
            }
            this.matherSetSize=matherSetSize
            // list=this.initDataWithShowText(list);
            let canvas=document.getElementById('canvas');
            canvas.width=this.matherSetSize.width;
            canvas.height=this.matherSetSize.height;
            document.getElementById('canvas_row').style.width=this.matherSetSize.width+'px';
            document.getElementById('canvas_row').style.height=this.matherSetSize.height+'px';

            let screenWidth=document.documentElement.clientWidth-475;
            let screenHeight=document.documentElement.clientHeight-65;
            let scaleX=Math.floor(screenWidth/this.matherSetSize.width*10),
                scaleY=Math.floor(screenHeight/this.matherSetSize.height*10);
            let scale=scaleX>scaleY?scaleY:scaleX;
            scale*=10;
            initialZoom=scale
            this.initZoom(scale);
            let _fabricObject=fabricObject(this);
            canvasDemo = fabricCommon(_fabricObject,this);
            canvasDemo.addObject(list);
            //绑定图层组件数据
            let levelList =this.getLayerList(list);
            this.initLayerList(levelList);
        },
        //第一次加载,用于获取图层组件对应的列表
        getLayerList(list){
            //生成层级显示数组
            let levelList = [];
            for (let i = 0; i < list.length; i++) {
                let obj = {};
                obj.visiable = true;
                obj.text = list[i].title;
                obj.id = i+1;
                obj.type = list[i].type;
                levelList.push(obj);
            }
            return levelList;
        },
        //撤销/回退操作完成回调
        undoSuccess:function(list){
            this.initLayerList(list);
        },
        //设置元素属性值
        canvasUpdate: function(data) {
            canvasDemo.setCss(data);
        },
        //新增图层信息
        addImage:function(obj){
            //转换数据
            canvasDemo.createImage(obj);
        },
        //新增文案信息
        addTxt:function(obj){
            //转换数据
            canvasDemo.createTxt(obj);
        },
        //新增图层信息到左侧图层列表
        addLayer(item){
            this.micro_layer_data.push(item);
        },
        //画布放大缩小
        changeZoom: function(type) {
            if (type == 0) {
                if(this.zoom>=200)
                return;
                //放大
                this.zoom += 10;
            } else {
                if(this.zoom<=10)
                return;
                //缩小
                this.zoom -= 10;
            }
            this.initZoom(this.zoom);
            // canvasDemo.setZoom(zoomValue);
        },
        setActiveObject: function(order) {
            canvasDemo.setActiveSelect(order);
        },
        changeLevel: function(moveOrder, movedOrder) {
            canvasDemo.updateLevel( moveOrder, movedOrder);
        },
        toggleVisiable: function(order, value) {
            canvasDemo.toggleVisiable(order, value);
        },
        delItem: function(order) {
            canvasDemo.delItem(order);
        },
        //初始化数据
        initializeDataMethod: function() {
            canvasDemo.initialize();
            this.initZoom(initialZoom);
        },
        setActiveObjectCallback:function(obj){
            this.selectObj={};
            this.selectObj=obj;
            this.$refs.ParametersEdit.setAvtiveObject(obj);
            this.$refs.MicroLayer.setActiveObject(obj.order);
        },
        initZoom:function(zoomValue){
            this.zoom = zoomValue;
            zoomValue/=100;
            let mainContent=document.getElementById('main_content');
            mainContent.style.transform="scale("+zoomValue+","+zoomValue+")";
            var myEvent = new Event('resize');
            window.dispatchEvent(myEvent);
        },
        undoButton:function(){
            canvasDemo.undo();
        },
        redoButton:function(){
            canvasDemo.redo();
        },
        modifyCopyright:function(list){
            canvasDemo.modifyCopyright(list);
        },
        clickDowmOrPutOutBtn(type){
            canvasDemo.downLoadImage();
        },
        //初始化图层
        initLayerList(list){
            this.micro_layer_data=list;
        },
        //取消操作
        close(isConfirm=true){
            this.$emit("close",isConfirm);
        },
        //更新撤销/回退的按钮操作状态
        updateUnRedoStatus(obj){
            this.unRedoStatus=obj;
        },
        //更新是否是初始状态的状态
        updateInitialStatus(status){
            this.initialStatus=status;
        },
        //文案类修改text方法,fabric有用到不能删除
        copyRightLengthCheck({txt,type}){
            if(!this.isCopyRightCheck)
            {
                let obj={cssName:'text',cssValue:txt};
                this.canvasUpdate(obj);
                return txt;
            }
            let copyRightTypeLengthMap = {
                '3-1': 16,
                '3-2': 20,
                '3-3': 10
            };
            let len = copyRightTypeLengthMap[type];
            let cssValue=txt;
            if(txt.length>len/2)
            {
                let realLen=getStrLength(txt);
                if(realLen>len)
                {
                    let copyRightTypeLengthMapMsg= {
                        '3-1': '主标题上限为8个汉字或16个字符',
                        '3-2': '副标题上限为10个汉字或20个字符',
                        '3-3': '行动词上限为5个汉字或10个字符'
                    };
                    let msg = copyRightTypeLengthMapMsg[type];
                    cssValue=this.getCutCopyRight(txt,len);
                    this.$message({
                        message: msg,
                        type: 'warning'
                    });
                }
            }
            let obj={cssName:'text',cssValue:cssValue};
            this.canvasUpdate(obj);
            return cssValue;
        },
        //文案类修改text方法,截取对应的length的值
        getCutCopyRight(txt,length){
            let strList=txt.split('');
            let result='';
            let reg=/[\u4e00-\u9fa5]/;
            let len=0;
            for(let i=0;i<strList.length;i++)
            {
                if(reg.test(strList[i])){
                    len+=2;
                }else{
                    len+=1;
                }
                if(len>length){
                    break;
                }
                result+=strList[i];
            }
            return result;
        },
    },
    mounted() {
        this.initData();
    }

};
</script>
<style lang="less" scoped>
    .canvasEdit_container {
        min-width: 1040px;
        width: 100%;
        text-align: center;
        height:calc(100vh - 65px);
        position: relative;
    }
    .micro_editors_box {
        height: 100%;
    }
    .clear-paddingtop{
        padding-top: 0;
    }
    .micro_editors_top_box {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        z-index: 200;
    }
    .micro_editors_top_ctrl {
        height: 60px;
        line-height: 60px;
        font-size: 18px;
        color: #333;
        background: #fff;
        text-align: center;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    }
    canvas{
        margin: 0 auto;
    }
    .canvas_row{
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }
    .el-main{
        padding: 0;
        position: relative;
        width: 100%;
        background: #F7F8FF;
        text-align: center;
        overflow: auto;
        height: calc(100vh - 65px);
        width: calc(100% - 475px);
    }
    .el-main::-webkit-scrollbar{
        width: 8px;
        height: 8px;
    }
    .main_content{
        width: 100%;
        height: 100%;
        transform:scale(1,1);
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .el-aside {
        padding-top: 16px;
        // background: #f9f9f9;
        // box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
        position: relative;
    }
    .params_aside{
        padding: 16px 11px 0 16px;
        box-sizing: border-box;
        box-shadow: 0 0 10px 0 rgba(0,0,0,0.10);
        border-radius: 8px;
    }
    .el-container {
        height: 100%;
    }

    .add-material{
        position: absolute;
        z-index: 100;
        right: 10px;
        top: 43px;
        background: #fff;
        border-radius: 4px;
        box-shadow: 2px 3px 25px rgba(34,34,199,0.1);
        /*向上*/
        .triangle_border_up{
            width:0;
            height:0;
            border-width:0 24px 7px;
            border-style:solid;
            border-color:transparent transparent #fff;/*透明 透明  灰*/
            margin:40px auto;
            position: absolute;
            top: -46px;
            right: 0;
        }
    }
    .left-aside{
        width: 215px;
        background: #fff;
    }
</style>

<style>
    .confirm_btn{
        width: 99px;
        border-radius: 17px;
    }
    /* .confirm_icon{
        background: url(../../assets/images/confirm_icon.png);
        width: 40px;
        height: 40px;
    } */
</style>
