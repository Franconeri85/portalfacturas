import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core'
import { NotificationService, TableHeaderItem, TableItem, TableModel } from 'carbon-components-angular'
import { AppComponentService } from 'src/app/app.component.service'
import {getDummyModel} from "../../../../@youpez/data/dummy"

const getSizeFrom = (name) => {
  const trans = {
    "Small": 'sm',
    "Short": 'sh',
    "Normal": 'md',
    "Large": 'lg',
  }
  return trans[name]
}

@Component({
  selector: 'app-table-basic',
  templateUrl: './table-basic.component.html',
  styleUrls: ['./table-basic.component.css']
})
export class TableBasicComponent implements OnInit {
  public loading: boolean;

  public size = 'sh'
  public model = getDummyModel()


  public tiposComprobantes = [
    {
      content: "FACTURA A",
      key: "001"
    },
    {
      content: "NOTAS DE DEBITO A",
      key: "002"
    },
    {
      content: "NOTAS DE CREDITO A",
      key: "003"
    },
    {
      content: "RECIBOS A",
      key: "004"
    },
    {
      content: "NOTAS DE VENTA AL CONTADO A",
      key: "005"
    },
    {
      content: "FACTURAS B",
      key: "006"
    },
    {
      content: "NOTAS DE DEBITO B",
      key: "007"
    },
    {
      content: "NOTAS DE CREDITO B",
      key: "008"
    },
    {
      content: "RECIBOS B",
      key: "009"
    },
    {
      content: "NOTAS DE VENTA AL CONTADO B",
      key: "010"
    },
    {
      content: "FACTURAS C",
      key: "011"
    },
    {
      content: "NOTAS DE DEBITO C",
      key: "012"
    },
    {
      content: "NOTAS DE CREDITO C",
      key: "013"
    },
    {
      content: "RECIBOS C",
      key: "015"
    },
    {
      content: "NOTAS DE VENTA AL CONTADO C",
      key: "016"
    },
    {
      content: "FACTURAS DE EXPORTACION",
      key: "019"
    },
    {
      content: "NOTAS DE DEBITO POR OPERACIONES CON EL EXTERIOR",
      key: "020"
    },
    {
      content: "NOTAS DE CREDITO POR OPERACIONES CON EL EXTERIOR",
      key: "021"
    },
    {
      content: "FACTURAS - PERMISO EXPORTACION SIMPLIFICADO - DTO. 855/97",
      key: "022"
    },
    {
      content: "TIQUE FACTURA A",
      key: "081"
    },
    {
      content: "TIQUE FACTURA B",
      key: "082"
    },
    {
      content: "TIQUE",
      key: "083"
    },
  ]
  public tipoDocumentos = [
    {
      content: "CUIT",
      key: "80"
    },
    {
      content: "CUIL",
      key: "86"
    },
    {
      content: "CDI",
      key: "87"
    },
    {
      content: "LE",
      key: "89"
    },
    {
      content: "LC",
      key: "90"
    },
    {
      content: "CI extranjera",
      key: "91"
    },
    {
      content: "En trámite",
      key: "92"
    },
    {
      content: "Pasaporte",
      key: "94"
    },
    {
      content: "DNI",
      key: "96"
    },
    {
      content: "Sin identificar/venta global diaria",
      key: "99"
    },
  ]
  public cuitEmisor;
  public nroComprobante;
  public nroDocumento;
  public razonSocial;
  public puntoVenta;
  public tipoComprobante;

  tableSizes = [
    {num: "Small"},
    {num: "Short"},
    {num: "Normal", checked: true},
    {num: "Large"},
  ]
  
  public array = [
    {
      content: "Item"
    }
  ]
  //Datos de la tabla
  tablaRegistros:TableModel;
  @ViewChild("customTableItemTemplate", {static: true}) customTableItemTemplate: TemplateRef<any>
  @ViewChild("proficiencyTemplate", {static: true}) proficiencyTemplate: TemplateRef<any>
  constructor(private service: AppComponentService,
    private notificationService: NotificationService
    ) {
  }

  ngOnInit(): void {
   
  }

