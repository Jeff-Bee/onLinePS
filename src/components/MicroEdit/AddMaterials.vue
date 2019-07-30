<template>
    <div class="addMaterials_container">
        <div class="add_list_box">
          <div class="add_list" :class="{'active':add_list_select.id===item.id}" @click="add_list_click(item)" v-for="item in add_list_data" :key="item.icon">
            <span :class="item.icon"></span>
            {{item.text}}
          </div>
        </div>

        <j-dialog :width="'840px'" :z-index="1100" :visible.sync="commodity_alert_state">
            <div slot="title">
                <div style="float:left;margin-right:10px;margin-top:-4px;" class="work_banner_pic_icon"></div>
                选择商品主图
            </div>
            <commodity-alert :maxSelectLength="maxSelectLength" :is-select="false" @commodityAlertClose="commodity_alert_close_fun"></commodity-alert>
        </j-dialog>
        <j-dialog :width="'840px'" :z-index="1100" :visible.sync="copy_writing_alert_state">
            <div slot="title">
                <div style="float:left;margin-right:10px;margin-top:-4px;" class="work_copy_writing_icon"></div>
                选择文案
            </div>
            <copy-writing-alert :is-select="false" @copyWritingDialogClose="copy_writing_alert_fun"></copy-writing-alert>
        </j-dialog>
        <j-dialog :width="'840px'" :z-index="1100" :visible.sync="logo_alert_state">
            <div slot="title">
                <div style="float:left;margin-right:10px;margin-top:-1px;" class="work_logo_icon"></div>
                选择LOGO
            </div>
            <logo-alert :maxSelectLength="maxSelectLength" :is-select="false" @masterAlertClose="logo_alert_close_fun"></logo-alert>
        </j-dialog>
        <j-dialog :width="'840px'" :z-index="1100" :visible.sync="background_alert_state">
            <div slot="title">
                <div style="float:left;margin-right:10px;margin-top:-1px;" class="work_background_icon"></div>
                选择背景
            </div>
            <background-alert :is-select="false" :maxSelectLength="maxSelectLength" @masterAlertClose="background_alert_close_fun"></background-alert>
        </j-dialog>
        <j-dialog :width="'840px'" :z-index="1100" :visible.sync="explosion_sticker_alert_state">
            <div slot="title">
                <div style="float:left;margin-right:10px;margin-top:-1px;" class="work_explosion_sticker_icon"></div>
                选择爆炸贴
            </div>
            <explosion-sticker-alert :maxSelectLength="maxSelectLength" :is-select="false" @masterAlertClose="explosion_sticker_alert_close_fun"></explosion-sticker-alert>
        </j-dialog>
        <j-dialog :width="'840px'" :z-index="1100" :visible.sync="mongolian_layer_alert_state">
            <div slot="title">
                <div style="float:left;margin-right:10px;margin-top:-1px;" class="work_mongolian_layer_icon"></div>
                选择蒙层
            </div>
            <mongolian-layer-alert :defaultSelectLayerType="getMongoLayerType" ref="mongolianLayerAlert" :maxSelectLength="maxSelectLength" :is-select="false" @masterAlertClose="mongolian_layer_alert_close_fun"></mongolian-layer-alert>
        </j-dialog>
        <j-dialog :width="'840px'" :z-index="1100" :visible.sync="texture_alert_state">
            <div slot="title">
                <div style="float:left;margin-right:10px;margin-top:-1px;" class="work_texture_icon"></div>
                选择纹理
            </div>
            <texture-alert :defaultSelectLayerType='getTextureLayerType' ref="textureAlert" :maxSelectLength="maxSelectLength" :is-select="false" @masterAlertClose="texture_alert_close_fun"></texture-alert>
        </j-dialog>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex'
    // import {getCurrentContent,getImageContent} from '@/utils/bannerDataTransform'
    export default {
        name:'AddMaterials',
        props:{
            /* 图层数组 */
            micro_layer_data:{
                type:Array,
                default:[]
            },
            /* 新增/替换文案回调 */
            modifyCopyright:{
                type:Function,
                default:function(){}
            },
            /* 替换图片回调 */
            canvasUpdate:{
                type:Function,
                default:function(){}
            },
            /* canvas中新增图片 */
            addImage:{
                type:Function,
                default:function(){}
            },
            /* 新增图片,加到图层数组 */
            addLayer:{
                type:Function,
                default:function(){}
            },
        },
        data(){
            return{
                imgType: 1, // 1为新增2为替换图片
                maxSelectLength:1,
                texture_alert_state: false,
                mongolian_layer_alert_state: false,
                explosion_sticker_alert_state: false,
                commodity_alert_state: false,
                copy_writing_alert_state: false,
                background_alert_state: false,
                logo_alert_state: false,
                add_list_select: {
                    // 左侧栏选中数据
                    id: 1,
                    icon: "work_banner_pic_icon",
                    text: "商品主图"
                },
                add_list_data: [
                    {
                    id: 1,
                    icon: "work_banner_pic_icon",
                    text: "商品主图",
                    state: "commodity_alert_state"
                    },
                    {
                    id: 2,
                    icon: "work_copy_writing_icon",
                    text: "文案",
                    state: "copy_writing_alert_state"
                    },
                    // {
                    //   id: 3,
                    //   icon: "work_background_icon",
                    //   text: "背景",
                    //   state: "background_alert_state"
                    // },
                    {
                    id: 4,
                    icon: "work_texture_icon",
                    text: "纹理装饰",
                    state: "texture_alert_state"
                    },
                    {
                    id: 5,
                    icon: "work_explosion_sticker_icon",
                    text: "爆炸贴",
                    state: "explosion_sticker_alert_state"
                    },
                    {
                    id: 6,
                    icon: "work_logo_icon",
                    text: "LOGO",
                    state: "logo_alert_state"
                    },
                    {
                    id: 7,
                    icon: "work_mongolian_layer_icon",
                    text: "蒙层",
                    state: "mongolian_layer_alert_state"
                    }
                ],
                layerTypeNums:{},//用于存储各素材已经加到的编号
                textureLayerType:'',//文理默认选中图层类型
                mongoLayerType:'',//蒙城默认选中图层类型
            }
        },
        computed:{
            ...mapGetters({
                pictlayerInfos:'pictlayerInfos'
            }),
            getMongoLayerType(){
                return this.imgType==1?"":this.mongoLayerType
            },
            getTextureLayerType(){
                return this.imgType==1?"":this.textureLayerType
            }
        },
        methods:{
             // 关闭纹理 item为选中的数据
            texture_alert_close_fun(item) {
                console.log(item);
                this.texture_alert_state = false;
                if (this.imgType === 1) {
                    this.addImageCommon(item[0],item[0].layerType);
                } else {
                    this.updateImageCommon(item[0],item[0].layerType);
                }
            },
            // 关闭蒙层 item为选中的数据
            mongolian_layer_alert_close_fun(item) {
                console.log(item);
                this.mongolian_layer_alert_state = false;
                if (this.imgType === 1) {
                    this.addImageCommon(item[0],item[0].layerType);
                } else {
                    this.updateImageCommon(item[0],item[0].layerType);
                }
            },
            // 关闭爆炸贴 item为选中的数据
            explosion_sticker_alert_close_fun(item) {
                this.explosion_sticker_alert_state = false;
                if (this.imgType === 1) {
                    this.addImageCommon(item[0],'5-1');
                } else {
                this.updateImageCommon(item[0],'5-1');
                }
                },
            // 关闭背景 item为选中的数据
            background_alert_close_fun(item) {
                console.log(item);
                this.background_alert_state = false;
                if (this.imgType === 1) {
                    this.addImageCommon(item[0],'1-1');
                } else {
                this.updateImageCommon(item[0],'1-1');
                }
            },
            // 新增/替换logo
            logo_alert_close_fun(item) {
                this.logo_alert_state = false;
                if (this.imgType === 1) {
                    this.addImageCommon(item[0],'4-1');
                } else {
                this.updateImageCommon(item[0],'4-1');
                }
            },
            //新增文案,有替换,没有新增
            copy_writing_alert_fun(item) {
                // 关闭文案item为选中的数据
                this.copy_writing_alert_state = false;
                var wa=[];
                //有主标题
                if(item.mainTitle)
                {
                    var obj= this.copyRightCommon('3-1',item);
                    wa.push(obj);
                }
                //有副标题
                if(item.mainTitle)
                {
                    var obj= this.copyRightCommon('3-2',item);
                    wa.push(obj);
                }
                //有行动词
                if(item.mainTitle)
                {
                    var obj= this.copyRightCommon('3-3',item);
                    wa.push(obj);
                }
                this.modifyCopyright(wa);
            },
            //添加/替换商品图回调
            commodity_alert_close_fun(item) {
                console.log(item);
                // 关闭商品主图item为选中的数据
                this.commodity_alert_state = false;
                if (this.imgType === 1) {
                this.addImageCommon(item[0],'2-1');
                } else {
                    // 替换商品主图的回调
                    this.updateImageCommon(item[0],'2-1');
                }
            },
            // 左侧栏列表点击事件
            add_list_click(item) {
                this.add_list_select = Object.assign({}, item);
                this[item.state] = true;
                this.imgType=1;
            },
            //替换图片公用方法
            updateImageCommon:function(item,type){
                var obj={};
                type=type+"";
                if(item)
                {
                    obj.type=type;
                    obj.bboxX1=0;
                    obj.bboxY1=0;
                    obj.swing=1;
                    let content=getImageContent({type:type,mergeObject:item});
                    obj.title=content.title
                    obj.layerPictureUrl=content.PictureUrl
                    obj.PictureName=content.PictureName
                    obj.motherSetNumRef=content.PictureNum
                    obj.id=content.id
                    obj.userId=content.userId
                    obj.pictType=content.type
                    obj.layerIsEdit=1;
                    obj.isGif=0;
                }
                var name=this.getTypeToName(obj.type)+(this.micro_layer_data.filter(e => {
                    return e.type == obj.type;
                }).length + 1);
                obj.title=name;
                var updateObj = {
                    cssName: "src",
                    cssValue:obj
                };
                console.log(updateObj);
                this.canvasUpdate(updateObj);
                // this.textureLayerType='';
                // this.mongoLayerType=''
            },
            //新增图片类公用方法
            addImageCommon:function(item,type){
                var obj={};
                type=type+"";
                if(item)
                {
                    obj.type=type;
                    obj.bboxX1=0;
                    obj.bboxY1=0;
                    obj.swing=1;
                    let content=getImageContent({type:type,mergeObject:item});
                    obj.title=content.title
                    obj.layerPictureUrl=content.PictureUrl
                    obj.PictureName=content.PictureName
                    obj.motherSetNumRef=content.PictureNum
                    obj.id=content.id
                    obj.userId=content.userId
                    obj.pictType=content.type
                    obj.layerIsEdit=1;
                    obj.isGif=0;
                }
                var name=this.getTypeToName(obj.type)+this.getTypeNum(obj.type);
                obj.title=name;
                this.addImage(obj);
                var obj={visiable:1,type:obj.type,text:obj.title,id:this.micro_layer_data.length+1};
                this.addLayer(obj);
            },
            //文案新增帮助
            copyRightCommon:function(type,item){
                var obj={};
                obj.type=type;
                obj.bboxX1=0;
                obj.bboxY1=0;
                obj.swing=1;
                obj.top=0;
                obj.left=0;
                let content=getCurrentContent({type:type,mergeObject:item});
                obj.fontType=content.fontFamily
                obj.color=content.color
                obj.fontSize=content.fontSize
                obj.fontBold=content.fontBold
                obj.fontItalic=content.fontItalic
                obj.userId=item.userId
                obj.text=content.title
                var num=(this.micro_layer_data.filter(e => {
                    return e.type == obj.type;
                }).length + 1);
                var name=this.getTypeToName(obj.type)+num;
                obj.title=name;
                console.log(item,obj,content);
                if(num<=1)//没有
                {
                var layerItem={visiable:1,type:obj.type,text:obj.title,id:this.micro_layer_data.length+1};
                this.addLayer(layerItem);
                }
                return obj;
            },
            //获取type对应的类型名称
            getTypeToName: function(type) {
                var name = "";
               if(!this.pictlayerInfos||this.pictlayerInfos.length==0)
                {
                    return name;
                }
                let nameList=this.pictlayerInfos.filter(item=>item.twoLevelLayerType==type);
                if(nameList&&nameList.length>0)
                {
                    name=nameList[0].twoLevelLayerDescription
                }
                return name;
            },
            //替换图片--弹出对应素材的选择框
            updateImg(realType) {
                this.imgType=2;
                switch(realType)
                {
                    case '1-1':
                        this.background_alert_state = true;
                        break;
                    case '2-1':
                        this.commodity_alert_state = true;
                        break;
                    case '4-1':
                        this.logo_alert_state = true;
                        break;
                    case '5-1':
                        this.explosion_sticker_alert_state = true;
                        break;
                    case '6-1':
                    case '6-2':
                    case '6-3':
                        this.textureLayerType=realType;
                        this.texture_alert_state = true;
                        break;
                    case '7-1':
                    case '7-2':
                    case '7-3':
                    case '7-4':
                    case '7-5':
                    case '7-6':
                        this.mongoLayerType=realType;
                        this.mongolian_layer_alert_state = true;
                        break;
                }
            },
            //第一次加载,统计各素材已经存在的个数
            initialLayerNums(layerList){
                this.layerTypeNums={};
                layerList.forEach(i=>{
                    if(this.layerTypeNums[i.type])
                    {
                        this.layerTypeNums[i.type]++;
                    }
                    else{
                        this.layerTypeNums[i.type]=1;
                    }
                });
            },
            //获取素材对应已添加的编号
            getTypeNum(type){
                // type=parseInt(type);
                let num= this.layerTypeNums[type]!=undefined?this.layerTypeNums[type]:0;
                num++;
                this.layerTypeNums[type]=num;
                return num;
            }
        }
    }
