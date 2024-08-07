import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CarService } from 'src/app/services/car-service/car.service';
import { LocalStorageService } from 'src/app/services/storage-service/local-storage.service';

@Component({
  selector: 'app-car-edit',
  templateUrl: './car-edit.component.html',
  styleUrls: ['./car-edit.component.css']
})
export class CarEditComponent implements OnInit {
  carForm!: FormGroup;
  sizes = ['SMALL', 'MEDIUM', 'LARGE'];
  carId!: number;
  userId!: number; 
  constructor(private formBuilder: FormBuilder, private carService: CarService,private router: Router ,private el: ElementRef) {}

  ngOnInit(): void {
    const carData = this.carService.getCarData(); 
    this.carId = carData.id;
    this.userId = carData.user.id; 
    this.initializeForm(carData);
  }

  initializeForm(data: any): void {
    this.carForm = this.formBuilder.group({
      make: [data.make, Validators.required],
      model: [data.model, Validators.required],
      registrationNumber: [data.registrationNumber, Validators.required],
      size: [data.size || this.sizes[0], Validators.required]
    });
  }

  onSubmit(): void {
    if (this.carForm.valid) {
      const updatedCarData = { ...this.carForm.value, user: { id: LocalStorageService.getUser().id } }; // Merge userId back into car data
      this.carService.updateCar(this.carId, updatedCarData).subscribe(
        (response) => {
          console.log('Car data updated successfully:', response);
          this.router.navigate(['/car']);
        },
        (error) => {
          console.error('Error updating car data:', error);
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
