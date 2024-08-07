import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CarService } from 'src/app/services/car-service/car.service';
import { LocalStorageService } from 'src/app/services/storage-service/local-storage.service';

@Component({
  selector: 'app-car-create',
  templateUrl: './car-create.component.html',
  styleUrls: ['./car-create.component.css']
})
export class CarCreateComponent implements OnInit {

  carForm!: FormGroup;
  sizes = ['SMALL', 'MEDIUM', 'LARGE']; 
  constructor(private formBuilder: FormBuilder, private carService: CarService,private router: Router, private el: ElementRef) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.carForm = this.formBuilder.group({
      make: [null, Validators.required],
      model: [null, Validators.required],
      registrationNumber: [null, Validators.required],
      size: [null, Validators.required],
      user: { id: LocalStorageService.getUser().id  }
    });
  }
  onSubmit(): void {
    if (this.carForm.valid) {
      const carData = this.carForm.value;
      this.carService.createCar(carData).subscribe(
        (response) => {
          console.log('Car created successfully:', response);
          this.router.navigate(['/car']);
        },
        (error) => {
          console.error('Error creating car:', error);
        }
      );
    } else {
      console.error('Form is invalid. Please fill in all required fields.');
    }
  }

  focusNext(nextElementId: string) {
    const nextElement = this.el.nativeElement.querySelector(`#${nextElementId}`);
    if (nextElement) {
      nextElement.focus();
    }
  }
}
