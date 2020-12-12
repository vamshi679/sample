import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(std:object[],searchterm:string): any {
    if(searchterm==undefined)
    {
      return std;
    }  
      return  std.filter(x=>x['firstname'].toLowerCase().indexOf(searchterm.toLowerCase()) !==-1);
  }

}
