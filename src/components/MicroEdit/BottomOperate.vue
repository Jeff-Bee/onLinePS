<template>
    <!--底部浮动操作栏-->
    <div class="operator_btn_row">
        <!-- <div class="operator_btn operator_btn_cancel" @click="close">返回</div> -->
        <div v-if="isGif" class="operator_btn operator_btn_down" @click="clickDownOrPutOutBtn(3)">保存</div>
        <div class="operator_btn operator_btn_down" @click="clickDownOrPutOutBtn(2)" :spa-modid="spaModidForDown" :sa-data="spaDataForDown">下载</div>
        <div class="operator_btn operator_btn_down" v-if="isPutInShow" @click="clickDownOrPutOutBtn(4)" :spa-modid="spaModidForPutOut" :sa-data="spaDataForPutOut">投放</div>
    </div>
</template>
<script>
export default {
    name:'BottomOperate',
    props:{
        isPutInShow:{
            type:Boolean,
            default:false
        },
        isGif:{
            type:Boolean,
            default:false
        },
        //下载埋点-id
        spaModidForDown:{
            type:String,
            default:''
        },
        //下载埋点-采集数据
        spaDataForDown:{
            type:String,
            default:''
        },
        //投放埋点-id
        spaModidForPutOut:{
            type:String,
            default:''
        },
        //投放埋点-采集数据
        spaDataForPutOut:{
            type:String,
            default:''
        }
    },
    data(){
        return{
            
        }
    },
    methods:{
        //关闭
        close(){
            this.$emit('close');
        },
        //投放/保存/下载
        clickDownOrPutOutBtn(val){
            this.$emit('clickDownOrPutOutBtn',val);
        }
    }
}
</script>
<style lang="less" scoped>
     .operator_btn_row{
        position: absolute;
        bottom: 60px;
        width: 500px;
        left: 50%;
        transform: translate(-50%,0);
        display: flex;
        justify-content: center;
        align-items: center;
    }    
    .operator_btn{
        width: 80px;
        height: 34px;
        line-height: 34px;
        border-radius: 17px;
        color: #FFFFFF;
        font-size: 14px;
        background: #3786FF;
        cursor: pointer;
        text-align: center;
    }     
    .operator_btn_cancel{
        background: #fff;
        border: 1px solid #3786FF;
        color: #3786FF;
    }   
    .operator_btn_down{
        margin-left: 40px;
    }   
</style>


