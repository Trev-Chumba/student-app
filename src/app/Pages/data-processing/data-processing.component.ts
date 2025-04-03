import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import * as XLSX from 'xlsx';
import { FetchApiService } from '../../services/fetch-api.service';
import { API_ENDPOINTS } from '../../api.constants';

interface Student {
  firstName: string;
  lastName: string;
  DOB: number | Date; // or string if it's in a different format
  studentClass: string;
  score: number;
  status: string;
  photoPath: string;
}

@Component({
  selector: 'app-data-processing',
  imports: [MatButtonModule],
  templateUrl: './data-processing.component.html',
  styleUrl: './data-processing.component.css',
})
export class DataProcessingComponent {
  fileHere?: File | null;

  constructor(private api: FetchApiService) {}

  onChange(event: any) {
    const file = event.target.files[0];
    if (
      file &&
      file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      this.fileHere = file;
      console.log('valid Excel file');
    } else {
      console.error('Not a valid Excel file');
      this.fileHere = null;
    }
  }

  handleFileUpload() {
    if (!this.fileHere) {
      console.error('No file selected');
      return;
    }
    const file = this.fileHere;
    const reader = new FileReader();
    console.log('file here');

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Get first sheet
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert sheet to JSON

      const excelEpochStart = new Date(1900, 0, 1);

      const jsonData: Student[] = XLSX.utils.sheet_to_json(sheet);

      jsonData.forEach((student) => {
        // Check if DOB is a number (Excel serial date)
        if (typeof student.DOB === 'number') {
          // Convert Excel serial number to JavaScript Date
          let date = new Date(
            excelEpochStart.getTime() + student.DOB * 24 * 60 * 60 * 1000
          );
          student.DOB = date; // Update DOB with JavaScript Date object
        }
      });

      if (jsonData) {
        this.saveStudents(jsonData);
      }
      console.log(jsonData);
    };

    reader.readAsArrayBuffer(file);
  }

  saveStudents(requestBody: any) {
    this.api.post(API_ENDPOINTS.CREATE_STUDENT, requestBody).subscribe({
      next: (response: any) => {
        console.log('Raw response:', response);

        // Try to parse the response body if it exists
        try {
          const body = response.body ? JSON.parse(response.body) : {};
          console.log('Parsed response:', body);
          alert(
            'Success: ' + (body.message || 'Operation completed successfully')
          );
        } catch (e) {
          console.warn('Could not parse response as JSON:', e);
          alert('Operation completed, but response format was unexpected');
        }
      },
      error: (error) => {
        console.error('Error details:', error);

        // More detailed error information
        if (error.error instanceof Error) {
          // Client-side error
          console.error('Client error:', error.error.message);
          alert('Error: ' + error.error.message);
        } else {
          // Server-side error
          console.error(
            'Server responded with:',
            error.status,
            error.statusText
          );
          console.error('Response body:', error.error);
          alert('Error: ' + (error.message || 'Unknown server error'));
        }
      },
    });
  }
}
