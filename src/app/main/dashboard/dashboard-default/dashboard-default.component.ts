import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core'
import { NotificationService, TableHeaderItem, TableItem, TableModel } from 'carbon-components-angular';

import * as echarts from 'echarts'
import { AppComponentService } from 'src/app/app.component.service'
import {getDummyModel} from "../../../../@youpez/data/dummy"
import {EstadisticasModel} from '../../models/estadisticas.model';
import {FechaModel} from '../../models/fecha.model';
@Component({
  selector: 'app-dashboard-default',
  templateUrl: './dashboard-default.component.html',
  styleUrls: ['./dashboard-default.component.scss']
})
export class DashboardDefaultComponent implements OnInit {
  public diaSeleccionado:string;
  public mesSeleccionado:string;
  public loading: boolean;
  public loaded = false
  public chartOptions = {}
  public chartOptions2 = {}
  public chartOptions3 = {}
  public chartOptions4 = {}
  public chartOptionsStatics = {}
  public chartOptionsStatics2 = {}
  public punchCardOpts = {}
  public gaugeOpts = {}
  public gaugeOpts2 = {}
  public gaugeOpts3 = {}
  public themeRiverOpts = {}
  public realtimeOpts = {}
  public model = getDummyModel();
  public listaClientes: any;
  public fecha:any;
  public colas:any;
  public companyList = [
    {
      content: "South Trade Network",
      key: "30711727074"
    }
  ]
  public webServiceList = [
    {
      content: "wsfe",
      key: "wsfe",
    },
    {
      content: "wsfex",
      key: "wsfex",
      // selected: true
    },
    {
      content: "wstmxca",
      key: "wstmxca",
    }
  ]
  public entornoList = [
    {
      content: "produccion",
      key: "PROD"
    },
    {
      content: "desarrollo",
      key: "DEV"
    }
  ]
  public monthList = [
    {
      content: "Enero",
      key: "01",
    },
    {
      content: "Febrero",
      key: "02",
    },
    {
      content: "Marzo",
      key: "03",
    },
    {
      content: "Abril",
      key: "04",
    },
    {
      content: "Mayo",
      key: "05",
    },
    {
      content: "Junio",
      key: "06",
    },
    {
      content: "Julio",
      key: "07",

    },
    {
      content: "Agosto",
      key: "08",
    },
    {
      content: "Septiembre",
      key: "09",
    },
    {
      content: "Octubre",
      key: "10",
    },
    {
      content: "Noviembre",
      key: "11",
    },
    {
      content: "Diciembre",
      key: "12",
    },
  ]
  public yearList = [
    {
      content: "2022",
      key: "2022"
    },
    {
      content: "2021",
      key: "2021"
    },
    {
      content: "2020",
      key: "2020"
    },
    {
      content: "2019",
      key: "2019"
    },
  ]
  public subscriptions = [
    {
      month: 'january',
      count: '-111,333',
      up: false,
    },
    {
      month: 'february',
      count: '233,123',
      up: true,
    },
    {
      month: 'march',
      count: '543,854',
      up: true,
    },
    {
      month: 'april',
      count: '-99,112',
      up: false,
    },
    {
      month: 'may',
      count: '678,112',
      up: true,
    },
    {
      month: 'june',
      count: '891,451',
      up: true,
    }
  ]

  data:any;
  caeMes:EstadisticasModel = new EstadisticasModel();
  caeDia:EstadisticasModel = new EstadisticasModel();
  caeHora:EstadisticasModel = new EstadisticasModel();

  chartCantidadCAE = [];
  chartVelocidadCAE = [];
  chartCantidadPDF = [];
  chartVelocidadPDF = [];
  chartCantidadMAIL = [];
  chartVelocidadMAIL = [];
  chartCantidadOTRO = [];
  chartVelocidadOTRO = [];
  
  companySelected: string;
  webServiceSelected: string;
  entornoSelected: string;
  yearSelected: string;
  monthSelected: string;

  //Datos de la tabla
  tablaRegistros:TableModel = new TableModel();
  @ViewChild("proficiencyTemplate", {static: true}) proficiencyTemplate: TemplateRef<any>


  constructor(private service: AppComponentService, private notificationService: NotificationService) {

  }

  ngOnInit(): void {
    this.obtenerDiaActual();
   
    this.inicializar();
    this.obtenerClientes();
  }