</script>
<style scoped lang='less'>
    .micro_editors_title {
        .big {
            color: #000000;
            margin-right: 20px;
        }
        font-size: 16px;
        margin-bottom: 20px;
    }
    .add_list_box{
        width: 195px;
        text-align: center;
        padding-top:20px;
        padding-bottom: 10px;
        font-size: 16px;
        .add_list:last-child{
            border: none;
        }
    }
    .add_list {
        span {
            vertical-align: middle;
            margin-left: 10px;
            width: 20px;
            height: 18px;
            background-position: left center;
            background-repeat: no-repeat;
            margin-right: 10px;
        }
        cursor: pointer;
        background: #ffffff;
        width: 195px;
        height: 44px;
        line-height: 44px;
        margin: 0 auto;
        margin-bottom: 10px;
        width: 136px;
        border-bottom: 1px solid #F0F0F0;
        text-align: left;
        padding-left: 15px;
        display: flex;
        align-items: center;
        //素材--图标
        // .work_banner_pic_icon{
        //     background: url("../../assets/images/s_goods.png");
        // }
        // .work_texture_icon {
        //     background: url("../../assets/images/s_wenli.png");
        // }
        // .work_mongolian_layer_icon {

        //     background: url("../../assets/images/s_mengceng.png");
        // }
        // .work_explosion_sticker_icon {
        //     background: url("../../assets/images/s_baozhatie.png");
        // }
        // .work_logo_icon {
        //     background: url("../../assets/images/s_logo11.png");
        // }
        // .work_copy_writing_icon {
        //     background: url("../../assets/images/s_copywrite.png");
        // }
    }
    .add_list.active {
        color: #458EFE ;
        //素材--图标
        // .work_banner_pic_icon{
        //     background: url("../../assets/images/s_goods_active.png");
        // }
        // .work_texture_icon {
        //     background: url("../../assets/images/s_wenli_active.png");
        // }
        // .work_mongolian_layer_icon {

        //     background: url("../../assets/images/s_mengceng_active.png");
        // }
        // .work_explosion_sticker_icon {
        //     background: url("../../assets/images/s_baozhatie_active.png");
        // }
        // .work_logo_icon {
        //     background: url("../../assets/images/s_logo11_active.png");
        // }
        // .work_copy_writing_icon {
        //     background: url("../../assets/images/s_copywrite_active.png");
        // }
    }


</style>


