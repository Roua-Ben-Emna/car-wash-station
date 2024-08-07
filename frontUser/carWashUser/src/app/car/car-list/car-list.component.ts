import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarService } from 'src/app/services/car-service/car.service';
import { LocalStorageService } from 'src/app/services/storage-service/local-storage.service';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit {
  cars: any[] = [];
  showModal = false;
  carToDelete: any;
  searchTerm: string = '';
  filteredCars: any[] = [];
  noCarsFound: boolean = false;

  constructor(private carService: CarService, private router: Router) { }

  ngOnInit(): void {
    this.getAllCarsByUser();
  }

  getAllCarsByUser(): void {
    this.carService.getAllCarsByUser(LocalStorageService.getUser().id).subscribe((cars) => {
      this.cars = cars;
      this.filteredCars = [...this.cars];
      this.checkIfNoCarsFound();
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

  searchCars(): void {
    this.filteredCars = this.cars.filter((car) => {
      const makeModel = `${car.make} ${car.model}`.toLowerCase();
      return makeModel.includes(this.searchTerm.toLowerCase());
    });
    this.checkIfNoCarsFound();
  }

  checkIfNoCarsFound(): void {
    this.noCarsFound = this.filteredCars.length === 0;
  }
}
