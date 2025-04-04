import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FetchApiService } from '../../services/fetch-api.service';
import { API_ENDPOINTS } from '../../api.constants';
import { StudentData } from '../student/student.component';

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  studentNumber: number = 0;
  activeStudents: number = 0;
  constructor(private api: FetchApiService) {}

  ngOnInit(): void {
    this.getStudents();
  }

  getStudents() {
    this.api.get(API_ENDPOINTS.GET_ALL_STUDENTS).subscribe({
      next: (response: any) => {
        console.log(response.length);
        this.studentNumber = response.length;

        const filteredData = response.filter((item: any) => item.status === 1);

        this.activeStudents = filteredData.length;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
