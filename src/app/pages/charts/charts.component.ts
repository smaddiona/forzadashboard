import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { webSocket } from 'rxjs/webSocket';
import { NgxGaugeModule } from 'ngx-gauge';
import { Chart, registerables} from 'chart.js';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  chart: any = [];
  chart2: any = [];
  chart3: any = [];
  chart4: any = [];

  dataReload: boolean = true;
  interval: any = null;


  subject = webSocket('ws://localhost:1880/forza/connect');

  constructor(private router:Router, private http:HttpClient){ 
    Chart.register(...registerables);
  }


  //game values
  raceOn: boolean = false;  
  bestlap: any = 0;
  currentlap: any = 0;
  currentracetime: any = 0;
  distancetraveled: any = 0;
  lapnumber: any = 0;
  lastlap: any = 0;
  raceposition: any = 0;


  //car values
  rpm: number = 0;
  rpmpercentage: number = 0;
  rpmtype: string = 'success';
  idlerpm: number = 0;
  maxrpm: number = 0;
  gear:any = '0';
  throttle: any = 0;
  brake: any = 0;
  boost: any = 0;
  torque: any = 0;
  clutch: any = 0;
  handbrake: any = 0;
  speedkmh: number = 0;
  speedmph: number = 0;
  cylinders: any = 0;
  carindex: any = 0;
  carordinal: any = 0;
  carclass: any = 'wait';
  power: any = 0;

  telemetry: Array<any> = [];
  rpmArr: Array<any> = [];
  speedArr: Array<any> = [];
  boostArr: Array<any> = [];
  gearArr: Array<any> = [];
  throttleArr: Array<any> = [];
  brakeArr: Array<any> = [];
  torqueArr: Array<any> = [];
  rpmLabels: Array<any> = [];

  steer: number = 0;
  TireTempFrontLeft: number = 0;
  TireTempFrontRight: number = 0;
  TireTempRearLeft: number = 0;
  TireTempRearRight: number = 0;
  
  refreshrate: number = 100;
  rotationhandle: any = {'transform': 'rotate('+this.steer+'deg)'};

  ngOnInit(): void {
    setInterval(()=>{
      this.subject.subscribe(
        msg => this.assign(msg),
      );
    },5000)

    
      this.chart = new Chart('canvas', {
        type: 'line',
        data: {
          labels: this.rpmLabels,
          datasets: [
            {
              label: 'RPM',
              data: this.rpmArr,
              backgroundColor: '#c2aff0',
              borderColor: '#c2aff0',
              pointStyle: 'circle',
              pointRadius: 0.1,
              fill: false
            }
          ],
        },
        options: {
          animation: false,
          plugins: {
              legend: {
                  display: true,
                  labels: {
                      color: 'rgb(255, 99, 132)'
                  }
              }
          },
        }
      });

      this.chart2 = new Chart('canvas2', {
        type: 'line',
        data: {
          labels: this.rpmLabels,
          datasets: [
            {
              label: 'BOOST',
              data: this.boostArr,
              backgroundColor: '#686868',
              borderColor: '#686868',
              pointStyle: 'circle',
              pointRadius: 0.1,
              fill: false
            },
            {
              label: 'SPEED KMH',
              data: this.speedArr,
              backgroundColor: '#9191e9',
              borderColor: '#9191e9',
              pointStyle: 'circle',
              pointRadius: 0.1,
              tension: 0.5,
              fill: false
            },
            {
              label: 'THROTTLE',
              data: this.throttleArr,
              backgroundColor: '#2d5d7b',
              borderColor: '#2d5d7b',
              pointStyle: 'circle',
              pointRadius: 0.1,
              fill: false
            },
            {
              label: 'BRAKE',
              data: this.brakeArr,
              backgroundColor: '#edb183',
              borderColor: '#edb183',
              pointStyle: 'circle',
              pointRadius: 0.1,
              fill: false
            }
          ],
        },
        options: {
          animation: false,
          plugins: {
              legend: {
                  display: true,
                  labels: {
                      color: 'rgb(255, 99, 132)'
                  }
              }
          },
        }
      });

      this.chart3 = new Chart('canvas3', {
        type: 'line',
        data: {
          labels: this.rpmLabels,
          datasets: [
            {
              label: 'TORQUE',
              data: this.torqueArr,
              backgroundColor: '#f15152',
              borderColor: '#f15152',
              pointStyle: 'circle',
              pointRadius: 0.1,
              fill: false
            },
            {
              label: 'GEAR',
              data: this.gearArr,
              backgroundColor: '#457eac',
              borderColor: '#457eac',
              pointStyle: 'circle',
              pointRadius: 0.1,
              fill: false
            },
          ],
        },
        options: {
          animation: false,
          plugins: {
              legend: {
                  display: true,
                  labels: {
                      color: 'rgb(255, 99, 132)'
                  }
              }
          },
        }
      });

      /*this.chart4 = new Chart('canvas4', {
        type: 'polarArea',
        data: {
          labels: this.rpmLabels,
          datasets: [
            {
              label: 'Accelleration',
              data: this.accArr,
              backgroundColor: '#f15152',
              borderColor: '#f15152',
            }
          ],
        },
        options: {
          plugins: {
              legend: {
                  display: true,
                  labels: {
                      color: 'rgb(255, 99, 132)'
                  }
              }
          },
        }
      });*/

      //standard car values

      setInterval(()=>{
        if(this.dataReload){
        this.rpmArr.push(this.rpm);
        this.boostArr.push(this.boost);
        this.speedArr.push(this.speedkmh);
        this.gearArr.push(this.gear*200);
        this.throttleArr.push(this.throttle);
        this.brakeArr.push(this.brake);
        this.torqueArr.push(this.torque);
        this.rpmLabels.push('');
          this.chart.update();
          this.chart2.update();
          this.chart3.update();
        }
      },200);


  }


  getSteer(){
    let x = 'rotate('+this.steer/5.08+'deg)';
    return x
  }

  getFRT(){
    let x = 'rgb('+this.TireTempFrontRight*1.4+', 232, 14)';
    return x
  }

  getFLT(){
    let x = 'rgb('+this.TireTempFrontLeft*1.4+', 232, 14)';
    return x
  }

  getRRT(){
    let x = 'rgb('+this.TireTempRearRight*1.4+', 232, 14)';
    return x
  }

  getRLT(){
    let x = 'rgb('+this.TireTempRearLeft*1.4+', 232, 14)';
    return x
  }
  
  
  
  
  assign(msg:any){
    //rpm section
    this.idlerpm = Math.round(msg.EngineIdleRpm);
    this.maxrpm = Math.round(msg.EngineMaxRpm);
    this.rpm = Math.round(msg.CurrentEngineRpm);
    if(this.rpm > this.maxrpm/2){
      this.rpmtype = 'warning';
    } else if (this.rpm > this.maxrpm/2+this.maxrpm/4){
      this.rpmtype = 'danger'; 
    } else {
      this.rpmtype = 'success';
    }

    //gears
    this.gear = msg.Gear;
    this.throttle = Math.round((msg.Accel/255)*100);
    if(msg.IsRaceOn == 0){
      this.raceOn = false;
    } else {
      this.raceOn = true;
    }

    this.speedkmh = Math.round(msg.Speedkmt);
    this.speedmph = Math.round(msg.Speedkmt/1.6);

    this.torque = Math.round(msg.Torque);
    this.brake = Math.round((msg.Brake/255)*100);
    if(msg.Boost < 0){
      this.boost = 0;
    } else {
      this.boost = Math.round(msg.Boost);
    }

    
    this.handbrake = Math.round((msg.HandBrake/255)*100);
    this.power = Math.round(msg.Power);

    this.steer = msg.Steer;

    this.TireTempFrontLeft = Math.round((msg.TireTempFrontLeft-32)*5/9);
    this.TireTempFrontRight =Math.round((msg.TireTempFrontRight-32)*5/9);
    this.TireTempRearLeft = Math.round((msg.TireTempRearLeft-32)*5/9);
    this.TireTempRearRight = Math.round((msg.TireTempRearRight-32)*5/9);
  }


  reloadValues(){
    this.rpmArr.push(this.rpm);
    this.boostArr.push(this.boost);
    this.speedArr.push(this.speedkmh);
    this.gearArr.push(this.gear*200);
    this.throttleArr.push(this.throttle);
    this.brakeArr.push(this.brake);
    this.torqueArr.push(this.torque);
    this.rpmLabels.push('');
    if(this.dataReload){
      this.chart.update();
      this.chart2.update();
      this.chart3.update();
    }
  }

  changeRefresh(){
    clearInterval(this.interval);
  }
  
  handleReload(){
    this.dataReload = !this.dataReload;
  }

  clearData(){
    this.dataReload = false;
    this.rpmArr.splice(0,this.rpmArr.length);
    this.boostArr.splice(0,this.boostArr.length);
    this.speedArr.splice(0,this.speedArr.length);
    this.gearArr.splice(0,this.gearArr.length);
    this.throttleArr.splice(0,this.throttleArr.length);
    this.brakeArr.splice(0,this.brakeArr.length);
    this.torqueArr.splice(0,this.torqueArr.length);
    this.rpmLabels.splice(0,this.rpmLabels.length);
    this.dataReload = true;
  }

}
