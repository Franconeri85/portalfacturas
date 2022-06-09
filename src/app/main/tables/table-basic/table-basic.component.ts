import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core'
import { TableHeaderItem, TableItem, TableModel } from 'carbon-components-angular'
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
  @ViewChild("proficiencyTemplate", {static: true}) proficiencyTemplate: TemplateRef<any>
  constructor(private service: AppComponentService) {
  }

  ngOnInit(): void {
   
    this.obtenerComprobantes();
  }

  obtenerComprobantes(){
    this.loading = true;
    this.service.obtenerComprobantes().subscribe(
      (res:any) =>{
        this.loading = false;
        let registros = [];

        res.registros.forEach(i => {
          let [tipoDoc, numeroDoc] = i[1].stringValue.split('#');
          registros.push({
            fecha: i[6].stringValue,
            cuit: numeroDoc,
            tipoFactura: 'Factura '+ i[18].stringValue,
            importe: i[12].stringValue,
            caeCai: i[17].stringValue
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
      let ptoVenta =  new TableItem({data: "-"});
      let factura =  new TableItem({data: e.factura});
      let nroComp = new TableItem({data: "-"});
      let tipoDoc = new TableItem({data: "-"});
      let nroDoc = new TableItem({data: "-"});
      let cliente = new TableItem({data: "0"});
      let importe = new TableItem({data: e.importe});
      let caeCai = new TableItem({data: e.caeCai});
      let enviado = new TableItem({data: '-'});

      model.data.push([reg, fecha, cuit, ptoVenta, factura, nroComp,tipoDoc, nroDoc, cliente, importe, caeCai, enviado]);
    });
   
    return model
  }
}
