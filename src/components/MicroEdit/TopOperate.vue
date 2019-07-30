<template>
    <!--头部浮动操作栏-->
    <div :class="['micro_editors_top_operate',{'banner':!isGif}]">
        <div class="micro_editors_top">
            <div class="ctr_left cl_l">
                <div class="pre ctr cl_l" @click="undoButton">
                    <span :class="{'work_micro_i_1':unRedoStatus.undoStatus,'work_micro_i_1_disabled':!unRedoStatus.undoStatus, 'icon_item el-icon-refresh-left':true}"></span>
                </div> 
                <div class="next ctr cl_l" @click="redoButton">
                    <span :class="{'work_micro_i_2':unRedoStatus.redoStatus,'work_micro_i_2_disabled':!unRedoStatus.redoStatus, 'icon_item el-icon-refresh-right':true}"></span>
                </div> 
                <div class="line ctr cl_l"></div> 
                <div class="num_box cl_l">
                    <span :class="{'work_micro_i_4':zoom<200,'work_micro_i_4_disabled':zoom>=200, 'ctr cl_l zoom_item_icon el-icon-zoom-in':true}" @click="changeZoom(0)"></span> 
                    <div class="num cl_l zoom_item_content">{{zoom}}%</div> 
                    <span :class="{'work_micro_i_5_disabled':zoom<=10,'work_micro_i_5':zoom>10, 'ctr cl_l zoom_item_icon el-icon-zoom-out':true}" @click="changeZoom(1)"></span>
                </div> 
                <div class="line ctr cl_l"></div> 
                <div class="init ctr cl_l reload_row" @click="initializeDataMethod">
                    <span :class="{'work_micro_i_3':!initialStatus,'work_micro_i_3_disabled':initialStatus, 'load_initial icon_item el-icon-refresh':true}"></span>
                    一键还原
                </div>
            </div> 
        </div>
        <!-- <div v-if="isGif" :class="['preview_state',{'preview_state_normal':!isReviewing,'preview_state_playing ':isReviewing}]" @click="clickDownOrPutOutBtn(1)">
        </div> -->
    </div>   
</template>
<script>
    export default {
        name:'TopOperate',
        props:{
            //撤销,回退状态
            unRedoStatus:{
                type:Object,
                default:()=>{
                    return{}
                }
            },
            //是否是预览状态
            isReviewing:{
                type:Boolean,
                default:false
            },
            //是否是初始状态
            initialStatus:{
                type:Boolean,
                default:true
            },
            //缩放比例
            zoom:{
                type:Number,
                default:100
            },
            isGif:{
                type:Boolean,
                default:false
            }
        },
        data(){
            return{
                
            }
        },
        methods:{
            //撤销
            undoButton(){
                this.$emit('undoButton');
            },
            //回退
            redoButton(){
                this.$emit('redoButton');
            },
            //放大/缩小
            changeZoom(val){
                this.$emit('changeZoom',val);
            },
            //初始化
            initializeDataMethod(){
                this.$emit('initializeDataMethod');
            },
            //预览/关闭
            clickDownOrPutOutBtn(val){
                this.$emit('clickDownOrPutOutBtn',val);
            }
        }
    }
