<template>
	<div class="Home">
		<BannerEdit
            :bannerJson="bannerJson"
            :matherSetSize="matherSetSize"
            @saveBanner="saveBanner"
            >
        </BannerEdit>
	</div>
</template>
<script>
import BannerEdit from '@/components/MicroEdit/BannerEdit'
export default {
	name: 'home',
	components:{
        BannerEdit
    },
	data(){
		return{
			bannerJson:[],
			matherSetSize:{width:0,height:0}
		}
	},
	methods:{
		//保存
		saveBanner({type,initialStatus,imgQuality,bannerData}){

		}
	},
	created(){
		let data=[
			{"title":"背景1","bboxWidth":"1222","bboxHeight":"456","bboxX1":"0","bboxX2":"1222","bboxY1":"0","bboxY2":"456","order":"0","type":"1-1","isGif":0,"layerIsEdit":1,"layerPictureUrl":"75abc05c659f4d5aa047b1c4e9bdd81a.png","motherSetNumRef":"201960241055174110","PictureName":"","id":"","userId":"","pictType":"","fontType":""},
			{"title":"图层1","bboxWidth":"530","bboxHeight":"525","bboxX1":"635","bboxX2":"1168","bboxY1":"157","bboxY2":"682","order":"1","type":"7-2","isGif":0,"layerIsEdit":1,"layerPictureUrl":"9206b8e038074cc9b6ff54330348cc01.png","motherSetNumRef":"201954169270520169","PictureName":"","id":"","userId":"","pictType":"","fontType":""},
			{"title":"图层2","bboxWidth":"153","bboxHeight":"168","bboxX1":"-77","bboxX2":"84","bboxY1":"335","bboxY2":"503","order":"2","type":"6-2","isGif":0,"layerIsEdit":1,"layerPictureUrl":"6acfc5f2a8f04981a8b785fde5b2a87c.png","motherSetNumRef":"201958599645878151","PictureName":"","userId":"","pictType":"","fontType":""},
			{"title":"图层3","bboxWidth":"153","bboxHeight":"168","bboxX1":"352","bboxX2":"513","bboxY1":"-115","bboxY2":"53","order":"3","type":"6-2","isGif":0,"layerIsEdit":1,"layerPictureUrl":"f769bc0e1115441f99dc3468fe4e1db7.png","motherSetNumRef":"201958599646304152","PictureName":"","userId":"","pictType":"","fontType":""},
			{"title":"图层4","bboxWidth":"130","bboxHeight":"18","bboxX1":"472","bboxX2":"602","bboxY1":"386","bboxY2":"404","order":"4","type":"6-1","isGif":0,"layerIsEdit":1,"layerPictureUrl":"5690278ce1b44cdaab95a90684ec8803.png","motherSetNumRef":"201954169781745187","PictureName":"","userId":"","pictType":"","fontType":""},
			{"title":"图层5","bboxWidth":"84","bboxHeight":"12","bboxX1":"1108","bboxX2":"1192","bboxY1":"127","bboxY2":"139","order":"5","type":"6-1","isGif":0,"layerIsEdit":1,"layerPictureUrl":"5690278ce1b44cdaab95a90684ec8803.png","motherSetNumRef":"201954169781745187","PictureName":"","userId":"","pictType":"","fontType":""},
			{"title":"图层6","bboxWidth":"314","bboxHeight":"50","bboxX1":"188","bboxX2":"502.0","bboxY1":"230","bboxY2":"280","order":"6","type":"7-4","isGif":0,"layerIsEdit":1,"layerPictureUrl":"12c3946fa8c445e8a4f6de664893ae22.png","motherSetNumRef":"201954169372427200","PictureName":"","id":"","userId":"","pictType":"","fontType":""},
			{"title":"图层7","bboxWidth":"138","bboxHeight":"50","bboxX1":"276","bboxX2":"414.0","bboxY1":"291","bboxY2":"341","order":"7","type":"7-5","isGif":0,"layerIsEdit":1,"layerPictureUrl":"c365ab6dbe274c1587df1ce13b1bbe29.png","motherSetNumRef":"201958526286323122","PictureName":"","id":"","userId":"","pictType":"","fontType":""},
			{"title":"商品图1","bboxWidth":"340","bboxHeight":"340","bboxX1":"734","bboxX2":"1074","bboxY1":"133","bboxY2":"503","order":"8","type":"2-1","isGif":0,"layerIsEdit":1,"layerPictureUrl":"3adc468aa17543e0902330f1a74c856a.92e9cd1b464643c7957426b8e2735ef8.jpg","motherSetNumRef":"201962290575412104","PictureName":"用户:sn17073564在2019-07-05 09:35:54上传的banner商品图","id":"9782","userId":"sn17073564","pictType":"1","fontType":""},
			{"title":"文案2","bboxWidth":"189","bboxHeight":"27","bboxX1":"250","bboxX2":"439.0","bboxY1":"240","bboxY2":"267.0","order":"9","type":"3-2","isGif":0,"layerIsEdit":1,"fontSize":27,"color":"#FFFFFF","text":"一减到底购屯起","fontType":"FZZCHJW--GB1-0","fontBold":"0","fontItalic":"0","userId":"sn88385718"},
			{"title":"文案3","bboxWidth":"119","bboxHeight":"24","bboxX1":"258","bboxX2":"377.0","bboxY1":"304","bboxY2":"328.0","order":"10","type":"3-3","isGif":0,"layerIsEdit":1,"fontSize":24,"color":"#000000","text":"嗨起来嗨起","fontType":"FZZCHJW--GB1-0","fontBold":"0","fontItalic":"0","userId":"sn88385718"},
			{"title":"文案1","bboxWidth":"442","bboxHeight":"61","bboxX1":"124","bboxX2":"566.0","bboxY1":"153","bboxY2":"214.0","order":"11","type":"3-1","isGif":0,"layerIsEdit":1,"fontSize":61,"color":"#FFFFFF","text":"大减价大减价GO","fontType":"FZZCHJW--GB1-0","fontBold":"0","fontItalic":"0","userId":"sn88385718"}
		];
		this.bannerJson=data;
	}
};
</script>
<style lang="less" scoped>
</style>