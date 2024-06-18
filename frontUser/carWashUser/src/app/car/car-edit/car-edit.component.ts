import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CarService } from 'src/app/services/car-service/car.service';

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
  constructor(private formBuilder: FormBuilder, private carService: CarService,private router: Router) {}

  ngOnInit(): void {
    const carData = this.carService.getCarData(); 
    this.carId = carData.id;
    this.userId = carData.user.id; 
    this.initializeForm(carData);
  }

  initializeForm(data: any): void {
    // Initialize form with existing car data
    this.carForm = this.formBuilder.group({
      make: [data.make, Validators.required],
      model: [data.model, Validators.required],
      year: [data.year, Validators.required],
      size: [data.size || this.sizes[0], Validators.required]
    });
  }

  onSubmit(): void {
    if (this.carForm.valid) {
      const updatedCarData = { ...this.carForm.value, user: { id: this.userId } }; // Merge userId back into car data
      this.carService.updateCar(this.carId, updatedCarData).subscribe(
        (response) => {
          console.log('Car data updated successfully:', response);
          this.router.navigate(['/car']);
        },
        (error) => {
          console.error('Error updating car data:', error);
          // Handle error response (e.g., display error message to the user)
        }
      );
    } else {
      console.error('Form is invalid. Please fill in all required fields.');
      // Optionally, display an error message to the user indicating that the form is invalid
    }
  }
}
