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
import { MatSelectModule } from '@angular/material/select';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../General/confirmation-dialog/confirmation-dialog.component';

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
    MatSelectModule,
    FormsModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatNativeDateModule,
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

  originalData: StudentData[] = [];
  selectedClass: string = '';
  uniqueClasses: string[] = ['Class1', 'Class2', 'Class3', 'Class4', 'Class5'];

  dateRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  dataSource: MatTableDataSource<StudentData> =
    new MatTableDataSource<StudentData>([]);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    private api: FetchApiService,
    private router: Router,
    private dialog: MatDialog
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
        this.originalData = students;
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
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: row,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.fetchStudents();
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

  applyFilters() {
    let filteredData = [...this.originalData];

    // Apply class filter if selected
    if (this.selectedClass) {
      filteredData = filteredData.filter(
        (item) => item.studentClass === this.selectedClass
      );
    }

    // Apply date range filter if dates are selected
    const startDate = this.dateRange.get('start')?.value;
    const endDate = this.dateRange.get('end')?.value;

    if (startDate && endDate) {
      filteredData = filteredData.filter((item) => {
        const itemDate = new Date(item.dob);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    // Update the table data
    this.dataSource.data = filteredData;
  }

  resetFilters() {
    this.selectedClass = '';
    this.dateRange.reset();
    this.dataSource.data = this.originalData;
  }
}
