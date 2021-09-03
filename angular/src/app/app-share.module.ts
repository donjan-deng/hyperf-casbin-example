import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
/** ng-zorro */
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
/** helper */
import { ArrayToStringPipe } from './helpers/pipes';
import { CanDirective } from './helpers/directive';
import { NgxWebstorageModule } from 'ngx-webstorage';

@NgModule({
    imports: [
        CommonModule,
        NgxWebstorageModule.forRoot()
    ],
    declarations: [
        ArrayToStringPipe,
        CanDirective
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ArrayToStringPipe,
        CanDirective,
        NzImageModule,
        NzButtonModule,
        NzIconModule,
        NzGridModule,
        NzLayoutModule,
        NzSpaceModule,
        NzDropDownModule,
        NzMenuModule,
        NzPaginationModule,
        NzCheckboxModule,
        NzDatePickerModule,
        NzFormModule,
        NzInputModule,
        NzInputNumberModule,
        NzSelectModule,
        NzTreeSelectModule,
        NzTableModule,
        NzTreeModule,
        NzAlertModule,
        NzMessageModule,
        NzModalModule,
        NzNotificationModule,
        NzRadioModule,
        NzCardModule,
        NzTabsModule,
        NzUploadModule,
        NzPopconfirmModule
    ]
})
export class SharedModule { }