  inicializar(){
    this.loading = true;
    this.service.obtenerTablero(this.entornoSelected, this.webServiceSelected, this.companySelected, this.yearSelected, this.monthSelected).subscribe((res:any) =>{
      this.loading = false;
      this.data = res;
      this.colas = res.tablero.COLAS;
      this.caeMes = this.obtenerEstadisticaMes();

      let caeDia = this.obtenerEstadisticaDia();
      if(caeDia){
        this.caeDia = caeDia.CAE;
        this.caeHora = this.obtenerEstadisticaHora(caeDia);
      }

      this.obtenerDiasDeArray();
      this.discrimineDataChartCantidad("mes");
      this.discrimineDataChartVelocidad("mes");
      // this.createChartStatics();
      this.tablaRegistros = this.cargarTabla();
    },
    (err: any) =>{
      this.loading = false;
      this.toast(err.error.detalleError, 5000);
    })
  }
  selectedCompany(event){
    console.log(event)
    if(event)
      this.companySelected = event.item.key
    else
      this.companySelected = "";

  }
  selectedWebService(event){
    console.log(event)
    if(event)
      this.webServiceSelected = event.item.key
    else
      this.webServiceSelected = "";
   
  }
  selectedEntorno(event){
    console.log(event)
    if(event)
      this.entornoSelected = event.item.key
    else
      this.entornoSelected = "";

    
  }
  selectedYear(event){
    console.log(event)
    if(event)
      this.yearSelected = event.item.key
    else
      this.yearSelected = "";
  }
  selectedMonth(event){
    console.log(event.item.key)
    if(event)
      this.monthSelected = event.item.key
    else
      this.monthSelected = ""
  }
  cargarTabla()  {
    const model = new TableModel()
    model.header = [
      new TableHeaderItem({
        data: "PUNTO VENTA",
        className: "items-center font-bold"
      }),
      new TableHeaderItem({
        data: "TIPO CBTE",
        className: "items-center"
      }),
      new TableHeaderItem({
        data: "",
        className: "items-center",
      })
    ]
    model.data = this.obtenerColas();
    //  [
    //   [new TableItem({data: "008"}), new TableItem({data: "1"}), new TableItem({template: this.proficiencyTemplate,data: 10})],
    //   [new TableItem({data: "009"}), new TableItem({data: "6"}), new TableItem({template: this.proficiencyTemplate,data: 11})],
    //   [new TableItem({data: "010"}), new TableItem({data: "1"}), new TableItem({template: this.proficiencyTemplate,data: 65})],
  
    // ]
    return model
  }

  obtenerClientes(){
    this.loading = true;
    this.service.obtenerClientes().subscribe(
      clientes =>{
        this.loading = false;
        this.listaClientes = [{
          clientes: [
            {
              "SK": "30711727074",
              "rs": "South Trade Network",
              "PK": "CLIENTE#"
            }
          ]
        }];
      }
    )

  }

  obtenerEstadisticaMes(){
    let key = Object.keys(this.data.tablero)[0];
    return this.data.tablero[key].CAE;
  }
 
  obtenerEstadisticaDia(){

    let key = Object.keys(this.data.tablero)[0];
    let result:any;
   
    let data = this.data.tablero[key].dias;
    //[i][fechaActual.dia];
    if(data){
      
      data = data.forEach((x:any) => {
        if(Object.keys(x)[0] == this.diaSeleccionado){
          result = x[this.diaSeleccionado];
        }
      });
    }
    

    return result;
  }
  obtenerEstadisticaHora(caeDia){
    let caeHora = caeDia.horas[0][this.diaSeleccionado];
    if(caeHora)
      return caeDia.horas[0][this.diaSeleccionado].CAE;
    else
      return {cantidad: 0, tiempoPromedio: 0}
  }
  obtenerDiasDeArray(){
    let key = Object.keys(this.data.tablero)[0];
    
    return;
  }
  obtenerDiaActual(diaSeteado?, generarChart?){
    if(!diaSeteado){
      const d = new Date();
      d.setHours(d.getHours() - 3);
      let dia = d.getUTCDate().toString();
      let mes:any = d.getMonth()+1;
      mes = mes.toString();
  
      let date = new FechaModel();
      if(dia.length == 1)
        date.dia = '0' + dia;
      else
        date.dia = dia;
  
      if(mes.length == 1)
        date.mes = '0' + mes;
      else
        date.mes = mes;

      this.diaSeleccionado = date.dia;
      this.mesSeleccionado = date.mes;
    }else{
      let fecha = new Date(diaSeteado)
      let mes:any = fecha.getMonth()+1;
      let dia = fecha.getUTCDate().toString();

      if(dia.length == 1)
        dia = '0' + dia.toString();
      
      if(mes.toString().length == 1)
        mes = '0' + mes.toString();
   
        
      if(mes != this.mesSeleccionado){

        this.toast('Error: El mes seleccionado no es valido.', 5000);
        return;
      }


      
      this.diaSeleccionado = dia;

      if(generarChart){
        this.discrimineDataChartVelocidad('dia');
        this.discrimineDataChartCantidad('dia');
      }
      // this.mesSeleccionado = diaSeteado;
    }
  }

