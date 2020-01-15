import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoursesService } from '../courses.service';
import { CourseType, Course } from '../interfaces/course'

@Component({
	selector: 'app-course-add-form',
	templateUrl: './course-add-form.component.html',
	styleUrls: ['./course-add-form.component.css']
})
export class CourseAddFormComponent implements OnInit {

	public CourseType = CourseType;
	addForm: FormGroup;
	submitted = false;

	validationErrorsMsg = {
		name: {
			required: "To pole jest wymagane",
		},
		desc: {
			required: "To pole jest wymagane"
		},
		ects: {
			required: "To pole jest wymagane",
			max: "Dozwolone wartosci [0;10]",
			min: "Dozwolone wartosci [0;10]"
		},
		semester: {
			required: "To pole jest wymagane",
			max: "Dozwolone wartosci [0;7]",
			min: "Dozwolone wartosci [0;7]"
		},
		type: {
			required: "To pole jest wymagane"
		},
		studentsLimit: {
			required: "To pole jest wymagane",
			max: "Musi być mniejsze od 1000",
			min: "Musi być większe od 0"
		},
		image: {

		}
	}

	constructor(private formBuilder: FormBuilder, private coursesService: CoursesService) { }

	ngOnInit() {
		this.addForm = this.formBuilder.group({
			name: ['', Validators.required],
			desc: ['', Validators.required],
			ects: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
			semester: ['', [Validators.required, Validators.min(1), Validators.max(7)]],
			type: ['', Validators.required],
			studentsLimit: ['', [Validators.required, Validators.min(0), Validators.max(1000)]],
			image: ['']
		});

	}

	get f() { return this.addForm.controls; }

	objectKeys(obj) {
		return Object.keys(obj);
	}

	onSubmit(): void {
		this.submitted = true;

		if (this.addForm.invalid) {
			return;
		}

		let addForm = this.addForm.controls;

		console.log(addForm);

		let toAdd: Course = {
			id: 321412, //co tu ma byc, czy id potrzebne wgl
			name: addForm.name.value,
			ects: addForm.ects.value,
			semester: addForm.semester.value,
			type: addForm.type.value,
			studentsLimit: addForm.studentsLimit.value,
			image: (addForm.image == null || addForm.image.value == "") ?
					"https://www.wykop.pl/cdn/c3201142/comment_f67FA8qjhTKoEvTM0YbAVN4ZZbAoO5w1.jpg" : // i know, hardcoding stuff
					addForm.image.value,
			description: addForm.desc.value,
			ratings: []
		}

		console.log(toAdd);

		this.coursesService.addCourse(toAdd);

	}

	onReset(): void {
		this.submitted = false;
		this.addForm.reset();
	}
}