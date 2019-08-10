<template>
    <!--图层~~~~~~~~~~~~~~~~~~~~~~-->
    <div class="micro_layer">
        <div class="title">
            图层
            <div class="add-icon">
                <!-- <i class="add-layer"></i> -->
                <ul>
                    <li @click="addPic">添加图层</li>
                    <li @click="addText">添加文案</li>
                </ul>
            </div>
        </div>
        <div class="list_box">
            <div :class="{'list':true, 'cl_both':true,'layer_active':selectIndex==item.index}" :draggable="item.type=='1-1'?false:true" @dragstart="drag" @drop="drop" @dragover="dragover" v-for="(item,index) in reserveLayerData" :key="index" @click="setAvtive(item.index)" :index="item.index">
                <span :class="{'work_micro_i_eye':item.visiable,'work_micro_i_eye_close':!item.visiable,'el-icon-view':true}" @click="toggelLevel"></span>
                <div class="text">{{item.text}}</div>
                <span v-if="item.type!='1-1'" class="work_micro_i_delete el-icon-delete" @click="delItem"></span>
            </div>
        </div>
    </div>
</template>
<script>
    import {isFireFox} from '@/utils/index.js'
    export default {
        name:'MicroLayer',
        props:{
            /* 图层数组 */
            micro_layer_data: {
                type: Array,
                default: []
            },
            /* 显示/隐藏图层 */
            toggleVisiable:{
                type:Function,
                default:function(){

                }
            },
            /* 点击图层,设置canvas中活动元素为对应点击图层元素 */
            setActiveObj:{
                type:Function,
                default:function(){

                }
            },
            /* 改变图层层级 */
            changeLevel:{
                type:Function,
                default:function(){

                }
            },
            /* canvas中新增图片 */
            addImage:{
                type:Function,
                default:function(){}
            },
            /* canvas中新增文本 */
            addTxt:{
                type:Function,
                default:function(){}
            },
            /*更新左侧图层信息 */
            addLayer:{
                type:Function,
                default:function(){}
            },
        },
        data(){
            return {
                moveIndex: 0, //拖动开始位置index
                movedIndex: 0, //拖动放置位置index
                selectIndex:-1,//图层选中index
            }
        },
        computed:{
            reserveLayerData(){
                let layerData=[];
                for(let i = this.micro_layer_data.length-1;i >= 0; i--)
                {
                    let obj=this.micro_layer_data[i];
                    obj.index=i;
                    layerData.push(obj);
                }
                return layerData;
            }
        },
        methods:{
            //设置图层显示隐藏
            toggelLevel: function(ev) {
                var idx = parseInt(ev.target.parentNode.getAttribute("index"));
                var obj = this.micro_layer_data.splice(idx, 1)[0];
                obj.visiable = !obj.visiable;
                this.micro_layer_data.splice(idx, 0, obj);
                this.toggleVisiable(idx,obj.visiable);
                ev.stopPropagation();
            },
            //删除图层
            delItem:function(ev){
                var idx=parseInt(ev.target.parentNode.getAttribute("index"));
                this.$confirm('您确定要删除改图层么?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.micro_layer_data.splice(idx,1);
                    this.$emit('delItem',idx);
                    this.selectIndex=-1;
                })
            },
            //选中图层--同时同步canvas的活动元素
            setAvtive:function(idx){
                console.log(this.micro_layer_data,idx);
                if(this.selectIndex!=idx)
                {
                    this.selectIndex=idx;
                    this.setActiveObj(idx);
                }
                
            },
            drop(ev) {
                // 拖动放置
                ev.preventDefault();
                if(this.movedIndex==0||this.moveIndex==0)
                {
                    return;
                }
                var moveObj = this.micro_layer_data.splice(this.moveIndex, 1);
                this.micro_layer_data.splice(this.movedIndex, 0, moveObj[0]);
                this.changeLevel(this.moveIndex, this.movedIndex);
                this.changeSelectedIndex();
            },
            //更改图层,调整选中元素的index
            changeSelectedIndex(){
                console.log(this.selectIndex,this.moveIndex,this.movedIndex);
                if(this.selectIndex==this.moveIndex)
                {
                    this.selectIndex=this.movedIndex;
                }
                else if(this.selectIndex==this.movedIndex)
                {
                    if(this.movedIndex==this.micro_layer_data.length-1)
                    {
                        this.selectIndex--;
                    }
                    else if(this.movedIndex==1)
                    {
                        this.selectIndex++;
                    }
                    else{
                        this.selectIndex=this.moveIndex;
                    }
                }
                else{
                    if((this.selectIndex>this.moveIndex&&this.selectIndex>this.movedIndex)||(this.selectIndex<this.moveIndex&&this.selectIndex<this.movedIndex))
                    {
                        return;
                    }
                    else if(this.moveIndex>this.movedIndex)
                    {
                        if(this.selectIndex<this.micro_layer_data.length-1||this.selectIndex>1)
                        {
                            this.selectIndex++;
                        }
                    }
                    else{
                        if(this.selectIndex>1)
                        {
                            this.selectIndex--;
                        }
                    }
                }
            },
            dragover(ev) {
                ev.preventDefault();
                this.movedIndex = parseInt(ev.currentTarget.getAttribute("index"));
            },
            drag(ev) {
                console.log(22);
                if(isFireFox())
                {
                    ev.dataTransfer.setData("imgInfo", ev.target.id)
                }
                let idx=parseInt(ev.currentTarget.getAttribute("index"))
                this.moveIndex =idx;
            },
            //canvas选中元素,同时更新到图层选中状态
            setActiveObject(order){
                this.selectIndex=parseInt(order);
            },
            //新增图层
            addPic(){
                let obj={};
                let id=this.micro_layer_data.length+1;
                obj.type='7-1';
                obj.bboxX1=0;
                obj.bboxY1=0;
                obj.swing=1;
                obj.title='图层'+id;
                obj.layerPictureUrl='new-pic.png';
                obj.layerIsEdit=1;
                obj.isGif=0;
                this.addImage(obj);
                var layerItem={visiable:1,type:obj.type,text:obj.title,id:id};
                this.addLayer(layerItem);
            },
            addText(){
                let obj={};
                let id=this.micro_layer_data.length+1;
                obj.type='3-1';
                obj.top=0;
                obj.left=0;
                obj.bboxX1=0;
                obj.bboxY1=0;
                obj.swing=1;
                obj.title='文案'+id;
                obj.layerPictureUrl='new-pic.png';
                obj.fontType=''
                obj.color='#000'
                obj.fontSize=20
                obj.fontBold=0
                obj.fontItalic=0
                obj.text='这里是新增文案内容'
                this.addTxt(obj);
                var layerItem={visiable:1,type:obj.type,text:obj.title,id:id};
                this.addLayer(layerItem);
            }
                
        }
    }
