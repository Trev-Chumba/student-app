import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FetchApiService } from '../../services/fetch-api.service';
import { API_ENDPOINTS } from '../../api.constants';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [MatDialogActions, MatDialogContent, MatButtonModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css',
})
export class ConfirmationDialogComponent {
  constructor(
    private api: FetchApiService,
    public confirm: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog() {
    this.confirm.close();
  }

  deleteRow() {
    this.api.post<any>(API_ENDPOINTS.DELETE_STUDENT, this.data).subscribe({
      next: () => {
        alert(`user ${this.data.studentId} deleted`);
        this.closeDialog();
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        this.closeDialog();
      },
    });
  }

  softDelete() {
    this.data.status = 0;
    this.api.post(API_ENDPOINTS.UPDATE_STUDENT, this.data).subscribe({
      next: () => {
        alert(`user ${this.data.studentId} deactivated`);
        this.closeDialog();
      },
      error: (error) => {
        console.error('Error deactivating user:', error);
        this.closeDialog();
      },
    });
  }
}