  limpiar(){
    this.cuitEmisor = "";
    this.nroComprobante = "";
    this.nroDocumento = "";
    this.razonSocial = "";
    this.puntoVenta = "";
  }

  exportar(){

  }

  obtenerComprobantes(){
    
    
    let cuit = this.cuitEmisor ? `&amp;cuitEmisor=${this.cuitEmisor}` : '';
    let ptoVenta = this.puntoVenta ? `&amp;ptoVta=${this.puntoVenta}` : '&amp;';
    if(cuit == ""){
      this.toast("error","Algo salió mal", "Debe ingresar CUIT.")
      return
    }
    
    // if(ptoVenta == ""){
    //   this.toast("error","Algo salió mal", "Debe ingresar Punto de venta.")
    //   return
    // }
    
    let body = `?entorno=DEV&amp;webservice=wsfe${cuit}${ptoVenta}&amp;fechaDesde=20220501`
    
    
    this.loading = true;
    this.service.obtenerComprobantes(body).subscribe(
      (res:any) =>{
        this.loading = false;
        let registros = [];

        res.registros.forEach(i => {
          var year = i[6].stringValue.substring(0, 4);
          var month = i[6].stringValue.substring(4, 6);
          var day = i[6].stringValue.substring(6, 8);
          registros.push({
            id: i[1].longValue,
            cuit: i[3].longValue,
            entorno:  i[4].stringValue,
            ws:  i[5].stringValue,
            fecha: `${day}/${month}/${year}`,
            nroComprobante: i[8].longValue,
            puntoVenta: i[9].longValue,
            importeNeto: i[10].stringValue,
            impuesto: i[11].stringValue,
            importeTotal: i[12].stringValue,
            tipoReceptor: i[13].longValue,
            documentoReceptor: i[14].longValue,
            razonSocial: i[15].stringValue,
            caeCai: i[16].stringValue,
            nroAutorizacion: i[17].stringValue,
            tipoFactura: 'Factura '+ i[18].stringValue,
            importe: i[12].stringValue,
            link: i[19].stringValue
          })
        });
        this.tablaRegistros = this.cargarTabla(registros);
      }
    )
  }
  onChange1(event) {
    const tmp = getSizeFrom(event.value)
    this.size = tmp
  }

  toast(type, title, subtitle){
    this.notificationService.showToast({
      type: type,
      title: title,
      subtitle: subtitle,
      target: "body",
      message: "message",
      duration: 5000,
    });
  }

