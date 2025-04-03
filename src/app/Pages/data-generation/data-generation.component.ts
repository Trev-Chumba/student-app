import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ExcelService } from '../../services/excel-service.service';
import { FormsModule } from '@angular/forms';
import {
  MatFormFieldControl,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { FetchApiService } from '../../services/fetch-api.service';
import { API_ENDPOINTS, BASE_URL } from '../../api.constants';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { LoadingDialogComponent } from '../../General/loading-dialog/loading-dialog.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-data-generation',
  imports: [
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './data-generation.component.html',
  styleUrl: './data-generation.component.css',
})
export class DataGenerationComponent implements OnInit {
  progress: number = 0;

  userRequest: number = 0;
  fileName: string = '';
  files: string[] = [];
  progress$ = new BehaviorSubject<number>(0);
  constructor(
    private excelService: ExcelService,
    private api: FetchApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchFiles();
  }
  generateExcel() {
    this.openDialog();
    this.excelService.generateExcel(this.userRequest, this.fileName).subscribe({
      next: (data) => {
        if (data.startsWith('progress')) {
          this.progress = parseFloat(
            data.replace('Progress: ', '').replace('%', '')
          );
        }
      },
      complete: () => {
        console.log('Excel generation complete');
        this.fetchFiles();
      },
      error: (err) => console.error('Error:', err),
    });
  }

  fetchFiles(): void {
    this.api.get<string[]>(API_ENDPOINTS.GET_FILES).subscribe({
      next: (data) => {
        this.files = data;
      },
      error: (error) => console.error('Error fetching files:', error),
    });
  }

  downloadFile(fileName: string): void {
    const downloadUrl = `${BASE_URL + API_ENDPOINTS.DOWNLOAD_FILE}/${fileName}`;
    window.open(downloadUrl, '_blank');
  }

  openDialog() {
    const dialogRef = this.dialog.open(LoadingDialogComponent, {
      width: '400px',
      data: this.progress$, // Pass as Observable
    });

    this.startProgressTracking(); // Start listening for SSE events
  }

  startProgressTracking() {
    const url = `${BASE_URL + API_ENDPOINTS.GENERATE_STUDENTS}/${this.userRequest}/${this.fileName}`;
    const eventSource = new EventSource(url);

    eventSource.addEventListener('progress', (event: MessageEvent) => {
      const progress = parseFloat(event.data);
      console.log(`Progress: ${progress}%`);
      this.progress$.next(progress); // Update progress in real-time

      if (progress >= 100) {
        eventSource.close();
        this.progress$.complete();
      }
    });

    eventSource.onerror = () => {
      console.error('SSE Connection Error');
      eventSource.close();
    };
  }
}
