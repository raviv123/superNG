import { Component, Inject, Output, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { EventEmitter } from 'stream';
// import { MatTypographyModule } from '@angular/material/core';

@Component({
  selector: 's-dialog',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, MatFormFieldModule, FormsModule, MatInputModule],
  templateUrl: './s-dialog.component.html',
  styleUrl: './s-dialog.component.scss'
})
export class SuperDialogComponent {

  constructor( public dialogRef: MatDialogRef<SuperDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  closeDialog() {
    this.dialogRef.close({data: { title: 'Meeting', start: '2025-02-15T10:00:00' }});
  }

}
