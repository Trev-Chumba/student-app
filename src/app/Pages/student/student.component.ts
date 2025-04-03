import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FetchApiService } from '../../services/fetch-api.service';
import { API_ENDPOINTS } from '../../api.constants';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';

export interface StudentData {
  dob: any;
  studentId: string;
  firstName: string;
  lastName: string;
  DOB: Date;
  studentClass: string;
  score: number;
  status: number;
  photoPath: string;
}

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-student',
  styleUrl: './student.component.css',
  templateUrl: './student.component.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIcon,
    MatButtonModule,
    MatTooltipModule,
  ],
})
export class StudentComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'studentId',
    'firstName',
    'lastName',
    'dob',
    'studentClass',
    'score',
    'status',
    // 'photoPath',
    'actions',
  ];

  headers: string[] = [
    'studentId',
    'firstName',
    'lastName',
    'dob',
    'studentClass',
    'score',
    'status',
    'photoPath',
    // 'actions',
  ];
  dataSource: MatTableDataSource<StudentData> =
    new MatTableDataSource<StudentData>([]);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    private api: FetchApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchStudents();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  fetchStudents() {
    this.api.get<StudentData[]>(API_ENDPOINTS.GET_ALL_STUDENTS).subscribe({
      next: (students) => {
        this.dataSource.data = students;
        // console.log(this.dataSource);
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
    });
  }

  viewStudent(row: StudentData) {
    this.router.navigate([`/student/${row.studentId}`]);
  }

  deleteRow(row: StudentData) {
    this.api.post<StudentData>(API_ENDPOINTS.DELETE_STUDENT, row).subscribe({
      next: () => {
        //console.log('User deleted successfully');
        alert(`user ${row.studentId} deleted`);
        this.fetchStudents();
      },
      error: (error) => {
        console.error('Error deleting user:', error);
      },
    });
  }

  exportToExcel(): void {
    // Extract headers from displayedColumns
    const headers = this.headers.map((col) => col.toUpperCase());

    const data = this.dataSource.data.map((row) =>
      this.displayedColumns.reduce((acc, key) => {
        acc[key] = (row as any)[key];
        // console.log('acc', acc);
        return acc;
      }, {} as any)
    );

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, {
      header: this.displayedColumns,
      skipHeader: false,
    });

    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: 'A1' });

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');

    const excelBuffer: any = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array',
    });
    const fileName = 'students.xlsx';
    const dataBlob: Blob = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    });

    saveAs(dataBlob, fileName);
  }
}
