<template>
  <q-page class="q-pa-xs">
    <q-card>
      <div class="text-h6 text-center bg-accent text-white">REGISTRO DE TRAMITES NUEVOS</div>
      <q-form @submit.prevent="consultar">
        <div class="row">
          <!--          <div class="col-6 q-pa-xs"><q-input outlined label="N° de tramite" v-model="ntramite" required disable/></div>-->
          <!--          <div class="col-6 q-pa-xs"><q-input outlined label="Fecha" v-model="fecha" required disable/></div>-->
          <!--          <div class="col-6 q-pa-xs"><q-select v-model="tipo" required outlined :options="[{id:1,label:'REGISTRO ACTIVIDAD ECONOMICA'},{id:2,label:'RENOVACION LICENCIA'}]"/></div>-->
          <!--          <div class="col-6 q-pa-xs"><q-input outlined label="TRAMITADOR" required v-model="tramitador"/></div>-->
          <!--          <div class="col-12 " >-->
          <!--            <q-btn label="Crear" class="full-width" type="submit" icon="send" color="primary"/>-->
          <!--          </div>-->
          <div class="col-8 q-pa-xs">
            <q-select
              filled
              v-model="model"
              use-input
              input-debounce="0"
              label="Contribuyente"
              :options="options"
              @filter="filterFn"
              behavior="menu"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-2 q-pa-xs">
            <!--            <div class="text-4"></div>-->
            <q-badge color="primary" :label="model.gestion"/>
            <br>
            <q-badge color="accent" :label="model.dir"/>
          </div>
          <div class="col-2 q-pa-xs">
            <q-badge color="secondary" :label="model.tipo"/>
            <br>
            <q-badge color="positive" :label="model.des"/>
          </div>
          <div class="col-12 q-pa-xs flex flex-center">
            <!--            <q-badge color="secondary" :label="model.tipo"/>-->
            <q-btn label="Consultar" icon="search" color="primary" type="submit"/>
          </div>
        </div>
      </q-form>

      <div>
        <q-input v-model="regvutrat" type="text" label="Vutrat" readonly />
      </div>
      <q-table
        title="Pagos"
        :columns="columns"
        :rows="pagos"
        row-key="padron"
      />
      <q-form
        @submit="crear"
        class="q-gutter-md"
      >
        <div class="row">

          <div class="col-6 q-pa-xs"><q-input outlined label="N° de tramite" v-model="ntramite" required disable/></div>
          <div class="col-6 q-pa-xs"><q-input outlined label="Fecha" v-model="fecha" required disable/></div>
          <div class="col-6 q-pa-xs"><q-select @update:model-value="cambio"  label="Selecionar Caso" v-model="caso" required outlined :options="actividad" /></div>
          <div class="col-6 q-pa-xs"><q-input outlined label="TRAMITADOR" required v-model="tramitador"/></div>
          <div class="col-12 q-pa-xs">
            <q-checkbox rigth-label v-model="r.estado" :label="r.nombre" v-for="(r,i) in requisitos" :key="i" class="full-width" />
          </div>
          <div class="col-12 " >
            <q-btn label="Crear" class="full-width" type="submit" icon="send" color="primary"/>
          </div>
        </div>
        <div>
        </div>
      </q-form>

    </q-card>
  </q-page>
</template>