  obtenerColas(){
    if(!this.colas)
      return;

    let colas = [];

    this.colas.forEach(x =>{
      let [puntoVenta, tipoComprobante] = x.cola.split("-");
      let d = [new TableItem({data: puntoVenta}), new TableItem({data: tipoComprobante}), new TableItem({data: x.cantidad})];
      colas.push(d)
    })

    return colas;
  }

  discrimineDataChartVelocidad(rango){
    let key = Object.keys(this.data.tablero)[0];
    let [entorno, ws, year, month] = key.split('-');
    let dataDias = this.data.tablero[key].dias;

    if(rango == 'dia'){
      
      let keys = this.data.tablero[key].dias;
      keys.forEach(i => {
        let data = i[this.diaSeleccionado]
        if(data){
          dataDias = i[this.diaSeleccionado].horas;
          return;
        }
      });
    }


    this.chartVelocidadCAE = [];
    this.chartVelocidadPDF = [];
    this.chartVelocidadMAIL = [];
    this.chartVelocidadOTRO = [];

    dataDias.forEach(dia => {
      let i = Object.keys(dia)[0];

      let fecha;
      if(rango == 'dia')
        fecha = `${i}:00`;
      else
        fecha = `${i}/${month}`;

      if(dia[i].CAE)
        this.chartVelocidadCAE.push({fecha: fecha, data: dia[i].CAE.cantidad})
      else
        this.chartVelocidadCAE.push({fecha: fecha, data: 0})
      
      if(dia[i].PDF)
        this.chartVelocidadPDF.push({fecha: fecha, data: dia[i].PDF.cantidad})
      else
        this.chartVelocidadPDF.push({fecha: fecha, data: 0})
      
      if(dia[i].MAIL)
        this.chartVelocidadMAIL.push({fecha: fecha, data: dia[i].MAIL.cantidad})
      else
        this.chartVelocidadMAIL.push({fecha: fecha, data: 0})
      
      Object.keys(dia[i]).forEach(e => {
        if(e != 'PDF' && e != 'CAE' && e != 'MAIL' && e != 'horas'){
          if(dia[i].e){
            this.chartVelocidadOTRO.push({fecha: fecha, data: dia[i].e.tiempoPromedio})
          }else{
            this.chartVelocidadOTRO.push({fecha: fecha, data: 0})
          }
        }
      });

    });
    this.createChartStaticsVelocidad();
  }

  discrimineDataChartCantidad(rango){
    let key = Object.keys(this.data.tablero)[0];
    let [entorno, ws, year, month] = key.split('-');
    let dataDias = this.data.tablero[key].dias;

    if(rango == 'dia'){
      
      let keys = this.data.tablero[key].dias;
      keys.forEach(i => {
        let data = i[this.diaSeleccionado]
        if(data){
          dataDias = i[this.diaSeleccionado].horas;
          return;
        }
      });
    }


    this.chartCantidadCAE = [];
    this.chartCantidadPDF = [];
    this.chartCantidadMAIL = [];
    this.chartCantidadOTRO = [];

    dataDias.forEach(dia => {
      let i = Object.keys(dia)[0];

      let fecha;
      if(rango == 'dia')
        fecha = `${i}:00`;
      else
        fecha = `${i}/${month}`;

      if(dia[i].CAE)
        this.chartCantidadCAE.push({fecha: fecha, data: dia[i].CAE.tiempoPromedio})
      else
        this.chartCantidadCAE.push({fecha: fecha, data: 0})

      if(dia[i].PDF)
        this.chartCantidadPDF.push({fecha: fecha, data: dia[i].PDF.tiempoPromedio})
      else
        this.chartCantidadPDF.push({fecha: fecha, data: 0})
      
      if(dia[i].MAIL)
        this.chartCantidadMAIL.push({fecha: fecha, data: dia[i].MAIL.tiempoPromedio})
      else
        this.chartCantidadMAIL.push({fecha: fecha, data: 0})
      
      Object.keys(dia[i]).forEach(e => {
        if(e != 'PDF' && e != 'CAE' && e != 'MAIL' && e != 'horas'){
          if(dia[i].e){
            this.chartCantidadOTRO.push({fecha: fecha, data: dia[i].e.cantidad})
          }else{
            this.chartCantidadOTRO.push({fecha: fecha, data: 0})
          }
        }
      });

    });
    this.createChartStaticsCantidad();
  }

