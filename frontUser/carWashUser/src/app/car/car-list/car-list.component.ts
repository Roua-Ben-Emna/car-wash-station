import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarService } from 'src/app/services/car-service/car.service';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit {
  cars: any[] = [];
  userId: number = 1;
  showModal = false;
  carToDelete: any;

  constructor(private carService: CarService, private router: Router) { }

  ngOnInit(): void {
    this.getAllCarsByUser();
  }

  getAllCarsByUser(): void {
    this.carService.getAllCarsByUser(this.userId).subscribe((cars) => {
      this.cars = cars;
    });
  }

  editCar(data: any): void {
    this.carService.setCarData(data); 
    this.router.navigate(['/edit-car']);
  }

  deleteCar(): void {
    if (this.carToDelete) {
      this.carService.deleteCar(this.carToDelete.id).subscribe(res => {
        console.log('Car deleted successfully.');
        this.closeModal();
        this.getAllCarsByUser(); // Reload car list without page refresh
      }, error => {
        console.error('Error deleting car:', error);
      });
    }
  }

  openModal(car: any): void {
    this.carToDelete = car;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.carToDelete = null;
  }

  addCar(): void {
    this.router.navigate(['/create-car']);
  }
}
