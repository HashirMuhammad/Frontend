import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { TableModule } from "primeng/table";
import { MultiSelectModule } from "primeng/multiselect";
import { StepsModule } from "primeng/steps";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { FileUploadModule } from "primeng/fileupload";
import { ChipsModule } from "primeng/chips";
import { PickListModule } from "primeng/picklist";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { DropdownModule } from "primeng/dropdown";
import { DialogModule } from "primeng/dialog";
import { CalendarModule } from "primeng/calendar";
import { PaginatorModule } from "primeng/paginator";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { SplitterModule } from 'primeng/splitter';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ChartModule } from 'primeng/chart';
import { QRCodeModule } from 'angularx-qrcode';
import { InputMaskModule } from 'primeng/inputmask';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    TableModule,
    MultiSelectModule,
    StepsModule,
    CKEditorModule,
    FileUploadModule,
    ChipsModule,
    PickListModule,
    OverlayPanelModule,
    DialogModule,
    DropdownModule,
    CalendarModule,
    PaginatorModule,
    ProgressSpinnerModule,
    DataViewModule,
    TagModule,
    SplitterModule,
    ToastModule,
    MessagesModule,
    InputTextareaModule,
    ChartModule,
    QRCodeModule,
    InputMaskModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    TableModule,
    MultiSelectModule,
    StepsModule,
    CKEditorModule,
    FileUploadModule,
    ChipsModule,
    PickListModule,
    OverlayPanelModule,
    DialogModule,
    DropdownModule,
    CalendarModule,
    PaginatorModule,
    ProgressSpinnerModule,
    DataViewModule,
    TagModule,
    SplitterModule,
    ToastModule,
    MessagesModule,
    InputTextareaModule,
    ChartModule,
    QRCodeModule,
    InputMaskModule
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
