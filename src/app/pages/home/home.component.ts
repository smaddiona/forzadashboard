import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { webSocket } from 'rxjs/webSocket';
import { NgxGaugeModule } from 'ngx-gauge';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  subject = webSocket('ws://localhost:1880/forza/connect');
  subject2 = webSocket('ws://localhost:1880/forza/ping');


  constructor(private router:Router, private http:HttpClient) { 
  }

  isConnecting: boolean = true;
  ping: any;
  dataSize: number = 0;

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

  steer: number = 0;
  TireTempFrontLeft: number = 0;
  TireTempFrontRight: number = 0;
  TireTempRearLeft: number = 0;
  TireTempRearRight: number = 0;

  ttfl: string = ''
  ttfr: string = ''
  ttrl: string = ''
  ttrr: string = ''

  speedVal: boolean = false;
  telemetry: Array<any> = [];

  ngOnInit(): void {
    setInterval(()=>{
      this.subject.subscribe(
        msg => this.assign(msg),
      );
    },5000)

    setInterval(()=>{
      this.subject2.subscribe(
        msg => this.ping = msg,
      );
    },5000)
    
  }

  sendToServer(){
    //this.subject.complete();
  }

  changeSpeedVal(){
    this.speedVal = !this.speedVal;
  }

  assign(msg:any){
    this.isConnecting = false;

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

    this.clutch = msg.Clutch;

    this.cylinders = msg.NumCylinders;
    this.carordinal = msg.CarOrdinal;
    this.carclass = msg.CarClass 
    this.carindex = msg.CarPerformanceIndex;
    this.handbrake = Math.round((msg.HandBrake/255)*100);
    this.power = Math.round(msg.Power);

    this.steer = msg.Steer;

    this.TireTempFrontLeft = Math.round((msg.TireTempFrontLeft-32)*5/9);
    this.TireTempFrontRight =Math.round((msg.TireTempFrontRight-32)*5/9);
    this.TireTempRearLeft = Math.round((msg.TireTempRearLeft-32)*5/9);
    this.TireTempRearRight = Math.round((msg.TireTempRearRight-32)*5/9);



    
   /* this.telemetry.push(
      {
        carstats: {
          rpm: this.idlerpm,
          idlerpm: this.idlerpm,
          maxrpm: this.maxrpm,
          boost: this.boost,
          torque: this.torque,
          clutch: this.clutch,
          handbrake: this.handbrake,
          brake: this.brake,
          throttle: this.throttle,
          speedkmh: this.speedkmh,
          speedmph: this.speedmph,
          power: this.power,
          steer: this.steer,
          ttfl: this.TireTempFrontLeft,
          ttfr: this.TireTempFrontRight,
          ttrl: this.TireTempRearLeft,
          ttrr: this.TireTempRearRight,
        },
        carspecs: {
          cylinders: this.cylinders,
          carindex: this.carindex,
          carordinal: this.carordinal,
          carclass: this.carclass,

        },
        game: {
          raceOn: this.raceOn,
          bestlap: this.bestlap,
          currentlap: this.currentlap,
          currentracetime: this.currentracetime,
          distancetraveled: this.distancetraveled,
          lapnumber: this.lapnumber,
          lastlap: this.lastlap,
          raceposition: this.raceposition,
        }
      }
    )

    this.dataSize = JSON.stringify(this.telemetry).length / 1000 / 1000; */
  }

  getSteer(){
    let x = 'rotate('+this.steer/5.08+'deg)';
    return x
  }

  getFRT(){
    let x = ''
    if (this.TireTempFrontRight*1.4 > 240){
      x = 'rgb('+this.TireTempFrontRight*1.4+', '+this.TireTempFrontRight*0.8+', 0)';

    } else {
      x = 'rgb('+this.TireTempFrontRight*1.4+', 255, 0)';
    }
    this.ttfr = x
    return x
  }

  getFLT(){
    let x = ''
    if (this.TireTempFrontLeft*1.4 > 240){
      x = 'rgb('+this.TireTempFrontLeft*1.4+', '+this.TireTempFrontLeft*0.8+', 0)';

    } else {
      x = 'rgb('+this.TireTempFrontLeft*1.4+', 255, 0)';
    }
    this.ttfl = x
    return x
  }

  getRRT(){
    let x = ''
    if (this.TireTempRearRight*1.4 > 240){
      x = 'rgb('+this.TireTempRearRight*1.4+', '+this.TireTempRearRight*0.8+', 0)';

    } else {
      x = 'rgb('+this.TireTempRearRight*1.4+', 255, 0)';
    }
    this.ttrr = x
    return x
  }

  getRLT(){
    let x = ''
    if (this.TireTempRearLeft*1.4 > 240){
      x = 'rgb('+this.TireTempRearLeft*1.4+', '+this.TireTempRearLeft*0.8 +', 0)';

    } else {
      x = 'rgb('+this.TireTempRearLeft*1.4+', 255, 0)';
    }
    this.ttrl = x
    return x
  }

}
