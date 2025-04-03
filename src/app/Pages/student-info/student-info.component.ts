import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import {
  MatFormFieldControl,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { FetchApiService } from '../../services/fetch-api.service';
import { API_ENDPOINTS } from '../../api.constants';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentData } from '../student/student.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import moment from 'moment';
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';

export const MY_DATE_FORMATS = {
  parse: { dateInput: 'YYYY-MM-DD' },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-student-info',
  imports: [
    MatDivider,
    MatGridListModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './student-info.component.html',
  styleUrl: './student-info.component.css',
})
export class StudentInfoComponent implements OnInit {
  studentInfo: StudentData | null = null;
  date = new FormControl();

  new: any;
  constructor(
    private api: FetchApiService,
    private route: ActivatedRoute,
    private navigate: Router
  ) {}

  ngOnInit() {
    const pathVar = this.route.snapshot.paramMap.get('studentId');
    console.log(pathVar);

    this.api
      .get<StudentData>(API_ENDPOINTS.GET_STUDENT + '/' + pathVar)
      .subscribe({
        next: (student) => {
          if (student != null) {
            // this.navigate.navigate(['/students']);
            // student.photoPath = 'https://avatar.iran.liara.run/public';

            if (student.dob != null) {
              student.dob = new Date(student.dob);
              student.dob = student.dob.toISOString().split('T')[0];
              // console.log(student.dob);
            }

            this.studentInfo = student;
            this.studentInfo.DOB = student.dob;
          } else {
            // this.navigate.navigate(['/students']);
            console.error('Error fetching student: No such Student');
          }
        },
        error: (error) => {
          console.error('Error fetching student:', error);
          //this.navigate.navigate(['/students']);
        },
      });
  }

  onDateSelected(newDate: any) {
    if (this.studentInfo?.DOB != null && this.studentInfo)
      this.studentInfo.DOB = newDate;
    console.log('Date selected:', newDate);
  }

  avatarUrl = 'https://avatar.iran.liara.run/public';

  handleError() {
    this.avatarUrl = '/default.png'; // Fallback image
  }

  onSubmit() {
    if (!this.studentInfo || !this.studentInfo.studentId) {
      console.error('Invalid student data');
      return;
    }

    // const updatedDOB = this.studentInfo.DOB;

    const requestBody = {
      studentId: this.studentInfo.studentId,
      firstName: this.studentInfo.firstName,
      lastName: this.studentInfo.lastName,
      studentClass: this.studentInfo.studentClass,
      score: this.studentInfo.score,
      status: this.studentInfo.status,
      photoPath: this.studentInfo.photoPath,
      DOB: this.studentInfo.DOB,
    };

    this.api.post<any>(API_ENDPOINTS.UPDATE_STUDENT, requestBody).subscribe({
      next: (response) => {
        alert('Student updated successfully!');
      },
      error: (error) => {
        alert('Failed to update student.');
        console.log('here is error : ', error);
      },
    });
  }

  formatDate(date: Date | null): string {
    if (date) {
      const localDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      );

      const year = localDate.getFullYear();
      const month = (localDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
      const day = localDate.getDate().toString().padStart(2, '0');

      return `${year}-${month}-${day}`;
    }
    return '';
  }
  onDatePickerClosed() {
    this.onDateSelected(this.studentInfo?.DOB);
  }
}