</script>
<style scoped lang="less">
    .micro_editors_top_operate{
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translate(-50%,0);
        z-index: 200;
        width: 396px;
        line-height: 46px;
        .micro_editors_top {
            font-size: 14px;
            height: 46px;
            background: #ffffff;
            width: 335px;
            border: 1px solid #E8E8E8;
            border-radius: 35.5px;
            line-height: 46px;
            float: left;
            .work_micro_i_1{
                width: 20px;
                display: inline-block;
                height: 20px;
                // background: url(../../assets/images/work_micro_i_1.png);
            }
            .work_micro_i_1_disabled{
                width: 20px;
                display: inline-block;
                height: 20px;
                // background: url(../../assets/images/work_micro_i_1_disabled.png);
            }
            .work_micro_i_1:hover{
                width: 20px;
                display: inline-block;
                height: 20px;
                // background: url(../../assets/images/work_micro_i_1_hover.png);
            }
            .work_micro_i_2{
                width: 20px;
                display: inline-block;
                height: 20px;
                // background: url(../../assets/images/work_micro_i_2.png);
            }
            .work_micro_i_2_disabled{
                width: 20px;
                display: inline-block;
                height: 20px;
                // background: url(../../assets/images/work_micro_i_2_disabled.png);
            }
            .work_micro_i_2:hover{
                width: 20px;
                display: inline-block;
                height: 20px;
                // background: url(../../assets/images/work_micro_i_2_hover.png);
            }
            .work_micro_i_3{
                width: 20px;
                display: inline-block;
                height: 20px;
                // background: url(../../assets/images/work_micro_i_3.png);
            }
            .work_micro_i_3_disabled{
                width: 20px;
                display: inline-block;
                height: 20px;
                // background: url(../../assets/images/work_micro_i_3_disabled.png);
            }
            .work_micro_i_3:hover{
                width: 20px;
                display: inline-block;
                height: 20px;
                // background: url(../../assets/images/work_micro_i_3_hover.png);
            }
            .work_micro_i_4{
                width: 20px;
                display: inline-block;
                height: 20px;
                // background: url(../../assets/images/work_micro_i_4.png);
            }
            .work_micro_i_4_disabled{
                width: 20px;
                display: inline-block;
                height: 20px;
                // background: url(../../assets/images/work_micro_i_4_disabled.png);
            }
            .work_micro_i_4:hover{
                width: 20px;
                display: inline-block;
                height: 20px;
                // background: url(../../assets/images/work_micro_i_4_hover.png);
            }
            .work_micro_i_5{
                width: 20px;
                display: inline-block;
                height: 20px;
                // background: url(../../assets/images/work_micro_i_5.png);
            }
            .work_micro_i_5_disabled{
                width: 20px;
                display: inline-block;
                height: 20px;
                // background: url(../../assets/images/work_micro_i_5_disabled.png);
            }
            .work_micro_i_5:hover{
                width: 20px;
                display: inline-block;
                height: 20px;
                // background: url(../../assets/images/work_micro_i_5_hover.png);
            }
            .load_initial{
                margin-left: 14px;
                margin-right: 6px;
            }
            .num_box {
                width: 104px;
                height: 28px;
                line-height: 28px;
                border: 1px solid #8A8A8A;
                border-radius: 18px;
                margin: 0 10px;
                margin-top: 8px;
                .zoom_item_icon{
                    margin-top: 3px;
                    margin-left: 3px;
                    margin-right: 0;
                    font-size: 20px;
                }
                .zoom_item_content{
                    width: 53px;
                    text-align: center;
                }
            }
            .ctr {
                cursor: pointer;
            }
            .ctr_left {
                color: #333333;
                line-height: 36px;
                margin-left: 21px;
                .line {
                width: 2px;
                height: 44px;
                background: #e4e4e4;
                }
                & > div:nth-child(2) {
                margin-right: 4px;
                }
                span {
                float: left;
                margin-top: 6px;
                margin-right: 10px;
                }
                .icon_item{
                    margin-top: 12px;
                    font-size: 20px;
                }
                .reload_row{
                    line-height: 46px;
                }
            }
        
        }    
        .preview_state{
            width: 46px;
            height: 46px;
            background-color: #FFFFFF;
            border: 1px solid #E8E8E8;
            border-radius: 23px;
            margin-left: 15px;
            float: left;
        } 
        // .preview_state_playing{
        //     background: url(../../assets/images/gif_merge/pause_play_normal.png) center center no-repeat;
        //     background-color: #fff;
        //     &:hover{
        //         background: url(../../assets/images/gif_merge/pause_play_active.png) center center no-repeat;
        //         background-color: #fff;
        //     }
        // }
        // .preview_state_normal{
        //     background: url(../../assets/images/gif_merge/start_play_normal.png) center center no-repeat;
        //     background-color: #fff;
        //     &:hover{
        //         background: url(../../assets/images/gif_merge/start_play_active.png) center center no-repeat;
        //         background-color: #fff;
        //     }
        // }
    }
    .banner{
        width: 335px;
    }
</style>