<script>
import {date} from "quasar";
import { jsPDF } from "jspdf";
export default {
  // name: 'Local',
  data(){
    return{
      fecha:'',
      req:[],
      ntramite:'',
      tipo:'',
      tramitador:'',
      validar:'',
      actividad:[],
      caso:'',
      filer:'',
      re:{},
      cumple:true,
      requisitos:[],
      model:{id:0,label:'',gestion:0,tipo:'n'},
      options:[
        {id:0,label:'',gestion:0,tipo:'n'}
      ],
      options2:[
        {id:0,label:'',gestion:0,tipo:'n'}
      ],
      regvutrat:'',
      columns:[
        { name: 'padron', label: 'padron', field: 'padron', required: true,},
        { name: 'gestion', label: 'gestion', field: 'gestion'},
        { name: 'fech_pago', label: 'fecha pago', field: 'fech_pago'},
        { name: 'importe', label: 'Importe', field: 'imp_pagar'},
        //   { name: 'action', label: 'action', field: 'action'},
      ],
      pagos:[],
    }
  },
  created(){
    this.$q.loading.show()
    this.$axios.get(process.env.API+'/contribuyente').then(res=> {
      console.log(res.data)
      this.$q.loading.hide()
      // this.options=res.data
      this.options = [{id: 0, label: '', gestion: 0, tipo: 'n'}]
      this.options2 = [{id: 0, label: '', gestion: 0, tipo: 'n'}]
      if (res.data.length > 0) {
        res.data.forEach(r => {
          let dat={
            id: r.padron,
            label: r.padron + '' + r.nombre + ' TIPO:' + r.tipo,
            gestion: r.gestion,
            tipo: r.tipo,
            dir: r.dir,
            des: r.des,
            ci: r.ci,
          }
          this.options.push(dat)
          this.options2.push(dat)
        })
      }
    })
    this.mifecha()
    this.minum()
    this.miscasos()
    // this.actualizar();
    //   setInterval(this.actualizar, 1000);
    // console.log('aa')
    // setTimeout(() => {
    //   console.log("Refresh")
    // }, 1000)
    // console.log('ias')
    // window.location.reload(true)
    // this.$q.loading.show()
    // this.$axios.get(process.env.API+'/contribuyente').then(res=>{
    //   console.log(res.data)
    //   // this.contribuyentes=res.data
    //   this.$q.loading.hide()
    // })
  },
  methods:{
    requisito(){
      console.log(this.caso);
    },
    miscasos(){
      this.actividad=[];
      this.$axios.get(process.env.API+'/caso').then(res=>{
        res.data.forEach(element => {
          this.actividad.push({label:element.clasificacion + ' ' + element.caso+' '+ element.inicio+'-'+element.fin+' tipo:'+element.tipo
            ,value:{id:element.id,tipo:element.tipo}});
        });
        console.log(this.actividad);
      })
    },
    consultar(){
      this.$q.loading.show()
      // console.log(this.model);
      this.$axios.post(process.env.API+'/conregistro',{padron:this.model.id,tipo:this.model.tipo,ci:this.model.ci}).then(res=>{
        console.log(res.data);
        if(res.data.length>=1)
        {
          this.validar=res.data[0].estado;
        }
        else this.validar='F';
        if(this.validar=='T') this.regvutrat='Se encuentra Registrado en Vutrat';
        else this.regvutrat='No esta Registrado o Incompleto en Vutrat';
      })
      this.pagos=[];
      this.$axios.post(process.env.API+'/conpagos',{padron:this.model.id}).then(res=>{
        console.log(res.data);
        // res.data.forEach(element => {
        //.log(element[0].padron);
        //  this.pagos.push({padron:element[0].padron,gestion:element[0].gestion,fech_pago:element[0].fech_pago,importe:element[0].imp_pagar});
        // });
        this.pagos=res.data;
        console.log(this.pagos);
        this.$q.loading.hide()
      })
    },
    cambio(caso){
      // console.log(caso)
      this.requisitos=[]
      this.$q.loading.show()
      this.$axios.post(process.env.API+'/listrequisito',caso).then(res=>{
        // console.log(res.data)
        this.$q.loading.hide()
        res.data.forEach(element => {
          this.requisitos.push({id:element.id,nombre:element.nombre,estado:false});
          this.cumple=true;
        });
      })
    },
    // filterFn(val, update){
    //   if (val === '') {
    //     update(() => {
    //       this.options = [{id:0,label:'',gestion:0,tipo:'n'}],
    //         this.model={id:0,label:'',gestion:0,tipo:'n'}
    //         this.validar=''; this.regvutrat=''; this.pagos=[]
    //     })
    //     return
    //   }
    //
    //   update(() => {
    //     // const needle = val.toLowerCase()
    //     this.$axios.get(process.env.API+'/buscarcon/'+val.toLowerCase()).then(res=>{
    //       // console.log(res.data)
    //       // this.options=res.data
    //       this.options=[{id:0,label:'',gestion:0,tipo:'n'}]
    //       if (res.data.length>0){
    //         res.data.forEach(r=>{
    //           this.options.push({
    //             id:r.padron,
    //             label:r.padron+''+r.nombre + ' TIPO:'+r.tipo,
    //             gestion:r.gestion,
    //             tipo:r.tipo,
    //             dir:r.dir,
    //             des:r.des,
    //             ci:r.ci,
    //           })
    //         })
    //       }
    //
    //     })
    //     // this.options.value = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
    //   })
    // },
    filterFn (val, update) {
      if (val === '') {
        this.model={id:0,label:'',gestion:0,tipo:'n'};
        update(() => {
          this.options = this.options2;
          // here you have access to "ref" which
          // is the Vue reference of the QSelect
        })
        return
      }
      update(() => {
        this.model={id:0,label:'',gestion:0,tipo:'n'};
        const needle = val.toLowerCase()
        this.options = this.options2.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
    mifecha(){
      this.fecha=date.formatDate(new Date(),'YYYY-MM-DD HH:mm:ss' )
    },
    minum(){
      this.$axios.get(process.env.API+'/tramite/create').then(res=>{
        let num=parseInt( res.data.nrotramite.substring(0,5)) +1
        this.ntramite=this.zfill(num,5)+'/'+date.formatDate(new Date(),'YY' )
      })
    },
    crear(){
      // console.log('a')
      this.cumple=true;
      if(this.model=='')
      {
        this.$q.notify({
          color:'red',
          icon:'info',
          message:'Seleccionar un contribuyente'
        });
        return false;
      }
      this.requisitos.forEach(element => {
        if(element.estado==false)
          this.cumple=false;
      });
      if(!this.cumple){
        this.$q.notify({
          color:'red',
          icon:'info',
          message:'Debe cumplir con los requisitos'
        });
        return false;
      }
      this.$q.loading.show()
      this.$axios.post(process.env.API+'/tramite',{
        nrotramite:this.ntramite,
        caso:this.caso.value,
        tramitador:this.tramitador,
        ci:this.model.ci,
        tipo:this.model.tipo,
        padron:this.model.id,
        requisitos:this.requisitos
      }).then(res=>{
        // console.log(res.data)
        this.$q.loading.hide()
        // return false
        this.imprimir();
        this.minum()
        this.mifecha()
        this.tramitador=''
        this.$q.notify({
          color:'positive',
          icon:'send',
          message:'Guardado correctamente'
        })
        this.caso='';
        this.model='';
        this.requisitos=[];
      }).catch(err=>{
        this.$q.loading.hide()
        this.$q.notify({
          message:err.response.data.message,
          color:'red',
          icon:'error'
        })
      })
    },
    imprimir(i){
      // console.log(i)
      var doc = new jsPDF('p','cm','letter')
      // console.log(dat);
      doc.setFont("courier");
      doc.setFontSize(10);
      var x=0,y=0;
      doc.text(x+1, y+1, 'Nro Tramite: '+this.ntramite);
      doc.text(x+1, y+1.5, 'Tramitador: '+this.tramitador);
      doc.text(x+1, y+2, 'Categoria: '+ this.caso.label);
      doc.text(x+1, y+2.5, 'Tipo: '+ this.model.tipo);
      doc.text(x+1, y+3, 'Fecha:' +this.fecha);
      window.open(doc.output('bloburl'), '_blank');
    },
    zfill(number, width) {
      var numberOutput = Math.abs(number); /* Valor absoluto del número */
      var length = number.toString().length; /* Largo del número */
      var zero = "0"; /* String de cero */
      if (width <= length) {
        if (number < 0) {
          return ("-" + numberOutput.toString());
        } else {
          return numberOutput.toString();
        }
      } else {
        if (number < 0) {
          return ("-" + (zero.repeat(width - length)) + numberOutput.toString());
        } else {
          return ((zero.repeat(width - length)) + numberOutput.toString());
        }
      }
    }
  }
}
</script>