  cargarTabla(registros)  {
    const model = new TableModel()
    model.header = [
      new TableHeaderItem({
        data: "",
        className: "items-center font-bold"
      }),
      new TableHeaderItem({
        data: "Fecha",
        className: "items-center"
      }),
      new TableHeaderItem({
        data: "Cuit emisor",
        className: "items-center",
      }),
      new TableHeaderItem({
        data: "Pto. Venta",
        className: "items-center"
      }),
      new TableHeaderItem({
        data: "Tipo Comp.",
        className: "items-center"
      }),
      new TableHeaderItem({
        data: "Nro. cOMP.",
        className: "items-center"
      }),
      new TableHeaderItem({
        data: "Tipo Doc.",
        className: "items-center"
      }),
      new TableHeaderItem({
        data: "Nro. Doc.",
        className: "items-center"
      }),
      new TableHeaderItem({
        data: "Cliente",
        className: "items-center"
      }),
      new TableHeaderItem({
        data: "Importe",
        className: "items-center"
      }),
      new TableHeaderItem({
        data: "CAE/CAI",
        className: "items-center"
      }),
      new TableHeaderItem({
        data: "Enviado a",
        className: "items-center"
      }),
      new TableHeaderItem({
        data: "#",
        className: "items-center"
      }),
    ]
    registros.forEach(e => {
      // model.data = [
      //   [new TableItem({data: ""}), new TableItem({data: "26/04/2022"}), new TableItem({data: "30659863789"}),new TableItem({data: "373"}),new TableItem({data: "FACTURA B"}),new TableItem({data: "138"}),new TableItem({data: "Sin identificar"}),new TableItem({data: "0"}),new TableItem({data: "CONSUMIDOR FINAL"}),new TableItem({data: "1.21"}),new TableItem({data: "72179997220128"}),new TableItem({data: ""})],
      //   [new TableItem({data: ""}), new TableItem({data: "26/04/2022"}), new TableItem({data: "30659863789"}),new TableItem({data: "373"}),new TableItem({data: "FACTURA B"}),new TableItem({data: "138"}),new TableItem({data: "Sin identificar"}),new TableItem({data: "0"}),new TableItem({data: "CONSUMIDOR FINAL"}),new TableItem({data: "1.21"}),new TableItem({data: "72179997220128"}),new TableItem({data: ""})],
      //   [new TableItem({data: ""}), new TableItem({data: "26/04/2022"}), new TableItem({data: "30659863789"}),new TableItem({data: "373"}),new TableItem({data: "FACTURA B"}),new TableItem({data: "138"}),new TableItem({data: "Sin identificar"}),new TableItem({data: "0"}),new TableItem({data: "CONSUMIDOR FINAL"}),new TableItem({data: "1.21"}),new TableItem({data: "72179997220128"}),new TableItem({data: ""})],
      //   [new TableItem({data: ""}), new TableItem({data: "26/04/2022"}), new TableItem({data: "30659863789"}),new TableItem({data: "373"}),new TableItem({data: "FACTURA B"}),new TableItem({data: "138"}),new TableItem({data: "Sin identificar"}),new TableItem({data: "0"}),new TableItem({data: "CONSUMIDOR FINAL"}),new TableItem({data: "1.21"}),new TableItem({data: "72179997220128"}),new TableItem({data: ""})],
      //   [new TableItem({data: ""}), new TableItem({data: "26/04/2022"}), new TableItem({data: "30659863789"}),new TableItem({data: "373"}),new TableItem({data: "FACTURA B"}),new TableItem({data: "138"}),new TableItem({data: "Sin identificar"}),new TableItem({data: "0"}),new TableItem({data: "CONSUMIDOR FINAL"}),new TableItem({data: "1.21"}),new TableItem({data: "72179997220128"}),new TableItem({data: ""})],
      //   [new TableItem({data: ""}), new TableItem({data: "26/04/2022"}), new TableItem({data: "30659863789"}),new TableItem({data: "373"}),new TableItem({data: "FACTURA B"}),new TableItem({data: "138"}),new TableItem({data: "Sin identificar"}),new TableItem({data: "0"}),new TableItem({data: "CONSUMIDOR FINAL"}),new TableItem({data: "1.21"}),new TableItem({data: "72179997220128"}),new TableItem({data: ""})],
      //   [new TableItem({data: ""}), new TableItem({data: "26/04/2022"}), new TableItem({data: "30659863789"}),new TableItem({data: "373"}),new TableItem({data: "FACTURA B"}),new TableItem({data: "138"}),new TableItem({data: "Sin identificar"}),new TableItem({data: "0"}),new TableItem({data: "CONSUMIDOR FINAL"}),new TableItem({data: "1.21"}),new TableItem({data: "72179997220128"}),new TableItem({data: ""})],
      // ]
      let reg = new TableItem({data: ""});
      let fecha =  new TableItem({data: e.fecha}); 
      let cuit =  new TableItem({data: e.cuit}); 
      let ptoVenta =  new TableItem({data: e.puntoVenta});
      let tipoFactura =  new TableItem({data: e.tipoFactura});
      let nroComp = new TableItem({data: e.nroComprobante});
      let tipoDoc = new TableItem({data: e.tipoReceptor});
      let nroDoc = new TableItem({data: e.documentoReceptor});
      let cliente = new TableItem({data: "0"});
      let importe = new TableItem({data: e.importe});
      let caeCai = new TableItem({data: e.caeCai});
      let enviado = new TableItem({data: '-'});
      let link = new TableItem({data: '<button>'+e.link+'</button>'});

      let link2 = new TableItem({
        data: {name: "Alice", surname: "Bob"},
        template: this.customTableItemTemplate
      })

      model.data.push([reg, fecha, cuit, ptoVenta, tipoFactura, nroComp,tipoDoc, nroDoc, cliente, importe, caeCai, enviado, link2]);
    });
   
    return model
  }
}
