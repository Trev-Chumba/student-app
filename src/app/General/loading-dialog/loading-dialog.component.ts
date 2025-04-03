import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-loading-dialog',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatProgressBarModule,
    MatButtonModule,
  ],
  templateUrl: './loading-dialog.component.html',
  styleUrl: './loading-dialog.component.css',
})
export class LoadingDialogComponent {
  progress: number = 0;
  constructor(
    public diagRef: MatDialogRef<LoadingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BehaviorSubject<number>
  ) {
    this.data.subscribe((value) => {
      this.progress = value;
    });
  }

  closeDialog() {
    this.diagRef.close();
  }
}