</script>
<style lang="less" scoped>
    .micro_layer {
        padding-left: 10px;
        .title {
            margin-bottom: 20px;
            position: relative;
            font-size: 14px;
            color:#333;
            line-height: 20px;
            text-align: left;
        }
        .list_box {
            background: #ffffff;
            // border: 1px solid #e4e4e4;
            // border-radius: 4px;
            overflow: hidden;
            font-size: 12px;
            width: 193px;
            color: #333;
            border-radius: 4px;
            border: 1px solid #E4E4E4;
            .layer_active{
                background: rgba(55, 134, 255, 0.1) !important;
            }
        }
        .list {
            height: 33px;
            line-height: 33px;
            padding: 0 7px;
            span {
                cursor: pointer;
                float: left;
                margin: 11px 6px 0 9px;
            }
            .work_micro_i_eye{
                color: #3785ff;
            }
            .work_micro_i_eye_close{
                color: #999999;
            }
            .work_micro_i_delete {
                float: right;
                color: #555;
            }
            .text {
            cursor: default;
            float: left;
            }
            &:nth-child(even) {
                background: #ffffff;
            }
            &:nth-child(odd) {
                background: #f9f9f9;
            }
        }
    }
    .add-icon{
        height:40px;
        text-align: center;
        position: relative;
        float:right;
        li{
            float: left;
            padding-left: 10px;
            cursor: pointer;
            font-size: 12px;
        }
    }
    .add-layer{
        position: absolute;
        top: 0px;
        right: 20px;
        display: block;
        width: 20px;
        height: 20px;
        // background: url(../../assets/images/micro/add-material-icon.png) center;
    }
    
        
</style>


