<!-- 统计图组件 -->
<template>
    <div 
        :id="id"
        :style="'width:'+ width+'px;height:'+height+'px;'">
    </div>
</template>

<script>
    import echarts from 'echarts'
    export default {
        props:{
            id:String,
            height:{
                type:String,
                default:"170"
            },
            width:{
                type:String,
                default:"170"
            },
            color:String,
            data:{
                type:Array,
                default:()=>{
                    return []
                }
            },
            rate:String,
            name:String,
            radius:{
                type:Array,
                default:()=>{
                    return ['53%', '65%']
                }
            }
        },
        data () {
            return {
                option1 :{
                    tooltip: {
                        confine:true,
                        appendToBody: true,
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)",
                    },
                    color:['#43DCFF', '#C0EF84','yellow','blueviolet'],
                    series: [
                        {
                            type:'pie',
                            selectedMode: 'single',
                            radius: [0, '20%'],
                            hoverOffset: 0,
                            // legendHoverLink:false,
                            // hoverAnimation: false,
                            animation:false,
                            tooltip:{
                                show:false,
                            },
                            itemStyle:{
                                opacity: 0
                            },
                            label: {
                                normal: {
                                    position: 'center',
                                    formatter: '{per|{c}}{b|}\n{a|{b}}\n{hr|}',
                                    rich: {
                                        per: {
                                            color: '#0abffd',
                                            fontSize: 20,
                                            lineHeight: 20,
                                            align: 'center'
                                        },
                                        a: {
                                            color: '#999999',
                                            align: 'center',
                                            fontSize: 12                                        
                                        },
                                        b: {
                                            color: '#0abffd',
                                            fontSize: 12,
                                            lineHeight: 40,
                                            align: 'center'
                                        },
                                        hr: {
                                            width: '100%',
                                            height: 0,
                                            alien:'center'
                                        }
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data:[
                                {
                                    value:this.rate,
                                }
                            ]
                        },
                        {
                            name:this.name,
                            type:'pie',
                            radius: this.radius,
                            "center": ["50%", "50%"], //整体的位置设置
                            stillShowZeroSum:false,
                            legendHoverLink:false,
                            hoverAnimation:false,
                            avoidLabelOverlap: false,
                            color: ( (this.color.split(',').length === 1) ? ((['#ddd']).concat(this.color.split(','))) : (this.color.split(','))  ) ,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                            },
                            labelLine: {
                               show: false
                            },
                            data:this.data
                        }
                    ]
                }
            }
        },
        mounted(){
            this.initEcharts();
        },
        methods:{
            initEcharts(){
                let echartsObj=echarts.init(document.getElementById(this.id));
                echartsObj.setOption(this.option1);
            }
        },
        components: {

        }
    }
</script>

<style>

 
</style>
