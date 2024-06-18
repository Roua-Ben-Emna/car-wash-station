import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-verification-email',
  standalone: true,
  imports: [ ReactiveFormsModule,
    HttpClientModule,CommonModule],
  templateUrl: './verification-email.component.html',
  styleUrls: ['./verification-email.component.css']
})
export class VerificationEmailComponent implements OnInit {
    constructor() { }
  
    ngOnInit(): void {
      document.body.classList.add('hide-header-footer');
    }
    ngOnDestroy(): void {
      document.body.classList.remove('hide-header-footer');
    }
  
  }