  toast(detalle, duracion){
    this.notificationService.showToast({
      type: "error",
      title: "Algo salió mal",
      subtitle: detalle,
      caption: "",
      target: "#notificationHolder2",
      message: "message",
      duration: duracion,
    })
  }

  createChartStaticsVelocidad(){


    /** CAE */
    let velocidadCAEFecha = [];
    let velocidadCAEData = [];

    /** PDF */
    let velocidadPDFFecha = [];
    let velocidadPDFData = [];

    /** MAIL */
    let velocidadMAILFecha = [];
    let velocidadMAILData = [];

    /** OTROS */
    let velocidadOTROFecha = [];
    let velocidadOTROData = [];


    this.chartVelocidadCAE.forEach(x =>{
      velocidadCAEFecha.push(x.fecha);
      velocidadCAEData.push(x.data);
    });
    this.chartVelocidadPDF.forEach(x =>{
      velocidadPDFFecha.push(x.fecha);
      velocidadPDFData.push(x.data);
    });
    this.chartVelocidadMAIL.forEach(x =>{
      velocidadMAILFecha.push(x.fecha);
      velocidadMAILData.push(x.data);
    });
    this.chartVelocidadOTRO.forEach(x =>{
      velocidadOTROFecha.push(x.fecha);
      velocidadOTROData.push(x.data);
    });


    console.log(velocidadCAEFecha);
    this.chartOptionsStatics = {

      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: ['PDF', 'CAE', 'MAIL', 'OTROS']
      },

      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: velocidadCAEFecha

        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'PDF',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: velocidadPDFData
        },
        {
          name: 'CAE',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: velocidadCAEData
        },
        {
          name: 'MAIL',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: velocidadMAILData
        },
        {
          name: 'OTROS',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: velocidadOTROData
        }
      ]
    }
  }

  createChartStaticsCantidad(){


    /** CAE */
    let cantidadCAEFecha = [];
    let cantidadCAEData = [];
    /** PDF */
    let cantidadPDFFecha = [];
    let cantidadPDFData = [];
    /** MAIL */
    let cantidadMAILFecha = [];
    let cantidadMAILData = [];
    /** OTROS */
    let cantidadOTROFecha = [];
    let cantidadOTROData = [];


    this.chartCantidadCAE.forEach(x =>{
      cantidadCAEFecha.push(x.fecha);
      cantidadCAEData.push(x.data);
    });

    this.chartCantidadPDF.forEach(x =>{
      cantidadPDFFecha.push(x.fecha);
      cantidadPDFData.push(x.data);
    });

    this.chartCantidadMAIL.forEach(x =>{
      cantidadMAILFecha.push(x.fecha);
      cantidadMAILData.push(x.data);
    });

    this.chartCantidadOTRO.forEach(x =>{
      cantidadOTROFecha.push(x.fecha);
      cantidadOTROData.push(x.data);
    });


    this.chartOptionsStatics2 = {
 
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: ['PDF', 'CAE', 'MAIL', 'OTROS']
      },

      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: cantidadCAEFecha

        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'PDF',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: cantidadPDFData
        },
        {
          name: 'CAE',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: cantidadCAEData
        },
        {
          name: 'MAIL',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: cantidadMAILData
        },
        {
          name: 'OTROS',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: cantidadOTROData
        }
      ]
    } 
    
  }
}
