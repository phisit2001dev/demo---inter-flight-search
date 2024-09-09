import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'riskStatusPipe',
  standalone: true,
})
export class RiskStatusPipe implements PipeTransform {
  
// ทำเรื่องการ set สีฝั่ง server ให้เรียบร้อยแล้ว return มา ตรวจสอบทีเดียวเลย 
//FIXED ต้องแก้ตัวแปร
  transform(value: boolean ): boolean {
    //  console.log(value)
    if(true === value){
      return true;
    }
    return false;
  }
}
