import * as echarts from 'echarts';
import '../style/visual.less';

interface IRenderConfig {
  legend: string;
  xAxis: string[];
  values: number[];
  isMock: boolean;
}

export default class Visual extends WynVisual {
  private static defaultConfig: IRenderConfig = {
    legend: 'Amount',
    xAxis: ['S', 'L', 'XL', 'XXL'],
    values: [5, 10, 15, 20],
    isMock: true,
  }

  private echartsInstance: echarts.ECharts;
  private renderConfig: IRenderConfig;
  private styleConfig: any;
  private dom: HTMLDivElement;

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.echartsInstance = echarts.init(dom);
    this.dom = dom;
    this.styleConfig = options.properties;
  }

  private render() {
    const config = this.renderConfig;
    const styleConfig = this.styleConfig;
    const options = {
      legend: {
        data: [config.legend]
      },
      xAxis: {
        data: config.xAxis
      },
      yAxis: {},
      series: [{
        name: config.legend,
        type: styleConfig.chartType,
        data: config.values,
      }],
      color: styleConfig.palette,
      textStyle: {
        ...styleConfig.textStyle,
        fontSize: parseInt(styleConfig.textStyle.fontSize),
      },
      animation: styleConfig.enableAnimation,
    };
    if (config.isMock) {
      this.dom.style.opacity = '0.3';
    } else {
      this.dom.style.opacity = '1';
    }

    this.echartsInstance.setOption(options);
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    console.log(options);
    this.styleConfig = options.properties;
    const plainDataView = options.dataViews[0] && options.dataViews[0].plain;
    if (plainDataView) {
      const valuesDisplay = plainDataView.profile.values.values[0].display;
      const legendDisplay = plainDataView.profile.legend.values[0].display;

      const values = [];
      const series = [];
      plainDataView.data.forEach((dataPoint) => {
        values.push(dataPoint[valuesDisplay]);
        series.push(dataPoint[legendDisplay]);
      });
      this.renderConfig = {
        legend: legendDisplay,
        xAxis: series,
        values,
        isMock: false,
      };
    } else {
      this.renderConfig = Visual.defaultConfig;
    }
    this.render();
  }

  public onDestroy() {
    this.echartsInstance.dispose();
  }

  public onResize() {
    this.echartsInstance.resize();
  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}