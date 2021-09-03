import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';

@Component({
  templateUrl: './index.component.html',
})

export class IndexComponent implements OnInit {
  constructor(
    public app: AppService
  ) {
  }
  ngOnInit() {

  }
}
