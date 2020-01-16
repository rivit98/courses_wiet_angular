import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../courses.service';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../interfaces/course';
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';

@Component({
	selector: 'app-course-details',
	templateUrl: './course-details.component.html',
	styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit {

	course: Course;
	currentRating: number;
	ratedAlready: boolean;
	enrolledAlready: boolean;

	constructor(
		private coursesService: CoursesService,
		private route: ActivatedRoute,
		private router: Router,
		private toastrService: ToastrService,
		private authService: AuthService
	) { }

	ngOnInit() {
		let id = this.route.snapshot.paramMap.get('id');
		this.course = this.coursesService.getCourse(id);

		if (!this.course) {
			this.router.navigate(['/dashboard']);
		}
		this.calculateRating();
		this.ratedAlready = this.checkIfRated();
		this.enrolledAlready = this.checkEnrolled();
	}

	calculateRating(){
		this.currentRating = this.coursesService.getAvgRate(this.course);
	}

	checkIfRated(): boolean {
		return (this.course.ratings.map(e => e.userId).includes(this.authService.user.uid));
	}

	checkEnrolled(): boolean {
		return (this.course.enrolledUsers.includes(this.authService.user.uid));
	}

	onRate($event: { oldValue: number, newValue: number }) {
		// this.ratedAlready = this.checkIfRated()

		// if(this.ratedAlready){
		// 	this.toastrService.error("Oceniałeś już ten kurs!", "", {
		// 		positionClass: 'toast-bottom-right'
		// 	});
		// 	return;
		// }

		this.ratedAlready = true;

		let ent = {
			rate: $event.newValue,
			userId: this.authService.user.uid //tu bedzie chyba jakis userid
		};
		this.course.ratings.push(ent);
		this.toastrService.success("Zapisano ocene (" + ent.rate + ")", "", {
			positionClass: 'toast-bottom-right'
		});

		this.calculateRating();
	}

	onEnroll(){
		// if(this.enrolledAlready){
		// 	return;
		// }

		if(this.course.enrolledUsers.length >= this.course.studentsLimit){
			this.toastrService.error("Brak miejsc", "", {
				positionClass: 'toast-bottom-right'
			});
			return;
		}

		this.course.enrolledUsers.push(this.authService.user.uid);
		this.enrolledAlready = true;

		this.toastrService.success("Zapisano pomyślnie", "", {
			positionClass: 'toast-bottom-right'
		});
	}
}
